/**
 * Read-only audit for public product visibility and CTA source rules.
 *
 *   npm run catalog:audit-public-visibility
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { GET as getCarSeatCatalog } from '@/app/api/catalog/carseats/route';
import { GET as getStrollerCatalog } from '@/app/api/catalog/strollers/route';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

type RetailOffer = { price: number | null; url: string | null };
type PublicProduct = {
  area: 'stroller' | 'carSeat';
  brand: string;
  category: string;
  label: string;
  name: string;
  model: string;
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

async function loadCatalogProducts() {
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

main().catch((error) => {
  console.error('[auditPublicProductVisibility] failed:', error);
  process.exit(1);
});
