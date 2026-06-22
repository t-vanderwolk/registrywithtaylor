/**
 * Re-categorize the affiliate catalog WITHOUT re-importing the feed.
 *
 *   npx tsx scripts/recategorizeAffiliateCatalog.ts              # apply
 *   npx tsx scripts/recategorizeAffiliateCatalog.ts --dry-run   # preview, no writes
 *   npx tsx scripts/recategorizeAffiliateCatalog.ts --limit=500
 *
 * Reads each AffiliateCatalogProduct from the DB, re-runs the deterministic
 * categorizer with the CURRENT rules, and updates only products whose category
 * or product type actually changed — so a rule tweak (e.g. a new category) is
 * near-instant. REVIEWED / HIDDEN enrichment is human-owned and never touched.
 *
 * Run it against production by exporting the prod DB URL, same as the import:
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npm run catalog:recategorize
 */
import prismaBase from '@/lib/server/prisma';
import { categorizeProduct } from '@/lib/catalog/categorize';

// New models land in the generated client on `prisma generate`; cast keeps tsc green.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type EnrichmentRow = {
  id: string;
  reviewStatus: string;
  tmbcCategory: string | null;
  productType: string | null;
} | null;

type ProductRow = {
  id: string;
  title: string;
  brand: string | null;
  productTypePath: string | null;
  rawCategory: string | null;
  enrichment: EnrichmentRow;
};

function parseArgs() {
  const argv = process.argv.slice(2);
  const limitRaw = argv.find((a) => a.startsWith('--limit='));
  return {
    dryRun: argv.includes('--dry-run'),
    limit: limitRaw ? parseInt(limitRaw.split('=')[1] ?? '', 10) : null,
  };
}

async function main() {
  const args = parseArgs();

  const products: ProductRow[] = await db.affiliateCatalogProduct.findMany({
    select: {
      id: true,
      title: true,
      brand: true,
      productTypePath: true,
      rawCategory: true,
      enrichment: { select: { id: true, reviewStatus: true, tmbcCategory: true, productType: true } },
    },
    orderBy: { title: 'asc' },
    ...(args.limit ? { take: args.limit } : {}),
  });

  let changed = 0;
  let unchanged = 0;
  let createdMissing = 0;
  let needingReview = 0;
  let skippedReviewed = 0;
  let errors = 0;

  for (const p of products) {
    const enr = p.enrichment;
    if (enr && (enr.reviewStatus === 'REVIEWED' || enr.reviewStatus === 'HIDDEN')) {
      skippedReviewed += 1;
      continue;
    }

    const cat = categorizeProduct({
      title: p.title,
      brand: p.brand,
      productTypePath: p.productTypePath,
      rawCategory: p.rawCategory,
    });
    const isChange = !enr || enr.tmbcCategory !== cat.tmbcCategory || enr.productType !== cat.productType;

    if (!isChange) {
      unchanged += 1;
      continue;
    }

    const autoStatus = cat.needsReview ? 'NEEDS_REVIEW' : 'AUTO_CATEGORIZED';

    if (args.dryRun) {
      changed += 1;
      if (cat.needsReview) needingReview += 1;
      continue;
    }

    try {
      const data = {
        tmbcCategory: cat.tmbcCategory,
        productType: cat.productType,
        parentJourney: cat.parentJourney,
        confidenceScore: cat.confidenceScore,
        needsReview: cat.needsReview,
        reviewStatus: autoStatus,
      };
      if (!enr) {
        await db.productEnrichment.create({
          data: {
            rawProductId: p.id,
            canonicalBrand: p.brand,
            canonicalName: p.title,
            tags: cat.tags,
            ...data,
          },
        });
        createdMissing += 1;
      } else {
        await db.productEnrichment.update({ where: { id: enr.id }, data });
      }
      changed += 1;
      if (cat.needsReview) needingReview += 1;
    } catch (e) {
      errors += 1;
      console.error(`[recategorize] ${p.id}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log('\n── Re-categorize affiliate catalog ──');
  console.log(`  products scanned:        ${products.length}`);
  console.log(`  category changed:        ${changed}`);
  console.log(`  created missing enrich:  ${createdMissing}`);
  console.log(`  unchanged:               ${unchanged}`);
  console.log(`  needing review (of new): ${needingReview}`);
  console.log(`  skipped (human-reviewed): ${skippedReviewed}`);
  console.log(`  errors:                  ${errors}`);
  if (args.dryRun) console.log('  (dry run — no writes)');

  await db.$disconnect?.();
}

main().catch((e) => {
  console.error('[recategorizeAffiliateCatalog] failed:', e);
  process.exitCode = 1;
});
