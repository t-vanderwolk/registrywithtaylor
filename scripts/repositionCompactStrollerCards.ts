/**
 * Reposition the product cards in blog-best-compact-strollers-2026.
 *
 * The cards were originally inserted right after each stroller's FIRST image.
 * We want each section to read: image 1 (product shot) → prose → image 2 (detail
 * shot) → CARD. So for every `:::catalog-product` block this script moves it to
 * sit right after the LAST image that belongs to the same product (the detail
 * shot), keeping the first image where it is.
 *
 * How it finds "the same product's detail image": from the end of the block it
 * scans forward until the next product boundary — a `## ` heading or the next
 * `:::catalog-product` block — and moves the block after the last image in that
 * range (and after that image's italic caption, if present). If there's no image
 * after the block, the block is left where it is.
 *
 * Idempotent: once a block already sits after its detail image, re-running finds
 * no forward image and leaves it alone.
 *
 *   npx tsx scripts/repositionCompactStrollerCards.ts            # dry run
 *   npx tsx scripts/repositionCompactStrollerCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/repositionCompactStrollerCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'blog-best-compact-strollers-2026';
const APPLY = process.argv.includes('--apply');

const IMAGE_LINE = /^!\[[^\]]*\]\(\S+.*\)\s*$/;
const CAPTION_LINE = /^\*[^*].*\*\s*$/; // italic caption like *Silver Cross Breez detail*
const BLOCK_OPEN = ':::catalog-product';
const BLOCK_CLOSE = ':::';

type BlockRange = { start: number; end: number; label: string };

function findBlocks(lines: string[]): BlockRange[] {
  const blocks: BlockRange[] = [];
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
    // Grab the "Product:" line for a readable label in the dry-run output.
    const productLine = lines.slice(i, end + 1).find((l) => /^product\s*:/i.test(l.trim()));
    const label = productLine ? productLine.split(':').slice(1).join(':').trim() : `block@${i}`;
    blocks.push({ start: i, end, label });
    i = end;
  }
  return blocks;
}

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const lines: string[] = (post.content ?? '').split('\n');
  const notes: string[] = [];
  let moved = 0;

  // Process bottom-up so moving a later block never shifts an earlier block's index.
  const blocks = findBlocks(lines).reverse();

  for (const block of blocks) {
    // Product boundary = next `## ` heading or next catalog-product block.
    let boundary = lines.length;
    for (let j = block.end + 1; j < lines.length; j += 1) {
      const t = lines[j]?.trim() ?? '';
      if (t.startsWith('## ') || t === BLOCK_OPEN) {
        boundary = j;
        break;
      }
    }

    // Last image belonging to this product (after the block, before the boundary).
    let lastImg = -1;
    for (let j = block.end + 1; j < boundary; j += 1) {
      if (IMAGE_LINE.test(lines[j]?.trim() ?? '')) lastImg = j;
    }

    if (lastImg === -1) {
      notes.push(`• ${block.label}: no image after the card in this section — left in place.`);
      continue;
    }

    // Keep the image's caption with the image: insert after it if present.
    let insertAfter = lastImg;
    if (CAPTION_LINE.test(lines[insertAfter + 1]?.trim() ?? '')) insertAfter += 1;

    // Extract the block (with a trailing blank line if present) and re-insert.
    const blockLines = lines.slice(block.start, block.end + 1);
    const removeCount = block.end - block.start + 1;
    lines.splice(block.start, removeCount);

    // Everything at/after block.start shifted left by removeCount.
    const insertPos = insertAfter - removeCount + 1;
    lines.splice(insertPos, 0, '', ...blockLines, '');

    moved += 1;
    notes.push(`• ${block.label}: card moved to after the detail image.`);
  }

  const updated = lines.join('\n').replace(/\n{3,}/g, '\n\n');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Cards repositioned: ${moved}`);
  console.log('\n' + notes.reverse().join('\n'));

  if (moved === 0) {
    console.log('\nNothing to move.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Repositioned ${moved} card(s) on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
