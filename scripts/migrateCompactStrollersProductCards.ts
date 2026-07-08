/**
 * Phase 1 blog product-card migration — SINGLE POST ONLY:
 *   blog-best-compact-strollers-2026
 *
 * Converts each product section's affiliate CTAs into a `:::catalog-product`
 * block so it renders as a Resource-tool-style product card (image + price +
 * Babylist/Amazon buttons), matched to the affiliate catalogue at render time.
 * It does NOT touch any other post.
 *
 * Where the links live: this post's buy links are stored as CTA buttons in the
 * trailing `<!--TMBC_CTA_BUTTONS:…-->` block and placed inline with
 * `::cta-slot <id>` tokens — NOT as inline markdown links. So the script:
 *   - Loads the post, splits the stored CTA buttons from the body.
 *   - Walks each `### ` product section (matched by a keyword regex on the head).
 *   - Resolves that section's `::cta-slot <id>` tokens to their buttons and reads
 *     each button's URL verbatim (nothing hard-coded), classifying by domain:
 *       babylist.(pxf.io|com) -> Babylist,  amzn.to/amazon.<tld> -> Amazon,
 *       any other external+affiliate link -> direct "Shop <retailer>".
 *   - Also scans inline markdown links as a fallback (image URLs are ignored).
 *   - Uses the section's first image as the card image.
 *   - Inserts the block after the heading, strips the consumed `::cta-slot`
 *     lines + hero image line, and removes the consumed buttons from storage so
 *     nothing is orphaned. Descriptive prose stays.
 *   - Skips a section that already has a `:::catalog-product` block, and leaves
 *     any section with no resolvable buy link untouched (never destructive).
 *
 * Run it:
 *   npx tsx scripts/migrateCompactStrollersProductCards.ts            # dry run
 *   npx tsx scripts/migrateCompactStrollersProductCards.ts --apply    # writes
 *
 * Against production (Heroku):
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateCompactStrollersProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import {
  extractStoredCtaButtons,
  parseCtaSlotLine,
  serializeCtaButtons,
  type CtaButton,
} from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'blog-best-compact-strollers-2026';
const APPLY = process.argv.includes('--apply');

type ProductConfig = {
  /** Matches the `### ` heading text (case-insensitive). */
  match: RegExp;
  brand: string;
  productName: string;
  note?: string;
  /** Label for a direct brand retailer button (used only when the section's
   *  buy link is neither Babylist nor Amazon, e.g. Silver Cross). */
  shopRetailer?: string;
  /** Render a "Coming Soon" card with no retailer buttons (no affiliate yet). */
  comingSoon?: boolean;
  /** Explicit image URL (used for coming-soon products with no catalogue row). */
  image?: string;
  /** Which retailer button leads on the card. */
  primaryRetailer?: 'babylist' | 'amazon' | 'shop';
  /** Explicit buy links to include even if not found in-section (folded from a
   *  stray CTA button elsewhere in the post). */
  babylist?: string;
  amazon?: string;
};

// Order mirrors the live post. UPPAbaby Kona has no affiliate link yet, so it
// gets a "Coming Soon" card (image + badge, no buy buttons).
const PRODUCTS: ProductConfig[] = [
  {
    match: /breez/i,
    brand: 'Silver Cross',
    productName: 'Breez',
    note: 'Best budget-friendly compact stroller',
    shopRetailer: 'Silver Cross',
    primaryRetailer: 'shop', // your direct ref=4762 link leads; Babylist second
    babylist: 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fsilver-cross-breez-mid-size-compact-stroller%2F79448%2F2839934&partnerpropertyid=7490466',
  },
  { match: /dragonfly/i, brand: 'Bugaboo', productName: 'Dragonfly Plus', note: 'Best premium compact stroller' },
  { match: /mios/i, brand: 'CYBEX', productName: 'MIOS Comfort Collection', note: 'Best luxury compact stroller' },
  { match: /triv|pipa urbn/i, brand: 'Nuna', productName: 'TRIV lx + PIPA urbn', note: 'Best compact travel system' },
  { match: /thule shine/i, brand: 'Thule', productName: 'Shine', note: 'Best compact stroller for active families' },
  {
    match: /kona/i,
    brand: 'UPPAbaby',
    productName: 'Kona',
    note: 'Best all-terrain compact — retailer coming soon',
    comingSoon: true,
    image: 'https://www.westcoastkids.ca/media/catalog/product/1/2/1200x1200_uppababy_konastroller-hero_copy.jpg?optimize=high&fit=bounds&height=700&width=700',
  },
  {
    match: /joolz hub/i,
    brand: 'Joolz',
    productName: 'Hub 2',
    note: 'Best compact stroller for city living',
    babylist: 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fjoolz-hub-stroller-1741715957%2F71326%2F2374731&partnerpropertyid=7490466',
    amazon: 'https://amzn.to/4y5febr',
  },
  { match: /city loop|peg perego/i, brand: 'Peg Perego', productName: 'City Loop', note: 'Best compact stroller with one-hand fold' },
];

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

