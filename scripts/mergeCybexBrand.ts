/**
 * Merge the "CYBEX" and "Cybex" brand fields into a single canonical "Cybex"
 * across every table the finder/checker read from, so the tools show one Cybex
 * brand group with one logo. Normalizes any casing variant (CYBEX, cybex, …) to
 * "Cybex" in:
 *   • AffiliateCatalogProduct.brand
 *   • ProductEnrichment.canonicalBrand
 *   • Stroller.brand
 *   • CarSeat.brand
 *
 *   npx tsx scripts/mergeCybexBrand.ts            # dry run (default)
 *   npx tsx scripts/mergeCybexBrand.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:merge-cybex-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const CANON = 'Cybex';

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Merge Cybex / CYBEX brand fields ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // Any casing that is Cybex but not exactly "Cybex".
  const notCanon = { equals: CANON, mode: 'insensitive' as const };

  const catalog = await db.affiliateCatalogProduct.count({
    where: { brand: notCanon, NOT: { brand: CANON } },
  });
  const enrichment = await db.productEnrichment.count({
    where: { canonicalBrand: notCanon, NOT: { canonicalBrand: CANON } },
  });
  const strollers = await db.stroller.count({
    where: { brand: notCanon, NOT: { brand: CANON } },
  });
  const carSeats = await db.carSeat.count({
    where: { brand: notCanon, NOT: { brand: CANON } },
  });

  console.log(`  AffiliateCatalogProduct.brand   → ${catalog} to normalize`);
  console.log(`  ProductEnrichment.canonicalBrand → ${enrichment} to normalize`);
  console.log(`  Stroller.brand                  → ${strollers} to normalize`);
  console.log(`  CarSeat.brand                   → ${carSeats} to normalize`);

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const r1 = await db.affiliateCatalogProduct.updateMany({
    where: { brand: notCanon, NOT: { brand: CANON } },
    data: { brand: CANON },
  });
  const r2 = await db.productEnrichment.updateMany({
    where: { canonicalBrand: notCanon, NOT: { canonicalBrand: CANON } },
    data: { canonicalBrand: CANON },
  });
  const r3 = await db.stroller.updateMany({
    where: { brand: notCanon, NOT: { brand: CANON } },
    data: { brand: CANON },
  });
  const r4 = await db.carSeat.updateMany({
    where: { brand: notCanon, NOT: { brand: CANON } },
    data: { brand: CANON },
  });

  console.log(`\n  Normalized: catalog ${r1.count}, enrichment ${r2.count}, strollers ${r3.count}, carSeats ${r4.count}.`);
}

main()
  .catch((error) => {
    console.error('[mergeCybexBrand] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
