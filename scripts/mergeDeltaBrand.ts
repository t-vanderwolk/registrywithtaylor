/**
 * Combine the "Delta" and "Delta Children" stroller brands into one
 * ("Delta Children").
 *
 * canonicalStrollerBrand() now groups both under "Delta Children" in the finder /
 * checker (and for new strollers:import rows). This aligns the EXISTING Stroller
 * rows: it re-brands the "Delta" rows and strips the stray "Children -" model
 * prefix (an artifact of "Delta Children - BabyGap Classic" parsing as brand
 * "Delta" + model "Children - BabyGap Classic") so the stored model matches the
 * catalog model and compatibility lookups resolve.
 *
 *   npx tsx scripts/mergeDeltaBrand.ts            # dry run (default)
 *   npx tsx scripts/mergeDeltaBrand.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:merge-delta-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const cleanModel = (model: string) => model.replace(/^children\s*[-–—]\s*/i, '').trim() || model;

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    where: { brand: { equals: 'Delta', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true },
    orderBy: { model: 'asc' },
  });

  console.log('── Merge "Delta" → "Delta Children" ──');
  console.log(`  Stroller rows branded "Delta": ${rows.length}\n`);
  rows.forEach((r) => console.log(`    • Delta | ${r.model}  →  Delta Children | ${cleanModel(r.model)}`));

  if (!apply) {
    console.log('\n  (dry run — re-run with --apply.)');
    return;
  }

  let updated = 0;
  let removedDupes = 0;
  for (const r of rows) {
    const model = cleanModel(r.model);
    try {
      await db.stroller.update({
        where: { id: r.id },
        data: { brand: 'Delta Children', model, displayName: `Delta Children ${model}`.replace(/\s+/g, ' ').trim() },
      });
      updated += 1;
    } catch {
      // A (brand, model) row already exists as Delta Children — drop the duplicate.
      await db.stroller.delete({ where: { id: r.id } });
      removedDupes += 1;
    }
  }

  console.log(`\n  Re-branded ${updated}, removed ${removedDupes} duplicate(s). "Delta" is now "Delta Children".`);
}

main()
  .catch((error) => {
    console.error('[mergeDeltaBrand] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
