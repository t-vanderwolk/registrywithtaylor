/**
 * Fill the ANB-only adapter gaps (from catalog:audit-anb-adapters) with
 * Babylist/MacroBaby or Amazon links so no stroller loses its "Shop adapter"
 * button after ANB Baby links were removed.
 *
 * Baby Jogger adapters point to MacroBaby (the primary retailer carries them);
 * the manufacturer-only adapters (Bumbleride, Silver Cross Wave, Thule Sleek)
 * point to Amazon with the taylormadebab-20 affiliate tag. Each adapter's title
 * contains the stroller model so the travel-system engine attaches it.
 *
 *   npx tsx scripts/addAdapters.ts            # dry run (default)
 *   npx tsx scripts/addAdapters.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const macroSearch = (q: string) =>
  `https://www.macrobaby.com/search?q=${encodeURIComponent(q)}&_j=taylormadebabyco.com`;
const amazonSearch = (q: string) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=taylormadebab-20`;
const amazonDp = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=taylormadebab-20`;

type AdapterSpec = { externalId: string; title: string; url: string; retailer: string };

const ADAPTERS: AdapterSpec[] = [
  // Baby Jogger → MacroBaby.
  {
    externalId: 'tmbc-adapter-city-mini-gt2',
    title: 'Baby Jogger City Mini GT2 Car Seat Adapter',
    url: macroSearch('Baby Jogger City Mini GT2 car seat adapter'),
    retailer: 'MacroBaby',
  },
  {
    externalId: 'tmbc-adapter-city-select-2',
    title: 'Baby Jogger City Select 2 Car Seat Adapter',
    url: macroSearch('Baby Jogger City Select 2 car seat adapter'),
    retailer: 'MacroBaby',
  },
  {
    externalId: 'tmbc-adapter-summit-x3',
    title: 'Baby Jogger Summit X3 Car Seat Adapter',
    url: macroSearch('Baby Jogger Summit X3 car seat adapter'),
    retailer: 'MacroBaby',
  },
  // Manufacturer-only → Amazon (taylormadebab-20).
  {
    externalId: 'tmbc-adapter-bumbleride-era',
    title: 'Bumbleride Era Car Seat Adapter (Maxi-Cosi / Cybex / Nuna / Clek)',
    url: amazonSearch('Bumbleride Era car seat adapter'),
    retailer: 'Amazon',
  },
  {
    externalId: 'tmbc-adapter-bumbleride-indie-twin',
    title: 'Bumbleride Indie Twin Car Seat Adapter (Maxi-Cosi / Cybex / Nuna / Clek)',
    url: amazonSearch('Bumbleride Indie Twin car seat adapter'),
    retailer: 'Amazon',
  },
  {
    externalId: 'tmbc-adapter-silver-cross-wave',
    title: 'Silver Cross Wave Car Seat Adapter',
    url: amazonSearch('Silver Cross Wave Coast car seat adapter'),
    retailer: 'Amazon',
  },
  {
    externalId: 'tmbc-adapter-thule-sleek',
    title: 'Thule Sleek Car Seat Adapter for Maxi-Cosi',
    url: amazonDp('B07FRRM8VD'),
    retailer: 'Amazon',
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add gap adapters ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const a of ADAPTERS) {
    console.log(`  ${a.retailer.padEnd(9)} ${a.title}`);
    if (!apply) continue;

    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'manual_tmbc', externalId: a.externalId } },
      update: { brand: a.title.split(' ')[0], title: a.title, affiliateUrl: a.url, retailer: a.retailer, isActiveInFeed: true, lastSyncedAt: new Date() },
      create: {
        provider: 'manual_tmbc',
        externalId: a.externalId,
        brand: a.title.split(' ')[0],
        title: a.title,
        affiliateUrl: a.url,
        retailer: a.retailer,
        isActiveInFeed: true,
      },
      select: { id: true },
    });

    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: { tmbcCategory: 'Travel Systems & Adapters', productType: 'car seat adapter', reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
      create: { rawProductId: product.id, tmbcCategory: 'Travel Systems & Adapters', productType: 'car seat adapter', reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
    });
  }

  console.log(`\n${apply ? `Done — added ${ADAPTERS.length} adapter link(s).` : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
