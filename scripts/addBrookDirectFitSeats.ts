/**
 * Add specific DIRECT-fit infant car seats to the Britax Brook + Grove line
 * (Brook / Brook+ Modular Baby / Grove — they share one chart list), per
 * Taylor's request:
 *   Cybex Aton 2, Cybex Aton M, Cybex Cloud Q, Maxi-Cosi Coral XP, Maxi-Cosi Mico 30.
 *
 * For each seat it links the BEST EXISTING catalog seat — preferring one that has
 * a public retailer (Babylist / MacroBaby / Bombi / Amazon), because the checker
 * only surfaces compatible seats a shopper can actually buy. If no seat exists at
 * all it creates a placeholder (which will NOT surface until it has a buy link —
 * add one in Admin → Car Seats).
 *
 *   npx tsx scripts/addBrookDirectFitSeats.ts            # dry run
 *   npx tsx scripts/addBrookDirectFitSeats.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:brook-direct-seats-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();

const TARGET_SEATS: Array<{ brand: string; model: string }> = [
  { brand: 'Cybex', model: 'Aton 2' },
  { brand: 'Cybex', model: 'Aton M' },
  { brand: 'Cybex', model: 'Cloud Q' },
  { brand: 'Maxi-Cosi', model: 'Coral XP' },
  { brand: 'Maxi-Cosi', model: 'Mico 30' },
];

type SeatRow = {
  id: string; brand: string; model: string;
  babylistUrl: string | null; babylistPrice: number | null;
  macroBabyUrl: string | null; macroBabyPrice: number | null;
  bombiUrl: string | null; amazonUrl: string | null;
};
const hasRetailer = (s: SeatRow) =>
  !!(s.babylistUrl || s.babylistPrice != null || s.macroBabyUrl || s.macroBabyPrice != null || s.bombiUrl || s.amazonUrl);

async function main() {
  console.log(`── Add Brook / Grove direct-fit seats ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const strollers: Array<{ id: string; brand: string; model: string; displayName: string | null }> =
    await db.stroller.findMany({
      where: {
        brand: { equals: 'Britax', mode: 'insensitive' },
        OR: [
          { model: { contains: 'brook', mode: 'insensitive' } },
          { model: { contains: 'grove', mode: 'insensitive' } },
        ],
      },
      select: { id: true, brand: true, model: true, displayName: true },
    });
  if (strollers.length === 0) {
    console.error('No Britax Brook / Grove stroller found.');
    process.exitCode = 1;
    return;
  }

  const allSeats: SeatRow[] = await db.carSeat.findMany({
    where: { seatType: 'INFANT', brand: { in: ['Cybex', 'Maxi-Cosi'], mode: 'insensitive' } },
    select: {
      id: true, brand: true, model: true,
      babylistUrl: true, babylistPrice: true, macroBabyUrl: true, macroBabyPrice: true, bombiUrl: true, amazonUrl: true,
    },
  });

  // Resolve each target to the best existing seat (retailer first, then closest model), else create.
  const resolved: Array<{ target: { brand: string; model: string }; seat: SeatRow; created: boolean; willSurface: boolean }> = [];
  for (const target of TARGET_SEATS) {
    const wantBrand = norm(target.brand);
    const wantModel = norm(target.model);
    const candidates = allSeats.filter(
      (s) => norm(s.brand) === wantBrand && (norm(s.model) === wantModel || norm(s.model).includes(wantModel)),
    );
    candidates.sort((a, b) => {
      const ar = hasRetailer(a) ? 1 : 0, br = hasRetailer(b) ? 1 : 0;
      if (ar !== br) return br - ar; // retailer first
      const ae = norm(a.model) === wantModel ? 1 : 0, be = norm(b.model) === wantModel ? 1 : 0;
      return be - ae; // exact model next
    });

    let seat = candidates[0];
    let created = false;
    if (!seat) {
      created = true;
      if (APPLY) {
        seat = await db.carSeat.create({
          data: { brand: target.brand, model: target.model, seatType: 'INFANT', summary: `${target.brand} ${target.model} infant car seat.` },
          select: {
            id: true, brand: true, model: true,
            babylistUrl: true, babylistPrice: true, macroBabyUrl: true, macroBabyPrice: true, bombiUrl: true, amazonUrl: true,
          },
        });
      } else {
        seat = { id: `(new) ${target.brand} ${target.model}`, brand: target.brand, model: target.model, babylistUrl: null, babylistPrice: null, macroBabyUrl: null, macroBabyPrice: null, bombiUrl: null, amazonUrl: null };
      }
    }
    resolved.push({ target, seat, created, willSurface: hasRetailer(seat) });
  }

  const data = {
    compatibilityType: 'DIRECT',
    adapterRequired: false,
    adapterType: null as string | null,
    confidence: 'HIGH',
    notes: 'Direct fit — clicks straight on, no adapter needed (Britax Brook / Grove).',
  };

  let created = 0, updated = 0, unchanged = 0;
  for (const stroller of strollers) {
    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;
    console.log(`  ${label}`);
    for (const { target, seat, created: seatCreated, willSurface } of resolved) {
      const tag = seatCreated ? ' [new placeholder]' : hasRetailer(seat) ? '' : ' [no retailer]';
      const surface = willSurface ? '' : '  ⚠ will NOT surface until it has a buy link';
      console.log(`    → ${target.brand} ${target.model}  ↔ catalog: ${seat.brand} ${seat.model}${tag}${surface}`);
      if (seat.id.startsWith('(new) ')) continue;

      const found = await db.compatibility.findFirst({
        where: { strollerId: stroller.id, carSeatId: seat.id },
        select: { id: true, compatibilityType: true, adapterRequired: true },
      });
      if (found) {
        if (found.compatibilityType === 'DIRECT' && found.adapterRequired === false) { unchanged += 1; continue; }
        updated += 1;
        if (APPLY) await db.compatibility.update({ where: { id: found.id }, data });
        console.log(`        ~ updated existing row → DIRECT`);
      } else {
        created += 1;
        if (APPLY) await db.compatibility.create({ data: { strollerId: stroller.id, carSeatId: seat.id, ...data } });
        console.log(`        + new DIRECT row`);
      }
    }
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${created} new, ${updated} updated, ${unchanged} already correct.`);
  const wontSurface = resolved.filter((r) => !r.willSurface);
  if (wontSurface.length) {
    console.log(`\n⚠ ${wontSurface.length} seat(s) have no retailer and will NOT appear until you add a buy link in Admin → Car Seats:`);
    for (const r of wontSurface) console.log(`   · ${r.target.brand} ${r.target.model}`);
  }
  if (!APPLY) console.log('\nRe-run with --apply to write these rows.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[addBrookDirectFitSeats] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
