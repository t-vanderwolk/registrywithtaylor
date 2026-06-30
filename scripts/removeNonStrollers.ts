/**
 * Remove non-stroller products that got mis-imported into the Stroller table
 * (blankets, clothing, play mats, cooler bags, toys, changing stations). Matched
 * by distinctive model keywords — NOT brand, since Radio Flyer / Momcozy etc.
 * also make real gear. Deletes the Stroller row (+ any Compatibility rows).
 *
 *   npx tsx scripts/removeNonStrollers.ts            # dry run (default)
 *   npx tsx scripts/removeNonStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:remove-nonstrollers-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const JUNK: { label: string; re: RegExp }[] = [
  { label: 'blanket / knit', re: /\bcable knit\b/i },
  { label: 'clothing (footie)', re: /\bfootie\b/i },
  { label: 'play mat', re: /\bplay ?mat\b/i },
  { label: 'cooler / cargo bag', re: /cool.{0,4}cargo/i },
  { label: 'toy (Lovevery Buddy)', re: /\bthe buddy\b/i },
  { label: 'walker wagon (toy)', re: /\bwalker wagon\b/i },
  { label: 'luggage', re: /\bluggage\b/i },
];

type Row = { id: string; brand: string; model: string };

async function main() {
  const apply = process.argv.includes('--apply');

  const strollers: Row[] = await db.stroller.findMany({ select: { id: true, brand: true, model: true } });

  const matched: Array<{ row: Row; label: string }> = [];
  for (const s of strollers) {
    const hay = `${s.brand} ${s.model}`;
    const hit = JUNK.find((j) => j.re.test(hay));
    if (hit) matched.push({ row: s, label: hit.label });
  }

  console.log('── Remove non-strollers from the Stroller table ──');
  console.log(`  scanned ${strollers.length} strollers · matched ${matched.length} non-strollers:\n`);
  matched.forEach(({ row, label }) => console.log(`    × ${row.brand} ${row.model}   [${label}]`));

  if (!apply) {
    console.log('\n  (dry run — nothing deleted. Re-run with --apply.)');
    return;
  }

  const ids = matched.map((m) => m.row.id);
  await db.compatibility.deleteMany({ where: { strollerId: { in: ids } } });
  const res = await db.stroller.deleteMany({ where: { id: { in: ids } } });
  console.log(`\n  Deleted ${res.count} non-stroller rows.`);
}

main()
  .catch((error) => {
    console.error('[removeNonStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
