import type { GuideComparisonBandGroup, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';

export const CAR_SEAT_SYSTEM_GUIDE_SLUGS = [
  'infant-car-seats',
  'convertible-car-seats',
  'all-in-one-car-seats',
  'booster-seats',
] as const;

export type CarSeatSystemGuideSlug = (typeof CAR_SEAT_SYSTEM_GUIDE_SLUGS)[number];

export const CAR_SEAT_SPECIALIZED_GUIDE_SLUGS = ['rotating-car-seats', 'travel-lightweight-car-seats'] as const;

export type CarSeatSpecializedGuideSlug = (typeof CAR_SEAT_SPECIALIZED_GUIDE_SLUGS)[number];

export type CarSeatStageProgressionItem = {
  id: string;
  stageLabel: string;
  title: string;
  description: string;
  href?: string;
  icon: GuideHubIconKey;
};

export type CarSeatCategoryPreview = {
  href?: string;
  ctaLabel?: string;
  examples: Array<{
    name: string;
    brand?: string;
    productName?: string;
    imageSrc?: string;
    imageAlt?: string;
  }>;
};

type CarSeatCategoryVisual = {
  matchTitles: string[];
  imageSrc: string;
  imageAlt: string;
};

type CarSeatHubCategory<Slug extends string> = {
  slug: Slug;
  title: string;
  shortTitle: string;
  href: string;
  icon: GuideHubIconKey;
  imageSrc: string;
  imageAlt: string;
  lifestyleDescriptor: string;
  bestFor: string;
  tradeoff: string;
  emotionalDescriptor: string;
  strength?: string;
  preview: CarSeatCategoryPreview;
};

export const CAR_SEAT_SYSTEM_PATHS = {
  hub: getGuidePath({ slug: 'best-infant-car-seats' }),
  infant: getGuidePath({ slug: 'infant-car-seats' }),
  convertible: getGuidePath({ slug: 'convertible-car-seats' }),
  allInOne: getGuidePath({ slug: 'all-in-one-car-seats' }),
  booster: getGuidePath({ slug: 'booster-seats' }),
  rotating: getGuidePath({ slug: 'rotating-car-seats' }),
  travelLightweight: getGuidePath({ slug: 'travel-lightweight-car-seats' }),
  strollerHub: getGuidePath({ slug: 'best-strollers' }),
  guideLibrary: '/guides',
} as const;

const BOOSTER_HUB_ANCHOR = `${CAR_SEAT_SYSTEM_PATHS.hub}#booster-seats`;

const CAR_SEAT_SYSTEM_CATEGORIES: readonly CarSeatHubCategory<CarSeatSystemGuideSlug>[] = [
  {
    slug: 'infant-car-seats',
    title: 'Infant Car Seats',
    shortTitle: 'Infant',
    href: CAR_SEAT_SYSTEM_PATHS.infant,
    icon: 'carseat',
    imageSrc: '/assets/car-seats/piparxbase.png',
    imageAlt: 'Nuna PIPA RX infant car seat.',
    lifestyleDescriptor: 'The newborn-first path for portable carriers, stroller clicks, and easier in-and-out transitions.',
    bestFor: 'Best for newborns, easy transport, and early travel-system convenience.',
    tradeoff: 'Shorter usage window.',
    strength: 'Portable carrier and smoother newborn logistics.',
    emotionalDescriptor: 'The calmer starting point when the newborn stage already feels like a lot.',
    preview: {
      href: CAR_SEAT_SYSTEM_PATHS.infant,
      ctaLabel: 'Start with infant car seats',
      examples: [
        { name: 'Nuna PIPA RX', brand: 'Nuna', productName: 'PIPA RX' },
        { name: 'UPPAbaby Mesa V3', brand: 'UPPAbaby', productName: 'Mesa V3' },
        { name: 'Clek Liing', brand: 'Clek', productName: 'Liing' },
      ],
    },
  },
  {
    slug: 'convertible-car-seats',
    title: 'Convertible Car Seats',
    shortTitle: 'Convertible',
    href: CAR_SEAT_SYSTEM_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/car-seats/ravanext.png',
    imageAlt: 'Nuna RAVA next convertible car seat.',
    lifestyleDescriptor: 'The stay-in-the-car lane for parents who want one strong seat from infancy into toddler life.',
    bestFor: 'Best for long-term use from infancy onward.',
    tradeoff: 'Stays in the car.',
    strength: 'Longer runway and stronger long-term value.',
    emotionalDescriptor: 'The grounded choice when you want to skip the carrier stage and settle into one seat.',
    preview: {
      href: CAR_SEAT_SYSTEM_PATHS.convertible,
      ctaLabel: 'Compare convertible options',
      examples: [
        { name: 'Nuna RAVA next', brand: 'Nuna', productName: 'RAVA next' },
        { name: 'Britax Poplar', brand: 'Britax', productName: 'Poplar' },
        { name: 'Clek Foonf', brand: 'Clek', productName: 'Foonf' },
      ],
    },
  },
  {
    slug: 'all-in-one-car-seats',
    title: 'All-in-One Car Seats',
    shortTitle: 'All-in-One',
    href: CAR_SEAT_SYSTEM_PATHS.allInOne,
    icon: 'layers',
    imageSrc: '/assets/car-seats/execnext.png',
    imageAlt: 'Nuna EXEC next all-in-one car seat.',
    lifestyleDescriptor: 'The long-view path for families who want one seat to cover multiple stages without restarting later.',
    bestFor: 'Best for long-term, multi-stage use.',
    tradeoff: 'Bulkier and less specialized early on.',
    strength: 'Multi-stage longevity in one purchase.',
    emotionalDescriptor: 'The planning-ahead lane when longevity matters more than newborn portability.',
    preview: {
      href: CAR_SEAT_SYSTEM_PATHS.allInOne,
      ctaLabel: 'Explore all-in-one systems',
      examples: [
        { name: 'Nuna EXEC next', brand: 'Nuna', productName: 'EXEC next' },
        { name: 'Britax One4Life', brand: 'Britax', productName: 'One4Life' },
      ],
    },
  },
  {
    slug: 'booster-seats',
    title: 'Booster Seats',
    shortTitle: 'Booster',
    href: BOOSTER_HUB_ANCHOR,
    icon: 'shield',
    imageSrc: '/assets/car-seats/alta.png',
    imageAlt: 'UPPAbaby Alta V2 booster seat.',
    lifestyleDescriptor: 'The later-stage lane for older kids who are outgrowing harnessed seats but still need belt-positioning support.',
    bestFor: 'Best for older children who are ready for the booster stage.',
    tradeoff: 'Not part of the newborn decision.',
    strength: 'Explains where the car seat journey goes next.',
    emotionalDescriptor: 'A future stage to understand now, not a newborn problem to solve today.',
    preview: {
      examples: [
        { name: 'UPPAbaby Alta V2', brand: 'UPPAbaby', productName: 'Alta V2' },
        { name: 'Clek Oobr', brand: 'Clek', productName: 'Oobr' },
      ],
    },
  },
] as const;

const CAR_SEAT_SPECIALIZED_CATEGORIES: readonly CarSeatHubCategory<CarSeatSpecializedGuideSlug>[] = [
  {
    slug: 'rotating-car-seats',
    title: 'Rotating Car Seats',
    shortTitle: 'Rotating',
    href: CAR_SEAT_SYSTEM_PATHS.rotating,
    icon: 'convertible',
    imageSrc: '/assets/car-seats/revvmaxx.png',
    imageAlt: 'Nuna REVV maxx rotating car seat.',
    lifestyleDescriptor: 'The convenience-first lane for families who want easier loading and less twisting in one heavily used vehicle.',
    bestFor: 'Best for daily buckle-ins, rear-facing loading ease, and convenience in a primary car.',
    tradeoff: 'Heavier, larger, and usually more expensive.',
    strength: 'Makes the loading routine easier to live with.',
    emotionalDescriptor: 'The path for parents who are not chasing portability. They are trying to make daily loading feel less awkward.',
    preview: {
      href: CAR_SEAT_SYSTEM_PATHS.rotating,
      ctaLabel: 'Explore rotating car seats',
      examples: [
        { name: 'Nuna REVV maxx', brand: 'Nuna', productName: 'REVV maxx' },
        { name: 'CYBEX Callisto', brand: 'CYBEX', productName: 'Callisto' },
        { name: 'Maxi-Cosi Peri 180', brand: 'Maxi-Cosi', productName: 'Peri 180' },
      ],
    },
  },
  {
    slug: 'travel-lightweight-car-seats',
    title: 'Travel & Lightweight Car Seats',
    shortTitle: 'Travel & Lightweight',
    href: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
    icon: 'plane',
    imageSrc: '/assets/car-seats/wayb.png',
    imageAlt: 'WAYB Pico travel car seat.',
    lifestyleDescriptor: 'The movement-first lane for families solving flights, car swaps, grandparents, or less weight to carry around.',
    bestFor: 'Best for portability, second vehicles, travel routines, and lighter movement between places.',
    tradeoff: 'Not every lightweight or travel-friendly seat is the best everyday seat for every family.',
    strength: 'Keeps the seat from becoming the hardest part of getting out the door.',
    emotionalDescriptor: 'The calmer lane when the seat keeps moving with you instead of staying parked in one main car.',
    preview: {
      href: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
      ctaLabel: 'Explore travel & lightweight car seats',
      examples: [
        { name: 'WAYB Pico', brand: 'WAYB', productName: 'Pico' },
        { name: 'Maxi-Cosi Romi', brand: 'Maxi-Cosi', productName: 'Romi' },
      ],
    },
  },
] as const;

const CAR_SEAT_CATEGORY_VISUALS: readonly CarSeatCategoryVisual[] = [
  {
    matchTitles: ['Infant Car Seats'],
    imageSrc: '/assets/car-seats/piparxbase.png',
    imageAlt: 'Nuna PIPA RX infant car seat.',
  },
  {
    matchTitles: ['Convertible Car Seats'],
    imageSrc: '/assets/car-seats/ravanext.png',
    imageAlt: 'Nuna RAVA next convertible car seat.',
  },
  {
    matchTitles: ['All-in-One Car Seats'],
    imageSrc: '/assets/car-seats/execnext.png',
    imageAlt: 'Nuna EXEC next all-in-one car seat.',
  },
  {
    matchTitles: ['Booster Seats'],
    imageSrc: '/assets/car-seats/alta.png',
    imageAlt: 'UPPAbaby Alta V2 booster seat.',
  },
  {
    matchTitles: ['Rotating Car Seats'],
    imageSrc: '/assets/car-seats/revvmaxx.png',
    imageAlt: 'Nuna REVV maxx rotating car seat.',
  },
  {
    matchTitles: ['Travel & Lightweight Car Seats'],
    imageSrc: '/assets/car-seats/wayb.png',
    imageAlt: 'WAYB Pico travel car seat.',
  },
] as const;

const CAR_SEAT_CATEGORY_MAP = Object.fromEntries(
  CAR_SEAT_SYSTEM_CATEGORIES.map((category) => [category.slug, category]),
) as Record<CarSeatSystemGuideSlug, CarSeatHubCategory<CarSeatSystemGuideSlug>>;

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toHubCard({
  title,
  description,
  bestFor,
  href,
  icon,
  imageSrc,
  imageAlt,
  showPlaceholder,
}: {
  title: string;
  description: string;
  bestFor: string;
  href: string;
  icon: GuideHubIconKey;
  imageSrc?: string;
  imageAlt?: string;
  showPlaceholder?: boolean;
}): GuideHubLink {
  return {
    title,
    description,
    bestFor,
    href,
    icon,
    imageSrc,
    imageAlt,
    showPlaceholder,
  };
}

export const CAR_SEAT_HUB_CONTEXT = {
  breadcrumb: ['TMBC Guides', 'Car Seats', 'Stage-Based System'],
  currentLabel: 'Car Seat Stages',
  compareLabel: 'Stroller Guide',
  compareHref: CAR_SEAT_SYSTEM_PATHS.strollerHub,
  compareCtaLabel: 'See the stroller system ->',
  hubLabel: 'TMBC Guides',
  hubHref: CAR_SEAT_SYSTEM_PATHS.guideLibrary,
  hubCtaLabel: 'Browse the full guide library ->',
} as const;

export const CAR_SEAT_HUB_FIT_CHECK = {
  title: 'Use the stage, not the marketing copy, as the fit check',
  description:
    'The goal is not to find a car seat that sounds the most impressive. It is to choose the stage that matches your baby, your vehicle, and the adults who will use it every day.',
  fitSummary:
    'This guide is for you if the category names all blur together and you need a calmer way to decide where to start.',
  fitBullets: [
    'You are choosing between infant, convertible, and all-in-one as a starting point.',
    'You want to understand what each stage solves before you compare specific seats.',
    'You care more about correct everyday use than collecting every premium feature on paper.',
  ],
  notFitSummary:
    'This may not be your best fit if you already know the exact stage and only need a shortlist of model-level recommendations.',
  notFitBullets: [
    'You have already decided on infant, convertible, or all-in-one and want specific seat comparisons next.',
    'Your biggest question is about one exact model instead of the category itself.',
    'You are solving a later booster transition rather than the main starting-stage decision.',
  ],
  signatureMoment: 'The safest car seat is the one that fits your child, your car, and your real life.',
} as const;

export function getCarSeatHubStartingPointCards(): GuideHubLink[] {
  return [
    toHubCard({
      title: "I'm starting from birth",
      description: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].emotionalDescriptor,
      bestFor: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].bestFor,
      href: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].href,
      icon: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].icon,
      imageSrc: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].imageSrc,
      imageAlt: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].imageAlt,
    }),
    toHubCard({
      title: 'I want something that grows with my child',
      description: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].emotionalDescriptor,
      bestFor: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].bestFor,
      href: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].href,
      icon: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].icon,
      imageSrc: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].imageSrc,
      imageAlt: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].imageAlt,
    }),
    toHubCard({
      title: "I'm planning ahead or already past the newborn stage",
      description: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].emotionalDescriptor,
      bestFor: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].bestFor,
      href: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].href,
      icon: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].icon,
      imageSrc: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].imageSrc,
      imageAlt: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].imageAlt,
    }),
  ];
}

