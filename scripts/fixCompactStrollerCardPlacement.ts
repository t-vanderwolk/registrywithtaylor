/**
 * Place each product card right after ITS OWN detail image in
 * blog-best-compact-strollers-2026.
 *
 * When two products share one `## ` heading (Joolz Hub 2 + Peg Perego City Loop
 * under "Best Compact Hidden Gem"), the earlier reposition pass lumped both cards
 * together after the last image. This fixes that by matching each
 * `:::catalog-product` block to the detail image whose alt text names the same
 * product (e.g. "Joolz Hub 2 detail") and moving the card to sit right after it
 * (and its caption).
 *
 * Robust + idempotent: it removes every card, then re-inserts each one after its
 * matching detail image, so running it repeatedly yields the same layout.
 *
 *   npx tsx scripts/fixCompactStrollerCardPlacement.ts            # dry run
 *   npx tsx scripts/fixCompactStrollerCardPlacement.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/fixCompactStrollerCardPlacement.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'blog-best-compact-strollers-2026';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[([^\]]*)\]\(\S+.*\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*\s*$/;
const BLOCK_OPEN = ':::catalog-product';
const BLOCK_CLOSE = ':::';

const squash = (s: string) => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

function blockField(lines: string[], start: number, end: number, key: string): string {
  const re = new RegExp(`^${key}\\s*:`, 'i');
  const line = lines.slice(start, end + 1).find((l) => re.test(l.trim()));
  return line ? line.slice(line.indexOf(':') + 1).trim() : '';
}

function imageAlt(line: string): string | null {
  const m = line.trim().match(IMAGE_LINE);
  return m ? m[1] : null;
}

type Card = { lines: string[]; brand: string; product: string; wantKey: string };

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const lines: string[] = (post.content ?? '').split('\n');

  // 1. Collect every card block.
  const ranges: Array<{ start: number; end: number }> = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i]?.trim() !== BLOCK_OPEN) continue;
    let end = -1;
    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[j]?.trim() === BLOCK_CLOSE) {
        end = j;
        break;
      }
    }
    if (end === -1) continue;
    ranges.push({ start: i, end });
    i = end;
  }

  const cards: Card[] = ranges.map((r) => {
    const brand = blockField(lines, r.start, r.end, 'brand');
    const product = blockField(lines, r.start, r.end, 'product');
    return {
      lines: lines.slice(r.start, r.end + 1),
      brand,
      product,
      wantKey: squash(`${brand} ${product}`),
    };
  });

  // 2. Remove every card (bottom-up) so the remaining lines are just prose+images.
  for (const r of [...ranges].sort((a, b) => b.start - a.start)) {
    lines.splice(r.start, r.end - r.start + 1);
  }

  // 3. Re-insert each card after its own detail image (fall back to any image
  //    whose alt names the product, then to the product heading).
  const notes: string[] = [];
  let placed = 0;

  for (const card of cards) {
    const wantProduct = squash(card.product);
    const matchesProduct = (alt: string | null) => {
      if (!alt) return false;
      const a = squash(alt);
      return (wantProduct && a.includes(wantProduct)) || (card.wantKey && a.includes(card.wantKey));
    };

    // Prefer the "<product> detail" image.
    let target = lines.findIndex((l) => {
      const alt = imageAlt(l);
      return matchesProduct(alt) && /detail/i.test(alt ?? '');
    });
    // Fall back to any product image (e.g. the restored hero).
    if (target === -1) target = lines.findIndex((l) => matchesProduct(imageAlt(l)));

    if (target === -1) {
      // Last resort: after the product heading.
      target = lines.findIndex((l) => {
        const t = l.trim();
        return t.startsWith('### ') && matchesProduct(t.replace(/^###\s+/, ''));
      });
      if (target === -1) {
        notes.push(`• ${card.brand} ${card.product}: no matching image/heading found — card NOT re-inserted!`);
        continue;
      }
    }

    // Keep the image's caption attached.
    let insertAfter = target;
    if (CAPTION_LINE.test(lines[insertAfter + 1]?.trim() ?? '')) insertAfter += 1;

    lines.splice(insertAfter + 1, 0, '', ...card.lines, '');
    placed += 1;
    notes.push(`• ${card.brand} ${card.product}: card placed after its detail image.`);
  }

  const updated = lines.join('\n').replace(/\n{3,}/g, '\n\n');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Cards placed: ${placed}/${cards.length}`);
  console.log('\n' + notes.join('\n'));

  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Placed ${placed} card(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
