import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';

type EducationHubStat = {
  label: string;
  value: string;
};

type EducationHubHighlight = {
  label: string;
  text: string;
};

type EducationHubDecisionCard = GuideHubLink & {
  ctaLabel?: string;
};

type EducationHubPathStep = {
  title: string;
  description: string;
  icon: GuideHubIconKey;
};

export type FutureGuideHubSlug = 'essentials' | 'feeding' | 'postpartum';

export type FutureGuideHubConfig = {
  path: `/guides/${FutureGuideHubSlug}`;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  stats: EducationHubStat[];
  highlights: EducationHubHighlight[];
  plannedTopics: string[];
  continueTitle: string;
  continueDescription: string;
  continueLinks: GuideHubLink[];
};

const GUIDE_PATHS = {
  guidesHub: '/guides',
  registry: getGuidePath({ slug: 'minimalist-baby-registry' }),
  strollers: getGuidePath({ slug: 'best-strollers' }),
  carSeats: getGuidePath({ slug: 'best-infant-car-seats' }),
  nursery: getGuidePath({ slug: 'nursery-setup-guide' }),
  travel: getGuidePath({ slug: 'travel-with-baby' }),
  essentials: '/guides/essentials' as const,
  feeding: '/guides/feeding' as const,
  postpartum: '/guides/postpartum' as const,
} as const;

