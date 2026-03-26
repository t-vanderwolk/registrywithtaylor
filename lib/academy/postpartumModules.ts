export type PostpartumAcademyModuleSlug =
  | 'healing-and-recovery'
  | 'feeding-and-lactation'
  | 'rest-and-sleep'
  | 'emotional-wellness-and-identity'
  | 'support-systems';

type PostpartumAcademyCoreSection = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

type PostpartumAcademyProductExample = {
  name: string;
  description: string;
  pros: string[];
};

export type PostpartumAcademyModuleRecord = {
  title: string;
  slug: PostpartumAcademyModuleSlug;
  path: 'postpartum';
  moduleOrder: number;
  totalModules: number;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  intro: string[];
  coreSections: PostpartumAcademyCoreSection[];
  decisionBullets: string[];
  products: PostpartumAcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  nextModuleSlug: PostpartumAcademyModuleSlug | null;
  previousModuleSlug: PostpartumAcademyModuleSlug | null;
  markdownContent: string;
};

type PostpartumAcademyModuleInput = Omit<PostpartumAcademyModuleRecord, 'path' | 'totalModules'>;

const TOTAL_MODULES = 5;
const PLACEHOLDER_IMAGE = '/assets/placeholders/tmbc-guide-image-placeholder.svg';

function createPostpartumModule(module: PostpartumAcademyModuleInput): PostpartumAcademyModuleRecord {
  return {
    ...module,
    path: 'postpartum',
    totalModules: TOTAL_MODULES,
  };
}

