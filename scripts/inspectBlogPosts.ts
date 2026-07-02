/**
 * Diagnose (and optionally unpublish) blog posts that return a 5xx in Search
 * Console. It prints each post's status/date fields and content shape, then
 * reproduces the public read path (getPublicBlogPostBySlug) so any render-time
 * exception shows up with its exact message — that is the thing crashing the
 * /blog/[slug] route on the live site.
 *
 * Read-only by default. Pass --unpublish --apply to set the given posts to DRAFT
 * (they will then 404 cleanly instead of erroring).
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run blog:inspect
 *   # optional, after confirming they are junk:
 *   DB=... npm run blog:unpublish-apply
 *
 *   npx tsx scripts/inspectBlogPosts.ts slug-a slug-b        # inspect specific slugs
 */
import prisma from '@/lib/server/prisma';
import { getPublicBlogPostBySlug } from '@/lib/server/publicBlog';

const DEFAULT_SLUGS = [
  'mentor-doula-partnership',
  'mentor-salons-preview',
  'registry-color-story',
];

function jsonParseable(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const unpublish = args.includes('--unpublish');
  const apply = args.includes('--apply');
  const slugs = args.filter((a) => !a.startsWith('--'));
  const targets = slugs.length ? slugs : DEFAULT_SLUGS;

  console.log(`── Blog post diagnostics ──  (${unpublish ? (apply ? 'UNPUBLISH/apply' : 'unpublish/dry-run') : 'inspect'})\n`);

  for (const slug of targets) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        status: true,
        published: true,
        publishedAt: true,
        scheduledFor: true,
        createdAt: true,
        updatedAt: true,
        content: true,
        authorId: true,
        featuredImageId: true,
        authorships: { select: { userId: true } },
      },
    });

    console.log(`== ${slug} ==`);
    if (!raw) {
      console.log('   not in DB (Google is crawling a stale URL — safe to ignore or redirect)\n');
      continue;
    }

    const content: string = raw.content ?? '';
    console.log(`   id:            ${raw.id}`);
    console.log(`   title:         ${raw.title}`);
    console.log(`   status:        ${raw.status}   published:${raw.published}`);
    console.log(`   publishedAt:   ${raw.publishedAt ? raw.publishedAt.toISOString() : 'null'}`);
    console.log(`   scheduledFor:  ${raw.scheduledFor ? raw.scheduledFor.toISOString() : 'null'}`);
    console.log(`   createdAt:     ${raw.createdAt ? raw.createdAt.toISOString() : 'NULL (!)'} `);
    console.log(`   updatedAt:     ${raw.updatedAt ? raw.updatedAt.toISOString() : 'NULL (!)'} `);
    console.log(`   authorId:      ${raw.authorId ?? 'null'}   authorships:${raw.authorships.length}`);
    console.log(`   featuredImage: ${raw.featuredImageId ?? 'null'}`);
    console.log(`   content:       ${content.length} chars   JSON-parseable:${jsonParseable(content)}`);
    console.log(`   content head:  ${JSON.stringify(content.slice(0, 90))}`);

    // Reproduce the public render path — this is what the live route runs.
    try {
      const record = await getPublicBlogPostBySlug(slug);
      console.log(`   public read:   ${record ? 'OK (renders — returns a record)' : 'returns null → route 404s (fine)'}`);
    } catch (error) {
      console.log(`   public read:   THREW → this is the 5xx cause: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (unpublish && apply) {
      await prisma.post.update({ where: { id: raw.id }, data: { status: 'DRAFT', published: false } });
      console.log('   → set to DRAFT (will 404 now)');
    }
    console.log('');
  }

  if (unpublish && !apply) console.log('(unpublish dry run — re-run with --apply to set these to DRAFT.)');
}

main()
  .catch((error) => {
    console.error('[inspectBlogPosts] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
