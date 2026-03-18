import { getGuidePath } from '@/lib/guides/routing';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

export const STROLLER_CATEGORY_GUIDE_SLUGS = [
  'full-size-modular-strollers',
  'compact-lightweight-strollers',
  'travel-strollers',
  'jogging-all-terrain-strollers',
  'double-strollers',
] as const;

export type StrollerCategoryGuideSlug = (typeof STROLLER_CATEGORY_GUIDE_SLUGS)[number];

type StrollerGuideCard = {
  slug: StrollerCategoryGuideSlug;
  title: string;
  description: string;
  bestFor: string;
  icon: GuideHubIconKey;
  imageSrc: string;
  imageAlt: string;
};

type StrollerCategoryGuideConfig = {
  slug: StrollerCategoryGuideSlug;
  shortTitle: string;
  heroDescription: string;
  whatSectionTitles: string[];
  worksForSummary: string;
  worksForBullets: string[];
  notBestFitSummary: string;
  notBestFitBullets: string[];
  relatedGuideSlugs: StrollerCategoryGuideSlug[];
  preferredBlogSlugs: string[];
};

const STROLLER_PATHS = {
  hub: getGuidePath({ slug: 'best-strollers' }),
  fullSize: getGuidePath({ slug: 'full-size-modular-strollers' }),
  compact: getGuidePath({ slug: 'compact-lightweight-strollers' }),
  travel: getGuidePath({ slug: 'travel-strollers' }),
  jogging: getGuidePath({ slug: 'jogging-all-terrain-strollers' }),
  double: getGuidePath({ slug: 'double-strollers' }),
} as const;

const STROLLER_GUIDE_CARDS: readonly StrollerGuideCard[] = [
  {
    slug: 'full-size-modular-strollers',
    title: 'Full-Size & Modular',
    description:
      'The everyday stroller lane for families who want smoother handling, stronger baskets, and a stroller that does more of the work.',
    bestFor: 'Best for daily walks, longer outings, and one strong primary stroller.',
    icon: 'stroller',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing full-size and modular strollers.',
  },
  {
    slug: 'compact-lightweight-strollers',
    title: 'Compact',
    description:
      'The easier day-to-day option when lighter lifting, smaller storage, and frequent trunk transfers matter more than a big stroller footprint.',
    bestFor: 'Best for car-heavy routines, smaller homes, and easier loading.',
    icon: 'compact',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing compact strollers.',
  },
  {
    slug: 'travel-strollers',
    title: 'Travel',
    description:
      'The lighter, faster-folding path for airports, ride shares, quick errands, and families who want less stroller overall.',
    bestFor: 'Best for frequent travel, quick folds, and tighter storage situations.',
    icon: 'plane',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing travel strollers.',
  },
  {
    slug: 'jogging-all-terrain-strollers',
    title: 'Jogging',
    description:
      'The bigger-wheel category for rough sidewalks, gravel, park paths, and routes that make smaller wheels feel deeply optimistic.',
    bestFor: 'Best for rough terrain, active families, and outdoor-heavy weeks.',
    icon: 'terrain',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing jogging strollers.',
  },
  {
    slug: 'double-strollers',
    title: 'Double',
    description:
      'The sibling-planning lane for two riders, single-to-double tradeoffs, and the honest math around width, weight, and timing.',
    bestFor: 'Best for twins or a very real near-term second-child plan.',
    icon: 'double',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing double strollers.',
  },
] as const;

