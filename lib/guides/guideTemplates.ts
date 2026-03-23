import { STARTER_TEMPLATES, type StarterTemplateId } from '@/components/admin/blog/starterTemplates';

const TMBC_SIGNATURE = 'xoxo -T';

const GUIDE_WIDGET_PLAYGROUND = `## Widget-Ready Sections

:::callout
Quick read
Use this block to frame the real decision before the reader gets buried in specs, reviews, or feature lists.
:::

:::advice
What most parents do not realize
The easiest product to live with every day usually beats the product with the longest feature list.
:::

:::pullquote
The goal is not a more impressive setup. It is a calmer one.
— Taylor-Made Baby Co.
:::

:::comparison
Title: Best fit snapshot
Best for: Families who want the clearest everyday use case
Standout: Name the strongest real-life reason this option works
Watchout: Name the tradeoff honestly
:::

:::pros
- Easy to skim
- Adds visual rhythm to long-form content
- Helps parents compare without reading every paragraph
:::

:::faq
Question: What actually matters most here?
Answer: Focus on the option that fits your daily life best instead of the one with the most dramatic product page.
:::

:::decision
Question: Is the easier everyday option the better pick for your family?
Option: Choose the version you can manage quickly, store easily, and use without extra friction.
Result: The calmer daily fit usually ends up being the smarter long-term choice.
:::

:::takeaways
- Start with the routine, not the brand.
- Choose the option that removes the most friction.
- Let clarity beat feature overload.
:::`;

export type GuideTemplate = {
  name: string;
  description?: string;
  source?: 'guide' | 'blog';
  intro: string;
  content: string;
  conclusion: string;
};

function withGuideWidgets(content: string) {
  return `${content}\n\n${GUIDE_WIDGET_PLAYGROUND}`;
}

function getBlogStarterTemplate(templateId: StarterTemplateId) {
  const template = STARTER_TEMPLATES.find((entry) => entry.id === templateId);
  if (!template) {
    throw new Error(`Missing blog starter template: ${templateId}`);
  }

  return template;
}

function createBlogGuideTemplate(templateId: StarterTemplateId): GuideTemplate {
  const template = getBlogStarterTemplate(templateId);

  return {
    name: `Blog Starter: ${template.label}`,
    description: template.description,
    source: 'blog',
    intro: '',
    content: withGuideWidgets(template.content),
    conclusion: '',
  };
}

