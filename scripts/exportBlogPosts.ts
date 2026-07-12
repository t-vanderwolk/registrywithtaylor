/**
 * Dump every published blog post (slug, title, category, full markdown content)
 * to a JSON file so per-post interactive blocks + ((word))/[[sentence]]
 * annotations can be crafted from the real text, then re-applied with a
 * migration. Read-only — never writes to the DB.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run blog:export
 *
 * Writes to: exports/blog-posts.json  (relative to repo root)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const OUT = resolve(process.cwd(), 'exports', 'blog-posts.json');

type Row = {
  slug: string;
  title: string;
  category: string | null;
  status: string;
  content: string;
  updatedAt: Date;
};

async function main() {
  const rows: Row[] = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, title: true, category: true, status: true, content: true, updatedAt: true },
    orderBy: [{ category: 'asc' }, { slug: 'asc' }],
  });

  const posts = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    category: r.category ?? null,
    isAcademy: r.slug.startsWith('academy-'),
    updatedAt: r.updatedAt,
    // Flags so I can see at a glance what's already been enriched.
    hasPoll: /:::poll/.test(r.content),
    hasThisOrThat: /:::thisorthat/.test(r.content),
    hasCircleAnnotation: /\(\([^()]+\)\)/.test(r.content),
    hasUnderlineAnnotation: /\[\[[^\][]+\]\]/.test(r.content),
    contentLength: r.content.length,
    content: r.content,
  }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ exportedAt: new Date().toISOString(), count: posts.length, posts }, null, 2));

  console.log(`── Exported ${posts.length} published post(s) → exports/blog-posts.json ──\n`);
  const nonAcademy = posts.filter((p) => !p.isAcademy);
  console.log(`  public blog posts (non-academy): ${nonAcademy.length}`);
  console.log(`  academy modules:                 ${posts.length - nonAcademy.length}\n`);
  console.log('  slug'.padEnd(52), 'poll  tot  ((..))  [[..]]');
  for (const p of nonAcademy) {
    console.log(
      `  ${p.slug.padEnd(50)}`,
      `${p.hasPoll ? ' ✓ ' : ' · '}  ${p.hasThisOrThat ? ' ✓ ' : ' · '}  ${p.hasCircleAnnotation ? '  ✓  ' : '  ·  '}  ${p.hasUnderlineAnnotation ? ' ✓' : ' ·'}`,
    );
  }
}

main()
  .catch((error) => {
    console.error('[exportBlogPosts] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