const STROLLER_CATEGORY_GUIDE_CONFIG: Record<StrollerCategoryGuideSlug, StrollerCategoryGuideConfig> = {
  'full-size-modular-strollers': {
    slug: 'full-size-modular-strollers',
    shortTitle: 'Full-Size & Modular',
    heroDescription:
      'A calmer way to decide whether everyday comfort, better storage, and modular flexibility are actually worth the size in your real week.',
    whatSectionTitles: ['What Full-Size and Modular Really Mean'],
    worksForSummary:
      'This is usually the right lane when the stroller is part of normal life, not just the occasional parking-lot cameo.',
    worksForBullets: [
      'You walk often enough to care about ride quality and push feel.',
      'Basket space, canopy coverage, and seat comfort would genuinely get used.',
      'You want one stronger everyday stroller with bassinet or parent-facing flexibility.',
    ],
    notBestFitSummary:
      'It is often too much stroller when portability is the real job and the folded routine matters more than the ride.',
    notBestFitBullets: [
      'The stroller mostly lives in the trunk and gets lifted constantly.',
      'Home storage is tight and you already resent bulky gear.',
      'You want the lightest possible setup for quick errands or frequent travel.',
    ],
    relatedGuideSlugs: ['compact-lightweight-strollers', 'travel-strollers', 'double-strollers'],
    preferredBlogSlugs: [
      'best-full-size-strollers-2026',
      'stroller-comparisons',
      'travel-system-questions-before-you-buy',
      'gear-decisions-without-guesswork',
    ],
  },
  'compact-lightweight-strollers': {
    slug: 'compact-lightweight-strollers',
    shortTitle: 'Compact',
    heroDescription:
      'A practical guide to the stroller category that feels easier to lift, store, and live with when daily life is more trunk than trail.',
    whatSectionTitles: ['What Defines a Compact or Lightweight Stroller'],
    worksForSummary:
      'Compact strollers make the most sense when your routine rewards convenience more often than it rewards maximum suspension.',
    worksForBullets: [
      'You load the stroller in and out of the car a lot.',
      'Smaller storage, lighter lifting, and faster exits matter in your house.',
      'You want something easier than full-size without going fully travel-first.',
    ],
    notBestFitSummary:
      'This category can feel too minimal when the stroller has to handle longer walks, rougher ground, or all-day use regularly.',
    notBestFitBullets: [
      'You want the strongest comfort for frequent neighborhood walks.',
      'Your usual routes include rough sidewalks, gravel, or park paths.',
      'You really need a travel-first stroller built around airports and transit.',
    ],
    relatedGuideSlugs: ['full-size-modular-strollers', 'travel-strollers', 'double-strollers'],
    preferredBlogSlugs: [
      'best-compact-strollers',
      'best-travel-strollers',
      'stroller-comparisons',
      'gear-decisions-without-guesswork',
    ],
  },
  'travel-strollers': {
    slug: 'travel-strollers',
    shortTitle: 'Travel',
    heroDescription:
      'The stroller category for families who need easier folds, lighter carry, and less gear drama once airports, rental cars, and quick trips enter the picture.',
    whatSectionTitles: ['What a Travel Stroller Should Actually Do'],
    worksForSummary:
      'Travel strollers earn their place when movement between places is the hardest part of your stroller routine.',
    worksForBullets: [
      'Flights, ride shares, grandparents, or small trunks are part of regular life.',
      'You want a second stroller that handles transit-heavy days better.',
      'Quick folds and lighter carry matter more than maximum basket space.',
    ],
    notBestFitSummary:
      'They can feel too minimal when destination comfort, bigger baskets, or rougher everyday routes matter more than portability.',
    notBestFitBullets: [
      'Your normal stroller use is mostly long neighborhood walks.',
      'You want one stroller to handle rougher surfaces and heavier daily use.',
      'The stroller needs to feel substantial for all-day local outings.',
    ],
    relatedGuideSlugs: ['compact-lightweight-strollers', 'full-size-modular-strollers', 'double-strollers'],
    preferredBlogSlugs: [
      'best-travel-strollers',
      'travel-system-questions-before-you-buy',
      'stroller-comparisons',
      'gear-decisions-without-guesswork',
    ],
  },
  'jogging-all-terrain-strollers': {
    slug: 'jogging-all-terrain-strollers',
    shortTitle: 'Jogging',
    heroDescription:
      'A guide to the bigger-wheel stroller category for parents whose routes are rough enough that smaller wheels stop feeling charming very quickly.',
    whatSectionTitles: ['What This Category Actually Solves'],
    worksForSummary:
      'This category is strongest when the ground itself is the problem and you need a stroller that stops arguing with the route.',
    worksForBullets: [
      'Your weekly routes include cracked sidewalks, gravel, grass, or trails.',
      'Long outdoor walks or active movement are a normal part of life.',
      'You want better stability and suspension than smaller-wheel strollers can offer.',
    ],
    notBestFitSummary:
      'It is usually too much stroller when your routine is mostly smooth-surface errands, tighter indoor spaces, and compact storage needs.',
    notBestFitBullets: [
      'Most outings are quick, car-heavy, and indoors.',
      'A bulky fold will create more friction than better suspension will solve.',
      'You need a stroller that behaves better in restaurants, trunks, and travel settings.',
    ],
    relatedGuideSlugs: ['full-size-modular-strollers', 'compact-lightweight-strollers', 'double-strollers'],
    preferredBlogSlugs: ['best-jogging-strollers', 'stroller-comparisons', 'gear-decisions-without-guesswork'],
  },
  'double-strollers': {
    slug: 'double-strollers',
    shortTitle: 'Double',
    heroDescription:
      'The stroller category for twins, two small children, and the very real question of whether single-to-double flexibility is worth the everyday size.',
    whatSectionTitles: ['The Main Double Stroller Paths'],
    worksForSummary:
      'Double strollers are at their best when they are solving an actual sibling-transport problem, not just planning anxiety.',
    worksForBullets: [
      'You already have two riders or a very near-term second-child timeline.',
      'Both children are likely to need stroller support regularly.',
      'You need to compare side-by-side, tandem, and single-to-double tradeoffs honestly.',
    ],
    notBestFitSummary:
      'This category is often too much when you are still fully living as a one-child family and paying a daily size penalty for a hypothetical future.',
    notBestFitBullets: [
      'Your current life would be easier with a more nimble single stroller.',
      'Storage, trunk space, and everyday maneuvering are already tight.',
      'A ride board or later second solution may solve the problem more cleanly.',
    ],
    relatedGuideSlugs: ['full-size-modular-strollers', 'compact-lightweight-strollers', 'travel-strollers'],
    preferredBlogSlugs: ['best-double-strollers', 'stroller-comparisons', 'gear-decisions-without-guesswork'],
  },
};