export const GUIDE_TEMPLATES = {
  completeGuide: {
    name: 'Complete Category Guide',
    description: 'A full-length category guide with context, criteria, tradeoffs, and a grounded close.',
    source: 'guide',
    intro: `This category tends to overwhelm parents quickly. The product names sound similar, the feature lists are longer than they need to be, and nearly every brand promises to make life dramatically easier.

What most parents need here is not more product information. They need better guidance. At Taylor-Made Baby Co., the goal is to slow the decision down, understand how this category fits real daily life, and separate practical value from marketing noise.`,
    content: withGuideWidgets(`## What This Is

Explain what belongs in this category, how it differs from adjacent products, and what job it is actually supposed to do in daily life.

## Why This Category Feels Overwhelming

This is where you name the noise: long feature lists, brand marketing, friend recommendations, and the way every product page tries to sound essential.

Show why parents often start comparing features before they understand the role the product needs to play.

## What People Get Wrong

Call out the common misses with a calm tone:

- comparing brands before defining the use case
- overvaluing dramatic features
- underestimating space, routine, and setup friction
- assuming more gear means better preparation

## Decision Framework

Offer the shorter decision path first:

- What job does this need to do well?
- Where will it live when it is not in use?
- How often will it leave the house?
- What kind of friction are you actually trying to reduce?
- Will this still make sense in a few months?

## Core Content

### Key types in this category

Break down the major versions parents should understand before they shop. Focus on the differences that change daily use, storage, mobility, safety, and longevity.

### How this works in real life

Describe what this category looks like on a rushed morning, in a smaller home, during recovery, or on a tired errand run. This is where the best choice usually becomes clearer.

### When it is worth buying

Explain the circumstances that make this category genuinely useful. Keep the focus on practical fit, not fear-based reasoning.

### When it may not be necessary

Offer honest permission to skip, delay, borrow, or simplify when the product does not solve enough real friction.

## Final Thought

The best decision in this category usually feels less dramatic than parents expect. It is often the option that fits daily life well and does not ask too much from your space, routine, or budget.

## Takeaways

- Start with the role, not the brand.
- Choose the option that removes the most real-life friction.
- Let clarity beat feature overload every time.`,
),
    conclusion: `The best decision in this category usually feels less dramatic than parents expect. It is often the option that fits daily life well, solves a real problem, and does not ask too much from your space, routine, or budget.

Use this guide as a starting point, then refine the choice around your actual life. That is where clarity begins.

${TMBC_SIGNATURE}`,
  },
  comparisonGuide: {
    name: 'Comparison Guide',
    description: 'A calmer side-by-side framework for comparing two solid options without adding noise.',
    source: 'guide',
    intro: `Comparison guides are useful because parents are rarely choosing between a perfect option and a bad one. More often, they are deciding between two products that both seem reasonable on the surface.

The TMBC approach is to step back from brand marketing and compare how each option performs in real life. Parents do not need a louder winner. They need a calmer way to understand the tradeoffs.`,
    content: withGuideWidgets(`## What This Is

Explain the real decision underneath the comparison. Most parents are not simply comparing two products. They are comparing convenience, longevity, footprint, price, ease of use, or flexibility.

## What People Get Wrong

This is where you point out the habits that make comparisons noisier than they need to be:

- treating one option like the universal winner
- comparing spec sheets before routine
- overvaluing headline features
- forgetting to ask which tradeoff feels easier to live with

## Decision Framework

- Which option fits your actual routine?
- Which one is easier to store, clean, lift, or manage?
- Which tradeoff are you more willing to live with?
- Will this still feel useful in a few months?

## Core Content

### Where the options overlap

Start with what these options do similarly. That gives parents a cleaner baseline and keeps the comparison grounded.

### The core difference

Explain the one or two differences that actually change the buying decision. Focus on use case, not every minor spec.

### Which option fits which lifestyle

Show how the better fit changes depending on routine, storage, travel habits, vehicle size, home layout, and frequency of use.

### Comparison table

**Option A**
- Best for:
- Biggest strength:
- Tradeoff to know:

**Option B**
- Best for:
- Biggest strength:
- Tradeoff to know:

**Bottom line**
- Which option feels easier to live with day after day?

## Final Thought

A good comparison should narrow the choice without making the whole category louder.

## Takeaways

- Compare the real tradeoff, not the marketing mood.
- Let lifestyle fit decide the winner.
- If both still seem close, choose the option that feels easier to manage when you are tired.`,
),
    conclusion: `A good comparison should narrow the choice without creating more noise. When you focus on daily use, space, and long-term fit, the better option usually becomes much easier to see.

If both options still seem close, return to the question of which one works harder for your real life. That is usually the better answer.

${TMBC_SIGNATURE}`,
  },
  decisionFrameworkGuide: {
    name: 'Decision Framework Guide',
    description: 'A framework-first guide for helping parents define the decision before they compare products.',
    source: 'guide',
    intro: `Some baby gear decisions feel hard because parents are trying to make them in the wrong order. They start with brands, reviews, or viral recommendations before they have built a clear framework for the decision itself.

Taylor-Made Baby Co. approaches these moments differently. Before shopping, define the real constraints, the real routine, and the real role this product needs to play.`,
    content: withGuideWidgets(`## What This Is

Clarify what parents are actually deciding. Is the question about convenience, safety, mobility, multi-stage use, ease of setup, or simplifying a crowded category?

## What People Get Wrong

Name the order problem directly:

- starting with brands instead of constraints
- shopping before defining the job
- solving hypothetical problems before present-day ones
- mistaking more options for more clarity

## Decision Framework

- What job does this need to do well?
- What would make this annoying after two weeks?
- What part of your lifestyle matters most here?
- Is this solving a real problem or a hypothetical one?

## Core Content

### Start with daily life

Walk through the day-to-day context first. Explain how the decision changes based on schedule, sleep deprivation, home flow, and how much friction parents can realistically tolerate.

### Look at space, routine, and longevity

These choices usually improve when parents consider storage space, room layout, vehicle size, frequency of use, and how long the product needs to last.

### Red flags that signal a mismatch

Describe the clues that a product is wrong for the family: too large, too complicated, too specialized, too hard to store, too expensive for the value it delivers, or too disconnected from actual routine.

### What a good decision usually looks like

A good decision does not have to feel flashy. It usually feels practical, compatible, and easy to explain in plain language.

## Final Thought

Framework first. Product second. That order solves more confusion than most parents realize.

## Takeaways

- Define the decision before you compare the products.
- Let daily life do more of the talking.
- A clearer framework usually makes the buying process quieter and faster.`,
),
    conclusion: `Framework first. Product second. That order solves more confusion than most parents realize.

When the decision is clear, the buying process tends to get quieter, simpler, and far more useful.

${TMBC_SIGNATURE}`,
  },
  minimalistGuide: {
    name: 'Minimalist Guide',
    description: 'A practical guide for stripping a category down to what actually earns a place in the home.',
    source: 'guide',
    intro: `Minimalist guides are not about buying the fewest products possible. They are about buying with more intention, less pressure, and a better understanding of what actually earns a place in your home.

At TMBC, minimalism means practical clarity. Parents do not need a sparse setup for the sake of aesthetics. They need a setup that works well without creating more clutter, more cost, or more decision fatigue.`,
    content: withGuideWidgets(`## What This Is

Define the real function of this category before discussing quantity, upgrades, or accessories.

## What People Get Wrong

In baby gear, minimalism is often framed as either unrealistic or trendy. In reality, it is simply a way to evaluate what truly supports daily life and what mostly takes up space.

Call out the common misses:

- assuming fewer products means fewer basics
- keeping duplicate solutions just in case
- letting aesthetics or popularity outrank function

## Decision Framework

- Start with the version that covers the core need well.
- Delay add-ons until the need is real.
- Avoid duplicate products solving the same problem.
- Choose compatibility and flexibility over novelty.

## Core Content

### What most parents can skip

List the versions, extras, or add-ons that sound useful but rarely change the experience enough to justify the space or spend for most families.

### What earns its place

Explain what makes an item worth keeping in a more intentional setup. Focus on frequency of use, versatility, ease, and whether it removes real friction.

### When more product creates more friction

More gear can mean more to clean, more to store, more to move, and more to second-guess. Spell out how excess often creates workload rather than relief.

## Final Thought

Minimalism is not deprivation. It is decision quality.

## Takeaways

- Keep what helps.
- Skip what adds noise.
- Let practical use decide what earns a place in the home.`,
),
    conclusion: `A minimalist setup works best when it is shaped by real life, not by pressure to buy everything at once or pressure to own almost nothing.

Keep what helps. Skip what adds noise. That is usually the smarter kind of preparation.

${TMBC_SIGNATURE}`,
  },
  blogTmbcEditorial: createBlogGuideTemplate('tmbcEditorial'),
  blogGuide: createBlogGuideTemplate('guide'),
  blogComparison: createBlogGuideTemplate('comparison'),
  blogFaq: createBlogGuideTemplate('faq'),
  blogChecklist: createBlogGuideTemplate('checklist'),
  blogRegistryGuide: createBlogGuideTemplate('registryGuide'),
  blogProductReview: createBlogGuideTemplate('productReview'),
  blogBestOf: createBlogGuideTemplate('bestOf'),
} as const satisfies Record<string, GuideTemplate>;

