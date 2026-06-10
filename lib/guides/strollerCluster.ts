import { getGuidePath } from '@/lib/guides/routing';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

export const STROLLER_CATEGORY_GUIDE_SLUGS = [
  'full-size-modular-strollers',
  'compact-lightweight-strollers',
  'travel-strollers',
  'convertible-strollers',
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
  signatureMoment: string;
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
  convertible: getGuidePath({ slug: 'convertible-strollers' }),
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
    slug: 'convertible-strollers',
    title: 'Convertible',
    description:
      'The planning-ahead path for single-to-double systems when future sibling flexibility is part of the current decision.',
    bestFor: 'Best for families planning for more than one child over time.',
    icon: 'convertible',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing convertible strollers.',
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
      'The immediate two-rider lane for twins, close age gaps, and families who need a stroller built for two children now.',
    bestFor: 'twins, close age gaps, and two children who both need seats now.',
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
      'This lane makes sense when the stroller has a real weekly job. Think longer walks, real basket use, and enough mileage to justify more stroller without buying bulk just because it looks polished.',
    whatSectionTitles: ['What Full-Size and Modular Really Mean'],
    signatureMoment: 'A full-size stroller should earn its square footage.',
    worksForSummary:
      'This is usually the right lane when the stroller is part of regular life and you will actually notice the difference between decent and genuinely comfortable.',
    worksForBullets: [
      'You walk often enough to care about ride quality and push feel.',
      'Basket space, canopy coverage, and seat comfort would genuinely get used.',
      'You want one strong primary stroller and do not mind living with more frame to get that ease back.',
    ],
    notBestFitSummary:
      'It gets too big, too fast when the real routine is mostly trunk transfers, quick stops, and tighter storage.',
    notBestFitBullets: [
      'The stroller mostly lives in the trunk and gets lifted constantly.',
      'Home storage is tight and you already know bulky gear will annoy you.',
      'You want the lightest possible setup for quick errands or frequent travel.',
    ],
    relatedGuideSlugs: ['compact-lightweight-strollers', 'travel-strollers', 'convertible-strollers'],
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
      'This lane is for families who want less stroller to wrestle with. When the real friction is lifting, folding, storing, and getting out the door without a full production, compact usually makes a lot of sense.',
    whatSectionTitles: ['What Defines a Compact or Lightweight Stroller'],
    signatureMoment: 'The best compact stroller feels like one less step.',
    worksForSummary:
      'Compact usually wins when convenience keeps showing up in your week more often than long walks do.',
    worksForBullets: [
      'You load the stroller in and out of the car a lot.',
      'Smaller storage, lighter lifting, and faster exits matter in your house.',
      'You want something easier than full-size without going fully travel-first.',
    ],
    notBestFitSummary:
      'This category can feel a little too stripped back when the stroller has to carry longer walks, rougher routes, or bigger outing days regularly.',
    notBestFitBullets: [
      'You want the strongest comfort for frequent neighborhood walks.',
      'Your usual routes include rough sidewalks, gravel, or park paths.',
      'You really need a travel-first stroller built around airports and transit.',
    ],
    relatedGuideSlugs: ['full-size-modular-strollers', 'travel-strollers', 'convertible-strollers'],
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
      'This lane is for families who keep moving. Flights, ride shares, grandparents, tiny trunks, and quick folds make more sense once you stop asking a travel stroller to behave like a full-size one.',
    whatSectionTitles: ['What a Travel Stroller Should Actually Do'],
    signatureMoment: 'Travel gear should make movement easier, not just smaller.',
    worksForSummary:
      'Travel strollers earn their place when the hardest part of your stroller routine is getting from place to place with less gear friction.',
    worksForBullets: [
      'Flights, ride shares, grandparents, or small trunks are part of regular life.',
      'You want a stroller that handles transit-heavy days with less drama.',
      'Quick folds and lighter carry matter more than maximum basket space.',
    ],
    notBestFitSummary:
      'They can feel too minimal when destination comfort, bigger baskets, or rougher everyday routes matter more than portability.',
    notBestFitBullets: [
      'Your normal stroller use is mostly long neighborhood walks.',
      'You want one stroller to handle rougher surfaces and heavier daily use.',
      'The stroller needs to feel substantial for all-day local outings.',
    ],
    relatedGuideSlugs: ['compact-lightweight-strollers', 'full-size-modular-strollers', 'convertible-strollers'],
    preferredBlogSlugs: [
      'best-travel-strollers',
      'travel-system-questions-before-you-buy',
      'stroller-comparisons',
      'gear-decisions-without-guesswork',
    ],
  },
  'convertible-strollers': {
    slug: 'convertible-strollers',
    shortTitle: 'Convertible',
    heroDescription:
      'This lane is for the parent trying to buy thoughtfully once, not endlessly twice. It only makes sense when future sibling planning is real enough to earn the present-day size, weight, and setup.',
    whatSectionTitles: ['What Convertible Strollers Actually Mean', 'Modular stroller vs seat-specific single-to-double'],
    signatureMoment: 'Future flexibility only helps when the future is not purely theoretical.',
    worksForSummary:
      'Convertible strollers make the most sense when future sibling planning is real enough to matter now, not just comforting to imagine.',
    worksForBullets: [
      'You are planning for another child on a real near-term timeline.',
      'Single-to-double flexibility would genuinely change what you buy now.',
      'You want to compare expansion paths without forgetting that the stroller still has to work well as a single first.',
    ],
    notBestFitSummary:
      'This category starts to feel like too much stroller when the future plan is still vague and the current single-stroller version already feels bulky.',
    notBestFitBullets: [
      'You need two seats immediately, not later.',
      'Your home, trunk, or daily route already resists larger stroller systems.',
      'You are still guessing about a future sibling timeline and buying bulk for reassurance.',
    ],
    relatedGuideSlugs: ['double-strollers', 'full-size-modular-strollers', 'compact-lightweight-strollers'],
    preferredBlogSlugs: ['best-double-strollers', 'stroller-comparisons', 'gear-decisions-without-guesswork'],
  },
  'jogging-all-terrain-strollers': {
    slug: 'jogging-all-terrain-strollers',
    shortTitle: 'Jogging',
    heroDescription:
      'This lane is for the routes that keep exposing the limits of smaller wheels. Rough sidewalks, gravel, outdoor-heavy weeks, and actual jogging plans deserve a different conversation than a smooth Target run.',
    whatSectionTitles: ['What This Category Actually Solves', 'Jogging Strollers vs All-Terrain Strollers', '3 Wheels vs 4 Wheels'],
    signatureMoment: 'If the ground keeps winning the argument, listen.',
    worksForSummary:
      'This category is strongest when the ground itself is the problem, or when actual jogging is genuinely part of the plan and not just a flattering self-image.',
    worksForBullets: [
      'Your weekly routes include cracked sidewalks, gravel, grass, or trails.',
      'Long outdoor walks or active movement are a normal part of life.',
      'You want better stability and suspension than smaller-wheel strollers can offer, and you need clarity on whether that means all-terrain help or a true jogging setup.',
    ],
    notBestFitSummary:
      'It is usually too much stroller when your week is mostly smooth-surface errands, tighter indoor spaces, and compact storage needs.',
    notBestFitBullets: [
      'Most outings are quick, car-heavy, and indoors.',
      'A bulky fold will create more friction than better suspension will solve.',
      'You need a stroller that behaves better in restaurants, trunks, and travel settings.',
    ],
    relatedGuideSlugs: ['full-size-modular-strollers', 'compact-lightweight-strollers', 'convertible-strollers'],
    preferredBlogSlugs: ['best-jogging-strollers', 'stroller-comparisons', 'gear-decisions-without-guesswork'],
  },
  'double-strollers': {
    slug: 'double-strollers',
    shortTitle: 'Double',
    heroDescription:
      'This lane is for a very current problem: two children who both need a seat now. It is not the same question as future flexibility, and treating those as the same usually creates a lot of unnecessary stroller.',
    whatSectionTitles: ['The Main Double Stroller Paths'],
    signatureMoment: 'Two seats now is a logistics question, not a vibe.',
    worksForSummary:
      'Double strollers are at their best when they are solving a real current two-rider problem, not just planning anxiety in a very large frame.',
    worksForBullets: [
      'You already have two riders who regularly need stroller help.',
      'Both children are likely to need stroller support regularly.',
      'You need to compare side-by-side and tandem tradeoffs for real current use.',
    ],
    notBestFitSummary:
      'This category is often too much when two seats are still hypothetical and you are paying a daily size penalty before the job is real.',
    notBestFitBullets: [
      'Your current life would be easier with a more nimble single stroller.',
      'Storage, trunk space, and everyday maneuvering are already tight.',
      'A convertible system, ride board, or later second solution may solve the problem more cleanly.',
    ],
    relatedGuideSlugs: ['convertible-strollers', 'full-size-modular-strollers', 'compact-lightweight-strollers'],
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
    description: 'Convertible strollers make more sense when future sibling planning is shaping what you want to buy now.',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
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
    recommendation: 'Convertible',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
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
    href: STROLLER_PATHS.hub,
    title: 'Full-Size & Modular Strollers',
    description: 'The everyday stroller lane for comfort, storage, and stronger daily performance.',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing full-size and modular strollers.',
    eyebrow: 'Stroller Guide',
  },
  'compact-lightweight-strollers': {
    slug: 'compact-lightweight-strollers',
    href: STROLLER_PATHS.hub,
    title: 'Compact Strollers',
    description: 'The lighter everyday option when trunks, closets, and quick errands lead the decision.',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing compact strollers.',
    eyebrow: 'Stroller Guide',
  },
  'travel-strollers': {
    slug: 'travel-strollers',
    href: STROLLER_PATHS.hub,
    title: 'Travel Strollers',
    description: 'The fold-first category for airports, ride shares, and portability-heavy routines.',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing travel strollers.',
    eyebrow: 'Stroller Guide',
  },
  'convertible-strollers': {
    slug: 'convertible-strollers',
    href: STROLLER_PATHS.hub,
    title: 'Convertible Strollers',
    description: 'The single-to-double lane for future sibling planning, flexible seating, and long-term stroller math.',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing convertible strollers.',
    eyebrow: 'Stroller Guide',
  },
  'jogging-all-terrain-strollers': {
    slug: 'jogging-all-terrain-strollers',
    href: STROLLER_PATHS.hub,
    title: 'Jogging Strollers',
    description: 'The bigger-wheel category for rougher terrain, longer walks, and active routes.',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing jogging strollers.',
    eyebrow: 'Stroller Guide',
  },
  'double-strollers': {
    slug: 'double-strollers',
    href: STROLLER_PATHS.hub,
    title: 'Double Strollers',
    description: 'The dedicated two-seat lane for twins, close age gaps, and current sibling logistics.',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing double strollers.',
    eyebrow: 'Stroller Guide',
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
          title: 'Are you planning ahead for another child?',
          description: 'Convertible stroller logic is worth checking early so planning ahead does not quietly turn into bulk you never needed.',
          href: STROLLER_PATHS.convertible,
          icon: 'convertible',
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
    case 'convertible-strollers':
      return [
        {
          title: 'Is planning ahead actually part of this decision?',
          description: 'Stay here if future sibling timing is real enough to matter now and you still need the stroller to feel sensible as a single today.',
          href: `${sourceRoute}#who-it-works-for`,
          icon: 'convertible',
        },
        {
          title: 'Do you need two seats right now?',
          description: 'Open the double guide if the job is immediate two-child transport instead of future flexibility.',
          href: STROLLER_PATHS.double,
          icon: 'double',
        },
        {
          title: 'Would a stronger single stroller fit current life better?',
          description: 'Full-size strollers are often the calmer answer when the family is still living mostly in one-child mode.',
          href: STROLLER_PATHS.fullSize,
          icon: 'stroller',
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
          title: 'Are you planning ahead more than solving today?',
          description: 'Convertible strollers are the better comparison when future flexibility matters more than immediate double capacity.',
          href: STROLLER_PATHS.convertible,
          icon: 'convertible',
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

  if (/(convertible stroller|single-to-double|single to double|future sibling|second child|grow with family|gazelle|vista|wave|demi)/.test(text)) {
    suggestedSlugs.push('convertible-strollers');
  }

  if (/(double stroller|double|sibling seating|twins|tandem|side-by-side|side by side|donkey|minu duo)/.test(text)) {
    suggestedSlugs.push('double-strollers');
  }

  if (/(jogging|all-terrain|all terrain|trail|rough sidewalk|urban glide|ridge|bob)/.test(text)) {
    suggestedSlugs.push('jogging-all-terrain-strollers');
  }

  return dedupeSlugs(suggestedSlugs)
    .map((suggestedSlug) => BLOG_GUIDE_CARD_LIBRARY[suggestedSlug as keyof typeof BLOG_GUIDE_CARD_LIBRARY] ?? null)
    .filter((entry): entry is (typeof BLOG_GUIDE_CARD_LIBRARY)[keyof typeof BLOG_GUIDE_CARD_LIBRARY] => Boolean(entry));
}
