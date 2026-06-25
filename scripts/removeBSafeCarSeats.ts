/**
 * Remove the discontinued Britax B-Safe infant car seats (B-Safe 35 / Gen2 /
 * Gen2 FlexFit) from the travel-system checker, and hide their catalog listings:
 *   - deletes the CarSeat rows (+ their Compatibility rows), and
 *   - hides any affiliate-catalog product with "B-Safe" in the title.
 * Britax Willow S / SC stay — they're current.
 *
 *   npx tsx scripts/removeBSafeCarSeats.ts            # dry run (default)
 *   npx tsx scripts/removeBSafeCarSeats.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:remove-bsafe-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MODELS = ['B-Safe 35', 'B-Safe Gen2', 'B-Safe Gen2 FlexFit'];

type SeatRow = { id: string; brand: string; model: string };
type CatRow = { id: string; title: string; enrichment: { id: string; reviewStatus: string } | null };

async function main() {
  const apply = process.argv.includes('--apply');

  const seats: SeatRow[] = await db.carSeat.findMany({
    where: { brand: 'Britax', model: { in: MODELS } },
    select: { id: true, brand: true, model: true },
  });
  const catalog: CatRow[] = await db.affiliateCatalogProduct.findMany({
    where: { title: { contains: 'B-Safe', mode: 'insensitive' } },
    select: { id: true, title: true, enrichment: { select: { id: true, reviewStatus: true } } },
  });
  const toHide = catalog.filter((c) => c.enrichment && c.enrichment.reviewStatus !== 'HIDDEN');

  console.log('── Remove discontinued Britax B-Safe ──');
  console.log(`  CarSeat rows to delete: ${seats.length}`);
  seats.forEach((s) => console.log(`    × ${s.brand} ${s.model}`));
  console.log(`\n  catalog "B-Safe" products to hide: ${toHide.length} (of ${catalog.length} matched)`);
  catalog.slice(0, 15).forEach((c) => console.log(`    • ${c.title.slice(0, 70)}`));

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  if (seats.length) {
    const ids = seats.map((s) => s.id);
    // Explicit first (in case the FK wasn't created ON DELETE CASCADE), then the rows.
    await db.compatibility.deleteMany({ where: { carSeatId: { in: ids } } });
    await db.carSeat.deleteMany({ where: { id: { in: ids } } });
  }
  if (toHide.length) {
    await db.productEnrichment.updateMany({
      where: { id: { in: toHide.map((c) => c.enrichment!.id) } },
      data: { reviewStatus: 'HIDDEN', isPublic: false },
    });
  }
  console.log(`\n  Deleted ${seats.length} CarSeat rows and hid ${toHide.length} catalog products.`);
}

main()
  .catch((error) => {
    console.error('[removeBSafeCarSeats] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
