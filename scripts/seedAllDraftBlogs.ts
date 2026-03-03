import prisma from '@/lib/server/prisma';

type DraftPostSeed = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string;
};

const draftPosts: DraftPostSeed[] = [
  {
    title: 'Nursery Setup That Actually Works',
    slug: 'nursery-setup-that-actually-works',
    excerpt:
      'A practical framework for designing a nursery around real routines, safe flow, and products that support daily life.',
    category: 'Nursery & Home',
    content: `# Nursery Setup That Actually Works

A beautiful nursery is wonderful. A functional nursery is life-changing. The goal is not just a polished room, but a space that supports your real rhythm once baby arrives.

## Start With How You Live

Before choosing furniture, map your routines. Where will diaper changes happen? Where will feeding supplies live? What path will you walk half-asleep at 2 a.m.?

Daily flow should shape the setup, not the other way around.

## Design the Layout, Not Just the Look

Treat the nursery like a system with clear zones:
- Sleep zone
- Change-and-care zone
- Feeding-and-soothing zone
- Storage zone

When movement between zones is natural, the room feels calmer and more supportive.

## Safety Without Anxiety

Safety planning should feel clear, not fear-driven. Focus on high-impact fundamentals:
- Stable furniture anchoring
- Safe sleep setup
- Cord and outlet awareness
- Simple product choices you can use consistently

## Build for Growth

Choose items that adapt as your baby grows. Think beyond the newborn phase and avoid expensive one-stage decisions when a flexible option will serve longer.`,
  },
  {
    title: 'Gear Decisions Without Guesswork',
    slug: 'gear-decisions-without-guesswork',
    excerpt:
      'A clearer way to evaluate strollers, car seats, and everyday gear systems with confidence instead of overwhelm.',
    category: 'Gear & Safety',
    content: `# Gear Decisions Without Guesswork

Gear decisions feel high-stakes because they are tied to safety, budget, and daily quality of life. The right framework makes those decisions clear and manageable.

## Understand the Use Case First

Start with context, not products. Your ideal gear depends on where and how you live:
- City sidewalks or suburban errands
- Single-story or walk-up living
- Frequent car travel or mostly neighborhood movement

Use case determines what matters.

## Evaluate Features Through Function

Ask:
- Does this improve safety in a meaningful way?
- Does this make daily routines easier?
- Will this still serve us in six to twelve months?

If the answer is no, it is noise.

## Think in Systems

Strollers, car seats, carriers, and home touchpoints should work together as one system. Compatibility, transition ease, and storage reality matter more than standalone hype.

## Commit With Clarity

Prepared families are not the ones with the most products. They are the ones with the clearest plan.`,
  },
  {
    title: 'The Art of the Registry',
    slug: 'the-art-of-the-registry',
    excerpt:
      'How to prepare for baby without overbuying, overspending, or building a registry around noise instead of need.',
    category: 'Registry Planning',
    content: `# The Art of the Registry

Baby prep can feel loud, fast, and full of pressure. A thoughtful registry brings the process back to what matters most: real needs, real routines, and real confidence.

## Start With Clarity, Not Categories

Most registry overwhelm starts when you open a giant list and try to fill every box. Instead, begin with your life: your space, your schedule, your support system, and how you want your days to feel.

## Buy for Life, Not for Lists

The strongest registry choices are not always the trendiest. They are the items you will actually use repeatedly, clean easily, store well, and trust during long days and tired nights.

## Understand Before You Add

Ask:
- What problem does this solve?
- How often will we use it?
- Does this fit our home and routines?
- Is there a safer, simpler, or longer-lasting option?

## The Calm Registry Framework

Define your essential daily systems, prioritize what you need now versus later, and select intentionally. You do not need everything. You need what fits your family well.`,
  },
  {
    title: 'Nuna SENA vs PAAL vs COVE - 2026 Comparison Guide',
    slug: 'nuna-sena-vs-paal-vs-cove-2026-comparison-guide',
    excerpt:
      'A practical comparison of three travel crib directions for families weighing setup, portability, and real sleep use in 2026.',
    category: 'Travel',
    content: `# Nuna SENA vs PAAL vs COVE - 2026 Comparison Guide

Portable sleep gear looks similar at a glance, but the details matter when you are opening, moving, cleaning, and storing it in real life.

## Start With the Primary Use Case

Ask whether you need a travel crib mainly for:
- Overnight travel
- Grandparent homes
- Main-floor naps
- Compact apartment storage

The best option depends on where it will live most of the time.

## What to Compare

A useful comparison should focus on:
- Fold and unfold ease
- Overall weight
- Footprint when open
- Bassinet or newborn-stage features
- Cleaning and fabric care

## Where Families Get Stuck

Many families compare brand reputation before comparing daily friction. The better decision usually comes from understanding which model creates the least hassle in your actual routine.

## Draft Recommendation Structure

This post should eventually sort each option by use case rather than declaring a single universal winner.`,
  },
  {
    title: 'Baby Sleep Solutions in 2026',
    slug: 'baby-sleep-solutions-2026',
    excerpt:
      'A grounded look at sleep tools, routines, and product categories that may support rest without promising magic fixes.',
    category: 'Sleep',
    content: `# Baby Sleep Solutions in 2026

Sleep products are one of the most emotionally charged areas of baby prep. Families want relief, but the category often mixes useful tools with unrealistic promises.

## Start With Expectations

No product can replace developmental reality, caregiver responsiveness, or safe sleep fundamentals. The best sleep setup supports the routine you are building rather than trying to shortcut it.

## Categories Worth Reviewing

Consider the role of:
- Bassinets and bedside sleepers
- Swaddles and wearable sleep options
- Sound machines
- Blackout tools for travel or bright rooms
- Portable sleep setups

## Match the Tool to the Problem

Before buying, define the specific challenge. Difficulty settling, short naps, travel disruption, and room-sharing logistics are different problems and often need different solutions.

## Build a Flexible Plan

The strongest sleep plan combines realistic expectations, safe setup, and a few thoughtfully chosen tools that reduce friction without creating dependence on gimmicks.`,
  },
  {
    title: 'Bottles in 2026 - What Actually Matters',
    slug: 'bottles-in-2026-what-actually-matters',
    excerpt:
      'What to compare when choosing bottles in 2026, from flow and cleaning to latch flexibility and daily convenience.',
    category: 'Feeding',
    content: `# Bottles in 2026 - What Actually Matters

Bottle shopping gets overcomplicated quickly. In practice, most families need a bottle that is easy to clean, easy to prep, and flexible enough to work with their feeding rhythm.

## Start With Feeding Context

Your best bottle choice depends on whether you plan to:
- Exclusively bottle feed
- Nurse and bottle feed
- Pump and store frequently
- Prioritize dishwasher simplicity

## Compare the Right Things

Focus on:
- Nipple flow options
- Parts count
- Ease of cleaning
- Leak resistance
- Availability and long-term replacement costs

## Skip the Noise

Anti-colic marketing, premium finishes, and aesthetic packaging do not matter if the bottle creates more washing, more leaking, or more frustration in your actual routine.

## Build a Trial Strategy

A small test set is usually smarter than buying a full collection upfront. Let your baby and your workflow inform the rest.`,
  },
  {
    title: 'Bringing Baby Home to a House With Animals - 2026 Guide',
    slug: 'bringing-baby-home-to-a-house-with-animals-2026-guide',
    excerpt:
      'A practical guide to preparing pets, managing household transitions, and building calm first weeks at home with baby.',
    category: 'Home & Family',
    content: `# Bringing Baby Home to a House With Animals - 2026 Guide

The transition home is not only a change for parents. It is also a major environmental shift for pets, especially in households with established routines and close animal bonds.

## Prepare Before Delivery

Do not wait until the first day home to think about pet transition. Adjust routines, boundaries, and key furniture access points ahead of time.

## Focus on Predictability

Animals tend to do better when the environment feels understandable. Consistency helps more than intensity.

Build a simple plan for:
- Feeding and walk timing
- Safe retreat spaces
- Baby-zone boundaries
- First introductions

## Reduce Pressure

The goal is not an instant perfect bond. The goal is a calm, supervised adjustment period with clear expectations.

## Think in Weeks, Not Moments

Early success usually comes from repeated calm exposure, not one dramatic introduction. Slow is often the best strategy.`,
  },
  {
    title: 'Baby Boy Checklist - 2026 Edition',
    slug: 'baby-boy-checklist-2026-edition',
    excerpt:
      'A draft checklist for building a practical baby boy setup around daily needs rather than trend-driven shopping.',
    category: 'Checklists',
    content: `# Baby Boy Checklist - 2026 Edition

A useful checklist does not need to be themed or oversized. It needs to cover the systems your household will use every single day.

## Core Categories

Build your checklist around:
- Sleep setup
- Diapering supplies
- Feeding support
- Clothing basics
- Travel and on-the-go gear

## Buy for Function First

Start with weather, laundry rhythm, storage, and how often you want to restock. A smaller functional wardrobe is usually easier than an aspirational one.

## Avoid Duplicate Utility

Try not to buy five products that solve the same problem. One reliable solution per real need is often enough at the beginning.

## Keep Room for Real Life

Every checklist should leave space for gifts, surprises, and adjustments after baby arrives.`,
  },
  {
    title: 'Baby Girl Checklist - 2026 Edition',
    slug: 'baby-girl-checklist-2026-edition',
    excerpt:
      'A practical 2026 checklist for setting up baby girl essentials with clarity, utility, and less unnecessary shopping.',
    category: 'Checklists',
    content: `# Baby Girl Checklist - 2026 Edition

The most helpful baby checklist is not about aesthetics. It is about building a dependable foundation for the first weeks and months.

## Cover the Essentials

A balanced checklist should account for:
- Safe sleep
- Diapering and care
- Feeding tools
- Basic clothing layers
- Travel essentials

## Keep the Wardrobe Realistic

Clothing gets overbought quickly. Prioritize comfort, seasonality, and how often you realistically plan to do laundry.

## Build Around Routine

The best checklist reflects your actual home, schedule, and support system. If a product does not fit your routine, it does not belong just because it appears on a generic list.

## Leave Space to Learn

You do not need every answer before birth. A good checklist gets you prepared without locking you into unnecessary decisions.`,
  },
  {
    title: 'Gender-Neutral Checklist - 2026 Edition',
    slug: 'gender-neutral-checklist-2026-edition',
    excerpt:
      'A clean, practical checklist for families who want flexible baby essentials that prioritize function over themed purchasing.',
    category: 'Checklists',
    content: `# Gender-Neutral Checklist - 2026 Edition

Gender-neutral planning is not about limiting options. It is about choosing pieces that stay flexible, useful, and easy to hand down or reuse.

## Start With Utility

The strongest checklist focuses on function:
- Sleep setup
- Feeding support
- Diapering system
- Everyday clothing
- Transport gear

## Think Beyond the Newborn Stage

Neutral planning often works best when families want products and clothing that can move across stages or between siblings more easily.

## Choose Fewer, Better Items

A versatile set of essentials typically outperforms a large collection built around novelty.

## Keep the Checklist Adaptable

You are building a base, not finishing the entire future. The right setup leaves room to adjust as your child and your routines become clearer.`,
  },
  {
    title: 'Twins Checklist - 2026 Edition',
    slug: 'twins-checklist-2026-edition',
    excerpt:
      'A draft twins checklist focused on systems, duplication where it matters, and realistic preparation for two babies at once.',
    category: 'Checklists',
    content: `# Twins Checklist - 2026 Edition

Twin prep works best when you think in systems rather than categories. The question is not whether you need double of everything. The question is where duplication actually reduces daily stress.

## Start With High-Use Systems

Focus first on:
- Safe sleep arrangements
- Feeding workflow
- Diapering stations
- Double stroller or transport plan
- Laundry and storage support

## Duplicate With Intention

Some categories need true duplication. Others do not. The strongest checklist separates what must happen simultaneously from what can be shared or rotated.

## Reduce Movement and Friction

With twins, layout matters even more. Keep daily-use tools easy to reach and eliminate avoidable steps where possible.

## Build for Support

A twins checklist should also account for caregiver logistics, not just products. Ease of use matters as much as feature count.`,
  },
  {
    title: 'How to Get Baby to Sleep on Vacation (2026)',
    slug: 'how-to-get-baby-to-sleep-on-vacation-2026',
    excerpt:
      'A realistic approach to protecting baby sleep while traveling, without expecting perfect naps or identical routines away from home.',
    category: 'Travel',
    content: `# How to Get Baby to Sleep on Vacation (2026)

Vacation sleep usually improves when families aim for consistency, not perfection. Travel changes the environment, but a few anchors can keep rest from fully unraveling.

## Protect the Biggest Sleep Cues

When you cannot keep everything the same, keep the cues that matter most:
- Familiar sleep space
- Familiar sound environment
- Consistent bedtime rhythm
- Reasonable light control

## Plan Around Real Constraints

Think about naps in transit, room-sharing, time zone shifts, and how flexible your schedule actually needs to be.

## Lower the Pressure

Vacation is rarely the time for rigid experimentation. A calmer, more forgiving plan usually works better than trying to force home conditions exactly.

## Focus on Recovery, Not Perfection

If one nap falls apart or bedtime moves later, respond with the next best choice instead of assuming the whole trip is off track.`,
  },
  {
    title: 'Best Travel Sleep Solutions for Spring Break 2026',
    slug: 'best-travel-sleep-solutions-for-spring-break-2026',
    excerpt:
      'A draft guide to travel sleep setups that support naps and nights during spring break trips with babies and toddlers.',
    category: 'Travel',
    content: `# Best Travel Sleep Solutions for Spring Break 2026

Spring break travel often combines bright rooms, unfamiliar schedules, and limited space. Good sleep support comes from choosing a setup that travels well and solves the actual problem.

## Match the Tool to the Trip

The right solution depends on whether you are staying in:
- A hotel room
- A rental home
- A shared family house
- A fly-to destination with limited packing space

## Useful Categories to Compare

Review:
- Lightweight travel cribs
- Portable blackout tools
- Sound machines
- Sleep sacks and familiar sleep layers
- Compact monitor setups where appropriate

## Minimize Packing Regret

The best travel sleep gear earns its space by being easy to carry, quick to set up, and clearly helpful once you arrive.

## Build a Repeatable Kit

Families who travel more than once usually benefit from a dedicated sleep kit rather than rebuilding the plan for every trip.`,
  },
  {
    title: 'Minimalist Baby Registry Strategy (2026)',
    slug: 'minimalist-baby-registry-strategy-2026',
    excerpt:
      'How to build a thoughtful 2026 registry without overbuying, duplicating product categories, or filling your home with low-value gear.',
    category: 'Registry Planning',
    content: `# Minimalist Baby Registry Strategy (2026)

Minimalism in 2026 does not mean buying nothing. It means building a registry around what your family will actually use, store, clean, and repeat every day.

## Think in Systems, Not Categories

Instead of filling out a standard checklist, build your registry around:
- Sleep
- Feeding
- Diapering
- Transport
- Care and recovery

## Buy for the First Stage First

Most overbuying happens when families register for too many future phases at once. Focus first on the early months, then leave room to add later based on real needs.

## Leave White Space

A strong minimalist registry has intentional gaps. That gives you room to respond to your baby, your routines, and your home instead of solving hypothetical problems too early.

## Keep the Standard High

The goal is not scarcity. The goal is clarity. A smaller registry built on function and fit is usually more useful than a larger one built on pressure.`,
  },
  {
    title: 'Nursery Essentials Checklist (2026)',
    slug: 'nursery-essentials-checklist-2026',
    excerpt:
      'A practical nursery checklist for 2026 that focuses on high-use essentials, safe setup, and a calmer room layout.',
    category: 'Nursery & Home',
    content: `# Nursery Essentials Checklist (2026)

The best nursery checklist is not the longest one. It is the one that supports sleep, storage, diapering, and everyday care without filling the room with low-use extras.

## Cover the Foundational Zones

Think in terms of:
- Sleep
- Change and care
- Storage
- Feeding and soothing

## Prioritize the Items You Will Touch Daily

Daily-use pieces deserve the most thought. A comfortable changing setup, good storage access, and a reliable sleep environment usually matter more than decorative accessories.

## Keep Safety Visible

Anchor furniture, reduce loose hazards, manage cords intentionally, and build a room that is easy to use consistently when you are tired.

## Leave Room to Evolve

The nursery will change quickly over the first year. Buy for flexibility where possible and avoid treating the newborn layout as permanent.`,
  },
  {
    title: 'Convertible Cribs Worth Considering in 2026',
    slug: 'convertible-cribs-worth-considering-in-2026',
    excerpt:
      'A decision guide for families comparing convertible cribs in 2026 based on longevity, layout fit, and everyday practicality.',
    category: 'Nursery & Home',
    content: `# Convertible Cribs Worth Considering in 2026

Convertible cribs remain one of the smartest long-term nursery investments when the goal is to buy fewer, better pieces that can adapt with your child.

## Start With the Real Use Case

Before comparing finishes or trends, define how the crib needs to function in your home. Room size, mattress height preferences, and long-term layout plans matter more than marketing language.

## What to Compare

Focus on:
- Mattress support positions
- Conversion kit availability
- Material quality
- Overall footprint
- Ease of assembly

## When a Convertible Crib Is Worth It

A convertible model is usually worth the investment when you want longer product life, a more stable nursery plan, and fewer replacement purchases over time.

## Final Filter

The best convertible crib is the one that fits your room, your style tolerance, and your long-term needs without adding unnecessary complexity.`,
  },
];

async function main() {
  const author =
    (await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
    })) ??
    (await prisma.user.findFirst({
      select: { id: true },
      orderBy: { createdAt: 'asc' },
    }));

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding draft blog posts.');
  }

  for (const post of draftPosts) {
    const existing = await prisma.post.findUnique({
      where: { slug: post.slug },
      select: { id: true },
    });

    if (existing) {
      console.log(`Skipped (already exists): ${post.slug}`);
      continue;
    }

    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        content: post.content,
        published: false,
        authorId: author.id,
      },
      select: { id: true },
    });

    console.log(`Created draft: ${post.slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
