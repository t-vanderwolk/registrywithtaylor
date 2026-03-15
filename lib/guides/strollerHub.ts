import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';

function withAnchor(path: string, id: string) {
  return `${path}#${id}`;
}

const STROLLER_PATHS = {
  fullSize: getGuidePath({ slug: 'full-size-modular-strollers' }),
  compact: getGuidePath({ slug: 'compact-lightweight-strollers' }),
  travel: getGuidePath({ slug: 'travel-strollers' }),
  jogging: getGuidePath({ slug: 'jogging-all-terrain-strollers' }),
  double: getGuidePath({ slug: 'double-strollers' }),
  convertible: withAnchor(getGuidePath({ slug: 'double-strollers' }), 'convertible-single-to-double'),
} as const;

const BLOG_PATHS = {
  strollerComparisons: '/blog/stroller-comparisons',
  bestTravelStrollers: '/blog/best-travel-strollers',
  bestInfantCarSeats: '/blog/best-infant-car-seats',
} as const;

type StrollerEditorialCallout = {
  matchTitle: string;
  text: string;
  icon: GuideHubIconKey;
};

type StrollerEditorialImage = {
  matchTitle: string;
  eyebrow: string;
  src: string;
  alt: string;
  caption: string;
};

export type StrollerDecisionStrip = {
  matchTitles: string[];
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  icon: GuideHubIconKey;
};

export type StrollerPreviewExample = {
  name: string;
  imageSrc: string;
  imageAlt: string;
};

export type StrollerCategoryPreview = {
  matchTitles: string[];
  href: string;
  ctaLabel: string;
  examples: StrollerPreviewExample[];
};

export const STROLLER_START_HERE_ITEMS: GuideHubDecisionItem[] = [
  {
    title: 'I need one stroller for everyday life',
    description: 'Start with the full-size lane if walks, basket space, handling, and daily comfort matter most.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
  },
  {
    title: 'I travel often with a baby',
    description: 'Head straight to the lighter, faster-folding options built for airports, trunks, and quick transitions.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
  },
  {
    title: "I'm planning for two children",
    description: 'Use the double-stroller path to compare footprint, configuration, and whether future flexibility is truly worth it.',
    href: STROLLER_PATHS.convertible,
    icon: 'double',
  },
];

export const STROLLER_NAVIGATOR_CARDS: GuideHubLink[] = [
  {
    title: 'Full Size Strollers',
    description: 'The strongest everyday option when comfort, handling, basket space, and regular neighborhood use matter most.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing the full-size stroller category.',
  },
  {
    title: 'Compact Strollers',
    description: 'A lighter everyday lane for tighter trunks, smaller homes, city errands, and parents who want less bulk.',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing the compact stroller category.',
  },
  {
    title: 'Travel Strollers',
    description: 'Made for faster folds, lighter carrying, and the version of parent life that involves trunks, airports, and quick transitions.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing the travel stroller category.',
  },
  {
    title: 'Convertible Strollers',
    description: 'For families thinking ahead to siblings and deciding whether single-to-double flexibility is actually worth the size.',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing the convertible stroller category.',
  },
  {
    title: 'Jogging Strollers',
    description: 'Best for runners, rougher terrain, and families who need bigger wheels and stronger suspension for daily routes.',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing the jogging stroller category.',
  },
  {
    title: 'Double Strollers',
    description: 'Built for twins or two small children when you know the everyday job is carrying both riders at once.',
    href: STROLLER_PATHS.double,
    icon: 'double',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing the double stroller category.',
  },
];

