import type { GuideHubLink } from '@/lib/guides/hubs';
import { getNurserySubGuideBySlug } from '@/lib/guides/nurserySubguides';
import { getGuidePath, getGuideParentSlug, resolveGuideSlugFromRouteSegment } from '@/lib/guides/routing';
import { getRegistrySubGuideBySlug } from '@/lib/guides/registrySubguides';
import { getFutureGuideHubConfig, type FutureGuideHubSlug } from '@/lib/guides/educationHub';
import { getMasterGuideFlowCards } from '@/lib/guides/masterJourney';
import { getPreferredStrollerBlogSlugs } from '@/lib/guides/strollerCluster';
import { getGuidePillar } from '@/lib/marketing/siteContent';

export type GuideBreadcrumbItem = {
  label: string;
  href?: string;
};

export type GuideLifestyleImage = {
  eyebrow?: string;
  src: string;
  alt: string;
  caption: string;
};

export type GuideJourneyCard = GuideHubLink;

type CoreGuideRouteCard = GuideHubLink & {
  slug: string;
};

const FUTURE_GUIDE_HUB_SLUGS = ['essentials', 'feeding', 'postpartum'] as const satisfies readonly FutureGuideHubSlug[];

const CORE_GUIDE_ROUTE_CARDS: readonly CoreGuideRouteCard[] = [
  ...getMasterGuideFlowCards().map(({ stepLabel: _stepLabel, label: _label, ...card }) => card),
  {
    slug: 'feeding',
    title: 'Feeding',
    description: 'Build one workable feeding setup before you buy backup systems for every possible scenario.',
    href: '/learn/postpartum/feeding-and-lactation',
    icon: 'bag',
    imageSrc: '/assets/editorial/feeding.png',
    imageAlt: 'Editorial feeding image for Taylor-Made Baby Co.',
  },
  {
    slug: 'postpartum',
    title: 'Postpartum',
    description: 'Make room for recovery, support, and the adult part of the plan too.',
    href: '/learn/postpartum/healing-and-recovery',
    icon: 'layers',
    imageSrc: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Editorial postpartum support image for Taylor-Made Baby Co.',
  },
  {
    slug: 'essentials',
    title: 'Essentials',
    description: 'Keep the list grounded in what earns space in the first stretch of real life.',
    href: '/learn',
    icon: 'book',
    imageSrc: '/assets/editorial/babystuff.png',
    imageAlt: 'Editorial baby essentials image for Taylor-Made Baby Co.',
  },
] as const;

