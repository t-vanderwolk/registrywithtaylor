/**
 * Restore the Bugaboo Butterfly + Butterfly 2 to the finder + checker.
 *  1. Un-hides any existing Bugaboo "Butterfly" catalog products (reviewStatus →
 *     REVIEWED, isPublic) in case a prior hide pass hid them.
 *  2. Adds both via Babylist links (babylist_impact) so they are present with
 *     good data even if the feed dropped them.
 *  3. Ensures Stroller rows so the checker can resolve compatibility.
 *
 * Car-seat compatibility (Nuna / Maxi-Cosi / CYBEX / Clek via the Bugaboo adapter,
 * plus the Bugaboo Turtle direct) is wired by the universal-adapter script and
 * addBugabooTurtleDirect — run those after this one.
 *
 *   npx tsx scripts/addBugabooButterfly.ts            # dry run (default)
 *   npx tsx scripts/addBugabooButterfly.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-bugaboo-butterfly-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

type Spec = {
  brand: string;
  model: string;
  productType: string;
  externalId: string;
  title: string;
  affiliateUrl: string;
  imageUrl: string | null;
  price: number | null;
};

const SPECS: Spec[] = [
  {
    brand: 'Bugaboo',
    model: 'Butterfly',
    productType: 'travel stroller',
    externalId: '1154564',
    title: 'Bugaboo Butterfly Complete Stroller',
    affiliateUrl: babylistAffiliate('https://www.babylist.com/gp/bugaboo-butterfly-complete-stroller/25163/1154564'),
    imageUrl: null,
    price: null,
  },
  {
    brand: 'Bugaboo',
    model: 'Butterfly 2',
    productType: 'travel stroller',
    externalId: '2491084',
    title: 'Bugaboo Butterfly 2 Complete Stroller',
    affiliateUrl: babylistAffiliate('https://www.babylist.com/gp/bugaboo-butterfly-2-complete-stroller/74320/2491084'),
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/2acab943619f5c06efcbab3ac3eb89fd798436018bfef59f68c7a86efa4cd68c/249ce3a4fb097da29329781713d9dcb9/2acab943619f5c06efcbab3ac3eb89fd798436018bfef59f68c7a86efa4cd68c.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 599.0,
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
        babylistUpdatedAt: new Date(),
      },
    });
  }
  return 'created';
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Restore Bugaboo Butterfly + Butterfly 2 ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // 1) Un-hide any existing Bugaboo Butterfly catalog products.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hidden: any[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { startsWith: 'Bugaboo', mode: 'insensitive' },
      title: { contains: 'butterfly', mode: 'insensitive' },
      enrichment: { is: { reviewStatus: 'HIDDEN' } },
    },
    select: { id: true, title: true, enrichment: { select: { id: true } } },
  });
  console.log(`  Un-hide existing Butterfly catalog products: ${hidden.length}`);
  hidden.forEach((h) => console.log(`    • ${h.title.slice(0, 60)}`));
  if (apply && hidden.length) {
    await db.productEnrichment.updateMany({
      where: { id: { in: hidden.map((h) => h.enrichment.id) } },
      data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
    });
  }

  // 2) Add both via Babylist + 3) ensure Stroller rows.
  for (const spec of SPECS) {
    console.log(`\n${spec.brand} ${spec.model}${spec.price != null ? `  ($${spec.price})` : ''}`);
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
    console.log(`   Stroller row: ${strollerState}`);
  }

  console.log(`\n${apply ? 'Done — Butterfly + Butterfly 2 restored.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addBugabooButterfly] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
