/**
 * Restore the first product image under each stroller heading in
 * blog-best-compact-strollers-2026.
 *
 * The original migration moved each stroller's hero image URL into the product
 * card and dropped the standalone image, so nothing renders directly under the
 * `### <Product>` heading. This puts it back: for every `:::catalog-product`
 * block it finds the block's own `Image:` URL and its product heading, then
 * inserts `![<Brand> <Product>](<image>)` right after that heading — unless an
 * image already sits there.
 *
 * Result per section: heading → hero image → prose → detail image → card.
 *
 * Idempotent: if an image already follows the heading, that section is skipped.
 *
 *   npx tsx scripts/restoreCompactStrollerHeroImages.ts            # dry run
 *   npx tsx scripts/restoreCompactStrollerHeroImages.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/restoreCompactStrollerHeroImages.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'blog-best-compact-strollers-2026';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\(\S+.*\)\s*$/;
const BLOCK_OPEN = ':::catalog-product';
const BLOCK_CLOSE = ':::';

const squash = (s: string) => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

function blockField(lines: string[], start: number, end: number, key: string): string | null {
  const re = new RegExp(`^${key}\\s*:`, 'i');
  const line = lines.slice(start, end + 1).find((l) => re.test(l.trim()));
  if (!line) return null;
  return line.slice(line.indexOf(':') + 1).trim() || null;
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const lines: string[] = (post.content ?? '').split('\n');
  const notes: string[] = [];
  let restored = 0;

  // Find catalog-product blocks (top-down); collect the insert operations, then
  // apply them bottom-up so earlier indexes don't shift.
  type Op = { headingIndex: number; imageMarkdown: string; label: string };
  const ops: Op[] = [];

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

    const brand = blockField(lines, i, end, 'brand') ?? '';
    const productName = blockField(lines, i, end, 'product') ?? '';
    const imageUrl = blockField(lines, i, end, 'image');
    const wantHeading = squash(`${brand} ${productName}`);
    const wantProduct = squash(productName);

    if (!imageUrl) {
      notes.push(`• ${brand} ${productName}: block has no Image — skipped.`);
      i = end;
      continue;
    }

    // Walk backward to the product-name heading (### line containing the product).
    let headingIndex = -1;
    for (let j = i - 1; j >= 0; j -= 1) {
      const t = lines[j]?.trim() ?? '';
      if (t.startsWith('## ') && !t.startsWith('### ')) break; // left the product; stop
      if (t.startsWith('### ')) {
        const h = squash(t.replace(/^###\s+/, ''));
        if ((wantProduct && h.includes(wantProduct)) || (wantHeading && h.includes(wantHeading))) {
          headingIndex = j;
          break;
        }
      }
    }

    if (headingIndex === -1) {
      notes.push(`• ${brand} ${productName}: could not find its product heading — skipped.`);
      i = end;
      continue;
    }

    // Already has an image right after the heading? (skip blank lines)
    let next = headingIndex + 1;
    while (next < lines.length && (lines[next]?.trim() ?? '') === '') next += 1;
    if (next < lines.length && IMAGE_LINE.test(lines[next].trim())) {
      notes.push(`• ${brand} ${productName}: image already under the heading — skipped.`);
      i = end;
      continue;
    }

    const alt = `${brand} ${productName}`.trim();
    ops.push({ headingIndex, imageMarkdown: `![${alt}](${imageUrl})`, label: alt });
    i = end;
  }

  // Apply bottom-up.
  ops.sort((a, b) => b.headingIndex - a.headingIndex);
  for (const op of ops) {
    lines.splice(op.headingIndex + 1, 0, '', op.imageMarkdown, '');
    restored += 1;
    notes.push(`• ${op.label}: hero image restored under the heading.`);
  }

  const updated = lines.join('\n').replace(/\n{3,}/g, '\n\n');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Hero images restored: ${restored}`);
  console.log('\n' + notes.join('\n'));

  if (restored === 0) {
    console.log('\nNothing to restore.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Restored ${restored} hero image(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