const LIFESTYLE_IMAGE_LIBRARY: Record<string, readonly GuideLifestyleImage[]> = {
  'guides-hub': [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/registry.png',
      alt: 'Editorial registry planning image.',
      caption: 'Start with the category that makes the whole plan feel more manageable, not the one making the most noise.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/nursery.png',
      alt: 'Editorial nursery planning image.',
      caption: 'A calmer plan usually looks less like a shopping sprint and more like one clear room, one clear decision, and then the next.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/strollers.png',
      alt: 'Editorial stroller planning image.',
      caption: 'The guide system works best when it keeps your next click practical instead of aspirational.',
    },
  ],
  registry: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/registry.jpg',
      alt: 'Registry flat lay with baby essentials.',
      caption: 'The strongest registry starts as a practical household plan, not a public attempt to predict every future preference.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/registry.png',
      alt: 'Editorial registry planning notebook image.',
      caption: 'Once the order is clear, the list usually gets shorter on its own. Convenient how that works.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/gear.jpg',
      alt: 'Editorial baby gear planning scene.',
      caption: 'Space, gifting, timing, and daily use should do more of the talking than category hype.',
    },
  ],
  strollers: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/strollers.png',
      alt: 'Editorial stroller image.',
      caption: 'A stroller should fit your real routes, your trunk, and your patience for folding things in parking lots.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/stroller-folds.jpg',
      alt: 'Editorial stroller fold image.',
      caption: 'The fold matters because the stroller will not spend all of its time looking graceful while rolling.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/double-strollers.jpg',
      alt: 'Editorial stroller comparison image.',
      caption: 'Lane clarity beats product theater. Every time.',
    },
  ],
  'car-seats': [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/gear.jpg',
      alt: 'Editorial baby gear planning image.',
      caption: 'Car seat decisions get calmer once the routine, install reality, and actual car fit start leading the conversation.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/growing-with-confidence.jpg',
      alt: 'Editorial parent-and-baby confidence image.',
      caption: 'The right seat should feel more usable in real life, not just more convincing on a feature chart.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/welcome.png',
      alt: 'Editorial welcome-home image.',
      caption: 'Choose the seat path that supports this stage well. You do not need to solve every later stage at once.',
    },
  ],
  nursery: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/nursery.jpg',
      alt: 'Editorial nursery image.',
      caption: 'A nursery does not need more personality than function. The middle of the night will humble everybody eventually.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/nursery.png',
      alt: 'Editorial nursery planning image.',
      caption: 'The room works better when the route between sleep, feeding, changing, and storage feels obvious.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/nursery.png',
      alt: 'Editorial nursery storage image.',
      caption: 'Calm usually looks like easier access, fewer extra pieces, and less reaching for things in the dark.',
    },
  ],
  travel: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/growing-with-confidence.jpg',
      alt: 'Editorial travel-with-baby image.',
      caption: 'Travel gear should remove friction from the trips you already take, not audition for a fantasy itinerary.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/stroller-folds.jpg',
      alt: 'Editorial travel stroller image.',
      caption: 'Portability matters most when it changes how leaving the house actually feels.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/gear.jpg',
      alt: 'Editorial packing and baby gear image.',
      caption: 'A lighter setup only counts as helpful if it still supports the routine once you arrive.',
    },
  ],
  'daily-use-gear': [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/babystuff.png',
      alt: 'Editorial daily use baby gear image.',
      caption: 'The smaller categories matter because they keep showing up in ordinary life, not because they make the loudest first impression.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/feeding.png',
      alt: 'Editorial feeding and daily routine image.',
      caption: 'Daily use gear should help the routine quietly enough that you stop thinking about it once it is doing its job.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/teddy-glow.png',
      alt: 'Editorial soothing and home support image.',
      caption: 'A calmer day usually comes from fewer better-fit helpers, not a larger collection of backup plans.',
    },
  ],
  feeding: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/feeding.png',
      alt: 'Editorial feeding image.',
      caption: 'A strong feeding setup supports the daily rhythm first and the gadget drawer a distant second.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/bottle-booties.png',
      alt: 'Editorial feeding support image.',
      caption: 'One practical starter setup beats a cabinet full of backup plans you have not needed yet.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/welcome.png',
      alt: 'Editorial early-days image.',
      caption: 'You can decide more once you know your baby. That is not under-preparing. That is called timing.',
    },
  ],
  postpartum: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/teddy-glow.png',
      alt: 'Editorial postpartum support image.',
      caption: 'The home setup should support the adults too. Radical concept, but useful.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/welcome.png',
      alt: 'Editorial first-weeks image.',
      caption: 'Recovery gets easier when the practical supports are already in place before anyone is running on fumes.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/teddy-glow.png',
      alt: 'Editorial home support image.',
      caption: 'Postpartum planning works best when it overlaps with room flow, rest, and what needs to stay close at hand.',
    },
  ],
  essentials: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/babystuff.png',
      alt: 'Editorial baby essentials image.',
      caption: 'Essentials are not the loudest items. They are the ones that quietly keep the day moving.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/welcome.png',
      alt: 'Editorial early baby setup image.',
      caption: 'The first stretch usually needs fewer categories than people think and better judgment than most lists offer.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/gear.jpg',
      alt: 'Editorial baby gear essentials image.',
      caption: 'Use the essentials filter to decide what belongs now, what can wait, and what probably never needed a spot.',
    },
  ],
  generic: [
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/gear.jpg',
      alt: 'Editorial baby gear planning image.',
      caption: 'The best decision usually starts with the routine, the space, and the version of daily life you are actually preparing for.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/growing-with-confidence.jpg',
      alt: 'Editorial confidence-building image.',
      caption: 'Guides should make the decision feel more grounded, not more dramatic.',
    },
    {
      eyebrow: 'Lifestyle image',
      src: '/assets/editorial/welcome.png',
      alt: 'Editorial early parenting image.',
      caption: 'Start with what needs to work first. The rest can wait its turn.',
    },
  ],
} as const;

