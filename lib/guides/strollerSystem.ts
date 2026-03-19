import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';

export const STROLLER_SYSTEM_GUIDE_SLUGS = [
  'full-size-modular-strollers',
  'compact-lightweight-strollers',
  'travel-strollers',
  'convertible-strollers',
  'double-strollers',
  'jogging-all-terrain-strollers',
] as const;

export type StrollerSystemGuideSlug = (typeof STROLLER_SYSTEM_GUIDE_SLUGS)[number];

type StrollerSystemGroup = 'core' | 'secondary';

export type StrollerComparisonBandItem = {
  slug: StrollerSystemGuideSlug;
  title: string;
  shortTitle: string;
  href: string;
  icon: GuideHubIconKey;
  bestFor: string;
  tradeoff: string;
  isActive: boolean;
};

type StrollerSystemCategory = {
  slug: StrollerSystemGuideSlug;
  title: string;
  shortTitle: string;
  href: string;
  icon: GuideHubIconKey;
  imageSrc: string;
  imageAlt: string;
  group: StrollerSystemGroup;
  lifestyleDescriptor: string;
  bestFor: string;
  tradeoff: string;
  emotionalDescriptor: string;
  signatureMoment: string;
  compareWith: StrollerSystemGuideSlug;
};

const STROLLER_SYSTEM_PATHS = {
  hub: getGuidePath({ slug: 'best-strollers' }),
  fullSize: getGuidePath({ slug: 'full-size-modular-strollers' }),
  compact: getGuidePath({ slug: 'compact-lightweight-strollers' }),
  travel: getGuidePath({ slug: 'travel-strollers' }),
  convertible: getGuidePath({ slug: 'convertible-strollers' }),
  double: getGuidePath({ slug: 'double-strollers' }),
  jogging: getGuidePath({ slug: 'jogging-all-terrain-strollers' }),
} as const;

const STROLLER_SYSTEM_CATEGORIES: readonly StrollerSystemCategory[] = [
  {
    slug: 'full-size-modular-strollers',
    title: 'Full Size & Modular',
    shortTitle: 'Full Size',
    href: STROLLER_SYSTEM_PATHS.fullSize,
    icon: 'stroller',
    imageSrc: '/assets/strollers/fullsize.png',
    imageAlt: 'Illustration representing full-size and modular strollers.',
    group: 'core',
    lifestyleDescriptor: 'The everyday anchor when walks, comfort, and stronger handling shape the week.',
    bestFor: 'Best for daily use, comfort, and a true primary stroller.',
    tradeoff: 'Larger and heavier.',
    emotionalDescriptor: 'Steady, capable, and meant to carry more of the day with less friction.',
    signatureMoment: 'The right stroller should feel easier to live with, not more impressive on paper.',
    compareWith: 'compact-lightweight-strollers',
  },
  {
    slug: 'compact-lightweight-strollers',
    title: 'Compact',
    shortTitle: 'Compact',
    href: STROLLER_SYSTEM_PATHS.compact,
    icon: 'compact',
    imageSrc: '/assets/strollers/compact.png',
    imageAlt: 'Illustration representing compact strollers.',
    group: 'core',
    lifestyleDescriptor: 'The convenience lane for car-heavy routines, quicker folds, and less stroller overall.',
    bestFor: 'Best for convenience, car-heavy routines, and easier everyday storage.',
    tradeoff: 'Less storage and suspension.',
    emotionalDescriptor: 'Lighter, calmer, and built for the version of parent life that keeps moving.',
    signatureMoment: 'Convenience matters more than category prestige once the stroller starts living in your trunk.',
    compareWith: 'travel-strollers',
  },
  {
    slug: 'travel-strollers',
    title: 'Travel',
    shortTitle: 'Travel',
    href: STROLLER_SYSTEM_PATHS.travel,
    icon: 'plane',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Illustration representing travel strollers.',
    group: 'core',
    lifestyleDescriptor: 'The fold-first path for flights, ride shares, tiny trunks, and true portability pressure.',
    bestFor: 'Best for flights and portability.',
    tradeoff: 'Minimal features.',
    emotionalDescriptor: 'Smaller, quicker, and built for the moments between places.',
    signatureMoment: 'Travel gear should lower the drama, not become a new version of it.',
    compareWith: 'compact-lightweight-strollers',
  },
  {
    slug: 'convertible-strollers',
    title: 'Convertible',
    shortTitle: 'Convertible',
    href: STROLLER_SYSTEM_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Illustration representing convertible strollers.',
    group: 'secondary',
    lifestyleDescriptor: 'The planning-ahead lane for single-to-double systems and future family flexibility.',
    bestFor: 'Best for planning for multiple children over time.',
    tradeoff: 'Heavier and more complex setup.',
    emotionalDescriptor: 'Flexible, thoughtful, and best when future planning is real enough to matter now.',
    signatureMoment: 'Planning for your life matters more than planning for the stroller.',
    compareWith: 'double-strollers',
  },
  {
    slug: 'double-strollers',
    title: 'Double',
    shortTitle: 'Double',
    href: STROLLER_SYSTEM_PATHS.double,
    icon: 'double',
    imageSrc: '/assets/strollers/inditwin.png',
    imageAlt: 'Illustration representing double strollers.',
    group: 'secondary',
    lifestyleDescriptor: 'The immediate two-rider path for twins, close age gaps, and everyday sibling logistics.',
    bestFor: 'Best for two children at once.',
    tradeoff: 'Larger footprint and harder maneuvering.',
    emotionalDescriptor: 'Honest, practical, and built for families who need two seats now, not someday.',
    signatureMoment: 'Two-seat capacity is useful only when two seats are solving a real current problem.',
    compareWith: 'convertible-strollers',
  },
  {
    slug: 'jogging-all-terrain-strollers',
    title: 'Jogging',
    shortTitle: 'Jogging',
    href: STROLLER_SYSTEM_PATHS.jogging,
    icon: 'terrain',
    imageSrc: '/assets/strollers/alterrian.png',
    imageAlt: 'Illustration representing jogging strollers.',
    group: 'secondary',
    lifestyleDescriptor: 'The performance lane for running, rougher terrain, and routes that punish small wheels.',
    bestFor: 'Best for running and uneven terrain.',
    tradeoff: 'Bulkier and less compact for daily errands.',
    emotionalDescriptor: 'Confident, capable, and best when the route itself is the problem.',
    signatureMoment: 'If the ground is doing the arguing, bigger wheels may be the calmer answer.',
    compareWith: 'full-size-modular-strollers',
  },
] as const;

