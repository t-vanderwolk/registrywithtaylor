/**
 * Move carrycots / bassinets out of the tools. Babylist files carry-cots and
 * stroller bassinets under stroller paths (some even under "full size
 * strollers"), so they can surface as strollers. This hides products whose
 * title is a cot/bassinet — but keeps real strollers that merely *include* a
 * bassinet (those have "stroller" in the title, e.g. "… Stroller & Bassinet
 * Bundle"). Hidden = reversible; the rows stay in the DB but drop out of every
 * tool, and the import preserves HIDDEN on re-sync.
 *
 *   npx tsx scripts/hideCotsBassinets.ts            # dry run (default)
 *   npx tsx scripts/hideCotsBassinets.ts --apply    # hide them
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-cots
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const COT_RE = /\bbassinets?\b|carry.?cot|\bcots?\b/i;

type Row = {
  id: string;
  title: string;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const candidates: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      OR: [
        { title: { contains: 'cot', mode: 'insensitive' } },
        { title: { contains: 'bassinet', mode: 'insensitive' } },
      ],
    },
    select: { id: true, title: true, enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true } } },
  });

  // It's a cot/bassinet (matches the pattern) and NOT a stroller listing.
  const targets = candidates.filter((p) => COT_RE.test(p.title) && !/\bstrollers?\b/i.test(p.title));

  const withEnrich = targets.filter((p) => p.enrichment && p.enrichment.reviewStatus !== 'HIDDEN');
  const alreadyHidden = targets.filter((p) => p.enrichment?.reviewStatus === 'HIDDEN').length;
  const noEnrich = targets.filter((p) => !p.enrichment).length;

  console.log('── Move cots / bassinets out of the tools ──');
  console.log(`  matched cot/bassinet products: ${targets.length}`);
  console.log(`  to hide now:                   ${withEnrich.length}`);
  console.log(`  already hidden:                ${alreadyHidden}`);
  console.log(`  no enrichment (already invisible): ${noEnrich}`);
  console.log('\n  products to hide:');
  withEnrich.forEach((p) =>
    console.log(`    [${p.enrichment?.tmbcCategory ?? '—'}] ${p.title.slice(0, 70)}`),
  );

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const ids = withEnrich.map((p) => p.enrichment!.id);
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: ids } },
    data: { reviewStatus: 'HIDDEN', isPublic: false },
  });
  console.log(`\n  Hid ${res.count} cot/bassinet products (reversible).`);
}

main()
  .catch((error) => {
    console.error('[hideCotsBassinets] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
