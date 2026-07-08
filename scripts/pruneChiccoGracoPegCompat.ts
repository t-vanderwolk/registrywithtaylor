/**
 * Remove Chicco, Graco, and Peg Perego infant car seats from every stroller's
 * compatibility list EXCEPT the Cybex Gazelle S and e-Gazelle S (which keep them).
 *
 *   npx tsx scripts/pruneChiccoGracoPegCompat.ts            # dry run (default)
 *   npx tsx scripts/pruneChiccoGracoPegCompat.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/pruneChiccoGracoPegCompat.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const APPLY = process.argv.includes('--apply');

// Car-seat brands to strip from everything but the Gazelle line.
const SEAT_RE = /chicco|graco|peg[\s-]?perego/i;
// Strollers that KEEP these seats: Cybex Gazelle S + e-Gazelle S.
const keepStroller = (brand: string, model: string) => /cybex/i.test(brand) && /gazelle/i.test(model);

type Row = {
  id: string;
  stroller: { brand: string; model: string } | null;
  carSeat: { brand: string; model: string } | null;
};

async function main() {
  const rows: Row[] = await db.compatibility.findMany({
    select: {
      id: true,
      stroller: { select: { brand: true, model: true } },
      carSeat: { select: { brand: true, model: true } },
    },
  });

  const toDelete = rows.filter(
    (r) =>
      r.carSeat &&
      SEAT_RE.test(r.carSeat.brand) &&
      r.stroller &&
      !keepStroller(r.stroller.brand, r.stroller.model),
  );

  console.log('── Prune Chicco / Graco / Peg Perego from non-Gazelle strollers ──');
  console.log(`  Total compatibility rows: ${rows.length}`);
  console.log(`  Rows to remove: ${toDelete.length}\n`);

  // Per seat-brand + affected stroller count.
  const byBrand = new Map<string, Set<string>>();
  for (const r of toDelete) {
    const b = (r.carSeat!.brand || '').trim();
    if (!byBrand.has(b)) byBrand.set(b, new Set());
    byBrand.get(b)!.add(`${r.stroller!.brand} ${r.stroller!.model}`);
  }
  for (const [brand, strollers] of byBrand) {
    console.log(`  ${brand}: removed from ${strollers.size} stroller(s)`);
  }

  // Confirm the Gazelle line keeps them.
  const kept = rows.filter(
    (r) => r.carSeat && SEAT_RE.test(r.carSeat.brand) && r.stroller && keepStroller(r.stroller.brand, r.stroller.model),
  );
  console.log(`\n  Kept on Gazelle line: ${kept.length} row(s) (${new Set(kept.map((r) => `${r.stroller!.brand} ${r.stroller!.model}`)).size} stroller(s))`);

  if (toDelete.length === 0) {
    console.log('\n  Nothing to remove.');
    return;
  }
  if (!APPLY) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const ids = toDelete.map((r) => r.id);
  const CHUNK = 500;
  let deleted = 0;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const res = await db.compatibility.deleteMany({ where: { id: { in: ids.slice(i, i + CHUNK) } } });
    deleted += res.count;
  }
  console.log(`\n  ✓ Removed ${deleted} compatibility row(s).`);
}

main()
  .catch((error) => {
    console.error('[pruneChiccoGracoPegCompat] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
