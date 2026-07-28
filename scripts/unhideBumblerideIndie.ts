/**
 * Un-hide the single Bumbleride Indie (NOT the Indie Twin) in the finder + checker.
 *
 * The Indie is an all-terrain / jogger-adjacent single stroller. This finds the
 * Bumbleride "Indie" catalog listing(s) — excluding the Indie Twin, accessories,
 * frames, and bundles — and promotes their enrichment back to a public, reviewed
 * "Strollers" row (jogging bucket). If no listing exists in any feed, it adds a
 * manual_tmbc entry so it still shows.
 *
 *   npx tsx scripts/unhideBumblerideIndie.ts            # dry run (default)
 *   npx tsx scripts/unhideBumblerideIndie.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:unhide-indie-apply
 *
 * After applying, run `npm run strollers:import` to (re)create the Stroller row.
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MANUAL_PROVIDER = 'manual_tmbc';
const PRODUCT_TYPE = 'jogging stroller';
const PRODUCT_PATH = 'Home > Newborn Must-Haves > Strollers > Jogging Strollers';

// Accessory / part / bundle rather than the stroller itself.
const ACCESSORY_RE =
  /\b(adapter|adaptor|rain ?cover|bundle|footmuff|cup ?holder|organi[sz]er|tray|cover|stand|frame only|stroller frame|chassis|wheel|tire|canopy|liner|board|parasol|bassinet|carry ?cot|seat liner|bag)\b/i;

// The single Indie: matches "indie" but never the "Indie Twin" double.
const isSingleIndie = (title: string) => /\bindie\b/i.test(title) && !/\bindie\s*twin\b/i.test(title);

type Cat = {
  id: string;
  provider: string;
  title: string;
  isActiveInFeed: boolean;
  enrichment: { id: string; reviewStatus: string | null; tmbcCategory: string | null; productType: string | null; isPublic: boolean | null } | null;
};

async function promote(rawId: string) {
  await db.productEnrichment.upsert({
    where: { rawProductId: rawId },
    update: {
      tmbcCategory: 'Strollers',
      productType: PRODUCT_TYPE,
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
    },
    create: {
      rawProductId: rawId,
      tmbcCategory: 'Strollers',
      productType: PRODUCT_TYPE,
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
    },
  });
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Un-hide Bumbleride Indie (single) ──  (${apply ? 'APPLY' : 'dry run'})\n`);

  const catalog: Cat[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Bumbleride', mode: 'insensitive' } },
    select: {
      id: true,
      provider: true,
      title: true,
      isActiveInFeed: true,
      enrichment: { select: { id: true, reviewStatus: true, tmbcCategory: true, productType: true, isPublic: true } },
    },
  });

  const matches = catalog.filter((c) => isSingleIndie(c.title) && !ACCESSORY_RE.test(c.title));

  console.log(`  ${catalog.length} Bumbleride catalog listing(s) total; ${matches.length} single-Indie stroller match(es):`);
  matches.forEach((c) =>
    console.log(
      `    • [${c.provider}] ${c.title.slice(0, 64)}  [${c.enrichment?.tmbcCategory ?? '—'}/${c.enrichment?.reviewStatus ?? 'no-enrichment'}${c.enrichment?.isPublic ? '' : '/hidden'}]`,
    ),
  );

  if (matches.length === 0) {
    console.log(`\n  Not in any feed — ${apply ? 'adding' : 'would add'} manual entry "Bumbleride Indie".`);
    if (apply) {
      const raw = await db.affiliateCatalogProduct.upsert({
        where: { provider_externalId: { provider: MANUAL_PROVIDER, externalId: 'bumbleride-indie' } },
        update: { brand: 'Bumbleride', title: 'Bumbleride Indie Stroller', productTypePath: PRODUCT_PATH, isActiveInFeed: true, lastSyncedAt: new Date() },
        create: {
          provider: MANUAL_PROVIDER,
          externalId: 'bumbleride-indie',
          brand: 'Bumbleride',
          title: 'Bumbleride Indie Stroller',
          productTypePath: PRODUCT_PATH,
          isActiveInFeed: true,
          affiliateUrl: null,
          price: null,
          imageUrl: null,
        },
      });
      await promote(raw.id);
      console.log('    ✓ added manual_tmbc "Bumbleride Indie Stroller" and made it public.');
    }
  } else if (apply) {
    for (const c of matches) await promote(c.id);
    console.log(`\n  ✓ un-hid + promoted ${matches.length} listing(s).`);
  }

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply, then `npm run strollers:import`.)');
    return;
  }
  console.log('\nDone. Next: `npm run strollers:import` to (re)create the Stroller row for the checker.');
  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[unhideBumblerideIndie] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
