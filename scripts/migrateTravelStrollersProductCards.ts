/**
 * Insert product cards into best-travel-strollers-2026.
 *
 * For each stroller section this converts the inline affiliate links (Amazon /
 * Babylist / MacroBaby / brand-direct) into a `:::catalog-product` block, placed
 * right after the section's last (detail) image — so it reads image → prose →
 * detail image → card, matching the compact-strollers post. The end-of-post
 * "Gear Picks / Brand Partners" recap then renders every card a second time
 * automatically (it surfaces whenever a post has catalog-product blocks).
 *
 * Links are read from the post at runtime (nothing hard-coded) and classified by
 * domain. Consumed link-only lines are removed; images and prose stay.
 *
 * Safe + idempotent: a section that already has a `:::catalog-product` block is
 * skipped; a section with no buy links is left untouched.
 *
 *   npx tsx scripts/migrateTravelStrollersProductCards.ts            # dry run
 *   npx tsx scripts/migrateTravelStrollersProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateTravelStrollersProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'best-travel-strollers-2026';
const APPLY = process.argv.includes('--apply');

type ProductConfig = {
  match: RegExp;
  brand: string;
  productName: string;
  note?: string;
  /** Label for a brand-direct retailer button (Mima, Silver Cross). */
  shopRetailer?: string;
};

const PRODUCTS: ProductConfig[] = [
  { match: /joolz aer/i, brand: 'Joolz', productName: 'Aer2', note: 'Best overall travel stroller' },
  { match: /mima miro/i, brand: 'Mima', productName: 'Miro', note: 'Best up-and-coming travel stroller', shopRetailer: 'Mima' },
  { match: /bugaboo butterfly/i, brand: 'Bugaboo', productName: 'Butterfly 2', note: 'Best travel stroller for effortless flying' },
  { match: /cybex libelle/i, brand: 'CYBEX', productName: 'Libelle', note: 'Best lightweight budget travel stroller' },
  { match: /nuna trvl/i, brand: 'Nuna', productName: 'TRVL LX', note: 'Best premium travel system' },
  { match: /silver cross nia/i, brand: 'Silver Cross', productName: 'Nia', note: 'Best compact luxury travel stroller', shopRetailer: 'Silver Cross' },
];

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*\s*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

function isImageUrl(url: string) {
  // NB: amzn.to/dp links are buy links (not media-amazon image CDN), so allowed.
  return IMAGE_HOST_OR_EXT.test(url);
}

function classifyUrl(url: string): 'babylist' | 'amazon' | 'macrobaby' | 'shop' | null {
  if (isImageUrl(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  if (/ref=|affiliate_pid=|aff=|utm_|impact|pjatr|prf\.hn|sjv\.io|\.pxf\.io|awin1\.|awinmid=|awinaffid=/.test(u)) return 'shop';
  return null;
}

function buildBlock(cfg: ProductConfig, links: Record<string, string>, imageUrl: string | null): string {
  const out = [':::catalog-product', `Brand: ${cfg.brand}`, `Product: ${cfg.productName}`];
  if (links.babylist) out.push(`Babylist: ${links.babylist}`);
  if (links.amazon) out.push(`Amazon: ${links.amazon}`);
  if (links.macrobaby) out.push(`MacroBaby: ${links.macrobaby}`);
  if (links.shop) {
    out.push(`Shop: ${links.shop}`);
    if (cfg.shopRetailer) out.push(`Retailer: ${cfg.shopRetailer}`);
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
  const consumedButtonUrls = new Set<string>();
  const notes: string[] = [];
  let changed = 0;

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
      notes.push(`• ${cfg.brand} ${cfg.productName}: already has a card — skipped.`);
      continue;
    }

    // Collect buy links (CTA slots first, then inline markdown links) + track the
    // last image and the link-only lines to strip.
    const links: Record<string, string> = {};
    const dropLineIndexes = new Set<number>();
    let lastImageAt = -1;

    for (let i = headingIndex + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      const trimmed = raw.trim();

      if (IMAGE_LINE.test(trimmed)) {
        lastImageAt = i;
        continue;
      }

      const slotId = parseCtaSlotLine(trimmed);
      if (slotId) {
        const button = buttonById.get(slotId);
        if (button) {
          const kind = classifyUrl(button.url);
          if (kind) {
            if (!links[kind]) links[kind] = button.url;
            dropLineIndexes.add(i);
            consumedButtonUrls.add(button.url);
          }
        }
        continue;
      }

      // Inline markdown links (ignore image embeds).
      MD_LINK.lastIndex = 0;
      let m: RegExpExecArray | null;
      let sawLink = false;
      while ((m = MD_LINK.exec(raw)) !== null) {
        if (m[1] === '!') continue;
        const kind = classifyUrl(m[3]);
        if (kind) {
          sawLink = true;
          if (!links[kind]) links[kind] = m[3];
        }
      }
      // Drop the line if it was ONLY affiliate links.
      if (sawLink) {
        const stripped = raw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '');
        if (stripped.length === 0) dropLineIndexes.add(i);
      }
    }

    if (Object.keys(links).length === 0) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: matched heading but found NO buy links — left untouched.`);
      continue;
    }

    const imageUrl = (() => {
      // Card image = the section's first image (hero under the heading).
      for (let i = headingIndex + 1; i < end; i += 1) {
        const mm = (lines[i] ?? '').trim().match(IMAGE_LINE);
        if (mm) return mm[1];
      }
      return null;
    })();

    // Rebuild the section: drop consumed link-only lines, keep everything else,
    // and insert the card after the LAST image (+ caption).
    const kept: string[] = [lines[headingIndex]];
    let keptLastImageAt = -1;
    for (let i = headingIndex + 1; i < end; i += 1) {
      if (dropLineIndexes.has(i)) continue;
      kept.push(lines[i]);
      if (i === lastImageAt) keptLastImageAt = kept.length - 1;
    }
    let insertAt = keptLastImageAt >= 0 ? keptLastImageAt + 1 : 1;
    if (keptLastImageAt >= 0 && CAPTION_LINE.test((kept[keptLastImageAt + 1] ?? '').trim())) insertAt += 1;
    kept.splice(insertAt, 0, '', buildBlock(cfg, links, imageUrl), '');

    lines.splice(headingIndex, end - headingIndex, ...kept);
    changed += 1;
    console.log(`\n──────── ${cfg.brand} ${cfg.productName} ────────`);
    console.log(buildBlock(cfg, links, imageUrl));
  }

  const remainingButtons = stored.buttons.filter((b) => !consumedButtonUrls.has(b.url));
  const cleanedLines = lines.filter((raw) => {
    const slotId = parseCtaSlotLine(raw.trim());
    if (!slotId) return true;
    const btn = buttonById.get(slotId);
    return !(btn && consumedButtonUrls.has(btn.url));
  });
  const updated = serializeCtaButtons(cleanedLines.join('\n'), remainingButtons).replace(/\n{3,}/g, '\n\n');

  console.log('\n════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
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