export const STROLLER_HUB_DECISION_ITEMS: GuideHubDecisionItem[] = [
  {
    title: 'I want the easiest everyday stroller',
    description: 'Start with the full-size guide if daily comfort, handling, and basket space matter more than the smallest fold.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
  },
  {
    title: 'I live in a city or walk a lot',
    description: 'Compact strollers usually make the most sense when tighter spaces and lighter everyday handling are part of the routine.',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
  },
  {
    title: 'I want one stroller that can grow with my family',
    description: 'Use the convertible path when sibling planning is part of the decision and you need the real tradeoffs spelled out.',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
  },
  {
    title: 'I run or spend time on trails',
    description: 'Head straight to jogging strollers if bigger wheels, stronger suspension, and rougher ground are part of real life.',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
  },
  {
    title: 'I need something small for travel',
    description: 'Travel strollers help most when carrying, folding, and overhead-bin thinking are part of the conversation.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
  },
  {
    title: 'I have twins or two small children',
    description: 'The double stroller guide helps narrow width, layout, and whether a dedicated double solves the actual problem faster.',
    href: STROLLER_PATHS.double,
    icon: 'double',
  },
];

export const STROLLER_SERIES_CARDS: GuideHubLink[] = [
  {
    title: 'Full Size Stroller Guide',
    description: 'A better place to compare baskets, suspension, seat versatility, and what matters in a primary stroller.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing the full-size stroller guide.',
  },
  {
    title: 'Compact Stroller Guide',
    description: 'Sort lighter everyday options around fold size, carry weight, and whether compact still feels good daily.',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing the compact stroller guide.',
  },
  {
    title: 'Travel Stroller Guide',
    description: 'Go deeper on the small-fold options parents compare once portability becomes the deciding factor.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing the travel stroller guide.',
  },
  {
    title: 'Convertible Stroller Guide',
    description: 'Follow the single-to-double lane if future sibling planning is shaping the decision today.',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing the convertible stroller guide.',
  },
  {
    title: 'Jogging Stroller Guide',
    description: 'Useful when the stroller needs to handle trails, uneven terrain, and faster movement without drama.',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing the jogging stroller guide.',
  },
  {
    title: 'Double Stroller Guide',
    description: 'Compare side-by-side, tandem, and when a dedicated two-child setup is easier than forcing flexibility.',
    href: STROLLER_PATHS.double,
    icon: 'double',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing the double stroller guide.',
  },
];

const STROLLER_VISIBLE_TOC_MATCHES = [
  { match: 'Introduction', label: 'Introduction', level: 2 as const },
  { match: 'Major Types and Categories', label: 'Stroller Types', level: 2 as const },
  { match: 'Double and convertible strollers', label: 'Double & Convertible', level: 3 as const },
  { match: 'How to Choose the Right Option', label: 'How to Choose', level: 2 as const },
  { match: 'Real-Life Scenarios', label: 'Real Life Scenarios', level: 2 as const },
  { match: 'FAQ', label: 'FAQ', level: 2 as const, id: 'guide-faq' },
  { match: 'Final Thoughts', label: 'Final Thoughts', level: 2 as const },
];

const STROLLER_REALITY_CHECKS: StrollerEditorialCallout[] = [
  {
    matchTitle: 'Why This Category Feels Overwhelming',
    text: 'Most parents do not choose the wrong stroller because they missed a premium feature. They choose the wrong stroller because the demo felt smoother than real Tuesday life.',
    icon: 'strategy',
  },
  {
    matchTitle: 'Major Types and Categories',
    text: 'Most parents eventually use two strollers: one for everyday life and one that behaves better in trunks, airports, and tight storage situations.',
    icon: 'layers',
  },
  {
    matchTitle: 'How to Choose the Right Option',
    text: 'A stroller can look excellent in a showroom and still be deeply annoying once you are folding it in a parking lot with one free hand.',
    icon: 'compact',
  },
  {
    matchTitle: 'Real-Life Scenarios',
    text: 'The stroller that sounds smartest is not always the stroller you use most. The daily route usually wins that argument pretty fast.',
    icon: 'road',
  },
];

