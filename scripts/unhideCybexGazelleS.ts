/**
 * Un-hide the Cybex Gazelle S (the standard, non-electric model) so it shows in
 * the finder next to the e-Gazelle. They resolve to separate model cards
 * ("Gazelle S" vs "e-Gazelle") and already share the same infant-seat adapters.
 *
 * Only touches genuine Gazelle S STROLLER rows on a core retailer (never the
 * electric e-Gazelle, and never adapter/accessory rows). Idempotent; dry-run
 * default.
 *
 *   npx tsx scripts/unhideCybexGazelleS.ts            # dry run
 *   npx tsx scripts/unhideCybexGazelleS.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:unhide-gazelle-s-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const CORE_PROVIDERS = new Set(['babylist_impact', 'shopify_macrobaby', 'bombi_direct', 'manual_tmbc']);
// The electric sibling and non-stroller accessories to leave alone.
const EXCLUDE_RE = /\be-?\s?gazelle\b|egazelle|electric|adapter|adaptor|cup ?holder|tray|bag|organi[sz]er|rain ?shield/i;

type Row = {
  id: string;
  provider: string;
  title: string;
  affiliateUrl: string | null;
  retailer: string | null;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null } | null;
};

function isCore(r: Row): boolean {
  return Boolean(r.affiliateUrl && (CORE_PROVIDERS.has(r.provider) || /babylist|macrobaby|bombi/i.test(r.retailer ?? '')));
}

async function main() {
  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { contains: 'Cybex', mode: 'insensitive' },
      title: { contains: 'gazelle', mode: 'insensitive' },
    },
    select: {
      id: true, provider: true, title: true, affiliateUrl: true, retailer: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } },
    },
    orderBy: { title: 'asc' },
  });

  const targets = rows.filter(
    (r) =>
      r.enrichment &&
      r.enrichment.tmbcCategory === 'Strollers' &&
      r.enrichment.reviewStatus === 'HIDDEN' &&
      isCore(r) &&
      !EXCLUDE_RE.test(r.title),
  );

  console.log(`── Un-hide Cybex Gazelle S ──  (${APPLY ? 'APPLY' : 'dry-run'})`);
  console.log(`  Cybex Gazelle rows: ${rows.length}   Gazelle S rows to un-hide: ${targets.length}\n`);
  for (const r of targets) console.log(`    ✚ [${r.provider}] ${r.title}`);

  if (!APPLY) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }
  if (targets.length === 0) {
    console.log('\n  Nothing hidden to un-hide — the Gazelle S may already be visible, or its row is on a non-core retailer only.');
    return;
  }
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: targets.map((r) => r.enrichment!.id) } },
    data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
  });
  console.log(`\n  Un-hid ${res.count} Gazelle S row(s). It should appear next to the e-Gazelle within ~10 min.`);
}

main()
  .catch((error) => {
    console.error('[unhideCybexGazelleS] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
