/**
 * Silver Cross Clic direct-fit fix. The Clic is a compact travel stroller that
 * clicks directly onto Nuna PIPA-series and Joie Mint Latch infant car seats
 * ONLY — no adapter, and it does NOT take the shared Maxi-Cosi / CYBEX / Clek
 * adapter that the rest of the Silver Cross target lineup uses.
 *
 * This script wipes the Clic's existing Compatibility rows (which were seeded by
 * the broad "all Silver Cross frames" adapter rule) and replaces them with DIRECT
 * rows to Nuna PIPA-series + Joie Mint Latch only. The engine's direct-fit-only
 * guard (in travelSystemCompatibility.ts) keeps shared-adapter inference off the
 * Clic, and the universal-adapter rule excludes it, so this stays correct on
 * re-runs.
 *
 *   npx tsx scripts/fixSilverCrossClic.ts            # dry run (default)
 *   npx tsx scripts/fixSilverCrossClic.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-silver-cross-clic-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const DIRECT_FIT_SEAT_BRANDS = ['Nuna', 'Joie'];

function isClicModel(model: string) {
  return model.trim().toLowerCase() === 'clic';
}

function isClicCompatibleSeat(seat: { brand: string; model: string; displayName?: string | null }) {
  const brand = seat.brand.trim().toLowerCase();
  const text = `${seat.model} ${seat.displayName ?? ''}`.toLowerCase();
  if (brand === 'nuna') return /\bpipa\b/.test(text);
  if (brand === 'joie') return /\bmint\b/.test(text) && /\blatch\b/.test(text);
  return false;
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Silver Cross Clic direct-fit fix ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  const clicRows: { id: string; brand: string; model: string; displayName: string | null }[] =
    await db.stroller.findMany({
      where: { brand: { startsWith: 'Silver Cross', mode: 'insensitive' }, model: { contains: 'clic', mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, displayName: true },
    });

  if (clicRows.length === 0) {
    console.log('  No Silver Cross Clic stroller row found — nothing to do.');
    return;
  }
  const clics = clicRows.filter((row) => isClicModel(row.model));
  const staleClicRows = clicRows.filter((row) => !isClicModel(row.model));

  if (clics.length === 0) {
    console.log('  No exact Silver Cross Clic stroller row found — stale Clic-like rows will only be cleared.');
  }

  const seats: { id: string; brand: string; model: string }[] = await db.carSeat.findMany({
    where: { brand: { in: DIRECT_FIT_SEAT_BRANDS, mode: 'insensitive' }, seatType: 'INFANT' },
    select: { id: true, brand: true, model: true, displayName: true },
  });
  const directFitSeats = seats.filter(isClicCompatibleSeat);
  console.log(`  Direct-fit infant seats (Nuna PIPA-series + Joie Mint Latch): ${directFitSeats.length}`);
  console.log(`  Clic stroller rows: ${clics.map((c) => c.displayName || `${c.brand} ${c.model}`).join(', ')}\n`);
  if (staleClicRows.length) {
    console.log(`  Stale Clic-like rows to clear only: ${staleClicRows.map((c) => c.displayName || `${c.brand} ${c.model}`).join(', ')}\n`);
  }

  for (const stale of staleClicRows) {
    const existing = await db.compatibility.count({ where: { strollerId: stale.id } });
    console.log(`  ${stale.displayName || `${stale.brand} ${stale.model}`}: clearing ${existing} duplicate row(s), adding 0.`);
    if (apply) await db.compatibility.deleteMany({ where: { strollerId: stale.id } });
  }

  for (const clic of clics) {
    const existing = await db.compatibility.count({ where: { strollerId: clic.id } });
    console.log(`  ${clic.displayName || `${clic.brand} ${clic.model}`}: clearing ${existing} existing row(s), adding ${directFitSeats.length} DIRECT.`);
    if (!apply) continue;

    await db.compatibility.deleteMany({ where: { strollerId: clic.id } });
    for (const seat of directFitSeats) {
      await db.compatibility.create({
        data: {
          strollerId: clic.id,
          carSeatId: seat.id,
          compatibilityType: 'DIRECT',
          adapterRequired: false,
          adapterType: null,
          confidence: 'HIGH',
          notes: `The Silver Cross Clic clicks directly onto ${seat.brand} ${seat.model} — no adapter needed.`,
        },
      });
    }
  }

  console.log(`\n${apply ? 'Done — Clic now direct-fits Nuna PIPA-series + Joie Mint Latch only.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[fixSilverCrossClic] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
