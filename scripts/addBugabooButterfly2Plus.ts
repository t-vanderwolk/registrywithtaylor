/**
 * Add the Bugaboo Butterfly 2 Plus as a NEW public stroller catalog product.
 *
 * The Butterfly 2 Plus is a distinct model from the Butterfly 2 (fuller recline,
 * newborn-ready). This creates a manual_tmbc raw product + enrichment flagged
 * public "Strollers", mirroring scripts/addReleased2026CatalogProducts.ts.
 *
 * Buy links (Babylist product page + Amazon B0H4MFBV9N) are already wired in
 * lib/travelSystemAffiliateLinks.ts under `Bugaboo:::Butterfly 2 Plus`, and the
 * travel-system compatibility entry is in lib/guides/travelSystemCompatibility.ts.
 *
 * Idempotent — safe to re-run.
 *
 *   # dry run (report only)
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/addBugabooButterfly2Plus.ts
 *
 *   # apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/addBugabooButterfly2Plus.ts --apply
 *
 * After --apply, rebuild the finder's Stroller rows so the card appears:
 *   heroku run "npm run strollers:import" -a registrywithtaylor
 */
import prismaBase from '@/lib/server/prisma';
import { babylistShopLink } from '@/lib/travelSystemAffiliateLinks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');
const MANUAL = 'manual_tmbc';

const PRODUCT = {
  brand: 'Bugaboo',
  model: 'Butterfly 2 Plus',
  externalId: 'manual-bugaboo-butterfly-2-plus',
  // Babylist product page, affiliate-tracked via the TMBC Impact tracker.
  affiliateUrl: babylistShopLink('https://www.babylist.com/gp/bugaboo-butterfly-2-plus-stroller/86187/3571867'),
  // Optional: paste a product image URL (Babylist/Amazon) to show on the card.
  // Leaving null renders a brand fallback tile until an image is set in admin.
  imageUrl: null as string | null,
  retailer: 'Babylist',
  tmbcCategory: 'Strollers',
  productType: 'Compact',
};

async function main() {
  const title = `${PRODUCT.brand} ${PRODUCT.model}`;

  const existing = await db.affiliateCatalogProduct.findUnique({
    where: { provider_externalId: { provider: MANUAL, externalId: PRODUCT.externalId } },
    select: { id: true },
  });
  console.log(existing ? `• ${title} already exists — will update` : `• ${title} is new — will create`);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to write, then `npm run strollers:import`.');
    return;
  }

  const raw = await db.affiliateCatalogProduct.upsert({
    where: { provider_externalId: { provider: MANUAL, externalId: PRODUCT.externalId } },
    update: {
      brand: PRODUCT.brand,
      title,
      affiliateUrl: PRODUCT.affiliateUrl,
      imageUrl: PRODUCT.imageUrl,
      retailer: PRODUCT.retailer,
      isActiveInFeed: true,
      lastSyncedAt: new Date(),
    },
    create: {
      provider: MANUAL,
      externalId: PRODUCT.externalId,
      brand: PRODUCT.brand,
      title,
      affiliateUrl: PRODUCT.affiliateUrl,
      imageUrl: PRODUCT.imageUrl,
      retailer: PRODUCT.retailer,
      isActiveInFeed: true,
    },
    select: { id: true },
  });

  await db.productEnrichment.upsert({
    where: { rawProductId: raw.id },
    update: {
      canonicalBrand: PRODUCT.brand,
      tmbcCategory: PRODUCT.tmbcCategory,
      productType: PRODUCT.productType,
      isPublic: true,
      needsReview: false,
      reviewStatus: 'REVIEWED',
    },
    create: {
      rawProductId: raw.id,
      canonicalBrand: PRODUCT.brand,
      tmbcCategory: PRODUCT.tmbcCategory,
      productType: PRODUCT.productType,
      isPublic: true,
      needsReview: false,
      reviewStatus: 'REVIEWED',
    },
  });

  console.log(`✓ ${title} added as a public stroller.`);
  console.log('  Next: heroku run "npm run strollers:import" -a registrywithtaylor');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect?.());