const GUIDE_JOURNEY_BLOG_CARD_LIBRARY: Record<string, GuideJourneyCard> = {
  'gear-decisions-without-guesswork': {
    title: 'Gear Decisions Without Guesswork',
    description: 'A calmer editorial filter for the moments when the category still feels louder than it should.',
    href: '/blog/gear-decisions-without-guesswork',
    icon: 'book',
  },
  'the-art-of-the-registry': {
    title: 'The Art of the Registry',
    description: 'A practical registry read for parents who want better judgment, not a longer checklist.',
    href: '/blog/the-art-of-the-registry',
    icon: 'checklist',
  },
  'nursery-setup-that-actually-works': {
    title: 'Nursery Setup That Actually Works',
    description: 'A grounded nursery read built around the room you use at 2:14 AM, not the room that photographs well at 2:14 PM.',
    href: '/blog/nursery-setup-that-actually-works',
    icon: 'home',
  },
  'best-infant-car-seats': {
    title: 'Best Infant Car Seats',
    description: 'Useful once portability, base setup, and early travel-system convenience are part of the decision.',
    href: '/blog/best-infant-car-seats',
    icon: 'carseat',
  },
  'travel-system-questions-before-you-buy': {
    title: 'Travel System Questions Before You Buy',
    description: 'Helpful when stroller and car seat choices are starting to drag each other around.',
    href: '/blog/travel-system-questions-before-you-buy',
    icon: 'carseat',
  },
  'best-full-size-strollers-2026': {
    title: 'Best Full-Size Strollers',
    description: 'A recommendation-style shortlist for parents who already know the everyday stroller lane fits.',
    href: '/blog/best-full-size-strollers-2026',
    icon: 'stroller',
  },
  'best-compact-strollers': {
    title: 'Best Compact Strollers',
    description: 'A tighter shortlist for lighter lifting, easier folds, and smaller-space routines.',
    href: '/blog/best-compact-strollers',
    icon: 'compact',
  },
  'best-travel-strollers': {
    title: 'Best Travel Strollers',
    description: 'A useful next read when portability and fast folds are doing the heavier job.',
    href: '/blog/best-travel-strollers',
    icon: 'plane',
  },
  'best-double-strollers': {
    title: 'Best Double Strollers',
    description: 'A category roundup built around sibling logistics, width, and real-life manageability.',
    href: '/blog/best-double-strollers',
    icon: 'double',
  },
  'best-jogging-strollers': {
    title: 'Best Jogging Strollers',
    description: 'A useful next read when terrain is the actual problem and the wheel story needs to get more specific.',
    href: '/blog/best-jogging-strollers',
    icon: 'terrain',
  },
  'stroller-comparisons': {
    title: 'Stroller Comparisons',
    description: 'Side-by-side editorial comparisons for the moments when two stroller lanes still feel too close.',
    href: '/blog/stroller-comparisons',
    icon: 'strategy',
  },
};

const GUIDE_JOURNEY_BLOG_RECOMMENDATIONS: Record<string, readonly string[]> = {
  'guides-hub': ['gear-decisions-without-guesswork', 'the-art-of-the-registry', 'nursery-setup-that-actually-works'],
  registry: ['the-art-of-the-registry', 'best-infant-car-seats', 'gear-decisions-without-guesswork'],
  'car-seats': ['best-infant-car-seats', 'travel-system-questions-before-you-buy', 'gear-decisions-without-guesswork'],
  nursery: ['nursery-setup-that-actually-works', 'the-art-of-the-registry', 'gear-decisions-without-guesswork'],
  travel: ['best-travel-strollers', 'travel-system-questions-before-you-buy', 'gear-decisions-without-guesswork'],
  'daily-use-gear': ['gear-decisions-without-guesswork', 'the-art-of-the-registry', 'nursery-setup-that-actually-works'],
  feeding: ['the-art-of-the-registry', 'gear-decisions-without-guesswork', 'nursery-setup-that-actually-works'],
  postpartum: ['nursery-setup-that-actually-works', 'gear-decisions-without-guesswork', 'the-art-of-the-registry'],
  essentials: ['the-art-of-the-registry', 'gear-decisions-without-guesswork', 'nursery-setup-that-actually-works'],
  generic: ['gear-decisions-without-guesswork', 'the-art-of-the-registry', 'nursery-setup-that-actually-works'],
};

