/**
 * Seed the three pillar Journal posts that replace the old "preview lessons".
 * They are published, categorized, and end with a Registry Consult CTA. No
 * Lesson / Module / Academy / Preview language — these read as complete posts.
 *
 * Idempotent: upserts by slug, so re-runs refresh content without duplicating.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run seed:pillar-blogs
 */
import prisma from '@/lib/server/prisma';

type PillarPost = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
};

const posts: PillarPost[] = [
  {
    title: 'The Art of the Registry',
    slug: 'the-art-of-the-registry',
    category: 'Registry Strategy',
    excerpt:
      'Why most baby registries spiral — and a calmer, sturdier way to build one that fits your actual life.',
    content: `# The Art of the Registry

Most baby registries don't fail because parents pick the "wrong" products. They fail because they start from a giant list instead of a real life. The internet hands you 300 must-haves, three creators contradict each other, and somehow your registry keeps getting longer while you feel less sure.

Here's the calmer way to think about it.

## Start with your life, not the list

Before you add a single item, picture your actual days. Where will baby sleep? How will you get around — mostly car, mostly walking, lots of travel? Who's helping, and how often? How much storage do you really have?

When you start from your routines, the registry becomes a tool that serves your family. When you start from a checklist, it becomes a test you can't pass.

## Buy for daily life, not for the box it comes in

The strongest registry choices usually aren't the trendiest ones. They're the items you'll reach for every single day, clean without resenting, store without a fight, and trust at 2 a.m. on no sleep.

A simple lens for every product:

- Function before novelty
- Longevity before impulse
- Daily usability before one-time convenience

## A three-question filter for anything you're tempted to add

- What problem does this actually solve for us?
- How often will we really use it?
- Is there a simpler, safer, or longer-lasting version?

If a product can't survive those three questions, it's noise — no matter how many people swear by it.

## Build in the right order

You don't need everything at once. Most overwhelm comes from trying to decide newborn bottles, a convertible car seat, and nursery décor in the same afternoon.

1. Lock in your essential daily systems first: sleep, feeding, diapering, and getting around.
2. Separate what you need *now* from what you can add *later*.
3. Choose intentionally, then stop second-guessing.

## What "done" actually feels like

A finished registry isn't the longest one. It's the one where every item has a reason, the big decisions are settled, and you can close the tab without that low hum of "wait, am I forgetting something?"

That calm is the whole point. You're not preparing to win a shopping contest — you're setting up the first few months so they start from confidence instead of clutter.

---

Need help applying this to your actual registry? [Book a $75 Registry Consult](/book) and we'll go through it together.`,
  },
  {
    title: 'Nursery Foundations',
    slug: 'nursery-foundations',
    category: 'Nursery & Home',
    excerpt:
      'What actually needs to be ready before baby arrives — and what can wait. A practical nursery plan built around real routines.',
    content: `# Nursery Foundations

A beautiful nursery is lovely. A *functional* nursery is the one that quietly makes your hardest hours easier. The goal isn't a room that photographs well — it's a space that supports your real rhythm once baby is actually here.

## Start with how you'll move through the day

Before you choose furniture, map your routines. Where will diaper changes happen? Where will feeding supplies live? What's the path you'll walk half-asleep at 2 a.m.? Daily flow should shape the room — not the other way around.

## Think in zones, not just pieces

Treat the nursery as a small system with a few clear zones:

- A sleep zone
- A change-and-care zone
- A feeding-and-soothing zone
- A storage zone

When moving between those zones feels natural, the whole room feels calmer — and so do you.

## What actually needs to be ready before baby

Short version: a safe place to sleep, a place to change and dress, somewhere comfortable to feed, and storage you can reach one-handed. Most of the rest can arrive after baby does.

Ready before:

- A safe sleep space (bassinet or crib with a firm, flat mattress and nothing else in it)
- A changing setup with supplies within arm's reach
- A comfortable feeding spot with a light and a surface nearby
- The basics of clothing and diapers in the first sizes

Can wait:

- The full décor moment
- Big-kid furniture and crib conversions
- Anything tied to a stage baby hasn't reached yet

## Safety without the spiral

Safety planning should feel steady, not fear-driven. Focus on the high-impact fundamentals: anchor heavy furniture to the wall, keep the sleep space bare, stay aware of cords and outlets, and choose simple products you'll actually use consistently. A calm, consistent plan beats panic-buying every gadget.

## Choose for growth

The room will change faster than you expect. Where you can, pick pieces that adapt — a dresser that doubles as a changing table, lighting that works for night feeds now and play later. Future-proofing doesn't mean buying more; it means choosing smarter once.

---

Want help deciding what actually needs to be ready before baby arrives? [Book a Registry Consult](/book) and we'll build your nursery plan around your real space.`,
  },
  {
    title: 'The Stroller Equation',
    slug: 'the-stroller-equation',
    category: 'Gear & Safety',
    excerpt:
      'There is no single best stroller — only the one that fits your life. How to think through the decision across every category.',
    content: `# The Stroller Equation

There is no single best stroller. There's only the one that fits *your* life — your car, your sidewalks, your storage, your plans for a second kid. The reason stroller shopping feels impossible is that people compare strollers in the abstract, when the right answer is almost entirely about context.

Here's how to solve your own equation.

## Start with your inputs, not the models

Before you look at a single stroller, get honest about:

- **How you get around.** Mostly driving? Walking a city? Transit? Travel a lot?
- **Where it'll live.** A roomy garage, or a tight apartment entryway?
- **Your car.** A small trunk changes everything about fold size.
- **Your timeline.** One baby, or another likely within a couple of years?

Those inputs narrow the field faster than any review.

## Know the categories

Most strollers fall into a handful of types, and knowing which one you need is most of the decision:

- **Full-size / modular** — the everyday workhorse: smooth ride, big basket, grows with you.
- **Compact / mid-size** — lighter and easier to fold for car-and-curb life.
- **Travel** — folds tiny and weighs almost nothing for planes and ride-shares.
- **Single-to-double** — starts as one seat, adds a second when your next baby arrives.
- **Jogging / all-terrain** — big wheels for real running and rough ground.
- **Umbrella** — lightweight, grab-and-go for quick trips.

You're not choosing a brand first. You're choosing a category, then the best option within it.

## Don't forget the car seat half of the equation

If you want a travel system, your stroller and infant car seat have to actually work together — sometimes directly, sometimes with the right adapter. Buying the wrong adapter, or assuming two pieces are compatible, is one of the most common and most avoidable gear mistakes.

A few free tools make this part easy:

- The [Stroller Quiz](/tools/stroller-quiz) matches you to a category based on your real life.
- The [Stroller Finder](/tools/stroller-finder) lets you browse by brand and type with live prices.
- The [Travel System Tool](/tools/travel-system) checks which car seats fit which strollers — before you buy.

## Buy the system, not the hype

Strollers, car seats, and the way they fold into your trunk should work together as one system. Compatibility, fold size, and storage reality matter far more than a long feature list or a viral moment. The "best" stroller that doesn't fit your trunk is the wrong stroller.

---

Still torn between stroller options? [Book a Registry Consult](/book) and we'll find the one that actually fits your life.`,
  },
];

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

async function main() {
  const author =
    (await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
    })) ?? (await prisma.user.findFirst({ select: { id: true }, orderBy: { createdAt: 'asc' } }));

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding pillar posts.');
  }

  for (const post of posts) {
    const base = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      published: true,
      status: 'PUBLISHED' as const,
      stage: 'PUBLISHED' as const,
      readingTime: readingTime(post.content),
    };

    const existing = await prisma.post.findUnique({
      where: { slug: post.slug },
      select: { id: true, publishedAt: true },
    });

    if (existing) {
      await prisma.post.update({
        where: { slug: post.slug },
        data: { ...base, publishedAt: existing.publishedAt ?? new Date() },
      });
      console.log(`Updated pillar post: ${post.title}`);
    } else {
      await prisma.post.create({
        data: { ...base, slug: post.slug, authorId: author.id, publishedAt: new Date() },
      });
      console.log(`Created pillar post: ${post.title}`);
    }
  }
}

main()
  .catch((error) => {
    console.error('[seedPillarBlogPosts] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
