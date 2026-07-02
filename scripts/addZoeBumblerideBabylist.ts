/**
 * Add via Babylist links:
 *   • Zoe Tourᵛ³ Single Stroller       (Zoe, compact)
 *   • Zoe Twinᵛ³ Double Stroller       (Zoe, double)
 *   • Bumbleride Indie Twin            (Bumbleride, double jogging)
 *   • Bumbleride Single Stroller Car Seat Adapter (Graco / Chicco)  (adapter)
 *
 * Strollers become babylist_impact catalog products (URL + image + price) with
 * public REVIEWED enrichment and a Stroller row. The adapter becomes a
 * Travel Systems & Adapters catalog product so it can surface as a "Shop adapter"
 * link. Also un-hides any of these already hidden in the catalog.
 *
 *   npx tsx scripts/addZoeBumblerideBabylist.ts            # dry run (default)
 *   npx tsx scripts/addZoeBumblerideBabylist.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-zoe-bumbleride-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

type StrollerSpec = {
  kind: 'stroller';
  brand: string;
  model: string;
  productType: string;
  externalId: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  price: number;
};

type AdapterSpec = {
  kind: 'adapter';
  brand: string;
  externalId: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  price: number;
};

const SPECS: Array<StrollerSpec | AdapterSpec> = [
  {
    kind: 'stroller',
    brand: 'Zoe',
    model: 'Tour',
    productType: 'compact stroller',
    externalId: '3362466',
    title: 'Zoe Tour v3 Single Stroller',
    productUrl: 'https://www.babylist.com/gp/zoe-tour-single-stroller-1781549429/84181/3362466',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/77b7c395a579e4f06ed493d3fb6784714d788cf4c8412831a8ea1bccd92c17e8/032e959c6de2df6b18cf528572f762d8/77b7c395a579e4f06ed493d3fb6784714d788cf4c8412831a8ea1bccd92c17e8.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 299.0,
  },
  {
    kind: 'stroller',
    brand: 'Zoe',
    model: 'Twin',
    productType: 'double stroller',
    externalId: '3362549',
    title: 'Zoe Twin v3 Double Stroller',
    productUrl: 'https://www.babylist.com/gp/zoe-twin-double-stroller-1781549466/84186/3362549',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/b117a29db83a2dd491a61d031308e0863ff218702632f0ba203e8cc9745d583b/05238d7f53144db3d75a6688c3b0aa72/b117a29db83a2dd491a61d031308e0863ff218702632f0ba203e8cc9745d583b.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 599.0,
  },
  {
    kind: 'stroller',
    brand: 'Bumbleride',
    model: 'Indie Twin',
    productType: 'double jogging stroller',
    externalId: '2072906',
    title: 'Bumbleride Indie Twin Double Jogging Stroller',
    productUrl: 'https://www.babylist.com/gp/bumbleride-indie-twin-double-jogging-stroller/37545/2072906',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/1246d768c804c28c0ce77ac09f547822345208d9b06e19bb51daa248fcc6957a/e22a4fc869a54ad03ea158d0fc456abc/1246d768c804c28c0ce77ac09f547822345208d9b06e19bb51daa248fcc6957a.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 1099.0,
  },
  {
    kind: 'adapter',
    brand: 'Bumbleride',
    externalId: '1398655',
    title: 'Bumbleride Single Stroller Car Seat Adapter (Graco / Chicco) - Era / Indie / Speed',
    productUrl: 'https://www.babylist.com/gp/bumbleride-single-stroller-car-seat-adapter/37555/1398655',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/4d7c3cd77de2ceb3144619ca1e31d1a8e1388f541758462dfb6d978d59d94c95/6b1308cd85c6610e2c4b99e018c335d9/4d7c3cd77de2ceb3144619ca1e31d1a8e1388f541758462dfb6d978d59d94c95.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 65.0,
  },
];

async function ensureStrollerRow(spec: StrollerSpec, apply: boolean) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: spec.brand, mode: 'insensitive' }, model: { equals: spec.model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return 'exists';
  if (apply) {
    await db.stroller.create({
      data: { brand: spec.brand, model: spec.model, displayName: `${spec.brand} ${spec.model}`, babylistUpdatedAt: new Date() },
    });
  }
  return 'created';
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Zoe + Bumbleride (Babylist) ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // Un-hide any of these already hidden in the catalog.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hidden: any[] = await db.affiliateCatalogProduct.findMany({
    where: {
      OR: [
        { brand: { startsWith: 'Zoe', mode: 'insensitive' } },
        { brand: { startsWith: 'Bumbleride', mode: 'insensitive' }, title: { contains: 'indie twin', mode: 'insensitive' } },
      ],
      enrichment: { is: { reviewStatus: 'HIDDEN' } },
    },
    select: { id: true, title: true, enrichment: { select: { id: true } } },
  });
  if (hidden.length) {
    console.log(`  Un-hiding ${hidden.length} previously hidden catalog products:`);
    hidden.forEach((h) => console.log(`    • ${h.title.slice(0, 60)}`));
    if (apply) {
      await db.productEnrichment.updateMany({
        where: { id: { in: hidden.map((h) => h.enrichment.id) } },
        data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
      });
    }
    console.log('');
  }

  for (const spec of SPECS) {
    const isStroller = spec.kind === 'stroller';
    console.log(`${spec.brand} ${isStroller ? spec.model : 'adapter'}  ($${spec.price})  [${isStroller ? spec.productType : 'car seat adapter'}]`);

    if (apply) {
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

      const enrichment = isStroller
        ? {
            canonicalBrand: spec.brand,
            canonicalName: spec.model,
            tmbcCategory: 'Strollers',
            productType: spec.productType,
            reviewStatus: 'REVIEWED',
            isPublic: true,
            needsReview: false,
          }
        : {
            canonicalBrand: spec.brand,
            tmbcCategory: 'Travel Systems & Adapters',
            productType: 'car seat adapter',
            reviewStatus: 'REVIEWED',
            isPublic: true,
            needsReview: false,
          };

      await db.productEnrichment.upsert({
        where: { rawProductId: product.id },
        update: enrichment,
        create: { rawProductId: product.id, ...enrichment },
      });
    }

    if (isStroller) {
      const state = await ensureStrollerRow(spec, apply);
      console.log(`   Stroller row: ${state}`);
    }
    console.log('');
  }

  console.log(apply ? 'Done.' : '(dry run — re-run with --apply.)');
  if (apply) console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply  (wires Bumbleride Indie Twin car-seat compatibility)');
}

main()
  .catch((error) => {
    console.error('[addZoeBumblerideBabylist] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