const STROLLER_SYSTEM_CATEGORY_MAP = Object.fromEntries(
  STROLLER_SYSTEM_CATEGORIES.map((category) => [category.slug, category]),
) as Record<StrollerSystemGuideSlug, StrollerSystemCategory>;

function toHubCard({
  title,
  description,
  bestFor,
  href,
  icon,
  imageSrc,
  imageAlt,
}: {
  title: string;
  description: string;
  bestFor: string;
  href: string;
  icon: GuideHubIconKey;
  imageSrc: string;
  imageAlt: string;
}): GuideHubLink {
  return {
    title,
    description,
    bestFor,
    href,
    icon,
    imageSrc,
    imageAlt,
  };
}

export function isStrollerSystemGuideSlug(value: string): value is StrollerSystemGuideSlug {
  return STROLLER_SYSTEM_GUIDE_SLUGS.includes(value as StrollerSystemGuideSlug);
}

export function getStrollerSystemCategory(slug: string) {
  if (!isStrollerSystemGuideSlug(slug)) {
    return null;
  }

  return STROLLER_SYSTEM_CATEGORY_MAP[slug];
}

export function getStrollerHubStartingPointCards(): GuideHubLink[] {
  return [
    toHubCard({
      title: 'Everyday primary stroller',
      description: STROLLER_SYSTEM_CATEGORY_MAP['full-size-modular-strollers'].emotionalDescriptor,
      bestFor: STROLLER_SYSTEM_CATEGORY_MAP['full-size-modular-strollers'].bestFor,
      href: STROLLER_SYSTEM_CATEGORY_MAP['full-size-modular-strollers'].href,
      icon: STROLLER_SYSTEM_CATEGORY_MAP['full-size-modular-strollers'].icon,
      imageSrc: STROLLER_SYSTEM_CATEGORY_MAP['full-size-modular-strollers'].imageSrc,
      imageAlt: STROLLER_SYSTEM_CATEGORY_MAP['full-size-modular-strollers'].imageAlt,
    }),
    toHubCard({
      title: 'Easier to carry and store',
      description: STROLLER_SYSTEM_CATEGORY_MAP['compact-lightweight-strollers'].emotionalDescriptor,
      bestFor: STROLLER_SYSTEM_CATEGORY_MAP['compact-lightweight-strollers'].bestFor,
      href: STROLLER_SYSTEM_CATEGORY_MAP['compact-lightweight-strollers'].href,
      icon: STROLLER_SYSTEM_CATEGORY_MAP['compact-lightweight-strollers'].icon,
      imageSrc: STROLLER_SYSTEM_CATEGORY_MAP['compact-lightweight-strollers'].imageSrc,
      imageAlt: STROLLER_SYSTEM_CATEGORY_MAP['compact-lightweight-strollers'].imageAlt,
    }),
    toHubCard({
      title: 'Flights and smallest fold',
      description: STROLLER_SYSTEM_CATEGORY_MAP['travel-strollers'].emotionalDescriptor,
      bestFor: STROLLER_SYSTEM_CATEGORY_MAP['travel-strollers'].bestFor,
      href: STROLLER_SYSTEM_CATEGORY_MAP['travel-strollers'].href,
      icon: STROLLER_SYSTEM_CATEGORY_MAP['travel-strollers'].icon,
      imageSrc: STROLLER_SYSTEM_CATEGORY_MAP['travel-strollers'].imageSrc,
      imageAlt: STROLLER_SYSTEM_CATEGORY_MAP['travel-strollers'].imageAlt,
    }),
    toHubCard({
      title: 'Planning for more than one child',
      description: STROLLER_SYSTEM_CATEGORY_MAP['convertible-strollers'].emotionalDescriptor,
      bestFor: STROLLER_SYSTEM_CATEGORY_MAP['convertible-strollers'].bestFor,
      href: STROLLER_SYSTEM_CATEGORY_MAP['convertible-strollers'].href,
      icon: STROLLER_SYSTEM_CATEGORY_MAP['convertible-strollers'].icon,
      imageSrc: STROLLER_SYSTEM_CATEGORY_MAP['convertible-strollers'].imageSrc,
      imageAlt: STROLLER_SYSTEM_CATEGORY_MAP['convertible-strollers'].imageAlt,
    }),
  ];
}

