/**
 * Hide every "Chariot" product (Thule Chariot multisport trailers are bike
 * trailers / running slings, not travel-system strollers) from the finder,
 * checker and quiz.
 *
 *   • Catalog: force each Chariot product's enrichment to HIDDEN / not public
 *     (created if missing) so it can never surface in the finder or checker.
 *   • Checker: delete any "Chariot" Stroller row (Compatibility cascades).
 *
 * Idempotent — safe to re-run; if there are no Chariot products it reports zero.
 *
 *   npx tsx scripts/hideChariot.ts            # dry run (default)
 *   npx tsx scripts/hideChariot.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-chariot-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

async function main() {
  const apply = process.argv.includes('--apply');

  const products: Array<{
    id: string;
    provider: string;
    title: string;
    enrichment: { id: string; reviewStatus: string | null; isPublic: boolean } | null;
  }> = await db.affiliateCatalogProduct.findMany({
    where: { title: { contains: 'Chariot', mode: 'insensitive' } },
    select: {
      id: true,
      provider: true,
      title: true,
      enrichment: { select: { id: true, reviewStatus: true, isPublic: true } },
    },
  });

  const strollerRows: Array<{ id: string; brand: string; model: string; displayName: string | null }> =
    await db.stroller.findMany({
      where: {
        OR: [
          { model: { contains: 'Chariot', mode: 'insensitive' } },
          { displayName: { contains: 'Chariot', mode: 'insensitive' } },
        ],
      },
      select: { id: true, brand: true, model: true, displayName: true },
    });

  console.log('── Hide Chariot products ──');
  console.log(`  catalog products matched: ${products.length}`);
  products.forEach((p) =>
    console.log(`    × ${p.title.slice(0, 72)}  [${p.enrichment?.reviewStatus ?? 'no-enrichment'}${p.enrichment?.isPublic ? '/public' : ''}]`),
  );
  console.log(`  Stroller rows matched: ${strollerRows.length}`);
  strollerRows.forEach((s) => console.log(`    × ${s.brand} | ${s.model}`));

  if (!apply) {
    console.log('\n  (dry run — re-run with --apply.)');
    return;
  }

  let hidden = 0;
  for (const p of products) {
    if (p.enrichment) {
      await db.productEnrichment.update({
        where: { id: p.enrichment.id },
        data: { reviewStatus: 'HIDDEN', isPublic: false, needsReview: false },
      });
    } else {
      await db.productEnrichment.create({
        data: { rawProductId: p.id, reviewStatus: 'HIDDEN', isPublic: false, needsReview: false },
      });
    }
    hidden += 1;
  }

  let removed = 0;
  if (strollerRows.length) {
    const res = await db.stroller.deleteMany({ where: { id: { in: strollerRows.map((s) => s.id) } } });
    removed = res.count;
  }

  console.log(`\n  Hid ${hidden} catalog product(s); removed ${removed} Stroller row(s). Chariot is now out of all tools.`);
}

main()
  .catch((error) => {
    console.error('[hideChariot] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