const STROLLER_EDITORIAL_IMAGES: StrollerEditorialImage[] = [
  {
    matchTitle: 'Major Types and Categories',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/stroller-types.jpg',
    alt: 'Editorial placeholder image for stroller categories and types.',
    caption: 'Stroller categories get clearer once you picture where the stroller actually lives: neighborhood loops, trunk transfers, store aisles, and airport gates.',
  },
  {
    matchTitle: 'Real-Life Scenarios',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/stroller-folds.jpg',
    alt: 'Editorial placeholder image focused on stroller folds and portability.',
    caption: 'A good fold matters less in theory than it does while holding a baby, a bag, and the quiet hope that nothing falls out of the basket.',
  },
  {
    matchTitle: 'Planning Tips',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/double-strollers.jpg',
    alt: 'Editorial placeholder image for double and convertible stroller planning.',
    caption: 'Planning for two children sounds strategic on paper. In practice, weight, width, and daily maneuvering deserve equal billing.',
  },
];

export const STROLLER_DECISION_STRIPS: StrollerDecisionStrip[] = [
  {
    matchTitles: ['Full-size everyday strollers', 'Full-Size Strollers'],
    title: 'Best fit if you:',
    bullets: ['walk most days', 'want smoother suspension', 'care about comfort and basket space'],
    href: STROLLER_PATHS.fullSize,
    ctaLabel: 'Read the Full-Size Stroller Guide',
    icon: 'stroller',
  },
  {
    matchTitles: ['Compact strollers', 'Compact Strollers', 'Compact and lightweight strollers', 'Compact & Lightweight Strollers'],
    title: 'Best fit if you:',
    bullets: ['want a lighter everyday option', 'need easier trunk or closet storage', 'still want more comfort than a true travel stroller'],
    href: STROLLER_PATHS.compact,
    ctaLabel: 'Read the Compact Stroller Guide',
    icon: 'compact',
  },
  {
    matchTitles: ['Lightweight and travel strollers', 'Travel Strollers'],
    title: 'Best fit if you:',
    bullets: ['lift the stroller often', 'want a faster fold', 'travel or store gear in smaller spaces'],
    href: STROLLER_PATHS.travel,
    ctaLabel: 'Read the Travel Stroller Guide',
    icon: 'plane',
  },
  {
    matchTitles: ['Modular strollers', 'Modular Strollers'],
    title: 'Best fit if you:',
    bullets: ['want multiple seating modes', 'care about newborn flexibility', 'prefer one stronger everyday system'],
    href: STROLLER_PATHS.fullSize,
    ctaLabel: 'Read the Full-Size Stroller Guide',
    icon: 'layers',
  },
  {
    matchTitles: ['Jogging and all-terrain strollers', 'Jogging and All-Terrain Strollers', 'Jogging & All-Terrain'],
    title: 'Best fit if you:',
    bullets: ['walk on rougher ground', 'run or hike regularly', 'need bigger wheels and stronger suspension'],
    href: STROLLER_PATHS.jogging,
    ctaLabel: 'Read the Jogging & All-Terrain Guide',
    icon: 'terrain',
  },
  {
    matchTitles: ['Double and convertible strollers', 'Convertible Single-to-Double Strollers', 'Convertible Strollers', 'Double Strollers'],
    title: 'Best fit if you:',
    bullets: ['are planning around siblings', 'need to compare width and flexibility', 'want to know when single-to-double math actually makes sense'],
    href: STROLLER_PATHS.double,
    ctaLabel: 'Read the Double Stroller Guide',
    icon: 'double',
  },
];

export const STROLLER_COMPARISON_CARDS: GuideHubLink[] = [
  {
    title: 'Everyday stroller vs travel stroller',
    description: 'A cleaner starting point when the real question is comfort and basket space versus lighter carry and easier storage.',
    href: BLOG_PATHS.strollerComparisons,
    icon: 'stroller',
  },
  {
    title: 'Travel strollers worth comparing',
    description: 'Useful once your shortlist starts circling fold size, carry weight, and what actually helps in airports.',
    href: BLOG_PATHS.bestTravelStrollers,
    icon: 'plane',
  },
  {
    title: 'Travel system pairings to compare',
    description: 'Helpful when the stroller choice is getting tangled up with infant car seat compatibility and early baby routines.',
    href: BLOG_PATHS.bestInfantCarSeats,
    icon: 'carseat',
  },
];

