import { stripMarkdown } from '@/lib/blog/contentText';
import type { GuideOutline } from '@/lib/guides/articleOutline';
import { getFutureGuideHubConfig } from '@/lib/guides/educationHub';
import { getGuideNextGuideItems } from '@/lib/guides/hubs';
import type { GuideHubLink } from '@/lib/guides/hubs';
import type { GuideCardItem } from '@/lib/guides/presentation';
import { getGuidePath, getGuideParentSlug } from '@/lib/guides/routing';
import { getRegistrySubGuideBySlug } from '@/lib/guides/registrySubguides';

export const GUIDE_STAGE_LABELS = ['Start', 'Compare', 'Optimize', 'Decide', 'Refine'] as const;

export type GuideStageLabel = (typeof GUIDE_STAGE_LABELS)[number];

export type GuideOrientation = {
  step: GuideStageLabel;
  category: string;
  goal: string;
};

export type StandardGuideSlideItem = {
  id: string;
  label: string;
  shortLabel: string;
};

export function getStandardGuideSlideItems(prefix: string): StandardGuideSlideItem[] {
  return [
    { id: `${prefix}-overview`, label: 'Title + Intro', shortLabel: 'Intro' },
    { id: `${prefix}-you-are-here`, label: 'You Are Here', shortLabel: 'Path' },
    { id: `${prefix}-covers`, label: 'What This Guide Covers', shortLabel: 'Covers' },
    { id: `${prefix}-core-content`, label: 'Core Content', shortLabel: 'Core' },
    { id: `${prefix}-decision`, label: 'Decision Section', shortLabel: 'Decide' },
    { id: `${prefix}-mistakes`, label: 'Common Mistakes', shortLabel: 'Avoid' },
    { id: `${prefix}-next-steps`, label: 'Next Steps', shortLabel: 'Next' },
    { id: `${prefix}-takeaways`, label: 'Takeaways', shortLabel: 'Wrap' },
  ];
}

