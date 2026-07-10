/**
 * Convert every affiliate CTA on "taylors-registry-essentials" into a rich
 * `:::catalog-product` card.
 *
 * Unlike the released-2026 post (one `## ⭐ Brand Model` heading per product),
 * this guide lists each recommendation as a **bold product name** followed by an
 * affiliate CTA (a `::cta-slot <id>` token or an affiliate-only markdown link),
 * usually with a product image + italic caption sitting right above the name:
 *
 *     ![newton nest mini crib](https://…/img.jpg)
 *
 *     *newton nest mini crib*
 *
 *     **Newton Nest Mini Crib**
 *
 *     ::cta-slot abc123
 *
 *     A flexible sleep solution that works beautifully for room sharing…
 *
 * Each such unit becomes a product card built from the image + the buy link(s),
 * with Brand / Product taken from a curated map (falling back to a first-word
 * split). The card ABSORBS the image + caption + bold name + CTA lines; all
 * surrounding prose (including the description sentence) is left untouched, so
 * nothing readers see in the copy is lost.
 *
 * Generic + idempotent:
 *   • Links are read at runtime from the CTA store (nothing hard-coded).
 *   • A bold name already replaced by a card no longer exists → re-runs are safe.
 *   • A bold name with no following CTA (just emphasis) is left alone.
 *   • Nameless CTA groups (e.g. inline links under a heading) are left alone.
 *   • Orphaned CTA buttons (no longer referenced by any slot) are pruned.
 *
 *   npx tsx scripts/migrateRegistryEssentialsProductCards.ts            # dry run
 *   npx tsx scripts/migrateRegistryEssentialsProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateRegistryEssentialsProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';
import { resolveBlogProductCatalogLinks } from '@/lib/server/blogCatalogLinks';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';

type PriceInfo = { price: number | null; retailer: string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'taylors-registry-essentials';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*$/; // a whole-line italic caption
const BOLD_NAME_LINE = /^\*\*([^*]+)\*\*$/; // a whole-line bold product name
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

// Curated Brand / Product split for every recommendation in this guide. Keyed by
// the lowercased bold name. Anything not listed falls back to a first-word split.
const PRODUCT_MAP: Record<string, { brand: string; product: string }> = {
  'newton nest mini crib': { brand: 'Newton', product: 'Nest Mini Crib' },
  'dadada spirit 8-in-1 convertible crib': { brand: 'dadada', product: 'Spirit 8-in-1 Convertible Crib' },
  'newton compact travel crib & play yard': { brand: 'Newton', product: 'Compact Travel Crib & Play Yard' },
  'angelbliss pack and play with bassinet + changing station': {
    brand: 'Angelbliss',
    product: 'Pack and Play with Bassinet + Changing Station',
  },
  'silver cross sleep & go': { brand: 'Silver Cross', product: 'Sleep & Go' },
  'momcozy smart wifi baby monitor': { brand: 'Momcozy', product: 'Smart WiFi Baby Monitor' },
  'motorola nursery enhanced range audio monitor': { brand: 'Motorola', product: 'Nursery Enhanced Range Audio Monitor' },
  'babylist bottle box': { brand: 'Babylist', product: 'Bottle Box' },
  'babylist glass bottle box': { brand: 'Babylist', product: 'Glass Bottle Box' },
  'tiny trials bottle box': { brand: 'Tiny Trials', product: 'Bottle Box' },
  'tiny trails glass bottle box': { brand: 'Tiny Trails', product: 'Glass Bottle Box' },
  'babylist pacifier box': { brand: 'Babylist', product: 'Pacifier Box' },
  'tiny trails pacifier box': { brand: 'Tiny Trails', product: 'Pacifier Box' },
  'haakaa silicone breast pump': { brand: 'Haakaa', product: 'Silicone Breast Pump' },
  'munchkin silicone manual pump': { brand: 'Munchkin', product: 'Silicone Manual Pump' },
  'oxo tot dishwasher basket': { brand: 'OXO Tot', product: 'Dishwasher Basket' },
  'munchkin dishwasher basket': { brand: 'Munchkin', product: 'Dishwasher Basket' },
  'haakaa multipurpose microwave steam sterilizer': { brand: 'Haakaa', product: 'Multipurpose Microwave Steam Sterilizer' },
  'haakaa on-the-go silicone microwave steam sterilizer': {
    brand: 'Haakaa',
    product: 'On-The-Go Silicone Microwave Steam Sterilizer',
  },
  'medela quick clean microwave sterilizer bags': { brand: 'Medela', product: 'Quick Clean Microwave Sterilizer Bags' },
  'stokke flexi bath + stand bundle': { brand: 'Stokke', product: 'Flexi Bath + Stand Bundle' },
  'jveoo bath kneeler & elbow rest': { brand: 'JVEOO', product: 'Bath Kneeler & Elbow Rest' },
  'babybjörn harmony': { brand: 'BabyBjörn', product: 'Harmony' },
  'ergobaby omni deluxe': { brand: 'Ergobaby', product: 'Omni Deluxe' },
  'cybex callisto': { brand: 'Cybex', product: 'Callisto' },
  'nuna revv maxx': { brand: 'Nuna', product: 'REVV Maxx' },
  'britax galaxy360': { brand: 'Britax', product: 'Galaxy360' },
  'changing pad for dresser': { brand: 'Changing Essentials', product: 'Changing Pad for Dresser' },
  'woddle multifunctional smart baby changing pad': {
    brand: 'Woddle',
    product: 'Multifunctional Smart Baby Changing Pad',
  },
  'skip hop diaper caddy': { brand: 'Skip Hop', product: 'Diaper Caddy' },
  'momcozy diaper pail': { brand: 'Momcozy', product: 'Diaper Pail' },
  'jool baby smartwave': { brand: 'Jool Baby', product: 'SmartWave' },
  'grownsy baby diaper pail': { brand: 'Grownsy', product: 'Baby Diaper Pail' },
  'momcozy dinerpal': { brand: 'Momcozy', product: 'DinerPal' },
  'bugaboo giraffe': { brand: 'Bugaboo', product: 'Giraffe' },
  'cybex lemo': { brand: 'Cybex', product: 'LEMO' },
  'tot squad motherfund gift card': { brand: 'Tot Squad', product: 'MotherFund Gift Card' },
};

const MULTI_WORD_BRANDS = ['Silver Cross', 'Jool Baby', 'Tiny Trials', 'Tiny Trails', 'OXO Tot', 'Skip Hop', 'Tot Squad'];

// Cards whose product has no image sitting above the bold name (or needs a
// specific one) get a curated image here. Keyed by lowercased bold name.
const IMAGE_OVERRIDE: Record<string, string> = {
  'tot squad motherfund gift card':
    'https://cdn.prod.website-files.com/5f4a9ffd91010361e130f380/69194c06b3633b14d8786d81_Motherfund-GC-50.jpg',
};

const SHOP_DOMAIN_RETAILER: Array<[RegExp, string]> = [
  [/silvercross/i, 'Silver Cross'],
  [/target\.com/i, 'Target'],
  [/newtonbaby/i, 'Newton'],
  [/dadadababy/i, 'dadada'],
  [/joolbaby/i, 'Jool Baby'],
  [/grownsy/i, 'Grownsy'],
  [/momcozy|jdoqocy/i, 'Momcozy'],
  [/munchkin/i, 'Munchkin'],
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
  // Any other affiliate/brand domain is a brand-direct "Shop" link.
  return 'shop';
}

// Labels arrive either clean ("Shop dadada") or with a partner prefix baked in
// ("dadada Baby Shop dadada"). Take the text after the LAST action keyword so the
// retailer name is clean in both cases.
const LABEL_ACTION = /(?:shop|explore|buy(?:\s+on)?|add to|view(?:\s+on)?|get)\s+/gi;
function retailerFromLabel(label: string | undefined) {
  if (!label) return null;
  let cut = 0;
  let m: RegExpExecArray | null;
  LABEL_ACTION.lastIndex = 0;
  while ((m = LABEL_ACTION.exec(label)) !== null) cut = m.index + m[0].length;
  const cleaned = label.slice(cut).trim();
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
  if (!kind) return; // image url slipped in
  if (kind === 'shop') {
    if (!group.links.shop) {
      group.links.shop = url;
      group.shopRetailer = retailerFromLabel(label) ?? retailerFromDomain(url);
    }
    return;
  }
  if (!group.links[kind]) group.links[kind] = url;
}

function boldName(line: string) {
  return line.trim().match(BOLD_NAME_LINE)?.[1]?.trim() ?? null;
}

function splitBrandProduct(name: string): { brand: string; product: string } {
  const mapped = PRODUCT_MAP[name.toLowerCase()];
  if (mapped) return mapped;
  for (const brand of MULTI_WORD_BRANDS) {
    if (name.toLowerCase().startsWith(brand.toLowerCase())) {
      return { brand, product: name.slice(brand.length).trim() || name };
    }
  }
  const parts = name.split(/\s+/);
  return { brand: parts[0] ?? name, product: parts.slice(1).join(' ') || name };
}

function buildBlock(brand: string, product: string, group: Group, imageUrl: string | null, price?: PriceInfo | null): string {
  const out = [':::catalog-product', `Brand: ${brand}`, `Product: ${product}`];
  if (group.links.babylist) out.push(`Babylist: ${group.links.babylist}`);
  if (group.links.amazon) out.push(`Amazon: ${group.links.amazon}`);
  if (group.links.macrobaby) out.push(`MacroBaby: ${group.links.macrobaby}`);
  if (group.links.shop) {
    out.push(`Shop: ${group.links.shop}`);
    out.push(`Retailer: ${group.shopRetailer ?? 'Shop'}`);
  }
  if (imageUrl) out.push(`Image: ${imageUrl}`);
  if (price?.price != null) out.push(`Price: $${price.price}${price.retailer ? ` via ${price.retailer}` : ''}`);
  out.push(':::');
  return out.join('\n');
}

/** Is this a CTA line? Returns the urls (+first label) it carries, or null. */
function ctaLineLinks(
  lraw: string,
  buttonById: Map<string, CtaButton>,
): { urls: Array<{ url: string; label?: string }> } | null {
  const lt = lraw.trim();
  if (lt === '') return null;

  const slotId = parseCtaSlotLine(lt);
  if (slotId) {
    const btn = buttonById.get(slotId);
    return { urls: btn ? [{ url: btn.url, label: btn.label }] : [] };
  }

  // Affiliate-only markdown link line (no surrounding prose).
  MD_LINK.lastIndex = 0;
  const urls: Array<{ url: string; label?: string }> = [];
  let m: RegExpExecArray | null;
  let hasNonAffiliate = false;
  let sawAnyLink = false;
  while ((m = MD_LINK.exec(lraw)) !== null) {
    if (m[1] === '!') continue; // image embed
    sawAnyLink = true;
    if (classifyUrl(m[3])) urls.push({ url: m[3], label: m[2] });
    else hasNonAffiliate = true;
  }
  const strippedBare = lraw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '').length === 0;
  if (sawAnyLink && urls.length > 0 && !hasNonAffiliate && strippedBare) return { urls };
  return null;
}

