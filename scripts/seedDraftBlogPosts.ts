import prisma from '@/lib/server/prisma';

type DraftPostSeed = {
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  content: string;
};

const draftPosts: DraftPostSeed[] = [
  {
    title: 'Best Convertible Cribs in 2026',
    slug: 'best-convertible-cribs-2026',
    excerpt:
      'A 2026 comparison framework for choosing a convertible crib that works from newborn sleep through toddler transitions.',
    category: 'Nursery & Home',
    content: `# Best Convertible Cribs in 2026

Convertible cribs remain one of the smartest long-term nursery investments in 2026 when the goal is to buy fewer, better pieces that can adapt with your child.

## Start With the Real Use Case

Before comparing finishes or trends, define how the crib needs to function in your home. Room size, mattress height preferences, convertibility stages, and long-term durability matter more than marketing language.

## What to Compare

A practical crib comparison should focus on:
- Mattress support positions
- Conversion kit availability
- Material quality and finish durability
- Overall footprint
- Ease of assembly

## When a Convertible Crib Is Worth It

A convertible model is usually worth the investment when you want longer product life, a more stable nursery plan, and fewer replacement purchases over time.

## Final Filter

The best convertible crib is not the one with the most features. It is the one that fits your room, your style tolerance, and your long-term nursery plan without adding unnecessary complexity.`,
  },
  {
    title: 'Minimalist Baby Registry Strategy',
    slug: 'minimalist-baby-registry-2026',
    excerpt:
      'How to build a thoughtful registry in 2026 without overbuying, duplicating categories, or creating clutter before baby arrives.',
    category: 'Registry Planning',
    content: `# Minimalist Baby Registry Strategy

Minimalism in 2026 does not mean buying nothing. It means building a registry around what your family will actually use, store, clean, and repeat every day.

## Think in Systems, Not Categories

Instead of filling out a standard checklist, build your registry around core systems:
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
    title: 'Travel System Questions to Answer Before You Buy',
    slug: 'travel-system-questions-before-you-buy',
    excerpt:
      'A draft decision guide for evaluating strollers and infant car seat combinations before committing to a travel system.',
    category: 'Gear & Safety',
    content: `# Travel System Questions to Answer Before You Buy

Travel systems can simplify the early months, but only when the stroller, car seat, and daily use case actually align with your lifestyle.

## Start With Daily Reality

Ask where the system will be used most often. City sidewalks, suburban trunk space, apartment stairs, and frequent errands create very different product requirements.

## Questions Worth Answering

Before you buy, clarify:
- How heavy is the stroller with the seat attached?
- How easily does it fold one-handed?
- Does the infant seat install cleanly in your vehicle?
- Will the stroller still work for your routine after the infant stage?

## Avoid Feature Creep

More accessories do not automatically mean better value. The strongest system is usually the one that handles your real transitions smoothly and stores easily at home and in the car.

## Draft Recommendation Angle

This post should eventually compare a few high-fit systems by use case rather than trying to rank every option in the category.`,
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
        category: post.category ?? 'Registry Strategy',
        content: post.content,
        published: false,
        authorId: author.id,
      },
      select: { id: true },
    });

    console.log(`Created draft: ${post.title}`);
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
