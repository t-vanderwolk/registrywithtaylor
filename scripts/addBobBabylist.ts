/**
 * Add the two BOB Gear Revolution Flex 3.0 joggers to the finder + checker using
 * Babylist (Impact) links: the single jogging stroller and the Duallie double
 * jogging stroller. Creates a `babylist_impact` catalog product (URL + image +
 * price) with public REVIEWED enrichment plus a Stroller row for compatibility.
 * Brand is BOB (canonical for "BOB Gear"), so they land under the BOB strollers.
 *
 * Car-seat compatibility is wired by the universal-adapter script — the BOB rule
 * already matches /revolution/, so run it AFTER this one:
 *   DB=... npm run catalog:universal-adapter-compatibility-apply
 *
 *   npx tsx scripts/addBobBabylist.ts            # dry run (default)
 *   npx tsx scripts/addBobBabylist.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-bob-babylist-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

/** Wrap a Babylist product URL in the TMBC Impact affiliate link. */
const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

type Spec = {
  brand: string;
  model: string;
  productType: string;
  externalId: string; // Babylist SKU id (last path segment)
  title: string;
  affiliateUrl: string;
  imageUrl: string;
  price: number;
};

const SPECS: Spec[] = [
  {
    brand: 'BOB',
    model: 'Revolution Flex 3.0',
    productType: 'jogging stroller',
    externalId: '312124',
    title: 'BOB Gear Revolution Flex 3.0 Single Jogging Stroller',
    affiliateUrl: babylistAffiliate(
      'https://www.babylist.com/gp/bob-gear-revolution-flex-3-0-single-jogging-stroller/16195/312124',
    ),
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/e05e7e562976b95f1d68fa2068b2e61032688132c32eb888d633ecd5d0fb253e/12f1a076ed0c4ab0a868616d17adc811/e05e7e562976b95f1d68fa2068b2e61032688132c32eb888d633ecd5d0fb253e.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 519.99,
  },
  {
    brand: 'BOB',
    model: 'Revolution Flex 3.0 Duallie',
    productType: 'double jogging stroller',
    externalId: '338314',
    title: 'BOB Gear Revolution Flex 3.0 Duallie Double Jogging Stroller',
    affiliateUrl: babylistAffiliate(
      'https://www.babylist.com/gp/bob-gear-revolution-flex-3-0-duallie-double-jogging-stroller/16605/338314',
    ),
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/9c30636c2ec02f87a773e44bb1caa367692d87ab65b755f342997d83d3a697c5/61a19ac167b363e628e6fd35fea0faae/9c30636c2ec02f87a773e44bb1caa367692d87ab65b755f342997d83d3a697c5.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 899.99,
  },
];

async function ensureStrollerRow(spec: Spec, apply: boolean) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: spec.brand, mode: 'insensitive' }, model: { equals: spec.model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return 'exists';
  if (apply) {
    await db.stroller.create({
      data: {
        brand: spec.brand,
        model: spec.model,
        displayName: `${spec.brand} ${spec.model}`,
        babylistSku: null,
        babylistUrl: null,
        babylistPrice: null,
        babylistImage: null,
        babylistUpdatedAt: new Date(),
      },
    });
  }
  return 'created';
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add BOB (Babylist) joggers ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`${spec.brand} ${spec.model}  ($${spec.price})  [${spec.productType}]`);

    if (apply) {
      const product = await db.affiliateCatalogProduct.upsert({
        where: { provider_externalId: { provider: 'babylist_impact', externalId: spec.externalId } },
        update: {
          brand: spec.brand,
          title: spec.title,
          affiliateUrl: spec.affiliateUrl,
          imageUrl: spec.imageUrl,
          price: spec.price,
          retailer: 'Babylist',
          isActiveInFeed: true,
          lastSyncedAt: new Date(),
        },
        create: {
          provider: 'babylist_impact',
          externalId: spec.externalId,
          brand: spec.brand,
          title: spec.title,
          affiliateUrl: spec.affiliateUrl,
          imageUrl: spec.imageUrl,
          price: spec.price,
          retailer: 'Babylist',
          isActiveInFeed: true,
        },
        select: { id: true },
      });

      await db.productEnrichment.upsert({
        where: { rawProductId: product.id },
        update: {
          canonicalBrand: spec.brand,
          canonicalName: spec.model,
          tmbcCategory: 'Strollers',
          productType: spec.productType,
          reviewStatus: 'REVIEWED',
          isPublic: true,
          needsReview: false,
        },
        create: {
          rawProductId: product.id,
          canonicalBrand: spec.brand,
          canonicalName: spec.model,
          tmbcCategory: 'Strollers',
          productType: spec.productType,
          reviewStatus: 'REVIEWED',
          isPublic: true,
          needsReview: false,
        },
      });
    }

    const strollerState = await ensureStrollerRow(spec, apply);
    console.log(`   Stroller row: ${strollerState}\n`);
  }

  console.log(apply ? 'Done — added 2 BOB joggers.' : '(dry run — re-run with --apply.)');
  if (apply) console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply');
}

main()
  .catch((error) => {
    console.error('[addBobBabylist] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