export const STROLLER_HUB_DECISION_ITEMS = [
  {
    title: 'Do you walk daily?',
    description: 'Start with full-size and modular strollers if the stroller is part of your ordinary week, not just the occasional errand.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
  },
  {
    title: 'Does the stroller mostly live in the trunk?',
    description: 'Compact strollers usually make more sense when lifting, folding, and tighter storage are the repeat problem.',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
  },
  {
    title: 'Do you travel often?',
    description: 'Travel strollers help most when airports, ride shares, quick folds, and less bulk are part of real life.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
  },
  {
    title: 'Do you have rough routes or a running habit?',
    description: 'Jogging strollers earn their place when terrain is the daily problem instead of smooth showroom floors.',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
  },
  {
    title: 'Do you expect a second child soon?',
    description: 'Double stroller planning matters most when sibling timing is close enough that the size tradeoff is real now.',
    href: STROLLER_PATHS.double,
    icon: 'double',
  },
] as const;

export const STROLLER_SELECTOR_ITEMS = [
  {
    title: 'Daily Neighborhood Walks',
    description: 'Longer walks, park loops, and a stroller that gets used most days usually point to a stronger everyday setup.',
    recommendation: 'Full-Size & Modular',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
  },
  {
    title: 'Car-Heavy Errands',
    description: 'If the stroller is in and out of the trunk constantly, easier folding and lighter lifting tend to matter fast.',
    recommendation: 'Compact',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
  },
  {
    title: 'Frequent Travel',
    description: 'Airports, ride shares, and tighter destinations reward a stroller that folds fast and carries without drama.',
    recommendation: 'Travel',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
  },
  {
    title: 'Rough Routes',
    description: 'Cracked sidewalks, gravel, trails, and active outdoor loops usually need bigger wheels and stronger suspension.',
    recommendation: 'Jogging',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
  },
  {
    title: 'Growing Family Math',
    description: 'If a second rider is part of the near-term plan, compare the sibling logistics before you buy for flexibility alone.',
    recommendation: 'Double',
    href: STROLLER_PATHS.double,
    icon: 'double',
  },
] as const;

