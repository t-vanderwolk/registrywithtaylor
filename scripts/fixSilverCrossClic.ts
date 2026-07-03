/**
 * Silver Cross Clic direct-fit fix. The Clic is a compact travel stroller that
 * clicks directly onto Nuna and Joie infant car seats ONLY — no adapter, and it
 * does NOT take the shared Maxi-Cosi / CYBEX / Clek euro adapter that the rest of
 * the Silver Cross line uses.
 *
 * This script wipes the Clic's existing Compatibility rows (which were seeded by
 * the broad "all Silver Cross frames" adapter rule) and replaces them with DIRECT
 * rows to every Nuna + Joie infant seat. The engine's direct-fit-only guard (in
 * travelSystemCompatibility.ts) keeps the euro-group inference off the Clic, and
 * the universal-adapter rule now excludes it, so this stays correct on re-runs.
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

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Silver Cross Clic direct-fit fix ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  const clics: { id: string; brand: string; model: string; displayName: string | null }[] =
    await db.stroller.findMany({
      where: { brand: { startsWith: 'Silver Cross', mode: 'insensitive' }, model: { contains: 'clic', mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, displayName: true },
    });

  if (clics.length === 0) {
    console.log('  No Silver Cross Clic stroller row found — nothing to do.');
    return;
  }

  const seats: { id: string; brand: string; model: string }[] = await db.carSeat.findMany({
    where: { brand: { in: DIRECT_FIT_SEAT_BRANDS, mode: 'insensitive' }, seatType: 'INFANT' },
    select: { id: true, brand: true, model: true },
  });
  console.log(`  Direct-fit infant seats (Nuna + Joie): ${seats.length}`);
  console.log(`  Clic stroller rows: ${clics.map((c) => c.displayName || `${c.brand} ${c.model}`).join(', ')}\n`);

  for (const clic of clics) {
    const existing = await db.compatibility.count({ where: { strollerId: clic.id } });
    console.log(`  ${clic.displayName || `${clic.brand} ${clic.model}`}: clearing ${existing} existing row(s), adding ${seats.length} DIRECT.`);
    if (!apply) continue;

    await db.compatibility.deleteMany({ where: { strollerId: clic.id } });
    for (const seat of seats) {
      await db.compatibility.create({
        data: {
          strollerId: clic.id,
          carSeatId: seat.id,
          compatibilityType: 'DIRECT',
          adapterRequired: false,
          adapterType: null,
          confidence: 'HIGH',
          notes: `The Silver Cross Clic clicks directly onto ${seat.brand} infant car seats — no adapter needed.`,
        },
      });
    }
  }

  console.log(`\n${apply ? 'Done — Clic now direct-fits Nuna + Joie only.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[fixSilverCrossClic] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