export function getStrollerHubCategoryGridCards(): GuideHubLink[] {
  return STROLLER_SYSTEM_CATEGORIES.map((category) =>
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

export function getStrollerContextStripData(slug: string) {
  const currentCategory = getStrollerSystemCategory(slug);
  if (!currentCategory) {
    return null;
  }

  const compareCategory = STROLLER_SYSTEM_CATEGORY_MAP[currentCategory.compareWith];

  return {
    breadcrumb: ['Strollers', 'Choose Your Fit', currentCategory.title],
    currentLabel: currentCategory.title,
    currentHref: currentCategory.href,
    compareLabel: compareCategory.title,
    compareHref: compareCategory.href,
    hubHref: STROLLER_SYSTEM_PATHS.hub,
  };
}

export function getStrollerComparisonBandGroups(currentSlug: string) {
  const currentCategory = getStrollerSystemCategory(currentSlug);

  return {
    core: STROLLER_SYSTEM_CATEGORIES.filter((category) => category.group === 'core').map(
      (category): StrollerComparisonBandItem => ({
        slug: category.slug,
        title: category.title,
        shortTitle: category.shortTitle,
        href: category.href,
        icon: category.icon,
        bestFor: category.bestFor,
        tradeoff: category.tradeoff,
        isActive: category.slug === currentCategory?.slug,
      }),
    ),
    secondary: STROLLER_SYSTEM_CATEGORIES.filter((category) => category.group === 'secondary').map(
      (category): StrollerComparisonBandItem => ({
        slug: category.slug,
        title: category.title,
        shortTitle: category.shortTitle,
        href: category.href,
        icon: category.icon,
        bestFor: category.bestFor,
        tradeoff: category.tradeoff,
        isActive: category.slug === currentCategory?.slug,
      }),
    ),
  };
}

export function getStrollerCategorySignatureMoment(slug: string) {
  return getStrollerSystemCategory(slug)?.signatureMoment ?? null;
}

