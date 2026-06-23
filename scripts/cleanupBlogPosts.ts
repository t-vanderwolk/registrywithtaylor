/**
 * Keep the public /blog route clean: archive the older seed posts that now
 * overlap with the pillar Journal posts, and de-dupe any pillar title that
 * somehow exists under a non-canonical slug. Archived posts (status ARCHIVED +
 * published false) drop out of every public query but are not deleted.
 *
 *   npx tsx scripts/cleanupBlogPosts.ts --dry-run   # preview, no writes
 *   npx tsx scripts/cleanupBlogPosts.ts             # apply
 *
 * Run against prod:
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run blog:cleanup-dry
 */
import prisma from '@/lib/server/prisma';

// Older seed posts superseded by the pillar posts → archive + unpublish.
const RETIRED_TITLES = [
  'Nursery Setup That Actually Works', // → Nursery Foundations
  'Gear Decisions Without Guesswork', //  → The Stroller Equation
];

// The canonical pillar posts: title must live at exactly this slug.
const CANONICAL = [
  { title: 'The Art of the Registry', slug: 'the-art-of-the-registry' },
  { title: 'Nursery Foundations', slug: 'nursery-foundations' },
  { title: 'The Stroller Equation', slug: 'the-stroller-equation' },
];

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const retire: Array<{ id: string; title: string; slug: string; reason: string }> = [];

  // 1) Retire the superseded seed posts.
  for (const title of RETIRED_TITLES) {
    const matches = await prisma.post.findMany({
      where: { title },
      select: { id: true, title: true, slug: true },
    });
    for (const m of matches) retire.push({ ...m, reason: 'superseded by a pillar post' });
  }

  // 2) De-dupe canonical pillar titles: archive any same-title post whose slug
  //    isn't the canonical one (keeps the pillar version as the single source).
  for (const c of CANONICAL) {
    const dupes = await prisma.post.findMany({
      where: { title: c.title, NOT: { slug: c.slug } },
      select: { id: true, title: true, slug: true },
    });
    for (const d of dupes) retire.push({ ...d, reason: `duplicate of ${c.slug}` });
  }

  if (retire.length === 0) {
    console.log('Blog is clean — no overlapping or duplicate posts found.');
    return;
  }

  console.log(`${dryRun ? '[dry run] would archive' : 'Archiving'} ${retire.length} post(s):`);
  for (const r of retire) console.log(`  - "${r.title}" (${r.slug}) — ${r.reason}`);

  if (dryRun) {
    console.log('\n(dry run — no writes)');
    return;
  }

  for (const r of retire) {
    await prisma.post.update({
      where: { id: r.id },
      data: { status: 'ARCHIVED', published: false },
    });
  }
  console.log('\nDone. Those posts are archived and hidden from /blog (not deleted).');
}

main()
  .catch((error) => {
    console.error('[cleanupBlogPosts] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
