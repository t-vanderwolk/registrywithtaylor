/**
 * Replace the DUPLICATE (second) affiliate CTA group in each product section of
 * "baby-gear-released-2026-so-far" with a `:::catalog-product` card.
 *
 * Every `## ⭐ <Brand Model>` section on this post repeats its affiliate CTA
 * buttons twice: once right under the hero image, and again a second time at the
 * bottom of the section (after the prose + "read my review" link). This script
 * keeps the FIRST (top) button group as quick links and converts the SECOND
 * (bottom) group into a rich product card built from the same buy links + the
 * section's image, with Brand / Product parsed from the heading. The end-of-post
 * "Gear Picks / Brand Partners" recap then renders every card again automatically.
 *
 * Generic + idempotent:
 *   • Reads all links at runtime from the CTA store (nothing hard-coded).
 *   • A section that already ends in a `:::catalog-product` block is skipped.
 *   • A section with only ONE CTA group (no duplicate) is left untouched.
 *   • News-headline sections (e.g. "… Officially Launches …") are skipped.
 *   • Orphaned CTA buttons (no longer referenced by any slot) are pruned.
 *
 *   npx tsx scripts/migrateReleased2026ProductCards.ts            # dry run
 *   npx tsx scripts/migrateReleased2026ProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateReleased2026ProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';
import { resolveBlogProductCatalogLinks } from '@/lib/server/blogCatalogLinks';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';

type PriceInfo = { price: number | null; retailer: string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'baby-gear-released-2026-so-far';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

// Product headings carry a ⭐; category headings use other emoji. Skip industry
// "news" headlines that happen to sit under a ⭐ but aren't a single product.
const NEWS_HEADING = /officially|launches|enters the|\bu\.?s\.?\s+market\b|now available|arrives in/i;

// Brands whose name is more than one word — so "Silver Cross Cove 2" splits into
// brand "Silver Cross" + product "Cove 2", not brand "Silver".
const MULTI_WORD_BRANDS = ['Silver Cross', 'Orbit Baby', 'Peg Perego', 'Jool Baby', 'Mercedes Baby', 'Baby Jogger'];

const SHOP_DOMAIN_RETAILER: Array<[RegExp, string]> = [
  [/silvercross/i, 'Silver Cross'],
  [/bombigear/i, 'Bombi'],
  [/grownsy/i, 'Grownsy'],
  [/joolbaby/i, 'Jool Baby'],
  [/papablic/i, 'Papablic'],
  [/momcozy/i, 'Momcozy'],
  [/eufy|anker/i, 'eufy'],
  [/doona/i, 'Doona'],
  [/mima/i, 'Mima'],
];

type LinkKind = 'babylist' | 'amazon' | 'macrobaby' | 'shop';

function isImageUrl(url: string) {
  return IMAGE_HOST_OR_EXT.test(url);
}

function classifyUrl(url: string): LinkKind | null {
  if (isImageUrl(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  return null;
}

function retailerFromLabel(label: string | undefined) {
  if (!label) return null;
  const cleaned = label
    .replace(/^(shop|explore|buy(?:\s+on)?|add to|view(?:\s+on)?|get)\s+/i, '')
    .trim();
  return cleaned || null;
}

function retailerFromDomain(url: string) {
  for (const [re, name] of SHOP_DOMAIN_RETAILER) if (re.test(url)) return name;
  return null;
}

type Group = {
  indices: number[];
  links: Partial<Record<LinkKind, string>>;
  shopRetailer: string | null;
};

function addLink(group: Group, url: string, label?: string) {
  const kind = classifyUrl(url);
  if (kind) {
    if (!group.links[kind]) group.links[kind] = url;
    return;
  }
  // Unknown domain on an explicit CTA button → a brand-direct "Shop" link.
  if (!group.links.shop) {
    group.links.shop = url;
    group.shopRetailer = retailerFromLabel(label) ?? retailerFromDomain(url);
  }
}

/** Strip "## " and a single leading emoji/decoration from a heading line. */
function headingTitle(line: string) {
  return line
    .replace(/^##\s+/, '')
    .replace(/^[^\p{L}\p{N}]+/u, '') // drop leading emoji + spaces
    .trim();
}

function splitBrandProduct(title: string): { brand: string; product: string } {
  for (const brand of MULTI_WORD_BRANDS) {
    if (title.toLowerCase().startsWith(brand.toLowerCase())) {
      return { brand, product: title.slice(brand.length).trim() || title };
    }
  }
  const parts = title.split(/\s+/);
  return { brand: parts[0] ?? title, product: parts.slice(1).join(' ') || title };
}

const isSilverCrossBrand = (brand: string) => /silver\s*cross/i.test(brand);

function buildBlock(
  brand: string,
  product: string,
  group: Group,
  imageUrl: string | null,
  price?: PriceInfo | null,
): string {
  const out = [':::catalog-product', `Brand: ${brand}`, `Product: ${product}`];
  if (group.links.babylist) out.push(`Babylist: ${group.links.babylist}`);
  if (group.links.amazon) out.push(`Amazon: ${group.links.amazon}`);
  if (group.links.macrobaby) out.push(`MacroBaby: ${group.links.macrobaby}`);
  if (group.links.shop) {
    out.push(`Shop: ${group.links.shop}`);
    out.push(`Retailer: ${group.shopRetailer ?? (isSilverCrossBrand(brand) ? 'Silver Cross' : 'Shop')}`);
  }
  // Silver Cross leads with its own store; Babylist (if present) drops to secondary.
  if (isSilverCrossBrand(brand) && group.links.shop) out.push('Primary: shop');
  if (imageUrl) out.push(`Image: ${imageUrl}`);
  if (price?.price != null) {
    out.push(`Price: $${price.price}${price.retailer ? ` via ${price.retailer}` : ''}`);
  }
  out.push(':::');
  return out.join('\n');
}

function sectionEnd(lines: string[], headingIndex: number) {
  let end = headingIndex + 1;
  while (end < lines.length) {
    const t = lines[end]?.trim() ?? '';
    if (t.startsWith('## ') && !t.startsWith('### ')) break;
    end += 1;
  }
  return end;
}

export type TransformResult = {
  content: string;
  changed: number;
  notes: string[];
  blocks: string[];
  refs: Array<{ brand: string; productName: string }>;
};

/**
 * Pure transform (no DB) so it can be unit-tested. Pass `priceByKey` (keyed by
 * blogProductKey) on a second pass to bake catalog prices into each card.
 */
export function transformReleased2026(
  content: string,
  priceByKey: Record<string, PriceInfo> = {},
): TransformResult {
  const stored = extractStoredCtaButtons(content ?? '');
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');

  const dropIndices = new Set<number>();
  const insertBlockAt = new Map<number, string>();
  const notes: string[] = [];
  const blocks: string[] = [];
  const refs: Array<{ brand: string; productName: string }> = [];
  let changed = 0;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const raw = lines[idx];
    const trimmed = raw.trim();
    if (!/^##\s/.test(trimmed) || trimmed.startsWith('### ')) continue;
    if (!trimmed.includes('⭐')) continue; // product sections only

    const title = headingTitle(raw);
    const end = sectionEnd(lines, idx);
    const sectionText = lines.slice(idx, end).join('\n');

    if (sectionText.includes(':::catalog-product')) {
      notes.push(`• ${title}: already has a card — skipped.`);
      continue;
    }
    if (NEWS_HEADING.test(title)) {
      notes.push(`• ${title}: news headline (not a single product) — skipped.`);
      continue;
    }

    // First image in the section = card image.
    let imageUrl: string | null = null;
    for (let i = idx + 1; i < end; i += 1) {
      const m = (lines[i] ?? '').trim().match(IMAGE_LINE);
      if (m) { imageUrl = m[1]; break; }
    }

    // Walk the section collecting CTA groups. A CTA line is a cta-slot token or a
    // line whose only content is affiliate markdown link(s). Blank lines don't
    // break a group; any other prose line does.
    const groups: Group[] = [];
    let current: Group | null = null;
    for (let i = idx + 1; i < end; i += 1) {
      const lraw = lines[i] ?? '';
      const lt = lraw.trim();
      if (lt === '') continue;

      const slotId = parseCtaSlotLine(lt);
      if (slotId) {
        if (!current) { current = { indices: [], links: {}, shopRetailer: null }; groups.push(current); }
        current.indices.push(i);
        const btn = buttonById.get(slotId);
        if (btn) addLink(current, btn.url, btn.label);
        continue;
      }

      // Inline affiliate-only line?
      MD_LINK.lastIndex = 0;
      const urls: string[] = [];
      let m: RegExpExecArray | null;
      let hasNonAffiliate = false;
      let sawAnyLink = false;
      while ((m = MD_LINK.exec(lraw)) !== null) {
        if (m[1] === '!') continue; // image embed
        sawAnyLink = true;
        if (classifyUrl(m[3])) urls.push(m[3]);
        else hasNonAffiliate = true;
      }
      const strippedBare = lraw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '').length === 0;
      if (sawAnyLink && urls.length > 0 && !hasNonAffiliate && strippedBare) {
        if (!current) { current = { indices: [], links: {}, shopRetailer: null }; groups.push(current); }
        current.indices.push(i);
        for (const u of urls) addLink(current, u);
        continue;
      }

      current = null; // prose line breaks the run
    }

    // Normally we only replace a DUPLICATE (2nd) CTA group. Silver Cross sections
    // are carded even with a single group so all Silver Cross products get a card
    // with Silver Cross primary / Babylist secondary.
    const silverCross = isSilverCrossBrand(title);
    if (groups.length < 2 && !(silverCross && groups.length >= 1)) {
      notes.push(`• ${title}: ${groups.length} CTA group(s) — no duplicate to replace, skipped.`);
      continue;
    }

    const last = groups[groups.length - 1];
    if (Object.keys(last.links).length === 0) {
      notes.push(`• ${title}: trailing group had no usable links — skipped.`);
      continue;
    }

    const { brand, product } = splitBrandProduct(title);
    const price = priceByKey[blogProductKey(brand, product)] ?? null;
    const block = buildBlock(brand, product, last, imageUrl, price);
    insertBlockAt.set(last.indices[0], block);
    last.indices.forEach((i) => dropIndices.add(i));
    refs.push({ brand, productName: product });
    changed += 1;
    blocks.push(`──────── ${brand} ${product} ────────\n${block}`);
  }

  // Rebuild the body: swap each trailing group for its card.
  const rebuilt: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (insertBlockAt.has(i)) rebuilt.push('', insertBlockAt.get(i)!, '');
    if (dropIndices.has(i)) continue;
    rebuilt.push(lines[i]);
  }

  // Keep only CTA buttons still referenced by a surviving slot.
  const referenced = new Set<string>();
  for (const raw of rebuilt) {
    const id = parseCtaSlotLine(raw.trim());
    if (id) referenced.add(id);
  }
  const remainingButtons = stored.buttons.filter((b) => referenced.has(b.id));
  const content2 = serializeCtaButtons(rebuilt.join('\n'), remainingButtons).replace(/\n{3,}/g, '\n\n');

  notes.unshift(`CTA buttons kept: ${remainingButtons.length}/${stored.buttons.length}`);
  return { content: content2, changed, notes, blocks, refs };
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  // Pass 1: discover which products get a card, then look up their live catalog
  // price (real data — Babylist / MacroBaby). Pass 2: bake the price into cards.
  const first = transformReleased2026(post.content ?? '');
  const priceByKey: Record<string, PriceInfo> = {};
  try {
    const matches = await resolveBlogProductCatalogLinks(first.refs);
    for (const ref of first.refs) {
      const m = matches[blogProductKey(ref.brand, ref.productName)];
      if (m?.price != null) priceByKey[blogProductKey(ref.brand, ref.productName)] = { price: m.price, retailer: m.retailer };
    }
  } catch {
    /* no catalog price available — cards fall back to live render-time enrichment */
  }

  const { content: updated, changed, notes, blocks } = transformReleased2026(post.content ?? '', priceByKey);

  console.log(`Prices baked from catalog: ${Object.keys(priceByKey).length}/${first.refs.length} card(s)`);
  blocks.forEach((b) => console.log(`\n${b}`));
  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Sections converted: ${changed}`);
  if (notes.length) console.log('\nNotes:\n' + notes.join('\n'));

  if (!changed) {
    console.log('\nNothing to change.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Replaced ${changed} trailing CTA group(s) with product cards on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
