/**
 * "bugaboo-donkey-6-stroller-release" is a single-product review that repeats the
 * SAME Amazon CTA six times down the page. This consolidates them into one
 * `:::catalog-product` card for the Bugaboo Donkey 6, placed after the intro
 * (before "## Explore the Upgrades"), and removes the redundant scattered
 * buttons.
 *
 * The card keeps the Amazon link from the CTAs and bakes the catalogue
 * image/price at runtime; Babylist/MacroBaby buttons and a "Check compatible car
 * seats" link are added at render time from the catalogue. A card with no
 * retailer renders nothing, but the Amazon link alone guarantees a button.
 *
 * Idempotent: skips if a Donkey 6 card already exists. Dry-run by default.
 *
 *   npx tsx scripts/migrateDonkey6ProductCard.ts            # dry run
 *   npx tsx scripts/migrateDonkey6ProductCard.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateDonkey6ProductCard.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';
import { resolveBlogProductCatalogLinks } from '@/lib/server/blogCatalogLinks';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'bugaboo-donkey-6-stroller-release';
const APPLY = process.argv.includes('--apply');

const BRAND = 'Bugaboo';
const PRODUCT = 'Donkey 6';
const ANCHOR = /^##\s+Explore the Upgrades\s*$/m;
const FALLBACK_IMAGE = 'https://www.macrobaby.com/cdn/shop/files/bugaboo-donkey-6-complete-stroller-black-moon-grey_image_4.jpg?v=1772564351';

const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|ctfassets|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

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
/** Links carried by a CTA line (cta-slot token or affiliate-only markdown link). */
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

type Baked = { image?: string | null; price?: number | null; retailer?: string | null };

function buildBlock(links: Links, baked: Baked): string {
  const out = [':::catalog-product', `Brand: ${BRAND}`, `Product: ${PRODUCT}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.amazon) out.push(`Amazon: ${links.amazon}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  out.push(`Image: ${baked.image || FALLBACK_IMAGE}`);
  if (baked.price != null) out.push(`Price: $${baked.price}${baked.retailer ? ` via ${baked.retailer}` : ''}`);
  out.push(':::');
  return out.join('\n');
}

export type TransformResult = { content: string; changed: boolean; removed: number; links: Links; note: string };

/** Pure transform: strip the repeated CTAs and drop one card before the anchor. */
export function transformDonkey6(content: string, baked: Baked): TransformResult {
  if (/:::catalog-product[\s\S]*?Product:\s*Donkey 6/i.test(content)) {
    return { content, changed: false, removed: 0, links: {}, note: 'card already present' };
  }
  const stored = extractStoredCtaButtons(content ?? '');
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');

  const dropIndices = new Set<number>();
  const links: Links = {};
  for (let i = 0; i < lines.length; i += 1) {
    const found = ctaLineLinks(lines[i] ?? '', buttonById);
    if (!found) continue;
    dropIndices.add(i);
    for (const [k, v] of Object.entries(found) as Array<[LinkKind, string]>) if (!links[k]) links[k] = v;
  }

  if (Object.keys(links).length === 0) {
    return { content, changed: false, removed: 0, links, note: 'no affiliate CTAs found' };
  }

  const kept = lines.filter((_, i) => !dropIndices.has(i));
  let body = kept.join('\n');

  const m = body.match(ANCHOR);
  if (!m || m.index == null) {
    return { content, changed: false, removed: dropIndices.size, links, note: 'anchor "Explore the Upgrades" not found' };
  }
  const block = buildBlock(links, baked);
  const before = body.slice(0, m.index).replace(/\s+$/, '');
  const after = body.slice(m.index);
  body = `${before}\n\n${block}\n\n${after}`;

  // Prune orphaned CTA buttons (none referenced anymore) + reserialize.
  const referenced = new Set<string>();
  for (const raw of body.split('\n')) {
    const id = parseCtaSlotLine(raw.trim());
    if (id) referenced.add(id);
  }
  const remainingButtons = stored.buttons.filter((b) => referenced.has(b.id));
  const content2 = serializeCtaButtons(body, remainingButtons).replace(/\n{3,}/g, '\n\n');

  return { content: content2, changed: true, removed: dropIndices.size, links, note: 'ok' };
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }
  const content: string = post.content ?? '';

  const baked: Baked = {};
  try {
    const matches = await resolveBlogProductCatalogLinks([{ brand: BRAND, productName: PRODUCT }]);
    const match = matches[blogProductKey(BRAND, PRODUCT)];
    if (match) {
      baked.image = match.imageUrl;
      baked.price = match.price;
      baked.retailer = match.retailer;
    }
  } catch {
    /* catalogue unreachable — Amazon link still guarantees a button */
  }

  const result = transformDonkey6(content, baked);

  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`CTAs removed: ${result.removed} | links kept on card: ${Object.keys(result.links).join(', ') || 'none'}`);
  console.log(`Note: ${result.note}`);

  if (!result.changed) {
    console.log('\nNothing to change.');
    return;
  }

  const inserted = result.content.match(/:::catalog-product\n[\s\S]*?\n:::/);
  if (inserted) console.log('\nCard inserted (after the intro):\n\n' + inserted[0]);

  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: result.content } });
  console.log(`\n✓ Applied. Donkey 6 card on "${post.slug}" (removed ${result.removed} duplicate CTAs).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
