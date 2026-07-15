/**
 * Add two Thule strollers to the public catalog as manual_tmbc products:
 *   • Thule Urban Glide 3 Double → Strollers, "double" (Babylist link)
 *   • Thule Shine                → Strollers, "compact" (Amazon link)
 *
 * Finder category is pinned via CATEGORY_OVERRIDES['thule'] in strollerModelMerges.
 * Idempotent upsert; dry-run default.
 *
 *   npx tsx scripts/addThuleStrollers.ts            # dry run
 *   npx tsx scripts/addThuleStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-thule-strollers-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const MANUAL = 'manual_tmbc';
const APPLY = process.argv.includes('--apply');

type Item = {
  externalId: string;
  brand: string;
  model: string;
  productType: string;
  retailer: string;
  affiliateUrl: string;
};

const ITEMS: Item[] = [
  {
    externalId: 'manual-thule-urban-glide-3-double',
    brand: 'Thule',
    model: 'Urban Glide 3 Double',
    productType: 'double stroller',
    retailer: 'Babylist',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fthule-urban-glide-3-double%2F47017%2F2687778&partnerpropertyid=7490466',
  },
  {
    externalId: 'manual-thule-shine',
    brand: 'Thule',
    model: 'Shine',
    productType: 'compact stroller',
    retailer: 'Amazon',
    affiliateUrl: 'https://amzn.to/4wI8vm7',
  },
];

async function upsert(it: Item) {
  const raw = await db.affiliateCatalogProduct.upsert({
    where: { provider_externalId: { provider: MANUAL, externalId: it.externalId } },
    update: {
      brand: it.brand,
      title: `${it.brand} ${it.model}`,
      affiliateUrl: it.affiliateUrl,
      retailer: it.retailer,
      isActiveInFeed: true,
      lastSyncedAt: new Date(),
    },
    create: {
      provider: MANUAL,
      externalId: it.externalId,
      brand: it.brand,
      title: `${it.brand} ${it.model}`,
      affiliateUrl: it.affiliateUrl,
      retailer: it.retailer,
      isActiveInFeed: true,
    },
    select: { id: true },
  });
  await db.productEnrichment.upsert({
    where: { rawProductId: raw.id },
    update: {
      canonicalBrand: it.brand,
      canonicalName: it.model,
      tmbcCategory: 'Strollers',
      productType: it.productType,
      isPublic: true,
      needsReview: false,
      reviewStatus: 'REVIEWED',
    },
    create: {
      rawProductId: raw.id,
      canonicalBrand: it.brand,
      canonicalName: it.model,
      tmbcCategory: 'Strollers',
      productType: it.productType,
      isPublic: true,
      needsReview: false,
      reviewStatus: 'REVIEWED',
    },
  });
}

async function main() {
  console.log(`── Add Thule strollers ──  (${APPLY ? 'APPLY' : 'dry-run'})\n`);
  for (const it of ITEMS) {
    console.log(`  ${APPLY ? '✚ added ' : '· would add '} ${it.brand} ${it.model}  →  ${it.productType}  (${it.retailer})`);
    if (APPLY) await upsert(it);
  }
  if (!APPLY) console.log('\n  (dry run — nothing written. Re-run with --apply.)');
  else console.log('\n  Done. The finder should show them within ~10 min (no image yet — add one in admin if wanted).');
}

main()
  .catch((error) => {
    console.error('[addThuleStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
