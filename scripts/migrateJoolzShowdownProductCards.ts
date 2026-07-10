/**
 * Convert the affiliate CTAs on "joolz-aer-vs-joolz-dot-showdown" into
 * `:::catalog-product` cards. It's a two-stroller comparison — Joolz Aer² and
 * Joolz Dot — whose Amazon CTAs repeat across the intro, the deep-dives, and the
 * "Choose … If" sections. We card the FIRST CTA per stroller (at its dedicated
 * `### Joolz Aer²` / `### Joolz Dot` heading) and leave the scattered repeats.
 *
 * Both are catalogue strollers, so the cards also pick up live price, Babylist,
 * and a "Check compatible car seats" link at render time; the Amazon link from
 * the CTA + the section image are baked in as the guaranteed floor.
 *
 *   npx tsx scripts/migrateJoolzShowdownProductCards.ts            # dry run
 *   npx tsx scripts/migrateJoolzShowdownProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateJoolzShowdownProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'joolz-aer-vs-joolz-dot-showdown';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

type ProductKey = 'aer' | 'dot';

const PRODUCTS: Record<ProductKey, { brand: string; product: string }> = {
  aer: { brand: 'Joolz', product: 'Aer²' },
  dot: { brand: 'Joolz', product: 'Dot' },
};

/** Map a heading to the stroller it introduces. "… vs …" matches Aer² first
 *  (harmless — both are already carded by the time that section is reached). */
function resolveHeadingProduct(title: string): ProductKey | null {
  const t = title.toLowerCase();
  if (/joolz\s*aer/.test(t)) return 'aer';
  if (/joolz\s*dot/.test(t)) return 'dot';
  return null;
}

type LinkKind = 'babylist' | 'amazon' | 'macrobaby' | 'shop';

function classifyUrl(url: string): LinkKind | null {
  if (IMAGE_HOST_OR_EXT.test(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('taylormadebabyco.com')) return null;
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

function buildBlock(brand: string, product: string, links: Links, imageUrl: string | null): string {
  const out = [':::catalog-product', `Brand: ${brand}`, `Product: ${product}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) { out.push(`Shop: ${links.shop}`); out.push('Retailer: Shop'); }
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

export function transformJoolz(content: string): TransformResult {
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
  let heroImage: string | null = null;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const trimmed = (lines[idx] ?? '').trim();

    if (/^#{2,}\s/.test(trimmed)) {
      const title = trimmed.replace(/^#{2,}\s+/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const mapped = resolveHeadingProduct(title);
      if (mapped) { current = mapped; heroImage = null; }
      continue;
    }

    const imgMatch = trimmed.match(IMAGE_LINE);
    if (imgMatch && current && !heroImage) heroImage = imgMatch[1];

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

    if (!current) { notes.push(`• CTA at line ${idx + 1}: no product context (intro) — left as-is.`); continue; }
    if (carded.has(current)) { notes.push(`• ${PRODUCTS[current].brand} ${PRODUCTS[current].product} already carded — repeat left.`); continue; }
    if (Object.keys(links).length === 0) { ctaIdxs.forEach((i) => dropIndices.add(i)); continue; }

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
    const imageUrl = localImage ?? heroImage;

    const { brand, product } = PRODUCTS[current];
    const block = buildBlock(brand, product, links, imageUrl);

    const anchor = localImageIdx >= 0 ? localImageIdx : ctaIdxs[0];
    insertBlockAt.set(anchor, block);
    if (localImageIdx >= 0) { dropIndices.add(localImageIdx); captionIdxs.forEach((i) => dropIndices.add(i)); }
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

  const { content: converted, changed, notes, blocks } = transformJoolz(post.content ?? '');

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
