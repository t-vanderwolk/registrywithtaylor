/**
 * Guarantee the two 2026 INFANT car seats surface "compatible strollers".
 *
 * Compatible strollers for a car seat are computed by the engine
 * (getTravelSystemCompatibilityByCarSeat): explicit rows + same-brand defaults +
 * SHARED_ADAPTER inference. CYBEX + Maxi-Cosi are shared-adapter brands, so once
 * these seats are seatType INFANT with a public retailer link, their compatible
 * strollers populate automatically — no explicit compatibility rows required.
 *
 * Convertibles (Nuna RAVA Next, REVV Maxx, Britax Galaxy 360) stay CONVERTIBLE
 * and are correctly excluded from the travel-system checker.
 *
 *   npx tsx scripts/ensureInfant2026Seats.ts            # dry run (report)
 *   npx tsx scripts/ensureInfant2026Seats.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/ensureInfant2026Seats.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const SEATS: Array<{ brand: string; model: string }> = [
  { brand: 'Maxi-Cosi', model: 'Ambra' },
  { brand: 'CYBEX', model: 'Aton G2 Swivel' },
];

async function main() {
  console.log(`── Ensure 2026 infant seats show compatible strollers ──  (${APPLY ? 'APPLY' : 'dry-run'})\n`);

  for (const s of SEATS) {
    const row = await db.carSeat.findFirst({
      where: { brand: { equals: s.brand, mode: 'insensitive' }, model: { equals: s.model, mode: 'insensitive' } },
      select: { id: true, seatType: true, babylistUrl: true, amazonUrl: true },
    });

    if (!row) {
      console.log(`  ✗ ${s.brand} ${s.model}: NOT in CarSeat table — run addReleased2026CatalogProducts first.`);
      continue;
    }

    const hasRetailer = Boolean(row.babylistUrl?.trim() || row.amazonUrl?.trim());
    const needsType = row.seatType !== 'INFANT';
    console.log(
      `  ${s.brand} ${s.model}: seatType=${row.seatType}${needsType ? ' → INFANT' : ' ✓'}, retailer=${hasRetailer ? 'yes ✓' : 'NONE ⚠'}`,
    );

    if (needsType && APPLY) {
      await db.carSeat.update({ where: { id: row.id }, data: { seatType: 'INFANT' } });
    }
    if (!hasRetailer) {
      console.log(`     ⚠ no Babylist/Amazon link — the seat won't surface in the checker until one is set (admin › Car Seats).`);
    }
  }

  console.log(
    `\nCYBEX + Maxi-Cosi are shared-adapter brands, so compatible strollers infer automatically once each seat is INFANT + has a retailer.`,
  );
  if (!APPLY) console.log('\nDRY RUN — re-run with --apply to set any seatType.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
