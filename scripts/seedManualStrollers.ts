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

type SeedItem = {
  externalId: string;
  brand: string;
  title: string;
  path: string;
  productType: string;
  /** Babylist (Impact) affiliate URL. TRIV lx / FLEX are sold only as PIPA urbn systems. */
  affiliateUrl?: string | null;
  imageUrl?: string | null;
};

const ITEMS: SeedItem[] = [
  {
    externalId: 'nuna-triv-lx',
    brand: 'Nuna',
    title: 'Nuna TRIV LX Stroller',
    path: 'Home > Newborn Must-Haves > Strollers > Compact Strollers',
    productType: 'compact stroller',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fnuna-pipa-urbn-triv-lx%2F77435%2F2699230&partnerpropertyid=7490466',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/9cef694938b2887cfca52cde158f1444fb24611d4f40641b4bf7d05ad7508585/cbcd605c058df3c3151ce1df6a948f72/9cef694938b2887cfca52cde158f1444fb24611d4f40641b4bf7d05ad7508585.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
  },
  {
    externalId: 'nuna-flex',
    brand: 'Nuna',
    title: 'Nuna FLEX Stroller',
    path: 'Home > Newborn Must-Haves > Strollers > Compact Strollers',
    productType: 'compact stroller',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fnuna-flex-system-frame-adapter%2F77443%2F2699253&partnerpropertyid=7490466',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/b5c5b8cf3e77a22b9ddcc6f51b7ea986c335a4525c9723dcdcc830ed499290df/477916074d209381712fea0445fe2da1/b5c5b8cf3e77a22b9ddcc6f51b7ea986c335a4525c9723dcdcc830ed499290df.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
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
        affiliateUrl: it.affiliateUrl ?? null,
        imageUrl: it.imageUrl ?? null,
      },
      create: {
        provider: PROVIDER,
        externalId: it.externalId,
        brand: it.brand,
        title: it.title,
        productTypePath: it.path,
        isActiveInFeed: true,
        affiliateUrl: it.affiliateUrl ?? null,
        price: null,
        imageUrl: it.imageUrl ?? null,
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
