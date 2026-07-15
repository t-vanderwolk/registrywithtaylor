/**
 * Restore the Orbit Baby M+ travel stroller to the finder/checker.
 *
 * Un-hides Orbit Baby Strollers rows whose title is the M+ (a.k.a. "M plus"),
 * setting reviewStatus=REVIEWED / isPublic=true so the model reappears. Skips
 * accessories/bundles. Idempotent; dry-run default.
 *
 *   npx tsx scripts/restoreOrbitBabyMPlus.ts            # dry run
 *   npx tsx scripts/restoreOrbitBabyMPlus.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:restore-orbit-mplus-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// M+ / "M plus" (word-boundary so it won't hit unrelated models).
const MPLUS_RE = /\bm\s*\+|\bm\s*plus\b/i;
// Accessories/parts to leave hidden.
const EXCLUDE_RE = /\b(adapter|adaptor|base|seat|frame|chassis|canopy|bag|cover|liner|board|organi[sz]er|cup ?holder|cupholder|rain ?shield)\b/i;

type Row = {
  id: string;
  provider: string;
  title: string;
  affiliateUrl: string | null;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Orbit Baby', mode: 'insensitive' } },
    select: {
      id: true, provider: true, title: true, affiliateUrl: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } },
    },
    orderBy: { title: 'asc' },
  });

  const targets = rows.filter(
    (r) =>
      r.enrichment &&
      r.enrichment.tmbcCategory === 'Strollers' &&
      r.enrichment.reviewStatus === 'HIDDEN' &&
      MPLUS_RE.test(r.title) &&
      !EXCLUDE_RE.test(r.title),
  );

  console.log(`── Restore Orbit Baby M+ ──  (${apply ? 'APPLY' : 'dry-run'})`);
  console.log(`  Orbit Baby rows: ${rows.length}   M+ rows to restore: ${targets.length}\n`);
  for (const r of targets) console.log(`    ✚ [${r.provider}] ${r.title}  ${r.affiliateUrl ? '' : '(no link)'}`);

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }
  if (targets.length === 0) {
    console.log('\n  Nothing hidden to restore — M+ may already be visible.');
    return;
  }
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: targets.map((r) => r.enrichment!.id) } },
    data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
  });
  console.log(`\n  Restored ${res.count} Orbit Baby M+ row(s). The finder should show it within ~10 min.`);
}

main()
  .catch((error) => {
    console.error('[restoreOrbitBabyMPlus] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
