import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideCardItem } from '@/lib/guides/presentation';
import { toCondensedGuideCardTitle } from '@/lib/guides/presentation';
import { getGuidePath } from '@/lib/guides/routing';

export type GuideHubIconKey =
  | 'stroller'
  | 'compact'
  | 'plane'
  | 'terrain'
  | 'double'
  | 'carseat'
  | 'convertible'
  | 'layers'
  | 'shield'
  | 'sleep'
  | 'home'
  | 'storage'
  | 'small-space'
  | 'calendar'
  | 'road'
  | 'bag'
  | 'checklist'
  | 'strategy'
  | 'book';

export type GuideHubLink = {
  title: string;
  description: string;
  href: string;
  icon: GuideHubIconKey;
  imageSrc?: string;
  imageAlt?: string;
  showPlaceholder?: boolean;
};

export type GuideHubDecisionItem = {
  title: string;
  description: string;
  href: string;
  icon: GuideHubIconKey;
};

export type GuideHubConfig = {
  cardsTitle: string;
  cardsDescription: string;
  cards: GuideHubLink[];
  decisionHelperTitle: string;
  decisionHelperDescription: string;
  decisionItems: GuideHubDecisionItem[];
  supportLinks: GuideHubLink[];
};

export type GuideContinueExploringBlock = {
  title: string;
  description: string;
  links: GuideHubLink[];
};

export type GuideHeroJumpLink = {
  label: string;
  href: string;
};

export type GuideNextGuideItem = GuideHubLink & {
  slug: string;
  current: boolean;
};

const PILLAR_PATHS = {
  strollers: getGuidePath({ slug: 'best-strollers' }),
  carSeats: getGuidePath({ slug: 'best-infant-car-seats' }),
  registry: getGuidePath({ slug: 'minimalist-baby-registry' }),
  nursery: getGuidePath({ slug: 'nursery-setup-guide' }),
  travel: getGuidePath({ slug: 'travel-with-baby' }),
  fullSizeStrollers: getGuidePath({ slug: 'full-size-modular-strollers' }),
  compactStrollers: getGuidePath({ slug: 'compact-lightweight-strollers' }),
  travelStrollers: getGuidePath({ slug: 'travel-strollers' }),
  joggingStrollers: getGuidePath({ slug: 'jogging-all-terrain-strollers' }),
  doubleStrollers: getGuidePath({ slug: 'double-strollers' }),
} as const;

const SUPPORT_PATHS = {
  gearDecisions: '/blog/gear-decisions-without-guesswork',
  registryEditorial: '/blog/the-art-of-the-registry',
  nurseryEditorial: '/blog/nursery-setup-that-actually-works',
} as const;

const NEXT_GUIDES_BASE: Array<Omit<GuideNextGuideItem, 'current'>> = [
  {
    slug: 'best-strollers',
    title: 'Stroller Guide',
    description: 'Compare everyday, compact, and travel-first stroller paths without the showroom haze.',
    href: PILLAR_PATHS.strollers,
    icon: 'stroller',
  },
  {
    slug: 'best-infant-car-seats',
    title: 'Car Seat Guide',
    description: 'Sort infant, convertible, and travel-seat decisions around fit, routine, and real use.',
    href: PILLAR_PATHS.carSeats,
    icon: 'carseat',
  },
  {
    slug: 'minimalist-baby-registry',
    title: 'Registry Guide',
    description: 'Build a registry around systems, timing, and what actually earns space in your home.',
    href: PILLAR_PATHS.registry,
    icon: 'checklist',
  },
  {
    slug: 'nursery-setup-guide',
    title: 'Nursery Guide',
    description: 'Plan a nursery that works in the dark, under pressure, and without a decorative identity crisis.',
    href: PILLAR_PATHS.nursery,
    icon: 'home',
  },
  {
    slug: 'travel-with-baby',
    title: 'Travel With Baby Guide',
    description: 'Make airports, road trips, and away-from-home routines feel more manageable.',
    href: PILLAR_PATHS.travel,
    icon: 'plane',
  },
];

function anchor(path: string, id: string) {
  return `${path}#${id}`;
}