export type GuideTemplateId = keyof typeof GUIDE_TEMPLATES;

export const GUIDE_TEMPLATE_OPTIONS: Array<{
  id: GuideTemplateId;
  label: string;
  description?: string;
  source: 'guide' | 'blog';
}> = [
  {
    id: 'completeGuide',
    label: GUIDE_TEMPLATES.completeGuide.name,
    description: GUIDE_TEMPLATES.completeGuide.description,
    source: 'guide',
  },
  {
    id: 'comparisonGuide',
    label: GUIDE_TEMPLATES.comparisonGuide.name,
    description: GUIDE_TEMPLATES.comparisonGuide.description,
    source: 'guide',
  },
  {
    id: 'decisionFrameworkGuide',
    label: GUIDE_TEMPLATES.decisionFrameworkGuide.name,
    description: GUIDE_TEMPLATES.decisionFrameworkGuide.description,
    source: 'guide',
  },
  {
    id: 'minimalistGuide',
    label: GUIDE_TEMPLATES.minimalistGuide.name,
    description: GUIDE_TEMPLATES.minimalistGuide.description,
    source: 'guide',
  },
  {
    id: 'blogTmbcEditorial',
    label: 'TMBC Editorial',
    description: GUIDE_TEMPLATES.blogTmbcEditorial.description,
    source: 'blog',
  },
  {
    id: 'blogGuide',
    label: 'Guide',
    description: GUIDE_TEMPLATES.blogGuide.description,
    source: 'blog',
  },
  {
    id: 'blogComparison',
    label: 'Comparison',
    description: GUIDE_TEMPLATES.blogComparison.description,
    source: 'blog',
  },
  {
    id: 'blogFaq',
    label: 'FAQ',
    description: GUIDE_TEMPLATES.blogFaq.description,
    source: 'blog',
  },
  {
    id: 'blogChecklist',
    label: 'Checklist',
    description: GUIDE_TEMPLATES.blogChecklist.description,
    source: 'blog',
  },
  {
    id: 'blogRegistryGuide',
    label: 'Registry Guide',
    description: GUIDE_TEMPLATES.blogRegistryGuide.description,
    source: 'blog',
  },
  {
    id: 'blogProductReview',
    label: 'Product Review',
    description: GUIDE_TEMPLATES.blogProductReview.description,
    source: 'blog',
  },
  {
    id: 'blogBestOf',
    label: 'Best Of',
    description: GUIDE_TEMPLATES.blogBestOf.description,
    source: 'blog',
  },
];