const STROLLER_CATEGORY_VISUALS = [
  {
    matchTitles: ['Full-size everyday strollers', 'Full-Size Strollers', 'Full Size Strollers'],
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing the full-size stroller category.',
  },
  {
    matchTitles: ['Compact strollers', 'Compact Strollers'],
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing the compact stroller category.',
  },
  {
    matchTitles: ['Lightweight and travel strollers', 'Travel Strollers', 'Travel Systems'],
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing the travel stroller category.',
  },
  {
    matchTitles: ['Jogging and all-terrain strollers', 'Jogging and All-Terrain Strollers', 'Jogging & All-Terrain'],
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing the jogging and all-terrain stroller category.',
  },
  {
    matchTitles: ['Double and convertible strollers', 'Convertible Single-to-Double Strollers', 'Convertible Strollers'],
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing the convertible stroller category.',
  },
  {
    matchTitles: ['Double Strollers', 'Side-by-Side Double Strollers'],
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing the double stroller category.',
  },
] as const;

const STROLLER_CATEGORY_PREVIEWS: StrollerCategoryPreview[] = [
  {
    matchTitles: ['Full-size everyday strollers', 'Full-Size Strollers', 'Full Size Strollers'],
    href: STROLLER_PATHS.fullSize,
    ctaLabel: 'Explore the Full-Size Stroller Guide',
    examples: [
      {
        name: 'Bugaboo Fox 5',
        imageSrc: '/assets/strollers/fox5.png',
        imageAlt: 'Bugaboo Fox 5 stroller.',
      },
      {
        name: 'Nuna MIXX Next',
        imageSrc: '/assets/strollers/mixx.png',
        imageAlt: 'Nuna MIXX Next stroller.',
      },
      {
        name: 'Silver Cross Reef 2',
        imageSrc: '/assets/strollers/reef.png',
        imageAlt: 'Silver Cross Reef 2 stroller.',
      },
    ],
  },
  {
    matchTitles: ['Compact strollers', 'Compact Strollers'],
    href: STROLLER_PATHS.compact,
    ctaLabel: 'Explore the Compact Stroller Guide',
    examples: [
      {
        name: 'Bugaboo Dragonfly',
        imageSrc: '/assets/strollers/compact.png',
        imageAlt: 'Bugaboo Dragonfly stroller.',
      },
      {
        name: 'Nuna TRIV',
        imageSrc: '/assets/strollers/triv.png',
        imageAlt: 'Nuna TRIV stroller.',
      },
      {
        name: 'Cybex Mios',
        imageSrc: '/assets/strollers/mios.png',
        imageAlt: 'Cybex Mios stroller.',
      },
    ],
  },
  {
    matchTitles: ['Lightweight and travel strollers', 'Travel Strollers'],
    href: STROLLER_PATHS.travel,
    ctaLabel: 'Explore the Travel Stroller Guide',
    examples: [
      {
        name: 'Bugaboo Butterfly',
        imageSrc: '/assets/strollers/butterfly.png',
        imageAlt: 'Bugaboo Butterfly stroller.',
      },
      {
        name: 'Nuna TRVL lx',
        imageSrc: '/assets/strollers/trvllx.png',
        imageAlt: 'Nuna TRVL lx stroller.',
      },
      {
        name: 'Joolz Aer+',
        imageSrc: '/assets/strollers/joolz.png',
        imageAlt: 'Joolz Aer+ stroller.',
      },
    ],
  },
  {
    matchTitles: ['Jogging and all-terrain strollers', 'Jogging and All-Terrain Strollers', 'Jogging & All-Terrain'],
    href: STROLLER_PATHS.jogging,
    ctaLabel: 'Explore the Jogging Stroller Guide',
    examples: [
      {
        name: 'UPPAbaby Ridge',
        imageSrc: '/assets/strollers/ridge.png',
        imageAlt: 'UPPAbaby Ridge stroller.',
      },
      {
        name: 'Thule Urban Glide',
        imageSrc: '/assets/strollers/urbnglide.png',
        imageAlt: 'Thule Urban Glide stroller.',
      },
      {
        name: 'BOB Alterrian',
        imageSrc: '/assets/strollers/alterrian.png',
        imageAlt: 'BOB Alterrian stroller.',
      },
    ],
  },
  {
    matchTitles: ['Double and convertible strollers', 'Convertible Single-to-Double Strollers', 'Convertible Strollers'],
    href: STROLLER_PATHS.convertible,
    ctaLabel: 'Explore the Convertible Stroller Guide',
    examples: [
      {
        name: 'Bugaboo Donkey 6',
        imageSrc: '/assets/strollers/donkey.png',
        imageAlt: 'Bugaboo Donkey 6 stroller.',
      },
      {
        name: 'Silver Cross Wave 3',
        imageSrc: '/assets/strollers/wave.png',
        imageAlt: 'Silver Cross Wave 3 stroller.',
      },
      {
        name: 'CYBEX Gazelle S',
        imageSrc: '/assets/strollers/gazelle.png',
        imageAlt: 'CYBEX Gazelle S stroller.',
      },
    ],
  },
  {
    matchTitles: ['Double Strollers', 'Side-by-Side Double Strollers'],
    href: STROLLER_PATHS.double,
    ctaLabel: 'Explore the Double Stroller Guide',
    examples: [
      {
        name: 'Bumbleride Indie Twin',
        imageSrc: '/assets/strollers/inditwin.png',
        imageAlt: 'Bumbleride Indie Twin stroller.',
      },
      {
        name: 'BOB Revolution Flex Duallie',
        imageSrc: '/assets/strollers/revolution.png',
        imageAlt: 'BOB Revolution Flex Duallie stroller.',
      },
      {
        name: 'UPPAbaby Minu Duo',
        imageSrc: '/assets/strollers/minuduo.png',
        imageAlt: 'UPPAbaby Minu Duo stroller.',
      },
    ],
  },
];

function normalizeStrollerTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getStrollerVisibleTocItems(tocItems: GuideTocItem[]) {
  return STROLLER_VISIBLE_TOC_MATCHES.flatMap((item) => {
    if (item.id) {
      return [{ id: item.id, label: item.label, level: item.level }];
    }

    const match = tocItems.find((tocItem) => tocItem.label === item.match && tocItem.level === item.level);
    return match ? [{ id: match.id, label: item.label, level: match.level }] : [];
  });
}

export function getStrollerRealityCheck(sectionTitle: string) {
  return STROLLER_REALITY_CHECKS.find((item) => item.matchTitle === sectionTitle) ?? null;
}

export function getStrollerEditorialImage(sectionTitle: string) {
  return STROLLER_EDITORIAL_IMAGES.find((item) => item.matchTitle === sectionTitle) ?? null;
}

export function getStrollerDecisionStrip(subsectionTitle: string) {
  const normalizedTitle = normalizeStrollerTitle(subsectionTitle);
  return STROLLER_DECISION_STRIPS.find((item) =>
    item.matchTitles.some((title) => normalizeStrollerTitle(title) === normalizedTitle),
  ) ?? null;
}

export function getStrollerCategoryVisual(subsectionTitle: string) {
  const normalizedTitle = normalizeStrollerTitle(subsectionTitle);
  return STROLLER_CATEGORY_VISUALS.find((item) =>
    item.matchTitles.some((title) => normalizeStrollerTitle(title) === normalizedTitle),
  ) ?? null;
}

export function getStrollerCategoryPreview(subsectionTitle: string) {
  const normalizedTitle = normalizeStrollerTitle(subsectionTitle);
  return STROLLER_CATEGORY_PREVIEWS.find((item) =>
    item.matchTitles.some((title) => normalizeStrollerTitle(title) === normalizedTitle),
  ) ?? null;
}