function normalizeGuideFamily({
  slug,
  category,
  topicCluster,
}: {
  slug: string;
  category?: string | null;
  topicCluster?: string | null;
}) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const registrySubGuide = getRegistrySubGuideBySlug(resolvedSlug);
  if (registrySubGuide) {
    return 'registry';
  }

  const parentSlug = getGuideParentSlug({ slug: resolvedSlug, topicCluster });
  const context = `${resolvedSlug} ${parentSlug ?? ''} ${category ?? ''}`.toLowerCase();

  if (resolvedSlug === 'guides-hub') {
    return 'guides-hub';
  }

  if (resolvedSlug === 'minimalist-baby-registry' || parentSlug === 'minimalist-baby-registry' || context.includes('registry')) {
    return 'registry';
  }

  if (resolvedSlug === 'best-strollers' || parentSlug === 'best-strollers' || context.includes('stroller')) {
    return 'strollers';
  }

  if (resolvedSlug === 'best-infant-car-seats' || parentSlug === 'best-infant-car-seats' || context.includes('car seat')) {
    return 'car-seats';
  }

  if (resolvedSlug === 'nursery-setup-guide' || context.includes('nursery')) {
    return 'nursery';
  }

  if (resolvedSlug === 'travel-with-baby' || context.includes('travel')) {
    return 'travel';
  }

  if (resolvedSlug === 'daily-use-gear' || parentSlug === 'daily-use-gear' || context.includes('daily use gear')) {
    return 'daily-use-gear';
  }

  if (resolvedSlug === 'feeding' || context.includes('feeding')) {
    return 'feeding';
  }

  if (resolvedSlug === 'postpartum' || context.includes('postpartum')) {
    return 'postpartum';
  }

  if (resolvedSlug === 'essentials' || context.includes('essentials')) {
    return 'essentials';
  }

  return 'generic';
}

export function getGuideParentLink({
  slug,
  topicCluster,
}: {
  slug: string;
  topicCluster?: string | null;
}) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const registrySubGuide = getRegistrySubGuideBySlug(resolvedSlug);
  const parentSlug = registrySubGuide ? 'minimalist-baby-registry' : getGuideParentSlug({ slug: resolvedSlug, topicCluster });

  if (!parentSlug) {
    return null;
  }

  return {
    label: getGuideLabel(parentSlug),
    href: getGuidePath({ slug: parentSlug }),
  };
}

export function getGuideLabel(slug: string, fallbackTitle?: string | null) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const registrySubGuide = getRegistrySubGuideBySlug(resolvedSlug);
  if (registrySubGuide) {
    return registrySubGuide.title;
  }

  const nurserySubGuide = getNurserySubGuideBySlug(resolvedSlug);
  if (nurserySubGuide) {
    return nurserySubGuide.cardTitle;
  }

  if (FUTURE_GUIDE_HUB_SLUGS.includes(resolvedSlug as FutureGuideHubSlug)) {
    const config = getFutureGuideHubConfig(resolvedSlug as FutureGuideHubSlug);
    return config.eyebrow.replace(/^TMBC\s+/i, '').replace(/\s+Hub$/i, '').trim() || config.title;
  }

  const pillar = getGuidePillar(resolvedSlug);
  if (pillar) {
    return pillar.shortTitle || pillar.title;
  }

  const staticLabels: Record<string, string> = {
    'guides-hub': 'Guide Hub',
    'daily-use-gear': 'Daily Use Gear',
    carriers: 'Baby Carriers',
    highchairs: 'Highchairs',
    'baby-bath': 'Baby Bath',
    bouncers: 'Bouncers',
    'pack-and-play': 'Pack & Play',
    swings: 'Swings',
    feeding: 'Feeding',
    postpartum: 'Postpartum',
    essentials: 'Essentials',
  };

  return staticLabels[resolvedSlug] ?? fallbackTitle?.trim() ?? 'Guide';
}

export function getGuideBreadcrumbs({
  slug,
  title,
  topicCluster,
}: {
  slug: string;
  title?: string | null;
  topicCluster?: string | null;
}): GuideBreadcrumbItem[] {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const breadcrumbs: GuideBreadcrumbItem[] = [{ label: 'TMBC Guides', href: '/learn' }];

  if (resolvedSlug === 'guides-hub') {
    breadcrumbs.push({ label: title?.trim() || 'Guide Hub' });
    return breadcrumbs;
  }

  const parentGuide = getGuideParentLink({ slug: resolvedSlug, topicCluster });
  if (parentGuide) {
    breadcrumbs.push(parentGuide);
  }

  const currentLabel = title?.trim() || getGuideLabel(resolvedSlug, title);
  const lastLabel = breadcrumbs.at(-1)?.label;
  if (!lastLabel || lastLabel !== currentLabel) {
    breadcrumbs.push({ label: currentLabel });
  }

  return breadcrumbs;
}

export function getGuideLifestyleImages({
  slug,
  category,
  topicCluster,
}: {
  slug: string;
  category?: string | null;
  topicCluster?: string | null;
}) {
  const family = normalizeGuideFamily({ slug, category, topicCluster });
  return [...(LIFESTYLE_IMAGE_LIBRARY[family] ?? LIFESTYLE_IMAGE_LIBRARY.generic)].slice(0, 3);
}

