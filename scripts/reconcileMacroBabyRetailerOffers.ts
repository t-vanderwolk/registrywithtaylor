/**
 * Reconcile imported MacroBaby catalog rows against existing catalog/canonical
 * product data so safe matches behave as retailer offers, while true new
 * products remain separate.
 *
 * Dry run is the default:
 *   npm run catalog:reconcile-macrobaby
 *   npm run catalog:reconcile-macrobaby-apply
 *
 * This script does not create compatibility rows. MacroBaby adapter products are
 * reported for review and left untouched.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { parseCarSeatModel, parseStrollerModel } from '@/lib/catalog/strollerModel';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { canonicalStrollerBrand } from '@/lib/catalog/strollerFinderRules';

const PROVIDER = 'shopify_macrobaby';
const REPORT_JSON = 'reports/macrobaby-reconciliation.json';
const REPORT_CSV = 'reports/macrobaby-reconciliation.csv';

const COLOR_WORDS = [
  'anthracite',
  'beige',
  'black',
  'blue',
  'brown',
  'caviar',
  'charcoal',
  'chestnut',
  'cream',
  'desert taupe',
  'frost',
  'graphite',
  'green',
  'grey',
  'jade',
  'jake',
  'moon black',
  'navy',
  'pink',
  'red',
  'sand',
  'sandstone',
  'savannah',
  'slate',
  'stone',
  'taupe',
  'white',
].sort((a, b) => b.length - a.length);

const VERSION_TERMS = [
  'v2',
  'v3',
  'v4',
  'next',
  'lx',
  'rx',
  'aire',
  'air',
  'max',
  'plus',
  '+',
  'duo',
  'twin',
  'mono',
];

const KNOWN_BRANDS = [
  'Baby Jogger',
  'Silver Cross',
  'Maxi-Cosi',
  'Peg Perego',
  'Orbit Baby',
  'Radio Flyer',
  'BOB Gear',
  'Baby Trend',
  'Valco Baby',
  'Guava Family',
  'Mountain Buggy',
  'UPPAbaby',
  'Bugaboo',
  'Cybex',
  'CYBEX',
  'Nuna',
  'Joolz',
  'Joie',
  'Chicco',
  'Graco',
  'Britax',
  'Bumbleride',
  'Mockingbird',
  'Mompush',
  'Thule',
  'Stokke',
  'Evenflo',
  'Veer',
  'Clek',
  'Doona',
  'Romer',
  'Ergobaby',
  'Inglesina',
  'Zoe',
  'WonderFold',
  'Larktale',
  'Colugo',
  'Mima',
  'Jeep',
  'Ingenuity',
  'Summer',
  'Diono',
  'Cosatto',
  'Babyzen',
  'Keenz',
  'egg',
].sort((a, b) => b.length - a.length);

const ACCESSORY_RE =
  /\b(adapters?|adaptors?|accessor(?:y|ies)|travel system|bundle|cup ?holder|snack tray|organizer|caddy|rain cover|rain shield|weather shield|mosquito|insect net|travel bag|carry bag|footmuff|canopy|bumper bar|belly bar|board|basket|liner|hooks?|console|toy|attachment|bassinet|second seat|sibling seat|rumble ?seat|rumbleseat|toddler seat|replacement|front wheel|rear wheel|replacement wheel|wheel set|wheel kit|spare wheel|replacement tire|tire set|tire kit|inner tube|frame only|stroller frame|storage|protection|connector|cart connector|car seat base|extra base|base only|insert|inlay|mirror|seat protector|cover|net)\b/i;

type Kind = 'stroller' | 'infant car seat' | 'adapter' | 'other';
type TargetSource = 'affiliate-catalog' | 'babylist-cache' | 'canonical-stroller' | 'canonical-carseat';

type MacroRow = {
  id: string;
  provider: string;
  externalId: string;
  brand: string | null;
  title: string;
  rawPayload: unknown;
  enrichment: {
    id: string;
    canonicalBrand: string | null;
    canonicalName: string | null;
    productType: string | null;
    reviewStatus: string;
    needsReview: boolean;
    tags: string[];
  } | null;
};

type Target = {
  source: TargetSource;
  id: string;
  provider: string | null;
  retailer: string | null;
  brand: string;
  model: string;
  title: string;
  kind: Exclude<Kind, 'adapter' | 'other'>;
  productType: string;
  strollerCategory: string | null;
  key: string;
};

type ReportRow = {
  macroBabyId: string;
  title: string;
  brand: string;
  model: string;
  productType: string | null;
  action: 'attached-offer' | 'true-new' | 'adapter-review' | 'manual-review' | 'skipped';
  matchedSource: string | null;
  matchedId: string | null;
  matchedTitle: string | null;
  reasons: string[];
};

function normalizeText(value: string | null | undefined) {
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

function detectBrand(title: string, fallback?: string | null) {
  const n = normalizeText(title);
  const fromTitle = KNOWN_BRANDS.find((brand) => n.startsWith(normalizeText(brand)));
  if (fromTitle) return canonicalBrand(fromTitle);
  return canonicalBrand(fallback);
}

function kindFromProductType(productType: string | null | undefined): Kind {
  const pt = normalizeText(productType);
  if (pt === 'stroller adapter' || pt === 'infant car seat adapter') return 'adapter';
  if (pt === 'infant car seat') return 'infant car seat';
  if (pt.includes('stroller') || pt === 'wagon') return 'stroller';
  return 'other';
}

function titleLooksLikeKind(title: string, kind: Kind) {
  if (kind === 'stroller') {
    return /\b(stroller|wagon)\b/i.test(title) && !ACCESSORY_RE.test(title);
  }
  if (kind === 'infant car seat') {
    return /\binfant car ?seat\b/i.test(title) && !/\b(base only|extra base|car seat base|convertible|booster|all.?in.?one|cover|canopy|net|mirror|insert)\b/i.test(title);
  }
  return false;
}

function isSuspectedImportedAccessory(title: string, kind: Kind) {
  if (kind === 'stroller' && /\bwith travel bag\b/i.test(title)) return false;
  return ACCESSORY_RE.test(title);
}

function inferStrollerCategory(brand: string, model: string) {
  const t = normalizeText(`${brand} ${model}`);
  if (/\bbob\b/.test(t)) {
    if (/\b(duallie|double|renegade|wagon)\b/.test(t)) return 'Double Jogging';
    return 'Jogging';
  }
  if (/\b(wonderfold|wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer)\b/.test(t)) return 'Stroller Wagon';
  if (/\b(donkey|kangaroo|vista|demi next|demi grow|e gazelle|egazelle|gazelle|wave|ypsi|agio z4|single to double|pivot xpand|city select)\b/.test(t)) return 'Single-to-Double';
  if (/\b(duallie|urban glide.*double|summit x3.*double|double jogging)\b/.test(t)) return 'Double Jogging';
  if (/\b(urban glide|bob revolution|alterrain|summit x3|guava roam|uppababy ridge|switch jog|wayfinder)\b/.test(t)) return 'Jogging';
  if (/\b(minu duo|trvl dubl|trvl double|jet double|double|duo|twin|g link|snap duo)\b/.test(t)) return 'Double';
  if (/\b(g luxe|g lite|maclaren|3d lite|umbrella)\b/.test(t)) return 'Umbrella';
  if (/\b(butterfly|trvl|minu|yoyo|aer|jet|coya|libelle|beezy|quid|metro|city tour|clic|volo|nia|breez)\b/.test(t)) return 'Travel';
  if (/\b(dragonfly|triv|dune|mios|joolz hub|swiv)\b/.test(t)) return 'Compact / Mid-Size';
  return 'Full-Size';
}

function displayStrollerCategory(productType: string | null | undefined, brand: string, model: string) {
  const mapped = strollerCategoryFromProductType(productType);
  if (mapped === 'full-size') return 'Full-Size';
  if (mapped === 'compact') return 'Compact / Mid-Size';
  if (mapped === 'travel') return 'Travel';
  if (mapped === 'jogging') return 'Jogging';
  if (mapped === 'double') return 'Double';
  if (mapped === 'double-jogging') return 'Double Jogging';
  if (mapped === 'convertible-modular' || mapped === 'convertible-non-modular') return 'Single-to-Double';
  if (mapped === 'wagon') return 'Stroller Wagon';
  if (mapped === 'umbrella') return 'Umbrella';
  return inferStrollerCategory(brand, model);
}

function modelKey(brand: string, model: string, kind: Exclude<Kind, 'adapter' | 'other'>, strollerCategory: string | null) {
  const nBrand = normalizeText(brand);
  let m = normalizeText(model)
    .replace(/\b(stroller|infant car seat|car seat|lightweight|luxury|complete|with|and|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const color of COLOR_WORDS) {
    const c = normalizeText(color);
    m = m.replace(new RegExp(`\\b${c}\\b`, 'g'), ' ');
  }
  m = m.replace(/\s+/g, ' ').trim();

  const versionMarkers = VERSION_TERMS.filter((term) => {
    if (term === '+') return model.includes('+');
    return new RegExp(`\\b${term}\\b`, 'i').test(model);
  }).sort();
  const eModel = /\be[-\s]?(priam|gazelle)\b/i.exec(model)?.[1] ?? null;
  const generation = [...model.matchAll(/\b(?:fox|donkey|vista|cruz|minu|jet|wave|reef|dune|yoyo)\s*(\d+)\b/gi)]
    .map((m2) => m2[0].toLowerCase())
    .sort();

  return [kind, nBrand, m, strollerCategory ?? '', eModel ? `e-${eModel.toLowerCase()}` : '', ...versionMarkers, ...generation]
    .filter(Boolean)
    .join('|');
}

function parseModelForKind(title: string, brand: string, kind: Kind) {
  if (kind === 'infant car seat') return parseCarSeatModel(title, brand);
  if (kind === 'stroller') return parseStrollerModel(title, brand);
  return title;
}

function targetPriority(source: TargetSource) {
  switch (source) {
    case 'affiliate-catalog':
      return 0;
    case 'babylist-cache':
      return 1;
    case 'canonical-stroller':
    case 'canonical-carseat':
      return 2;
  }
}

function mergeRawPayload(rawPayload: unknown, target: Target) {
  const base = rawPayload && typeof rawPayload === 'object' && !Array.isArray(rawPayload) ? rawPayload as Record<string, unknown> : {};
  const tmbcMacroBaby = base.tmbcMacroBaby && typeof base.tmbcMacroBaby === 'object' && !Array.isArray(base.tmbcMacroBaby)
    ? base.tmbcMacroBaby as Record<string, unknown>
    : {};
  return {
    ...base,
    tmbcMacroBaby: {
      ...tmbcMacroBaby,
      reconciliation: {
        status: 'matched-existing-retailer-offer',
        matchedSource: target.source,
        matchedId: target.id,
        matchedProvider: target.provider,
        matchedRetailer: target.retailer,
        matchedTitle: target.title,
        matchedAt: new Date().toISOString(),
      },
    },
  };
}

function csvEscape(value: unknown) {
  const s = value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeReports(rows: ReportRow[], totals: Record<string, number>) {
  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(resolve(process.cwd(), REPORT_JSON), `${JSON.stringify({ generatedAt: new Date().toISOString(), totals, rows }, null, 2)}\n`);
  const header = ['macroBabyId', 'title', 'brand', 'model', 'productType', 'action', 'matchedSource', 'matchedId', 'matchedTitle', 'reasons'];
  const lines = [
    header.join(','),
    ...rows.map((row) =>
      [
        row.macroBabyId,
        row.title,
        row.brand,
        row.model,
        row.productType,
        row.action,
        row.matchedSource,
        row.matchedId,
        row.matchedTitle,
        row.reasons.join('; '),
      ].map(csvEscape).join(','),
    ),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${lines.join('\n')}\n`);
}

async function main() {
  const apply = process.argv.includes('--apply');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = ((await import('@/lib/server/prisma')).default) as any;

  const [macroRows, affiliateRows, babylistRows, strollers, carSeats] = await Promise.all([
    db.affiliateCatalogProduct.findMany({
      where: { provider: PROVIDER, isActiveInFeed: true },
      select: {
        id: true,
        provider: true,
        externalId: true,
        brand: true,
        title: true,
        rawPayload: true,
        enrichment: {
          select: {
            id: true,
            canonicalBrand: true,
            canonicalName: true,
            productType: true,
            reviewStatus: true,
            needsReview: true,
            tags: true,
          },
        },
      },
      orderBy: [{ brand: 'asc' }, { title: 'asc' }],
    }) as Promise<MacroRow[]>,
    db.affiliateCatalogProduct.findMany({
      where: { provider: { not: PROVIDER }, isActiveInFeed: true, enrichment: { is: { reviewStatus: { not: 'HIDDEN' } } } },
      select: {
        id: true,
        provider: true,
        retailer: true,
        brand: true,
        title: true,
        enrichment: { select: { canonicalBrand: true, canonicalName: true, productType: true } },
      },
    }),
    db.babylistCatalogItem.findMany({
      select: { sku: true, name: true, manufacturer: true, url: true },
    }).catch(() => []),
    db.stroller.findMany({ select: { id: true, brand: true, model: true } }),
    db.carSeat.findMany({ where: { seatType: 'INFANT' }, select: { id: true, brand: true, model: true } }),
  ]);

  const targets: Target[] = [];

  for (const row of affiliateRows) {
    const kind = kindFromProductType(row.enrichment?.productType);
    if (kind !== 'stroller' && kind !== 'infant car seat') continue;
    const brand = kind === 'stroller'
      ? canonicalStrollerBrand(row.enrichment?.canonicalBrand ?? row.brand)
      : canonicalBrand(row.enrichment?.canonicalBrand ?? row.brand);
    const model = row.enrichment?.canonicalName || parseModelForKind(row.title, brand, kind);
    const strollerCategory = kind === 'stroller' ? displayStrollerCategory(row.enrichment?.productType, brand, model) : null;
    targets.push({
      source: 'affiliate-catalog',
      id: row.id,
      provider: row.provider,
      retailer: row.retailer,
      brand,
      model,
      title: row.title,
      kind,
      productType: row.enrichment?.productType ?? kind,
      strollerCategory,
      key: modelKey(brand, model, kind, strollerCategory),
    });
  }

  for (const item of babylistRows) {
    const brand = detectBrand(item.name, item.manufacturer);
    const strollerBrand = canonicalStrollerBrand(brand);
    const kind: Kind = titleLooksLikeKind(item.name, 'infant car seat')
      ? 'infant car seat'
      : titleLooksLikeKind(item.name, 'stroller')
        ? 'stroller'
        : 'other';
    if (kind !== 'stroller' && kind !== 'infant car seat') continue;
    const model = parseModelForKind(item.name, kind === 'stroller' ? strollerBrand : brand, kind);
    const strollerCategory = kind === 'stroller' ? inferStrollerCategory(strollerBrand, model) : null;
    targets.push({
      source: 'babylist-cache',
      id: item.sku,
      provider: 'babylist_impact',
      retailer: 'Babylist',
      brand: kind === 'stroller' ? strollerBrand : brand,
      model,
      title: item.name,
      kind,
      productType: kind === 'stroller' ? 'stroller' : 'infant car seat',
      strollerCategory,
      key: modelKey(kind === 'stroller' ? strollerBrand : brand, model, kind, strollerCategory),
    });
  }

  for (const row of strollers) {
    const brand = canonicalStrollerBrand(row.brand);
    const strollerCategory = inferStrollerCategory(brand, row.model);
    targets.push({
      source: 'canonical-stroller',
      id: row.id,
      provider: null,
      retailer: null,
      brand,
      model: row.model,
      title: `${brand} ${row.model}`,
      kind: 'stroller',
      productType: 'stroller',
      strollerCategory,
      key: modelKey(brand, row.model, 'stroller', strollerCategory),
    });
  }

  for (const row of carSeats) {
    const brand = canonicalBrand(row.brand);
    targets.push({
      source: 'canonical-carseat',
      id: row.id,
      provider: null,
      retailer: null,
      brand,
      model: row.model,
      title: `${brand} ${row.model}`,
      kind: 'infant car seat',
      productType: 'infant car seat',
      strollerCategory: null,
      key: modelKey(brand, row.model, 'infant car seat', null),
    });
  }

  const targetsByKey = new Map<string, Target[]>();
  for (const target of targets) {
    (targetsByKey.get(target.key) ?? targetsByKey.set(target.key, []).get(target.key)!).push(target);
  }

  let attached = 0;
  let trueNew = 0;
  let adapterReview = 0;
  let manualReview = 0;
  let skipped = 0;
  let updated = 0;
  const rows: ReportRow[] = [];

  async function restoreFalseAccessoryReview(enrichment: NonNullable<MacroRow['enrichment']>) {
    const tags = enrichment.tags ?? [];
    if (
      !apply ||
      enrichment.reviewStatus !== 'HIDDEN' ||
      !tags.includes('macrobaby-reconciliation-review') ||
      !tags.includes('suspected-accessory')
    ) {
      return;
    }

    await db.productEnrichment.update({
      where: { id: enrichment.id },
      data: {
        needsReview: false,
        reviewStatus: 'AUTO_CATEGORIZED',
        tags: tags.filter((tag) => tag !== 'macrobaby-reconciliation-review' && tag !== 'suspected-accessory'),
      },
    });
    updated += 1;
  }

  for (const macro of macroRows) {
    const enrichment = macro.enrichment;
    if (!enrichment) {
      skipped += 1;
      rows.push({
        macroBabyId: macro.id,
        title: macro.title,
        brand: macro.brand ?? '',
        model: '',
        productType: null,
        action: 'skipped',
        matchedSource: null,
        matchedId: null,
        matchedTitle: null,
        reasons: ['missing enrichment'],
      });
      continue;
    }

    const kind = kindFromProductType(enrichment.productType);
    const brand = kind === 'stroller'
      ? canonicalStrollerBrand(enrichment.canonicalBrand ?? macro.brand)
      : canonicalBrand(enrichment.canonicalBrand ?? macro.brand);
    const model = enrichment.canonicalName || parseModelForKind(macro.title, brand, kind);

    if (kind === 'adapter') {
      adapterReview += 1;
      rows.push({
        macroBabyId: macro.id,
        title: macro.title,
        brand,
        model,
        productType: enrichment.productType,
        action: 'adapter-review',
        matchedSource: null,
        matchedId: null,
        matchedTitle: null,
        reasons: ['adapter product retained; compatibility rows are not auto-applied'],
      });
      continue;
    }

    if (kind !== 'stroller' && kind !== 'infant car seat') {
      skipped += 1;
      rows.push({
        macroBabyId: macro.id,
        title: macro.title,
        brand,
        model,
        productType: enrichment.productType,
        action: 'skipped',
        matchedSource: null,
        matchedId: null,
        matchedTitle: null,
        reasons: ['not a stroller, infant car seat, or adapter'],
      });
      continue;
    }

    if (isSuspectedImportedAccessory(macro.title, kind)) {
      manualReview += 1;
      rows.push({
        macroBabyId: macro.id,
        title: macro.title,
        brand,
        model,
        productType: enrichment.productType,
        action: 'manual-review',
        matchedSource: null,
        matchedId: null,
        matchedTitle: null,
        reasons: ['suspected accessory or bundle; not attached as a retailer offer'],
      });
      if (apply && enrichment.reviewStatus !== 'REVIEWED' && enrichment.reviewStatus !== 'HIDDEN') {
        const tags = [
          ...new Set([...(enrichment.tags ?? []), 'macrobaby-reconciliation-review', 'suspected-accessory']),
        ];
        await db.productEnrichment.update({
          where: { id: enrichment.id },
          data: {
            needsReview: true,
            reviewStatus: 'HIDDEN',
            tags,
          },
        });
        updated += 1;
      }
      continue;
    }

    await restoreFalseAccessoryReview(enrichment);

    const strollerCategory = kind === 'stroller' ? displayStrollerCategory(enrichment.productType, brand, model) : null;
    const key = modelKey(brand, model, kind, strollerCategory);
    const matches = (targetsByKey.get(key) ?? []).sort((a, b) => targetPriority(a.source) - targetPriority(b.source));
    const safeTarget = matches[0] ?? null;

    if (!safeTarget) {
      trueNew += 1;
      rows.push({
        macroBabyId: macro.id,
        title: macro.title,
        brand,
        model,
        productType: enrichment.productType,
        action: 'true-new',
        matchedSource: null,
        matchedId: null,
        matchedTitle: null,
        reasons: ['no conservative existing-product match'],
      });
      continue;
    }

    if (matches.some((m) => m.model !== safeTarget.model || m.brand !== safeTarget.brand || m.kind !== safeTarget.kind)) {
      manualReview += 1;
      rows.push({
        macroBabyId: macro.id,
        title: macro.title,
        brand,
        model,
        productType: enrichment.productType,
        action: 'manual-review',
        matchedSource: safeTarget.source,
        matchedId: safeTarget.id,
        matchedTitle: safeTarget.title,
        reasons: ['conflicting conservative matches found'],
      });
      continue;
    }

    attached += 1;
    rows.push({
      macroBabyId: macro.id,
      title: macro.title,
      brand,
      model,
      productType: enrichment.productType,
      action: 'attached-offer',
      matchedSource: safeTarget.source,
      matchedId: safeTarget.id,
      matchedTitle: safeTarget.title,
      reasons: [`matched ${safeTarget.source}`],
    });

    if (apply && enrichment.reviewStatus !== 'REVIEWED' && enrichment.reviewStatus !== 'HIDDEN') {
      const tags = [
        ...new Set([
          ...(enrichment.tags ?? []),
          'macrobaby-reconciled',
          'retailer-offer',
          `matched-${safeTarget.source}`,
        ]),
      ];
      await db.productEnrichment.update({
        where: { id: enrichment.id },
        data: {
          canonicalBrand: safeTarget.brand,
          canonicalName: safeTarget.model,
          needsReview: false,
          tags,
        },
      });
      await db.affiliateCatalogProduct.update({
        where: { id: macro.id },
        data: { rawPayload: mergeRawPayload(macro.rawPayload, safeTarget) },
      });
      updated += 1;
    }
  }

  const totals = {
    macroBabyRows: macroRows.length,
    attachedOffers: attached,
    trueNewProducts: trueNew,
    adapterReviewItems: adapterReview,
    manualReviewItems: manualReview,
    skipped,
    updated,
    targetAffiliateRows: affiliateRows.length,
    targetBabylistCacheRows: babylistRows.length,
    targetCanonicalStrollers: strollers.length,
    targetCanonicalCarSeats: carSeats.length,
  };
  writeReports(rows, totals);

  console.log('── MacroBaby post-import reconciliation ──');
  console.log(`  mode: ${apply ? 'apply' : 'dry run'}`);
  console.log(`  MacroBaby rows:             ${totals.macroBabyRows}`);
  console.log(`  attached as retailer offer: ${totals.attachedOffers}`);
  console.log(`  true new products:          ${totals.trueNewProducts}`);
  console.log(`  adapters kept for review:   ${totals.adapterReviewItems}`);
  console.log(`  manual review:              ${totals.manualReviewItems}`);
  console.log(`  skipped:                    ${totals.skipped}`);
  console.log(`  updated:                    ${totals.updated}`);
  console.log(`  reports:                    ${REPORT_JSON}, ${REPORT_CSV}`);
  console.log('\n  match targets available:');
  console.log(`    affiliate catalog rows:   ${totals.targetAffiliateRows}`);
  console.log(`    Babylist cache rows:      ${totals.targetBabylistCacheRows}`);
  console.log(`    canonical strollers:      ${totals.targetCanonicalStrollers}`);
  console.log(`    canonical infant seats:   ${totals.targetCanonicalCarSeats}`);

  await db.$disconnect?.();
}

main().catch((error) => {
  console.error('[reconcileMacroBabyRetailerOffers] failed:', error);
  process.exit(1);
});
