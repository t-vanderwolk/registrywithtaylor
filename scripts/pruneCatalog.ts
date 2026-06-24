/**
 * Reduce the affiliate catalog to travel-system products only: strollers,
 * infant car seats, and car-seat adapters. Everything else (convertible/booster/
 * all-in-one/base car seats, nursery, sleep, feeding, bath, babywearing, toys,
 * stroller accessories, travel-system bundles, etc.) is removed.
 *
 *   npx tsx scripts/pruneCatalog.ts            # dry run (default) — counts only
 *   npx tsx scripts/pruneCatalog.ts --hide     # reversible: set non-matching to HIDDEN
 *   npx tsx scripts/pruneCatalog.ts --delete   # IRREVERSIBLE: hard-delete non-matching
 *
 * Run against prod:
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:prune
 *
 * NOTE: a later `catalog:import` re-imports the full feed and will re-add deleted
 * products. `--hide` survives re-import (the import preserves HIDDEN/REVIEWED);
 * `--delete` does not, unless the import is also filtered.
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// What we keep, expressed against ProductEnrichment.
const KEEP_ENRICH = {
  OR: [
    { tmbcCategory: 'Strollers' },
    { productType: { in: ['infant car seat', 'infant car seat adapter', 'stroller adapter'] } },
  ],
};

async function main() {
  const mode = process.argv.includes('--delete')
    ? 'delete'
    : process.argv.includes('--hide')
      ? 'hide'
      : 'dry';

  const [total, keep, drop] = await Promise.all([
    db.affiliateCatalogProduct.count(),
    db.productEnrichment.count({ where: KEEP_ENRICH }),
    db.productEnrichment.count({ where: { NOT: KEEP_ENRICH } }),
  ]);
  const noEnrich = total - keep - drop;

  const breakdown = await db.productEnrichment.groupBy({
    by: ['tmbcCategory'],
    where: { NOT: KEEP_ENRICH },
    _count: { _all: true },
  });

  console.log('── Prune catalog to travel-system products ──');
  console.log(`  total products:                 ${total}`);
  console.log(`  KEEP (strollers + infant seats + adapters): ${keep}`);
  console.log(`  remove (other categories):      ${drop}`);
  console.log(`  remove (no enrichment):         ${noEnrich}`);
  console.log('\n  categories to remove:');
  breakdown
    .sort((a: { _count: { _all: number } }, b: { _count: { _all: number } }) => b._count._all - a._count._all)
    .forEach((r: { tmbcCategory: string | null; _count: { _all: number } }) =>
      console.log(`    ${String(r._count._all).padStart(5)}  ${r.tmbcCategory ?? '(uncategorized)'}`),
    );

  if (mode === 'dry') {
    console.log('\n  (dry run — nothing changed. Re-run with --hide or --delete.)');
    return;
  }

  if (mode === 'hide') {
    const res = await db.productEnrichment.updateMany({
      where: { NOT: KEEP_ENRICH },
      data: { reviewStatus: 'HIDDEN', isPublic: false },
    });
    console.log(`\n  Hid ${res.count} products (reversible — they stay in the DB but drop out of all tools).`);
    return;
  }

  // mode === 'delete' — hard delete the raw products (enrichment cascades).
  const res = await db.affiliateCatalogProduct.deleteMany({
    where: { NOT: { enrichment: { is: KEEP_ENRICH } } },
  });
  console.log(`\n  Deleted ${res.count} products (enrichment cascaded). This is irreversible.`);
}

main()
  .catch((error) => {
    console.error('[pruneCatalog] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
