/**
 * Audit + fix CarSeat.seatType.
 *
 * The travel-system engine filters `seatType = 'INFANT'` everywhere, so any
 * infant carrier that got mis-typed CONVERTIBLE / ALL_IN_ONE is invisible to the
 * whole compatibility system — no adapter row, no travel-system pairing, nothing.
 *
 * This surfaced via Baby Jogger: the City Tour 2 and Summit X3 take a Graco
 * infant seat only, but the compat script found ZERO Graco INFANT seats — because
 * the import-time INFANT regex omitted "GoMax" (Graco's newer infant carrier), so
 * those rows were typed CONVERTIBLE.
 *
 * This script re-types any seat whose NAME clearly reads as an infant carrier but
 * whose stored seatType isn't INFANT. Dry-run default; conservative regex.
 *
 *   npx tsx scripts/fixCarSeatTypes.ts            # audit (default)
 *   npx tsx scripts/fixCarSeatTypes.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-seat-types-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

/**
 * Names that identify an INFANT carrier. Superset of the import regex, with the
 * gaps that caused mis-typing filled in (GoMax, SnugFit, Peri, Aire, Mico, etc.).
 * Deliberately model-name based so a "SnugRide" carrier is caught but a
 * "SnugRide Grow" 3-in-1 convertible would need its own review.
 */
const INFANT_NAME_RE =
  /\b(pipa|aton|cloud[\s-]?[gtqz]|mico|peri|coral|liing|keyfit(?!\s*grow)|fit2|snug\s?ride|snug\s?fit|gomax|go\s?max|primo\s?viaggio|mesa|aria|cabrio\s?fix|litemax|shyft|ez-?flex|nido|via\b|kite|shift|gemm|willow|b-?safe(?!.*\bgrow\b))\b/i;

/** Names that are convertible/toddler despite containing an infant-ish token. */
const NOT_INFANT_RE = /\b(convertible|all[\s-]?in[\s-]?one|3[\s-]?in[\s-]?1|4[\s-]?in[\s-]?1|grow|turn|slim\s?fit\s?dlx\s?grow|extend2fit|booster|rotating\s?convertible)\b/i;

type Row = { id: string; brand: string; model: string; displayName: string | null; seatType: string };

async function main() {
  console.log(`── Audit CarSeat seatType ──  (${APPLY ? 'APPLY' : 'audit only'})\n`);

  const seats: Row[] = await db.carSeat.findMany({
    select: { id: true, brand: true, model: true, displayName: true, seatType: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });

  // Distribution by brand × seatType, for context.
  const dist = new Map<string, Map<string, number>>();
  for (const s of seats) {
    const byType = dist.get(s.brand) ?? new Map<string, number>();
    byType.set(s.seatType, (byType.get(s.seatType) ?? 0) + 1);
    dist.set(s.brand, byType);
  }

  // Mis-typed: reads as infant, stored as non-infant, not clearly a convertible.
  const misTyped = seats.filter((s) => {
    const name = `${s.brand} ${s.model} ${s.displayName ?? ''}`;
    return s.seatType !== 'INFANT' && INFANT_NAME_RE.test(name) && !NOT_INFANT_RE.test(name);
  });

  console.log('Seat-type distribution by brand:');
  for (const [brand, byType] of [...dist.entries()].sort()) {
    const parts = [...byType.entries()].map(([t, n]) => `${t}:${n}`).join('  ');
    console.log(`  ${brand.padEnd(16)} ${parts}`);
  }

  console.log(`\n${misTyped.length} seat(s) look like INFANT carriers but are typed otherwise:`);
  for (const s of misTyped) {
    console.log(`  ${APPLY ? 'FIX ' : '·'} ${s.brand} ${s.model}  (${s.seatType} → INFANT)`);
    if (APPLY) {
      await db.carSeat.update({ where: { id: s.id }, data: { seatType: 'INFANT' } });
    }
  }

  console.log(`\n${APPLY ? 'Applied' : 'Audit'} — ${misTyped.length} seat(s) ${APPLY ? 're-typed to INFANT' : 'would be re-typed'}.`);
  if (!APPLY && misTyped.length) console.log('Review the list above, then re-run with --apply.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[fixCarSeatTypes] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
