/**
 * Convert the affiliate CTAs on "best-highchairs-2026-real-life-guide" into
 * `:::catalog-product` cards. Each highchair is a `### Brand Model` subsection
 * (under a `## Category` heading) with an image + one or two CTAs — Amazon, or a
 * brand-direct shop link (Albee Baby, Angelbliss, Delta Children, Momcozy).
 *
 * Highchairs aren't catalogue strollers, so each card carries a curated product
 * image + the post's own buy links (with the correct retailer name per link).
 *
 * Heading-driven: every CTA is mapped to its highchair by the nearest product
 * heading; a card is dropped where the CTA sits.
 *
 *   npx tsx scripts/migrateHighchairProductCards.ts            # dry run
 *   npx tsx scripts/migrateHighchairProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateHighchairProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'best-highchairs-2026-real-life-guide';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|albeebaby\.com\/cdn|momcozy\.com\/cdn|angelbliss\.us\/cdn|evenflo\.com\/cdn|stokke\.com\/dw|scene7\.com|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

type ProductKey = 'giraffe' | 'limo' | 'bryn' | 'tripptrapp' | 'nomi' | 'steps' | 'dinerpal' | 'angelbliss' | 'versa' | 'evenflo';

const PRODUCTS: Record<ProductKey, { brand: string; product: string; image: string }> = {
  giraffe: { brand: 'Bugaboo', product: 'Giraffe', image: 'https://www.albeebaby.com/cdn/shop/files/1xOcsuusXKgROwF0e770OJ42ra3GPb0N-24.jpg?v=1763508477&width=1646' },
  limo: { brand: 'Cybex', product: 'Limo 2', image: 'https://www.albeebaby.com/cdn/shop/files/cybex-lemo-2-high-chair-3-in-1-set-sand-white-219.jpg?v=1763838606&width=1946' },
  bryn: { brand: 'Nuna', product: 'Bryn', image: 'https://www.albeebaby.com/cdn/shop/files/nuna-bryn-high-chair-heritage-1.jpg?v=1763511050&width=1946' },
  tripptrapp: { brand: 'Stokke', product: 'Tripp Trapp', image: 'https://www.albeebaby.com/cdn/shop/files/9jdqbXsCItcGO3LvciYzpWFkqvpcLjie-24.jpg?v=1763765181&width=1946' },
  nomi: { brand: 'Stokke', product: 'Nomi', image: 'https://www.albeebaby.com/cdn/shop/files/stokke-nomi-high-chair-oak-grey-61.jpg?v=1763519182&width=1646' },
  steps: { brand: 'Stokke', product: 'Steps', image: 'https://www.stokke.com/dw/image/v2/AAQF_PRD/on/demandware.static/-/Sites-stokke-master-catalog/default/dw6a686603/images/inriverimages/mainview/StepsHighChair_WarmBrown_Seat-BS_Tray-Black_Pos1_eCom.jpg' },
  dinerpal: { brand: 'Momcozy', product: 'DinerPal High Chair', image: 'https://momcozy.com/cdn/shop/files/dinerpal-high-chair-natural-wood.jpg?v=1772188328&width=720' },
  angelbliss: { brand: 'Angelbliss', product: 'Adjustable 8-in-1 High Chair', image: 'https://angelbliss.us/cdn/shop/files/Adjustable_High_8_in_1_Baby_High_chair_BCH01_Grey.jpg?v=1745223946&width=1300' },
  versa: { brand: 'Delta Children', product: 'Versa 3-in-1 High Chair', image: 'https://target.scene7.com/is/image/Target/GUEST_676e78ee-dfed-40ab-87c5-f1e4e72e8e13' },
  evenflo: { brand: 'Evenflo', product: 'Bria RightSeat', image: 'https://www.evenflo.com/cdn/shop/files/c227e2c2726c3f00a497a01aeed98bfa7cfb1bc9.jpg?v=1768928685&width=1920' },
};

function resolveHeadingProduct(title: string): ProductKey | null {
  const t = title.toLowerCase();
  if (/bugaboo giraffe/.test(t)) return 'giraffe';
  if (/cybex (limo|lemo)/.test(t)) return 'limo';
  if (/nuna bryn/.test(t)) return 'bryn';
  if (/tripp trapp/.test(t)) return 'tripptrapp';
  if (/stokke nomi/.test(t)) return 'nomi';
  if (/stokke steps/.test(t)) return 'steps';
  if (/momcozy dinerpal/.test(t)) return 'dinerpal';
  if (/angelbliss/.test(t)) return 'angelbliss';
  if (/delta children versa|versa 3-in-1/.test(t)) return 'versa';
  if (/evenflo|bria|rightseat/.test(t)) return 'evenflo';
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

const SHOP_DOMAIN: Array<[RegExp, string]> = [
  [/albeebaby/i, 'Albee Baby'],
  [/deltachildren/i, 'Delta Children'],
  [/angelbliss/i, 'Angelbliss'],
  [/momcozy/i, 'Momcozy'],
];
const LABEL_ACTION = /(?:shop|explore|buy(?:\s+on)?|add to|view(?:\s+on)?|get)\s+/gi;
function retailerForShop(url: string, label?: string): string {
  for (const [re, name] of SHOP_DOMAIN) if (re.test(url)) return name; // matches encoded url= param too
  if (label) {
    let cut = 0;
    let m: RegExpExecArray | null;
    LABEL_ACTION.lastIndex = 0;
    while ((m = LABEL_ACTION.exec(label)) !== null) cut = m.index + m[0].length;
    const cleaned = label.slice(cut).trim();
    if (cleaned) return cleaned;
  }
  return 'Shop';
}

type Links = Partial<Record<LinkKind, string>>;
type CtaFound = { links: Links; shopRetailer: string | null };

function ctaLineLinks(lraw: string, buttonById: Map<string, CtaButton>): CtaFound | null {
  const lt = lraw.trim();
  if (lt === '') return null;
  const slotId = parseCtaSlotLine(lt);
  if (slotId) {
    const btn = buttonById.get(slotId);
    if (!btn) return { links: {}, shopRetailer: null };
    const kind = classifyUrl(btn.url);
    if (!kind) return { links: {}, shopRetailer: null };
    return { links: { [kind]: btn.url }, shopRetailer: kind === 'shop' ? retailerForShop(btn.url, btn.label) : null };
  }
  MD_LINK.lastIndex = 0;
  const links: Links = {};
  let shopRetailer: string | null = null;
  let m: RegExpExecArray | null;
  let hasNonAffiliate = false;
  let sawAnyLink = false;
  while ((m = MD_LINK.exec(lraw)) !== null) {
    if (m[1] === '!') continue;
    sawAnyLink = true;
    const kind = classifyUrl(m[3]);
    if (kind) {
      if (!links[kind]) links[kind] = m[3];
      if (kind === 'shop' && !shopRetailer) shopRetailer = retailerForShop(m[3], m[2]);
    } else hasNonAffiliate = true;
  }
  const strippedBare = lraw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '').length === 0;
  if (sawAnyLink && Object.keys(links).length > 0 && !hasNonAffiliate && strippedBare) return { links, shopRetailer };
  return null;
}

function buildBlock(brand: string, product: string, links: Links, shopRetailer: string | null, imageUrl: string | null): string {
  const out = [':::catalog-product', `Brand: ${brand}`, `Product: ${product}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) {
    out.push(`Shop: ${links.shop}`);
    out.push(`Retailer: ${shopRetailer ?? 'Shop'}`);
    if (!links.amazon) out.push('Primary: shop');
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

export function transformHighchairs(content: string): TransformResult {
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

    if (/^#{2,}\s/.test(trimmed)) {
      const title = trimmed.replace(/^#{2,}\s+/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const mapped = resolveHeadingProduct(title);
      if (mapped) current = mapped;
      continue;
    }

    const first = ctaLineLinks(lines[idx] ?? '', buttonById);
    if (!first) continue;

    const links: Links = { ...first.links };
    let shopRetailer = first.shopRetailer;
    const ctaIdxs = [idx];
    let j = idx + 1;
    for (; j < lines.length; j += 1) {
      const lt = (lines[j] ?? '').trim();
      if (lt === '') continue;
      const more = ctaLineLinks(lines[j] ?? '', buttonById);
      if (!more) break;
      for (const [k, v] of Object.entries(more.links) as Array<[LinkKind, string]>) if (!links[k]) links[k] = v;
      if (!shopRetailer && more.shopRetailer) shopRetailer = more.shopRetailer;
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
    const block = buildBlock(brand, product, links, shopRetailer, imageUrl);

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

  const { content: converted, changed, notes, blocks } = transformHighchairs(post.content ?? '');

  blocks.forEach((b) => console.log(`\n${b}`));
  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Highchairs carded: ${changed}`);
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
