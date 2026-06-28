/**
 * Read-only audit for MacroBaby-only public catalog candidates.
 *
 *   npx tsx scripts/auditMacroBabyOnlyPublicCandidates.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import prisma from '@/lib/server/prisma';
import { GET as getCarSeatCatalog } from '@/app/api/catalog/carseats/route';
import { GET as getStrollerCatalog } from '@/app/api/catalog/strollers/route';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseCarSeatModel, parseStrollerModel } from '@/lib/catalog/strollerModel';
import { canonicalStrollerBrand, isExcludedStrollerFinderProduct } from '@/lib/catalog/strollerFinderRules';

const PROVIDER_BABYLIST = 'babylist_impact';
const PROVIDER_MACROBABY = 'shopify_macrobaby';
const REPORT_JSON = 'reports/macrobaby-only-public-candidates.json';
const REPORT_CSV = 'reports/macrobaby-only-public-candidates.csv';

type Area = 'stroller' | 'infant-car-seat' | 'adapter' | 'other';
type PublicArea = 'stroller' | 'carSeat';

type CatalogProductRow = {
  id: string;
  provider: string;
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  productUrl: string | null;
  affiliateUrl: string | null;
  retailer: string | null;
  itemGroupId: string | null;
  enrichment: {
    canonicalBrand: string | null;
    canonicalName: string | null;
    tmbcCategory: string | null;
    productType: string | null;
    reviewStatus: string | null;
    needsReview: boolean | null;
    tags: string[];
  } | null;
};

type PublicProduct = {
  area: PublicArea;
  brand: string;
  category: string;
  name: string;
  model: string;
  source?: string | null;
  retailers?: {
    babylist?: { price: number | null; url: string | null } | null;
    macrobaby?: { price: number | null; url: string | null } | null;
  } | null;
};

type MacroBabyOnlyGroup = {
  key: string;
  area: Area;
  brand: string;
  model: string;
  category: string | null;
  productType: string | null;
  title: string;
  url: string | null;
  price: number | null;
  imageUrl: string | null;
  reviewStatus: string | null;
  needsReview: boolean | null;
  tags: string[];
  rowIds: string[];
  currentPublic: boolean;
  proposedPublic: boolean;
  reason: string;
};

function normalize(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/&/g, ' and ')
    .replace(/\b(?:stroller|infant car seat|car seat|lightweight|luxury)\b/g, ' ')
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value: string | null | undefined) {
  return normalize(value).replace(/[^a-z0-9+]/g, '');
}

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/[,(]/.test(v)) return null;
  if (/\b(adapter|accessory|base|bundle|travel system|cover|tray|bag|organizer|replacement)\b/i.test(v)) return null;
  return v;
}

function adapterModel(row: CatalogProductRow) {
  const canonical = modelLikeCanonicalName(row.enrichment?.canonicalName);
  if (canonical) return canonical;
  return row.title
    .replace(/\s*[,(].*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function inferArea(row: CatalogProductRow): Area {
  const type = row.enrichment?.productType?.toLowerCase().trim() ?? '';
  const category = row.enrichment?.tmbcCategory?.toLowerCase().trim() ?? '';
  if (category === 'strollers' && strollerCategoryFromProductType(type)) return 'stroller';
  if (type === 'infant car seat') return 'infant-car-seat';
  if (category === 'travel systems & adapters' && /\badapter\b/.test(type)) return 'adapter';
  return 'other';
}

function brandForArea(row: CatalogProductRow, area: Area) {
  const brand = row.enrichment?.canonicalBrand ?? row.brand;
  return area === 'stroller' ? canonicalStrollerBrand(brand) : canonicalBrand(brand);
}

function modelForArea(row: CatalogProductRow, area: Area, brand: string) {
  const canonical = modelLikeCanonicalName(row.enrichment?.canonicalName);
  if (canonical) return canonical;
  if (area === 'stroller') return parseStrollerModel(row.title, brand);
  if (area === 'infant-car-seat') return parseCarSeatModel(row.title, brand);
  if (area === 'adapter') return adapterModel(row);
  return row.title.replace(/\s*[,(].*$/, '').trim();
}

function groupKey(area: Area, brand: string, model: string, category: string | null, productType: string | null) {
  const typeKey = area === 'stroller' ? category : productType;
  return [area, compact(brand), compact(model), compact(typeKey)].join('|');
}

function publicMatchKey(area: Area, brand: string, model: string) {
  return [area, compact(brand), compact(model)].join('|');
}

function publicKey(product: PublicProduct) {
  const area: Area = product.area === 'stroller' ? 'stroller' : 'infant-car-seat';
  return publicMatchKey(area, product.brand, product.model || product.name);
}

function rowIsManualReview(row: CatalogProductRow) {
  return Boolean(row.enrichment?.needsReview || row.enrichment?.reviewStatus === 'NEEDS_REVIEW');
}

function rowIsHidden(row: CatalogProductRow) {
  return row.enrichment?.reviewStatus === 'HIDDEN';
}

function isSuspectedAccessoryBundleOrTravelSystem(row: CatalogProductRow) {
  const value = [
    row.title,
    row.enrichment?.productType,
    row.enrichment?.tmbcCategory,
  ].filter(Boolean).join(' ');
  return /\b(travel system|accessor(?:y|ies)|bundle|registry set|replacement|cup holder|snack tray|rain cover|mosquito|travel bag|organizer|footmuff|toy|attachment|nursery package|base only|car seat base)\b/i.test(value);
}

function isProposedPublicEligible(group: MacroBabyOnlyGroup) {
  return (
    (group.area === 'stroller' || group.area === 'infant-car-seat') &&
    group.reason === 'eligible'
  );
}

function publicCardGroups(groups: MacroBabyOnlyGroup[]) {
  const byCard = new Map<string, MacroBabyOnlyGroup>();
  for (const group of groups) {
    const key = publicMatchKey(group.area, group.brand, group.model);
    const existing = byCard.get(key);
    if (!existing || (group.price != null && (existing.price == null || group.price < existing.price))) {
      byCard.set(key, group);
    }
  }
  return [...byCard.values()];
}

function flattenCatalog(area: PublicArea, payload: { brands?: Array<{ brand: string; types?: Array<{ category: string; products?: Array<Omit<PublicProduct, 'area' | 'brand' | 'category'>> }> }> }) {
  const out: PublicProduct[] = [];
  for (const brandRow of payload.brands ?? []) {
    for (const typeRow of brandRow.types ?? []) {
      for (const product of typeRow.products ?? []) {
        out.push({ ...product, area, brand: brandRow.brand, category: typeRow.category });
      }
    }
  }
  return out;
}

async function loadCurrentPublicProducts() {
  const [strollerResponse, carSeatResponse] = await Promise.all([getStrollerCatalog(), getCarSeatCatalog()]);
  const [strollerPayload, carSeatPayload] = await Promise.all([
    strollerResponse.json(),
    carSeatResponse.json(),
  ]);
  return [
    ...flattenCatalog('stroller', strollerPayload),
    ...flattenCatalog('carSeat', carSeatPayload),
  ];
}

function summarizeExample(group: MacroBabyOnlyGroup) {
  return {
    area: group.area,
    brand: group.brand,
    model: group.model,
    category: group.category,
    productType: group.productType,
    title: group.title,
    price: group.price,
    url: group.url,
    reviewStatus: group.reviewStatus,
    needsReview: group.needsReview,
    currentPublic: group.currentPublic,
    proposedPublic: group.proposedPublic,
    reason: group.reason,
  };
}

function toCsvValue(value: unknown) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const rows: CatalogProductRow[] = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      provider: { in: [PROVIDER_BABYLIST, PROVIDER_MACROBABY] },
    },
    select: {
      id: true,
      provider: true,
      brand: true,
      title: true,
      price: true,
      imageUrl: true,
      productUrl: true,
      affiliateUrl: true,
      retailer: true,
      itemGroupId: true,
      enrichment: {
        select: {
          canonicalBrand: true,
          canonicalName: true,
          tmbcCategory: true,
          productType: true,
          reviewStatus: true,
          needsReview: true,
          tags: true,
        },
      },
    },
    orderBy: { title: 'asc' },
  });

  const currentPublicProducts = await loadCurrentPublicProducts();
  const currentPublicKeys = new Set(currentPublicProducts.map(publicKey));
  const currentMacroBabyPublicKeys = new Set(
    currentPublicProducts
      .filter((product) => product.source === 'macrobaby' || product.retailers?.macrobaby)
      .map(publicKey),
  );

  const babylistKeys = new Set<string>();
  const macroGroups = new Map<string, MacroBabyOnlyGroup>();
  const duplicateCandidates = new Map<string, Array<{ provider: string; title: string; brand: string; model: string }>>();

  for (const row of rows) {
    const area = inferArea(row);
    const brand = brandForArea(row, area);
    const model = modelForArea(row, area, brand);
    const category = area === 'stroller' ? strollerCategoryFromProductType(row.enrichment?.productType) : null;
    const key = groupKey(area, brand, model || row.title, category, row.enrichment?.productType ?? null);
    const currentPublicKey = publicMatchKey(area, brand, model || row.title);
    const duplicateKey = [area, compact(brand), compact(model || row.title), compact(category ?? row.enrichment?.productType)].join('|');
    if (!duplicateCandidates.has(duplicateKey)) duplicateCandidates.set(duplicateKey, []);
    duplicateCandidates.get(duplicateKey)!.push({ provider: row.provider, title: row.title, brand, model });

    if (row.provider === PROVIDER_BABYLIST) {
      babylistKeys.add(key);
      continue;
    }

    if (row.provider !== PROVIDER_MACROBABY) continue;

    const existing = macroGroups.get(key);
    const currentPublic = currentPublicKeys.has(currentPublicKey) || currentMacroBabyPublicKeys.has(currentPublicKey);
    const typeIsEligible =
      area === 'stroller' ||
      area === 'infant-car-seat' ||
      area === 'adapter';
    const excludedByStrollerRules = area === 'stroller' && isExcludedStrollerFinderProduct({
      brand: row.brand,
      title: row.title,
      productUrl: row.productUrl,
      affiliateUrl: row.affiliateUrl,
    });
    const reason = rowIsManualReview(row)
      ? 'manual-review'
      : rowIsHidden(row)
        ? 'hidden'
        : isSuspectedAccessoryBundleOrTravelSystem(row) || excludedByStrollerRules
          ? 'suspected-accessory-bundle-travel-system'
          : typeIsEligible
            ? 'eligible'
            : 'excluded-product-type';

    const candidate: MacroBabyOnlyGroup = {
      key,
      area,
      brand,
      model: model || row.title,
      category,
      productType: row.enrichment?.productType ?? null,
      title: row.title,
      url: row.affiliateUrl ?? row.productUrl,
      price: row.price,
      imageUrl: row.imageUrl,
      reviewStatus: row.enrichment?.reviewStatus ?? null,
      needsReview: row.enrichment?.needsReview ?? null,
      tags: row.enrichment?.tags ?? [],
      rowIds: [row.id],
      currentPublic,
      proposedPublic: false,
      reason,
    };

    if (!existing) {
      macroGroups.set(key, candidate);
      continue;
    }

    existing.rowIds.push(row.id);
    existing.currentPublic = existing.currentPublic || candidate.currentPublic;
    if (candidate.price != null && (existing.price == null || candidate.price < existing.price)) {
      existing.title = candidate.title;
      existing.url = candidate.url;
      existing.price = candidate.price;
      existing.imageUrl = candidate.imageUrl;
      existing.reviewStatus = candidate.reviewStatus;
      existing.needsReview = candidate.needsReview;
      existing.tags = candidate.tags;
      existing.reason = candidate.reason;
    }
  }

  const macroBabyOnlyGroups = [...macroGroups.values()].filter((group) => !babylistKeys.has(group.key));
  for (const group of macroBabyOnlyGroups) {
    group.proposedPublic = isProposedPublicEligible(group);
  }

  const eligibleStrollers = macroBabyOnlyGroups.filter((group) => group.area === 'stroller' && group.reason === 'eligible');
  const eligibleInfantCarSeats = macroBabyOnlyGroups.filter((group) => group.area === 'infant-car-seat' && group.reason === 'eligible');
  const eligibleAdapters = macroBabyOnlyGroups.filter((group) => group.area === 'adapter' && group.reason === 'eligible');
  const proposedPublic = publicCardGroups([...eligibleStrollers, ...eligibleInfantCarSeats]);
  const hiddenDueOldVisibility = proposedPublic.filter((group) => !group.currentPublic);
  const manualReview = macroBabyOnlyGroups.filter((group) => group.reason === 'manual-review');
  const excludedProductType = macroBabyOnlyGroups.filter((group) => group.reason === 'excluded-product-type' || group.reason === 'hidden');
  const suspectedAccessoryBundleTravelSystem = macroBabyOnlyGroups.filter((group) => group.reason === 'suspected-accessory-bundle-travel-system');

  const brandsToList = ['Graco', 'Orbit Baby', 'mima', 'Baby Trend', 'Evenflo', 'Chicco', 'Britax'];
  const examplesByBrand: Record<string, ReturnType<typeof summarizeExample>[]> = {};
  for (const brand of brandsToList) {
    const brandKeyValue = compact(brand);
    examplesByBrand[brand] = macroBabyOnlyGroups
      .filter((group) => compact(group.brand) === brandKeyValue)
      .sort((a, b) => Number(b.proposedPublic) - Number(a.proposedPublic) || a.model.localeCompare(b.model))
      .slice(0, 12)
      .map(summarizeExample);
  }
  const otherEligibleBrands = [...new Set(proposedPublic.map((group) => group.brand))]
    .filter((brand) => !brandsToList.some((target) => compact(target) === compact(brand)))
    .sort();
  for (const brand of otherEligibleBrands) {
    examplesByBrand[brand] = proposedPublic
      .filter((group) => group.brand === brand)
      .sort((a, b) => a.model.localeCompare(b.model))
      .slice(0, 8)
      .map(summarizeExample);
  }

  const duplicateRiskItems = macroBabyOnlyGroups
    .filter((group) => group.reason === 'eligible')
    .flatMap((group) => {
      const candidates = duplicateCandidates.get(group.key) ?? [];
      const nonMacro = candidates.filter((candidate) => candidate.provider !== PROVIDER_MACROBABY);
      if (nonMacro.length === 0) return [];
      return [{
        ...summarizeExample(group),
        possibleMatches: nonMacro.slice(0, 5),
      }];
    });

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      macroBabyOnlyProducts: macroBabyOnlyGroups.length,
      eligibleMacroBabyOnlyStrollers: eligibleStrollers.length,
      eligibleMacroBabyOnlyInfantCarSeats: eligibleInfantCarSeats.length,
      eligibleMacroBabyOnlyAdapters: eligibleAdapters.length,
      hiddenDueToOldVisibilityRule: hiddenDueOldVisibility.length,
      hiddenDueToManualReview: manualReview.length,
      hiddenDueToExcludedProductType: excludedProductType.length,
      hiddenDueToSuspectedAccessoryBundleTravelSystem: suspectedAccessoryBundleTravelSystem.length,
      publicAfterProposedRule: proposedPublic.length,
      currentPublicMacroBabyOnlyProducts: publicCardGroups(
        macroBabyOnlyGroups.filter((group) => group.currentPublic && (group.area === 'stroller' || group.area === 'infant-car-seat')),
      ).length,
      duplicateRiskItems: duplicateRiskItems.length,
    },
    examplesByBrand,
    hiddenDueToOldVisibilityRule: hiddenDueOldVisibility.map(summarizeExample),
    hiddenDueToManualReview: manualReview.map(summarizeExample),
    hiddenDueToExcludedProductType: excludedProductType.map(summarizeExample),
    hiddenDueToSuspectedAccessoryBundleTravelSystem: suspectedAccessoryBundleTravelSystem.map(summarizeExample),
    publicAfterProposedRule: proposedPublic.map(summarizeExample),
    eligibleAdaptersForToolUse: eligibleAdapters.map(summarizeExample),
    duplicateRiskItems,
  };

  await fs.mkdir(path.join(process.cwd(), 'reports'), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), REPORT_JSON), `${JSON.stringify(report, null, 2)}\n`);
  const csvRows = [
    ['area', 'brand', 'model', 'category', 'productType', 'reason', 'currentPublic', 'proposedPublic', 'price', 'title', 'url'],
    ...macroBabyOnlyGroups.map((group) => [
      group.area,
      group.brand,
      group.model,
      group.category ?? '',
      group.productType ?? '',
      group.reason,
      group.currentPublic ? 'yes' : 'no',
      group.proposedPublic ? 'yes' : 'no',
      group.price ?? '',
      group.title,
      group.url ?? '',
    ]),
  ];
  await fs.writeFile(
    path.join(process.cwd(), REPORT_CSV),
    `${csvRows.map((row) => row.map(toCsvValue).join(',')).join('\n')}\n`,
  );

  console.log('── MacroBaby-only public candidate audit ──');
  console.log(`  MacroBaby-only products: ${report.totals.macroBabyOnlyProducts}`);
  console.log(`  eligible strollers: ${report.totals.eligibleMacroBabyOnlyStrollers}`);
  console.log(`  eligible infant car seats: ${report.totals.eligibleMacroBabyOnlyInfantCarSeats}`);
  console.log(`  eligible adapters: ${report.totals.eligibleMacroBabyOnlyAdapters}`);
  console.log(`  hidden by old/current public visibility: ${report.totals.hiddenDueToOldVisibilityRule}`);
  console.log(`  hidden by manual review: ${report.totals.hiddenDueToManualReview}`);
  console.log(`  hidden by excluded product type: ${report.totals.hiddenDueToExcludedProductType}`);
  console.log(`  hidden as accessory/bundle/travel system: ${report.totals.hiddenDueToSuspectedAccessoryBundleTravelSystem}`);
  console.log(`  public after proposed rule: ${report.totals.publicAfterProposedRule}`);
  console.log(`  duplicate-risk items: ${report.totals.duplicateRiskItems}`);
  console.log(`\n  wrote ${REPORT_JSON}`);
  console.log(`  wrote ${REPORT_CSV}`);
}

main()
  .catch((error) => {
    console.error('[auditMacroBabyOnlyPublicCandidates] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
