/**
 * Scan strollers and car seats for entries that duplicate another entry (same
 * normalized brand + model) and carry no compatibility match, then remove the
 * redundant ones. In each duplicate group the entry with the most compatibility
 * rows (then the oldest) is kept; only zero-compatibility duplicates are removed.
 * Unique entries are never touched, even if they have no match.
 *
 *   npx tsx scripts/cleanupUnmatchedDuplicates.ts            # dry run (default)
 *   npx tsx scripts/cleanupUnmatchedDuplicates.ts --apply    # delete
 *
 * Run against prod:
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:dedup
 */
import prisma from '@/lib/server/prisma';

function normKey(brand: string, model: string): string {
  return `${brand}|${model}`.toLowerCase().replace(/[^a-z0-9|]+/g, '');
}

type Row = { id: string; brand: string; model: string; createdAt: Date; compat: number };

function planRemovals(rows: Row[]): Row[] {
  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const key = normKey(r.brand, r.model);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const remove: Row[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue; // unique — never remove
    // Keep the entry with the most compatibility data, then the oldest.
    group.sort((a, b) => b.compat - a.compat || a.createdAt.getTime() - b.createdAt.getTime());
    const [, ...rest] = group;
    for (const r of rest) if (r.compat === 0) remove.push(r);
  }
  return remove;
}

async function main() {
  const apply = process.argv.includes('--apply');

  const [strollers, carSeats, strollerCompat, carSeatCompat] = await Promise.all([
    prisma.stroller.findMany({ select: { id: true, brand: true, model: true, createdAt: true } }),
    prisma.carSeat.findMany({ select: { id: true, brand: true, model: true, createdAt: true } }),
    prisma.compatibility.groupBy({ by: ['strollerId'], _count: { _all: true } }),
    prisma.compatibility.groupBy({ by: ['carSeatId'], _count: { _all: true } }),
  ]);

  const sCount = new Map(strollerCompat.map((g) => [g.strollerId, g._count._all]));
  const cCount = new Map(carSeatCompat.map((g) => [g.carSeatId, g._count._all]));

  const removeStrollers = planRemovals(strollers.map((s) => ({ ...s, compat: sCount.get(s.id) ?? 0 })));
  const removeCarSeats = planRemovals(carSeats.map((c) => ({ ...c, compat: cCount.get(c.id) ?? 0 })));

  const report = (label: string, rows: Row[]) => {
    console.log(`\n${label}: ${rows.length} no-match duplicate(s) to remove`);
    for (const r of rows) console.log(`  - ${r.brand} ${r.model} (${r.id})`);
  };
  report('Strollers', removeStrollers);
  report('Car seats', removeCarSeats);

  if (!apply) {
    console.log('\n(dry run — no deletions. Re-run with --apply to delete.)');
    return;
  }

  let deleted = 0;
  for (const r of removeStrollers) {
    try {
      await prisma.stroller.delete({ where: { id: r.id } });
      deleted += 1;
    } catch (e) {
      console.error(`  skip stroller ${r.brand} ${r.model}:`, e instanceof Error ? e.message : e);
    }
  }
  for (const r of removeCarSeats) {
    try {
      await prisma.carSeat.delete({ where: { id: r.id } });
      deleted += 1;
    } catch (e) {
      console.error(`  skip car seat ${r.brand} ${r.model}:`, e instanceof Error ? e.message : e);
    }
  }
  console.log(`\nDeleted ${deleted} no-match duplicate(s).`);
}

main()
  .catch((error) => {
    console.error('[cleanupUnmatchedDuplicates] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
