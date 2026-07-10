/**
 * "silver-cross-cove-2-review" is already migrated — both products it sells
 * (Silver Cross Cove 2 and Reef 2) have `:::catalog-product` cards, and the
 * remaining "Pre-Order Cove 2 / Shop Reef 2" links are intentional repeat buy
 * buttons in the comparison/decision sections (same as the other showdown posts).
 *
 * The one defect: the Reef 2 card's `Product:` line redundantly repeats the
 * brand, so the card renders "Silver Cross Silver Cross Reef 2" (brand +
 * "Silver Cross Reef 2"). This strips the leading brand from any catalog-product
 * block whose Product starts with its own Brand, so it renders cleanly.
 *
 * Idempotent (a Product with no redundant brand is left alone). Dry-run default.
 *
 *   npx tsx scripts/fixCove2CardBrands.ts            # dry run
 *   npx tsx scripts/fixCove2CardBrands.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/fixCove2CardBrands.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'silver-cross-cove-2-review';
const APPLY = process.argv.includes('--apply');

const CARD_BLOCK_RE = /:::catalog-product\n([\s\S]*?)\n:::/g;

export type FixResult = { content: string; fixed: Array<{ brand: string; from: string; to: string }> };

/** Strip a redundant leading brand from each card's Product line. */
export function fixRedundantBrand(content: string): FixResult {
  const fixed: Array<{ brand: string; from: string; to: string }> = [];
  const next = content.replace(CARD_BLOCK_RE, (full, body: string) => {
    const brand = body.match(/^Brand:\s*(.+)$/im)?.[1]?.trim();
    const product = body.match(/^Product:\s*(.+)$/im)?.[1]?.trim();
    if (!brand || !product) return full;

    // Product like "Silver Cross Reef 2" with Brand "Silver Cross" → "Reef 2".
    const re = new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i');
    if (!re.test(product)) return full;
    const cleaned = product.replace(re, '').trim();
    if (!cleaned || cleaned.toLowerCase() === product.toLowerCase()) return full;

    fixed.push({ brand, from: product, to: cleaned });
    const newBody = body.replace(/^(Product:\s*).+$/im, `$1${cleaned}`);
    return `:::catalog-product\n${newBody}\n:::`;
  });
  return { content: next, fixed };
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const { content, fixed } = fixRedundantBrand(post.content ?? '');

  console.log(`Post: ${post.title} (${post.slug})`);
  if (fixed.length === 0) {
    console.log('No cards with a redundant brand — nothing to change.');
    return;
  }
  fixed.forEach((f) => console.log(`  ${f.brand}:  "${f.from}"  →  "${f.to}"`));

  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content } });
  console.log(`\n✓ Applied. Fixed ${fixed.length} card(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
