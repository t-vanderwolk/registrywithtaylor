/**
 * Remove ((circled)) word markers from a post (unwraps to the plain word).
 * Leaves polls and all other content intact. Defaults to the travel post.
 *
 *   npx tsx scripts/uncircleBlogPost.ts [slug]            # dry run
 *   npx tsx scripts/uncircleBlogPost.ts [slug] --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/uncircleBlogPost.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const APPLY = process.argv.includes('--apply');
const SLUG = process.argv.find((a) => !a.startsWith('--') && !a.includes('/') && a !== 'tsx' && !a.endsWith('.ts')) ?? 'best-travel-strollers-2026';

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const before: string = post.content ?? '';
  const matches = before.match(/\(\(([^)]+)\)\)/g) ?? [];
  const after = before.replace(/\(\(([^)]+)\)\)/g, '$1');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`Circled words removed: ${matches.length}`);
  if (matches.length) console.log('  ' + matches.join(', '));

  if (after === before) {
    console.log('\nNothing to change.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: after } });
  console.log(`\n✓ Un-circled all words on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