export const STROLLER_HUB_COMMON_MISTAKES = [
  {
    title: 'Choosing by brand before category',
    description:
      'If you start with brand prestige instead of stroller type, every feature begins to sound urgent whether or not it fits your week.',
  },
  {
    title: 'Buying for the showroom',
    description:
      'A smooth demo push matters less than how the stroller folds in your trunk, stores in your house, and behaves on your real routes.',
  },
  {
    title: 'Planning too far ahead',
    description:
      'Future flexibility can be useful, but paying a daily size penalty for a hypothetical second child is not always strategic. Sometimes it is just large.',
  },
] as const;

const BLOG_GUIDE_CARD_LIBRARY = {
  'best-strollers': {
    slug: 'best-strollers',
    href: STROLLER_PATHS.hub,
    title: 'Stroller Hub',
    description: 'Start with the category map before you open another roundup tab.',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing the stroller hub.',
    eyebrow: 'Stroller Guide',
  },
  'full-size-modular-strollers': {
    slug: 'full-size-modular-strollers',
    href: STROLLER_PATHS.fullSize,
    title: 'Full-Size & Modular',
    description: 'The everyday stroller lane for comfort, storage, and stronger daily performance.',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing full-size and modular strollers.',
    eyebrow: 'Stroller Type',
  },
  'compact-lightweight-strollers': {
    slug: 'compact-lightweight-strollers',
    href: STROLLER_PATHS.compact,
    title: 'Compact',
    description: 'The lighter everyday option when trunks, closets, and quick errands lead the decision.',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing compact strollers.',
    eyebrow: 'Stroller Type',
  },
  'travel-strollers': {
    slug: 'travel-strollers',
    href: STROLLER_PATHS.travel,
    title: 'Travel',
    description: 'The fold-first category for airports, ride shares, and portability-heavy routines.',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing travel strollers.',
    eyebrow: 'Stroller Type',
  },
  'jogging-all-terrain-strollers': {
    slug: 'jogging-all-terrain-strollers',
    href: STROLLER_PATHS.jogging,
    title: 'Jogging',
    description: 'The bigger-wheel category for rougher terrain, longer walks, and active routes.',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing jogging strollers.',
    eyebrow: 'Stroller Type',
  },
  'double-strollers': {
    slug: 'double-strollers',
    href: STROLLER_PATHS.double,
    title: 'Double',
    description: 'The sibling-planning lane for two riders and honest size-versus-flexibility tradeoffs.',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing double strollers.',
    eyebrow: 'Stroller Type',
  },
} as const;

export function isStrollerCategoryGuideSlug(slug: string): slug is StrollerCategoryGuideSlug {
  return STROLLER_CATEGORY_GUIDE_SLUGS.includes(slug as StrollerCategoryGuideSlug);
}

function toGuideCard(card: StrollerGuideCard): GuideHubLink {
  return {
    title: card.title,
    description: card.description,
    bestFor: card.bestFor,
    href: getGuidePath({ slug: card.slug }),
    icon: card.icon,
    imageSrc: card.imageSrc,
    imageAlt: card.imageAlt,
  };
}

export function getStrollerHubCategoryCards(): GuideHubLink[] {
  return STROLLER_GUIDE_CARDS.map((card) => toGuideCard(card));
}

