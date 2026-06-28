/**
 * Audits the public stroller finder's "By type" buckets for likely
 * miscategorized products.
 *
 *   npm run catalog:audit-stroller-finder-types
 *   npm run catalog:audit-stroller-finder-types -- --apply
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import prismaBase from '@/lib/server/prisma';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import {
  canonicalStrollerBrand,
  isExcludedStrollerFinderProduct,
} from '@/lib/catalog/strollerFinderRules';
import { hasPublicCoreRetailer, isGoodBuyGearOffer } from '@/lib/catalog/publicRetailerVisibility';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PROVIDER_ANB = 'awin_anbbaby';
const PROVIDER_BABYLIST = 'babylist_impact';
const PROVIDER_MACROBABY = 'shopify_macrobaby';

const CATEGORY_ORDER: StrollerCategory[] = [
  'full-size',
  'full-size-non-modular',
  'compact',
  'travel',
  'convertible-modular',
  'convertible-non-modular',
  'double',
  'double-jogging',
  'jogging',
  'umbrella',
  'wagon',
];

type CatalogProductRow = {
  id: string;
  provider: string;
  retailer: string | null;
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  productUrl: string | null;
  affiliateUrl: string | null;
  itemGroupId: string | null;
  enrichment: {
    id: string;
    productType: string | null;
    canonicalBrand: string | null;
    canonicalName: string | null;
    reviewStatus: string;
    needsReview: boolean;
    tags: string[];
  } | null;
};

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
  image: string | null;
};

type FinderGroup = {
  key: string;
  category: StrollerCategory;
  brand: string;
  model: string;
  babylist: Offer | null;
  macrobaby: Offer | null;
  anb: Offer | null;
  gbg: Offer | null;
  rows: Offer[];
};

type Inference = {
  expectedCategory: StrollerCategory | null;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
};

type FlaggedProduct = {
  brand: string;
  model: string;
  displayedCategory: StrollerCategory;
  displayedLabel: string;
  expectedCategory: StrollerCategory;
  expectedLabel: string;
  confidence: 'high' | 'medium' | 'low';
  primarySource: string;
  primaryTitle: string;
  rowIds: string[];
  enrichmentIds: string[];
  mismatchedRowIds: string[];
  mismatchedEnrichmentIds: string[];
  reasons: string[];
  productTypes: Array<{ provider: string; productType: string | null; title: string }>;
};

const args = {
  apply: process.argv.includes('--apply'),
};

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(stroller|travel system|adapter|accessory|bassinet|seat pack|second seat|snack tray|cup holder)\b/i.test(v)) return null;
  if (/[,(]/.test(v)) return null;
  return v;
}

function normalize(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function categoryLabel(category: StrollerCategory) {
  return STROLLER_CATEGORY_LABELS[category] ?? category;
}

function isSameCategory(left: StrollerCategory, right: StrollerCategory) {
  if (left === right) return true;
  if (
    (left === 'convertible-modular' || left === 'convertible-non-modular') &&
    (right === 'convertible-modular' || right === 'convertible-non-modular')
  ) {
    return true;
  }
  if (
    (left === 'full-size' || left === 'full-size-non-modular') &&
    (right === 'full-size' || right === 'full-size-non-modular')
  ) {
    return true;
  }
  return false;
}

function inferExpectedCategory(brand: string, model: string, titles: string[]): Inference {
  const text = normalize([brand, model, ...titles].join(' '));
  const reasons: string[] = [];
  const has = (re: RegExp, reason: string) => {
    const matched = re.test(text);
    if (matched) reasons.push(reason);
    return matched;
  };

  if (has(/\bbob\b/, 'BOB stroller line is jogging/double-jogging')) {
    if (has(/\b(duallie|double|renegade|wagon)\b/, 'BOB double/wagon wording')) {
      return { expectedCategory: 'double-jogging', confidence: 'high', reasons };
    }
    return { expectedCategory: 'jogging', confidence: 'high', reasons };
  }

  if (has(/\b(duallie|double jogging|jogging stroller double|urban glide\s*\d*\s*double|summit x3 double|alterrain duallie)\b/, 'double jogging model language')) {
    return { expectedCategory: 'double-jogging', confidence: 'high', reasons };
  }
  if (has(/\b(urban glide|summit x3|guava roam|uppababy ridge|switch and jog|switch jog|alterrain|revolution flex|wayfinder|rambler)\b/, 'jogging/all-terrain model language')) {
    return { expectedCategory: 'jogging', confidence: 'high', reasons };
  }

  if (has(/\b(wonderfold|stroller wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer|caravan wagon)\b/, 'stroller wagon model language')) {
    return { expectedCategory: 'wagon', confidence: 'high', reasons };
  }

  if (has(/\b(donkey|kangaroo stroller|vista|demi next|demi grow|e gazelle|egazelle|gazelle|wave|ypsi|agio z4|mockingbird single to double|pivot xpand|city select|ready2grow)\b/, 'single-to-double/modular model language')) {
    return { expectedCategory: 'convertible-modular', confidence: 'high', reasons };
  }

  if (has(/\b(minu duo|trvl dubl|trvl double|jet double|city mini gt2 double|city mini double|snap duo|zoe twin|g link|g-link|side by side|twin stroller)\b/, 'standard double stroller model language')) {
    return { expectedCategory: 'double', confidence: 'high', reasons };
  }

  if (has(/\b(g luxe|g-luxe|g lite|g-lite|maclaren|3d lite|liteway|umbrella stroller)\b/, 'umbrella stroller model language')) {
    return { expectedCategory: 'umbrella', confidence: 'high', reasons };
  }

  if (has(/\b(butterfly|trvl(?! dubl| double)|minu(?! duo)|yoyo|yoyo3|yoyo 3|aer\+?|aer2|jet(?! double)|coya|libelle|beezy|quid|quid3|metro\+?|city tour|pockit|gb qbit|qbit|clic|volo|dot|nia|breez)\b/, 'travel stroller model language')) {
    return { expectedCategory: 'travel', confidence: 'high', reasons };
  }

  if (has(/\b(dragonfly|triv|dune|mios|joolz hub|swiv|electa|city mini gt3|city mini air)\b/, 'compact/mid-size model language')) {
    return { expectedCategory: 'compact', confidence: 'high', reasons };
  }

  return { expectedCategory: null, confidence: 'low', reasons: [] };
}

function offerIsCheaper(next: Offer, current: Offer | null) {
  return !current || (next.price != null && (current.price == null || next.price < current.price));
}

function findPrimaryOffer(group: FinderGroup) {
  if (group.babylist && hasPublicCoreRetailer(group.babylist)) return group.babylist;
  if (group.macrobaby && hasPublicCoreRetailer(group.macrobaby)) return group.macrobaby;
  return null;
}

async function loadFinderGroups() {
  const rows: CatalogProductRow[] = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      enrichment: {
        is: {
          tmbcCategory: 'Strollers',
          needsReview: false,
          reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
        },
      },
    },
    select: {
      id: true,
      provider: true,
      retailer: true,
      brand: true,
      title: true,
      price: true,
      imageUrl: true,
      productUrl: true,
      affiliateUrl: true,
      itemGroupId: true,
      enrichment: {
        select: {
          id: true,
          productType: true,
          canonicalBrand: true,
          canonicalName: true,
          reviewStatus: true,
          needsReview: true,
          tags: true,
        },
      },
    },
    orderBy: { title: 'asc' },
  });

  const groups = new Map<string, FinderGroup>();
  const seenGroups = new Set<string>();

  for (const row of rows) {
    const category = strollerCategoryFromProductType(row.enrichment?.productType);
    if (!category) continue;
    if (isExcludedStrollerFinderProduct({
      brand: row.brand,
      title: row.title,
      productUrl: row.productUrl,
      affiliateUrl: row.affiliateUrl,
    })) continue;
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
      group = { key, category, brand, model, babylist: null, macrobaby: null, anb: null, gbg: null, rows: [] };
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
      image: row.imageUrl,
    };
    group.rows.push(offer);

    const isGoodBuyGear = isGoodBuyGearOffer({
      provider: row.provider,
      retailer: row.retailer,
      url: row.affiliateUrl,
      productUrl: row.productUrl,
    });

    if (isGoodBuyGear) {
      if (offerIsCheaper(offer, group.gbg)) group.gbg = offer;
    } else if (row.provider === PROVIDER_BABYLIST) {
      if (!group.babylist) {
        group.babylist = offer;
        group.category = category;
      }
    } else if (row.provider === PROVIDER_MACROBABY) {
      if (offerIsCheaper(offer, group.macrobaby)) group.macrobaby = offer;
    } else if (row.provider === PROVIDER_ANB) {
      if (offerIsCheaper(offer, group.anb)) group.anb = offer;
    }
  }

  return [...groups.values()].filter((group) => {
    const primary = findPrimaryOffer(group);
    if (!primary) return false;
    return hasPublicCoreRetailer(primary);
  });
}

function buildFlag(group: FinderGroup): FlaggedProduct | null {
  const primary = findPrimaryOffer(group);
  if (!primary) return null;

  const inference = inferExpectedCategory(group.brand, group.model, group.rows.map((row) => row.title));
  if (!inference.expectedCategory || isSameCategory(group.category, inference.expectedCategory)) return null;
  const expectedCategory = inference.expectedCategory;
  const mismatchedRows = group.rows.filter((row) => !isSameCategory(row.category, expectedCategory));

  return {
    brand: group.brand,
    model: group.model,
    displayedCategory: group.category,
    displayedLabel: categoryLabel(group.category),
    expectedCategory,
    expectedLabel: categoryLabel(expectedCategory),
    confidence: inference.confidence,
    primarySource: primary.provider,
    primaryTitle: primary.title,
    rowIds: group.rows.map((row) => row.rowId),
    enrichmentIds: group.rows.map((row) => row.enrichmentId).filter((id): id is string => Boolean(id)),
    mismatchedRowIds: mismatchedRows.map((row) => row.rowId),
    mismatchedEnrichmentIds: mismatchedRows
      .map((row) => row.enrichmentId)
      .filter((id): id is string => Boolean(id)),
    reasons: inference.reasons,
    productTypes: group.rows.map((row) => ({
      provider: row.provider,
      productType: row.productType,
      title: row.title,
    })),
  };
}

async function applyReviewFlags(flags: FlaggedProduct[]) {
  const ids = [...new Set(flags.flatMap((flag) => flag.mismatchedEnrichmentIds))];
  if (ids.length === 0) return 0;

  const rows: Array<{ id: string; reviewStatus: string; tags: string[]; internalNotes: string | null }> =
    await db.productEnrichment.findMany({
      where: { id: { in: ids } },
      select: { id: true, reviewStatus: true, tags: true, internalNotes: true },
    });

  let updated = 0;
  for (const row of rows) {
    if (row.reviewStatus === 'REVIEWED' || row.reviewStatus === 'HIDDEN') continue;
    const tags = [
      ...new Set([
        ...row.tags,
        'stroller-finder-type-audit',
        'probable-miscategorized-stroller',
      ]),
    ];
    const note = 'Flagged by stroller finder type audit: displayed bucket differs from conservative model/title inference.';
    await db.productEnrichment.update({
      where: { id: row.id },
      data: {
        needsReview: true,
        reviewStatus: 'NEEDS_REVIEW',
        tags,
        internalNotes: row.internalNotes?.includes(note)
          ? row.internalNotes
          : [row.internalNotes, note].filter(Boolean).join('\n'),
      },
    });
    updated += 1;
  }
  return updated;
}

function toCsvValue(value: unknown) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(rows: FlaggedProduct[]) {
  const headers = [
    'brand',
    'model',
    'displayed_label',
    'expected_label',
    'confidence',
    'primary_source',
    'primary_title',
    'reasons',
    'row_ids',
    'enrichment_ids',
    'mismatched_row_ids',
    'mismatched_enrichment_ids',
  ];
  const lines = rows.map((row) =>
    [
      row.brand,
      row.model,
      row.displayedLabel,
      row.expectedLabel,
      row.confidence,
      row.primarySource,
      row.primaryTitle,
      row.reasons,
      row.rowIds,
      row.enrichmentIds,
      row.mismatchedRowIds,
      row.mismatchedEnrichmentIds,
    ]
      .map(toCsvValue)
      .join(','),
  );
  return [headers.join(','), ...lines].join('\n');
}

async function main() {
  const groups = await loadFinderGroups();
  const flags = groups
    .map(buildFlag)
    .filter((flag): flag is FlaggedProduct => Boolean(flag))
    .sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a.displayedCategory) - CATEGORY_ORDER.indexOf(b.displayedCategory) ||
        a.brand.localeCompare(b.brand) ||
        a.model.localeCompare(b.model),
    );

  const counts = new Map<StrollerCategory, number>();
  for (const group of groups) counts.set(group.category, (counts.get(group.category) ?? 0) + 1);

  const byDisplayedCategory = flags.reduce<Record<string, FlaggedProduct[]>>((acc, flag) => {
    const key = flag.displayedLabel;
    acc[key] = acc[key] ?? [];
    acc[key].push(flag);
    return acc;
  }, {});

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'stroller-finder-by-type',
    scannedVisibleProducts: groups.length,
    categoryCounts: [...counts.entries()]
      .sort((a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]))
      .map(([category, count]) => ({ category, label: categoryLabel(category), count })),
    flaggedCount: flags.length,
    byDisplayedCategory,
    flags,
  };

  await fs.mkdir(path.join(process.cwd(), 'reports'), { recursive: true });
  const jsonPath = path.join(process.cwd(), 'reports/stroller-finder-type-audit.json');
  const csvPath = path.join(process.cwd(), 'reports/stroller-finder-type-audit.csv');
  await fs.writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(csvPath, `${buildCsv(flags)}\n`);
  const appliedReviewFlags = args.apply ? await applyReviewFlags(flags) : 0;

  console.log('── Stroller finder type audit ──');
  console.log(`  visible products scanned: ${groups.length}`);
  for (const entry of report.categoryCounts) {
    console.log(`  ${String(entry.count).padStart(4)}  ${entry.label}`);
  }
  console.log(`\n  probable miscategorized products: ${flags.length}`);
  if (args.apply) console.log(`  review flags written: ${appliedReviewFlags}`);
  for (const flag of flags) {
    console.log(
      `    - ${flag.brand} ${flag.model}: ${flag.displayedLabel} → ${flag.expectedLabel} (${flag.confidence}; ${flag.primarySource})`,
    );
    console.log(`      ${flag.primaryTitle}`);
    console.log(`      ${flag.reasons.join('; ')}`);
    console.log(`      mismatched rows: ${flag.mismatchedRowIds.join(', ') || 'none'}`);
  }
  console.log(`\n  wrote ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`  wrote ${path.relative(process.cwd(), csvPath)}`);
}

main()
  .catch((error) => {
    console.error('[auditStrollerFinderTypeBuckets] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
