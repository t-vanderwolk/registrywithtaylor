/**
 * Apply targeted, per-product fixes to specific finder products that the
 * rule-based recategorizer shouldn't generalize — hide a junk/duplicate card,
 * force a single product into a bucket, or set a clean display name
 * (canonicalName) so a malformed variant collapses into its sibling card.
 *
 * Edit FIXES, dry-run, review, then --apply.
 *
 *   npx tsx scripts/fixFinderProducts.ts            # dry run (default)
 *   npx tsx scripts/fixFinderProducts.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:fix-finder-products-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Fix =
  | { label: string; brand: string; titleContains: string; action: 'hide' }
  | { label: string; brand: string; titleContains: string; action: 'recategorize'; productType: string }
  | { label: string; brand: string; titleContains: string; action: 'rename'; canonicalName: string };

// One row per product fix. titleContains is matched case-insensitively within
// the catalog title, scoped to the brand, so it only touches the intended rows.
const FIXES: Fix[] = [
  // Malformed / unwanted Full-Size card — remove it from the finder + checker.
  { label: 'Nuna MIXX Next (remove malformed Biscotti card)', brand: 'Nuna', titleContains: 'MIXX next', action: 'hide' },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Fix finder products ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  let touched = 0;
  for (const fix of FIXES) {
    const products: Array<{ id: string; title: string; enrichment: { id: string } | null }> =
      await db.affiliateCatalogProduct.findMany({
        where: {
          brand: { startsWith: fix.brand, mode: 'insensitive' },
          title: { contains: fix.titleContains, mode: 'insensitive' },
        },
        select: { id: true, title: true, enrichment: { select: { id: true } } },
      });

    console.log(`${fix.action.toUpperCase()}  ${fix.label}  → ${products.length} product(s)`);
    products.forEach((p) => console.log(`    • ${p.title.slice(0, 76)}`));

    if (!apply) continue;

    for (const p of products) {
      if (fix.action === 'hide') {
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
      } else if (fix.action === 'recategorize') {
        await db.productEnrichment.upsert({
          where: { rawProductId: p.id },
          update: { productType: fix.productType },
          create: { rawProductId: p.id, productType: fix.productType, tmbcCategory: 'Strollers' },
        });
      } else if (fix.action === 'rename') {
        await db.productEnrichment.upsert({
          where: { rawProductId: p.id },
          update: { canonicalName: fix.canonicalName },
          create: { rawProductId: p.id, canonicalName: fix.canonicalName, tmbcCategory: 'Strollers' },
        });
      }
      touched += 1;
    }
  }

  console.log(`\n${apply ? `Done — updated ${touched} product(s).` : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[fixFinderProducts] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
