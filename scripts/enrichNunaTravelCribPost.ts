/**
 * AEO-enrich the "Nuna Travel Crib Showdown" post body (per Taylor's brief).
 *
 * Anchored, idempotent insertions into the live post.content — it does NOT
 * replace the whole body, so existing blocks (:::catalog-product, ::cta-slot,
 * images, ((annotations))) are preserved exactly. Re-running is safe: each block
 * is skipped if its marker already exists.
 *
 * Adds: Quick Answer + playard definition + at-a-glance list (top), a topic
 * sentence before each product's bullets, a FAQ section (drives FAQ schema), a
 * "How to Choose" section, and 2 in-body internal links.
 *
 * NOT done here (need real assets / your call): the mid-body lead-magnet box
 * (needs the actual "Nursery Sleep Setup Checklist" download), and self-hosting
 * the Pinterest hero image.
 *
 *   heroku run "npx tsx scripts/enrichNunaTravelCribPost.ts" -a registrywithtaylor          # dry run
 *   heroku run "npx tsx scripts/enrichNunaTravelCribPost.ts --apply" -a registrywithtaylor  # apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const QUICK_ANSWER = `**Quick answer:** The Nuna SENA Aire is the best all-around Nuna travel crib. Best for frequent travel: the PAAL. Best for small bedrooms: the COVE Aire Go.

A travel crib, also called a playard, is a portable sleep and play space for babies that folds down for travel, hotel stays, and use as a secondary crib at home.

**At a glance:**

- **Nuna SENA Aire** — best all-around; standout is the optional diaper changing station. Around $500.
- **Nuna PAAL** — best for frequent travel; the lightest crib in Nuna's lineup. Around $400.
- **Nuna COVE Aire Go** — best for small bedrooms; the narrowest footprint Nuna makes. Around $400.

`;

const FAQ_HOWTO = `## Frequently Asked Questions

### What is the best Nuna travel crib?

The Nuna SENA Aire is the best all-around travel crib. It's dependable for both home and travel use, and it's the only Nuna travel crib with an optional changing station.

### Which Nuna travel crib is the lightest?

The Nuna PAAL is the lightest travel crib in Nuna's lineup, making it the best choice for families who travel frequently.

### What's the difference between the SENA Aire, PAAL, and COVE Aire Go?

The SENA Aire is the dependable all-around option with an optional changing station. The PAAL is the lightest and most travel-friendly. The COVE Aire Go has the smallest footprint, making it best for small bedrooms.

### Can a Nuna travel crib be used as a primary crib?

Yes. All three Nuna travel cribs — SENA Aire, PAAL, and COVE Aire Go — can serve as a primary sleep space at home, not just for travel.

### Are Nuna travel cribs worth the price?

Nuna travel cribs cost around $350 to $500, which mostly reflects the brand name, premium materials, and design rather than dramatically different safety or function compared to other well-designed travel cribs at lower price points.

### Which Nuna travel crib is best for small bedrooms or apartments?

The COVE Aire Go is the best choice for small bedrooms. It has the smallest footprint in Nuna's lineup, about six inches narrower than the SENA Aire.

## How to Choose a Nuna Travel Crib

1. **Decide how you'll use it most.** If it'll be a true do-everything playard at home and on trips, start with the SENA Aire.
2. **Check how often you actually travel.** If you're flying or driving to new locations often, prioritize the PAAL's lighter weight over other features.
3. **Measure your bedroom space first.** If floor space next to your bed is limited, the COVE Aire Go's narrower footprint solves that problem directly.
4. **Decide if you want a built-in changing station.** Only the SENA Aire offers this as an add-on — factor that into the price comparison if you were planning to buy a separate changing pad.
5. **Compare against your full budget, not just the crib.** Nuna travel cribs run $350 to $500; weigh that against your stroller, car seat, and crib budget before deciding if a premium travel crib is the right allocation.

`;

// Per-product topic sentence, inserted right before each product's first bullet.
const TOPIC_SENTENCES: Array<{ anchor: string; sentence: string }> = [
  {
    anchor: '- **Advanced Air Design™ mesh**',
    sentence:
      "The SENA Aire wins on everyday dependability, offering the only removable changing station in Nuna's travel crib lineup.",
  },
  {
    anchor: '- **Lightest Nuna travel crib**',
    sentence:
      'The PAAL wins on portability, built specifically for families who move between homes, hotels, and destinations often.',
  },
  {
    anchor: "- **Smallest footprint in Nuna's lineup**",
    sentence:
      "The COVE Aire Go wins on space efficiency, fitting into bedrooms and apartments where a full-size playard wouldn't.",
  },
];

function enrich(content: string): { next: string; changes: string[] } {
  let out = content;
  const changes: string[] = [];

  // 1. Quick Answer + definition + at-a-glance, before the opening anecdote.
  const anecdote = "If you've ever tried to assemble a travel crib";
  if (!out.includes('**Quick answer:**') && out.includes(anecdote)) {
    out = out.replace(anecdote, `${QUICK_ANSWER}${anecdote}`);
    changes.push('added Quick Answer + definition + at-a-glance');
  }

  // 2. Per-product topic sentences (before at-a-glance-collision-safe: run on the
  //    ORIGINAL bullet anchors, which are unique inside each product section).
  for (const { anchor, sentence } of TOPIC_SENTENCES) {
    if (out.includes(sentence)) continue;
    const idx = out.indexOf(anchor);
    if (idx === -1) {
      changes.push(`! anchor not found for topic sentence: ${anchor}`);
      continue;
    }
    out = out.slice(0, idx) + `${sentence}\n\n` + out.slice(idx);
    changes.push(`added topic sentence before "${anchor.slice(0, 28)}…"`);
  }

  // 3. FAQ + How-to, immediately before the Verdict.
  if (!out.includes('## Frequently Asked Questions') && out.includes('## Verdict')) {
    out = out.replace('## Verdict', `${FAQ_HOWTO}## Verdict`);
    changes.push('added FAQ + How-to sections');
  }

  // 4. In-body internal links.
  if (out.match(/^- a stroller\s*$/m)) {
    out = out.replace(/^- a stroller\s*$/m, '- [a stroller](/blog/best-travel-strollers-2026)  ');
    changes.push('linked "a stroller" → best-travel-strollers-2026');
  }
  if (out.includes('overall baby gear strategy') && !out.includes('[baby gear strategy]')) {
    out = out.replace('overall baby gear strategy', 'overall [baby gear strategy](/blog/taylors-registry-essentials)');
    changes.push('linked "baby gear strategy" → taylors-registry-essentials');
  }

  return { next: out, changes };
}

async function main() {
  const post =
    (await db.post.findFirst({
      where: { slug: { contains: 'nuna-travel-crib-showdown' } },
      select: { id: true, slug: true, title: true, content: true },
    }));
  if (!post) {
    console.error('✗ Nuna travel crib post not found.');
    process.exit(1);
  }
  console.log(`Found: "${post.title}" (slug: ${post.slug})`);

  const { next, changes } = enrich(post.content);
  if (!changes.length) {
    console.log('Nothing to change (already enriched, or anchors missing).');
    return;
  }
  console.log('\nChanges:');
  changes.forEach((c) => console.log(`  • ${c}`));
  console.log(`\nContent length: ${post.content.length} → ${next.length}`);

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write.');
    return;
  }
  await db.post.update({ where: { id: post.id }, data: { content: next } });
  console.log('\n✓ Post content updated.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect?.());
