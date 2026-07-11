/**
 * Adds the TMBC brand-signature annotations to the live "blog-best-compact-strollers-2026"
 * post body: (( word )) circles and [[ sentence ]] underlines — the same markers the
 * marketing pages and the registry-essentials post use. The blog renderer understands
 * `((word))` (circle) and `[[ sentence ]]` (underline, inner spaces required) inside
 * body paragraphs.
 *
 * Each edit anchors on surrounding context so it matches exactly one spot, and only the
 * highlighted word/phrase is wrapped — apostrophes and everything else are preserved.
 * Matching is apostrophe-tolerant (straight vs curly). Idempotent: an already-wrapped
 * highlight is skipped, and once a marker is inserted the surrounding context no longer
 * matches, so re-running is a no-op.
 *
 *   npx tsx scripts/annotateCompactStrollers.ts            # dry run (shows what lands)
 *   npx tsx scripts/annotateCompactStrollers.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/annotateCompactStrollers.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'blog-best-compact-strollers-2026';
const APPLY = process.argv.includes('--apply');

type Edit = {
  before: string;
  highlight: string;
  after: string;
  type: 'circle' | 'underline';
  note: string;
};

/** The brand-voice moments to annotate, in document order. */
export const EDITS: Edit[] = [
  { before: '', highlight: 'In real life.', after: '', type: 'underline', note: 'intro — real life' },
  { before: 'over ', highlight: 'coffee', after: '.', type: 'circle', note: 'intro — over coffee' },
  {
    before: 'overwhelmed, ',
    highlight: "you're not alone",
    after: '.',
    type: 'underline',
    note: 'intro — not alone',
  },
  { before: 'like a ', highlight: 'compromise', after: '.', type: 'circle', note: 'not a compromise' },
  {
    before: '',
    highlight: 'Lightweight without feeling flimsy.',
    after: '',
    type: 'underline',
    note: 'Breez — flimsy',
  },
  { before: 'not the ', highlight: 'flashiest', after: ' stroller', type: 'circle', note: 'Thule — flashiest' },
  { before: 'you ', highlight: 'expand', after: ' it', type: 'circle', note: 'Peg Perego — expand it' },
  {
    before: 'the one that ',
    highlight: 'disappears into your routine',
    after: '.',
    type: 'underline',
    note: 'how to choose — disappears',
  },
  { before: '', highlight: "They're supporting it.", after: '', type: 'underline', note: 'final — supporting it' },
  { before: 'the one that ', highlight: 'quietly', after: ' makes', type: 'circle', note: 'final — quietly' },
  { before: '', highlight: 'Start there.', after: '', type: 'underline', note: 'closing line' },
];

const APOS = /['‘’ʼ]/g;
const APOS_CLASS = "['‘’ʼ]";

/** Escape regex specials, then make any apostrophe match all common glyphs. */
function flex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(APOS, APOS_CLASS);
}

function wrap(type: Edit['type']): string {
  // $1 = before, $2 = highlight, $3 = after — all preserved from the match.
  return type === 'circle' ? '$1(($2))$3' : '$1[[ $2 ]]$3';
}

export type EditResult = { content: string; applied: Edit[]; skipped: Edit[] };

/** Pure transform. Applies each edit's first match; reports which landed. */
export function applyAnnotations(input: string): EditResult {
  let content = input;
  const applied: Edit[] = [];
  const skipped: Edit[] = [];
  for (const edit of EDITS) {
    // Idempotency guard: if this highlight is already wrapped, leave it alone.
    // Apostrophe-tolerant so a curly-quote highlight isn't re-wrapped.
    const markerRe =
      edit.type === 'circle'
        ? new RegExp(`\\(\\(${flex(edit.highlight)}\\)\\)`)
        : new RegExp(`\\[\\[ ${flex(edit.highlight)} \\]\\]`);
    if (markerRe.test(content)) {
      skipped.push(edit);
      continue;
    }
    const re = new RegExp(`(${flex(edit.before)})(${flex(edit.highlight)})(${flex(edit.after)})`);
    if (!re.test(content)) {
      skipped.push(edit);
      continue;
    }
    content = content.replace(re, wrap(edit.type));
    applied.push(edit);
  }
  return { content, applied, skipped };
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
  const { content: next, applied, skipped } = applyAnnotations(content);

  console.log(`Post: ${post.title} (${post.slug})`);
  console.log(`\nAnnotations applied: ${applied.length}/${EDITS.length}`);
  for (const e of applied) {
    const marked = e.type === 'circle' ? `(( ${e.highlight} ))` : `[[ ${e.highlight} ]]`;
    console.log(`  ✓ ${e.note.padEnd(28)} ${marked}`);
  }
  if (skipped.length) {
    console.log('\nSkipped (already annotated or text changed on the live post):');
    for (const e of skipped) console.log(`  – ${e.note.padEnd(28)} "${e.highlight}"`);
  }

  if (next === content) {
    console.log('\nNothing to change — post is already annotated.');
    return;
  }

  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content: next } });
  console.log(`\n✓ Applied. Annotated "${post.slug}" with ${applied.length} markers.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
