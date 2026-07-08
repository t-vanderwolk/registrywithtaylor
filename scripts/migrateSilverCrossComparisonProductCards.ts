/**
 * Insert product cards into
 * silver-cross-nia-vs-clic-vs-jet-travel-stroller-comparison-2026.
 *
 * Three-product comparison (Silver Cross Nia / Clic / Jet). Each section's CTAs
 * live in the post's CTA-button store as `::cta-slot <id>` tokens (this post does
 * not use inline markdown links), so this reads the store, and for each section
 * converts the buy CTAs into a `:::catalog-product` block placed after the last
 * image (Shop = Silver Cross). Babylist link + image + price fill in live from the
 * catalogue. Any Albee Baby CTAs are removed entirely (not turned into buttons)
 * and their stored buttons pruned. Inline links are handled as a fallback too.
 *
 * Idempotent: a section that already has a card is skipped.
 *
 *   npx tsx scripts/migrateSilverCrossComparisonProductCards.ts            # dry run
 *   npx tsx scripts/migrateSilverCrossComparisonProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateSilverCrossComparisonProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'silver-cross-nia-vs-clic-vs-jet-travel-stroller-comparison-2026';
const APPLY = process.argv.includes('--apply');

type ProductConfig = { match: RegExp; brand: string; productName: string; image?: string };

const PRODUCTS: ProductConfig[] = [
  { match: /^silver cross nia$/i, brand: 'Silver Cross', productName: 'Nia' },
  { match: /^silver cross clic$/i, brand: 'Silver Cross', productName: 'Clic' },
  {
    match: /^silver cross jet$/i,
    brand: 'Silver Cross',
    productName: 'Jet',
    image: 'https://www.kiddies-kingdom.com/266530-large_default/silver-cross-jet-5-compact-stroller-space.webp',
  },
];

const SHOP_RETAILER = 'Silver Cross';

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*\s*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

// Albee Baby destinations (direct + Commission Junction wrappers) — detected only
// so they can be removed from the post, never surfaced as a buy button.
const ALBEE_URL = /albeebaby\.com|dpbolvw\.net|jdoqocy\.com|anrdoezrs\.net|kqzyfj\.com|tkqlhce\.com|emjcd\.com/;

function classifyUrl(url: string): 'babylist' | 'amazon' | 'macrobaby' | 'shop' | null {
  if (IMAGE_HOST_OR_EXT.test(url)) return null;
  const u = url.toLowerCase();
  if (ALBEE_URL.test(u)) return null; // Albee is removed, not linked.
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  if (u.includes('silvercrossus.com')) return 'shop';
  if (/ref=|affiliate_pid=|aff=|utm_|impact|pjatr|prf\.hn|sjv\.io|\.pxf\.io|awin1\.|awinmid=/.test(u)) return 'shop';
  return null;
}

function buildBlock(cfg: ProductConfig, links: Record<string, string>, imageUrl: string | null): string {
  const out = [':::catalog-product', `Brand: ${cfg.brand}`, `Product: ${cfg.productName}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.amazon) out.push(`Amazon: ${links.amazon}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) {
    out.push(`Shop: ${links.shop}`);
    out.push(`Retailer: ${SHOP_RETAILER}`);
  }
  if (imageUrl) out.push(`Image: ${imageUrl}`);
  out.push(':::');
  return out.join('\n');
}

function sectionBounds(lines: string[], headingIndex: number): number {
  let end = headingIndex + 1;
  while (end < lines.length) {
    const t = lines[end]?.trim() ?? '';
    if (t.startsWith('## ') && !t.startsWith('### ')) break;
    end += 1;
  }
  return end;
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const stored = extractStoredCtaButtons(post.content ?? '');
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');
  const consumedButtonIds = new Set<string>();
  const notes: string[] = [];
  let changed = 0;

  for (const cfg of PRODUCTS) {
    const headingIndex = lines.findIndex((l) => {
      const t = l.trim();
      return t.startsWith('## ') && !t.startsWith('### ') && cfg.match.test(t.replace(/^##\s+/, ''));
    });
    if (headingIndex === -1) {
      notes.push(`• No H2 matched ${cfg.brand} ${cfg.productName} — skipped.`);
      continue;
    }
    const end = sectionBounds(lines, headingIndex);
    if (lines.slice(headingIndex, end).join('\n').includes(':::catalog-product')) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: already has a card — skipped.`);
      continue;
    }

    const links: Record<string, string> = {};
    const dropLineIndexes = new Set<number>();
    let lastImageAt = -1;
    let firstImage: string | null = null;

    for (let i = headingIndex + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      const trimmed = raw.trim();

      const imgMatch = trimmed.match(IMAGE_LINE);
      if (imgMatch) {
        lastImageAt = i;
        if (!firstImage) firstImage = imgMatch[1];
        continue;
      }

      // CTA-slot token → look up the stored button.
      const slotId = parseCtaSlotLine(trimmed);
      if (slotId) {
        const button = buttonById.get(slotId);
        if (button) {
          if (ALBEE_URL.test(button.url.toLowerCase())) {
            // Albee Baby: remove the CTA and prune its stored button entirely.
            dropLineIndexes.add(i);
            consumedButtonIds.add(slotId);
          } else {
            const kind = classifyUrl(button.url);
            if (kind) {
              if (!links[kind]) links[kind] = button.url;
              dropLineIndexes.add(i);
              consumedButtonIds.add(slotId);
            }
          }
        }
        continue;
      }

      // Inline markdown links (fallback; ignore image embeds).
      MD_LINK.lastIndex = 0;
      let m: RegExpExecArray | null;
      let sawBuyOrAlbee = false;
      while ((m = MD_LINK.exec(raw)) !== null) {
        if (m[1] === '!') continue;
        if (ALBEE_URL.test(m[3].toLowerCase())) {
          sawBuyOrAlbee = true; // remove the line, don't link it
          continue;
        }
        const kind = classifyUrl(m[3]);
        if (kind) {
          sawBuyOrAlbee = true;
          if (!links[kind]) links[kind] = m[3];
        }
      }
      if (sawBuyOrAlbee) {
        const stripped = raw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '');
        if (stripped.length === 0) dropLineIndexes.add(i);
      }
    }

    if (Object.keys(links).length === 0) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: matched heading but found NO buy links — left untouched.`);
      continue;
    }

    const kept: string[] = [lines[headingIndex]];
    let keptLastImageAt = -1;
    for (let i = headingIndex + 1; i < end; i += 1) {
      if (dropLineIndexes.has(i)) continue;
      kept.push(lines[i]);
      if (i === lastImageAt) keptLastImageAt = kept.length - 1;
    }
    // An explicit config image (e.g. the Jet) overrides the section's own image.
    const cardImage = cfg.image ?? firstImage;
    let insertAt = keptLastImageAt >= 0 ? keptLastImageAt + 1 : 1;
    if (keptLastImageAt >= 0 && CAPTION_LINE.test((kept[keptLastImageAt + 1] ?? '').trim())) insertAt += 1;
    kept.splice(insertAt, 0, '', buildBlock(cfg, links, cardImage), '');

    lines.splice(headingIndex, end - headingIndex, ...kept);
    changed += 1;
    console.log(`\n──────── ${cfg.brand} ${cfg.productName} ────────`);
    console.log(buildBlock(cfg, links, cardImage));
  }

  const remainingButtons = stored.buttons.filter((b) => !consumedButtonIds.has(b.id));
  const body = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  const updated = serializeCtaButtons(body, remainingButtons);

  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Stored CTA buttons: ${stored.buttons.length} | consumed: ${consumedButtonIds.size} | remaining: ${remainingButtons.length}`);
  console.log(`Sections converted: ${changed}/${PRODUCTS.length}`);
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
  console.log(`\n✓ Applied. Added ${changed} product card(s) to "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