export type TransformResult = {
  content: string;
  changed: number;
  notes: string[];
  blocks: string[];
  refs: Array<{ brand: string; productName: string }>;
};

/** Pure transform (no DB) so it can be unit-tested. */
export function transformRegistryEssentials(
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
    const name = boldName(lines[idx] ?? '');
    if (!name) continue;

    // Collect the CTA lines that immediately follow the bold name (blank lines
    // are allowed between). Stop at the first non-blank, non-CTA line. Bail if a
    // card already sits here (idempotency).
    const group: Group = { indices: [], links: {}, shopRetailer: null };
    let j = idx + 1;
    let alreadyCarded = false;
    for (; j < lines.length; j += 1) {
      const lt = (lines[j] ?? '').trim();
      if (lt === '') continue;
      if (lt.startsWith(':::')) { alreadyCarded = true; break; }
      const cta = ctaLineLinks(lines[j] ?? '', buttonById);
      if (!cta) break; // prose / heading / image ends the CTA run
      group.indices.push(j);
      for (const { url, label } of cta.urls) addLink(group, url, label);
    }

    if (alreadyCarded) continue;
    if (group.indices.length === 0 || Object.keys(group.links).length === 0) {
      // A bold phrase not followed by a buy link — leave it as normal emphasis.
      continue;
    }

    // Nearest preceding image (skipping blanks + the italic caption line).
    let imageUrl: string | null = null;
    let imageIdx = -1;
    const captionIdxs: number[] = [];
    for (let i = idx - 1; i >= 0; i -= 1) {
      const lt = (lines[i] ?? '').trim();
      if (lt === '') continue;
      if (CAPTION_LINE.test(lt)) { captionIdxs.push(i); continue; }
      const m = lt.match(IMAGE_LINE);
      if (m) { imageUrl = m[1]; imageIdx = i; }
      break; // first non-blank/non-caption line decides
    }

    const { brand, product } = splitBrandProduct(name);
    const override = IMAGE_OVERRIDE[name.toLowerCase()];
    if (override) imageUrl = override;
    const price = priceByKey[blogProductKey(brand, product)] ?? null;
    const block = buildBlock(brand, product, group, imageUrl, price);

    const anchor = imageIdx >= 0 ? imageIdx : idx;
    insertBlockAt.set(anchor, block);
    if (imageIdx >= 0) dropIndices.add(imageIdx);
    captionIdxs.forEach((i) => dropIndices.add(i));
    dropIndices.add(idx); // the bold name line
    group.indices.forEach((i) => dropIndices.add(i));

    refs.push({ brand, productName: product });
    changed += 1;
    blocks.push(`──────── ${brand} ${product} ────────\n${block}`);
  }

  // Rebuild the body, swapping each unit for its card.
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

