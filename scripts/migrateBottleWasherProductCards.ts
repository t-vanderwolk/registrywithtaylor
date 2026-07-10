/**
 * Convert every affiliate CTA on "bottle-washer-showdown-…" into a rich
 * `:::catalog-product` card.
 *
 * This post is heading-driven: each washer is a `## Brand Model` section that
 * leads with a product image + a single Amazon CTA, and the same buy links recur
 * lower down in the "## Choose <Brand> If…" decision blocks and the GE Profile
 * deep-dive ("## What Makes It Different", "## Best For"). We card the FIRST CTA
 * per product (its main section) and leave the repeat buttons in place, so each
 * washer gets exactly one card instead of two or three. The CTA is mapped to its
 * product by the nearest product-context `##` heading; the card absorbs the
 * product image + caption sitting directly above it.
 *
 * Generic + idempotent:
 *   • Links are read at runtime from the CTA store (nothing hard-coded).
 *   • Only the first CTA per product is carded; repeat buttons stay as-is.
 *   • A CTA already replaced by a card no longer exists → re-runs are safe.
 *   • Consecutive CTA lines collapse into one card.
 *   • Orphaned CTA buttons (no longer referenced by any slot) are pruned.
 *
 *   npx tsx scripts/migrateBottleWasherProductCards.ts            # dry run
 *   npx tsx scripts/migrateBottleWasherProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateBottleWasherProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'bottle-washer-showdown-momcozy-grownsy-bc-babycare-eufy-papablic';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

type ProductKey = 'momcozy' | 'grownsy' | 'bc' | 'eufy' | 'papablic' | 'ge';

const PRODUCTS: Record<ProductKey, { brand: string; product: string; image: string }> = {
  momcozy: { brand: 'Momcozy', product: 'KleanPal Pro', image: 'https://m.media-amazon.com/images/I/51bYxBVtzSL._SL1500_.jpg' },
  grownsy: { brand: 'Grownsy', product: 'EaseClean Pro', image: 'https://m.media-amazon.com/images/I/61yZZ73zERL._SL1500_.jpg' },
  bc: { brand: 'BC Babycare', product: 'Clarvion Baby Bottle Washer', image: 'https://m.media-amazon.com/images/I/6162gKrPTtL._SL1500_.jpg' },
  eufy: { brand: 'Eufy', product: 'Bottle Washer Pro', image: 'https://m.media-amazon.com/images/I/61kzawZ2FdL._SL1500_.jpg' },
  papablic: { brand: 'Papablic', product: 'Bottle Washer Pro', image: 'https://m.media-amazon.com/images/I/71Yibp5sxBL._AC_SL1500_.jpg' },
  ge: { brand: 'GE Profile', product: 'Smart Countertop Dishwasher', image: 'https://m.media-amazon.com/images/I/81hH92+crfL._AC_SL1500_.jpg' },
};

const BRAND_TO_KEY = new Map<string, ProductKey>(
  (Object.entries(PRODUCTS) as Array<[ProductKey, (typeof PRODUCTS)[ProductKey]]>).map(([k, v]) => [v.brand.toLowerCase(), k]),
);
const CARD_BLOCK_RE = /:::catalog-product\n([\s\S]*?)\n:::/g;

/** Products that already have a `:::catalog-product` card in the content, so a
 *  re-run doesn't card the next repeat CTA as if it were the first. */
function alreadyCardedProducts(content: string): Set<ProductKey> {
  const out = new Set<ProductKey>();
  for (const m of content.matchAll(CARD_BLOCK_RE)) {
    const brand = m[1].match(/^Brand:\s*(.+)$/im)?.[1]?.trim().toLowerCase();
    const key = brand ? BRAND_TO_KEY.get(brand) : undefined;
    if (key) out.add(key);
  }
  return out;
}

/** Map an H2 heading to the product it introduces, or null for generic headings
 *  (which inherit the current product context). */
function resolveHeadingProduct(title: string): ProductKey | null {
  const t = title.toLowerCase();
  if (/choose\s+momcozy/.test(t)) return 'momcozy';
  if (/choose\s+grownsy/.test(t)) return 'grownsy';
  if (/choose\s+(bc\s*babycare|.*clarvion)/.test(t)) return 'bc';
  if (/choose\s+eufy/.test(t)) return 'eufy';
  if (/choose\s+papablic/.test(t)) return 'papablic';
  if (/momcozy\s+kleanpal/.test(t)) return 'momcozy';
  if (/grownsy\s+easeclean/.test(t)) return 'grownsy';
  if (/bc\s*babycare|clarvion/.test(t)) return 'bc';
  if (/eufy\s+bottle\s+washer/.test(t)) return 'eufy';
  if (/papablic\s+bottle\s+washer/.test(t)) return 'papablic';
  if (/ge\s+profile/.test(t)) return 'ge';
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

/** Buy links carried by a CTA line (a cta-slot token or an affiliate-only link line). */
function ctaLineLinks(lraw: string, buttonById: Map<string, CtaButton>): Links | null {
  const lt = lraw.trim();
  if (lt === '') return null;

  const slotId = parseCtaSlotLine(lt);
  if (slotId) {
    const btn = buttonById.get(slotId);
    if (!btn) return {}; // a slot whose button vanished — still a CTA line to drop
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
  if (links.amazon) out.push(`Amazon: ${links.amazon}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) {
    out.push(`Shop: ${links.shop}`);
    out.push(`Retailer: Shop`);
  }
  if (imageUrl) out.push(`Image: ${imageUrl}`);
  out.push(':::');
  return out.join('\n');
}

export type TransformResult = { content: string; changed: number; notes: string[]; blocks: string[] };

/** Pure transform (no DB) so it can be unit-tested. */
export function transformBottleWasher(content: string): TransformResult {
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

    // Track product context from H2 headings.
    if (/^##\s/.test(trimmed) && !trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^##\s+/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const mapped = resolveHeadingProduct(title);
      if (mapped) current = mapped;
      continue;
    }

    // A CTA line (possibly a run of consecutive ones) → one card.
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
    idx = ctaIdxs[ctaIdxs.length - 1]; // skip past the run

    if (!current) {
      notes.push(`• CTA at line ${idx + 1} has no product context — left as-is.`);
      continue;
    }
    // Only the first (main-section) CTA per product becomes a card; the repeat
    // buttons in "Choose … If" / GE deep-dive sections are left untouched.
    if (carded.has(current)) {
      notes.push(`• ${PRODUCTS[current].brand} repeat CTA — left as a button.`);
      continue;
    }
    if (Object.keys(links).length === 0) {
      // A dead slot with no usable link — just drop it.
      ctaIdxs.forEach((i) => dropIndices.add(i));
      continue;
    }

    // Absorb a product image sitting directly above the CTA (image + caption).
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

  const { content: converted, changed, notes, blocks } = transformBottleWasher(post.content ?? '');

  blocks.forEach((b) => console.log(`\n${b}`));
  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`CTAs converted to cards: ${changed}`);
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
