/**
 * Convert the affiliate CTAs on "momcozy-baby-products" into `:::catalog-product`
 * cards. It's a Momcozy roundup: seven `## Momcozy …` sections, each ending with
 * a Momcozy (CJ affiliate) + Amazon CTA pair. None are catalogue strollers/car
 * seats, so each card carries the post's own image + buy links (Momcozy leads,
 * Amazon second).
 *
 * Heading-driven: every CTA is mapped to its product by the nearest `## Momcozy`
 * heading and the image directly above the CTA is absorbed into the card.
 *
 * Generic + idempotent:
 *   • Links are read at runtime from the CTA store (nothing hard-coded).
 *   • Consecutive CTA lines collapse into one card (Momcozy + Amazon).
 *   • Existing cards seed the "already carded" set, so re-runs are safe.
 *   • Orphaned CTA buttons (no longer referenced by any slot) are pruned.
 *
 *   npx tsx scripts/migrateMomcozyProductCards.ts            # dry run
 *   npx tsx scripts/migrateMomcozyProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateMomcozyProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'momcozy-baby-products';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|momcozy\.com\/cdn|ptengine|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

type ProductKey = 'dinerpal' | 'monitor' | 'aspirator' | 'airpurifier' | 'fan' | 'kit' | 'pet';

const PRODUCTS: Record<ProductKey, { brand: string; product: string; image: string }> = {
  dinerpal: { brand: 'Momcozy', product: 'DinerPal High Chair', image: 'https://momcozy.com/cdn/shop/files/dinerpal-high-chair-walnut.jpg?v=1772188328&width=720' },
  monitor: { brand: 'Momcozy', product: '5-inch Dual-Mode Smart Baby Monitor', image: 'https://momcozy.com/cdn/shop/files/01_4c42530c-411e-49a8-86a5-729bfa32119c.jpg?v=1745983430&width=720' },
  aspirator: { brand: 'Momcozy', product: '2-in-1 Electric Nasal Aspirator', image: 'https://momcozy.com/cdn/shop/files/BN07-1.jpg?v=1744180011&width=720' },
  airpurifier: { brand: 'Momcozy', product: 'Baby Air Purifier', image: 'https://momcozy.com/cdn/shop/files/74b96dbb2d19db9758ba306fc55ad040_dcc50329-4e86-4cb5-b563-dbaf134ae8c1.jpg?v=1760320878&width=720' },
  fan: { brand: 'Momcozy', product: 'Clip-On Stroller Fan', image: 'https://momcozy.com/cdn/shop/files/2_a340c7f3-4383-4b06-ae99-b89073598467.png?v=1747711841&width=720' },
  kit: { brand: 'Momcozy', product: 'All-in-One Core Baby Kit', image: 'https://momcozy.com/cdn/shop/files/core-DTC-1.jpg?v=1732950550&width=720' },
  pet: { brand: 'Momcozy', product: 'FurEase Pet Grooming Vacuum Kit', image: 'https://momcozy.com/cdn/shop/files/1_31c3027a-1b8e-478c-b50b-382961943784.jpg?v=1736220406&width=720' },
};

function resolveHeadingProduct(title: string): ProductKey | null {
  const t = title.toLowerCase();
  if (/dinerpal/.test(t)) return 'dinerpal';
  if (/baby monitor/.test(t)) return 'monitor';
  if (/nasal aspirator/.test(t)) return 'aspirator';
  if (/air purifier/.test(t)) return 'airpurifier';
  if (/stroller fan/.test(t)) return 'fan';
  if (/core baby kit|all-in-one/.test(t)) return 'kit';
  if (/pet|furease|grooming/.test(t)) return 'pet';
  return null;
}

type LinkKind = 'babylist' | 'amazon' | 'macrobaby' | 'shop';

function classifyUrl(url: string): LinkKind | null {
  if (IMAGE_HOST_OR_EXT.test(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  return 'shop'; // Momcozy CJ links (dpbolvw/tkqlhce/anrdoezrs/jdoqocy)
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

function buildBlock(brand: string, product: string, links: Links, imageUrl: string | null): string {
  const out = [':::catalog-product', `Brand: ${brand}`, `Product: ${product}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) {
    out.push(`Shop: ${links.shop}`);
    out.push('Retailer: Momcozy');
    out.push('Primary: shop'); // Momcozy store leads, Amazon second
  }
  if (links.amazon) out.push(`Amazon: ${links.amazon}`);
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

export function transformMomcozy(content: string): TransformResult {
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

    if (/^##\s/.test(trimmed) && !trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^##\s+/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
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
      notes.push(`• ${PRODUCTS[current].product} already carded — extra CTA left as a button.`);
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

  const { content: converted, changed, notes, blocks } = transformMomcozy(post.content ?? '');

  blocks.forEach((b) => console.log(`\n${b}`));
  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Products carded: ${changed}`);
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
