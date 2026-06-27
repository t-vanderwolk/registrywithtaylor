/**
 * Report active catalog strollers by TMBC stroller category.
 *
 *   npm run catalog:audit-stroller-categories
 */
import prismaBase from '@/lib/server/prisma';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { STROLLER_CATEGORY_LABELS, type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Row = {
  provider: string;
  retailer: string | null;
  brand: string | null;
  title: string;
  enrichment: { productType: string | null } | null;
};

async function hasAffiliateCatalogProduct() {
  return db
    .$queryRawUnsafe("SELECT to_regclass('public.\"AffiliateCatalogProduct\"')::text AS exists")
    .then((rows: Array<{ exists: string | null }>) => Boolean(rows[0]?.exists))
    .catch(() => false);
}

async function main() {
  if (!(await hasAffiliateCatalogProduct())) {
    console.log('── Stroller category audit ──');
    console.log('  AffiliateCatalogProduct table is not present in this database; skipping catalog-row audit.');
    return;
  }

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      enrichment: { is: { tmbcCategory: 'Strollers', reviewStatus: { not: 'HIDDEN' } } },
    },
    select: {
      provider: true,
      retailer: true,
      brand: true,
      title: true,
      enrichment: { select: { productType: true } },
    },
    orderBy: [{ brand: 'asc' }, { title: 'asc' }],
  });

  const counts = new Map<StrollerCategory, number>();
  const unmapped: Row[] = [];
  const donkeyIssues: Row[] = [];

  for (const row of rows) {
    const category = strollerCategoryFromProductType(row.enrichment?.productType);
    if (!category) {
      unmapped.push(row);
      continue;
    }
    counts.set(category, (counts.get(category) ?? 0) + 1);
    if (/\bdonkey\b/i.test(row.title) && category !== 'convertible-modular' && category !== 'convertible-non-modular') {
      donkeyIssues.push(row);
    }
  }

  console.log('── Stroller category audit ──');
  console.log(`  active stroller catalog rows: ${rows.length}`);
  for (const [category, count] of [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${String(count).padStart(4)}  ${STROLLER_CATEGORY_LABELS[category] ?? category}`);
  }

  console.log(`\n  unmapped stroller rows: ${unmapped.length}`);
  unmapped.slice(0, 30).forEach((row) => {
    console.log(`    - ${row.provider} · ${row.brand ?? 'Unknown'} · ${row.title} (${row.enrichment?.productType ?? 'no type'})`);
  });

  console.log(`\n  Bugaboo Donkey not Single-to-Double: ${donkeyIssues.length}`);
  donkeyIssues.slice(0, 30).forEach((row) => {
    console.log(`    - ${row.provider} · ${row.title} (${row.enrichment?.productType ?? 'no type'})`);
  });
}

main()
  .catch((error) => {
    console.error('[auditStrollerCategories] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
