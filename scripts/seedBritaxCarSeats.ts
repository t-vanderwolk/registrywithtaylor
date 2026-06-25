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

const SUMMARY = 'Britax infant car seat — uses the shared Maxi-Cosi / Nuna / CYBEX / Clek click-and-go adapter.';

// B-Safe (35 / Gen2 / Gen2 FlexFit) was removed — discontinued. Willow stays.
const SEATS: Array<{ brand: string; model: string }> = [
  { brand: 'Britax', model: 'Willow S' },
  { brand: 'Britax', model: 'Willow SC' },
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
      update: { seatType: 'INFANT', summary: SUMMARY },
      create: { brand: s.brand, model: s.model, seatType: 'INFANT', summary: SUMMARY },
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
