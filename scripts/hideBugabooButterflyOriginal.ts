/**
 * Hide the original Bugaboo Butterfly in the finder, keeping only the Butterfly 2.
 *
 * Matches Bugaboo Strollers rows whose title mentions "Butterfly" but is NOT the
 * "Butterfly 2" (a.k.a. Butterfly II) — those originals get reviewStatus=HIDDEN
 * so they drop out of the finder/checker. Idempotent; dry-run default.
 *
 *   npx tsx scripts/hideBugabooButterflyOriginal.ts            # dry run
 *   npx tsx scripts/hideBugabooButterflyOriginal.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-butterfly-og-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// The Butterfly 2 (keep). Anything Butterfly that is NOT this is the original.
const BUTTERFLY_2_RE = /butterfly\s*(?:2|ii)\b/i;

type Row = {
  id: string;
  provider: string;
  title: string;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      brand: { contains: 'Bugaboo', mode: 'insensitive' },
      title: { contains: 'butterfly', mode: 'insensitive' },
    },
    select: {
      id: true, provider: true, title: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } },
    },
    orderBy: { title: 'asc' },
  });

  const originals = rows.filter(
    (r) =>
      r.enrichment &&
      r.enrichment.tmbcCategory === 'Strollers' &&
      r.enrichment.reviewStatus !== 'HIDDEN' &&
      !BUTTERFLY_2_RE.test(r.title),
  );
  const kept = rows.filter((r) => BUTTERFLY_2_RE.test(r.title));

  console.log(`── Hide original Bugaboo Butterfly ──  (${apply ? 'APPLY' : 'dry-run'})`);
  console.log(`  Butterfly rows total: ${rows.length}   originals to hide: ${originals.length}   Butterfly 2 (kept): ${kept.length}\n`);
  for (const r of originals) console.log(`    ✖ hide  [${r.provider}] ${r.title}`);
  for (const r of kept) console.log(`    ✓ keep  [${r.provider}] ${r.title}`);

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }
  if (originals.length === 0) {
    console.log('\n  Nothing to hide.');
    return;
  }
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: originals.map((r) => r.enrichment!.id) } },
    data: { reviewStatus: 'HIDDEN', isPublic: false },
  });
  console.log(`\n  Hid ${res.count} original Butterfly row(s). Only the Butterfly 2 will show (within ~10 min).`);
}

main()
  .catch((error) => {
    console.error('[hideBugabooButterflyOriginal] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
