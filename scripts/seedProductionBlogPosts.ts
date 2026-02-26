import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/blog';

type SeedPost = {
  title: string;
  excerpt: string;
  content: string;
};

const posts: SeedPost[] = [
  {
    title: 'The Art of the Registry',
    excerpt:
      'How to prepare for baby without overbuying, overspending, or feeling overwhelmed.',
    content: `# The Art of the Registry

Baby prep can feel loud, fast, and full of pressure. A thoughtful registry brings the process back to what matters most: real needs, real routines, and real confidence.

## Start With Clarity, Not Categories

Most registry overwhelm starts when you open a giant list and try to fill every box. Instead, begin with your life: your space, your schedule, your support system, and how you want your days to feel.

When you start from clarity, the registry becomes a tool. Not a test.

## Buy for Life, Not for Lists

The strongest registry choices are not always the trendiest. They are the items you will actually use repeatedly, clean easily, store well, and trust during long days and tired nights.

A practical lens helps you prioritize:
- Function before novelty
- Longevity before impulse
- Daily usability before one-time convenience

## Understand Before You Add

Before adding products, build a simple research filter. Ask:
- What problem does this solve?
- How often will we use it?
- Does this fit our home and routines?
- Is there a safer, simpler, or longer-lasting option?

This framework cuts noise and keeps your registry grounded.

## The Calm Registry Framework

A calm registry can be built in three steps:
1. Define your essential daily systems (sleep, feeding, travel, care)
2. Prioritize what you need now versus later
3. Select intentionally, then stop second-guessing

You do not need everything. You need what fits your family well. When the decisions are thoughtful, preparation feels lighter and parenthood starts from confidence, not confusion.`,
  },
  {
    title: 'Nursery Setup That Actually Works',
    excerpt:
      'A practical framework for building a calm nursery flow around real daily routines.',
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

A steady plan is more effective than panic-driven overcorrection.

## Build for Growth

Choose items that adapt as your baby grows. Think beyond the newborn phase and avoid expensive one-stage decisions when a flexible option will serve longer.

Future-proofing does not mean buying more. It means choosing smarter from the start.

The best nursery is not the one that photographs perfectly. It is the one that makes everyday care easier, safer, and more peaceful for your family.`,
  },
  {
    title: 'Gear Decisions Without Guesswork',
    excerpt:
      'A clearer way to evaluate strollers, car seats, and everyday systems with confidence.',
    content: `# Gear Decisions Without Guesswork

Gear decisions feel high-stakes because they are tied to safety, budget, and daily quality of life. The right framework makes those decisions clear and manageable.

## Understand the Use Case First

Start with context, not products. Your ideal gear depends on where and how you live:
- City sidewalks or suburban errands
- Single-story or walk-up living
- Frequent car travel or mostly neighborhood movement

Use case determines what matters.

## Evaluate Features Through Function

Feature lists are long. Most families only need a few features that genuinely change daily ease.

Ask:
- Does this improve safety in a meaningful way?
- Does this make daily routines easier?
- Will this still serve us in six to twelve months?

If the answer is no, it is noise.

## System Thinking

Strollers, car seats, carriers, and home touchpoints should work together as one system. Compatibility, transition ease, and storage reality matter more than standalone hype.

When products are selected as a coordinated system, your days feel smoother.

## Confidence Comes From Clarity

A confident gear plan follows a simple structure:
1. Define daily routines and constraints
2. Filter choices by safety and function
3. Commit to a cohesive system you can trust

Prepared families are not the ones with the most products. They are the ones with the clearest plan. Clarity removes guesswork and creates steady confidence before baby arrives.`,
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
    throw new Error('No users found. Create an admin user before seeding production blog posts.');
  }

  const createdTitles: string[] = [];

  for (const post of posts) {
    const existing = await prisma.post.findFirst({
      where: { title: post.title },
      select: { id: true, title: true },
    });

    if (existing) {
      console.log(`Skipped existing post: ${existing.title}`);
      continue;
    }

    const slug = await generateUniqueSlug(post.title);

    const created = await prisma.post.create({
      data: {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        coverImage: null,
        content: post.content,
        published: true,
        authorId: author.id,
      },
      select: { title: true },
    });

    createdTitles.push(created.title);
  }

  if (createdTitles.length === 0) {
    console.log('No new posts created.');
    return;
  }

  console.log('Created posts:');
  for (const title of createdTitles) {
    console.log(`- ${title}`);
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed production blog posts:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