export const guidesEducationHubContent = {
  hero: {
    eyebrow: 'TMBC Education Hub',
    title: 'Guides for Real-Life Baby Prep',
    description:
      'Clear, practical guidance to help you choose what actually fits your life, not just what looks good on a list.',
    note: "Start where you are. We'll help you figure out the rest.",
    stats: [
      { label: 'Category hubs', value: '6 calm entry points' },
      { label: 'Start paths', value: '4 guided ways in' },
      { label: 'Built for', value: 'Real-life decisions' },
    ] satisfies EducationHubStat[],
    highlights: [
      {
        label: 'TMBC lens',
        text: 'The goal is not more information. It is knowing what matters next.',
      },
      {
        label: 'How it feels',
        text: 'Less tab chaos, less guessing, and a cleaner path through the big decisions.',
      },
    ] satisfies EducationHubHighlight[],
  },
  startHere: {
    eyebrow: 'Start here',
    title: "Tell us where you are. We'll guide the next step.",
    description:
      'Choose the decision that feels most immediate, then move into the hub that makes the category easier to understand.',
    cards: [
      {
        title: "I'm building my baby registry",
        description: 'You want the list to make sense before it turns into a second job.',
        bestFor: 'Sorting what belongs now, what can wait, and what is mostly taking up registry space.',
        href: GUIDE_PATHS.registry,
        icon: 'checklist',
        ctaLabel: 'Start with registry planning',
      },
      {
        title: "I'm choosing big gear",
        description: 'You are deciding between the bulky, expensive things that somehow all claim to be essential.',
        bestFor: 'Strollers, car seats, and the gear choices that shape everyday life first.',
        href: GUIDE_PATHS.strollers,
        icon: 'stroller',
        ctaLabel: 'Open the big gear hub',
      },
      {
        title: "I'm planning my nursery",
        description: 'You want the room to work at 2:14 AM, not just in the photos.',
        bestFor: 'Layout, storage, sleep setup, and what actually earns a place in the room.',
        href: GUIDE_PATHS.nursery,
        icon: 'home',
        ctaLabel: 'Explore nursery guidance',
      },
      {
        title: 'I just want to understand what I actually need',
        description: 'You would like fewer tabs, fewer opinions, and a clearer baseline.',
        bestFor: 'A calmer essentials filter before the smaller decisions start multiplying.',
        href: GUIDE_PATHS.essentials,
        icon: 'book',
        ctaLabel: 'See the essentials hub',
      },
    ] satisfies EducationHubDecisionCard[],
  },
  categoryGrid: {
    eyebrow: 'Category hubs',
    title: 'Explore the category that needs clarity first.',
    description:
      'Each hub starts broad, explains the category, and then helps you move into the right next comparison without feeling buried.',
    cards: [
      {
        title: 'Strollers',
        description: 'Understand the stroller lanes before comparing models.',
        bestFor: 'Everyday vs compact vs travel, plus what changes with storage, terrain, and second-child planning.',
        href: GUIDE_PATHS.strollers,
        icon: 'stroller',
        ctaLabel: 'Explore Guides',
      },
      {
        title: 'Car Seats',
        description: 'Make the stages feel less intimidating.',
        bestFor: 'How infant, convertible, all-in-one, and booster paths fit your child, your car, and your routine.',
        href: GUIDE_PATHS.carSeats,
        icon: 'carseat',
        ctaLabel: 'Explore Guides',
      },
      {
        title: 'Nursery',
        description: 'Plan the room around how you will actually use it.',
        bestFor: 'Sleep setup, room flow, storage, and what helps the space feel calmer instead of fuller.',
        href: GUIDE_PATHS.nursery,
        icon: 'home',
        ctaLabel: 'Explore Guides',
      },
      {
        title: 'Feeding',
        description: 'Sort feeding gear without building a cart out of panic.',
        bestFor: 'Bottle basics, pump support, everyday setup, and what most families can decide later.',
        href: GUIDE_PATHS.feeding,
        icon: 'bag',
        ctaLabel: 'Explore Guides',
      },
      {
        title: 'Travel',
        description: 'Prep for errands, road trips, flights, and leaving the house with less drama.',
        bestFor: 'Travel-friendly gear, packing logic, and how portability changes the rest of your setup.',
        href: GUIDE_PATHS.travel,
        icon: 'plane',
        ctaLabel: 'Explore Guides',
      },
      {
        title: 'Postpartum',
        description: 'Make room for the adults in the prep plan too.',
        bestFor: 'Recovery support, home readiness, and what actually helps in the first weeks.',
        href: GUIDE_PATHS.postpartum,
        icon: 'layers',
        ctaLabel: 'Explore Guides',
      },
    ] satisfies EducationHubDecisionCard[],
  },
  learningPath: {
    eyebrow: 'How to use TMBC guides',
    title: 'A simple way to move through the system.',
    description:
      'The guides are designed to help you start with your real situation, understand the category, and then narrow the decision without spiraling.',
    steps: [
      {
        title: 'Start with your situation',
        description: 'Begin with the question that feels immediate, not with the longest list on the internet.',
        icon: 'checklist',
      },
      {
        title: 'Understand the category',
        description: 'Use the hub to learn the lanes, tradeoffs, and what actually changes your choice.',
        icon: 'book',
      },
      {
        title: 'Narrow your decision',
        description: 'Move into the right sub-guide once the category is clearer and the options finally make sense.',
        icon: 'strategy',
      },
    ] satisfies EducationHubPathStep[],
  },
  featured: {
    title: 'Most Helpful Guides Right Now',
    description: 'A few strong starting points if you want to keep moving.',
    links: [
      {
        title: 'Nursery Guide',
        description: 'Start with room flow, storage, and the setup that makes the first routines easier to live with.',
        href: GUIDE_PATHS.nursery,
        icon: 'home',
      },
      {
        title: 'Feeding Guide',
        description: 'Continue into feeding setup once the room plan is steady and the daily workflow is easier to picture.',
        href: GUIDE_PATHS.feeding,
        icon: 'bag',
      },
      {
        title: 'Registry Strategy',
        description: 'Use registry setup logic to choose where to register before the perks and store dashboards start leading the plan.',
        href: '/guides/registry/where-to-register',
        icon: 'strategy',
      },
      {
        title: 'Stroller Guide',
        description: 'Move into stroller decisions after the planning foundations are clear enough to compare the right lane.',
        href: GUIDE_PATHS.strollers,
        icon: 'stroller',
      },
    ] satisfies GuideHubLink[],
  },
} as const;