function buildGuideHubConfigs(currentPath: string): Record<string, GuideHubConfig> {
  return {
    'best-strollers': {
      cardsTitle: 'Explore stroller types',
      cardsDescription: 'Start with the stroller lane that matches your week, not the one that simply looks best in a parking-lot demo.',
      cards: [
        {
          title: 'Full-Size Strollers',
          description: 'For daily walks, better baskets, smoother handling, and a stroller that does more of the heavy lifting.',
          href: PILLAR_PATHS.fullSizeStrollers,
          icon: 'stroller',
          imageSrc: '/assets/strollers/fullsize.png',
          imageAlt: 'Illustration of a full-size stroller category.',
        },
        {
          title: 'Compact Strollers',
          description: 'For families who want something lighter and easier to store without giving up everyday usefulness.',
          href: PILLAR_PATHS.compactStrollers,
          icon: 'compact',
          imageSrc: '/assets/strollers/compact.png',
          imageAlt: 'Illustration of a compact stroller category.',
        },
        {
          title: 'Travel Strollers',
          description: 'For flights, quick errands, small trunks, and families who prefer less bulk in the first place.',
          href: PILLAR_PATHS.travelStrollers,
          icon: 'plane',
          imageSrc: '/assets/strollers/travel.png',
          imageAlt: 'Illustration of a travel stroller category.',
        },
        {
          title: 'Jogging & All-Terrain',
          description: 'For rough sidewalks, gravel paths, longer walks, and parents who actually mean it when they say trail.',
          href: PILLAR_PATHS.joggingStrollers,
          icon: 'terrain',
          imageSrc: '/assets/strollers/jogging.png',
          imageAlt: 'Illustration of a jogging and all-terrain stroller category.',
        },
        {
          title: 'Convertible Strollers',
          description: 'For future-sibling planning, modular seating, and honest math around single-to-double life.',
          href: anchor(currentPath, 'double-and-convertible-strollers'),
          icon: 'layers',
          imageSrc: '/assets/strollers/convertable.png',
          imageAlt: 'Illustration of a convertible stroller category.',
        },
        {
          title: 'Double Strollers',
          description: 'For parents planning around siblings, width, configuration tradeoffs, and everyday manageability.',
          href: PILLAR_PATHS.doubleStrollers,
          icon: 'double',
          imageSrc: '/assets/strollers/double.png',
          imageAlt: 'Illustration of a double stroller category.',
        },
      ],
      decisionHelperTitle: 'A quicker way to narrow the lane',
      decisionHelperDescription: 'If the stroller tab situation is getting out of hand, start with the use case that creates the most friction in real life.',
      decisionItems: [
        {
          title: 'If you walk most days',
          description: 'Begin with full-size strollers.',
          href: PILLAR_PATHS.fullSizeStrollers,
          icon: 'stroller',
        },
        {
          title: 'If you travel often',
          description: 'Jump to travel strollers.',
          href: PILLAR_PATHS.travelStrollers,
          icon: 'plane',
        },
        {
          title: 'If you run or handle rough terrain',
          description: 'Open jogging and all-terrain guidance.',
          href: PILLAR_PATHS.joggingStrollers,
          icon: 'terrain',
        },
        {
          title: 'If you are planning around two children',
          description: 'Compare convertible and double options first.',
          href: anchor(currentPath, 'double-and-convertible-strollers'),
          icon: 'double',
        },
      ],
      supportLinks: [
        {
          title: 'Travel With Baby Guide',
          description: 'See how stroller portability changes once airports, hotel rooms, and rental trunks enter the chat.',
          href: PILLAR_PATHS.travel,
          icon: 'plane',
        },
        {
          title: 'Car Seat Guide',
          description: 'Sort travel-system and compatibility questions before they turn the stroller choice into a group project.',
          href: PILLAR_PATHS.carSeats,
          icon: 'carseat',
        },
        {
          title: 'Gear Decisions Without Guesswork',
          description: 'A practical filter for when the category starts sounding impressive but not necessarily helpful.',
          href: SUPPORT_PATHS.gearDecisions,
          icon: 'book',
        },
      ],
    },
    'best-infant-car-seats': {
      cardsTitle: 'Explore car seat paths',
      cardsDescription: 'Use the category grid to move from one giant car-seat question into the more specific answer you actually need.',
      cards: [
        {
          title: 'Infant Car Seats',
          description: 'For click-in convenience, newborn portability, and early travel-system planning.',
          href: anchor(currentPath, 'infant-car-seats'),
          icon: 'carseat',
        },
        {
          title: 'Convertible Car Seats',
          description: 'For long-term use, strong everyday fit, and families who would rather skip the carrier stage.',
          href: anchor(currentPath, 'convertible-car-seats'),
          icon: 'convertible',
        },
        {
          title: 'All-in-One Car Seats',
          description: 'For parents comparing long-run value with the realities of actual newborn fit.',
          href: anchor(currentPath, 'all-in-one-car-seats'),
          icon: 'layers',
        },
        {
          title: 'Travel Car Seat Setups',
          description: 'For rental cars, second vehicles, grandparents, and the trips where simplicity suddenly matters a lot.',
          href: anchor(currentPath, 'travel-and-secondary-seat-categories'),
          icon: 'plane',
        },
        {
          title: 'Car Seat Safety Basics',
          description: 'For the fit, installation, and daily-use questions that matter more than feature lists.',
          href: anchor(currentPath, 'how-to-choose-the-right-option'),
          icon: 'shield',
        },
      ],
      decisionHelperTitle: 'Start with the part that matters most',
      decisionHelperDescription: 'Most parents do not need more car seat opinions. They need the next clear question.',
      decisionItems: [
        {
          title: 'If you want click-in convenience',
          description: 'Start with infant car seats.',
          href: anchor(currentPath, 'infant-car-seats'),
          icon: 'carseat',
        },
        {
          title: 'If you want one seat to stay put',
          description: 'Open convertible guidance.',
          href: anchor(currentPath, 'convertible-car-seats'),
          icon: 'convertible',
        },
        {
          title: 'If multiple adults will use the seat',
          description: 'Go straight to safety and install basics.',
          href: anchor(currentPath, 'how-to-choose-the-right-option'),
          icon: 'shield',
        },
        {
          title: 'If you travel or swap vehicles often',
          description: 'Review travel-seat setups first.',
          href: anchor(currentPath, 'travel-and-secondary-seat-categories'),
          icon: 'plane',
        },
      ],
      supportLinks: [
        {
          title: 'Stroller Guide',
          description: 'Helpful if your car seat choice is tied to stroller compatibility and early travel-system logic.',
          href: PILLAR_PATHS.strollers,
          icon: 'stroller',
        },
        {
          title: 'Travel With Baby Guide',
          description: 'Useful once you start thinking about airports, rental cars, and secondary setups.',
          href: PILLAR_PATHS.travel,
          icon: 'plane',
        },
        {
          title: 'Gear Decisions Without Guesswork',
          description: 'A calmer way to sort premium features from the parts that actually change daily use.',
          href: SUPPORT_PATHS.gearDecisions,
          icon: 'book',
        },
      ],
    },
    'minimalist-baby-registry': {
      cardsTitle: 'Explore registry sub-guides',
      cardsDescription: 'Use these planning lanes to edit the list by system, timing, and what your home can realistically support.',
      cards: [
        {
          title: 'Minimalist Registry',
          description: 'For parents who want fewer items, clearer priorities, and less digital clutter pretending to be preparation.',
          href: anchor(currentPath, 'how-to-choose-the-right-option'),
          icon: 'strategy',
        },
        {
          title: 'Registry Essentials',
          description: 'For the systems that matter first: sleep, feeding, diapering, mobility, and recovery.',
          href: anchor(currentPath, 'major-types-and-categories'),
          icon: 'checklist',
        },
        {
          title: 'Registry Mistakes',
          description: 'For overbuying, duplication, and the categories that quietly become storage problems later.',
          href: anchor(currentPath, 'common-mistakes-parents-make'),
          icon: 'book',
        },
        {
          title: 'Registry Strategy',
          description: 'For the bigger editorial lens on what belongs now, what can wait, and how to keep the list grounded.',
          href: SUPPORT_PATHS.registryEditorial,
          icon: 'strategy',
        },
        {
          title: 'Registry Planning Timeline',
          description: 'For deciding what to register before birth and what makes more sense to revisit later.',
          href: anchor(currentPath, 'planning-tips'),
          icon: 'calendar',
        },
      ],
      decisionHelperTitle: 'Build around the friction, not the algorithm',
      decisionHelperDescription: 'When a registry starts getting long, the fastest fix is usually deciding which daily problem the item is supposed to solve.',
      decisionItems: [
        {
          title: 'If your home is tight on space',
          description: 'Start with the minimalist path.',
          href: anchor(currentPath, 'scenario-one-the-small-space-family'),
          icon: 'small-space',
        },
        {
          title: 'If you need the core categories first',
          description: 'Open registry essentials.',
          href: anchor(currentPath, 'major-types-and-categories'),
          icon: 'checklist',
        },
        {
          title: 'If your list is growing faster than your confidence',
          description: 'Go straight to registry mistakes.',
          href: anchor(currentPath, 'common-mistakes-parents-make'),
          icon: 'book',
        },
        {
          title: 'If you are deciding what can wait',
          description: 'Jump to planning tips.',
          href: anchor(currentPath, 'planning-tips'),
          icon: 'calendar',
        },
      ],
      supportLinks: [
        {
          title: 'The Art of the Registry',
          description: 'A quieter editorial read on building a registry with intention instead of volume.',
          href: SUPPORT_PATHS.registryEditorial,
          icon: 'book',
        },
        {
          title: 'Nursery Guide',
          description: 'Helpful once the registry starts crossing into furniture, storage, and room-flow decisions.',
          href: PILLAR_PATHS.nursery,
          icon: 'home',
        },
        {
          title: 'Car Seat Guide',
          description: 'A good next step when the registry is getting held hostage by mobility decisions.',
          href: PILLAR_PATHS.carSeats,
          icon: 'carseat',
        },
      ],
    },
    'nursery-setup-guide': {
      cardsTitle: 'Explore nursery planning lanes',
      cardsDescription: 'Move from the big nursery question into the part of the room that most affects your actual nights and mornings.',
      cards: [
        {
          title: 'Sleep Setup',
          description: 'For crib size, room flow, sleep supports, and what the first-year setup really needs to do.',
          href: anchor(currentPath, 'sleep-zone'),
          icon: 'sleep',
        },
        {
          title: 'Nursery Furniture',
          description: 'For cribs, dressers, chairs, and the pieces that need to work harder than they pose.',
          href: anchor(currentPath, 'how-to-choose-the-right-option'),
          icon: 'home',
        },
        {
          title: 'Changing Stations',
          description: 'For dresser-top setups, restocking logic, and keeping the middle-of-the-night route short.',
          href: anchor(currentPath, 'changing-and-care-zone'),
          icon: 'home',
        },
        {
          title: 'Nursery Organization',
          description: 'For drawers, baskets, backup supplies, and storage systems that still make sense when you are tired.',
          href: anchor(currentPath, 'storage-zone'),
          icon: 'storage',
        },
        {
          title: 'Small Space Nurseries',
          description: 'For mini cribs, sharper editing, and layouts that stop pretending the room is bigger than it is.',
          href: anchor(currentPath, 'scenario-two-the-small-nursery'),
          icon: 'small-space',
        },
      ],
      decisionHelperTitle: 'Choose the zone that creates the most friction',
      decisionHelperDescription: 'Nursery planning gets calmer once you focus on the route you will repeat half awake, not the photo you hope the room will eventually deserve.',
      decisionItems: [
        {
          title: 'If nights already feel like the concern',
          description: 'Start with sleep setup.',
          href: anchor(currentPath, 'sleep-zone'),
          icon: 'sleep',
        },
        {
          title: 'If the room is small',
          description: 'Jump to small-space nursery planning.',
          href: anchor(currentPath, 'scenario-two-the-small-nursery'),
          icon: 'small-space',
        },
        {
          title: 'If storage feels fuzzy',
          description: 'Open nursery organization.',
          href: anchor(currentPath, 'storage-zone'),
          icon: 'storage',
        },
        {
          title: 'If furniture needs to do double duty',
          description: 'Review nursery furniture first.',
          href: anchor(currentPath, 'think-in-routes-not-zones-alone'),
          icon: 'home',
        },
      ],
      supportLinks: [
        {
          title: 'Nursery Setup That Actually Works',
          description: 'A supporting read focused on practical room flow over decorative performance.',
          href: SUPPORT_PATHS.nurseryEditorial,
          icon: 'book',
        },
        {
          title: 'Registry Guide',
          description: 'Useful when nursery decisions are overlapping with budget, gifting, and what to buy now versus later.',
          href: PILLAR_PATHS.registry,
          icon: 'checklist',
        },
        {
          title: 'Gear Decisions Without Guesswork',
          description: 'Helpful when the room starts collecting products faster than clear reasons.',
          href: SUPPORT_PATHS.gearDecisions,
          icon: 'book',
        },
      ],
    },
    'travel-with-baby': {
      cardsTitle: 'Explore travel sub-guides',
      cardsDescription: 'Use the travel lanes to sort the specific part of the trip that tends to unravel the fastest.',
      cards: [
        {
          title: 'Flying With Baby',
          description: 'For gates, security lines, boarding logistics, and the gear that earns its place in an airport.',
          href: anchor(currentPath, 'air-travel-setup'),
          icon: 'plane',
        },
        {
          title: 'Travel Strollers',
          description: 'For families deciding whether a compact stroller should be a trip-only tool or part of everyday life too.',
          href: PILLAR_PATHS.travelStrollers,
          icon: 'compact',
        },
        {
          title: 'Portable Sleep Solutions',
          description: 'For nap support, unfamiliar rooms, and away-from-home sleep without bringing half the nursery.',
          href: anchor(currentPath, 'sleep-on-the-go-setup'),
          icon: 'sleep',
        },
        {
          title: 'Travel Car Seats',
          description: 'For rental cars, lighter setups, and car seat plans that do not become the hardest part of the trip.',
          href: anchor(currentPath, 'road-trip-setup'),
          icon: 'carseat',
        },
        {
          title: 'Airport Strategies',
          description: 'For the high-transition part of travel where simple gear suddenly feels very smart.',
          href: anchor(currentPath, 'scenario-one-the-airport-family'),
          icon: 'bag',
        },
      ],
      decisionHelperTitle: 'Solve the hardest transition first',
      decisionHelperDescription: 'Travel planning gets simpler once you stop trying to perfect the whole trip and start with the part most likely to test your patience.',
      decisionItems: [
        {
          title: 'If you fly more than you drive',
          description: 'Start with flying-with-baby planning.',
          href: anchor(currentPath, 'air-travel-setup'),
          icon: 'plane',
        },
        {
          title: 'If you need the lightest movement setup',
          description: 'Open travel strollers.',
          href: PILLAR_PATHS.travelStrollers,
          icon: 'compact',
        },
        {
          title: 'If sleep away from home worries you most',
          description: 'Jump to portable sleep solutions.',
          href: anchor(currentPath, 'sleep-on-the-go-setup'),
          icon: 'sleep',
        },
        {
          title: 'If the car setup keeps changing',
          description: 'Review travel car seat setups first.',
          href: anchor(currentPath, 'road-trip-setup'),
          icon: 'carseat',
        },
      ],
      supportLinks: [
        {
          title: 'Travel Stroller Guide',
          description: 'The deeper read if you already know portability is going to make or break the trip.',
          href: PILLAR_PATHS.travelStrollers,
          icon: 'compact',
        },
        {
          title: 'Car Seat Guide',
          description: 'Helpful once travel plans turn into infant-seat versus convertible questions.',
          href: PILLAR_PATHS.carSeats,
          icon: 'carseat',
        },
        {
          title: 'Stroller Guide',
          description: 'Useful if you are still deciding whether one stroller can do both daily life and travel.',
          href: PILLAR_PATHS.strollers,
          icon: 'stroller',
        },
      ],
    },
  };
}

