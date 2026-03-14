const TMBC_SIGNATURE = `Start with confidence.

XOXO
Taylor`;

export type GuideTemplate = {
  name: string;
  intro: string;
  content: string;
  conclusion: string;
};

export const GUIDE_TEMPLATES = {
  completeGuide: {
    name: 'Complete Category Guide',
    intro: `This category tends to overwhelm parents quickly. The product names sound similar, the feature lists are longer than they need to be, and nearly every brand promises to make life dramatically easier.

What most parents need here is not more product information. They need better guidance. At Taylor-Made Baby Co., the goal is to slow the decision down, understand how this category fits real daily life, and separate practical value from marketing noise.`,
    content: `## Why This Category Feels Overwhelming

This category usually comes with too many opinions and not enough context. Parents hear retailer recommendations, social media favorites, registry advice from friends, and brand messaging that makes every version sound essential.

The result is that families often compare features before they understand the job this product is actually supposed to do. That is usually where the confusion begins.

## Understanding the Category

Before comparing brands or price points, it helps to define the category clearly. A calmer decision starts with understanding what this product is, what problem it solves, and where it shows up in everyday life with a newborn.

### What this category is

Explain what belongs in this category and how it differs from adjacent products that parents often lump together.

### What problem it solves

Describe the practical friction this product is meant to reduce. Keep the focus on function, not hype.

### When parents actually use it

Walk through the moments when this product becomes relevant: the newborn phase, errands, sleep-deprived evenings, travel days, or the first few months at home.

## Key Types in This Category

Break down the major versions parents should understand before they shop. Focus on the differences that affect daily use, storage, mobility, safety, and longevity.

Call out which type tends to work best for which kind of family, and where common confusion tends to happen.

## How These Products Work in Real Life

Daily life is usually where the best choice becomes clearer. Explain what this category looks like on a rushed morning, in a smaller home, during recovery, in a compact trunk, or when one parent is managing multiple tasks at once.

This is the place to connect the product to real routine instead of idealized marketing images.

## How to Think About This Decision

Offer a steady framework parents can use before they buy:

- How does this fit your lifestyle?
- How does it work with your home layout and storage?
- How often will it leave the house?
- Does it need to support travel or everyday neighborhood use?
- Will it still make sense a few months from now?

## Common Mistakes Parents Make

Parents often spend too much time chasing feature lists and not enough time thinking about compatibility.

Some overbuy because they assume more gear means better preparation. Others under-evaluate how space, routine, weight, cleanup, folding, or install friction will feel once baby is actually here.

## What Actually Matters

This is where you narrow the decision to the features that truly change daily life. Highlight what affects usability, safety, convenience, comfort, and long-term value.

Also explain which details sound impressive but rarely change the lived experience for most families.

## When This Product Is Worth Buying

Explain the circumstances that make this category genuinely useful. Focus on practical fit, not fear-based reasoning.

Describe what has to be true for this purchase to make sense in a thoughtful, grounded setup.

## When It May Not Be Necessary

Offer honest guidance about when parents can skip this product, delay it, borrow it, or choose a simpler version.

This section should help families feel permission to buy with intention instead of pressure.

## The Taylor-Made Perspective

At Taylor-Made Baby Co., the goal is not to help parents collect more gear. It is to help them understand what fits their life, their home, and the way they actually plan to move through early parenthood.

Learning before buying leads to better decisions. Better decisions lead to calmer preparation. And calmer preparation usually means less waste, less second-guessing, and more confidence.`,
    conclusion: `The best decision in this category usually feels less dramatic than parents expect. It is often the option that fits daily life well, solves a real problem, and does not ask too much from your space, routine, or budget.

Use this guide as a starting point, then refine the choice around your actual life. That is where clarity begins.

${TMBC_SIGNATURE}`,
  },
  comparisonGuide: {
    name: 'Comparison Guide',
    intro: `Comparison guides are useful because parents are rarely choosing between a perfect option and a bad one. More often, they are deciding between two products that both seem reasonable on the surface.

The TMBC approach is to step back from brand marketing and compare how each option performs in real life. Parents do not need a louder winner. They need a calmer way to understand the tradeoffs.`,
    content: `## What Parents Are Really Comparing

Name the real decision underneath the comparison. Most parents are not simply comparing two products. They are comparing convenience, longevity, footprint, price, ease of use, or flexibility.

## Where the Options Overlap

Start with what these options do similarly. That gives parents a cleaner baseline and keeps the comparison from becoming more dramatic than it needs to be.

## The Core Difference

Explain the one or two differences that actually change the buying decision. Focus on use case, not on every minor spec.

## Which Option Fits Which Lifestyle

Show how the better fit changes depending on routine, storage, travel habits, vehicle size, home layout, and how often the product will be used.

## Comparison Table

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

## What Most Parents Overvalue

Point out the features or promises that sound impressive during research but tend to matter less once baby is here.

## Questions To Ask Before You Choose

- Which option fits your actual routine?
- Which one is easier to store, clean, lift, or manage?
- Which tradeoff are you more willing to live with?
- Will this still feel useful in a few months?

## The Taylor-Made Perspective

The right comparison should leave parents feeling clearer, not more pressured. The goal is not to crown a universal winner. It is to identify which option fits a specific family more naturally.`,
    conclusion: `A good comparison should narrow the choice without creating more noise. When you focus on daily use, space, and long-term fit, the better option usually becomes much easier to see.

If both options still seem close, return to the question of which one works harder for your real life. That is usually the better answer.

${TMBC_SIGNATURE}`,
  },
  decisionFrameworkGuide: {
    name: 'Decision Framework Guide',
    intro: `Some baby gear decisions feel hard because parents are trying to make them in the wrong order. They start with brands, reviews, or viral recommendations before they have built a clear framework for the decision itself.

Taylor-Made Baby Co. approaches these moments differently. Before shopping, define the real constraints, the real routine, and the real role this product needs to play.`,
    content: `## The Decision Behind the Product

Clarify what parents are actually deciding. Is the question about convenience, safety, mobility, multi-stage use, ease of setup, or simplifying a crowded category?

## Start With Daily Life

Walk through the day-to-day context first. Explain how the decision changes based on schedule, sleep deprivation, home flow, and how much friction parents can realistically tolerate.

## Look at Space, Routine, and Longevity

These choices usually improve when parents consider:

- storage space
- room layout
- vehicle size
- frequency of use
- how long the product needs to last

## Questions To Ask Before You Buy

- What job does this need to do well?
- What would make this annoying after two weeks?
- What part of your lifestyle matters most here?
- Is this solving a real problem or a hypothetical one?

## Red Flags That Signal a Mismatch

Describe the clues that a product is wrong for the family: too large, too complicated, too specialized, too hard to store, too expensive for the value it delivers, or too disconnected from actual routine.

## What a Good Decision Usually Looks Like

A good decision does not have to feel flashy. It usually feels practical, compatible, and easy to explain in plain language.

## The Taylor-Made Perspective

Parents make better choices when they understand the decision before they evaluate the product. That shift alone reduces overwhelm and makes it easier to choose with confidence instead of urgency.`,
    conclusion: `Framework first. Product second. That order solves more confusion than most parents realize.

When the decision is clear, the buying process tends to get quieter, simpler, and far more useful.

${TMBC_SIGNATURE}`,
  },
  minimalistGuide: {
    name: 'Minimalist Guide',
    intro: `Minimalist guides are not about buying the fewest products possible. They are about buying with more intention, less pressure, and a better understanding of what actually earns a place in your home.

At TMBC, minimalism means practical clarity. Parents do not need a sparse setup for the sake of aesthetics. They need a setup that works well without creating more clutter, more cost, or more decision fatigue.`,
    content: `## Why Minimalism Gets Misunderstood

In baby gear, minimalism is often framed as either unrealistic or trendy. In reality, it is simply a way to evaluate what truly supports daily life and what mostly takes up space.

## What This Category Actually Needs To Do

Define the real function of this category before discussing quantity, upgrades, or accessories.

## What Most Parents Can Skip

List the versions, extras, or add-ons that sound useful but rarely change the experience enough to justify the space or spend for most families.

## What Earns Its Place

Explain what makes an item worth keeping in a more intentional setup. Focus on frequency of use, versatility, ease, and whether it removes real friction.

## How To Build a Leaner Setup

- Start with the version that covers the core need well.
- Delay add-ons until the need is real.
- Avoid duplicate products solving the same problem.
- Choose compatibility and flexibility over novelty.

## When More Product Creates More Friction

More gear can mean more to clean, more to store, more to move, and more to second-guess. Spell out how excess often creates workload rather than relief.

## The Taylor-Made Perspective

Minimalism is not deprivation. It is decision quality. When parents understand what matters, they can build a calmer setup that feels lighter, more useful, and easier to live with.`,
    conclusion: `A minimalist setup works best when it is shaped by real life, not by pressure to buy everything at once or pressure to own almost nothing.

Keep what helps. Skip what adds noise. That is usually the smarter kind of preparation.

${TMBC_SIGNATURE}`,
  },
} as const satisfies Record<string, GuideTemplate>;

export type GuideTemplateId = keyof typeof GUIDE_TEMPLATES;

export const GUIDE_TEMPLATE_OPTIONS: Array<{ id: GuideTemplateId; label: string }> = [
  { id: 'completeGuide', label: GUIDE_TEMPLATES.completeGuide.name },
  { id: 'comparisonGuide', label: GUIDE_TEMPLATES.comparisonGuide.name },
  { id: 'decisionFrameworkGuide', label: GUIDE_TEMPLATES.decisionFrameworkGuide.name },
  { id: 'minimalistGuide', label: GUIDE_TEMPLATES.minimalistGuide.name },
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