function isImageUrl(url: string) {
  return IMAGE_HOST_OR_EXT.test(url);
}

function classifyUrl(url: string): 'babylist' | 'amazon' | 'shop' | null {
  if (isImageUrl(url)) return null; // never treat an image URL as a buy link
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (/ref=|affiliate_pid=|aff=|utm_|impact|pjatr|prf\.hn|sjv\.io|\.pxf\.io/.test(u)) return 'shop';
  return null;
}

function buildBlock(cfg: ProductConfig, links: Record<string, string>, imageUrl: string | null): string {
  const lines = [':::catalog-product', `Brand: ${cfg.brand}`, `Product: ${cfg.productName}`];
  if (cfg.note) lines.push(`Note: ${cfg.note}`);
  if (links.babylist) lines.push(`Babylist: ${links.babylist}`);
  if (links.amazon) lines.push(`Amazon: ${links.amazon}`);
  if (links.shop) {
    lines.push(`Shop: ${links.shop}`);
    if (cfg.shopRetailer) lines.push(`Retailer: ${cfg.shopRetailer}`);
  }
  if (cfg.primaryRetailer) lines.push(`Primary: ${cfg.primaryRetailer}`);
  if (cfg.comingSoon) lines.push('Status: coming soon');
  const finalImage = cfg.image ?? imageUrl;
  if (finalImage) lines.push(`Image: ${finalImage}`);
  lines.push(':::');
  return lines.join('\n');
}

function sectionBounds(lines: string[], headingIndex: number): number {
  let end = headingIndex + 1;
  while (end < lines.length) {
    const t = lines[end]?.trim() ?? '';
    if (t.startsWith('### ') || t.startsWith('## ')) break;
    end += 1;
  }
  return end;
}

