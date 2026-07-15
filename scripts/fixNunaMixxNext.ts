/**
 * Direct fix for the Nuna MIXX next finder gap. The audit showed the clean
 * Babylist MIXX next stroller colorways (Biscotti, Caviar, Cedar, Granite,
 * Macaron) are active + linked but HIDDEN, while the only visible rows are
 * GoodBuyGear/ANB/BMW — none of which surface as a clean "MIXX Next" card.
 *
 * This un-hides the plain Babylist/MacroBaby MIXX next STROLLER colorways (never
 * the BMW special edition, the "+ PIPA" car-seat bundles, or accessories), so the
 * finder + checker show a normal MIXX Next. Idempotent; dry-run default.
 *
 *   npx tsx scripts/fixNunaMixxNext.ts            # dry run
 *   npx tsx scripts/fixNunaMixxNext.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-nuna-mixx-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const CORE_PROVIDERS = new Set(['babylist_impact', 'shopify_macrobaby', 'bombi_direct']);
// Editions/bundles/accessories to leave alone.
const EXCLUDE_RE = /\bbmw\b|pipa|car ?seat|magnetic buckle|\bcupholder\b|\bcup ?holder\b|\+|element/i;

type Row = {
  id: string;
  provider: string;
  title: string;
  affiliateUrl: string | null;
  isActiveInFeed: boolean;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { contains: 'Nuna', mode: 'insensitive' },
      title: { contains: 'mixx next', mode: 'insensitive' },
    },
    select: {
      id: true, provider: true, title: true, affiliateUrl: true, isActiveInFeed: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } },
    },
    orderBy: { title: 'asc' },
  });

  const targets = rows.filter(
    (r) =>
      r.enrichment &&
      r.enrichment.tmbcCategory === 'Strollers' &&
      r.enrichment.reviewStatus === 'HIDDEN' &&
      r.isActiveInFeed &&
      r.affiliateUrl &&
      CORE_PROVIDERS.has(r.provider) &&
      !EXCLUDE_RE.test(r.title),
  );

  console.log(`── Fix Nuna MIXX next ──  (${apply ? 'APPLY' : 'dry-run'})`);
  console.log(`  matching MIXX next rows: ${rows.length}   clean colorways to un-hide: ${targets.length}\n`);
  for (const r of targets) console.log(`    ✚ [${r.provider}] ${r.title}`);

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }
  if (targets.length === 0) {
    console.log('\n  Nothing to un-hide — check the audit output.');
    return;
  }
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: targets.map((r) => r.enrichment!.id) } },
    data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
  });
  console.log(`\n  Un-hid ${res.count} clean MIXX next colorway(s). The finder should show MIXX Next within ~10 min.`);
}

main()
  .catch((error) => {
    console.error('[fixNunaMixxNext] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
