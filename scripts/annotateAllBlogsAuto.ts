/**
 * Applies the TMBC brand-signature annotations — ((word)) circles and
 * [[ sentence ]] underlines — to EVERY live (published, non-academy) blog post,
 * automatically and tastefully.
 *
 * Placement mirrors how Taylor hand-annotates: underline the intro thesis and the
 * closing payoff (the last sentence of the first and last prose paragraphs), plus
 * up to one mid-post insight sentence; circle a few evocative "power words" from a
 * curated list, first occurrence only. Density is capped (≤4 circles, ≤3
 * underlines per post) so it reads like a signature, not a highlighter.
 *
 * Safety:
 *   • Only plain prose paragraphs are touched — headings, lists, quotes, tables,
 *     images, links, and ::: styled blocks (incl. polls / product cards) are skipped.
 *   • Posts that already contain any ((…)) or [[ … ]] marker are skipped entirely,
 *     so the three hand-annotated posts and any re-run are left alone (idempotent).
 *   • Academy modules (slug starts with "academy-") are skipped.
 *
 *   npx tsx scripts/annotateAllBlogsAuto.ts            # dry run (per-post preview)
 *   npx tsx scripts/annotateAllBlogsAuto.ts --apply    # writes
 *   npx tsx scripts/annotateAllBlogsAuto.ts --slug=some-post   # one post only
 *   npx tsx scripts/annotateAllBlogsAuto.ts --force    # re-annotate even if markers exist
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run blog:annotate-all-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

/** Evocative, on-brand single words worth circling, in priority order. */
const CIRCLE_WORDS = [
  'overwhelming', 'overwhelmed', 'regret', 'expensive', 'confidence', 'clarity',
  'freedom', 'calm', 'breathe', 'essential', 'essentials', 'sanity', 'lifesaver',
  'honestly', 'prepared', 'flashy', 'practical', 'peace', 'worth', 'favorite',
];

const MAX_CIRCLES = 4;
const MAX_UNDERLINES = 3;

type Block = { start: number; end: number }; // inclusive line indices

/** Is this line non-prose (heading/list/quote/table/image/html/fence marker)? */
function isStructuralLine(line: string): boolean {
  const t = line.trimStart();
  if (t === '') return true;
  return (
    t.startsWith('#') ||
    t.startsWith('>') ||
    t.startsWith('- ') ||
    t.startsWith('* ') ||
    t.startsWith('+ ') ||
    /^\d+[.)]\s/.test(t) ||
    t.startsWith('|') ||
    t.startsWith('!') ||
    t.startsWith(':::') ||
    t.startsWith('```') ||
    t.startsWith('<')
  );
}

/** Collect blank-line-delimited prose blocks that sit OUTSIDE any ::: / ``` fence. */
function proseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let fence = false;
  let cur: number[] = [];
  const flush = () => {
    if (cur.length) blocks.push({ start: cur[0], end: cur[cur.length - 1] });
    cur = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.startsWith(':::') || t.startsWith('```')) {
      flush();
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (isStructuralLine(lines[i])) {
      flush();
      continue;
    }
    cur.push(i);
  }
  flush();
  return blocks;
}

function blockText(lines: string[], b: Block): string {
  return lines.slice(b.start, b.end + 1).join('\n');
}

/** Character ranges already occupied by a ((circle)) or [[ underline ]] marker. */
function markerSpans(line: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  for (const re of [/\(\([^)]*\)\)/g, /\[\[[^\]]*\]\]/g]) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(line))) spans.push([m.index, m.index + m[0].length]);
  }
  return spans;
}

function inSpan(i: number, spans: Array<[number, number]>): boolean {
  return spans.some(([a, b]) => i >= a && i < b);
}

