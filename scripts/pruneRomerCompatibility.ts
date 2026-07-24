/**
 * Prune Romer compatibility rows the romerbaby.com chart does NOT list.
 *
 * Run AFTER scripts/applyRomerCompatibility. The chart is authoritative for the
 * Tura and Lani, so any stored row on those frames whose seat is not in the
 * chart list is removed — e.g. Maxi-Cosi / Clek / Chicco / Graco rows that leaked
 * in via the shared-adapter inference before these frames were flagged direct-
 * fit-only. Strollers not on the chart are left untouched.
 *
 *   npx tsx scripts/pruneRomerCompatibility.ts            # dry run
 *   npx tsx scripts/pruneRomerCompatibility.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:romer-prune-apply
 */
import prismaBase from '@/lib/server/prisma';
import { romerRuleForModel } from '@/lib/catalog/romerAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
const seatKey = (brand: string, model: string) => `${norm(brand)}::${norm(model)}`;

type StrollerRow = { id: string; brand: string; model: string; displayName: string | null };
type SeatRef = { brand: string; model: string };

/** True when a seat is allowed on this stroller per the chart rule. */
function seatAllowed(rule: NonNullable<ReturnType<typeof romerRuleForModel>>, seat: SeatRef): boolean {
  for (const group of rule.groups) {
    for (const s of group.seats) {
      if (s.kind === 'exact') {
        if (seatKey(s.brand, s.model) === seatKey(seat.brand, seat.model)) return true;
      } else {
        if (norm(s.brand) === norm(seat.brand) && s.pattern.test(seat.model)) return true;
      }
    }
  }
  return false;
}

async function main() {
  console.log(`── Prune Romer compatibility to the romerbaby.com chart ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const strollers: StrollerRow[] = await db.stroller.findMany({
    where: { brand: { equals: 'Romer', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: { model: 'asc' },
  });

  let removed = 0;
  let kept = 0;

  for (const stroller of strollers) {
    const rule = romerRuleForModel(stroller.model);
    if (!rule) continue;
    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;

    const rows: Array<{ id: string; carSeat: { brand: string; model: string } }> =
      await db.compatibility.findMany({
        where: { strollerId: stroller.id },
        select: { id: true, carSeat: { select: { brand: true, model: true } } },
      });

    for (const row of rows) {
      if (seatAllowed(rule, row.carSeat)) {
        kept += 1;
        continue;
      }
      removed += 1;
      console.log(`  − ${label}: drop ${row.carSeat.brand} ${row.carSeat.model}`);
      if (APPLY) await db.compatibility.delete({ where: { id: row.id } });
    }
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${removed} row(s) to remove, ${kept} kept (on-chart).`);
  if (!APPLY) console.log('\nRe-run with --apply to delete these rows.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[pruneRomerCompatibility] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
