/**
 * Fix the "Nuna Travel Crib Showdown" post's placeholder slug + metadata.
 *
 *  • slug:  "slug-nuna-travel-crib-showdown-sena-paal-cove"  (literal "slug-" placeholder)
 *        →  "nuna-travel-crib-showdown-sena-paal-cove"
 *  • seoTitle + shareTitle: single consistent title so og:title matches the H1
 *  • seoDescription: full product names, matches the body
 *
 * The 301 redirect for the old URL is added in next.config.js — deploy it right
 * after running this so old inbound links resolve.
 *
 * Idempotent — safe to re-run (matches either the old or new slug).
 *
 *   heroku run "npx tsx scripts/fixNunaTravelCribPostMeta.ts" -a registrywithtaylor          # dry run
 *   heroku run "npx tsx scripts/fixNunaTravelCribPostMeta.ts --apply" -a registrywithtaylor  # apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const OLD_SLUG = 'slug-nuna-travel-crib-showdown-sena-paal-cove';
const NEW_SLUG = 'nuna-travel-crib-showdown-sena-paal-cove';
const TITLE = 'Nuna Travel Crib Showdown 2026: SENA Aire vs PAAL vs COVE';
const DESCRIPTION =
  'Compare the Nuna SENA Aire, PAAL, and COVE Aire Go travel cribs — footprint, weight, and features — so you can pick the right one for your family.';

async function main() {
  const post =
    (await db.post.findUnique({ where: { slug: OLD_SLUG }, select: { id: true, slug: true, title: true } })) ??
    (await db.post.findUnique({ where: { slug: NEW_SLUG }, select: { id: true, slug: true, title: true } })) ??
    (await db.post.findFirst({
      where: { slug: { contains: 'nuna-travel-crib-showdown' } },
      select: { id: true, slug: true, title: true },
    }));

  if (!post) {
    console.error('✗ Could not find the Nuna travel crib post by slug.');
    process.exit(1);
  }

  console.log(`Found: "${post.title}"  (slug: ${post.slug})`);
  console.log(`Will set → slug: ${NEW_SLUG}`);
  console.log(`          seoTitle/shareTitle: ${TITLE}`);
  console.log(`          seoDescription: ${DESCRIPTION}`);

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write.');
    return;
  }

  await db.post.update({
    where: { id: post.id },
    data: {
      slug: NEW_SLUG,
      seoTitle: TITLE,
      shareTitle: TITLE,
      seoDescription: DESCRIPTION,
    },
  });
  console.log('✓ Updated. Deploy next.config redirect so the old URL 301s to the new one.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect?.());
