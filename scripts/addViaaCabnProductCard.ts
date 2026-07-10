/**
 * "nuna-viaa-cabn-has-arrived" is a single-product review with NO affiliate CTA
 * anywhere in the body — so there's nothing to convert, and nothing to buy. This
 * inserts one `:::catalog-product` card for the Nuna VIAA CABN right after the
 * intro (before "## What Makes the VIAA CABN Different").
 *
 * The card's buy link + image + price are resolved from the affiliate catalogue
 * at runtime and baked into the block, so it's guaranteed to render a button
 * (a card with no retailer renders nothing). Being a catalogue stroller, it also
 * gets a "Check compatible car seats" link at render time.
 *
 * Idempotent: skips if a VIAA CABN card already exists. Dry-run by default.
 *
 *   npx tsx scripts/addViaaCabnProductCard.ts            # dry run
 *   npx tsx scripts/addViaaCabnProductCard.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/addViaaCabnProductCard.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { resolveBlogProductCatalogLinks } from '@/lib/server/blogCatalogLinks';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'nuna-viaa-cabn-has-arrived';
const APPLY = process.argv.includes('--apply');

const BRAND = 'Nuna';
const PRODUCT = 'VIAA CABN';
const ANCHOR = /^##\s+What Makes the VIAA CABN Different\s*$/m;
// Hero image from the post, used only if the catalogue has none.
const FALLBACK_IMAGE =
  'https://nunababy.com/media/catalog/product/n/u/nuna_viaacabn_caviarccr_profile-2up_us_web.png?optimize=high&fit=bounds&height=730&width=730&canvas=730:730&format=jpeg';

type Baked = { babylist?: string; macrobaby?: string; image?: string | null; price?: number | null; retailer?: string | null };

function buildBlock(b: Baked): string {
  const out = [':::catalog-product', `Brand: ${BRAND}`, `Product: ${PRODUCT}`];
  if (b.babylist) out.push(`Babylist: ${b.babylist}`);
  if (b.macrobaby) out.push(`MacroBaby: ${b.macrobaby}`);
  out.push(`Image: ${b.image || FALLBACK_IMAGE}`);
  if (b.price != null) out.push(`Price: $${b.price}${b.retailer ? ` via ${b.retailer}` : ''}`);
  out.push(':::');
  return out.join('\n');
}

/** Pure insertion: drop the block before the anchor heading. Returns null if a
 *  VIAA CABN card already exists or the anchor isn't found. */
export function insertViaaCard(content: string, block: string): string | null {
  if (/:::catalog-product[\s\S]*?Product:\s*VIAA CABN/i.test(content)) return null; // already there
  const m = content.match(ANCHOR);
  if (!m || m.index == null) return null;
  const before = content.slice(0, m.index).replace(/\s+$/, '');
  const after = content.slice(m.index);
  return `${before}\n\n${block}\n\n${after}`;
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }
  const content: string = post.content ?? '';

  if (/:::catalog-product[\s\S]*?Product:\s*VIAA CABN/i.test(content)) {
    console.log('✓ VIAA CABN card already present — nothing to do.');
    return;
  }
  if (!ANCHOR.test(content)) {
    console.error('✗ Anchor heading "## What Makes the VIAA CABN Different" not found. Aborting so nothing lands in the wrong place.');
    process.exit(1);
  }

  // Resolve the catalogue link so the card is guaranteed a buy button.
  const baked: Baked = {};
  try {
    const matches = await resolveBlogProductCatalogLinks([{ brand: BRAND, productName: PRODUCT }]);
    const match = matches[blogProductKey(BRAND, PRODUCT)];
    if (match?.affiliateUrl) {
      const url = match.affiliateUrl;
      if (/babylist/i.test(url)) baked.babylist = url;
      else if (/macrobaby/i.test(url)) baked.macrobaby = url;
      else baked.babylist = url; // default label
      baked.image = match.imageUrl;
      baked.price = match.price;
      baked.retailer = match.retailer;
    }
  } catch {
    /* catalogue unreachable — handled below */
  }

  if (!baked.babylist && !baked.macrobaby) {
    console.error(
      '✗ No catalogue buy link found for Nuna VIAA CABN. A card with no retailer renders nothing, so aborting.\n' +
        '  (Run against the prod DB, or add VIAA CABN to the catalogue first.)',
    );
    process.exit(1);
  }

  const block = buildBlock(baked);
  const next = insertViaaCard(content, block);
  if (!next) {
    console.log('Nothing to change (card present or anchor missing).');
    return;
  }

  console.log(`Post: ${post.title} (${post.slug})`);
  console.log('\nCard to insert (after the intro):\n');
  console.log(block);

  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: next } });
  console.log(`\n✓ Applied. Inserted the VIAA CABN card on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
