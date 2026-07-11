/**
 * Adds the TMBC brand-signature annotations to the live "taylors-registry-essentials"
 * post body: (( word )) circles and [[ sentence ]] underlines, the same markers the
 * marketing pages use. The blog renderer (components/blog/PostContent.tsx) already
 * understands `((word))` (circle) and `[[ sentence ]]` (underline, inner spaces
 * required) inside body paragraphs.
 *
 * Each edit anchors on surrounding context so it matches exactly one spot, and only
 * the highlighted word/phrase is wrapped — apostrophes and everything else are
 * preserved. Matching is apostrophe-tolerant (straight vs curly) so it works no
 * matter which glyph the stored content uses. Naturally idempotent: once a marker is
 * inserted the surrounding context no longer matches, so re-running is a no-op.
 *
 *   npx tsx scripts/annotateRegistryEssentials.ts            # dry run (shows a diff)
 *   npx tsx scripts/annotateRegistryEssentials.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/annotateRegistryEssentials.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'taylors-registry-essentials';
const APPLY = process.argv.includes('--apply');

type Edit = {
  /** Literal text immediately before the highlight (anchors uniqueness). */
  before: string;
  /** The exact word/phrase to wrap. */
  highlight: string;
  /** Literal text immediately after the highlight (anchors uniqueness). */
  after: string;
  /** circle => ((highlight)) ; underline => [[ highlight ]] */
  type: 'circle' | 'underline';
  /** Human note for the dry-run log. */
  note: string;
};

/** The brand-voice moments to annotate, in document order. */
export const EDITS: Edit[] = [
  { before: 'learned something ', highlight: 'surprising', after: ':', type: 'circle', note: 'intro hook' },
  {
    before: "They're ",
    highlight: 'the products that make everyday life easier',
    after: '.',
    type: 'underline',
    note: 'intro thesis',
  },
  { before: 'the ', highlight: 'flashy', after: ' ones', type: 'circle', note: 'not the flashy ones' },
  { before: '', highlight: 'Parents do.', after: '', type: 'underline', note: 'mini-crib TMBC take' },
  { before: 'like buying ', highlight: 'shoes', after: ' for someone', type: 'circle', note: 'bottle-box analogy' },
  { before: '', highlight: 'Your back will thank you.', after: '', type: 'underline', note: 'bath stand payoff' },
  { before: "It's ", highlight: 'freedom', after: '.', type: 'circle', note: 'carrier = freedom' },
  { before: 'Because ', highlight: 'confidence', after: " doesn't", type: 'circle', note: 'real-secret confidence' },
  {
    before: "It's ",
    highlight: 'the one that helps your family feel prepared',
    after: '.',
    type: 'underline',
    note: 'real-secret prepared',
  },
  { before: '', highlight: 'Start with confidence.', after: '', type: 'underline', note: 'closing line' },
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
    const marker = edit.type === 'circle' ? `((${edit.highlight}))` : `[[ ${edit.highlight} ]]`;
    if (content.includes(marker)) {
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
    console.log(`  ✓ ${e.note.padEnd(26)} ${marked}`);
  }
  if (skipped.length) {
    console.log('\nSkipped (already annotated or text changed on the live post):');
    for (const e of skipped) console.log(`  – ${e.note.padEnd(26)} "${e.highlight}"`);
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
