import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';

const STROLLER_PATHS = {
  fullSize: getGuidePath({ slug: 'full-size-modular-strollers' }),
  compact: getGuidePath({ slug: 'compact-lightweight-strollers' }),
  travel: getGuidePath({ slug: 'travel-strollers' }),
  jogging: getGuidePath({ slug: 'jogging-all-terrain-strollers' }),
  double: getGuidePath({ slug: 'double-strollers' }),
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
    href: STROLLER_PATHS.double,
    icon: 'double',
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
    imageSrc: '/assets/strollers/jogging.png',
    imageAlt: 'Illustration representing the jogging and all-terrain stroller category.',
  },
  {
    matchTitles: ['Double and convertible strollers', 'Convertible Single-to-Double Strollers', 'Convertible Strollers'],
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing the convertible stroller category.',
  },
  {
    matchTitles: ['Double Strollers', 'Side-by-Side Double Strollers'],
    imageSrc: '/assets/strollers/double.png',
    imageAlt: 'Illustration representing the double stroller category.',
  },
] as const;

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