/** Split a paragraph into sentences (keeping terminal punctuation). */
function sentences(text: string): string[] {
  return text
    .replace(/\n/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z“"'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function underlineOk(s: string): boolean {
  if (s.length < 14 || s.length > 120) return false;
  if (/\]|\[|\(\(|`|\||\*/.test(s)) return false; // no brackets, code, pipes, bold/italic
  if (/\]\(/.test(s)) return false; // no links
  if (!/[.!?]$/.test(s)) return false; // must be a full sentence
  return true;
}

/** Sign-off / attribution lines that must never be underlined. */
function isSignoff(s: string): boolean {
  return /taylor-?made baby co|^\s*xoxo|^love,?\s*taylor|^—\s*taylor|^-\s*t\b/i.test(s);
}

export type AnnotateResult = {
  content: string;
  circles: string[];
  underlines: string[];
};

/** Pure transform. Returns annotated content + what landed. */
export function annotate(input: string): AnnotateResult {
  const lines = input.split('\n');
  const blocks = proseBlocks(lines);
  const circles: string[] = [];
  const underlines: string[] = [];

  // ── Underlines: intro thesis + closing payoff + one mid insight ──
  // Candidate = last sentence of a prose block. Prefer first block, last block,
  // then a middle block, without exceeding the cap.
  const order: number[] = [];
  if (blocks.length) order.push(0);
  if (blocks.length > 1) order.push(blocks.length - 1);
  if (blocks.length > 2) order.push(Math.floor(blocks.length / 2));

  for (const bi of order) {
    if (underlines.length >= MAX_UNDERLINES) break;
    const b = blocks[bi];
    const text = blockText(lines, b);
    const sents = sentences(text);
    // Prefer the last clean sentence (thesis / payoff); fall back toward the
    // front of the block if the final one is a sign-off, has markup, etc.
    let candidate: string | null = null;
    for (let si = sents.length - 1; si >= 0; si--) {
      const s = sents[si];
      if (underlineOk(s) && !isSignoff(s) && !underlines.includes(s)) {
        candidate = s;
        break;
      }
    }
    if (!candidate) continue;
    // Wrap that exact sentence within the block.
    const joined = lines.slice(b.start, b.end + 1).join('\n');
    if (!joined.includes(candidate)) continue;
    const wrapped = joined.replace(candidate, `[[ ${candidate} ]]`);
    const newLines = wrapped.split('\n');
    lines.splice(b.start, b.end - b.start + 1, ...newLines);
    underlines.push(candidate);
    // Line count is unchanged (we only replaced text within existing lines).
  }

  // ── Circles: curated power words, first occurrence, prose only ──
  // Placed anywhere outside an existing marker (so a circle can sit in the same
  // paragraph as an underline), skipping any line carrying a link or code span.
  const usedWords = new Set<string>();
  const freshBlocks = proseBlocks(lines); // re-scan after underline edits
  for (const word of CIRCLE_WORDS) {
    if (circles.length >= MAX_CIRCLES) break;
    if (usedWords.has(word)) continue;
    const re = new RegExp(`(?<![\\[\\]\\(\\w])(${word})(?![\\]\\)\\w])`, 'ig');
    let placed = false;
    for (const b of freshBlocks) {
      for (let li = b.start; li <= b.end && !placed; li++) {
        const line = lines[li];
        if (/\]\(|`/.test(line)) continue; // skip lines with links or code
        const spans = markerSpans(line);
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(line))) {
          if (inSpan(m.index, spans)) continue;
          lines[li] = line.slice(0, m.index) + `((${m[1]}))` + line.slice(m.index + m[1].length);
          circles.push(m[1]);
          usedWords.add(word);
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  }

  return { content: lines.join('\n'), circles, underlines };
}

type Post = { id: string; slug: string; title: string; content: string };

async function main() {
  const apply = process.argv.includes('--apply');
  const force = process.argv.includes('--force');
  const slugArg = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

  const where: Record<string, unknown> = { status: 'PUBLISHED' };
  if (slugArg) where.slug = slugArg;

  const posts: Post[] = await db.post.findMany({
    where,
    select: { id: true, slug: true, title: true, content: true },
    orderBy: { slug: 'asc' },
  });

  let changed = 0;
  let skipped = 0;
  console.log(`── Auto-annotate live blogs ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const post of posts) {
    if (post.slug.startsWith('academy-')) { skipped++; continue; }
    const content = post.content ?? '';
    const alreadyAnnotated = /\(\([^()]+\)\)|\[\[\s+[^\]]+\s+\]\]/.test(content);
    if (alreadyAnnotated && !force) {
      console.log(`  · ${post.slug.padEnd(46)} already annotated — skipped`);
      skipped++;
      continue;
    }

    const { content: next, circles, underlines } = annotate(content);
    if (next === content) {
      console.log(`  · ${post.slug.padEnd(46)} no eligible prose — skipped`);
      skipped++;
      continue;
    }

    changed++;
    console.log(`  ✎ ${post.slug.padEnd(46)} ${circles.length} circle · ${underlines.length} underline`);
    for (const c of circles) console.log(`        (( ${c} ))`);
    for (const u of underlines) console.log(`        [[ ${u.length > 70 ? u.slice(0, 67) + '…' : u} ]]`);

    if (apply) {
      await db.post.update({ where: { id: post.id }, data: { content: next } });
    }
  }

  console.log(`\n${apply ? 'Applied' : 'Would annotate'}: ${changed} post(s) · skipped ${skipped}.`);
  if (!apply && changed) console.log('Re-run with --apply to write.');
}

// Only hit the DB when run directly (keeps the pure transform importable for tests).
if (process.argv[1] && /annotateAllBlogsAuto/.test(process.argv[1])) {
  main()
    .catch((err) => {
      console.error('[annotateAllBlogsAuto] failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect?.();
    });
}
