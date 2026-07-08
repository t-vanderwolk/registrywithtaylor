/**
 * Replace every Nuna DEMI Icon affiliate CTA in nuna-demi-icon-has-arrived with a
 * `:::catalog-product` card that links to Babylist ONLY (no MacroBaby / Albee).
 *
 * This is a single-product review: the same Babylist + MacroBaby CTA repeats after
 * the images in ~9 sections. Those CTAs live in the post's CTA-button store as
 * `::cta-slot <id>` tokens (not inline markdown), so this reads the store, finds
 * each run of buy-link slots (also handling any inline links), and swaps it for one
 * DEMI Icon card in place. The card resolves its image + live price from the
 * catalogue; the block Image line is a fallback. Consumed buttons are removed from
 * the store. The end-of-post Gear Picks recap dedupes to one card.
 *
 * Safe + idempotent: bails if the post already has a catalog-product block.
 *
 *   npx tsx scripts/migrateNunaDemiIconProductCards.ts            # dry run
 *   npx tsx scripts/migrateNunaDemiIconProductCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/migrateNunaDemiIconProductCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, serializeCtaButtons, type CtaButton } from '@/lib/blog/ctaButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'nuna-demi-icon-has-arrived';
const APPLY = process.argv.includes('--apply');

const BRAND = 'Nuna';
const PRODUCT = 'DEMI Icon';

// Per request, the DEMI Icon card links to Babylist ONLY (no MacroBaby / Albee).
const BABYLIST_URL =
  'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fnuna-demi-icon%2F81555%2F3142525&partnerpropertyid=7490466';

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;

function isBuyUrl(url: string): boolean {
  if (IMAGE_HOST_OR_EXT.test(url)) return false;
  const u = url.toLowerCase();
  return (
    u.includes('babylist.pxf.io') ||
    u.includes('babylist.com') ||
    u.includes('amzn.to') ||
    /amazon\.[a-z.]+\//.test(u) ||
    u.includes('macrobaby.com') ||
    /ref=|affiliate_pid=|aff=|utm_|impact|pjatr|prf\.hn|sjv\.io|\.pxf\.io|awin1\.|awinmid=|_j=/.test(u)
  );
}

/** A line that is ONLY affiliate markdown links (no prose). */
function isInlineBuyLine(raw: string): boolean {
  MD_LINK.lastIndex = 0;
  let sawBuy = false;
  let m: RegExpExecArray | null;
  while ((m = MD_LINK.exec(raw)) !== null) {
    if (m[1] === '!') return false;
    if (isBuyUrl(m[3])) sawBuy = true;
  }
  if (!sawBuy) return false;
  const stripped = raw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '');
  return stripped.length === 0;
}

function buildBlock(imageUrl: string | null): string {
  // Babylist only — no MacroBaby, Amazon, or brand-direct buttons.
  const out = [':::catalog-product', `Brand: ${BRAND}`, `Product: ${PRODUCT}`, `Babylist: ${BABYLIST_URL}`];
  if (imageUrl) out.push(`Image: ${imageUrl}`);
  out.push(':::');
  return out.join('\n');
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }
  if ((post.content ?? '').includes(':::catalog-product')) {
    console.log('This post already has catalog-product cards — nothing to do.');
    return;
  }

  const stored = extractStoredCtaButtons(post.content ?? '');
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');
  const consumedButtonIds = new Set<string>();

  // A body line that is a buy CTA: either a `::cta-slot <id>` whose stored button
  // is a buy link, or an inline affiliate-only markdown line.
  const slotBuyId = (raw: string): string | null => {
    const id = parseCtaSlotLine(raw.trim());
    if (!id) return null;
    const btn = buttonById.get(id);
    return btn && isBuyUrl(btn.url) ? id : null;
  };
  const isBuyLine = (raw: string): boolean => slotBuyId(raw) !== null || isInlineBuyLine(raw);

  const out: string[] = [];
  let firstImage: string | null = null;
  let replaced = 0;
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const imgMatch = raw.trim().match(IMAGE_LINE);
    if (imgMatch) {
      if (!firstImage) firstImage = imgMatch[1];
      out.push(raw);
      i += 1;
      continue;
    }

    if (isBuyLine(raw)) {
      // Gather the contiguous run of buy CTAs (blank lines between them included).
      let j = i;
      while (j < lines.length) {
        if (isBuyLine(lines[j])) {
          const id = slotBuyId(lines[j]);
          if (id) consumedButtonIds.add(id);
          j += 1;
          continue;
        }
        if (lines[j].trim() === '' && j + 1 < lines.length && isBuyLine(lines[j + 1])) {
          j += 1;
          continue;
        }
        break;
      }

      if (out.length && out[out.length - 1].trim() !== '') out.push('');
      out.push(buildBlock(firstImage));
      out.push('');
      replaced += 1;
      i = j;
      while (i < lines.length && lines[i].trim() === '') i += 1;
      continue;
    }

    out.push(raw);
    i += 1;
  }

  const remainingButtons = stored.buttons.filter((b) => !consumedButtonIds.has(b.id));
  const body = out.join('\n').replace(/\n{3,}/g, '\n\n');
  const updated = serializeCtaButtons(body, remainingButtons);

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Stored CTA buttons: ${stored.buttons.length} | consumed: ${consumedButtonIds.size} | remaining: ${remainingButtons.length}`);
  console.log(`CTA runs replaced with cards: ${replaced}`);
  console.log(`Card image fallback: ${firstImage ?? '(none)'}`);
  console.log('\nCard (identical for every section):');
  console.log(buildBlock(firstImage));

  if (!replaced) {
    console.log('\nNo buy CTAs found. Nothing changed.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Replaced ${replaced} CTA run(s) with DEMI Icon cards on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
