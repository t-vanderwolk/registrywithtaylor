/**
 * Read-only audit for public product visibility and CTA source rules.
 *
 *   npm run catalog:audit-public-visibility
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseCarSeatModel } from '@/lib/catalog/strollerModel';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { hasPublicCoreRetailer, isGoodBuyGearOffer } from '@/lib/catalog/publicRetailerVisibility';
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';
import { getPublicStrollerCatalogBrands } from '@/lib/server/publicStrollerCatalog';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const PROVIDER_ANB = 'awin_anbbaby';
const PROVIDER_BABYLIST = 'babylist_impact';
const PROVIDER_MACROBABY = 'shopify_macrobaby';

type RetailOffer = { price: number | null; url: string | null };
type PublicProduct = {
  area: 'stroller' | 'carSeat';
  brand: string;
  category: string;
  label: string;
  name: string;
  model: string;
  price?: number | null;
  image?: string | null;
  affiliateUrl?: string | null;
  source?: string | null;
  retailers?: Record<string, RetailOffer | null> | null;
};
type TravelOption = {
  area: 'travel-system-stroller' | 'travel-system-car-seat';
  brand: string;
  model: string;
  displayName: string;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  macroBabyUrl?: string | null;
  macroBabyPrice?: number | null;
  amazonUrl?: string | null;
};
type CatalogProductRow = {
  provider: string;
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  productUrl: string | null;
  affiliateUrl: string | null;
  retailer: string | null;
  itemGroupId: string | null;
  enrichment: { productType: string | null; canonicalBrand: string | null; canonicalName: string | null } | null;
};

function hasOffer(offer: RetailOffer | null | undefined) {
  return Boolean(offer && (offer.url || offer.price != null));
}

function hasCoreRetailer(product: PublicProduct) {
  return hasOffer(product.retailers?.babylist) || hasOffer(product.retailers?.macrobaby);
}

function hasAmazon(product: PublicProduct) {
  return hasOffer(product.retailers?.amazon);
}

function hasGoodBuyGear(product: PublicProduct) {
  return hasOffer(product.retailers?.goodbuygear);
}

function isNonCorePrimary(product: PublicProduct) {
  return Boolean(product.source && product.source !== 'babylist' && product.source !== 'macrobaby');
}

function flattenCatalog(area: 'stroller' | 'carSeat', payload: { brands?: Array<{ brand: string; types?: Array<{ category: string; label: string; products?: Array<Omit<PublicProduct, 'area' | 'brand' | 'category' | 'label'>> }> }> }) {
  const out: PublicProduct[] = [];
  for (const brandRow of payload.brands ?? []) {
    for (const typeRow of brandRow.types ?? []) {
      for (const product of typeRow.products ?? []) {
        out.push({
          ...product,
          area,
          brand: brandRow.brand,
          category: typeRow.category,
          label: typeRow.label,
        });
      }
    }
  }
  return out;
}

function modelLikeCanonicalName(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  if (/\b(infant|car seat|adapter|accessory|base|cover|canopy|insert|mirror|net)\b/i.test(v)) return null;
  if (/[,(]/.test(v)) return null;
  return v;
}

async function loadCarSeatCatalog() {
  const rows: CatalogProductRow[] = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      enrichment: {
        is: {
          productType: 'infant car seat',
          needsReview: false,
          reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
        },
      },
    },
    select: {
      provider: true,
      brand: true,
      title: true,
      price: true,
      imageUrl: true,
      productUrl: true,
      affiliateUrl: true,
      retailer: true,
      itemGroupId: true,
      enrichment: { select: { productType: true, canonicalBrand: true, canonicalName: true } },
    },
    orderBy: { title: 'asc' },
  });

  type Offer = { price: number | null; url: string | null; image: string | null; title: string };
  type Group = {
    brand: string;
    model: string;
    babylist: Offer | null;
    macrobaby: Offer | null;
    anb: Offer | null;
    gbg: Offer | null;
  };

  const groups = new Map<string, Group>();
  const seenGroups = new Set<string>();
  for (const row of rows) {
    if (row.itemGroupId) {
      const groupIdKey = `${row.provider}:${row.itemGroupId}`;
      if (seenGroups.has(groupIdKey)) continue;
      seenGroups.add(groupIdKey);
    }

    const brand = canonicalBrand(row.enrichment?.canonicalBrand ?? row.brand);
    const model = modelLikeCanonicalName(row.enrichment?.canonicalName) ?? parseCarSeatModel(row.title, brand);
    const key = productModelKey(brand, model || row.title);
    let group = groups.get(key);
    if (!group) {
      group = { brand, model, babylist: null, macrobaby: null, anb: null, gbg: null };
      groups.set(key, group);
    }

    const offer: Offer = { price: row.price, url: row.affiliateUrl, image: row.imageUrl, title: row.title };
    const cheaper = (current: Offer | null) =>
      !current || (offer.price != null && (current.price == null || offer.price < current.price));
    const isGoodBuyGear = isGoodBuyGearOffer({
      provider: row.provider,
      retailer: row.retailer,
      url: row.affiliateUrl,
      productUrl: row.productUrl,
    });

    if (isGoodBuyGear) {
      if (cheaper(group.gbg)) group.gbg = offer;
    } else if (row.provider === PROVIDER_BABYLIST) {
      if (!group.babylist) group.babylist = offer;
    } else if (row.provider === PROVIDER_MACROBABY) {
      if (cheaper(group.macrobaby)) group.macrobaby = offer;
    } else if (row.provider === PROVIDER_ANB) {
      if (cheaper(group.anb)) group.anb = offer;
    }
  }

  const byBrand = new Map<string, Array<Omit<PublicProduct, 'area' | 'brand' | 'category' | 'label'>>>();
  for (const group of groups.values()) {
    const babylist = group.babylist && hasPublicCoreRetailer({
      provider: PROVIDER_BABYLIST,
      retailer: 'Babylist',
      url: group.babylist.url,
      price: group.babylist.price,
    })
      ? group.babylist
      : null;
    const macrobaby = group.macrobaby && hasPublicCoreRetailer({
      provider: PROVIDER_MACROBABY,
      retailer: 'MacroBaby',
      url: group.macrobaby.url,
      price: group.macrobaby.price,
    })
      ? group.macrobaby
      : null;
    const primary = babylist ?? macrobaby;
    if (!primary) continue;

    const amazonUrl = getAffiliateLinks(group.brand, group.model).amazonUrl ?? null;
    if (!byBrand.has(group.brand)) byBrand.set(group.brand, []);
    byBrand.get(group.brand)!.push({
      name: primary.title,
      model: group.model,
      price: primary.price,
      image: babylist?.image ?? macrobaby?.image ?? group.anb?.image ?? group.gbg?.image ?? null,
      affiliateUrl: primary.url,
      source: babylist ? 'babylist' : 'macrobaby',
      retailers: {
        babylist: babylist ? { price: babylist.price, url: babylist.url } : null,
        amazon: amazonUrl ? { price: null, url: amazonUrl } : null,
        macrobaby: macrobaby ? { price: macrobaby.price, url: macrobaby.url } : null,
        anb: null,
        goodbuygear: group.gbg ? { price: group.gbg.price, url: group.gbg.url } : null,
      },
    });
  }

  const brands = [...byBrand.entries()]
    .map(([brand, products]) => ({
      brand,
      count: products.length,
      types: [
        {
          category: 'infant-car-seat',
          label: 'Infant Car Seat',
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        },
      ],
    }))
    .filter((brand) => brand.count > 0)
    .sort((a, b) => a.brand.localeCompare(b.brand));

  return { brands };
}

async function loadCatalogProducts() {
  const [strollerBrands, carSeatPayload] = await Promise.all([
    getPublicStrollerCatalogBrands(),
    loadCarSeatCatalog(),
  ]);
  return [
    ...flattenCatalog('stroller', { brands: strollerBrands }),
    ...flattenCatalog('carSeat', carSeatPayload),
  ];
}

function travelHasCore(option: TravelOption) {
  return Boolean(
    option.babylistUrl ||
      option.babylistPrice != null ||
      option.macroBabyUrl ||
      option.macroBabyPrice != null,
  );
}

function simplifyProduct(product: PublicProduct) {
  return {
    area: product.area,
    brand: product.brand,
    model: product.model,
    name: product.name,
    source: product.source ?? null,
    babylist: product.retailers?.babylist ?? null,
    macrobaby: product.retailers?.macrobaby ?? null,
    amazon: product.retailers?.amazon ?? null,
    anb: product.retailers?.anb ?? null,
    goodbuygear: product.retailers?.goodbuygear ?? null,
  };
}

function simplifyTravelOption(option: TravelOption) {
  return {
    area: option.area,
    brand: option.brand,
    model: option.model,
    displayName: option.displayName,
    babylistUrl: option.babylistUrl ?? null,
    babylistPrice: option.babylistPrice ?? null,
    macroBabyUrl: option.macroBabyUrl ?? null,
    macroBabyPrice: option.macroBabyPrice ?? null,
    amazonUrl: option.amazonUrl ?? null,
  };
}

async function main() {
  const products = await loadCatalogProducts();
  const [travelStrollers, travelCarSeats] = await Promise.all([
    getTravelSystemStrollers(),
    getTravelSystemCarSeats(),
  ]);
  const travelOptions: TravelOption[] = [
    ...travelStrollers.map((option) => ({ ...option, area: 'travel-system-stroller' as const })),
    ...travelCarSeats.map((option) => ({ ...option, area: 'travel-system-car-seat' as const })),
  ];

  const visibleWithoutBabylistOrMacroBaby = products.filter((product) => !hasCoreRetailer(product));
  const amazonOnlyStillPublic = products.filter(
    (product) => hasAmazon(product) && !hasCoreRetailer(product) && !hasOffer(product.retailers?.anb) && !hasGoodBuyGear(product),
  );
  const nonCorePrimary = products.filter(isNonCorePrimary);
  const corePlusAmazon = products.filter((product) => hasCoreRetailer(product) && hasAmazon(product));
  const corePlusGoodBuyGearBadge = products.filter((product) => hasCoreRetailer(product) && hasGoodBuyGear(product));
  const travelVisibleWithoutCore = travelOptions.filter((option) => !travelHasCore(option));
  const travelAmazonWithoutCore = travelOptions.filter((option) => option.amazonUrl && !travelHasCore(option));
  const travelCorePlusAmazon = travelOptions.filter((option) => option.amazonUrl && travelHasCore(option));

  const report = {
    generatedAt: new Date().toISOString(),
    publicCatalogProducts: products.length,
    travelSystemOptions: travelOptions.length,
    productsPubliclyVisibleWithoutBabylistOrMacroBaby: visibleWithoutBabylistOrMacroBaby.map(simplifyProduct),
    productsWhereAmazonIsOnlyRetailerButStillPublic: amazonOnlyStillPublic.map(simplifyProduct),
    productsWhereNonCoreRetailerIsPrimary: nonCorePrimary.map(simplifyProduct),
    visibleProductsWithBabylistOrMacroBabyPlusAmazon: corePlusAmazon.map(simplifyProduct),
    visibleProductsWithBabylistOrMacroBabyPlusGoodBuyGearBadge: corePlusGoodBuyGearBadge.map(simplifyProduct),
    travelSystemOptionsWithoutBabylistOrMacroBaby: travelVisibleWithoutCore.map(simplifyTravelOption),
    travelSystemOptionsWithAmazonButNoBabylistOrMacroBaby: travelAmazonWithoutCore.map(simplifyTravelOption),
    travelSystemOptionsWithBabylistOrMacroBabyPlusAmazon: travelCorePlusAmazon.map(simplifyTravelOption),
  };

  await fs.mkdir(path.join(process.cwd(), 'reports'), { recursive: true });
  const reportPath = path.join(process.cwd(), 'reports/public-product-visibility-audit.json');
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log('── Public product visibility audit ──');
  console.log(`  public catalog products: ${products.length}`);
  console.log(`  travel-system selector options: ${travelOptions.length}`);
  console.log(`  visible without Babylist/MacroBaby: ${visibleWithoutBabylistOrMacroBaby.length}`);
  console.log(`  Amazon-only but public: ${amazonOnlyStillPublic.length}`);
  console.log(`  non-core primary source: ${nonCorePrimary.length}`);
  console.log(`  core plus Amazon: ${corePlusAmazon.length}`);
  console.log(`  core plus GoodBuy Gear badge: ${corePlusGoodBuyGearBadge.length}`);
  console.log(`  travel-system options without Babylist/MacroBaby: ${travelVisibleWithoutCore.length}`);
  console.log(`  travel-system Amazon without Babylist/MacroBaby: ${travelAmazonWithoutCore.length}`);
  console.log(`  travel-system core plus Amazon: ${travelCorePlusAmazon.length}`);
  console.log(`\n  wrote ${path.relative(process.cwd(), reportPath)}`);

  if (
    visibleWithoutBabylistOrMacroBaby.length > 0 ||
    amazonOnlyStillPublic.length > 0 ||
    nonCorePrimary.length > 0 ||
    travelVisibleWithoutCore.length > 0 ||
    travelAmazonWithoutCore.length > 0
  ) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('[auditPublicProductVisibility] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
