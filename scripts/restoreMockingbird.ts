/**
 * Diagnose + restore the Mockingbird brand card in the finder.
 *
 * Dry-run dumps the full catalog state of every Mockingbird row so we can see why
 * the brand vanished (all hidden? no core retailer? mis-categorized?). With
 * --apply it un-hides the clean, core-retailer Mockingbird STROLLER rows (Babylist
 * / MacroBaby / Bombi / manual_tmbc), skipping accessories/parts. Idempotent.
 *
 *   npx tsx scripts/restoreMockingbird.ts            # audit only
 *   npx tsx scripts/restoreMockingbird.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:restore-mockingbird-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const CORE_PROVIDERS = new Set(['babylist_impact', 'shopify_macrobaby', 'bombi_direct', 'manual_tmbc']);
// Accessories / parts to leave hidden.
const EXCLUDE_RE =
  /\b(adapter|adaptor|base|frame|chassis|canopy|bag|cover|liner|board|organi[sz]er|cup ?holder|cupholder|rain ?shield|snack|tray|footmuff|bench|seat pad|second seat|kit)\b/i;

type Row = {
  id: string;
  provider: string;
  title: string;
  affiliateUrl: string | null;
  retailer: string | null;
  isActiveInFeed: boolean;
  enrichment: {
    id: string;
    tmbcCategory: string | null;
    reviewStatus: string | null;
    isPublic: boolean | null;
    needsReview: boolean | null;
  } | null;
};

function isCore(r: Row): boolean {
  return Boolean(r.affiliateUrl && (CORE_PROVIDERS.has(r.provider) || /babylist|macrobaby|bombi/i.test(r.retailer ?? '')));
}

async function main() {
  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Mockingbird', mode: 'insensitive' } },
    select: {
      id: true, provider: true, title: true, affiliateUrl: true, retailer: true, isActiveInFeed: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true, isPublic: true, needsReview: true } },
    },
    orderBy: { title: 'asc' },
  });

  console.log(`── Mockingbird catalog rows: ${rows.length} ──  (${APPLY ? 'APPLY' : 'audit'})\n`);
  for (const r of rows) {
    const e = r.enrichment;
    console.log(`• ${r.title}`);
    console.log(
      `    cat=${e?.tmbcCategory ?? '—'}  review=${e?.reviewStatus ?? '—'}  public=${e?.isPublic ?? '—'}  ` +
        `needsReview=${e?.needsReview ?? '—'}  active=${r.isActiveInFeed}  core=${isCore(r)}  ` +
        `retailer=${r.retailer ?? r.provider}  link=${r.affiliateUrl ? 'yes' : 'NO'}`,
    );
  }

  const targets = rows.filter(
    (r) =>
      r.enrichment &&
      r.enrichment.tmbcCategory === 'Strollers' &&
      r.enrichment.reviewStatus === 'HIDDEN' &&
      isCore(r) &&
      !EXCLUDE_RE.test(r.title),
  );

  console.log(`\n  Clean hidden stroller rows to un-hide: ${targets.length}`);
  for (const r of targets) console.log(`    ✚ [${r.provider}] ${r.title}`);

  if (!APPLY) {
    console.log('\n  (audit only — re-run with --apply to un-hide the rows above.)');
    return;
  }
  if (targets.length === 0) {
    console.log('\n  Nothing hidden to restore. If the brand is still missing, no core-retailer stroller row exists —');
    console.log('  run `npm run catalog:add-mockingbird-apply` to add the manual Single Stroller 3.0.');
    return;
  }
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: targets.map((r) => r.enrichment!.id) } },
    data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
  });
  console.log(`\n  Restored ${res.count} Mockingbird stroller row(s). Brand card should return within ~10 min.`);
}

main()
  .catch((error) => {
    console.error('[restoreMockingbird] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
