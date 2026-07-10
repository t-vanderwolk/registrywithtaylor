/**
 * Convert the affiliate CTAs on "best-convertible-single-to-double-strollers-2026"
 * into `:::catalog-product` cards.
 *
 * Heading-driven: each stroller is a `### Brand Model` subsection (under a
 * `## Best …` category heading) that leads with an image + one or two CTAs, and
 * each product appears exactly once. We map every CTA to its stroller by the
 * nearest product heading and swap the image + caption + CTA(s) for a card.
 * Because these are real catalogue strollers, the cards also pick up live price
 * and a "Check compatible car seats" link at render time.
 *
 * Non-product headings ("Quick Specs", "Why It Works", the category `##`s, etc.)
 * don't match the product map, so they leave the current context untouched.
 *
 * Generic + idempotent:
 *   • Links are read at runtime from the CTA store (nothing hard-coded).
 *   • Consecutive CTA lines collapse into one card (Demi + Gazelle have two).
 *   • Existing cards seed the "already carded" set, so re-runs are safe.
 *   • Orphaned CTA buttons (no longer referenced by any slot) are pruned.
 *
 *   npx tsx scripts/migrateConvertibleDoubleStrollerProductCards.ts            # dry run
 *   npx tsx scripts/migrateConvertibleDoubleStrollerProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateConvertibleDoubleStrollerProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'best-convertible-single-to-double-strollers-2026';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
// Match images by extension (all the product photos end in .jpg/.png/etc before
// any query string) or a pure-image CDN. Do NOT list retailer domains like
// macrobaby here — their /products/ URLs are buy links, not images.
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

type ProductKey = 'veer' | 'donkey' | 'demi' | 'gazelle' | 'wave3';

const PRODUCTS: Record<ProductKey, { brand: string; product: string; image: string }> = {
  veer: { brand: 'Veer', product: 'Switchback & Roll', image: 'https://www.albeebaby.com/cdn/shop/files/BOX-SNR-LEA-RQTZ-SBAS-RQTZ.jpg?v=1763758468&width=1946' },
  donkey: { brand: 'Bugaboo', product: 'Donkey 6', image: 'https://www.macrobaby.com/cdn/shop/files/bugaboo-donkey-6-complete-stroller-black-moon-grey_image_4.jpg?v=1773080432' },
  demi: { brand: 'Nuna', product: 'Demi Next', image: 'https://images.ctfassets.net/50gzycvace50/d2fbe41e08551d87663ff795bf859fe2a3eb6b148618c272c7b91259586c9321/4f926312f6440741b1a6cf9e37b03079/d2fbe41e08551d87663ff795bf859fe2a3eb6b148618c272c7b91259586c9321.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240' },
  gazelle: { brand: 'Cybex', product: 'Gazelle S', image: 'https://m.media-amazon.com/images/I/71dPyrEiz8L._SL1500_.jpg' },
  wave3: { brand: 'Silver Cross', product: 'Wave 3', image: 'https://images.ctfassets.net/50gzycvace50/fd464c5bce6815b7707aa893c69578d935b12db6ede8751f3f5f726da8edfa45/c343f320709c3a172677695210c2f427/fd464c5bce6815b7707aa893c69578d935b12db6ede8751f3f5f726da8edfa45.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240' },
};

/** Map a heading to the stroller it introduces, or null for non-product headings
 *  (which inherit the current product context). */
function resolveHeadingProduct(title: string): ProductKey | null {
  const t = title.toLowerCase();
  if (/veer\s+switchback/.test(t)) return 'veer';
  if (/bugaboo\s+donkey/.test(t)) return 'donkey';
  if (/nuna\s+demi\s+next/.test(t)) return 'demi';
  if (/cybex\s+gazelle/.test(t)) return 'gazelle';
  if (/silver\s+cross\s+wave/.test(t)) return 'wave3';
  return null;
}

type LinkKind = 'babylist' | 'amazon' | 'macrobaby' | 'shop';

