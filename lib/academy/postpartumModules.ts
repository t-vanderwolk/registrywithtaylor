export type PostpartumAcademyModuleSlug =
  | 'healing-and-recovery'
  | 'first-weeks-home-rhythm'
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

const TOTAL_MODULES = 6;
const BREASTFEEDING_IMAGES = {
  formulaNara: '/assets/breastfeeding/formulanara.png',
  lifestylePump: '/assets/breastfeeding/lifestylepump.png',
  pumpLifestyle: '/assets/breastfeeding/pumplifestyle.png',
  storageBags: '/assets/breastfeeding/storagebags.png',
  storageBottles: '/assets/breastfeeding/storagebottttles.png',
} as const;
const POSTPARTUM_IMAGES = {
  healingIntro: '/assets/editorial/teddy-glow.png',
  healingReality: '/assets/editorial/organize.png',
  healingSupport: '/assets/editorial/babyroom.png',
  restIntro: '/assets/editorial/babyincrib.png',
  restReality: '/assets/editorial/teddy-glow.png',
  restSupport: '/assets/editorial/babyroom.png',
  emotionalIntro: '/assets/editorial/notebook-bunny.png',
  emotionalReality: '/assets/editorial/teddy-glow.png',
  emotionalSupport: '/assets/editorial/bunny-gift.png',
  supportIntro: '/assets/editorial/notebook-bunny.png',
  supportLooksLike: '/assets/editorial/babyroom.png',
  supportTruth: '/assets/editorial/bear-blocks.png',
} as const;

