/**
 * Add via Babylist links + restore Mockingbird:
 *   • Veer Infant Car Seat Adapter for Veer Cruiser Wagon (UPPAbaby)   (adapter)
 *   • Joie ICS Car Seat Adapter for Mockingbird Stroller              (adapter)
 *   • Mockingbird Car Seat Adapter (Graco/Chicco/Baby Jogger/Britax)  (adapter)
 *   • Mockingbird Car Seat Adapter (UPPAbaby)                         (adapter)
 *
 * Also RESTORES the Mockingbird brand + strollers: un-hides any hidden
 * Mockingbird stroller catalog products (finder + checker browse) and re-creates
 * the Single 3.0 / Single-to-Double 3.0 Stroller rows so the checker can match
 * car seats. Pair with catalog:universal-adapter-compatibility-apply (a
 * Mockingbird rule was added there) to wire the car-seat compatibility, and the
 * three Mockingbird adapters above surface as the "Shop adapter" link.
 *
 * Adapters become babylist_impact catalog products under Travel Systems &
 * Adapters. Titles keep the "Adapter" spelling (the engine filters on the word
 * "adapter") and the "for <brand> Stroller" phrasing (brand-wide adapter match).
 *
 *   npx tsx scripts/addVeerMockingbirdBabylist.ts            # dry run (default)
 *   npx tsx scripts/addVeerMockingbirdBabylist.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-veer-mockingbird-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

type AdapterSpec = {
  brand: string;
  externalId: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  price: number;
};

const ADAPTERS: AdapterSpec[] = [
  {
    brand: 'Veer',
    externalId: '307614',
    title: 'Veer Infant Car Seat Adapter for Veer Cruiser Wagon (UPPAbaby)',
    productUrl: 'https://www.babylist.com/gp/veer-infant-car-seat-adapter-for-veer-cruiser-wagon/16069/307614',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/01a0630d0f10d29236d1c944858fbcf1a3aa7725e31fbb271fe79bc610b9d874/48c2af7708873277311e53a4db33dbdc/01a0630d0f10d29236d1c944858fbcf1a3aa7725e31fbb271fe79bc610b9d874.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 69.0,
  },
  {
    brand: 'Joie',
    externalId: '2460584',
    title: 'Joie ICS Car Seat Adapter for Mockingbird Stroller',
    productUrl: 'https://www.babylist.com/gp/joie-ics-adaptor-for-mockingbird-stroller/74113/2460584',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/1710389b838066819c2b2e9daddb6ef4e2d7250a707304614a395d472e1948db/fb5d8e6cc2710191ba0f5adc96748de1/1710389b838066819c2b2e9daddb6ef4e2d7250a707304614a395d472e1948db.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 29.99,
  },
  {
    brand: 'Mockingbird',
    externalId: '276094',
    title: 'Mockingbird Car Seat Adapter for Mockingbird Stroller (Graco / Chicco / Baby Jogger / Britax B-Safe)',
    productUrl: 'https://www.babylist.com/gp/mockingbird-car-seat-adapter-for-mockingbird-stroller/15467/276094',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/6aea5f4dab18a320248a0a7e94e3592b505687fa1d98506dba3bf6884d3d0543/b4ae343d05f3217016ce42142adafef4/1_276094_product.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 50.0,
  },
  {
    brand: 'Mockingbird',
    externalId: '1552361',
    title: 'Mockingbird Car Seat Adapter for Mockingbird Stroller (UPPAbaby)',
    productUrl: 'https://www.babylist.com/gp/mockingbird-car-seat-adapter-for-mockingbird-stroller/15467/1552361',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/48c536559d892d86b9c621fd5b3a7a7cf66ab336c6a7c0be4971a10e58e4604f/2b72e83a756930bfbf7dc7bac6dd17f5/48c536559d892d86b9c621fd5b3a7a7cf66ab336c6a7c0be4971a10e58e4604f.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 50.0,
  },
];

// Current Mockingbird strollers to guarantee in the checker (Stroller table).
const MOCKINGBIRD_STROLLERS: { brand: string; model: string }[] = [
  { brand: 'Mockingbird', model: 'Single 3.0' },
  { brand: 'Mockingbird', model: 'Single-to-Double 3.0' },
];

async function ensureStrollerRow(brand: string, model: string, apply: boolean) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: brand, mode: 'insensitive' }, model: { equals: model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return 'exists';
  if (apply) {
    await db.stroller.create({
      data: { brand, model, displayName: `${brand} ${model}`, babylistUpdatedAt: new Date() },
    });
  }
  return 'created';
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Veer + Mockingbird adapters, restore Mockingbird ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // 1. Restore the Mockingbird brand: un-hide every hidden Mockingbird stroller
  //    catalog product (finder + checker browse).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hidden: any[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { startsWith: 'Mockingbird', mode: 'insensitive' },
      enrichment: { is: { tmbcCategory: 'Strollers', reviewStatus: 'HIDDEN' } },
    },
    select: { id: true, title: true, enrichment: { select: { id: true } } },
  });
  console.log(`Restore Mockingbird — ${hidden.length} hidden stroller product(s) to un-hide:`);
  hidden.forEach((h) => console.log(`   • ${h.title.slice(0, 62)}`));
  if (apply && hidden.length) {
    await db.productEnrichment.updateMany({
      where: { id: { in: hidden.map((h) => h.enrichment.id) } },
      data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
    });
  }
  console.log('');

  // 2. Ensure the current Mockingbird Stroller rows exist (checker compatibility).
  for (const s of MOCKINGBIRD_STROLLERS) {
    const state = await ensureStrollerRow(s.brand, s.model, apply);
    console.log(`   Stroller row ${s.brand} ${s.model}: ${state}`);
  }
  console.log('');

  // 3. Add the adapter catalog products.
  for (const spec of ADAPTERS) {
    console.log(`${spec.brand.padEnd(12)} $${spec.price}  ${spec.title.slice(0, 60)}`);
    if (!apply) continue;

    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'babylist_impact', externalId: spec.externalId } },
      update: {
        brand: spec.brand,
        title: spec.title,
        affiliateUrl: babylistAffiliate(spec.productUrl),
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
        affiliateUrl: babylistAffiliate(spec.productUrl),
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
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: spec.brand,
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });
  }

  console.log(`\n${apply ? `Done — restored Mockingbird + added ${ADAPTERS.length} adapter link(s).` : '(dry run — re-run with --apply.)'}`);
  if (apply) {
    console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply  (wires Mockingbird car-seat compatibility)');
  }
}

main()
  .catch((error) => {
    console.error('[addVeerMockingbirdBabylist] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
