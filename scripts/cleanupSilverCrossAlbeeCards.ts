/**
 * Clean up the already-applied Silver Cross comparison cards:
 *   1. Remove the Albee Baby retailer from every catalog-product block
 *      (drops the `Shop 2:` + `Retailer 2:` lines), leaving Silver Cross + Babylist.
 *   2. Set the Jet card image to the requested kiddies-kingdom photo.
 *
 * Idempotent: re-running makes no further change once the lines are gone.
 *
 *   npx tsx scripts/cleanupSilverCrossAlbeeCards.ts            # dry run
 *   npx tsx scripts/cleanupSilverCrossAlbeeCards.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/cleanupSilverCrossAlbeeCards.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'silver-cross-nia-vs-clic-vs-jet-travel-stroller-comparison-2026';
const APPLY = process.argv.includes('--apply');

const JET_IMAGE = 'https://www.kiddies-kingdom.com/266530-large_default/silver-cross-jet-5-compact-stroller-space.webp';
const ALBEE_URL = /albeebaby\.com|dpbolvw\.net|jdoqocy\.com|anrdoezrs\.net|kqzyfj\.com|tkqlhce\.com|emjcd\.com/i;

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const lines: string[] = (post.content ?? '').split('\n');
  const out: string[] = [];
  const notes: string[] = [];
  let inBlock = false;
  let blockProduct = '';
  let blockHasImage = false;
  let removedAlbee = 0;
  let jetImageSet = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const t = raw.trim();

    if (t === ':::catalog-product') {
      inBlock = true;
      blockProduct = '';
      blockHasImage = false;
      out.push(raw);
      continue;
    }

    if (inBlock) {
      // Closing fence: before it, ensure the Jet block carries the right image.
      if (t === ':::') {
        if (/^jet$/i.test(blockProduct) && !blockHasImage) {
          out.push(`Image: ${JET_IMAGE}`);
          jetImageSet += 1;
          notes.push('• Jet: added Image line (kiddies-kingdom).');
        }
        inBlock = false;
        out.push(raw);
        continue;
      }

      if (/^product\s*:/i.test(t)) blockProduct = t.slice(t.indexOf(':') + 1).trim();

      // Drop the Albee retailer lines.
      if (/^shop\s*2\s*:/i.test(t) || /^retailer\s*2\s*:/i.test(t)) {
        if (ALBEE_URL.test(t) || /retailer\s*2/i.test(t)) {
          removedAlbee += 1;
          notes.push(`• ${blockProduct || 'block'}: removed "${t}"`);
          continue;
        }
      }
      // Also drop any stray line whose value is an Albee URL.
      if (ALBEE_URL.test(t)) {
        removedAlbee += 1;
        notes.push(`• ${blockProduct || 'block'}: removed Albee line "${t}"`);
        continue;
      }

      if (/^image\s*:/i.test(t)) {
        blockHasImage = true;
        if (/^jet$/i.test(blockProduct)) {
          if (t.slice(t.indexOf(':') + 1).trim() !== JET_IMAGE) {
            out.push(`Image: ${JET_IMAGE}`);
            jetImageSet += 1;
            notes.push('• Jet: replaced Image with kiddies-kingdom photo.');
            continue;
          }
        }
      }

      out.push(raw);
      continue;
    }

    out.push(raw);
  }

  const updated = out.join('\n');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Albee lines removed: ${removedAlbee}`);
  console.log(`Jet image set: ${jetImageSet}`);
  if (notes.length) console.log('\n' + notes.join('\n'));

  if (updated === post.content) {
    console.log('\nNothing to change.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: updated } });
  console.log(`\n✓ Applied. Cleaned "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