function stripMarkdownSeparators(value: string) {
  return value
    .replace(/^\s*-{3}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function createPostpartumModule(module: PostpartumAcademyModuleInput): PostpartumAcademyModuleRecord {
  return {
    ...module,
    markdownContent: stripMarkdownSeparators(module.markdownContent),
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
        title: 'How recovery gets a clearer map',
        imageSrc: POSTPARTUM_IMAGES.healingIntro,
        imageAlt: 'Postpartum recovery essentials and healing support in soft neutral tones.',
        paragraphs: [
          'This is not about doing recovery perfectly. It is about understanding what your body is moving through so you can support it more realistically.',
          'By the end of this module, the goal is to have a steadier picture of physical recovery, what helps healing, what feels normal, and when something deserves more attention.',
        ],
      },
      {
        title: 'The Reality of Recovery',
        imageSrc: POSTPARTUM_IMAGES.healingReality,
        imageAlt: 'Calm home recovery space with layered linens and water nearby.',
        paragraphs: [
          'Healing is not linear. Some days feel better. Some days do not. Both can be normal.',
          'The hard part is that recovery often asks for patience at the same exact moment your life has become louder, less predictable, and much more demanding.',
        ],
      },
      {
        title: 'Support that helps recovery feel more realistic',
        imageSrc: POSTPARTUM_IMAGES.healingSupport,
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
    nextModuleSlug: 'first-weeks-home-rhythm',
    previousModuleSlug: null,
    markdownContent: `# Healing & Recovery

What no one fully prepares you for.

## Module 1 of 6 · Postpartum

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

## Signature Decision Map

### How Recovery Gets A Clearer Map

This is not about doing recovery perfectly.

It is about understanding what your body is going through so you can support it more realistically.

By the end of this module, you should have a steadier picture of:

- what physical recovery actually looks like
- how to support healing without pressure
- what feels normal and what may need more attention
- how to build a more realistic recovery rhythm

![Postpartum recovery essentials and healing support in soft neutral tones.](${POSTPARTUM_IMAGES.healingIntro})

### The Reality of Recovery

Healing is not linear.

Some days feel better.
Some days do not.

And both can be normal.

:::callout
You are not behind.

You are healing.
:::

![Calm home recovery space with layered linens and water nearby.](${POSTPARTUM_IMAGES.healingReality})

### Support That Helps Recovery Feel More Realistic

What usually helps is less glamorous and more practical:

- rest, often more than you think
- hydration and nourishment
- less pressure on yourself
- asking for support earlier than feels comfortable

The better question is not "Am I doing this right?"

It is:

What does my body need today?

![Simple postpartum support station with hydration and comfort items.](${POSTPARTUM_IMAGES.healingSupport})

## What This Means For You

- Recovery is not a performance.
- Rest, hydration, and nourishment do more than pressure ever will.
- Ask what your body needs today instead of whether you are keeping up.

## Before You Move Forward

You do not need a perfect plan.

You need permission to recover.

## Next Steps

- Continue to First-Weeks Home Rhythm
- Back to Postpartum Path`,
  }),
  createPostpartumModule({
    title: 'First-Weeks Home Rhythm',
    slug: 'first-weeks-home-rhythm',
    moduleOrder: 2,
    description:
      'Plan how recovery, feeding, rest, visitors, meals, and household logistics actually move through the house so the first stretch feels more workable and less improvised.',
    subhead: 'The house needs a rhythm before it needs perfection.',
    imagePath: '/assets/editorial/babyroom.png',
    imageAlt: 'First-weeks home rhythm editorial image for the First-Weeks Home Rhythm module.',
    intro: [
      'The first weeks at home are rarely hard because you forgot one magical product.',
      'They are hard because recovery, feeding, dishes, sleep, visitors, and basic household decisions all start colliding in the same rooms at the same time.',
      'This module is about building a home rhythm that supports the adults as much as the baby.',
    ],
    coreSections: [
      {
        title: 'How the first weeks move through the house',
        imageSrc: '/assets/editorial/babyroom.png',
        imageAlt: 'Calm postpartum home setup with recovery, feeding, and household stations.',
        paragraphs: [
          'The goal is to think through how the first weeks will move through your home before you are too tired to redesign it politely.',
          'You are learning where the repeated jobs happen, what needs to stay within reach, and which support systems matter more than one more basket ever will.',
        ],
      },
      {
        title: 'The Reality of the First Stretch',
        imageSrc: '/assets/editorial/feeding.png',
        imageAlt: 'Editorial scene showing the repeated rhythm of feeding, resting, and resetting at home.',
        paragraphs: [
          'The first weeks are usually a loop of feeding, recovery, rest, cleanup, and trying to remember whether anyone has eaten recently.',
          'When the household expects perfect flow immediately, everything feels more chaotic. When the house is set up for repetition, the same days usually feel more survivable.',
        ],
      },
      {
        title: 'Support that keeps the loop repeatable',
        imageSrc: '/assets/editorial/organize.png',
        imageAlt: 'Simple home rhythm setup with hydration, snacks, laundry flow, and support notes.',
        paragraphs: [
          'Anchor stations, meal support, visible essentials, lower expectations, and clear help from other adults usually matter more than trying to keep the whole house functioning at pre-baby standards.',
          'A human note belongs here too: if the feeding or recovery part feels physically or emotionally harder than expected, that is a good time to bring in your pediatrician, IBCLC, or another trusted provider.',
        ],
      },
    ],
    decisionBullets: [
      'Build the house around repeated jobs, not ideal routines.',
      'Keep recovery, feeding, and hydration support within easy reach.',
      'Let meal help, laundry help, and visitor boundaries count as real support.',
      'Lower the bar for household performance while the new rhythm is being built.',
      'Ask for clinical or emotional support early when the stretch feels heavier than expected.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'The first weeks do not need to look polished.',
    softCtaBody: ['They need to feel supported enough to repeat.'],
    nextModuleSlug: 'feeding-and-lactation',
    previousModuleSlug: 'healing-and-recovery',
    markdownContent: `# First-Weeks Home Rhythm

The house needs a rhythm before it needs perfection.

## Module 2 of 6 · Postpartum

The first weeks at home are rarely hard because one tiny product was missing.

They are hard because recovery, feeding, dishes, sleep, visitors, and basic household logistics all start happening at once.

This module is about making the house easier to live in while that new rhythm is still taking shape.

:::pullquote
You do not need the house to run beautifully.

You need it to support the adults holding the whole thing together.
:::

## Signature Decision Map

### How The First Weeks Move Through The House

You are learning how the first weeks move through the home in real life:

- where recovery happens
- where feeding happens
- what needs to stay within reach
- what support should be arranged before everyone is tired

![Calm postpartum home setup with recovery, feeding, and household stations.](/assets/editorial/babyroom.png)

### The Reality of the First Stretch

The early weeks are usually a loop:

- feeding
- recovering
- resetting the space
- finding small pockets of rest

That rhythm is repetitive, not elegant.

When the house is set up for repetition, the days usually feel more manageable.

![Editorial scene showing the repeated rhythm of feeding, resting, and resetting at home.](/assets/editorial/feeding.png)

### Support That Keeps The Loop Repeatable

What usually helps most:

- anchor stations with visible essentials
- meal support
- lower housekeeping expectations
- clear visitor boundaries
- asking for support before things feel unmanageable

If the feeding or recovery part feels physically or emotionally harder than expected, this is also a good time to bring in your pediatrician, IBCLC, or another trusted provider.

![Simple home rhythm setup with hydration, snacks, laundry flow, and support notes.](/assets/editorial/organize.png)

## What This Means For You

- Build the house around repeated jobs, not ideal routines.
- Keep recovery, feeding, and hydration support close by.
- Let practical household help count as real support.
- Lower the bar for what the house needs to look like while the rhythm is forming.
- Bring in trusted support early when the first stretch feels heavier than expected.

## Before You Move Forward

The first weeks do not need to look polished.

They need to feel supported enough to repeat.

## Next Steps

- Continue to Feeding & Lactation
- Back to Healing & Recovery`,
  }),
  createPostpartumModule({
    title: 'Feeding & Lactation',
    slug: 'feeding-and-lactation',
    moduleOrder: 3,
    description:
      'Move through breastfeeding, bottle feeding, and combination feeding with more support, less pressure, and a steadier response when the original feeding plan changes.',
    subhead: 'More support, less pressure.',
    imagePath: BREASTFEEDING_IMAGES.formulaNara,
    imageAlt: 'Flexible feeding setup image for the Feeding & Lactation module.',
    intro: [
      'Feeding your baby is one of the most emotional parts of postpartum.',
      'Because it is not just about nutrition. It is also about recovery, expectations, identity, connection, and sometimes grief when the plan changes.',
      'This module is not the gear conversation. It is the support conversation.',
      'It is here to make feeding feel steadier, more flexible, and much less loaded.',
    ],
    coreSections: [
      {
        title: 'This is about feeding, not proving anything',
        imageSrc: BREASTFEEDING_IMAGES.lifestylePump,
        imageAlt: 'Feeding moment shown in a real postpartum setting.',
        paragraphs: [
          'The goal is to make room for breastfeeding, bottle feeding, formula feeding, or combination feeding without turning any of them into a morality test.',
          'You are learning how to separate feeding from performance, how to stay responsive when the plan shifts, and how to keep the baby and the adults in the conversation at the same time.',
        ],
      },
      {
        title: 'Most feeding plans change in real life',
        imageSrc: BREASTFEEDING_IMAGES.formulaNara,
        imageAlt: 'Combination or formula feeding shown as a real-life feeding path.',
        paragraphs: [
          'Many families start with one idea and end up adjusting around latch, supply, recovery, work, sleep, baby preference, or simple sustainability.',
          'That does not mean the feeding relationship failed. It usually means the original plan met real life and needed to become more honest.',
        ],
      },
      {
        title: 'Bring support in before feeding feels unsustainable',
        imageSrc: BREASTFEEDING_IMAGES.storageBottles,
        imageAlt: 'Simple feeding setup organized to reduce friction during the postpartum stretch.',
        paragraphs: [
          'What usually helps most is lower pressure, more observation, more rest support, and bringing in your pediatrician, IBCLC, or another trusted provider before the situation feels fully unsustainable.',
          'When feeding becomes physically painful, emotionally heavy, or logistically chaotic, more support usually helps faster than more self-blame.',
        ],
      },
    ],
    decisionBullets: [
      'Feed the baby, not the identity story.',
      'Changes in plan are common and do not mean you failed.',
      'Bring in support earlier when feeding feels physically or emotionally hard.',
      'A recovering adult is part of the feeding equation too.',
    ],
    products: [],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Feeding is not a test.',
    softCtaBody: ['It is a relationship.'],
    nextModuleSlug: 'rest-and-sleep',
    previousModuleSlug: 'first-weeks-home-rhythm',
    markdownContent: `# Feeding & Lactation

More support, less pressure.

## Module 3 of 6 · Postpartum

Feeding your baby is one of the most emotional parts of postpartum.

Because it is not just about nutrition.

It is also about recovery, expectations, identity, connection, and sometimes grief when the plan changes.

This module is not the gear conversation.

It is the support conversation.

:::pullquote
There is no one "right" way to feed your baby.

There is only what works for you and your baby.
:::

## Signature Decision Map

### This Is About Feeding, Not Proving Anything

This module is here to make feeding feel steadier and less loaded.

You are making room for breastfeeding, bottle feeding, formula feeding, or combination feeding without turning any of them into a morality test.

You are learning how to stay responsive when the plan shifts, how to protect the adult part of the equation, and how to stop treating feeding like a performance review.

![Feeding moment shown in a real postpartum setting.](${BREASTFEEDING_IMAGES.lifestylePump})

### Most Feeding Plans Change In Real Life

Most families do not follow one perfectly clean path.

They adjust around latch, supply, recovery, work, sleep, baby preference, or simple sustainability.

:::callout
Changing the plan is not a sign that feeding went wrong.

It is usually a sign that the plan met real life.
:::

![Combination or formula feeding shown as a real-life feeding path.](${BREASTFEEDING_IMAGES.formulaNara})

### Bring Support In Before Feeding Feels Unsustainable

What usually helps most:

- lower pressure
- more observation
- more rest support
- bringing in your pediatrician, IBCLC, or another trusted provider before the situation feels fully unsustainable

When feeding becomes physically painful, emotionally heavy, or logistically chaotic, more support usually helps faster than more self-blame.

![Simple feeding setup organized to reduce friction during the postpartum stretch.](${BREASTFEEDING_IMAGES.storageBottles})

## What This Means For You

- Feed the baby, not the identity story.
- Changes in plan are common and do not mean you failed.
- Bring in support earlier when feeding feels physically or emotionally hard.
- A recovering adult is part of the feeding equation too.

## Before You Move Forward

Feeding is not a test.

It is a relationship.

## Next Steps

- Continue to Rest & Sleep
- Back to First-Weeks Home Rhythm`,
  }),
  createPostpartumModule({
    title: 'Rest & Sleep',
    slug: 'rest-and-sleep',
    moduleOrder: 4,
    description:
      'Build more realistic expectations, shared responsibility, and a steadier rest rhythm so sleep deprivation feels less personal and more manageable.',
    subhead: 'How to survive it without losing yourself.',
    imagePath: '/assets/editorial/babyincrib.png',
    imageAlt: 'Baby resting in crib editorial image for the Rest & Sleep module.',
    intro: [
      'Sleep gets talked about a lot, but not always honestly.',
      'This phase is not about perfect sleep. It is about getting through it with more support and less self-blame.',
      'The goal is not control. It is a rhythm you can survive without disappearing inside it.',
    ],
    coreSections: [
      {
        title: 'How rest becomes a shared plan',
        imageSrc: POSTPARTUM_IMAGES.restIntro,
        imageAlt: 'Calm bedside setup for postpartum rest with soft lighting.',
        paragraphs: [
          'This module is about realistic sleep expectations, how to structure rest, how to share responsibility, and how to protect your energy when uninterrupted sleep is not on the table.',
          'The point is not to produce a perfect schedule. It is to make exhaustion feel more manageable and less chaotic.',
        ],
      },
      {
        title: 'The Reality',
        imageSrc: POSTPARTUM_IMAGES.restReality,
        imageAlt: 'Soft nighttime recovery setup with chair, blanket, and lamp.',
        paragraphs: [
          'You will be tired. That is real. But tired does not have to mean unsupported.',
          'Postpartum sleep usually improves when you stop treating it like a control problem and start treating it like a support and rhythm problem instead.',
        ],
      },
      {
        title: 'Support that protects rest',
        imageSrc: POSTPARTUM_IMAGES.restSupport,
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

## Module 4 of 6 · Postpartum

Sleep gets talked about a lot.

But not always honestly.

Because this phase is not about perfect sleep.

It is about getting through it.

:::pullquote
Sleep in postpartum is not about control.

It is about support and rhythm.
:::

## Signature Decision Map

### How Rest Becomes A Shared Plan

This module is about:

- realistic sleep expectations
- how to structure rest
- how to share responsibilities
- how to protect your energy

The point is not to produce a perfect schedule.

It is to make the exhaustion feel more manageable and less personal.

![Calm bedside setup for postpartum rest with soft lighting.](${POSTPARTUM_IMAGES.restIntro})

### The Reality

You will be tired.

That is real.

But there are ways to make that tired feel more manageable.

![Soft nighttime recovery setup with chair, blanket, and lamp.](${POSTPARTUM_IMAGES.restReality})

### Support That Protects Rest

What usually helps most:

- shared responsibilities
- realistic expectations
- flexible routines
- letting go of the idea of a perfect schedule

:::callout
You do not need perfect sleep.

You need enough support.
:::

![Supportive overnight care setup with simple essentials close by.](${POSTPARTUM_IMAGES.restSupport})

## What This Means For You

- Sleep deprivation needs support, not shame.
- Shared responsibility changes the experience more than perfect scheduling does.
- Rest is a real need, even when the day tries to treat it like a luxury.

## Before You Move Forward

Rest is not something you earn.

It is something you need.

## Next Steps

- Continue to Emotional Wellness & Identity
- Back to Feeding & Lactation`,
  }),
  createPostpartumModule({
    title: 'Emotional Wellness & Identity',
    slug: 'emotional-wellness-and-identity',
    moduleOrder: 5,
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
        title: 'How to name the emotional shift',
        imageSrc: POSTPARTUM_IMAGES.emotionalIntro,
        imageAlt: 'Notebook, soft textiles, and a calm setting for reflection and support.',
        paragraphs: [
          'This module covers emotional shifts, identity changes, communication with your partner or support system, and how to recognize when you need more support than you currently have.',
          'The goal is not to have everything neatly resolved. It is to make this part of postpartum more nameable, more discussable, and less lonely.',
        ],
      },
      {
        title: 'The Reality',
        imageSrc: POSTPARTUM_IMAGES.emotionalReality,
        imageAlt: 'Quiet postpartum reflection space in warm neutral tones.',
        paragraphs: [
          'You may feel overwhelmed, disconnected, emotional, unsure, or unlike yourself for a while. That can be part of the transition.',
          'What often makes it harder is the pressure to look grateful, steady, or instantly adjusted while so much is changing internally.',
        ],
      },
      {
        title: 'Support that makes the shift less lonely',
        imageSrc: POSTPARTUM_IMAGES.emotionalSupport,
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

## Module 5 of 6 · Postpartum

This phase is not just physical.

It is emotional.

And sometimes unexpected.

:::pullquote
You are not just caring for a baby.

You are becoming a new version of yourself.
:::

## Signature Decision Map

### How To Name The Emotional Shift

This module helps make the emotional side of postpartum more nameable and less isolating.

You are learning about:

- emotional shifts in postpartum
- identity changes
- communication with your partner or support system
- how to recognize when you need more support

![Notebook, soft textiles, and a calm setting for reflection and support.](${POSTPARTUM_IMAGES.emotionalIntro})

### The Reality

You may feel overwhelmed, disconnected, emotional, or unsure.

All of that can be part of the transition.

The hard part is often the pressure to look steadier than you actually feel.

:::callout
You are not alone in how you feel.
:::

![Quiet postpartum reflection space in warm neutral tones.](${POSTPARTUM_IMAGES.emotionalReality})

### Support That Makes The Shift Less Lonely

What usually helps most:

- talking about it
- asking for support
- lowering expectations
- giving yourself space to adjust

Support gets more effective once your needs have actual language around them.

![Supportive conversation and emotional care concept in an editorial home setting.](${POSTPARTUM_IMAGES.emotionalSupport})

## What This Means For You

- Emotional change is part of postpartum, not evidence that you are doing it badly.
- Naming what you feel usually helps more than performing steadiness.
- Support becomes more effective once your needs are spoken out loud.

## Before You Move Forward

You do not need to have it together.

You need to be supported.

## Next Steps

- Continue to Support Systems
- Back to Rest & Sleep`,
  }),
  createPostpartumModule({
    title: 'Support Systems',
    slug: 'support-systems',
    moduleOrder: 6,
    description:
      'Build the support system around you with more intention, clearer asks, and less guilt so the first stretch does not depend on you carrying everything alone.',
    subhead: 'You were never meant to do this alone.',
    imagePath: '/assets/editorial/bear-blocks.png',
    imageAlt: 'Support systems editorial image for the Support Systems module.',
    intro: [
      'This is the module that changes everything because support is not optional. It is essential.',
      'The difference between overwhelmed and supported is rarely the baby. It is usually the system around the baby and the adults.',
      'This module is about making that system more visible, more practical, and easier to use.',
    ],
    coreSections: [
      {
        title: 'How to make help specific enough to use',
        imageSrc: POSTPARTUM_IMAGES.supportIntro,
        imageAlt: 'Postpartum planning notes centered on support and shared responsibility.',
        paragraphs: [
          'This module covers how to build your support system, who to ask for help, how to communicate your needs, and how to accept help without guilt.',
          'The point is not to make support look polished. It is to make it usable enough that you are not carrying everything by default.',
        ],
      },
      {
        title: 'What Support Can Look Like',
        imageSrc: POSTPARTUM_IMAGES.supportLooksLike,
        imageAlt: 'Support network concept with practical help layered around a new family.',
        paragraphs: [
          'Support can come from a partner, family, professionals, or community. It can look emotional, logistical, physical, or practical.',
          'Sometimes the most useful support is not big or dramatic. It is dinner handled, laundry moved, a shift covered, or someone asking what would actually help instead of guessing.',
        ],
      },
      {
        title: 'The Truth',
        imageSrc: POSTPARTUM_IMAGES.supportTruth,
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

## Module 6 of 6 · Postpartum

This is the module that changes everything.

Because support is not optional.

It is essential.

:::pullquote
The difference between overwhelmed and supported is rarely the baby.

It is the system around you.
:::

## Signature Decision Map

### How To Make Help Specific Enough To Use

This module helps you make support more visible and more usable.

You are learning:

- how to build your support system
- who to ask for help
- how to communicate your needs
- how to accept help without guilt

![Postpartum planning notes centered on support and shared responsibility.](${POSTPARTUM_IMAGES.supportIntro})

### What Support Can Look Like

Support can look like:

- partner support
- family support
- professional support
- community support

Sometimes the most useful support is not dramatic.

It is dinner handled, laundry moved, a shift covered, or someone asking what would actually help instead of guessing.

![Support network concept with practical help layered around a new family.](${POSTPARTUM_IMAGES.supportLooksLike})

### The Truth

You are not meant to:

- do everything
- know everything
- carry everything

:::callout
Asking for help is not weakness.

It is how this works.
:::

![Calm editorial scene representing shared care and postpartum support.](${POSTPARTUM_IMAGES.supportTruth})

## What This Means For You

- Support works better when your needs are specific enough to answer.
- Help is easier to receive when you stop treating it like a debt.
- The system around you shapes postpartum more than any single product does.

## Before You Move Forward

This is where everything comes together.

When you feel supported, everything else becomes easier.

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
