/**
 * Add the Britax infant car seats that share the Maxi-Cosi / Nuna / CYBEX / Clek
 * click-and-go adapter standard. Once these rows exist, the travel-system
 * checker surfaces them on every stroller that already lists a Nuna seat (the
 * shared-adapter trigger), using the same adapter as the other shared brands.
 *
 * Pairs with SHARED_ADAPTER_BRANDS / SHARED_ADAPTER_EXPANSION_BRANDS in
 * lib/server/travelSystemCompatibility.ts (both now include 'britax').
 *
 * Idempotent: upserts by the CarSeat (brand, model) unique key.
 *
 *   npx tsx scripts/seedBritaxCarSeats.ts            # dry run (default)
 *   npx tsx scripts/seedBritaxCarSeats.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run seed:britax-carseats-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SHARED = 'Britax infant car seat — uses the shared Maxi-Cosi / Nuna / CYBEX / Clek click-and-go adapter.';
// B-Safe is discontinued but kept in the checker so existing owners can look up
// which strollers their seat is compatible with.
const BSAFE = 'Discontinued — kept so B-Safe owners can check stroller compatibility. Uses the shared Maxi-Cosi / Nuna / CYBEX / Clek adapter.';

const SEATS: Array<{ brand: string; model: string; summary: string }> = [
  { brand: 'Britax', model: 'B-Safe 35', summary: BSAFE },
  { brand: 'Britax', model: 'B-Safe Gen2', summary: BSAFE },
  { brand: 'Britax', model: 'B-Safe Gen2 FlexFit', summary: BSAFE },
  { brand: 'Britax', model: 'Willow S', summary: SHARED },
  { brand: 'Britax', model: 'Willow SC', summary: SHARED },
];

async function main() {
  const apply = process.argv.includes('--apply');

  console.log('── Seed Britax infant car seats (shared-adapter group) ──');
  for (const s of SEATS) {
    if (!apply) {
      console.log(`  would upsert: ${s.brand} ${s.model}  (seatType INFANT)`);
      continue;
    }
    await db.carSeat.upsert({
      where: { brand_model: { brand: s.brand, model: s.model } },
      update: { seatType: 'INFANT', summary: s.summary },
      create: { brand: s.brand, model: s.model, seatType: 'INFANT', summary: s.summary },
    });
    console.log(`  upserted: ${s.brand} ${s.model}`);
  }

  if (!apply) console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
}

main()
  .catch((error) => {
    console.error('[seedBritaxCarSeats] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
