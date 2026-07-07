/**
 * Phase 1 blog product-card migration — SINGLE POST ONLY:
 *   blog-best-compact-strollers-2026
 *
 * Converts each product section's manually-embedded affiliate links into a
 * `:::catalog-product` block so it renders as a Resource-tool-style product card
 * (image + price + Babylist/Amazon buttons), matched to the affiliate catalogue
 * at render time. It does NOT touch any other post.
 *
 * How it works (safe + idempotent):
 *   - Loads the post by slug, reads its `content`.
 *   - Walks each `### ` product section listed in PRODUCTS below (matched by a
 *     keyword regex on the heading).
 *   - Extracts the affiliate URLs that already live in that section (verbatim —
 *     nothing is hard-coded), classifying them by domain:
 *       babylist.(pxf.io|com) -> Babylist,  amzn.to/amazon. -> Amazon,
 *       anything else external+affiliate -> direct "Shop <retailer>".
 *   - Pulls the section's first image as the card image.
 *   - Inserts a `:::catalog-product` block right after the heading and strips the
 *     consumed image line + the link-only CTA lines. Descriptive prose stays.
 *   - Skips a section that already contains a `:::catalog-product` block.
 *   - If a section is matched but has no affiliate links, it warns and leaves it
 *     untouched (never destructive).
 *
 * Run it:
 *   npx tsx scripts/migrateCompactStrollersProductCards.ts            # dry run (prints diff)
 *   npx tsx scripts/migrateCompactStrollersProductCards.ts --apply    # writes to DB
 *
 * Against production (Heroku):
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateCompactStrollersProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

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
   *  primary link is neither Babylist nor Amazon). */
  shopRetailer?: string;
};

// Order mirrors the live post. UPPAbaby Kona is intentionally omitted — it's a
// "coming soon" section with no affiliate link yet.
const PRODUCTS: ProductConfig[] = [
  { match: /breez/i, brand: 'Silver Cross', productName: 'Breez', note: 'Best budget-friendly compact stroller', shopRetailer: 'Silver Cross' },
  { match: /dragonfly/i, brand: 'Bugaboo', productName: 'Dragonfly Plus', note: 'Best premium compact stroller' },
  { match: /mios/i, brand: 'CYBEX', productName: 'MIOS Comfort Collection', note: 'Best luxury compact stroller' },
  { match: /triv|pipa urbn/i, brand: 'Nuna', productName: 'TRIV lx + PIPA urbn', note: 'Best compact travel system' },
  { match: /thule shine/i, brand: 'Thule', productName: 'Shine', note: 'Best compact stroller for active families' },
  { match: /joolz hub/i, brand: 'Joolz', productName: 'Hub 2', note: 'Best compact stroller for city living' },
  { match: /city loop|peg perego/i, brand: 'Peg Perego', productName: 'City Loop', note: 'Best compact stroller with one-hand fold' },
];

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const MD_LINK = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;

function classifyUrl(url: string): 'babylist' | 'amazon' | 'shop' | null {
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || u.includes('amazon.') || u.includes('amazon-adsystem')) return 'amazon';
  // Treat any other external link that carries an affiliate marker as a direct
  // brand-retailer buy link (e.g. Silver Cross ref=/affiliate_pid=).
  if (/ref=|affiliate_pid=|aff=|utm_|impact|pjatr|prf\.hn/.test(u)) return 'shop';
  return null;
}

function isLinkOnlyLine(line: string): boolean {
  // A CTA line whose only meaningful content is affiliate markdown links.
  const stripped = line.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '');
  return stripped.length === 0 && MD_LINK.test(line);
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
  if (imageUrl) lines.push(`Image: ${imageUrl}`);
  lines.push(':::');
  return lines.join('\n');
}

function sectionBounds(lines: string[], headingIndex: number): number {
  // Section runs until the next ###/## heading or end of doc.
  let end = headingIndex + 1;
  while (end < lines.length) {
    const t = lines[end]?.trim() ?? '';
    if (t.startsWith('### ') || t.startsWith('## ')) break;
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

  const original: string = post.content ?? '';
  if (original.includes('<!--TMBC_CTA_BUTTONS:')) {
    console.warn('⚠ This post stores CTA buttons in the TMBC_CTA_BUTTONS block. Review those separately — this script only converts inline markdown affiliate links.');
  }

  const lines = original.split('\n');
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
    const sectionText = lines.slice(headingIndex, end).join('\n');

    if (sectionText.includes(':::catalog-product')) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: already has a catalog-product block — skipped.`);
      continue;
    }

    // Collect affiliate links + first image within the section.
    const links: Record<string, string> = {};
    let imageUrl: string | null = null;
    for (let i = headingIndex + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      const imgMatch = raw.trim().match(IMAGE_LINE);
      if (imgMatch && !imageUrl) imageUrl = imgMatch[1];
      MD_LINK.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = MD_LINK.exec(raw)) !== null) {
        const kind = classifyUrl(m[2]);
        if (kind && !links[kind]) links[kind] = m[2];
      }
    }

    if (Object.keys(links).length === 0) {
      notes.push(`• ${cfg.brand} ${cfg.productName}: matched heading but found NO affiliate links — left untouched.`);
      continue;
    }

    // Rebuild the section: drop the hero image line + link-only CTA lines, then
    // insert the block right after the heading.
    const kept: string[] = [lines[headingIndex]];
    let heroDropped = false;
    for (let i = headingIndex + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      const isHero = !heroDropped && IMAGE_LINE.test(raw.trim());
      if (isHero) {
        heroDropped = true;
        continue;
      }
      if (isLinkOnlyLine(raw)) continue;
      kept.push(raw);
    }
    // Insert block after heading (index 0 of kept), padded by blank lines.
    kept.splice(1, 0, '', buildBlock(cfg, links, imageUrl), '');

    lines.splice(headingIndex, end - headingIndex, ...kept);
    changed += 1;

    console.log(`\n──────── ${cfg.brand} ${cfg.productName} ────────`);
    console.log(buildBlock(cfg, links, imageUrl));
  }

  const updated = lines.join('\n');

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