async function main() {
  const post = await db.post.findFirst({
    where: { slug: SLUG },
    select: { id: true, slug: true, title: true, content: true },
  });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const original: string = post.content ?? '';
  const stored = extractStoredCtaButtons(original);
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');
  // Track consumed buttons by URL, not id: the stored JSON can carry duplicate
  // ids, so an id-based filter could drop an unrelated button by accident.
  const consumedButtonUrls = new Set<string>();
  let changed = 0;
  const notes: string[] = [];

  for (const cfg of PRODUCTS) {
    const headingIndex = lines.findIndex(
      (l) => l.trim().startsWith('### ') && cfg.match.test(l.replace(/^###\s+/, '')),
    );
    if (headingIndex === -1) {
      notes.push(`• No heading matched ${cfg.match} (${cfg.brand} ${cfg.productName}) — skipped.`);
      continue;
    }

    const end = sectionBounds(lines, headingIndex);
    if (lines.slice(headingIndex, end).join('\n').includes(':::catalog-product')) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: already has a catalog-product block — skipped.`);
      continue;
    }

    // Collect buy links (from CTA slots first, then inline markdown fallback) and
    // the section's first image. Track which slot ids/lines we consume.
    const links: Record<string, string> = {};
    const slotLineIndexes = new Set<number>();
    const sectionSlotButtonUrls: string[] = [];
    let imageUrl: string | null = null;

    for (let i = headingIndex + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      const trimmed = raw.trim();

      const imgMatch = trimmed.match(IMAGE_LINE);
      if (imgMatch && !imageUrl) {
        imageUrl = imgMatch[1];
        continue;
      }

      const slotId = parseCtaSlotLine(trimmed);
      if (slotId) {
        const button = buttonById.get(slotId);
        if (button) {
          const kind = classifyUrl(button.url);
          if (kind) {
            if (!links[kind]) links[kind] = button.url;
            slotLineIndexes.add(i); // only strip the slot line for a real buy link
            sectionSlotButtonUrls.push(button.url);
          }
        }
        continue;
      }

      // Fallback: inline markdown links (ignore image embeds ![]()).
      MD_LINK.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = MD_LINK.exec(raw)) !== null) {
        if (m[1] === '!') continue; // it's an image, not a link
        const kind = classifyUrl(m[3]);
        if (kind && !links[kind]) links[kind] = m[3];
      }
    }

    // Explicit config links OVERRIDE whatever was found in-section (used to
    // fold in a stray Breez Babylist button, and to correct the Joolz Hub 2
    // links). The old in-section button URLs are already marked consumed, so
    // they drop out of storage; the config URL is what the card shows.
    if (cfg.babylist) {
      links.babylist = cfg.babylist;
      consumedButtonUrls.add(cfg.babylist);
    }
    if (cfg.amazon) {
      links.amazon = cfg.amazon;
      consumedButtonUrls.add(cfg.amazon);
    }

    if (Object.keys(links).length === 0 && !cfg.comingSoon) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: matched heading but found NO buy links — left untouched.`);
      continue;
    }

    // Rebuild the section: KEEP every product image (restore the first, keep the
    // second) and drop only the consumed cta-slot lines + link-only inline lines.
    // The card is inserted right AFTER the LAST image, so each stroller reads
    // image → image → card. If there's no image, the card goes after the heading.
    const kept: string[] = [lines[headingIndex]];
    let lastImageAt = -1;
    let imageCount = 0;
    for (let i = headingIndex + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      if (slotLineIndexes.has(i)) continue;
      const isImage = IMAGE_LINE.test(raw.trim());
      if (!isImage) {
        // Drop a line that was ONLY inline affiliate links (rare fallback path).
        const linkStripped = raw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '');
        if (linkStripped.length === 0 && /\]\((https?:\/\/[^)\s]+)\)/.test(raw)) continue;
      }
      kept.push(raw);
      if (isImage) {
        lastImageAt = kept.length - 1;
        imageCount += 1;
      }
    }
    const insertAt = lastImageAt >= 0 ? lastImageAt + 1 : 1;
    kept.splice(insertAt, 0, '', buildBlock(cfg, links, imageUrl), '');
    notes.push(`• ${cfg.brand} ${cfg.productName}: ${imageCount} product image${imageCount === 1 ? '' : 's'} kept, card placed after the last image.`);

    lines.splice(headingIndex, end - headingIndex, ...kept);
    sectionSlotButtonUrls.forEach((url) => consumedButtonUrls.add(url));
    changed += 1;

    console.log(`\n──────── ${cfg.brand} ${cfg.productName} ────────`);
    console.log(buildBlock(cfg, links, imageUrl));
  }

  // Strip any leftover `::cta-slot` line whose button was folded into a card,
  // even if it lived outside the product section (e.g. a stray Breez Babylist).
  const cleanedLines = lines.filter((raw) => {
    const slotId = parseCtaSlotLine(raw.trim());
    if (!slotId) return true;
    const btn = buttonById.get(slotId);
    return !(btn && consumedButtonUrls.has(btn.url));
  });

  // Remaining CTA buttons (those we did not fold into cards) are re-serialized so
  // consumed buttons drop out of storage entirely.
  const remainingButtons = stored.buttons.filter((b) => !consumedButtonUrls.has(b.url));
  const newBody = cleanedLines.join('\n');
  const updated = serializeCtaButtons(newBody, remainingButtons);

  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Sections converted: ${changed}/${PRODUCTS.length}`);
  console.log(`CTA buttons: ${stored.buttons.length} total → ${consumedButtonUrls.size} folded into cards, ${remainingButtons.length} kept`);

  console.log('\nButton inventory (label — folded/kept):');
  for (const b of stored.buttons) {
    const status = consumedButtonUrls.has(b.url) ? 'FOLDED' : 'KEPT';
    console.log(`  [${status}] "${b.label}"  →  ${b.url}`);
  }

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
  console.log(`\n✓ Applied. Updated ${changed} product section(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
