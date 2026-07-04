/**
 * Add the Nuna PIPA urbn as its own infant car seat in the checker.
 *
 * The PIPA urbn is baseless and is ONLY sold bundled as a travel system with a
 * Nuna stroller (no standalone purchase). It carries the exact same adapter
 * capability as every other Nuna PIPA seat, so this script:
 *   1. Upserts the CarSeat "Nuna PIPA urbn" (INFANT) with a travel-system-only
 *      summary and NO standalone buy link. It surfaces in the checker via the
 *      travel-system-only allowance in lib/compatibilityEngine + travelSystemCompatibility.
 *   2. Clones every Compatibility row from the reference Nuna PIPA seat (the one
 *      with the most matches) so the urbn matches the same strollers, direct
 *      fits, and adapters.
 *
 *   npx tsx scripts/addPipaUrbn.ts            # dry run (default)
 *   npx tsx scripts/addPipaUrbn.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-pipa-urbn-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const BRAND = 'Nuna';
const MODEL = 'PIPA urbn';
const DISPLAY = 'Nuna PIPA urbn';
const SUMMARY =
  'The Nuna PIPA urbn is the baseless PIPA that installs with just the vehicle belt, so there is no base to buy or wrestle into the car. One catch worth knowing: it is only sold bundled as a travel system with a Nuna stroller, never on its own. The upside is it clicks into the exact same adapters as every other PIPA in the lineup, so your stroller options do not shrink one bit.';

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Nuna PIPA urbn (travel-system-only infant seat) ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // Pick the reference Nuna PIPA seat with the most compatibility rows.
  const refs: Array<{ id: string; model: string; _count: { compatibilities: number } }> =
    await db.carSeat.findMany({
      where: {
        brand: { equals: BRAND, mode: 'insensitive' },
        seatType: 'INFANT',
        model: { contains: 'pipa', mode: 'insensitive' },
        NOT: { model: { contains: 'urbn', mode: 'insensitive' } },
      },
      select: { id: true, model: true, _count: { select: { compatibilities: true } } },
      orderBy: { model: 'asc' },
    });

  if (refs.length === 0) {
    console.error('  No reference Nuna PIPA seat found — cannot clone compatibility. Aborting.');
    process.exitCode = 1;
    return;
  }

  const reference = refs.slice().sort((a, b) => b._count.compatibilities - a._count.compatibilities)[0];
  console.log(`  Reference seat: Nuna ${reference.model} (${reference._count.compatibilities} compatibility rows)\n`);

  if (!apply) {
    console.log('  Would upsert CarSeat "Nuna PIPA urbn" (INFANT, travel-system-only, no buy link).');
    console.log(`  Would clone ${reference._count.compatibilities} compatibility rows from Nuna ${reference.model}.`);
    console.log('\n  (dry run — re-run with --apply.)');
    return;
  }

  // 1. Upsert the car seat. No babylist/amazon buy fields (travel-system-only).
  const existing = await db.carSeat.findFirst({
    where: { brand: { equals: BRAND, mode: 'insensitive' }, model: { equals: MODEL, mode: 'insensitive' } },
    select: { id: true },
  });
  const seat = existing
    ? await db.carSeat.update({
        where: { id: existing.id },
        data: { displayName: DISPLAY, summary: SUMMARY, seatType: 'INFANT' },
        select: { id: true },
      })
    : await db.carSeat.create({
        data: { brand: BRAND, model: MODEL, displayName: DISPLAY, summary: SUMMARY, seatType: 'INFANT' },
        select: { id: true },
      });

  // 2. Clone compatibility rows from the reference seat.
  const refRows: Array<{
    strollerId: string;
    compatibilityType: string;
    adapterRequired: boolean;
    adapterType: string | null;
    notes: string | null;
    confidence: string;
    adapterBabylistUrl: string | null;
    adapterPrice: number | null;
    adapterImage: string | null;
    adapterBabylistSku: string | null;
  }> = await db.compatibility.findMany({
    where: { carSeatId: reference.id },
    select: {
      strollerId: true,
      compatibilityType: true,
      adapterRequired: true,
      adapterType: true,
      notes: true,
      confidence: true,
      adapterBabylistUrl: true,
      adapterPrice: true,
      adapterImage: true,
      adapterBabylistSku: true,
    },
  });

  let created = 0;
  let skipped = 0;
  for (const r of refRows) {
    const already = await db.compatibility.findFirst({
      where: { strollerId: r.strollerId, carSeatId: seat.id },
      select: { id: true },
    });
    if (already) {
      skipped += 1;
      continue;
    }
    await db.compatibility.create({
      data: {
        strollerId: r.strollerId,
        carSeatId: seat.id,
        compatibilityType: r.compatibilityType,
        adapterRequired: r.adapterRequired,
        adapterType: r.adapterType,
        notes: r.notes,
        confidence: r.confidence,
        adapterBabylistUrl: r.adapterBabylistUrl,
        adapterPrice: r.adapterPrice,
        adapterImage: r.adapterImage,
        adapterBabylistSku: r.adapterBabylistSku,
      },
    });
    created += 1;
  }

  console.log(`  CarSeat "${DISPLAY}" ${existing ? 'updated' : 'created'}.`);
  console.log(`  Compatibility rows cloned: ${created} created, ${skipped} already present.`);
  console.log('\n  Done. The PIPA urbn now matches the same strollers/adapters as the other PIPA seats.');
}

main()
  .catch((error) => {
    console.error('[addPipaUrbn] failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
