/**
 * Normalizes the heading *hierarchy* of a public blog post's markdown body to the
 * TMBC canonical structure (see docs/blog-canonical-structure.md), WITHOUT changing
 * any heading wording, the title, prose, product cards, or metadata/SEO.
 *
 * Two safe, idempotent transforms:
 *   1. Sub-block headings demoted `## -> ###` for the recurring labels that belong
 *      under a product/topic section (TMBC Take, Taylor's Top Pick[s], Pros, Cons,
 *      Highlights, Quick Specs, Why It Wins/Matters).
 *   2. FAQ questions demoted `## -> ###` inside the "Frequently Asked Questions"
 *      section. This ALSO repairs the FAQPage schema, which only extracts questions
 *      written as `### ` (see lib/blog/contentText.ts extractFaqEntries).
 *
 * Dry-run prints a before/after heading outline. Pilot slug: taylors-registry-essentials.
 *
 *   npx tsx scripts/normalizeBlogStructure.ts            # dry run (outline + diff)
 *   npx tsx scripts/normalizeBlogStructure.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/normalizeBlogStructure.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1] ?? 'taylors-registry-essentials';
const APPLY = process.argv.includes('--apply');

/** Recurring sub-block labels that must sit at H3 under a product/topic H2. */
const SUBBLOCK_LABELS = [
  'TMBC Take',
  "Taylor's Top Picks",
  "Taylor's Top Pick",
  'Pros',
  'Cons',
  'Highlights',
  'Quick Specs',
  'Why It Wins',
  'Why It Matters',
];

const APOS = /['‘’ʼ]/g;
const APOS_CLASS = "['‘’ʼ]";

function flex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(APOS, APOS_CLASS);
}

/** 1. Demote recurring sub-block headings `## Label` -> `### Label` (wording kept). */
function demoteSubblocks(content: string): string {
  let out = content;
  for (const label of SUBBLOCK_LABELS) {
    out = out.replace(new RegExp(`^([ \\t]*)## (${flex(label)})[ \\t]*$`, 'gm'), '$1### $2');
  }
  return out;
}

/** 2. Inside the FAQ section, demote question headings `## ...?` -> `### ...?`. */
function demoteFaqQuestions(content: string): string {
  let inFaq = false;
  return content
    .split('\n')
    .map((raw) => {
      const line = raw.trim();
      if (line.startsWith('## ')) {
        if (/^##\s+(faq|frequently asked questions)/i.test(line)) {
          inFaq = true;
          return raw;
        }
        if (inFaq && /\?\s*$/.test(line)) {
          return raw.replace(/^(\s*)##\s+/, '$1### ');
        }
        // A real new section heading ends the FAQ region.
        inFaq = false;
        return raw;
      }
      return raw;
    })
    .join('\n');
}

export function normalizeStructure(content: string): string {
  return demoteFaqQuestions(demoteSubblocks(content));
}

/** A compact heading outline (level + text) for the dry-run diff. */
function outline(content: string): string[] {
  return content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^#{1,3}\s/.test(l))
    .map((l) => {
      const level = (l.match(/^#+/) ?? ['#'])[0].length;
      return `${'  '.repeat(level - 1)}${'#'.repeat(level)} ${l.replace(/^#+\s+/, '')}`;
    });
}

async function main() {
  const post = await db.post.findFirst({
    where: { slug: SLUG },
    select: { id: true, slug: true, title: true, content: true },
  });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }
  const content: string = post.content ?? '';
  const next = normalizeStructure(content);

  console.log(`Post: ${post.title} (${post.slug})\n`);

  const before = outline(content);
  const after = outline(next);
  const changed = before.filter((b, i) => b !== after[i]);

  console.log(`Heading changes: ${changed.length}`);
  before.forEach((b, i) => {
    if (b !== after[i]) console.log(`  ${b.trim()}  ->  ${after[i]?.trim()}`);
  });

  // Disclosure position check (report only; not moved in the pilot).
  const discIdx = next.split('\n').findIndex((l) => /some links in this article are affiliate links/i.test(l));
  console.log(`\nAffiliate disclosure: ${discIdx === -1 ? 'NOT FOUND' : `line ${discIdx + 1}`}`);

  if (next === content) {
    console.log('\nNothing to change — post structure already normalized.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }
  await db.post.update({ where: { id: post.id }, data: { content: next } });
  console.log(`\n✓ Applied. Normalized heading hierarchy on "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
