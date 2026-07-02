/**
 * Add the Bugaboo Turtle Air by Nuna infant car seat and attach it as a DIRECT
 * fit (no adapter) to EVERY Bugaboo stroller. It is Bugaboo's own infant seat,
 * designed to click onto Bugaboo strollers, so it is surfaced as the native
 * direct option (per request), regardless of the per-model adapter notes.
 *
 *   npx tsx scripts/addBugabooTurtleDirect.ts            # dry run (default)
 *   npx tsx scripts/addBugabooTurtleDirect.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-bugaboo-turtle-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

const TURTLE = {
  brand: 'Bugaboo',
  model: 'Turtle Air by Nuna',
  displayName: 'Bugaboo Turtle Air by Nuna',
  babylistSku: '2116047',
  babylistUrl: babylistAffiliate(
    'https://www.babylist.com/gp/bugaboo-turtle-air-shield-by-nuna-car-seat-recline-base/56787/2116047',
  ),
  babylistImage:
    'https://images.ctfassets.net/50gzycvace50/ca18dd160323f5276e097170b7e254a408ebade014a43e08106c396f97beca95/3a4476d44f0222e97ff67f35cabee299/ca18dd160323f5276e097170b7e254a408ebade014a43e08106c396f97beca95.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
  babylistPrice: 649.0,
};

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Bugaboo Turtle Air by Nuna → direct on every Bugaboo stroller ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // 1) Upsert the Turtle infant car seat (by unique brand+model).
  let carSeatId: string | null = null;
  const existingSeat = await db.carSeat.findFirst({
    where: { brand: { equals: TURTLE.brand, mode: 'insensitive' }, model: { equals: TURTLE.model, mode: 'insensitive' } },
    select: { id: true },
  });
  console.log(`  Car seat: ${TURTLE.displayName} — ${existingSeat ? 'exists (update)' : 'create'}`);
  if (apply) {
    const seat = await db.carSeat.upsert({
      where: { brand_model: { brand: TURTLE.brand, model: TURTLE.model } },
      update: {
        displayName: TURTLE.displayName,
        seatType: 'INFANT',
        babylistSku: TURTLE.babylistSku,
        babylistUrl: TURTLE.babylistUrl,
        babylistImage: TURTLE.babylistImage,
        babylistPrice: TURTLE.babylistPrice,
        babylistUpdatedAt: new Date(),
      },
      create: {
        brand: TURTLE.brand,
        model: TURTLE.model,
        displayName: TURTLE.displayName,
        seatType: 'INFANT',
        babylistSku: TURTLE.babylistSku,
        babylistUrl: TURTLE.babylistUrl,
        babylistImage: TURTLE.babylistImage,
        babylistPrice: TURTLE.babylistPrice,
        babylistUpdatedAt: new Date(),
      },
      select: { id: true },
    });
    carSeatId = seat.id;
  }

  // 2) Attach as DIRECT to every Bugaboo stroller.
  const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    where: { brand: { startsWith: 'Bugaboo', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true },
    orderBy: { model: 'asc' },
  });
  console.log(`\n  Bugaboo strollers to attach: ${strollers.length}`);
  strollers.forEach((s) => console.log(`    • ${s.brand} ${s.model}`));

  if (apply && carSeatId) {
    let created = 0;
    let existing = 0;
    for (const s of strollers) {
      const already = await db.compatibility.findFirst({
        where: { strollerId: s.id, carSeatId },
        select: { id: true },
      });
      if (already) {
        existing += 1;
        continue;
      }
      await db.compatibility.create({
        data: {
          strollerId: s.id,
          carSeatId,
          compatibilityType: 'DIRECT',
          adapterRequired: false,
          adapterType: null,
          confidence: 'HIGH',
          notes:
            'The Bugaboo Turtle Air by Nuna is Bugaboo’s own infant car seat and clicks directly onto Bugaboo strollers.',
        },
      });
      created += 1;
    }
    console.log(`\n  DIRECT compatibility rows created: ${created}  (already present: ${existing})`);
  }

  console.log(`\n${apply ? 'Done.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addBugabooTurtleDirect] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
