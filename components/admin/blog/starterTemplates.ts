import type { BlogCategory } from '@/lib/blogCategories';

export type StarterTemplateId =
  | 'tmbcEditorial'
  | 'guide'
  | 'comparison'
  | 'faq'
  | 'checklist'
  | 'registryGuide'
  | 'productReview'
  | 'bestOf';

export type StarterTemplate = {
  id: StarterTemplateId;
  label: string;
  description: string;
  title: string;
  slug: string;
  heroImage: string;
  excerpt: string;
  category: BlogCategory;
  featured: boolean;
  content: string;
};

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'tmbcEditorial',
    label: 'TMBC Editorial',
    description: 'The standard Taylor-Made structure: strong lede, expert sections, gear picks, CTA, and conclusion.',
    title: 'Blog Title',
    slug: 'blog-slug',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A warm, witty, wise guide that helps the reader make a calmer decision.',
    category: 'Registry Strategy',
    featured: true,
    content: `## Opening perspective

Lead with the relatable shift, tension, or decision that makes the reader keep going.

> This is where a PullQuote would go.

### Key Points

- Point one
- Point two
- Point three

## Next Section

Body content here.`,
  },
  {
    id: 'guide',
    label: 'Guide',
    description: 'A calm expert article with context, criteria, and a final recommendation.',
    title: 'Guide Title',
    slug: 'guide-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A practical guide to making one baby-prep decision with more clarity and less noise.',
    category: 'Registry Strategy',
    featured: false,
    content: `## Why this matters

Open with the practical context for the reader and the real decision this post helps solve.

## What to look for

- Must-have feature
- Nice-to-have feature
- What to skip

## How to narrow the options

### Best for
Who this option fits best and why.

### Watchouts
Any tradeoffs or caveats to note.

## Bottom line

Close with the clearest recommendation and next step.`,
  },
  {
    id: 'comparison',
    label: 'Comparison',
    description: 'A side-by-side structure for weighing two or three options quickly.',
    title: 'Comparison Title',
    slug: 'comparison-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A side-by-side guide to what changes between options and which one earns the recommendation.',
    category: 'Gear & Safety',
    featured: false,
    content: `## Quick take

Lead with the headline recommendation before the reader scrolls.

## Option one

### Best for
Describe who this option fits.

### What stands out
- Strength one
- Strength two

## Option two

### Best for
Describe who this option fits.

### What stands out
- Strength one
- Strength two

## Verdict

Explain which option wins for most readers and why.`,
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'A question-led layout for educational posts and decision support content.',
    title: 'FAQ Title',
    slug: 'faq-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A concise FAQ that answers the questions parents ask first and the decisions that matter most.',
    category: 'Planning & Events',
    featured: false,
    content: `## FAQ

### What do parents usually ask first?
Answer with a direct, practical paragraph.

### What matters most?
Call out the most useful decision criteria.

### What can you skip?
Explain what is usually overhyped or unnecessary.

### What is the simplest recommendation?
Offer the shortest possible answer for busy readers.

## Final takeaway

Wrap with the clearest action to take next.`,
  },
  {
    id: 'checklist',
    label: 'Checklist',
    description: 'A skimmable layout for planning, prep, and buyer checklists.',
    title: 'Checklist Title',
    slug: 'checklist-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A quick checklist that helps parents prep smarter without overbuying or overthinking.',
    category: 'Planning & Events',
    featured: false,
    content: `## Before you decide

- Confirm the primary use case
- Set one realistic budget range
- Cut anything that duplicates gear you already own

## Quick checklist

1. Start with the non-negotiable feature.
2. Compare only the short list.
3. Choose the option you will actually use every day.

## Notes from the field

> Add one operator or expert note here that helps readers avoid a common mistake.

## Final recommendation

End with the simplest next step or decision path.`,
  },
  {
    id: 'registryGuide',
    label: 'Registry Guide',
    description: 'A Taylor-Made style buying guide for helping parents choose the right category or setup.',
    title: 'Registry Guide Title',
    slug: 'registry-guide-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A buying guide that narrows a category down to what actually earns a place on the list.',
    category: 'Registry Strategy',
    featured: true,
    content: `## What this category needs to do

Open with the real-life use case and what matters most for the parent reading this.

> The best registry picks are the ones that make daily life feel easier, not more complicated.

## The three things to prioritize

- Daily ease of use
- Long-term value
- What actually fits your routine

## What I would skip

Call out one or two features that sound impressive but rarely matter.

## Best fit for most families

Body content here.

## Final recommendation

Close with the clearest next step or buying path.`,
  },
  {
    id: 'productReview',
    label: 'Product Review',
    description: 'A review structure with quick take, pros, cons, and final verdict.',
    title: 'Product Review Title',
    slug: 'product-review-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'An honest review that explains who a product is for, what stands out, and what to watch out for.',
    category: 'Gear & Safety',
    featured: false,
    content: `## Quick overview

Start with the honest short answer for who this product is for.

> If a product is hard to use in your actual day, the feature list does not save it.

### Pros

- Daily use feels easy
- One clear standout feature
- Worth paying for in the right use case

### Cons

- Name the main compromise
- Explain who should skip it

## Verdict

End with whether you recommend it, and for whom.`,
  },
  {
    id: 'bestOf',
    label: 'Best Of',
    description: 'A roundup template for best-in-category posts with stacked comparison cards.',
    title: 'Best Of Title',
    slug: 'best-of-title',
    heroImage: '/assets/hero/hero-04.jpg',
    excerpt: 'A roundup built to surface the best overall pick, the best value, and the clearest premium choice.',
    category: 'Gear & Safety',
    featured: true,
    content: `## Best picks at a glance

### Best overall
Body content here.

### Best budget pick
Body content here.

### Best premium pick
Body content here.

## How to choose

Explain how to decide between the shortlist without overthinking it.

## Final takeaway

Close with the simplest recommendation path.`,
  },
];