function sentenceCase(value: string) {
  const cleaned = stripMarkdown(value).trim();
  if (!cleaned) {
    return '';
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function extractMarkdownListItems(content: string, maxItems = 5) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => sentenceCase(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function buildCoverBulletsFromOutline(outline: GuideOutline, maxItems = 5) {
  return outline.sections
    .map((section) => sentenceCase(section.title))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function buildTakeawayBulletsFromOutline(outline: GuideOutline, maxItems = 4) {
  const takeaways = extractMarkdownListItems(
    outline.sections.find((section) => section.title.toLowerCase() === 'takeaways')?.content ?? '',
    maxItems,
  );
  if (takeaways.length > 0) {
    return takeaways;
  }

  return outline.sections
    .map((section) => sentenceCase(section.title))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function dedupeTextItems(items: Array<string | null | undefined>, maxItems = 5) {
  return items
    .map((item) => (item ? sentenceCase(item) : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index)
    .slice(0, maxItems);
}

export function normalizeGuideLinks<T extends { href: string; label?: string; title?: string; description?: string; stage?: GuideStageLabel }>(
  links: T[],
  maxItems = 4,
) {
  return links
    .filter((link) => Boolean(link.href) && Boolean(link.label ?? link.title))
    .map((link) => ({
      href: link.href,
      label: link.label ?? link.title ?? 'Open guide',
      description: link.description?.trim() || 'Use this next when you are ready to keep the decision moving.',
      stage: link.stage,
    }))
    .filter(
      (link, index, collection) =>
        collection.findIndex((candidate) => candidate.href === link.href && candidate.label === link.label) === index,
    )
    .slice(0, maxItems);
}

export function guideHubLinkToNextStepLink(link: GuideHubLink, stage?: GuideStageLabel) {
  return {
    href: link.href,
    label: link.title,
    description: link.description,
    stage,
  };
}

export function guideCardToNextStepLink(card: GuideCardItem, stage?: GuideStageLabel) {
  return {
    href: card.href,
    label: card.title,
    description: card.description,
    stage,
  };
}

export function getGuideOrientation({
  slug,
  category,
  topicCluster,
}: {
  slug: string;
  category?: string | null;
  topicCluster?: string | null;
}): GuideOrientation {
  const registrySubGuide = getRegistrySubGuideBySlug(slug);
  if (registrySubGuide) {
    const guideGoals: Record<string, string> = {
      minimalist: 'Tighten the registry around what actually earns space.',
      essentials: 'Decide what belongs on the first-pass registry first.',
      mistakes: 'Catch the registry choices that create clutter and duplicate spending.',
      'where-to-register': 'Choose the registry platform that fits how your people actually shop.',
      timeline: 'Put purchases in the right order before urgency takes over.',
      perks: 'Use the registry perks without letting the freebies run the plan.',
    };

    return {
      step: 'Refine',
      category: 'Registry',
      goal: guideGoals[slug] ?? 'Refine the registry around a clearer next decision.',
    };
  }

  if (slug === 'best-strollers') {
    return {
      step: 'Compare',
      category: 'Strollers',
      goal: 'Choose the right stroller lane before comparing models.',
    };
  }

  if (slug === 'best-infant-car-seats') {
    return {
      step: 'Compare',
      category: 'Car Seats',
      goal: 'Choose the right seat path before comparing specific models.',
    };
  }

  if (slug === 'minimalist-baby-registry') {
    return {
      step: 'Start',
      category: 'Registry',
      goal: 'Build the registry in the right order before comparing products.',
    };
  }

  if (slug === 'nursery-setup-guide') {
    return {
      step: 'Start',
      category: 'Nursery',
      goal: 'Plan the room around routines before adding extra products.',
    };
  }

  if (slug === 'travel-with-baby') {
    return {
      step: 'Optimize',
      category: 'Travel',
      goal: 'Simplify the leaving-home setup before every outing turns into a gear project.',
    };
  }

  if (slug === 'full-size-modular-strollers') {
    return { step: 'Decide', category: 'Strollers', goal: 'Decide whether the full-size lane fits your actual week.' };
  }

  if (slug === 'compact-lightweight-strollers') {
    return { step: 'Decide', category: 'Strollers', goal: 'Decide whether the compact lane removes the right daily friction.' };
  }

  if (slug === 'travel-strollers') {
    return { step: 'Decide', category: 'Strollers', goal: 'Decide whether portability is the real stroller job you need to solve.' };
  }

  if (slug === 'convertible-strollers') {
    return { step: 'Decide', category: 'Strollers', goal: 'Decide whether planning ahead is strong enough to justify the convertible lane.' };
  }

  if (slug === 'double-strollers') {
    return { step: 'Decide', category: 'Strollers', goal: 'Decide whether a dedicated two-seat setup solves a current need.' };
  }

  if (slug === 'jogging-all-terrain-strollers') {
    return { step: 'Decide', category: 'Strollers', goal: 'Decide whether your routes truly need the jogging or all-terrain lane.' };
  }

  if (
    ['infant-car-seats', 'convertible-car-seats', 'all-in-one-car-seats', 'booster-seats', 'rotating-car-seats', 'travel-lightweight-car-seats'].includes(
      slug,
    )
  ) {
    return {
      step: 'Decide',
      category: 'Car Seats',
      goal: 'Decide whether this seat path fits your child, your car, and your routine.',
    };
  }

  if (['feeding', 'postpartum', 'essentials'].includes(slug)) {
    const config = getFutureGuideHubConfig(slug as 'feeding' | 'postpartum' | 'essentials');
    return {
      step: 'Optimize',
      category: sentenceCase(config.eyebrow.replace(/^TMBC\s+/i, '').replace(/\s+Hub$/i, '')),
      goal: config.description,
    };
  }

  if (slug === 'guides-hub') {
    return {
      step: 'Start',
      category: 'TMBC Academy',
      goal: 'Choose the guide path that matches the decision you need to make next.',
    };
  }

  const parentSlug = getGuideParentSlug({ slug, topicCluster });
  if (parentSlug === 'best-strollers') {
    return {
      step: 'Decide',
      category: 'Strollers',
      goal: 'Use this guide to validate the stroller path before comparing products inside it.',
    };
  }

  if (parentSlug === 'best-infant-car-seats') {
    return {
      step: 'Decide',
      category: 'Car Seats',
      goal: 'Use this guide to validate the seat path before you compare models.',
    };
  }

  return {
    step: 'Refine',
    category: sentenceCase(category || 'Guide'),
    goal: 'Use this guide to clarify the next decision before you keep moving.',
  };
}

export function getFallbackCommonMistakes(slug: string) {
  const exactMatches: Record<string, string[]> = {
    'best-strollers': [
      'Comparing stroller brands before you decide what role the stroller actually has to play.',
      'Buying for a hypothetical second child before solving the present-day routine.',
      'Treating showroom smoothness like proof that the fold, lift, and storage will feel easy at home.',
      'Choosing bulk for flexibility when your real friction is portability.',
    ],
    'best-infant-car-seats': [
      'Comparing safety marketing without checking how the seat fits your car and install comfort level.',
      'Assuming a longer-use seat is always the smarter answer from day one.',
      'Letting stroller compatibility drive the whole car seat decision.',
      'Skipping the real install and daily-use questions because the feature list sounds reassuring.',
    ],
    'minimalist-baby-registry': [
      'Adding products before the order of decisions is clear.',
      'Registering duplicate functions because different categories all sound urgent.',
      'Buying major gear before the room, storage, and routine are mapped.',
      'Treating freebies and trends like proof that an item belongs on the list.',
    ],
    'nursery-setup-guide': [
      'Planning the room around decor first and midnight function second.',
      'Using floor space without checking the actual route between sleep, changing, and storage.',
      'Buying furniture before the room measurements and storage needs are honest.',
      'Filling the nursery with backup products instead of calmer systems.',
    ],
    'travel-with-baby': [
      'Trying to solve the whole trip at once instead of the hardest transition first.',
      'Packing for every possible scenario instead of the actual route you are taking.',
      'Using daily gear on trips without checking whether portability changes the answer.',
      'Assuming the lightest setup is always the easiest once sleep and car logistics join the trip.',
    ],
    feeding: [
      'Buying full bottle or pump ecosystems before you know what your routine needs.',
      'Letting fear of the unknown create duplicate feeding setups.',
      'Skipping the setup workflow and only shopping the gadgets.',
    ],
    postpartum: [
      'Planning only for the baby and not for the adult recovery setup.',
      'Buying every suggested recovery product without knowing what will actually get used.',
      'Ignoring how home setup changes the first two weeks more than extra gear does.',
    ],
    essentials: [
      'Treating every category like a day-one essential.',
      'Building the list from trends instead of from the first stretch of real life.',
      'Buying backups before the primary setup is even clear.',
    ],
  };

  if (exactMatches[slug]) {
    return exactMatches[slug];
  }

  if (getRegistrySubGuideBySlug(slug)) {
    return [
      'Letting one narrower registry question take over the whole list.',
      'Treating every retailer perk or tip like proof that you need more products.',
      'Skipping the parent guide and losing sight of where this topic fits in the bigger registry plan.',
    ];
  }

  if (
    ['full-size-modular-strollers', 'compact-lightweight-strollers', 'travel-strollers', 'convertible-strollers', 'double-strollers', 'jogging-all-terrain-strollers'].includes(
      slug,
    )
  ) {
    return [
      'Choosing the lane for hypothetical flexibility instead of current routine fit.',
      'Testing the push and skipping the fold, lift, and storage reality.',
      'Comparing product prestige before confirming the category solves the right problem.',
    ];
  }

  if (
    ['infant-car-seats', 'convertible-car-seats', 'all-in-one-car-seats', 'booster-seats', 'rotating-car-seats', 'travel-lightweight-car-seats'].includes(
      slug,
    )
  ) {
    return [
      'Treating the seat stage like a forever decision instead of the right decision for this phase.',
      'Overvaluing features you may barely use and undervaluing install confidence.',
      'Comparing seats before you have a clear sense of the routine they need to support.',
    ];
  }

  return [
    'Reading for too long without narrowing the real question first.',
    'Treating every adjacent topic like it needs to be solved right now.',
    'Skipping the next-step route and reopening the same decision from scratch later.',
  ];
}

export function getFallbackTakeaways(slug: string) {
  const exactMatches: Record<string, string[]> = {
    'best-strollers': [
      'Choose the stroller lane before you compare brands.',
      'Let your routine, storage, and routes do the talking.',
      'Test the fold, lift, and trunk reality before you buy.',
    ],
    'best-infant-car-seats': [
      'Choose the seat path before the product page starts persuading you.',
      'Fit, install confidence, and routine matter more than feature theater.',
      'The best seat is the one you can use correctly with confidence.',
    ],
    'minimalist-baby-registry': [
      'A registry works better as a system than as a shopping list.',
      'Foundation decisions should happen before category comparison.',
      'The calmest list is the one built in the right order.',
    ],
  };

  return (
    exactMatches[slug] ?? [
      'Use the guide to narrow the decision, not to collect more tabs.',
      'Start with the real-life friction before the product names.',
      'Keep moving into the next linked guide while the category is still clear.',
    ]
  );
}

export function getDefaultNextSteps({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  if (slug === 'nursery-setup-guide') {
    return normalizeGuideLinks(
      [
        {
          href: '/guides/feeding',
          label: 'Feeding Guide',
          description: 'Continue into feeding setup once the room plan and daily stations are clearer.',
          stage: 'Optimize' as const,
        },
        {
          href: '/guides/registry/where-to-register',
          label: 'Registry Strategy',
          description: 'Choose where to register once the planning foundations are steady enough to support the list.',
          stage: 'Decide' as const,
        },
        {
          href: '/guides/strollers',
          label: 'Stroller Guide',
          description: 'Move into stroller comparison after the home setup and registry strategy are more settled.',
          stage: 'Compare' as const,
        },
      ],
      4,
    );
  }

  if (slug === 'where-to-register') {
    return normalizeGuideLinks(
      [
        {
          href: '/guides/strollers',
          label: 'Stroller Guide',
          description: 'Continue into stroller comparison once the registry platform and return logic are clear.',
          stage: 'Compare' as const,
        },
        {
          href: '/guides/feeding',
          label: 'Feeding Guide',
          description: 'Step back to feeding setup if those daily-use decisions still need more structure.',
          stage: 'Optimize' as const,
        },
      ],
      4,
    );
  }

  const parentSlug = getGuideParentSlug({ slug, topicCluster });
  const nextGuides = getGuideNextGuideItems(parentSlug ?? slug).filter((item) => !item.current);
  const links = [];

  if (parentSlug) {
    links.push({
      href: getGuidePath({ slug: parentSlug }),
      label: 'Return to the parent guide',
      description: 'Step back to the bigger decision map when you need the wider context again.',
      stage: 'Start' as const,
    });
  }

  for (const item of nextGuides.slice(0, 3)) {
    links.push({
      href: item.href,
      label: item.title,
      description: item.description,
      stage: 'Refine' as const,
    });
  }

  return normalizeGuideLinks(links);
}
