/**
 * Add strollers that aren't in the Babylist feed, by hand. They use a separate
 * provider ("manual_tmbc") so the feed import (which only deactivates
 * provider="babylist_impact" rows) never touches them, and reviewStatus=REVIEWED
 * so recategorize won't overwrite the category. They surface in the finder (and,
 * after `strollers:import`, the checker) like any other catalog stroller.
 *
 * No Babylist affiliate URL is fabricated — affiliateUrl stays null and the buy
 * button falls back to a tracked Nuna brand listing.
 *
 *   npx tsx scripts/seedManualStrollers.ts            # dry run (default)
 *   npx tsx scripts/seedManualStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:seed-manual
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PROVIDER = 'manual_tmbc';

const ITEMS = [
  {
    externalId: 'nuna-triv-lx',
    brand: 'Nuna',
    title: 'Nuna TRIV LX Stroller',
    path: 'Home > Newborn Must-Haves > Strollers > Compact Strollers',
    productType: 'compact stroller',
  },
  {
    externalId: 'nuna-viaa-cabn',
    brand: 'Nuna',
    title: 'Nuna VIAA Cabn Stroller',
    path: 'Home > Newborn Must-Haves > Strollers > Travel Strollers',
    productType: 'travel stroller',
  },
];

async function main() {
  const apply = process.argv.includes('--apply');

  console.log('── Add manual strollers (provider: manual_tmbc) ──');
  for (const it of ITEMS) {
    if (!apply) {
      console.log(`  would add: ${it.title}  →  ${it.productType}`);
      continue;
    }
    const raw = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: PROVIDER, externalId: it.externalId } },
      update: {
        brand: it.brand,
        title: it.title,
        productTypePath: it.path,
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: PROVIDER,
        externalId: it.externalId,
        brand: it.brand,
        title: it.title,
        productTypePath: it.path,
        isActiveInFeed: true,
        affiliateUrl: null,
        price: null,
        imageUrl: null,
      },
    });
    await db.productEnrichment.upsert({
      where: { rawProductId: raw.id },
      update: {
        tmbcCategory: 'Strollers',
        productType: it.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: raw.id,
        tmbcCategory: 'Strollers',
        productType: it.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });
    console.log(`  added: ${it.title}  →  ${it.productType}`);
  }

  if (!apply) console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
}

main()
  .catch((error) => {
    console.error('[seedManualStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
