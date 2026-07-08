/**
 * Demo the TMBC blog signature on best-travel-strollers-2026:
 *   • circle a few key words with ((word))
 *   • drop an interactive :::poll after the intro
 *
 * Idempotent: skips words already circled and won't add a second poll.
 *
 *   npx tsx scripts/demoBlogSignature.ts            # dry run
 *   npx tsx scripts/demoBlogSignature.ts --apply    # writes
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/demoBlogSignature.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SLUG = 'best-travel-strollers-2026';
const APPLY = process.argv.includes('--apply');

// First-occurrence circles (only applied if the plain word is present + not yet circled).
const CIRCLE_WORDS = ['movement', 'effortless', 'compact fold'];

const POLL = [
  ':::poll',
  'Question: What matters most in your travel stroller?',
  'Option: The lightest possible fold',
  'Option: The easiest to live with day to day',
  'Option: Newborn-ready from day one',
  'Option: Best bang for the buck',
  ':::',
].join('\n');

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { id: true, slug: true, title: true, content: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}". Aborting.`);
    process.exit(1);
  }

  let content: string = post.content ?? '';
  const notes: string[] = [];

  // 1) Circle a few words (first occurrence, word-boundary, skip if already circled).
  for (const word of CIRCLE_WORDS) {
    if (content.includes(`((${word}))`)) {
      notes.push(`• "${word}" already circled — skipped.`);
      continue;
    }
    const re = new RegExp(`(?<!\\()\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(content)) {
      content = content.replace(re, (m) => `((${m}))`);
      notes.push(`• Circled "${word}".`);
    } else {
      notes.push(`• "${word}" not found — skipped.`);
    }
  }

  // 2) Insert the poll just before the first product section, if not already present.
  if (content.includes(':::poll')) {
    notes.push('• Poll already present — skipped.');
  } else {
    const anchor = '## Best Overall Travel Stroller';
    const idx = content.indexOf(anchor);
    if (idx >= 0) {
      content = `${content.slice(0, idx)}${POLL}\n\n${content.slice(idx)}`;
      notes.push(`• Inserted poll before "${anchor}".`);
    } else {
      notes.push('• Poll anchor not found — poll NOT inserted.');
    }
  }

  const changed = content !== (post.content ?? '');

  console.log('════════════════════════════════════════');
  console.log(`Post: ${post.title} (${post.slug})`);
  console.log('\n' + notes.join('\n'));

  if (!changed) {
    console.log('\nNothing to change.');
    return;
  }
  if (!APPLY) {
    console.log('\nDRY RUN — no changes written. Re-run with --apply to save.');
    return;
  }

  await db.post.update({ where: { id: post.id }, data: { content } });
  console.log(`\n✓ Applied signature demo to "${post.slug}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