export function getCarSeatHubCategoryGridCards(): GuideHubLink[] {
  return [...CAR_SEAT_SYSTEM_CATEGORIES, ...CAR_SEAT_SPECIALIZED_CATEGORIES].map((category) =>
    toHubCard({
      title: category.title,
      description: category.lifestyleDescriptor,
      bestFor: category.bestFor,
      href: category.href,
      icon: category.icon,
      imageSrc: category.imageSrc,
      imageAlt: category.imageAlt,
    }),
  );
}

export function getCarSeatStageProgressionItems(): CarSeatStageProgressionItem[] {
  return [
    {
      id: 'newborn-infant',
      stageLabel: 'Newborn',
      title: 'Infant',
      description: 'Portable carrier for the earliest trips, appointments, and stroller-compatible stage.',
      href: CAR_SEAT_SYSTEM_PATHS.infant,
      icon: 'carseat',
    },
    {
      id: 'infant-convertible',
      stageLabel: 'Infant',
      title: 'Convertible',
      description: 'Longer-use seat that stays installed and usually starts making more sense once portability matters less.',
      href: CAR_SEAT_SYSTEM_PATHS.convertible,
      icon: 'convertible',
    },
    {
      id: 'toddler-all-in-one',
      stageLabel: 'Toddler',
      title: 'All-in-One',
      description: 'Multi-stage system for families thinking long-term and willing to accept a bigger seat for it.',
      href: CAR_SEAT_SYSTEM_PATHS.allInOne,
      icon: 'layers',
    },
    {
      id: 'child-booster',
      stageLabel: 'Child',
      title: 'Booster',
      description: 'The later stage to understand now, even if it is not the seat you need to buy for a newborn.',
      href: BOOSTER_HUB_ANCHOR,
      icon: 'shield',
    },
  ];
}

