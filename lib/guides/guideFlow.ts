import { stripMarkdown } from '@/lib/blog/contentText';
import type { GuideOutline } from '@/lib/guides/articleOutline';
import { getFutureGuideHubConfig } from '@/lib/guides/educationHub';
import { getGuideNextGuideItems } from '@/lib/guides/hubs';
import { getNurserySubGuideBySlug } from '@/lib/guides/nurserySubguides';
import type { GuideHubLink } from '@/lib/guides/hubs';
import { getNextGuideLane } from '@/lib/guides/masterJourney';
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
    { id: `${prefix}-covers`, label: 'Orientation', shortLabel: 'Start' },
    { id: `${prefix}-core-content`, label: 'What Matters', shortLabel: 'Matter' },
    { id: `${prefix}-decision`, label: 'Decision Framework', shortLabel: 'Decide' },
    { id: `${prefix}-mistakes`, label: 'What People Get Wrong', shortLabel: 'Avoid' },
    { id: `${prefix}-next-steps`, label: 'Next Steps', shortLabel: 'Next' },
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

const CURATED_NEXT_STEP_LINKS: Record<
  string,
  Array<{
    href: string;
    label: string;
    description: string;
    stage: GuideStageLabel;
  }>
> = {
  'nursery-setup-guide': [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the main guide map if a different planning category should come first.',
      stage: 'Start',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Continue into the daily routine setup once the room plan is doing its job.',
      stage: 'Optimize',
    },
    {
      href: '/guides/registry/where-to-register',
      label: 'Registry Strategy',
      description: 'Choose where to register once the room and storage realities are clearer.',
      stage: 'Decide',
    },
    {
      href: '/guides/strollers',
      label: 'Stroller Guide',
      description: 'Move into gear comparison once the home setup and registry sequence feel steadier.',
      stage: 'Compare',
    },
  ],
  feeding: [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the wider planning map if another category needs attention first.',
      stage: 'Start',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Step back to the room and station setup if the routine still needs a better home base.',
      stage: 'Start',
    },
    {
      href: '/guides/registry/where-to-register',
      label: 'Registry Strategy',
      description: 'Use the feeding routine to make the registry platform and list structure cleaner.',
      stage: 'Decide',
    },
    {
      href: '/guides/strollers',
      label: 'Stroller Guide',
      description: 'Continue into gear comparison once the daily-use workflow is clearer.',
      stage: 'Compare',
    },
  ],
  essentials: [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the broader guide system if a different foundation guide should come first.',
      stage: 'Start',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Use the room setup to decide what deserves day-one space and what can wait.',
      stage: 'Start',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Move into feeding when the everyday-use items need more structure.',
      stage: 'Optimize',
    },
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Use the essentials filter to build a calmer first-pass registry.',
      stage: 'Decide',
    },
  ],
  postpartum: [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the guide map if a different setup category should come next.',
      stage: 'Start',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Keep the early routine practical by pairing recovery planning with feeding setup.',
      stage: 'Optimize',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Revisit the room setup if the recovery workflow still needs calmer support.',
      stage: 'Start',
    },
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Use the recovery plan to trim what belongs on the list and what does not.',
      stage: 'Decide',
    },
  ],
  'travel-with-baby': [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the guide map if another category deserves attention before the next trip.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Use the travel routine to decide whether portability or everyday comfort matters more.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Keep the travel plan coherent when car-seat portability or fit starts affecting the setup.',
      stage: 'Compare',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Tighten the outing routine once the big travel gear decisions are clearer.',
      stage: 'Optimize',
    },
  ],
  'minimalist-baby-registry': [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the wider guide system if another foundation guide should happen first.',
      stage: 'Start',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Use the room plan to decide what earns space on the registry.',
      stage: 'Start',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Move into feeding once the registry structure is calm enough to support the routine details.',
      stage: 'Optimize',
    },
    {
      href: '/guides/registry/where-to-register',
      label: 'Registry Strategy',
      description: 'Choose the registry platform once the system itself feels clear.',
      stage: 'Decide',
    },
  ],
  minimalist: [
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Return to the parent registry path when you need the wider sequence again.',
      stage: 'Start',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Use the room setup to tighten what really deserves space and budget.',
      stage: 'Start',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Carry the minimalist filter into one of the highest-duplicate routine categories.',
      stage: 'Optimize',
    },
    {
      href: '/guides/strollers',
      label: 'Stroller Guide',
      description: 'Use the same filter when major gear starts competing for space and attention.',
      stage: 'Compare',
    },
  ],
  mistakes: [
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Return to the parent registry guide when you need the bigger system again.',
      stage: 'Start',
    },
    {
      href: '/guides/registry/where-to-register',
      label: 'Registry Strategy',
      description: 'Sort the platform decision after the common list mistakes are easier to spot.',
      stage: 'Decide',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Use the same mistake filter when room planning starts turning into extra product pressure.',
      stage: 'Start',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Apply the cleanup mindset to one of the easiest categories to overbuild.',
      stage: 'Optimize',
    },
  ],
  'where-to-register': [
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Return to the parent registry path if you need the wider decision order again.',
      stage: 'Start',
    },
    {
      href: '/guides/strollers',
      label: 'Stroller Guide',
      description: 'Continue into stroller comparison once the registry platform and return logic are clear.',
      stage: 'Compare',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Step back into feeding if those daily-use decisions still need more structure.',
      stage: 'Optimize',
    },
    {
      href: '/guides/registry/perks',
      label: 'Registry Perks',
      description: 'Use the platform decision to make the perks strategy practical instead of distracting.',
      stage: 'Optimize',
    },
  ],
  timeline: [
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Return to the parent registry map if you need the wider sequence again.',
      stage: 'Start',
    },
    {
      href: '/guides/registry/where-to-register',
      label: 'Registry Strategy',
      description: 'Choose the registry platform once the timing plan is calmer and more realistic.',
      stage: 'Decide',
    },
    {
      href: '/guides/nursery',
      label: 'Nursery Guide',
      description: 'Use the timing plan to decide which room pieces deserve the earliest attention.',
      stage: 'Start',
    },
    {
      href: '/guides/strollers',
      label: 'Stroller Guide',
      description: 'Move into gear comparison once the purchase order is working for you.',
      stage: 'Compare',
    },
  ],
  perks: [
    {
      href: '/guides/registry',
      label: 'Registry Guide',
      description: 'Return to the parent registry path if the system itself needs a wider reset.',
      stage: 'Start',
    },
    {
      href: '/guides/registry/where-to-register',
      label: 'Registry Strategy',
      description: 'Use the retailer choice to make the perks actually useful instead of noisy.',
      stage: 'Decide',
    },
    {
      href: '/guides/strollers',
      label: 'Stroller Guide',
      description: 'Carry the savings strategy into one of the biggest purchase categories.',
      stage: 'Compare',
    },
    {
      href: '/guides/feeding',
      label: 'Feeding Guide',
      description: 'Apply the same filter to a daily-use category that can get expensive fast.',
      stage: 'Optimize',
    },
  ],
  'best-strollers': [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the broader guide system if another category needs to come first.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'compact-lightweight-strollers' }),
      label: 'Compact Lane',
      description: 'A strong next read when storage, lifting, and easier loading are the real friction.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Open this once travel-system or compatibility questions start affecting the stroller plan.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the stroller lane you chose to keep the registry shortlist calmer.',
      stage: 'Refine',
    },
  ],
  'full-size-modular-strollers': [
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Back to Stroller Academy',
      description: 'Return to the main stroller map if you need the wider lane overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'compact-lightweight-strollers' }),
      label: 'Compare Compact',
      description: 'Use this comparison when portability might matter more than extra stroller bulk.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Open this once travel-system or compatibility questions start affecting the setup.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the lane fit to keep the registry shortlist tighter.',
      stage: 'Refine',
    },
  ],
  'compact-lightweight-strollers': [
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Back to Stroller Academy',
      description: 'Return to the main stroller map if you need the wider lane overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'travel-strollers' }),
      label: 'Compare Travel',
      description: 'Useful when the question is whether you need lighter everyday gear or true trip-first portability.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Open this once travel-system or compatibility questions start affecting the setup.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the lane fit to keep the registry shortlist tighter.',
      stage: 'Refine',
    },
  ],
  'travel-strollers': [
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Back to Stroller Academy',
      description: 'Return to the main stroller map if you need the wider lane overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'compact-lightweight-strollers' }),
      label: 'Compare Compact',
      description: 'A good lateral move when you need lighter daily use more than flight-first minimalism.',
      stage: 'Compare',
    },
    {
      href: '/guides/travel-with-baby',
      label: 'Travel With Baby Guide',
      description: 'Use the broader travel routine to test whether the stroller is solving the right problem.',
      stage: 'Optimize',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Useful once portability and travel-system questions start crossing categories.',
      stage: 'Refine',
    },
  ],
  'convertible-strollers': [
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Back to Stroller Academy',
      description: 'Return to the main stroller map if you need the wider lane overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'double-strollers' }),
      label: 'Compare Double',
      description: 'Use this comparison when future planning needs to be measured against a real two-seat setup.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Useful once travel-system or infant-seat compatibility questions start affecting the plan.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the lane fit to keep the registry shortlist tighter.',
      stage: 'Refine',
    },
  ],
  'double-strollers': [
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Back to Stroller Academy',
      description: 'Return to the main stroller map if you need the wider lane overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'convertible-strollers' }),
      label: 'Compare Convertible',
      description: 'Use this comparison when you need to weigh a real second seat against planning ahead.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Useful once travel-system or infant-seat compatibility questions start affecting the plan.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the lane fit to keep the registry shortlist tighter.',
      stage: 'Refine',
    },
  ],
  'jogging-all-terrain-strollers': [
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Back to Stroller Academy',
      description: 'Return to the main stroller map if you need the wider lane overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'full-size-modular-strollers' }),
      label: 'Compare Full-Size',
      description: 'Use this when rough routes are occasional and you need to test whether daily comfort is the stronger priority.',
      stage: 'Compare',
    },
    {
      href: '/guides/travel-with-baby',
      label: 'Travel With Baby Guide',
      description: 'Pressure-test how much outdoor or away-from-home friction the stroller really needs to solve.',
      stage: 'Optimize',
    },
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Car Seat Guide',
      description: 'Open this if travel-system or compatibility questions start changing the stroller choice.',
      stage: 'Refine',
    },
  ],
  'best-infant-car-seats': [
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Return to the broader guide system if another category needs to come first.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'infant-car-seats' }),
      label: 'Infant Seat Guide',
      description: 'A strong next read when newborn portability is still the question in front of you.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Open this once travel-system or compatibility questions start affecting the seat decision.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the seat path you chose to keep the registry shortlist calmer.',
      stage: 'Refine',
    },
  ],
  'infant-car-seats': [
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Back to Car Seat Guide',
      description: 'Return to the parent seat map if you need the wider path overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'convertible-car-seats' }),
      label: 'Compare Convertible Seats',
      description: 'Useful when you need to weigh newborn portability against a longer installed-seat plan.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Open this once stroller compatibility or travel-system questions start leading the decision.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the seat path you chose to keep the registry shortlist calmer.',
      stage: 'Refine',
    },
  ],
  'convertible-car-seats': [
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Back to Car Seat Guide',
      description: 'Return to the parent seat map if you need the wider path overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'all-in-one-car-seats' }),
      label: 'Compare All-in-One',
      description: 'Use this when the question is whether more stages on paper actually improve the plan.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Open this once stroller compatibility or travel-system questions start leading the decision.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the seat path you chose to keep the registry shortlist calmer.',
      stage: 'Refine',
    },
  ],
  'all-in-one-car-seats': [
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Back to Car Seat Guide',
      description: 'Return to the parent seat map if you need the wider path overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'convertible-car-seats' }),
      label: 'Compare Convertible Seats',
      description: 'Useful when you need to test whether the simpler installed-seat path makes more sense.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Open this once stroller compatibility or travel-system questions start leading the decision.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the seat path you chose to keep the registry shortlist calmer.',
      stage: 'Refine',
    },
  ],
  'booster-seats': [
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Back to Car Seat Guide',
      description: 'Return to the parent seat map if you need the wider path overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'all-in-one-car-seats' }),
      label: 'Compare All-in-One',
      description: 'Useful when the stage path still needs more context before you decide what comes next.',
      stage: 'Compare',
    },
    {
      href: '/guides/travel-with-baby',
      label: 'Travel With Baby Guide',
      description: 'Use the real routine outside the driveway to pressure-test what matters most.',
      stage: 'Optimize',
    },
    {
      href: '/guides',
      label: 'TMBC Academy',
      description: 'Step back to the broader guide system if another category should come first.',
      stage: 'Start',
    },
  ],
  'rotating-car-seats': [
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Back to Car Seat Guide',
      description: 'Return to the parent seat map if you need the wider path overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'convertible-car-seats' }),
      label: 'Compare Convertible Seats',
      description: 'Useful when you need to weigh the convenience feature against a simpler installed-seat path.',
      stage: 'Compare',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Open this once stroller compatibility or travel-system questions start leading the decision.',
      stage: 'Refine',
    },
    {
      href: getGuidePath({ slug: 'minimalist-baby-registry' }),
      label: 'Registry Guide',
      description: 'Use the seat path you chose to keep the registry shortlist calmer.',
      stage: 'Refine',
    },
  ],
  'travel-lightweight-car-seats': [
    {
      href: getGuidePath({ slug: 'best-infant-car-seats' }),
      label: 'Back to Car Seat Guide',
      description: 'Return to the parent seat map if you need the wider path overview again.',
      stage: 'Start',
    },
    {
      href: getGuidePath({ slug: 'infant-car-seats' }),
      label: 'Compare Infant Seats',
      description: 'Use this when you need to weigh portability against the broader newborn carry setup.',
      stage: 'Compare',
    },
    {
      href: '/guides/travel-with-baby',
      label: 'Travel With Baby Guide',
      description: 'Use the broader travel routine to pressure-test whether the lighter seat solves the right problem.',
      stage: 'Optimize',
    },
    {
      href: getGuidePath({ slug: 'best-strollers' }),
      label: 'Stroller Guide',
      description: 'Open this once travel-system or compatibility questions start leading the decision.',
      stage: 'Refine',
    },
  ],
};

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

  const nurserySubGuide = getNurserySubGuideBySlug(slug);
  if (nurserySubGuide) {
    const nurseryGoals: Record<string, string> = {
      'nursery-sleep-setup': 'Choose the sleep setup that fits your room, your first months, and your actual nights.',
      'nursery-changing-station': 'Build a changing route that keeps the supplies close and the restocking logic obvious.',
      'nursery-furniture': 'Choose the pieces that earn their floor space and still make sense once the room starts evolving.',
      'nursery-storage': 'Build a storage system that keeps the daily items visible and the backups from taking over.',
    };

    return {
      step: 'Decide',
      category: 'Nursery',
      goal: nurseryGoals[nurserySubGuide.slug] ?? 'Use this guide to solve the part of the room creating the most daily friction.',
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
    'nursery-sleep-setup': [
      'Buying the biggest sleep piece before checking the room, route, and first-year plan honestly.',
      'Treating every sleep support like a safety requirement instead of separating safe basics from convenience extras.',
      'Planning the nursery sleep zone without considering whether baby will room-share first.',
    ],
    'nursery-changing-station': [
      'Building a cute diaper area without checking whether the wipes, creams, and backup clothes are actually within reach.',
      'Using storage containers without a restocking plan, then wondering why the station feels messy again in three days.',
      'Choosing a dedicated changing table before asking whether a dresser-top setup would solve the job with less floor space.',
    ],
    'nursery-furniture': [
      'Letting matching sets decide the room before the room has decided what it can comfortably hold.',
      'Buying furniture for a future version of the nursery that makes the newborn setup harder right now.',
      'Giving major floor space to low-use furniture while the daily-use pieces are still underpowered.',
    ],
    'nursery-storage': [
      'Treating baskets like a storage system when they are still just unlabeled piles with better lighting.',
      'Mixing daily-use supplies and backup stock until every drawer feels fuller and less useful.',
      'Storing the high-use items beautifully but farther away than the routine can actually tolerate.',
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
  const masterNextLane = getNextGuideLane({ slug, topicCluster });
  const masterNextLink = masterNextLane
    ? {
        href: masterNextLane.href,
        label: masterNextLane.slug === 'buy' ? 'Book a Consultation' : `Next: ${masterNextLane.title}`,
        description:
          masterNextLane.slug === 'buy'
            ? 'You have reached the end of the core TMBC path. Book support when you want help turning the clearer plan into an actual shortlist and buying decision.'
            : `The next core TMBC lane after this one is ${masterNextLane.title}. Keep the sequence clean while this decision is still fresh.`,
        stage: 'Refine' as const,
      }
    : null;

  const curatedLinks = CURATED_NEXT_STEP_LINKS[slug];
  if (curatedLinks) {
    return normalizeGuideLinks([...(masterNextLink ? [masterNextLink] : []), ...curatedLinks], 4);
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

  return normalizeGuideLinks([...(masterNextLink ? [masterNextLink] : []), ...links], 4);
}