function toGuideCardHubLink(card: GuideCardItem): GuideHubLink {
  return {
    title: toCondensedGuideCardTitle(card.slug, card.title),
    description: card.description,
    href: card.href,
    icon: 'book',
  };
}

export function getGuideHubConfig(slug: string, currentPath: string) {
  const guideHubConfigs = buildGuideHubConfigs(currentPath);
  return guideHubConfigs[slug] ?? null;
}

export function getGuideHeroJumpLinks({
  currentPath,
  tocItems,
}: {
  currentPath: string;
  tocItems: GuideTocItem[];
}): GuideHeroJumpLink[] {
  const preferredMatches = [
    { match: 'Introduction', label: 'Overview' },
    { match: 'Major Types and Categories', label: 'Types' },
    { match: 'How to Choose the Right Option', label: 'Decision Guide' },
    { match: 'Real-Life Scenarios', label: 'Real Life' },
  ] as const;

  const jumpLinks: GuideHeroJumpLink[] = preferredMatches.flatMap((item) => {
    const match = tocItems.find((tocItem) => tocItem.level === 2 && tocItem.label === item.match);
    return match ? [{ label: item.label, href: anchor(currentPath, match.id) }] : [];
  });

  jumpLinks.push({
    label: 'FAQ',
    href: anchor(currentPath, 'guide-faq'),
  });

  return jumpLinks;
}