export const POSTPARTUM_ACADEMY_MODULES: PostpartumAcademyModuleRecord[] = [
  createPostpartumModule({
    title: 'Healing & Recovery',
    slug: 'healing-and-recovery',
    moduleOrder: 1,
    description:
      'Understand what physical recovery actually looks like, what supports healing, and how to move through the first stretch without pressure to bounce back.',
    subhead: 'What no one fully prepares you for.',
    imagePath: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Soft postpartum recovery editorial image for the Healing & Recovery module.',
    intro: [
      "There's a moment after birth when everything slows down and everything changes.",
      'Your body, your energy, and your emotions all shift at once.',
      'And yet most of the preparation focused on the baby, not on you.',
    ],
    coreSections: [
      {
        title: "What You're Actually Learning in This Module",
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Postpartum recovery essentials and healing support in soft neutral tones.',
        paragraphs: [
          'This is not about doing recovery perfectly. It is about understanding what your body is moving through so you can support it more realistically.',
          'By the end of this module, the goal is to have a steadier picture of physical recovery, what helps healing, what feels normal, and when something deserves more attention.',
        ],
      },
      {
        title: 'The Reality of Recovery',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Calm home recovery space with layered linens and water nearby.',
        paragraphs: [
          'Healing is not linear. Some days feel better. Some days do not. Both can be normal.',
          'The hard part is that recovery often asks for patience at the same exact moment your life has become louder, less predictable, and much more demanding.',
        ],
      },
      {
        title: 'What Actually Helps',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Simple postpartum support station with hydration and comfort items.',
        paragraphs: [
          'Rest, hydration, nourishment, lower pressure, and early support usually help more than any attempt to power through it.',
          'The better question is not "Am I doing this right?" It is "What does my body need today?" That shift changes the tone of recovery in a very real way.',
        ],
      },
    ],
    decisionBullets: [
      'Recovery is not a performance.',
      'Rest, hydration, and nourishment do more than pressure ever will.',
      'Ask what your body needs today instead of whether you are keeping up.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'You do not need a perfect plan.',
    softCtaBody: ['You need permission to recover.'],
    nextModuleSlug: 'feeding-and-lactation',
    previousModuleSlug: null,
    markdownContent: `# Healing & Recovery

What no one fully prepares you for.

---

## Module 1 of 5 · Postpartum

There's a moment after birth when everything slows down.

And everything changes.

Your body.
Your energy.
Your emotions.

And yet most of the preparation focused on the baby.

Not you.

:::pullquote
Postpartum is not something you "bounce back" from.

It is something you move through.
- Taylor-Made Baby Co.
:::

---

## Core Considerations

### What You're Actually Learning in This Module

This is not about doing recovery perfectly.

It is about understanding what your body is going through so you can support it more realistically.

By the end of this module, you should have a steadier picture of:

- what physical recovery actually looks like
- how to support healing without pressure
- what feels normal and what may need more attention
- how to build a more realistic recovery rhythm

![Postpartum recovery essentials and healing support in soft neutral tones.](${PLACEHOLDER_IMAGE})

### The Reality of Recovery

Healing is not linear.

Some days feel better.
Some days do not.

And both can be normal.

:::callout
You are not behind.

You are healing.
:::

![Calm home recovery space with layered linens and water nearby.](${PLACEHOLDER_IMAGE})

### What Actually Helps

What usually helps is less glamorous and more practical:

- rest, often more than you think
- hydration and nourishment
- less pressure on yourself
- asking for support earlier than feels comfortable

The better question is not "Am I doing this right?"

It is:

What does my body need today?

![Simple postpartum support station with hydration and comfort items.](${PLACEHOLDER_IMAGE})

---

## What This Means For You

- Recovery is not a performance.
- Rest, hydration, and nourishment do more than pressure ever will.
- Ask what your body needs today instead of whether you are keeping up.

---

## Before You Move Forward

You do not need a perfect plan.

You need permission to recover.

---

## Next Steps

- Continue to Feeding & Lactation
- Back to Postpartum Path`,
  }),
  createPostpartumModule({
    title: 'Feeding & Lactation',
    slug: 'feeding-and-lactation',
    moduleOrder: 2,
    description:
      'Understand breastfeeding, bottle feeding, and combination feeding with more flexibility, less guilt, and a calmer view of what support actually helps.',
    subhead: 'Without pressure or perfection.',
    imagePath: '/assets/editorial/feeding.png',
    imageAlt: 'Feeding and lactation editorial image for the Feeding & Lactation module.',
    intro: [
      'Feeding your baby is one of the most emotional parts of postpartum.',
      'Because it is not just about nutrition. It is also about expectations, identity, connection, and sometimes stress.',
      'This module is here to make that conversation feel steadier and much less binary.',
    ],
    coreSections: [
      {
        title: "What You're Actually Learning",
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Feeding setup with bottles, burp cloths, and soft neutral styling.',
        paragraphs: [
          'The goal is to understand the basics of breastfeeding, bottle feeding, and combination feeding without turning any of them into a morality test.',
          'You are learning what support helps, what flexibility looks like, and how to adjust when real life moves differently than the original plan.',
        ],
      },
      {
        title: 'The Truth About Feeding',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Calm feeding corner arranged for flexibility and support.',
        paragraphs: [
          'Most families do not follow one perfectly clean path. They adjust, pivot, and learn in real time.',
          'That is not a sign that feeding is going badly. It is usually a sign that feeding is happening in real life, not in a hypothetical version of it.',
        ],
      },
      {
        title: 'What Actually Helps',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Organized feeding supplies and hydration support in a calm home setting.',
        paragraphs: [
          'Understanding your options early, having the right tools ready, lowering the pressure, and asking for support when needed all make a real difference.',
          'Flexibility is not failure. It is often how families arrive at the setup that actually works for the baby and the adults.',
        ],
      },
    ],
    decisionBullets: [
      'There is no one right feeding identity to perform.',
      'Support matters more than forcing a single plan to survive at all costs.',
      'Adjusting the plan is often a sign of responsiveness, not failure.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Feeding is not a test.',
    softCtaBody: ['It is a relationship.'],
    nextModuleSlug: 'rest-and-sleep',
    previousModuleSlug: 'healing-and-recovery',
    markdownContent: `# Feeding & Lactation

Without pressure or perfection.

---

## Module 2 of 5 · Postpartum

Feeding your baby is one of the most emotional parts of postpartum.

Because it is not just about nutrition.

It is also about expectations, identity, connection, and sometimes stress.

:::pullquote
There is no one "right" way to feed your baby.

There is only what works for you and your baby.
:::

---

## Core Considerations

### What You're Actually Learning

This module is here to make the feeding conversation feel steadier and less loaded.

You are learning:

- breastfeeding basics
- bottle feeding strategies
- combination feeding
- how to adjust without guilt

![Feeding setup with bottles, burp cloths, and soft neutral styling.](${PLACEHOLDER_IMAGE})

### The Truth About Feeding

Most families do not follow one perfectly clean path.

They adjust.
They pivot.
They learn in real time.

:::callout
Flexibility is not failure.

It is how this actually works.
:::

![Calm feeding corner arranged for flexibility and support.](${PLACEHOLDER_IMAGE})

### What Actually Helps

What usually helps most:

- understanding your options early
- having the right tools ready
- lowering the pressure
- asking for support when needed

This is where responsiveness matters more than perfection.

![Organized feeding supplies and hydration support in a calm home setting.](${PLACEHOLDER_IMAGE})

---

## What This Means For You

- There is no one right feeding identity to perform.
- Support matters more than forcing a single plan to survive at all costs.
- Adjusting the plan is often a sign of responsiveness, not failure.

---

## Before You Move Forward

Feeding is not a test.

It is a relationship.

---

## Next Steps

- Continue to Rest & Sleep
- Back to Healing & Recovery`,
  }),
  createPostpartumModule({
    title: 'Rest & Sleep',
    slug: 'rest-and-sleep',
    moduleOrder: 3,
    description:
      'Build more realistic expectations, shared responsibility, and a steadier rest rhythm so sleep deprivation feels less personal and more manageable.',
    subhead: 'How to survive it without losing yourself.',
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Rest and sleep editorial image for the Rest & Sleep module.',
    intro: [
      'Sleep gets talked about a lot, but not always honestly.',
      'This phase is not about perfect sleep. It is about getting through it with more support and less self-blame.',
      'The goal is not control. It is a rhythm you can survive without disappearing inside it.',
    ],
    coreSections: [
      {
        title: "What You're Learning",
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Calm bedside setup for postpartum rest with soft lighting.',
        paragraphs: [
          'This module is about realistic sleep expectations, how to structure rest, how to share responsibility, and how to protect your energy when uninterrupted sleep is not on the table.',
          'The point is not to produce a perfect schedule. It is to make exhaustion feel more manageable and less chaotic.',
        ],
      },
      {
        title: 'The Reality',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft nighttime recovery setup with chair, blanket, and lamp.',
        paragraphs: [
          'You will be tired. That is real. But tired does not have to mean unsupported.',
          'Postpartum sleep usually improves when you stop treating it like a control problem and start treating it like a support and rhythm problem instead.',
        ],
      },
      {
        title: 'What Actually Helps',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Supportive overnight care setup with simple essentials close by.',
        paragraphs: [
          'Shared responsibility, realistic expectations, flexible routines, and less pressure to create the perfect schedule all help.',
          'Rest is easier to protect when the household treats it as a real need instead of a bonus you get after everything else is handled.',
        ],
      },
    ],
    decisionBullets: [
      'Sleep deprivation needs support, not shame.',
      'Shared responsibility changes the experience more than perfect scheduling does.',
      'Rest is a real need, even when the day tries to treat it like a luxury.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'You do not need perfect sleep.',
    softCtaBody: ['You need enough support.'],
    nextModuleSlug: 'emotional-wellness-and-identity',
    previousModuleSlug: 'feeding-and-lactation',
    markdownContent: `# Rest & Sleep

How to survive it without losing yourself.

---

## Module 3 of 5 · Postpartum

Sleep gets talked about a lot.

But not always honestly.

Because this phase is not about perfect sleep.

It is about getting through it.

:::pullquote
Sleep in postpartum is not about control.

It is about support and rhythm.
:::

---

## Core Considerations

### What You're Learning

This module is about:

- realistic sleep expectations
- how to structure rest
- how to share responsibilities
- how to protect your energy

The point is not to produce a perfect schedule.

It is to make the exhaustion feel more manageable and less personal.

![Calm bedside setup for postpartum rest with soft lighting.](${PLACEHOLDER_IMAGE})

### The Reality

You will be tired.

That is real.

But there are ways to make that tired feel more manageable.

![Soft nighttime recovery setup with chair, blanket, and lamp.](${PLACEHOLDER_IMAGE})

### What Actually Helps

What usually helps most:

- shared responsibilities
- realistic expectations
- flexible routines
- letting go of the idea of a perfect schedule

:::callout
You do not need perfect sleep.

You need enough support.
:::

![Supportive overnight care setup with simple essentials close by.](${PLACEHOLDER_IMAGE})

---

## What This Means For You

- Sleep deprivation needs support, not shame.
- Shared responsibility changes the experience more than perfect scheduling does.
- Rest is a real need, even when the day tries to treat it like a luxury.

---

## Before You Move Forward

Rest is not something you earn.

It is something you need.

---

## Next Steps

- Continue to Emotional Wellness & Identity
- Back to Feeding & Lactation`,
  }),
  createPostpartumModule({
    title: 'Emotional Wellness & Identity',
    slug: 'emotional-wellness-and-identity',
    moduleOrder: 4,
    description:
      'Understand emotional shifts, identity changes, and the support conversations that make postpartum feel more human and less isolating.',
    subhead: 'The part no one talks about enough.',
    imagePath: '/assets/editorial/notebook-bunny.png',
    imageAlt: 'Emotional wellness editorial image for the Emotional Wellness & Identity module.',
    intro: [
      'Postpartum is not only physical. It is deeply emotional too.',
      'Sometimes the hardest part is not the change itself. It is how unexpected the change can feel while you are in it.',
      'You are not only caring for a baby. You are also becoming a new version of yourself.',
    ],
    coreSections: [
      {
        title: "What You're Learning",
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Notebook, soft textiles, and a calm setting for reflection and support.',
        paragraphs: [
          'This module covers emotional shifts, identity changes, communication with your partner or support system, and how to recognize when you need more support than you currently have.',
          'The goal is not to have everything neatly resolved. It is to make this part of postpartum more nameable, more discussable, and less lonely.',
        ],
      },
      {
        title: 'The Reality',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Quiet postpartum reflection space in warm neutral tones.',
        paragraphs: [
          'You may feel overwhelmed, disconnected, emotional, unsure, or unlike yourself for a while. That can be part of the transition.',
          'What often makes it harder is the pressure to look grateful, steady, or instantly adjusted while so much is changing internally.',
        ],
      },
      {
        title: 'What Actually Helps',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Supportive conversation and emotional care concept in an editorial home setting.',
        paragraphs: [
          'Talking about it, asking for support, lowering expectations, and giving yourself room to adjust all help.',
          'The more honest the support conversation becomes, the less likely you are to mistake emotional overload for some private failure you were supposed to solve alone.',
        ],
      },
    ],
    decisionBullets: [
      'Emotional change is part of postpartum, not evidence that you are doing it badly.',
      'Naming what you feel usually helps more than performing steadiness.',
      'Support becomes more effective once your needs are spoken out loud.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'You do not need to have it together.',
    softCtaBody: ['You need to be supported.'],
    nextModuleSlug: 'support-systems',
    previousModuleSlug: 'rest-and-sleep',
    markdownContent: `# Emotional Wellness & Identity

The part no one talks about enough.

---

## Module 4 of 5 · Postpartum

This phase is not just physical.

It is emotional.

And sometimes unexpected.

:::pullquote
You are not just caring for a baby.

You are becoming a new version of yourself.
:::

---

## Core Considerations

### What You're Learning

This module helps make the emotional side of postpartum more nameable and less isolating.

You are learning about:

- emotional shifts in postpartum
- identity changes
- communication with your partner or support system
- how to recognize when you need more support

![Notebook, soft textiles, and a calm setting for reflection and support.](${PLACEHOLDER_IMAGE})

### The Reality

You may feel overwhelmed, disconnected, emotional, or unsure.

All of that can be part of the transition.

The hard part is often the pressure to look steadier than you actually feel.

:::callout
You are not alone in how you feel.
:::

![Quiet postpartum reflection space in warm neutral tones.](${PLACEHOLDER_IMAGE})

### What Actually Helps

What usually helps most:

- talking about it
- asking for support
- lowering expectations
- giving yourself space to adjust

Support gets more effective once your needs have actual language around them.

![Supportive conversation and emotional care concept in an editorial home setting.](${PLACEHOLDER_IMAGE})

---

## What This Means For You

- Emotional change is part of postpartum, not evidence that you are doing it badly.
- Naming what you feel usually helps more than performing steadiness.
- Support becomes more effective once your needs are spoken out loud.

---

## Before You Move Forward

You do not need to have it together.

You need to be supported.

---

## Next Steps

- Continue to Support Systems
- Back to Rest & Sleep`,
  }),
  createPostpartumModule({
    title: 'Support Systems',
    slug: 'support-systems',
    moduleOrder: 5,
    description:
      'Build the support system around you with more intention, clearer asks, and less guilt so the first stretch does not depend on you carrying everything alone.',
    subhead: 'You were never meant to do this alone.',
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Support systems editorial image for the Support Systems module.',
    intro: [
      'This is the module that changes everything because support is not optional. It is essential.',
      'The difference between overwhelmed and supported is rarely the baby. It is usually the system around the baby and the adults.',
      'This module is about making that system more visible, more practical, and easier to use.',
    ],
    coreSections: [
      {
        title: "What You're Learning",
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Postpartum planning notes centered on support and shared responsibility.',
        paragraphs: [
          'This module covers how to build your support system, who to ask for help, how to communicate your needs, and how to accept help without guilt.',
          'The point is not to make support look polished. It is to make it usable enough that you are not carrying everything by default.',
        ],
      },
      {
        title: 'What Support Can Look Like',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Support network concept with practical help layered around a new family.',
        paragraphs: [
          'Support can come from a partner, family, professionals, or community. It can look emotional, logistical, physical, or practical.',
          'Sometimes the most useful support is not big or dramatic. It is dinner handled, laundry moved, a shift covered, or someone asking what would actually help instead of guessing.',
        ],
      },
      {
        title: 'The Truth',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Calm editorial scene representing shared care and postpartum support.',
        paragraphs: [
          'You were not meant to do everything, know everything, or carry everything.',
          'Postpartum feels very different when help is built in instead of treated like a last resort. Asking for help is not weakness. It is how this works.',
        ],
      },
    ],
    decisionBullets: [
      'Support works better when your needs are specific enough to answer.',
      'Help is easier to receive when you stop treating it like a debt.',
      'The system around you shapes postpartum more than any single product does.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'This is where everything comes together.',
    softCtaBody: ['When you feel supported, everything else becomes easier.'],
    nextModuleSlug: null,
    previousModuleSlug: 'emotional-wellness-and-identity',
    markdownContent: `# Support Systems

You were never meant to do this alone.

---

## Module 5 of 5 · Postpartum

This is the module that changes everything.

Because support is not optional.

It is essential.

:::pullquote
The difference between overwhelmed and supported is rarely the baby.

It is the system around you.
:::

---

## Core Considerations

### What You're Learning

This module helps you make support more visible and more usable.

You are learning:

- how to build your support system
- who to ask for help
- how to communicate your needs
- how to accept help without guilt

![Postpartum planning notes centered on support and shared responsibility.](${PLACEHOLDER_IMAGE})

### What Support Can Look Like

Support can look like:

- partner support
- family support
- professional support
- community support

Sometimes the most useful support is not dramatic.

It is dinner handled, laundry moved, a shift covered, or someone asking what would actually help instead of guessing.

![Support network concept with practical help layered around a new family.](${PLACEHOLDER_IMAGE})

### The Truth

You are not meant to:

- do everything
- know everything
- carry everything

:::callout
Asking for help is not weakness.

It is how this works.
:::

![Calm editorial scene representing shared care and postpartum support.](${PLACEHOLDER_IMAGE})

---

## What This Means For You

- Support works better when your needs are specific enough to answer.
- Help is easier to receive when you stop treating it like a debt.
- The system around you shapes postpartum more than any single product does.

---

## Before You Move Forward

This is where everything comes together.

When you feel supported, everything else becomes easier.

---

## Next Steps

- Continue to Academy Home
- Back to Emotional Wellness & Identity`,
  }),
];

export const POSTPARTUM_ACADEMY_MODULES_BY_SLUG = Object.fromEntries(
  POSTPARTUM_ACADEMY_MODULES.map((module) => [module.slug, module]),
) as Record<PostpartumAcademyModuleSlug, PostpartumAcademyModuleRecord>;

export function isPostpartumAcademyModuleSlug(value: string): value is PostpartumAcademyModuleSlug {
  return value in POSTPARTUM_ACADEMY_MODULES_BY_SLUG;
}

export function getPostpartumAcademyModule(slug: PostpartumAcademyModuleSlug) {
  return POSTPARTUM_ACADEMY_MODULES_BY_SLUG[slug];
}