export function getCarSeatComparisonBandGroups(): GuideComparisonBandGroup[] {
  return [
    {
      label: 'Core starting paths',
      items: CAR_SEAT_SYSTEM_CATEGORIES.filter((category) => category.slug !== 'booster-seats').map((category) => ({
        id: category.slug,
        title: category.title,
        href: category.href,
        icon: category.icon,
        bestFor: category.bestFor,
        strength: category.strength,
        tradeoff: category.tradeoff,
      })),
    },
  ];
}

export function getCarSeatCategoryPreview(title: string): CarSeatCategoryPreview | null {
  const normalizedTitle = normalizeValue(title);
  const match = [...CAR_SEAT_SYSTEM_CATEGORIES, ...CAR_SEAT_SPECIALIZED_CATEGORIES].find(
    (category) => normalizeValue(category.title) === normalizedTitle,
  );
  return match?.preview ?? null;
}

export function getCarSeatCategoryVisual(title: string) {
  const normalizedTitle = normalizeValue(title);
  return (
    CAR_SEAT_CATEGORY_VISUALS.find((visual) =>
      visual.matchTitles.some((matchTitle) => normalizeValue(matchTitle) === normalizedTitle),
    ) ?? null
  );
}

export function getCarSeatContinueExploringLinks(): GuideHubLink[] {
  return [
    toHubCard({
      title: 'Infant Guide',
      description: 'Start there if newborn portability, click-in convenience, and smoother early transitions are the real priority.',
      bestFor: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].bestFor,
      href: CAR_SEAT_SYSTEM_PATHS.infant,
      icon: CAR_SEAT_CATEGORY_MAP['infant-car-seats'].icon,
    }),
    toHubCard({
      title: 'Convertible Guide',
      description: 'Open this next if you want one seat to stay put and serve the longer rear-facing and toddler years.',
      bestFor: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].bestFor,
      href: CAR_SEAT_SYSTEM_PATHS.convertible,
      icon: CAR_SEAT_CATEGORY_MAP['convertible-car-seats'].icon,
    }),
    toHubCard({
      title: 'All-in-One Guide',
      description: 'The right next step when you are planning longer-term and want to weigh the bulk-versus-longevity tradeoff directly.',
      bestFor: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].bestFor,
      href: CAR_SEAT_SYSTEM_PATHS.allInOne,
      icon: CAR_SEAT_CATEGORY_MAP['all-in-one-car-seats'].icon,
    }),
    toHubCard({
      title: 'Rotating Guide',
      description: 'Useful when the real question is whether the swivel feature will meaningfully improve everyday loading or just look very convincing in the demo.',
      bestFor: 'Parents deciding whether convenience-first rotation is worth the added footprint and price.',
      href: CAR_SEAT_SYSTEM_PATHS.rotating,
      icon: 'convertible',
    }),
    toHubCard({
      title: 'Travel & Lightweight Guide',
      description: 'Open this next if flights, car swaps, grandparents, or lighter carrying are turning portability into the real decision.',
      bestFor: 'Families solving travel, secondary-vehicle, or movement-between-cars friction.',
      href: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
      icon: 'plane',
    }),
  ];
}