export const GUIDE_SECTION_SNIPPETS = {
  decisionFramework: {
    name: 'Decision Framework',
    content: `### Decision Framework

Before you compare products, answer these questions:

- What problem does this need to solve in daily life?
- Where will this live when it is not in use?
- How often will you use it in an average week?
- What kind of friction are you trying to reduce?
- Will this still make sense in a few months?`,
  },
  comparisonTable: {
    name: 'Comparison Table',
    content: `### Comparison Table

**Option A**
- Best for:
- Biggest strength:
- Tradeoff to know:

**Option B**
- Best for:
- Biggest strength:
- Tradeoff to know:

**Bottom line**
- Which option fits daily life more naturally?`,
  },
  expertTip: {
    name: 'Expert Tip',
    content: `### Expert Tip

Most parents focus on features first, but daily routines matter far more.

Ask how this product needs to work on a tired Tuesday morning, in your actual space, with your actual storage. That usually tells you more than the marketing ever will.`,
  },
  realLifeScenario: {
    name: 'Real Life Scenario',
    content: `### Real Life Scenario

Picture a weekday with a newborn: one hand full, very little sleep, and almost no patience for extra steps.

Explain how this product performs in that moment. If it feels complicated there, it is probably more complicated than it needs to be.`,
  },
  checklist: {
    name: 'Checklist',
    content: `### Checklist

- Does this fit your space?
- Does this fit your routine?
- Does it solve a real problem?
- Is it easy enough to use when you are tired?
- Will it still make sense after the newborn stage?`,
  },
} as const satisfies Record<string, { name: string; content: string }>;

export type GuideSectionSnippetId = keyof typeof GUIDE_SECTION_SNIPPETS;

export const GUIDE_SECTION_SNIPPET_OPTIONS: Array<{ id: GuideSectionSnippetId; label: string }> = [
  { id: 'decisionFramework', label: GUIDE_SECTION_SNIPPETS.decisionFramework.name },
  { id: 'comparisonTable', label: GUIDE_SECTION_SNIPPETS.comparisonTable.name },
  { id: 'expertTip', label: GUIDE_SECTION_SNIPPETS.expertTip.name },
  { id: 'realLifeScenario', label: GUIDE_SECTION_SNIPPETS.realLifeScenario.name },
  { id: 'checklist', label: GUIDE_SECTION_SNIPPETS.checklist.name },
];