export function getGuideContinueExploringBlock({
  slug,
  currentPath,
  sectionTitle,
  relatedGuides = [],
}: {
  slug: string;
  currentPath: string;
  sectionTitle: string;
  relatedGuides?: GuideCardItem[];
}): GuideContinueExploringBlock | null {
  const config = getGuideHubConfig(slug, currentPath);
  if (!config) {
    return null;
  }

  const relatedLinks = relatedGuides.map((guide) => toGuideCardHubLink(guide));
  const nextGuideLinks = getGuideNextGuideItems(slug).filter((item) => !item.current).slice(0, 3);
  const typeLinks = config.cards.slice(0, 3);
  const extraTypeLinks = config.cards.slice(3, 6);

  switch (sectionTitle) {
    case 'Why This Category Feels Overwhelming':
      return {
        title: 'Continue exploring the big picture',
        description: 'If the category still feels too broad, pick the lane that sounds most like your actual week.',
        links: typeLinks,
      };
    case 'Major Types and Categories':
      return {
        title: 'Continue exploring the types',
        description: 'These are the faster reads for narrowing the specific setup you are actually comparing.',
        links: extraTypeLinks.length > 0 ? extraTypeLinks : typeLinks,
      };
    case 'How to Choose the Right Option':
      return {
        title: 'Continue exploring the best-fit path',
        description: 'Use the quick framework to move into the part of the guide that is most likely to answer the next question.',
        links: config.decisionItems.slice(0, 3).map((item) => ({
          title: item.title,
          description: item.description,
          href: item.href,
          icon: item.icon,
        })),
      };
    case 'Real-Life Scenarios':
      return {
        title: 'Continue exploring the related decisions',
        description: 'Real life rarely keeps these categories separate. These next reads help the neighboring choice click into place.',
        links: relatedLinks.length > 0 ? relatedLinks.slice(0, 3) : config.supportLinks,
      };
    case 'Common Mistakes Parents Make':
      return {
        title: 'Continue exploring what actually matters',
        description: 'These supporting reads help you edit the noise before it becomes another expensive tab.',
        links: config.supportLinks,
      };
    case 'Expert Advice':
    case 'Product Examples':
    case 'Planning Tips':
      return {
        title: 'Continue exploring your next move',
        description: 'Once this section gets you close, use the next guide to keep the plan moving.',
        links: relatedLinks.length > 0 ? relatedLinks.slice(0, 3) : nextGuideLinks,
      };
    default:
      return null;
  }
}

export function getGuideNextGuideItems(currentSlug: string): GuideNextGuideItem[] {
  return NEXT_GUIDES_BASE.map((item) => ({
    ...item,
    current: item.slug === currentSlug,
  }));
}
