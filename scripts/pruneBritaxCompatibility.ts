/**
 * Prune Britax compatibility rows that the 03.2026 US chart does NOT list.
 *
 * Run AFTER scripts/applyBritaxCompatibility. The chart is authoritative and
 * comprehensive for the frames it covers (Brook / Brook+ / Grove / Juniper /
 * Juniper+ / Phases / Prism), so any stored Compatibility row on one of those
 * strollers whose seat is not in that stroller's chart list is stale and gets
 * removed. This is what clears, e.g.:
 *   • legacy B-Safe / Endeavours rows (chart footnote: NOT compatible)
 *   • Clek / Chicco / Graco rows (never on the Britax chart)
 *   • wrong Maxi-Cosi / CYBEX / Nuna MODELS (e.g. Coral XP on the Juniper+)
 *   • every row on the Juniper (chart lists no infant seat for it)
 *
 * Strollers NOT on the chart are left completely untouched.
 *
 *   npx tsx scripts/pruneBritaxCompatibility.ts            # dry run
 *   npx tsx scripts/pruneBritaxCompatibility.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:britax-prune-apply
 */
import prismaBase from '@/lib/server/prisma';
import { britaxRuleForModel } from '@/lib/catalog/britaxAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
const seatKey = (brand: string, model: string) => `${norm(brand)}::${norm(model)}`;

type StrollerRow = { id: string; brand: string; model: string; displayName: string | null };

async function main() {
  console.log(`── Prune Britax compatibility to the US chart 03.2026 ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const strollers: StrollerRow[] = await db.stroller.findMany({
    where: { brand: { equals: 'Britax', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true },
    orderBy: { model: 'asc' },
  });

  let removed = 0;
  let kept = 0;

  for (const stroller of strollers) {
    const rule = britaxRuleForModel(stroller.model);
    if (!rule) continue; // off-chart stroller — leave alone

    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;
    const allowed = new Set(rule.seats.map((s) => seatKey(s.brand, s.model)));

    const rows: Array<{ id: string; carSeat: { brand: string; model: string } }> =
      await db.compatibility.findMany({
        where: { strollerId: stroller.id },
        select: { id: true, carSeat: { select: { brand: true, model: true } } },
      });

    for (const row of rows) {
      const key = seatKey(row.carSeat.brand, row.carSeat.model);
      if (allowed.has(key)) {
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
  console.error('[pruneBritaxCompatibility] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