export function getGuideJourneyPath({
  slug,
  title,
  topicCluster,
}: {
  slug: string;
  title?: string | null;
  topicCluster?: string | null;
}) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);

  if (resolvedSlug === 'guides-hub') {
    return ['Learn', 'TMBC Guide Hub'];
  }

  const labels = getGuideBreadcrumbs({
    slug: resolvedSlug,
    title,
    topicCluster,
  })
    .slice(1)
    .map((item) => item.label.trim())
    .filter(Boolean);

  const dedupedLabels = labels.filter((label, index) => labels.indexOf(label) === index);

  return ['Learn', ...(dedupedLabels.length > 0 ? dedupedLabels : [getGuideLabel(resolvedSlug, title)])].slice(0, 3);
}

export function getGuideRealLifePrompt({
  slug,
  category,
  topicCluster,
}: {
  slug: string;
  category?: string | null;
  topicCluster?: string | null;
}) {
  switch (normalizeGuideFamily({ slug, category, topicCluster })) {
    case 'registry':
      return 'Start with the first stretch of daily life, the storage you actually have, and what deserves a place on the list before gifting dynamics take over.';
    case 'strollers':
      return 'Start with your routes, your trunk, your storage, and how often this stroller needs to work in a regular week.';
    case 'car-seats':
      return 'Start with your car, the adults doing the installs, and whether portability really changes your routine enough to matter.';
    case 'nursery':
      return 'Start with the midnight route: where you will reach, change, feed, store, and put baby back down when everyone is tired.';
    case 'travel':
      return 'Start with the trip or outing you actually take most often. The fantasy version is rarely the one creating the daily friction.';
    case 'daily-use-gear':
      return 'Start with the routine that repeats most often. The daily-use products worth buying are the ones that make that routine easier over and over.';
    case 'feeding':
      return 'Start with one workable everyday setup before you buy backup systems for every possible feeding outcome.';
    case 'postpartum':
      return 'Start with recovery, rest, hydration, and the practical supports that help the adults function too.';
    case 'essentials':
      return 'Start with what earns space in the first few weeks, not with the longer list of things that may become relevant much later.';
    default:
      return 'Start with the routine, the space, and the friction you are actually trying to reduce. That is usually where the clearer answer lives.';
  }
}

export function getGuideBlogRecommendations({
  slug,
  category,
  topicCluster,
  maxItems = 3,
}: {
  slug: string;
  category?: string | null;
  topicCluster?: string | null;
  maxItems?: number;
}) {
  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const family = normalizeGuideFamily({ slug: resolvedSlug, category, topicCluster });
  const preferredSlugs =
    family === 'strollers'
      ? getPreferredStrollerBlogSlugs(resolvedSlug)
      : (GUIDE_JOURNEY_BLOG_RECOMMENDATIONS[family] ?? GUIDE_JOURNEY_BLOG_RECOMMENDATIONS.generic);

  return preferredSlugs
    .map((blogSlug) => GUIDE_JOURNEY_BLOG_CARD_LIBRARY[blogSlug])
    .filter((card): card is GuideJourneyCard => Boolean(card))
    .filter(
      (card, index, collection) =>
        collection.findIndex((candidate) => candidate.href === card.href && candidate.title === card.title) === index,
    )
    .slice(0, maxItems);
}

export function getGuideConsultationCta(label?: string | null) {
  return {
    href: '/consultation',
    label: label?.trim() || 'Book a Consultation',
  };
}

function getCurrentCoreGuideSlug({
  slug,
  topicCluster,
}: {
  slug?: string | null;
  topicCluster?: string | null;
}) {
  if (!slug) {
    return null;
  }

  const resolvedSlug = resolveGuideSlugFromRouteSegment(slug);
  const registrySubGuide = getRegistrySubGuideBySlug(resolvedSlug);
  if (registrySubGuide) {
    return 'minimalist-baby-registry';
  }

  return getGuideParentSlug({ slug: resolvedSlug, topicCluster }) ?? resolvedSlug;
}

export function getCoreGuideRouteCards({
  slug,
  topicCluster,
  maxItems = 6,
}: {
  slug?: string | null;
  topicCluster?: string | null;
  maxItems?: number;
} = {}) {
  const currentCoreGuideSlug = getCurrentCoreGuideSlug({ slug, topicCluster });

  return CORE_GUIDE_ROUTE_CARDS.filter((card) => card.slug !== currentCoreGuideSlug)
    .slice(0, maxItems)
    .map(({ slug: _slug, ...card }) => card);
}
