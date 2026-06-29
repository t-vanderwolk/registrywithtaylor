/**
 * Replace the Peg Perego "City Loop Chassis" (a frame-only listing that wrongly
 * imported as a stroller) with the actual "City Loop" stroller.
 *
 *   • Catalog (finder): HIDE every "City Loop Chassis" product, and PROMOTE the
 *     real "City Loop … Reversible Stroller" colourways to a public REVIEWED
 *     stroller so the finder shows the complete product.
 *   • Checker (Stroller table): DELETE the "City Loop Chassis" row and upsert a
 *     single "Peg Perego City Loop" row. MacroBaby url/price/image attach at
 *     runtime via the brand:::model match (the parser now drops "Reversible",
 *     so the catalog title resolves to "City Loop").
 *
 * Pairs with two code fixes: parseStrollerModel strips "Reversible", and the
 * MacroBaby importer skips frame-only chassis. Run those (re-import) first if the
 * real stroller isn't in the catalog yet — this script will tell you.
 *
 *   npx tsx scripts/fixPegPeregoCityLoop.ts            # dry run (default)
 *   npx tsx scripts/fixPegPeregoCityLoop.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-city-loop-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const BRAND = 'Peg Perego';
const MODEL = 'City Loop';

const isChassis = (t: string) =>
  /\bcity loop\b/i.test(t) && /\bchassis\b/i.test(t) && !/\bseat\b/i.test(t);

const isRealStroller = (t: string) =>
  /\bcity loop\b/i.test(t) &&
  /\bstroller\b/i.test(t) &&
  !/\bchassis\b/i.test(t) &&
  !/\b(seat metal|seat box|combo|adapter|travel bag|infant car seat|nest)\b/i.test(t);

type Cat = {
  id: string;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const catalog: Cat[] = await db.affiliateCatalogProduct.findMany({
    where: { provider: 'shopify_macrobaby', title: { contains: 'City Loop', mode: 'insensitive' } },
    select: {
      id: true,
      title: true,
      price: true,
      imageUrl: true,
      affiliateUrl: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } },
    },
  });

  const chassis = catalog.filter((c) => isChassis(c.title));
  const real = catalog.filter((c) => isRealStroller(c.title));

  console.log('── Fix Peg Perego City Loop (chassis → real stroller) ──');
  console.log(`\n  catalog "City Loop" products: ${catalog.length}`);
  catalog.forEach((c) =>
    console.log(`    • ${c.title.slice(0, 72)}  [${c.enrichment?.tmbcCategory ?? '—'}/${c.enrichment?.reviewStatus ?? 'no-enrichment'}]`),
  );
  console.log(`\n  → chassis to HIDE: ${chassis.length}`);
  chassis.forEach((c) => console.log(`    × ${c.title.slice(0, 72)}`));
  console.log(`  → real stroller colourways to PROMOTE: ${real.length}`);
  real.forEach((c) => console.log(`    ✓ ${c.title.slice(0, 72)}  ($${c.price ?? '—'})`));

  const strollerRows: Array<{ id: string; brand: string; model: string; displayName: string | null }> =
    await db.stroller.findMany({
      where: { brand: { contains: 'Peg', mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, displayName: true },
    });
  const chassisStrollers = strollerRows.filter((s) => isChassis(`${s.model} ${s.displayName ?? ''}`));
  console.log(`\n  Stroller rows to DELETE (chassis): ${chassisStrollers.length}`);
  chassisStrollers.forEach((s) => console.log(`    × ${s.brand} | ${s.model}`));

  if (real.length === 0) {
    console.log('\n  ⚠ No real "City Loop … Stroller" product in the catalog yet. Run');
    console.log('    `npm run catalog:import-macrobaby-apply` first (the importer fix pulls it in),');
    console.log('    then re-run this script to finish the swap.');
  }

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  // 1) Hide chassis catalog products (drops them from finder + checker).
  const chassisEnrichIds = chassis.map((c) => c.enrichment?.id).filter(Boolean);
  if (chassisEnrichIds.length) {
    const res = await db.productEnrichment.updateMany({
      where: { id: { in: chassisEnrichIds } },
      data: { reviewStatus: 'HIDDEN', isPublic: false, needsReview: false },
    });
    console.log(`\n  Hid ${res.count} chassis catalog product(s).`);
  }

  // 2) Promote the real City Loop stroller colourways to public, reviewed strollers.
  let promoted = 0;
  for (const c of real) {
    if (c.enrichment?.id) {
      await db.productEnrichment.update({
        where: { id: c.enrichment.id },
        data: {
          tmbcCategory: 'Strollers',
          productType: 'full-size stroller',
          reviewStatus: 'REVIEWED',
          isPublic: true,
          needsReview: false,
        },
      });
    } else {
      await db.productEnrichment.create({
        data: {
          rawProductId: c.id,
          tmbcCategory: 'Strollers',
          productType: 'full-size stroller',
          reviewStatus: 'REVIEWED',
          isPublic: true,
          needsReview: false,
        },
      });
    }
    promoted += 1;
  }
  if (promoted) console.log(`  Promoted ${promoted} real City Loop colourway(s) to public strollers.`);

  // 3) Delete the chassis Stroller row(s) (Compatibility cascades).
  const chassisIds = chassisStrollers.map((s) => s.id);
  if (chassisIds.length) {
    const res = await db.stroller.deleteMany({ where: { id: { in: chassisIds } } });
    console.log(`  Deleted ${res.count} chassis Stroller row(s).`);
  }

  // 4) Ensure a single "Peg Perego City Loop" Stroller row exists (only if the
  //    real product is in the catalog, so it has a public retailer at runtime).
  if (real.length) {
    const existing = await db.stroller.findFirst({
      where: { brand: { equals: BRAND, mode: 'insensitive' }, model: { equals: MODEL, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) {
      console.log(`  Stroller row "${BRAND} ${MODEL}" already present — left as is.`);
    } else {
      await db.stroller.create({
        data: {
          brand: BRAND,
          model: MODEL,
          displayName: `${BRAND} ${MODEL}`,
          babylistSku: null,
          babylistUrl: null,
          babylistPrice: null,
          babylistImage: null,
          babylistUpdatedAt: new Date(),
        },
      });
      console.log(`  Created Stroller row "${BRAND} ${MODEL}" (MacroBaby offer attaches at runtime).`);
    }
  }

  console.log('\n  Done. Peg Perego is a same-brand-default brand, so City Loop shows Peg Perego seats automatically.');
}

main()
  .catch((error) => {
    console.error('[fixPegPeregoCityLoop] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