const CARD_BLOCK_RE = /:::catalog-product\n([\s\S]*?)\n:::/g;

/** Brand/Product of every existing `:::catalog-product` block in the content. */
export function extractCardRefs(content: string): Array<{ brand: string; productName: string }> {
  const out: Array<{ brand: string; productName: string }> = [];
  for (const m of content.matchAll(CARD_BLOCK_RE)) {
    const body = m[1];
    const brand = body.match(/^Brand:\s*(.+)$/im)?.[1]?.trim();
    const product = body.match(/^Product:\s*(.+)$/im)?.[1]?.trim();
    if (brand && product) out.push({ brand, productName: product });
  }
  return out;
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  // Pass 1: discover which products get a card, then look up any live catalog
  // price (Babylist / MacroBaby) for the ones that match the catalogue.
  const first = transformRegistryEssentials(post.content ?? '');
  const allRefs = [...first.refs, ...extractCardRefs(post.content ?? '')];
  const priceByKey: Record<string, PriceInfo> = {};
  try {
    const matches = await resolveBlogProductCatalogLinks(allRefs);
    for (const ref of allRefs) {
      const m = matches[blogProductKey(ref.brand, ref.productName)];
      if (m?.price != null) priceByKey[blogProductKey(ref.brand, ref.productName)] = { price: m.price, retailer: m.retailer };
    }
  } catch {
    /* no catalog price available — cards fall back to live render-time enrichment */
  }

  // Pass 2: convert, baking any catalog price.
  const { content: converted, changed, notes, blocks } = transformRegistryEssentials(post.content ?? '', priceByKey);

  console.log(`Prices available from catalog: ${Object.keys(priceByKey).length}/${allRefs.length} card(s)`);
  blocks.forEach((b) => console.log(`\n${b}`));
  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Product units converted to cards: ${changed}`);
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
