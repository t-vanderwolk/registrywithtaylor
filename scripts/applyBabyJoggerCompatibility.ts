/**
 * Apply Baby Jogger travel-system compatibility strictly from the manufacturer's
 * published adapter catalogue (lib/catalog/babyJoggerAdapters).
 *
 * Baby Jogger is NOT a universal-adapter brand: it makes its own infant seat
 * (City GO 2) and sells a separate adapter per stroller + seat-brand pairing.
 * So instead of a single Nuna trigger row + shared-group inference, every pair
 * here is written explicitly as an ADAPTER row.
 *
 * Same-brand (Baby Jogger City GO) compatibility is handled by the engine's
 * same-brand default and is not written here.
 *
 * Reports every stroller it could NOT place, including the frames Baby Jogger
 * publishes no adapter for, so gaps stay visible rather than silent.
 *
 *   npx tsx scripts/applyBabyJoggerCompatibility.ts            # dry run
 *   npx tsx scripts/applyBabyJoggerCompatibility.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:baby-jogger-compat-apply
 */
import prismaBase from '@/lib/server/prisma';
import { babyJoggerSeatBrands, babyJoggerNoAdapterNote } from '@/lib/catalog/babyJoggerAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

type Row = { id: string; brand: string; model: string; displayName: string | null };

async function main() {
  console.log(`── Baby Jogger compatibility (manufacturer-published only) ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const strollers: Row[] = await db.stroller.findMany({
    where: { brand: { equals: 'Baby Jogger', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: { model: 'asc' },
  });

  if (strollers.length === 0) {
    console.error('No Baby Jogger strollers found.');
    process.exitCode = 1;
    return;
  }

  // Infant seats for every brand the matrix references, fetched once.
  const allBrands = Array.from(
    new Set(strollers.flatMap((s) => babyJoggerSeatBrands(s.model).seatBrands)),
  );
  const seatsByBrand = new Map<string, Row[]>();
  for (const brand of allBrands) {
    const seats: Row[] = await db.carSeat.findMany({
      where: { brand: { equals: brand, mode: 'insensitive' }, seatType: 'INFANT' },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: { model: 'asc' },
    });
    seatsByBrand.set(brand.toLowerCase(), seats);
    if (seats.length === 0) console.log(`  ! no INFANT seats in catalog for brand "${brand}"`);
  }

  let created = 0;
  let existing = 0;
  const skipped: string[] = [];

  for (const stroller of strollers) {
    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;
    const { seatBrands, source } = babyJoggerSeatBrands(stroller.model);

    if (seatBrands.length === 0) {
      const note = babyJoggerNoAdapterNote(stroller.model);
      skipped.push(`${label} — ${note ?? 'no matching adapter rule'}`);
      continue;
    }

    const seats = seatBrands.flatMap((b) => seatsByBrand.get(b.toLowerCase()) ?? []);
    console.log(`  ${label}`);
    console.log(`      ${seatBrands.join(', ')}  (${seats.length} seats)  ← ${source}`);

    for (const seat of seats) {
      const found = await db.compatibility.findFirst({
        where: { strollerId: stroller.id, carSeatId: seat.id },
        select: { id: true },
      });
      if (found) {
        existing += 1;
        continue;
      }
      created += 1;
      if (APPLY) {
        await db.compatibility.create({
          data: {
            strollerId: stroller.id,
            carSeatId: seat.id,
            compatibilityType: 'ADAPTER',
            adapterRequired: true,
            adapterType: null,
            // HIGH: transcribed directly from Baby Jogger's published adapter
            // catalogue, not inferred from a shared-adapter standard.
            confidence: 'HIGH',
            notes: `Baby Jogger sells a car seat adapter for this pairing (${source}). Adapter sold separately — confirm the exact part for your model year before purchase.`,
          },
        });
      }
    }
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${created} new row(s), ${existing} already present.`);
  if (skipped.length) {
    console.log(`\nNo adapter published (${skipped.length}):`);
    for (const line of skipped) console.log(`  · ${line}`);
  }
  if (!APPLY) console.log('\nRe-run with --apply to write these rows.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[babyJoggerCompatibility] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
