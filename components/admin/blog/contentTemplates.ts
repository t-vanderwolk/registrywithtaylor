export type ContentTemplateId =
  | 'guide'
  | 'comparison'
  | 'faq'
  | 'checklist'
  | 'registryGuide'
  | 'productReview'
  | 'bestOf';

export type ContentTemplate = {
  id: ContentTemplateId;
  label: string;
  description: string;
  content: string;
};

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'guide',
    label: 'Guide',
    description: 'A calm expert article with context, criteria, and a final recommendation.',
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
    content: `:::callout
Quick take
Lead with the one-sentence recommendation before the reader has to scroll.
:::

## What this category needs to do

Open with the real-life use case and what matters most for the parent reading this.

## The three things to prioritize

- Daily ease of use
- Long-term value
- What actually fits your routine

## What I would skip

Call out one or two features that sound impressive but rarely matter.

## Best fit for most families

:::comparison
Title: Best overall pick
Best for: Parents who want the simplest everyday setup
Standout: Name the clearest reason this is the default recommendation
Watchout: Name the biggest tradeoff honestly
:::

## Final recommendation

Close with the clearest next step or buying path.`,
  },
  {
    id: 'productReview',
    label: 'Product Review',
    description: 'A review structure with quick take, pros, cons, and final verdict.',
    content: `:::pullquote
If a product is hard to use in your actual day, the feature list does not save it.
— Taylor-Made Baby
:::

## Quick overview

Start with the honest short answer for who this product is for.

:::pros
- Daily use feels easy
- One clear standout feature
- Worth paying for in the right use case
:::

:::cons
- Name the main compromise
- Explain who should skip it
:::

## What stood out in testing

### Best for
Describe who will get the most value from it.

### Watchouts
Describe the real-world tradeoffs.

## Verdict

End with whether you recommend it, and for whom.`,
  },
  {
    id: 'bestOf',
    label: 'Best Of',
    description: 'A roundup template for best-in-category posts with stacked comparison cards.',
    content: `:::callout
Editor’s note
Set expectations for how the roundup was chosen and who it is for.
:::

## Best picks at a glance

:::comparison
Title: Best overall
Best for: The broadest group of parents
Standout: Why it wins most of the time
Watchout: The main tradeoff to know
:::

:::comparison
Title: Best budget pick
Best for: Families with a firm budget cap
Standout: Why it over-delivers for the price
Watchout: What you give up to save
:::

:::comparison
Title: Best premium pick
Best for: Families who will use it heavily every day
Standout: The premium feature worth paying for
Watchout: The price or weight tradeoff
:::

## How to choose

Explain how to decide between the shortlist without overthinking it.

## Final takeaway

Close with the simplest recommendation path.`,
  },
];

export function getContentTemplate(templateId: ContentTemplateId) {
  return CONTENT_TEMPLATES.find((template) => template.id === templateId) ?? null;
}
