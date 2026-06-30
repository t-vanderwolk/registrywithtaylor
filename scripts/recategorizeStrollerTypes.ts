/**
 * Scan a stroller-finder "By type" bucket and RECATEGORIZE the products that are
 * confidently in the wrong place — by rewriting enrichment.productType so they
 * move to the correct bucket (unlike the audit, which only flags for review).
 *
 * Conservative: only HIGH-confidence model/title inferences move; everything
 * ambiguous is listed and left untouched. Always dry-run first and read the scan.
 *
 *   # scan + recategorize the Full-Size bucket
 *   npm run catalog:recategorize-types -- --category full-size
 *   npm run catalog:recategorize-types -- --category full-size --apply
 *
 *   # omit --category to scan every bucket
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npm run catalog:recategorize-types -- --category full-size --apply
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import prismaBase from '@/lib/server/prisma';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { canonicalStrollerBrand, isExcludedStrollerFinderProduct } from '@/lib/catalog/strollerFinderRules';
import { hasPublicCoreRetailer, isGoodBuyGearOffer } from '@/lib/catalog/publicRetailerVisibility';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';
import { inferStrollerCategory, categoryToProductType } from '@/lib/catalog/strollerTypeInference';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PROVIDER_BABYLIST = 'babylist_impact';
const PROVIDER_MACROBABY = 'shopify_macrobaby';
const PROVIDER_ANB = 'awin_anbbaby';

type Offer = {
  rowId: string;
  enrichmentId: string | null;
  provider: string;
  retailer: string | null;
  title: string;
  productType: string | null;
  category: StrollerCategory;
  price: number | null;
  url: string | null;
};

type FinderGroup = {
  key: string;
  category: StrollerCategory;
  brand: string;
  model: string;
  babylist: Offer | null;
  macrobaby: Offer | null;
  rows: Offer[];
};

const args = {
  apply: process.argv.includes('--apply'),
  category: ((): StrollerCategory | null => {
    const i = process.argv.indexOf('--category');
    return i >= 0 ? (process.argv[i + 1] as StrollerCategory) : null;
  })(),
};

function categoryLabel(category: StrollerCategory) {
  return STROLLER_CATEGORY_LABELS[category] ?? category;
}

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(stroller|travel system|adapter|accessory|bassinet|seat pack|second seat|snack tray|cup holder)\b/i.test(v)) return null;
  if (/[,(]/.test(v)) return null;
  return v;
}

function isSameCategory(left: StrollerCategory, right: StrollerCategory) {
  if (left === right) return true;
  const fullSize = new Set<StrollerCategory>(['full-size', 'full-size-non-modular']);
  const convertible = new Set<StrollerCategory>(['convertible-modular', 'convertible-non-modular']);
  if (fullSize.has(left) && fullSize.has(right)) return true;
  if (convertible.has(left) && convertible.has(right)) return true;
  return false;
}

function offerIsCheaper(next: Offer, current: Offer | null) {
  return !current || (next.price != null && (current.price == null || next.price < current.price));
}

function findPrimaryOffer(group: FinderGroup) {
  if (group.babylist && hasPublicCoreRetailer(group.babylist)) return group.babylist;
  if (group.macrobaby && hasPublicCoreRetailer(group.macrobaby)) return group.macrobaby;
  return null;
}

async function loadFinderGroups(): Promise<FinderGroup[]> {
  const rows = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      enrichment: { is: { tmbcCategory: 'Strollers', needsReview: false, reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] } } },
    },
    select: {
      id: true,
      provider: true,
      retailer: true,
      brand: true,
      title: true,
      price: true,
      productUrl: true,
      affiliateUrl: true,
      itemGroupId: true,
      enrichment: { select: { id: true, productType: true, canonicalBrand: true, canonicalName: true } },
    },
    orderBy: { title: 'asc' },
  });

  const groups = new Map<string, FinderGroup>();
  const seenGroups = new Set<string>();

  for (const row of rows) {
    const category = strollerCategoryFromProductType(row.enrichment?.productType);
    if (!category) continue;
    if (isExcludedStrollerFinderProduct({ brand: row.brand, title: row.title, productUrl: row.productUrl, affiliateUrl: row.affiliateUrl })) continue;
    if (row.itemGroupId) {
      const groupIdKey = `${row.provider}:${row.itemGroupId}`;
      if (seenGroups.has(groupIdKey)) continue;
      seenGroups.add(groupIdKey);
    }

    const rawBrand = (row.enrichment?.canonicalBrand || row.brand || '').trim();
    const brand = canonicalStrollerBrand(rawBrand);
    const model = modelLikeCanonicalName(row.enrichment?.canonicalName) ?? parseStrollerModel(row.title, rawBrand || brand);
    const key = productModelKey(brand, model || row.title);

    let group = groups.get(key);
    if (!group) {
      group = { key, category, brand, model, babylist: null, macrobaby: null, rows: [] };
      groups.set(key, group);
    }

    const offer: Offer = {
      rowId: row.id,
      enrichmentId: row.enrichment?.id ?? null,
      provider: row.provider,
      retailer: row.retailer,
      title: row.title,
      productType: row.enrichment?.productType ?? null,
      category,
      price: row.price,
      url: row.affiliateUrl,
    };
    group.rows.push(offer);

    const isGbg = isGoodBuyGearOffer({ provider: row.provider, retailer: row.retailer, url: row.affiliateUrl, productUrl: row.productUrl });
    if (isGbg) continue;
    if (row.provider === PROVIDER_BABYLIST) {
      if (!group.babylist) { group.babylist = offer; group.category = category; }
    } else if (row.provider === PROVIDER_MACROBABY) {
      if (offerIsCheaper(offer, group.macrobaby)) group.macrobaby = offer;
    } else if (row.provider === PROVIDER_ANB) {
      // kept for parity; ANB never overrides the displayed category
    }
  }

  return [...groups.values()].filter((group) => {
    const primary = findPrimaryOffer(group);
    return Boolean(primary) && hasPublicCoreRetailer(primary as Offer);
  });
}

type ScanRow = {
  brand: string;
  model: string;
  displayedLabel: string;
  action: 'move' | 'keep';
  toLabel: string | null;
  newProductType: string | null;
  confidence: string;
  reasons: string[];
  enrichmentIds: string[];
  primaryTitle: string;
};

async function main() {
  const groups = await loadFinderGroups();
  const inScope = args.category
    ? groups.filter((g) => isSameCategory(g.category, args.category as StrollerCategory))
    : groups;

  const scan: ScanRow[] = [];
  for (const group of groups) {
    if (args.category && !isSameCategory(group.category, args.category)) continue;
    const titles = group.rows.map((r) => r.title);
    const inf = inferStrollerCategory(group.brand, group.model, titles);
    const primary = findPrimaryOffer(group);
    const enrichmentIds = [...new Set(group.rows.map((r) => r.enrichmentId).filter((id): id is string => Boolean(id)))];

    if (inf.expectedCategory && !isSameCategory(group.category, inf.expectedCategory) && inf.confidence === 'high') {
      const newProductType = categoryToProductType(inf.expectedCategory);
      scan.push({
        brand: group.brand,
        model: group.model,
        displayedLabel: categoryLabel(group.category),
        action: newProductType ? 'move' : 'keep',
        toLabel: categoryLabel(inf.expectedCategory),
        newProductType,
        confidence: inf.confidence,
        reasons: inf.reasons,
        enrichmentIds,
        primaryTitle: primary?.title ?? group.rows[0]?.title ?? '',
      });
    } else {
      scan.push({
        brand: group.brand,
        model: group.model,
        displayedLabel: categoryLabel(group.category),
        action: 'keep',
        toLabel: null,
        newProductType: null,
        confidence: inf.confidence,
        reasons: inf.reasons,
        enrichmentIds,
        primaryTitle: primary?.title ?? group.rows[0]?.title ?? '',
      });
    }
  }

  const moves = scan.filter((s) => s.action === 'move' && s.newProductType);
  let updatedRows = 0;
  if (args.apply) {
    for (const m of moves) {
      const res = await db.productEnrichment.updateMany({
        where: { id: { in: m.enrichmentIds } },
        data: { productType: m.newProductType },
      });
      updatedRows += res.count;
    }
  }

  // Reports
  await fs.mkdir(path.join(process.cwd(), 'reports'), { recursive: true });
  const csv = [
    ['brand', 'model', 'displayed', 'action', 'move_to', 'new_product_type', 'reasons', 'primary_title'].join(','),
    ...scan.map((s) =>
      [s.brand, s.model, s.displayedLabel, s.action, s.toLabel ?? '', s.newProductType ?? '', s.reasons.join('; '), s.primaryTitle]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n');
  await fs.writeFile(path.join(process.cwd(), 'reports/stroller-recategorize.csv'), `${csv}\n`);

  console.log('── Recategorize stroller types ──');
  console.log(`  mode: ${args.apply ? 'APPLY' : 'dry-run'}`);
  console.log(`  scope: ${args.category ? categoryLabel(args.category) : 'ALL buckets'}  (${inScope.length} products)`);
  console.log(`  proposed moves: ${moves.length}`);
  if (args.apply) console.log(`  enrichment rows updated: ${updatedRows}`);
  console.log('');
  for (const m of moves) {
    console.log(`  MOVE  ${m.brand} ${m.model}: ${m.displayedLabel} → ${m.toLabel}`);
    console.log(`        ${m.primaryTitle}`);
    console.log(`        ${m.reasons.join('; ')}`);
  }
  const kept = scan.filter((s) => s.action === 'keep');
  console.log(`\n  kept in place: ${kept.length}`);
  for (const k of kept) console.log(`    keep  ${k.brand} ${k.model}  (${k.displayedLabel})`);
  console.log(`\n  wrote reports/stroller-recategorize.csv`);
  if (!args.apply && moves.length) console.log('  (dry run — re-run with --apply to move them.)');
}

main()
  .catch((error) => {
    console.error('[recategorizeStrollerTypes] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
