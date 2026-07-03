/**
 *  1. Add the Bugaboo Dragonfly Car Seat Adapters (babylist_impact, Travel
 *     Systems & Adapters). Title carries "Dragonfly" so the engine matches it to
 *     the Bugaboo Dragonfly for the shared Nuna / Maxi-Cosi / CYBEX / Clek seats.
 *  2. Rename the Nuna "TRVL Easy Fold" to display as "Nuna TRVL" — updates the
 *     catalog product (title + canonicalName) and the Stroller row model.
 *
 *   npx tsx scripts/addDragonflyRenameTrvl.ts            # dry run (default)
 *   npx tsx scripts/addDragonflyRenameTrvl.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:dragonfly-trvl-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

const DRAGONFLY = {
  externalId: '1556451',
  brand: 'Bugaboo',
  title: 'Bugaboo Dragonfly Car Seat Adapters',
  productUrl: 'https://www.babylist.com/gp/bugaboo-dragonfly-car-seat-adapters/39932/1556451',
  imageUrl:
    'https://images.ctfassets.net/50gzycvace50/5b5a546adba0afdb55488ea56539dc2d2dcf6150e279d0554a5c73e4f767aa1a/aed472d42a0a5e07a42795c00d748e81/5b5a546adba0afdb55488ea56539dc2d2dcf6150e279d0554a5c73e4f767aa1a.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
  price: 69.95,
};

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Dragonfly adapter + rename TRVL Easy Fold → Nuna TRVL ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // 1. Dragonfly adapter.
  console.log(`Adapter: ${DRAGONFLY.title}  $${DRAGONFLY.price}`);
  if (apply) {
    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'babylist_impact', externalId: DRAGONFLY.externalId } },
      update: {
        brand: DRAGONFLY.brand,
        title: DRAGONFLY.title,
        affiliateUrl: babylistAffiliate(DRAGONFLY.productUrl),
        imageUrl: DRAGONFLY.imageUrl,
        price: DRAGONFLY.price,
        retailer: 'Babylist',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: 'babylist_impact',
        externalId: DRAGONFLY.externalId,
        brand: DRAGONFLY.brand,
        title: DRAGONFLY.title,
        affiliateUrl: babylistAffiliate(DRAGONFLY.productUrl),
        imageUrl: DRAGONFLY.imageUrl,
        price: DRAGONFLY.price,
        retailer: 'Babylist',
        isActiveInFeed: true,
      },
      select: { id: true },
    });
    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: {
        canonicalBrand: DRAGONFLY.brand,
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: DRAGONFLY.brand,
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });
  }

  // 2. Rename TRVL Easy Fold → Nuna TRVL (catalog product 1051516 + Stroller row).
  const trvl = await db.affiliateCatalogProduct.findFirst({
    where: { provider: 'babylist_impact', externalId: '1051516' },
    select: { id: true, title: true, enrichment: { select: { id: true, canonicalName: true } } },
  });
  console.log(`\nTRVL catalog product: ${trvl ? `found ("${trvl.title.slice(0, 50)}" → "Nuna TRVL")` : 'NOT found'}`);
  if (apply && trvl) {
    await db.affiliateCatalogProduct.update({ where: { id: trvl.id }, data: { title: 'Nuna TRVL' } });
    if (trvl.enrichment) {
      await db.productEnrichment.update({ where: { id: trvl.enrichment.id }, data: { canonicalName: 'TRVL' } });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trvlRows: any[] = await db.stroller.findMany({
    where: { brand: { equals: 'Nuna', mode: 'insensitive' }, model: { contains: 'TRVL Easy Fold', mode: 'insensitive' } },
    select: { id: true, model: true },
  });
  console.log(`TRVL Stroller rows to rename → "TRVL": ${trvlRows.length}`);
  if (apply) {
    for (const row of trvlRows) {
      await db.stroller.update({ where: { id: row.id }, data: { model: 'TRVL', displayName: 'Nuna TRVL' } });
    }
  }

  console.log(`\n${apply ? 'Done.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addDragonflyRenameTrvl] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
