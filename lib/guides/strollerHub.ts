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

export type StrollerLifestyleMatch = {
  title: string;
  description: string;
  recommendation: string;
  href: string;
  icon: GuideHubIconKey;
};

export type StrollerRealityCheckCard = {
  brand: string;
  productName: string;
  category: string;
  review: string;
  bestFor: string;
  standout: string;
  pros: string[];
  imageUrl?: string;
  imageAlt?: string;
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
    description: 'The everyday workhorse when comfort, basket space, and neighborhood miles matter most.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing the full-size stroller category.',
  },
  {
    title: 'Compact Strollers',
    description: 'Lighter everyday strollers that work well in cities, smaller homes, and tighter trunks.',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing the compact stroller category.',
  },
  {
    title: 'Travel Strollers',
    description: 'Small-fold strollers for airports, ride shares, errands, and less bulk overall.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing the travel stroller category.',
  },
  {
    title: 'Convertible Strollers',
    description: 'Single-to-double systems built for families planning ahead to a second child.',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing the convertible stroller category.',
  },
  {
    title: 'Jogging Strollers',
    description: 'Bigger wheels and stronger suspension for rougher routes, longer walks, and parents who move faster.',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing the jogging stroller category.',
  },
  {
    title: 'Double Strollers',
    description: 'A dedicated two-seat lane for twins or two small children when fitting both riders is the whole job.',
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
    title: 'Full Size Strollers',
    description:
      'Full size strollers are usually the easiest everyday place to start. They tend to offer better ride comfort, larger baskets, and a smoother experience for daily walks.',
    href: STROLLER_PATHS.fullSize,
    icon: 'stroller',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing the full-size stroller guide.',
  },
  {
    title: 'Compact Strollers',
    description:
      'Compact strollers sit between a full-size stroller and a true travel stroller. They are useful when you want lighter handling without giving up every everyday convenience.',
    href: STROLLER_PATHS.compact,
    icon: 'compact',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing the compact stroller guide.',
  },
  {
    title: 'Travel Strollers',
    description:
      'Travel strollers prioritize portability, smaller folds, and quicker carrying. They tend to work best for flights, quick errands, and families that want less stroller overall.',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing the travel stroller guide.',
  },
  {
    title: 'Convertible Strollers',
    description:
      'Convertible strollers begin as a single stroller and can expand into a double configuration. They make the most sense when future sibling planning is part of today’s decision.',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing the convertible stroller guide.',
  },
  {
    title: 'Jogging Strollers',
    description:
      'Jogging strollers are designed for rougher ground, bigger wheels, and stronger suspension. They are not just for runners. They also help on gravel paths, broken sidewalks, and longer outdoor routes.',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing the jogging stroller guide.',
  },
  {
    title: 'Double Strollers',
    description:
      'Double strollers are built for twins or two small children from the start. They help you compare side-by-side width, tandem layouts, and what daily maneuvering actually feels like.',
    href: STROLLER_PATHS.double,
    icon: 'double',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing the double stroller guide.',
  },
];

export const STROLLER_INSIGHT_PANEL_PARAGRAPHS = [
  'The stroller industry is filled with dozens of brands, feature lists, and strong opinions.',
  'Many parents try to choose a stroller by comparing features, but the real decision usually comes down to lifestyle.',
  'Where you walk. How often you travel. How much storage space you have.',
  'Understanding the categories first is what makes the final decision feel simple.',
] as const;

