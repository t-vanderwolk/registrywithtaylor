/**
 * Add the Mockingbird Single Stroller 3.0 to the public catalog as a full-size
 * stroller (manual_tmbc, Babylist link). Idempotent upsert; dry-run default.
 *
 *   npx tsx scripts/addMockingbirdStroller.ts            # dry run
 *   npx tsx scripts/addMockingbirdStroller.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-mockingbird-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const MANUAL = 'manual_tmbc';
const APPLY = process.argv.includes('--apply');

const ITEM = {
  externalId: 'manual-mockingbird-single-stroller-3-0',
  brand: 'Mockingbird',
  model: 'Single Stroller 3.0',
  productType: 'full-size stroller',
  retailer: 'Babylist',
  affiliateUrl:
    'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fmockingbird-single-stroller-3-0%2F77453%2F2715251&partnerpropertyid=7490466',
  imageUrl:
    'https://images.ctfassets.net/50gzycvace50/97ee8cd96e457358619eb7c68d128b9e503e86a6495eb581781a8aa1e74ca91d/935d658c49441ab0b980d7874a9d4cc9/97ee8cd96e457358619eb7c68d128b9e503e86a6495eb581781a8aa1e74ca91d.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
};

async function main() {
  console.log(`── Add Mockingbird full-size stroller ──  (${APPLY ? 'APPLY' : 'dry-run'})\n`);
  console.log(`  ${APPLY ? '✚ added ' : '· would add '} ${ITEM.brand} ${ITEM.model}  →  ${ITEM.productType}  (${ITEM.retailer})`);

  if (!APPLY) {
    console.log('\n  (dry run — nothing written. Re-run with --apply.)');
    return;
  }
  const raw = await db.affiliateCatalogProduct.upsert({
    where: { provider_externalId: { provider: MANUAL, externalId: ITEM.externalId } },
    update: {
      brand: ITEM.brand,
      title: `${ITEM.brand} ${ITEM.model}`,
      affiliateUrl: ITEM.affiliateUrl,
      imageUrl: ITEM.imageUrl,
      retailer: ITEM.retailer,
      isActiveInFeed: true,
      lastSyncedAt: new Date(),
    },
    create: {
      provider: MANUAL,
      externalId: ITEM.externalId,
      brand: ITEM.brand,
      title: `${ITEM.brand} ${ITEM.model}`,
      affiliateUrl: ITEM.affiliateUrl,
      imageUrl: ITEM.imageUrl,
      retailer: ITEM.retailer,
      isActiveInFeed: true,
    },
    select: { id: true },
  });
  await db.productEnrichment.upsert({
    where: { rawProductId: raw.id },
    update: {
      canonicalBrand: ITEM.brand,
      canonicalName: ITEM.model,
      tmbcCategory: 'Strollers',
      productType: ITEM.productType,
      isPublic: true,
      needsReview: false,
      reviewStatus: 'REVIEWED',
    },
    create: {
      rawProductId: raw.id,
      canonicalBrand: ITEM.brand,
      canonicalName: ITEM.model,
      tmbcCategory: 'Strollers',
      productType: ITEM.productType,
      isPublic: true,
      needsReview: false,
      reviewStatus: 'REVIEWED',
    },
  });
  console.log('\n  Done. The finder should show it within ~10 min (add an image in admin if wanted).');
}

main()
  .catch((error) => {
    console.error('[addMockingbirdStroller] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