const futureGuideHubConfigs: Record<FutureGuideHubSlug, FutureGuideHubConfig> = {
  essentials: {
    path: GUIDE_PATHS.essentials,
    eyebrow: 'TMBC Essentials Hub',
    title: 'What you actually need, before the list gets loud.',
    description:
      'This hub is being built to help parents sort the true essentials from the categories that can wait, flex, or stay off the list entirely.',
    note: 'Better baby prep usually starts with fewer assumptions, not more products.',
    stats: [
      { label: 'Status', value: 'Growing now' },
      { label: 'Best next step', value: 'Start with registry planning' },
    ],
    highlights: [
      {
        label: 'What it will cover',
        text: 'The first-weeks baseline, category priorities, and where most lists overreach.',
      },
    ],
    plannedTopics: [
      'What belongs in the first-weeks category and what can wait.',
      'How to spot duplicate categories before they multiply.',
      'Where space, budget, and gifting should change the list.',
    ],
    continueTitle: 'Start here while the essentials hub is growing.',
    continueDescription: 'These guides will give you the clearest next step right now.',
    continueLinks: [
      {
        title: 'Registry Guide',
        description: 'Build a smarter list around timing, function, and what actually earns space.',
        href: GUIDE_PATHS.registry,
        icon: 'checklist',
      },
      {
        title: 'Nursery Guide',
        description: 'See how room setup changes what you need close at hand and what can live elsewhere.',
        href: GUIDE_PATHS.nursery,
        icon: 'home',
      },
      {
        title: 'Stroller Guide',
        description: 'If big gear is driving the list, start with the category that usually creates the most tab sprawl.',
        href: GUIDE_PATHS.strollers,
        icon: 'stroller',
      },
    ],
  },
  feeding: {
    path: GUIDE_PATHS.feeding,
    eyebrow: 'TMBC Feeding Hub',
    title: 'A calmer way to sort feeding gear and feeding setup.',
    description:
      'This hub is being built to help families think through bottles, pumps, storage, and daily feeding flow without turning every decision into an emergency.',
    note: 'Feeding prep should support real life, not produce a drawer full of backup plans you never wanted.',
    stats: [
      { label: 'Status', value: 'Growing now' },
      { label: 'Best next step', value: 'Choose your registry strategy' },
    ],
    highlights: [
      {
        label: 'What it will cover',
        text: 'Bottle planning, pump support, everyday feeding setup, and what can be decided later.',
      },
    ],
    plannedTopics: [
      'What to buy before baby arrives and what is easier to decide later.',
      'How bottle, pump, and storage choices affect daily setup.',
      'Which feeding extras are genuinely helpful and which ones mostly create clutter.',
    ],
    continueTitle: 'Use these guides while the feeding hub comes together.',
    continueDescription: 'They keep the path moving from feeding setup into registry strategy and then into bigger gear.',
    continueLinks: [
      {
        title: 'Registry Strategy',
        description: 'Choose where to register before the perks, returns, and platform tradeoffs start influencing the whole plan.',
        href: '/guides/registry/where-to-register',
        icon: 'strategy',
      },
      {
        title: 'Stroller Guide',
        description: 'Move into big-gear comparison after the feeding and registry setup decisions are in better shape.',
        href: GUIDE_PATHS.strollers,
        icon: 'stroller',
      },
      {
        title: 'Nursery Guide',
        description: 'Step back to room flow if feeding stations, storage, and setup still need work.',
        href: GUIDE_PATHS.nursery,
        icon: 'home',
      },
    ],
  },
  postpartum: {
    path: GUIDE_PATHS.postpartum,
    eyebrow: 'TMBC Postpartum Hub',
    title: 'Prep for recovery and real-life support, too.',
    description:
      'This hub is being built to help parents think through recovery, home setup, and the support pieces that make the first weeks feel more manageable.',
    note: 'The baby is not the only one who needs the plan to work.',
    stats: [
      { label: 'Status', value: 'Growing now' },
      { label: 'Best next step', value: 'Start with home setup' },
    ],
    highlights: [
      {
        label: 'What it will cover',
        text: 'Recovery support, room flow, rest-friendly prep, and the basics that help the adults, too.',
      },
    ],
    plannedTopics: [
      'What recovery support is actually helpful in the first weeks.',
      'How nursery flow and home setup affect postpartum life.',
      'Which categories belong on the list because they support the household, not just the baby.',
    ],
    continueTitle: 'These are the best places to start right now.',
    continueDescription: 'They connect most directly to the postpartum decisions families usually face first.',
    continueLinks: [
      {
        title: 'Nursery Guide',
        description: 'Room flow matters more when recovery, feeding, and sleep are all happening in short windows.',
        href: GUIDE_PATHS.nursery,
        icon: 'home',
      },
      {
        title: 'Essentials Hub',
        description: 'Use the essentials filter to cut through the categories and focus on what will help first.',
        href: GUIDE_PATHS.essentials,
        icon: 'book',
      },
      {
        title: 'Registry Guide',
        description: 'A better registry can support recovery and home function instead of only the obvious baby categories.',
        href: GUIDE_PATHS.registry,
        icon: 'checklist',
      },
    ],
  },
};

export function getFutureGuideHubConfig(slug: FutureGuideHubSlug) {
  return futureGuideHubConfigs[slug];
}
