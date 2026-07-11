/**
 * Adds the TMBC brand-signature annotations to the live "baby-gear-released-2026-so-far"
 * roundup: (( word )) circles and [[ sentence ]] underlines. Because this post is a long
 * product roundup, the annotations land in the intro, the section-transition essays, and
 * the closing "Bigger Picture" reflection — not on the 30+ product blurbs.
 *
 * The blog renderer understands `((word))` (circle) and `[[ sentence ]]` (underline, inner
 * spaces required) inside body paragraphs. Each edit anchors on surrounding context so it
 * matches exactly one spot, and only the highlight is wrapped — everything else, including
 * apostrophes, is preserved. Matching + the idempotency guard are apostrophe-tolerant
 * (straight vs curly), so re-running is a safe no-op.
 *
 *   npx tsx scripts/annotateBabyGear2026.ts            # dry run (shows what lands)
 *   npx tsx scripts/annotateBabyGear2026.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/annotateBabyGear2026.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'baby-gear-released-2026-so-far';
const APPLY = process.argv.includes('--apply');

type Edit = {
  before: string;
  highlight: string;
  after: string;
  type: 'circle' | 'underline';
  note: string;
};

/** Brand-voice moments to annotate, in document order. */
export const EDITS: Edit[] = [
  { before: 'made me stop ', highlight: 'scrolling', after: '.', type: 'circle', note: 'intro — stop scrolling' },
  { before: '', highlight: "They're worth knowing about.", after: '', type: 'underline', note: 'intro — worth knowing' },
  { before: "definitely isn't ", highlight: 'sponsored', after: '.', type: 'circle', note: 'before we jump in — sponsored' },
  { before: '', highlight: 'Bookmark this page.', after: '', type: 'underline', note: 'before we jump in — bookmark' },
  { before: 'or ', highlight: 'flashy', after: ' new features', type: 'circle', note: 'full-size — flashy' },
  {
    before: "They're ",
    highlight: 'redefining what an everyday stroller can be',
    after: '.',
    type: 'underline',
    note: 'bigger story — redefining',
  },
  { before: 'building ', highlight: 'ecosystems', after: '.', type: 'circle', note: 'bigger trend — ecosystems' },
  {
    before: "It's ",
    highlight: 'making life with a baby feel just a little easier',
    after: '.',
    type: 'underline',
    note: 'bigger picture — easier',
  },
  { before: 'becoming an ', highlight: 'appliance', after: '.', type: 'circle', note: 'what I see — appliance' },
  {
    before: 'prove that ',
    highlight: "compact doesn't have to mean basic",
    after: '.',
    type: 'underline',
    note: 'travel grew up — not basic',
  },
  { before: 'They were ', highlight: 'practical', after: '.', type: 'circle', note: 'convenience — practical' },
  {
    before: '',
    highlight: 'Those little improvements add up.',
    after: '',
    type: 'underline',
    note: 'convenience — add up',
  },
  { before: 'The ', highlight: 'trick', after: ' is knowing', type: 'circle', note: 'closing — the trick' },
  { before: 'so much ', highlight: 'fun', after: ' to follow', type: 'circle', note: 'closing — fun to follow' },
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
    console.log(`  ✓ ${e.note.padEnd(32)} ${marked}`);
  }
  if (skipped.length) {
    console.log('\nSkipped (already annotated or text changed on the live post):');
    for (const e of skipped) console.log(`  – ${e.note.padEnd(32)} "${e.highlight}"`);
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