export function getStrollerHubBackLinkCard(): GuideHubLink[] {
  return [
    {
      title: 'Back to the Stroller Hub',
      description: 'Return to the pillar guide if you want the bigger stroller map before narrowing down again.',
      href: STROLLER_PATHS.hub,
      icon: 'stroller',
      imageSrc: '/assets/strollers/fullsize.png',
      imageAlt: 'Illustration representing the stroller guide hub.',
    },
  ];
}

export function getStrollerCategoryGuideConfig(slug: string) {
  if (!isStrollerCategoryGuideSlug(slug)) {
    return null;
  }

  return STROLLER_CATEGORY_GUIDE_CONFIG[slug];
}

export function getStrollerRelatedGuideCards(slug: string): GuideHubLink[] {
  const config = getStrollerCategoryGuideConfig(slug);
  if (!config) {
    return [];
  }

  return config.relatedGuideSlugs.map((relatedSlug) => {
    const relatedCard = STROLLER_GUIDE_CARDS.find((entry) => entry.slug === relatedSlug);
    if (!relatedCard) {
      return null;
    }

    return toGuideCard(relatedCard);
  }).filter((entry): entry is ReturnType<typeof toGuideCard> => Boolean(entry));
}

export function getPreferredStrollerBlogSlugs(slug: string) {
  if (slug === 'best-strollers') {
    return [
      'stroller-comparisons',
      'best-full-size-strollers-2026',
      'best-travel-strollers',
      'best-double-strollers',
      'gear-decisions-without-guesswork',
    ];
  }

  if (isStrollerCategoryGuideSlug(slug)) {
    return STROLLER_CATEGORY_GUIDE_CONFIG[slug].preferredBlogSlugs;
  }

  return [];
}

export function getStrollerCategoryDecisionItems({
  slug,
  sourceRoute,
}: {
  slug: string;
  sourceRoute: string;
}): GuideHubDecisionItem[] {
  if (!isStrollerCategoryGuideSlug(slug)) {
    return [];
  }

  switch (slug) {
    case 'full-size-modular-strollers':
      return [
        {
          title: 'Do you walk most days?',
          description: 'Stay here if everyday comfort, storage, and stronger push quality are the point.',
          href: `${sourceRoute}#who-it-works-for`,
          icon: 'stroller',
        },
        {
          title: 'Does the stroller mostly live in the trunk?',
          description: 'Compare compact strollers before buying more stroller than your routine is asking for.',
          href: STROLLER_PATHS.compact,
          icon: 'compact',
        },
        {
          title: 'Are sibling plans driving this decision?',
          description: 'Double stroller logic is worth checking early so modularity does not quietly turn into unnecessary bulk.',
          href: STROLLER_PATHS.double,
          icon: 'double',
        },
      ];
    case 'compact-lightweight-strollers':
      return [
        {
          title: 'Is easy lifting the real problem?',
          description: 'Stay here if folding, storing, and quick daily resets matter more than maximum suspension.',
          href: `${sourceRoute}#who-it-works-for`,
          icon: 'compact',
        },
        {
          title: 'Do you actually need airport portability?',
          description: 'Travel strollers are the better comparison when the question is flights and transit-heavy movement.',
          href: STROLLER_PATHS.travel,
          icon: 'plane',
        },
        {
          title: 'Do longer walks matter more than the fold?',
          description: 'Full-size strollers are usually the better lane when comfort and basket space win the argument.',
          href: STROLLER_PATHS.fullSize,
          icon: 'stroller',
        },
      ];
    case 'travel-strollers':
      return [
        {
          title: 'Are airports and ride shares the headache?',
          description: 'Stay here if carrying, folding, and storing the stroller is the main job.',
          href: `${sourceRoute}#who-it-works-for`,
          icon: 'plane',
        },
        {
          title: 'Do you really need one stronger everyday stroller?',
          description: 'Full-size strollers usually win when the stroller is meant for longer local outings, not just movement between places.',
          href: STROLLER_PATHS.fullSize,
          icon: 'stroller',
        },
        {
          title: 'Is this more about quick errands than actual travel?',
          description: 'Compact strollers are often the better match when you want everyday convenience without going fully travel-first.',
          href: STROLLER_PATHS.compact,
          icon: 'compact',
        },
      ];
    case 'jogging-all-terrain-strollers':
      return [
        {
          title: 'Is terrain the real issue?',
          description: 'Stay here if the route itself is rough enough that smaller wheels are already annoying.',
          href: `${sourceRoute}#who-it-works-for`,
          icon: 'terrain',
        },
        {
          title: 'Are your normal outings mostly smooth-surface errands?',
          description: 'A full-size or compact stroller is often easier to live with when performance is not the actual bottleneck.',
          href: STROLLER_PATHS.fullSize,
          icon: 'stroller',
        },
        {
          title: 'Do you need room for two riders too?',
          description: 'Double stroller tradeoffs deserve their own decision if sibling seating is part of the plan.',
          href: STROLLER_PATHS.double,
          icon: 'double',
        },
      ];
    case 'double-strollers':
      return [
        {
          title: 'Do you have a real two-rider need soon?',
          description: 'Stay here if sibling transport is current or close enough that the extra size makes sense now.',
          href: `${sourceRoute}#who-it-works-for`,
          icon: 'double',
        },
        {
          title: 'Are you still living as a one-child family?',
          description: 'A strong single stroller is often the calmer move when the second-child timeline is still theoretical.',
          href: STROLLER_PATHS.fullSize,
          icon: 'stroller',
        },
        {
          title: 'Would a lighter backup stroller solve more of the day-to-day friction?',
          description: 'Compact and travel categories are worth comparing when the real problem is portability, not second-seat capacity.',
          href: STROLLER_PATHS.compact,
          icon: 'compact',
        },
      ];
    default:
      return [];
  }
}