export const STROLLER_LIFESTYLE_MATCHES: StrollerLifestyleMatch[] = [
  {
    title: 'Urban Living',
    description:
      'If elevators, narrower aisles, tighter storage, and everyday walking are part of the routine, lighter frames usually feel easier fast.',
    recommendation: 'Compact Strollers',
    href: STROLLER_PATHS.compact,
    icon: 'small-space',
  },
  {
    title: 'Suburban Errands',
    description:
      'If the stroller lives in the car, handles store runs, and comes out most days, comfort and basket space often matter more than the tiniest fold.',
    recommendation: 'Full Size Strollers',
    href: STROLLER_PATHS.fullSize,
    icon: 'home',
  },
  {
    title: 'Frequent Travel',
    description:
      'If you are regularly navigating airports, ride shares, or quick trunk transfers, a smaller fold saves a surprising amount of energy.',
    recommendation: 'Travel Strollers',
    href: STROLLER_PATHS.travel,
    icon: 'plane',
  },
  {
    title: 'Active Parents',
    description:
      'If your routes include uneven sidewalks, gravel, trails, or actual running, bigger wheels and stronger suspension pull their weight.',
    recommendation: 'Jogging Strollers',
    href: STROLLER_PATHS.jogging,
    icon: 'terrain',
  },
  {
    title: 'Growing Families',
    description:
      'If a second child is part of the plan, it helps to decide early whether single-to-double flexibility is worth the added size.',
    recommendation: 'Convertible Strollers',
    href: STROLLER_PATHS.convertible,
    icon: 'convertible',
  },
  {
    title: 'Minimalist Gear',
    description:
      'If you want less bulk at home, the smartest stroller is usually the one you can store, lift, and use without negotiating with it.',
    recommendation: 'Compact Strollers',
    href: STROLLER_PATHS.compact,
    icon: 'bag',
  },
];

export const STROLLER_REALITY_CHECK_CARDS: StrollerRealityCheckCard[] = [
  {
    brand: 'Silver Cross',
    productName: 'Reef 2',
    category: 'Compact Lightweight',
    review: 'At 26.5 lbs, the Reef 2 offers premium British craftsmanship with best-in-class maneuverability and enhanced suspension. Suitable from newborn to 55 lbs, it features a no-rethread harness with magnetic Genius™ buckle, multi-recline positions, and a large 22 lbs basket.',
    bestFor: 'Parents seeking premium quality and storage in a manageable 26.5 lb package.',
    standout: 'Premium British craftsmanship at 26.5 lbs',
    pros: ['Premium materials and finish', 'Best-in-class maneuverability', 'No-rethread harness system', '22 lbs basket capacity', 'One-handed fold', 'Suitable newborn to 55 lbs'],
    imageUrl: '/assets/strollers/reef.png',
    imageAlt: 'Silver Cross Reef 2 stroller.',
  },
  {
    brand: 'Bugaboo',
    productName: 'Dragonfly',
    category: 'Compact',
    review: 'Weighing 21.8 lbs, the Dragonfly (42" L x 20.5" W x 41" H unfolded, 14.2" L x 20.5" W x 35.4" H folded) is suitable for 6 months to 4 years (up to 50 lbs) with 22 lbs underseat basket and 5.5 lbs rear pocket capacity.',
    bestFor: 'Parents who want premium comfort and sustainability in an ultra-lightweight stroller.',
    standout: 'Ultra-lightweight at 21.8 lbs with premium features',
    pros: ['21.8 lbs with compact fold', 'Suitable 6 months to 50 lbs', '22 lbs underseat + 5.5 lbs rear basket', 'One-hand self-standing fold', 'Full suspension system', 'Sustainable materials'],
    imageUrl: '/assets/strollers/compact.png',
    imageAlt: 'Bugaboo Dragonfly stroller.',
  },
  {
    brand: 'UPPAbaby',
    productName: 'Vista V2',
    category: 'Full Size Convertible',
    review: 'At 27 lbs, the Vista V2 features all-weather comfort seat, Enhanced FlexRide suspension, and quick-secure harness. With 30 lbs basket capacity, UPF 50+ canopy, and ability to transport up to three children, it\'s GREENGUARD® Gold certified.',
    bestFor: 'Growing families who need a stroller that converts to double configuration with excellent storage.',
    standout: 'Highly versatile convertible at 27 lbs with premium features',
    pros: ['All-weather comfort seat', 'Enhanced FlexRide suspension', '30 lbs basket capacity', 'UPF 50+ canopy', 'Transports up to 3 children', 'GREENGUARD® Gold certified', 'Never flat tires', 'One-handed fold'],
    imageUrl: '/assets/strollers/convertable.png',
    imageAlt: 'UPPAbaby Vista V2 stroller.',
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
