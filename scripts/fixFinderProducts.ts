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
  // ── Remove ──
  // Malformed / unwanted Full-Size card.
  { label: 'Nuna MIXX Next (remove malformed Biscotti card)', brand: 'Nuna', titleContains: 'MIXX next', action: 'hide' },
  // Mompush "Ultimate 2 Stroller Seat" is the ~$130 second-seat accessory, not a
  // stroller. (Scoped to "Stroller Seat" so it never touches the Ultimate 2
  // *stroller*, which Babylist lists as "Ultimate 2 Seat Stroller".)
  { label: 'Mompush Ultimate 2 second-seat accessory (remove)', brand: 'Mompush', titleContains: 'Stroller Seat', action: 'hide' },

  // ── Merge duplicate / malformed cards into their clean twin (shared canonicalName) ──
  { label: 'Nuna DEMI Icon (merge "in Caviar" variant)', brand: 'Nuna', titleContains: 'DEMI Icon', action: 'rename', canonicalName: 'DEMI Icon' },
  { label: 'Nuna Tavo Next (merge "Granite" variant)', brand: 'Nuna', titleContains: 'Tavo Next', action: 'rename', canonicalName: 'Tavo Next' },
  { label: 'Peg Perego Vivace (merge "Single" variant)', brand: 'Peg Perego', titleContains: 'Vivace', action: 'rename', canonicalName: 'Vivace' },
  { label: 'Joie Poppy Whirl (clean doubled-brand / colour name)', brand: 'Joie', titleContains: 'Poppy', action: 'rename', canonicalName: 'Poppy Whirl' },
  { label: 'Delta BabyGap 2-in-1 Carriage (clean "Children -" artifact)', brand: 'Delta', titleContains: '2-In-1 Carriage', action: 'rename', canonicalName: 'BabyGap 2-in-1 Carriage' },

  // ── Mockingbird only makes the single-to-double convertible: move every
  //     Mockingbird card to that bucket and unify the name so they collapse to one. ──
  { label: 'Mockingbird → Single-to-Double bucket', brand: 'Mockingbird', titleContains: 'Mockingbird', action: 'recategorize', productType: 'single-to-double stroller' },
  { label: 'Mockingbird unify name', brand: 'Mockingbird', titleContains: 'Mockingbird', action: 'rename', canonicalName: 'Single-to-Double' },

  // ── Lightweight modular / mid-size → Compact bucket (assign explicitly,
  //     regardless of their current bucket). ──
  { label: 'Silver Cross Breez → Compact/Mid-Size', brand: 'Silver Cross', titleContains: 'Breez', action: 'recategorize', productType: 'compact stroller' },
  { label: 'Peg Perego City Loop → Compact/Mid-Size', brand: 'Peg Perego', titleContains: 'City Loop', action: 'recategorize', productType: 'compact stroller' },
  { label: 'Nuna SWIV → Compact/Mid-Size', brand: 'Nuna', titleContains: 'SWIV', action: 'recategorize', productType: 'compact stroller' },
  { label: 'Nuna TRIV next → Compact/Mid-Size', brand: 'Nuna', titleContains: 'TRIV', action: 'recategorize', productType: 'compact stroller' },

  // ── Targeted repositions ──
  { label: 'Joie Poppy Whirl → Compact/Mid-Size', brand: 'Joie', titleContains: 'Poppy', action: 'recategorize', productType: 'compact stroller' },
  { label: 'Baby Jogger City Mini GT3 → Jogging/All-Terrain', brand: 'Baby Jogger', titleContains: 'City Mini GT3', action: 'recategorize', productType: 'jogging stroller' },
  { label: 'Orbit Baby M+ → Travel', brand: 'Orbit Baby', titleContains: 'M+', action: 'recategorize', productType: 'travel stroller' },
  { label: 'Orbit Baby G5 → Full-Size', brand: 'Orbit Baby', titleContains: 'G5 Stroller', action: 'recategorize', productType: 'full-size stroller' },

  // ── Hides ──
  { label: 'Veer Cruiser City XL Essentials (hide)', brand: 'Veer', titleContains: 'City XL Essentials', action: 'hide' },
  { label: 'UPPAbaby Minu Duo double (hide)', brand: 'UPPAbaby', titleContains: 'Minu Duo', action: 'hide' },
  { label: 'Baby Jogger City Mini GT3 Single (hide)', brand: 'Baby Jogger', titleContains: 'City Mini GT3 Single', action: 'hide' },
  { label: 'Baby Jogger City Prix x Bike Trailer (hide)', brand: 'Baby Jogger', titleContains: 'Bike Trailer', action: 'hide' },
  { label: 'Peg Perego Volo Ultra Carry-On duplicate (hide)', brand: 'Peg Perego', titleContains: 'Volo Ultra', action: 'hide' },

  // ── Repositions ──
  { label: 'Thule Urban Glide 4-wheel → Full-Size', brand: 'Thule', titleContains: 'Urban Glide 4', action: 'recategorize', productType: 'full-size stroller' },
  { label: 'Joie Tansy → Umbrella', brand: 'Joie', titleContains: 'Tansy', action: 'recategorize', productType: 'umbrella stroller' },
  { label: 'Joie Caraway Whirl → Travel', brand: 'Joie', titleContains: 'Caraway', action: 'recategorize', productType: 'travel stroller' },
  { label: 'Graco Merge → Compact', brand: 'Graco', titleContains: 'Merge', action: 'recategorize', productType: 'compact stroller' },
  { label: 'Mima Creo → Compact', brand: 'Mima', titleContains: 'Creo', action: 'recategorize', productType: 'compact stroller' },
  { label: 'Mima Xari → Full-Size', brand: 'Mima', titleContains: 'Xari', action: 'recategorize', productType: 'full-size stroller' },
  { label: 'Mompush Meteor 2 → Compact', brand: 'Mompush', titleContains: 'Meteor', action: 'recategorize', productType: 'compact stroller' },
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
        // Update-only: never create enrichment here (would promote a non-stroller).
        if (!p.enrichment) {
          console.log(`    (skipped — no enrichment) ${p.title.slice(0, 60)}`);
          continue;
        }
        await db.productEnrichment.update({ where: { id: p.enrichment.id }, data: { productType: fix.productType } });
      } else if (fix.action === 'rename') {
        if (!p.enrichment) {
          console.log(`    (skipped — no enrichment) ${p.title.slice(0, 60)}`);
          continue;
        }
        await db.productEnrichment.update({ where: { id: p.enrichment.id }, data: { canonicalName: fix.canonicalName } });
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