function classifyUrl(url: string): LinkKind | null {
  if (IMAGE_HOST_OR_EXT.test(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  return 'shop';
}

type Links = Partial<Record<LinkKind, string>>;

function ctaLineLinks(lraw: string, buttonById: Map<string, CtaButton>): Links | null {
  const lt = lraw.trim();
  if (lt === '') return null;

  const slotId = parseCtaSlotLine(lt);
  if (slotId) {
    const btn = buttonById.get(slotId);
    if (!btn) return {};
    const kind = classifyUrl(btn.url);
    return kind ? { [kind]: btn.url } : {};
  }

  MD_LINK.lastIndex = 0;
  const links: Links = {};
  let m: RegExpExecArray | null;
  let hasNonAffiliate = false;
  let sawAnyLink = false;
  while ((m = MD_LINK.exec(lraw)) !== null) {
    if (m[1] === '!') continue;
    sawAnyLink = true;
    const kind = classifyUrl(m[3]);
    if (kind) {
      if (!links[kind]) links[kind] = m[3];
    } else hasNonAffiliate = true;
  }
  const strippedBare = lraw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '').length === 0;
  if (sawAnyLink && Object.keys(links).length > 0 && !hasNonAffiliate && strippedBare) return links;
  return null;
}

const isSilverCross = (brand: string) => /silver\s*cross/i.test(brand);

function buildBlock(brand: string, product: string, links: Links, imageUrl: string | null): string {
  const out = [':::catalog-product', `Brand: ${brand}`, `Product: ${product}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.amazon) out.push(`Amazon: ${links.amazon}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) {
    out.push(`Shop: ${links.shop}`);
    out.push(`Retailer: ${isSilverCross(brand) ? 'Silver Cross' : 'Shop'}`);
    if (isSilverCross(brand)) out.push('Primary: shop');
  }
  if (imageUrl) out.push(`Image: ${imageUrl}`);
  out.push(':::');
  return out.join('\n');
}

const BRAND_PRODUCT_TO_KEY = new Map<string, ProductKey>(
  (Object.entries(PRODUCTS) as Array<[ProductKey, (typeof PRODUCTS)[ProductKey]]>).map(([k, v]) => [
    `${v.brand} ${v.product}`.toLowerCase(),
    k,
  ]),
);
const CARD_BLOCK_RE = /:::catalog-product\n([\s\S]*?)\n:::/g;

function alreadyCardedProducts(content: string): Set<ProductKey> {
  const out = new Set<ProductKey>();
  for (const m of content.matchAll(CARD_BLOCK_RE)) {
    const brand = m[1].match(/^Brand:\s*(.+)$/im)?.[1]?.trim() ?? '';
    const product = m[1].match(/^Product:\s*(.+)$/im)?.[1]?.trim() ?? '';
    const key = BRAND_PRODUCT_TO_KEY.get(`${brand} ${product}`.toLowerCase());
    if (key) out.add(key);
  }
  return out;
}

export type TransformResult = { content: string; changed: number; notes: string[]; blocks: string[] };

export function transformConvertibleDoubles(content: string): TransformResult {
  const stored = extractStoredCtaButtons(content ?? '');
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');

  const dropIndices = new Set<number>();
  const insertBlockAt = new Map<number, string>();
  const notes: string[] = [];
  const blocks: string[] = [];
  const carded = alreadyCardedProducts(stored.body);
  let changed = 0;
  let current: ProductKey | null = null;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const trimmed = (lines[idx] ?? '').trim();

    // Any heading (## category or ### product). Product headings set context;
    // everything else leaves it unchanged.
    if (/^#{2,}\s/.test(trimmed)) {
      const title = trimmed.replace(/^#{2,}\s+/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const mapped = resolveHeadingProduct(title);
      if (mapped) current = mapped;
      continue;
    }

    const first = ctaLineLinks(lines[idx] ?? '', buttonById);
    if (!first) continue;

    const links: Links = { ...first };
    const ctaIdxs = [idx];
    let j = idx + 1;
    for (; j < lines.length; j += 1) {
      const lt = (lines[j] ?? '').trim();
      if (lt === '') continue;
      const more = ctaLineLinks(lines[j] ?? '', buttonById);
      if (!more) break;
      for (const [k, v] of Object.entries(more) as Array<[LinkKind, string]>) if (!links[k]) links[k] = v;
      ctaIdxs.push(j);
    }
    idx = ctaIdxs[ctaIdxs.length - 1];

    if (!current) {
      notes.push(`• CTA at line ${idx + 1} has no product context — left as-is.`);
      continue;
    }
    if (carded.has(current)) {
      notes.push(`• ${PRODUCTS[current].brand} ${PRODUCTS[current].product} already carded — extra CTA left as a button.`);
      continue;
    }
    if (Object.keys(links).length === 0) {
      ctaIdxs.forEach((i) => dropIndices.add(i));
      continue;
    }

    let localImageIdx = -1;
    const captionIdxs: number[] = [];
    for (let i = ctaIdxs[0] - 1; i >= 0; i -= 1) {
      const lt = (lines[i] ?? '').trim();
      if (lt === '') continue;
      if (CAPTION_LINE.test(lt)) { captionIdxs.push(i); continue; }
      if (IMAGE_LINE.test(lt)) { localImageIdx = i; }
      break;
    }
    const localImage = localImageIdx >= 0 ? (lines[localImageIdx].trim().match(IMAGE_LINE)?.[1] ?? null) : null;

    const { brand, product, image } = PRODUCTS[current];
    const imageUrl = localImage ?? image;
    const block = buildBlock(brand, product, links, imageUrl);

    const anchor = localImageIdx >= 0 ? localImageIdx : ctaIdxs[0];
    insertBlockAt.set(anchor, block);
    if (localImageIdx >= 0) dropIndices.add(localImageIdx);
    captionIdxs.forEach((i) => dropIndices.add(i));
    ctaIdxs.forEach((i) => dropIndices.add(i));

    carded.add(current);
    changed += 1;
    blocks.push(`──────── ${brand} ${product} ────────\n${block}`);
  }

  const rebuilt: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (insertBlockAt.has(i)) rebuilt.push('', insertBlockAt.get(i)!, '');
    if (dropIndices.has(i)) continue;
    rebuilt.push(lines[i]);
  }

  const referenced = new Set<string>();
  for (const raw of rebuilt) {
    const id = parseCtaSlotLine(raw.trim());
    if (id) referenced.add(id);
  }
  const remainingButtons = stored.buttons.filter((b) => referenced.has(b.id));
  const content2 = serializeCtaButtons(rebuilt.join('\n'), remainingButtons).replace(/\n{3,}/g, '\n\n');

  notes.unshift(`CTA buttons kept: ${remainingButtons.length}/${stored.buttons.length}`);
  return { content: content2, changed, notes, blocks };
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const { content: converted, changed, notes, blocks } = transformConvertibleDoubles(post.content ?? '');

  blocks.forEach((b) => console.log(`\n${b}`));
  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Strollers carded: ${changed}`);
  if (notes.length) console.log('\nNotes:\n' + notes.join('\n'));

  if (!changed) {
    console.log('\nNothing to change (already migrated?).');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: converted } });
  console.log(`\n✓ Applied. ${changed} card(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