function dedupeSlugs(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

export function getStrollerGuideSuggestionsForBlogPost({
  slug,
  title,
  content,
}: {
  slug: string;
  title: string;
  content: string;
}) {
  const text = `${slug} ${title} ${content}`.toLowerCase();
  if (!/(stroller|travel system|single-to-double|single to double|all-terrain|all terrain|jogging)/.test(text)) {
    return [];
  }

  const suggestedSlugs = ['best-strollers'];

  if (/(travel stroller|travel system|airport|gate-check|gate check|carry-on|carry on|rideshare)/.test(text)) {
    suggestedSlugs.push('travel-strollers');
  }

  if (/(full-size|full size|modular|bassinet|parent-facing|parent facing|vista|cruz|fox|mixx|reef)/.test(text)) {
    suggestedSlugs.push('full-size-modular-strollers');
  }

  if (/(compact|lightweight|light weight|small fold|minu|dragonfly|triv|mios|trunk)/.test(text)) {
    suggestedSlugs.push('compact-lightweight-strollers');
  }

  if (/(double|single-to-double|single to double|sibling|twins|tandem|side-by-side|side by side|donkey|gazelle)/.test(text)) {
    suggestedSlugs.push('double-strollers');
  }

  if (/(jogging|all-terrain|all terrain|trail|rough sidewalk|urban glide|ridge|bob)/.test(text)) {
    suggestedSlugs.push('jogging-all-terrain-strollers');
  }

  return dedupeSlugs(suggestedSlugs)
    .map((suggestedSlug) => BLOG_GUIDE_CARD_LIBRARY[suggestedSlug as keyof typeof BLOG_GUIDE_CARD_LIBRARY] ?? null)
    .filter((entry): entry is (typeof BLOG_GUIDE_CARD_LIBRARY)[keyof typeof BLOG_GUIDE_CARD_LIBRARY] => Boolean(entry));
}
