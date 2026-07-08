/**
 * Replace every inline Nuna DEMI Icon affiliate-link pair in
 * nuna-demi-icon-has-arrived with a `:::catalog-product` card.
 *
 * This is a single-product review: the same Babylist + MacroBaby link pair
 * repeats after the images in ~9 sections. Each pair becomes one DEMI Icon card
 * (float-right, in place where the links were). The card resolves its image +
 * live price from the affiliate catalogue; the block Image line is a fallback.
 * The end-of-post "Gear Picks / Brand Partners" recap dedupes to one card.
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

function classifyUrl(url: string): 'babylist' | 'amazon' | 'macrobaby' | 'shop' | null {
  if (IMAGE_HOST_OR_EXT.test(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('babylist.pxf.io') || u.includes('babylist.com')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  if (/ref=|affiliate_pid=|aff=|utm_|impact|pjatr|prf\.hn|sjv\.io|\.pxf\.io|awin1\.|awinmid=|_j=/.test(u)) return 'shop';
  return null;
}

/** A line that is ONLY affiliate markdown links (no prose). Returns its links. */
function affiliateOnlyLine(raw: string): Record<string, string> | null {
  MD_LINK.lastIndex = 0;
  const links: Record<string, string> = {};
  let sawAny = false;
  let m: RegExpExecArray | null;
  while ((m = MD_LINK.exec(raw)) !== null) {
    if (m[1] === '!') return null; // image embed → not a link-only line
    const kind = classifyUrl(m[3]);
    if (kind) {
      sawAny = true;
      if (!links[kind]) links[kind] = m[3];
    }
  }
  if (!sawAny) return null;
  const stripped = raw.replace(MD_LINK, '').replace(/[|•\-–—\s]/g, '');
  return stripped.length === 0 ? links : null;
}

function buildBlock(links: Record<string, string>, imageUrl: string | null): string {
  // Babylist only — no MacroBaby, Amazon, or brand-direct buttons.
  const out = [':::catalog-product', `Brand: ${BRAND}`, `Product: ${PRODUCT}`];
  out.push(`Babylist: ${links.babylist ?? BABYLIST_URL}`);
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

  const lines: string[] = (post.content ?? '').split('\n');
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

    const linkLine = affiliateOnlyLine(raw);
    if (linkLine) {
      // Gather the contiguous run of affiliate-link-only lines (blank lines
      // between links are part of the run) and merge their links.
      const links: Record<string, string> = { ...linkLine };
      let j = i + 1;
      while (j < lines.length) {
        const l = affiliateOnlyLine(lines[j]);
        if (l) {
          for (const [k, v] of Object.entries(l)) if (!links[k]) links[k] = v;
          j += 1;
          continue;
        }
        if (lines[j].trim() === '' && j + 1 < lines.length && affiliateOnlyLine(lines[j + 1])) {
          j += 1; // blank line separating two links
          continue;
        }
        break;
      }

      if (out.length && out[out.length - 1].trim() !== '') out.push('');
      out.push(buildBlock(links, firstImage));
      out.push('');
      replaced += 1;
      // Skip any trailing blank right after the run so we don't stack blanks.
      i = j;
      while (i < lines.length && lines[i].trim() === '') i += 1;
      continue;
    }

    out.push(raw);
    i += 1;
  }

  const updated = out.join('\n').replace(/\n{3,}/g, '\n\n');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Link pairs replaced with cards: ${replaced}`);
  console.log(`Card image fallback: ${firstImage ?? '(none)'}`);
  console.log('\nCard (identical for every section):');
  console.log(buildBlock({ babylist: '…', macrobaby: '…' }, firstImage));

  if (!replaced) {
    console.log('\nNo inline affiliate-link pairs found. Nothing changed.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Replaced ${replaced} link pair(s) with DEMI Icon cards on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
