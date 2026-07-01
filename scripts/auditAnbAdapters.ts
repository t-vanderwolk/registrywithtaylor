/**
 * Read-only audit: which car-seat adapters would lose their buy link now that
 * ANB Baby (Awin) links are excluded from the travel-system checker.
 *
 * For every stroller it finds the adapter products that match its model, splits
 * them by provider, and flags the strollers whose ONLY matching adapter is an
 * ANB product (no Babylist / MacroBaby equivalent). Those are the gaps to fill.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:audit-anb-adapters
 */
import prismaBase from '@/lib/server/prisma';
import { adapterTitleMatchesStrollerModel } from '@/lib/catalog/adapterModelMatching';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const isAnb = (p: string) => p === 'awin_anbbaby';
const isBabylistOrMacro = (p: string) => p === 'babylist_impact' || p === 'shopify_macrobaby';

type Adapter = { provider: string; title: string; affiliateUrl: string | null };

async function main() {
  const adapters: Adapter[] = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      title: { contains: 'adapter', mode: 'insensitive' },
      enrichment: {
        is: { tmbcCategory: 'Travel Systems & Adapters', needsReview: false, reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] } },
      },
    },
    select: { provider: true, title: true, affiliateUrl: true },
  });

  const byProvider = adapters.reduce<Record<string, number>>((acc, a) => {
    acc[a.provider] = (acc[a.provider] ?? 0) + 1;
    return acc;
  }, {});

  const anbAdapters = adapters.filter((a) => isAnb(a.provider));
  const bmAdapters = adapters.filter((a) => isBabylistOrMacro(a.provider));

  const strollers: Array<{ brand: string; model: string }> = await db.stroller.findMany({
    select: { brand: true, model: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });

  const gaps: Array<{ stroller: string; anbTitles: string[] }> = [];
  const coveredAnbTitles = new Set<string>();

  for (const s of strollers) {
    const anbMatch = anbAdapters.filter((a) => adapterTitleMatchesStrollerModel(a.title, s.model, s.brand).matched);
    if (anbMatch.length === 0) continue;
    const bmMatch = bmAdapters.filter((a) => adapterTitleMatchesStrollerModel(a.title, s.model, s.brand).matched);
    if (bmMatch.length === 0) {
      gaps.push({ stroller: `${s.brand} ${s.model}`, anbTitles: anbMatch.map((a) => a.title) });
    } else {
      anbMatch.forEach((a) => coveredAnbTitles.add(a.title));
    }
  }

  console.log('── ANB adapter audit ──\n');
  console.log('  adapter products by provider:');
  Object.entries(byProvider).forEach(([p, n]) => console.log(`    ${String(n).padStart(4)}  ${p}`));
  console.log(`\n  ANB adapter products: ${anbAdapters.length}`);
  console.log(`  Babylist/MacroBaby adapter products: ${bmAdapters.length}`);

  console.log(`\n  ── GAPS (${gaps.length}) — strollers whose only matching adapter is ANB ──`);
  if (gaps.length === 0) {
    console.log('    none — every ANB-matched stroller also has a Babylist/MacroBaby adapter.');
  } else {
    for (const g of gaps) {
      console.log(`    • ${g.stroller}`);
      g.anbTitles.forEach((t) => console.log(`        ANB: ${t.slice(0, 80)}`));
    }
  }

  // ANB adapters that never appear as a gap (a Babylist/MacroBaby version already exists).
  const gapAnbTitles = new Set(gaps.flatMap((g) => g.anbTitles));
  const anbTitlesUnused = anbAdapters.map((a) => a.title).filter((t) => !gapAnbTitles.has(t) && !coveredAnbTitles.has(t));
  console.log(`\n  ANB adapters that match no stroller (safe to ignore): ${anbTitlesUnused.length}`);

  console.log('\n  Every ANB adapter, for reference:');
  anbAdapters
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((a) => console.log(`    - ${a.title.slice(0, 90)}`));
}

main()
  .catch((error) => {
    console.error('[auditAnbAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
