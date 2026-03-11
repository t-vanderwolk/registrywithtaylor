import { getGuidePillar, type GuidePillar } from '@/lib/marketing/siteContent';

export type GuideCardItem = {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
};

const CATEGORY_FALLBACK_SLUGS: Record<string, string> = {
  Strollers: 'best-strollers',
  'Car Seats': 'best-infant-car-seats',
  'Registry Planning': 'minimalist-baby-registry',
  'Nursery Planning': 'nursery-setup-guide',
  'Travel With Baby': 'travel-with-baby',
  'Baby Gear Guides': 'best-strollers',
};

const DEFAULT_GUIDE_IMAGE = '/assets/editorial/gear.jpg';
const DEFAULT_GUIDE_ALT = 'Editorial baby gear planning scene';

export function getGuideEyebrow(category?: string | null) {
  switch (category?.trim()) {
    case 'Registry Planning':
    case 'Nursery Planning':
      return 'Baby Preparation Guide';
    case 'Strollers':
    case 'Car Seats':
    case 'Travel With Baby':
    case 'Baby Gear Guides':
    default:
      return 'Baby Gear Guide';
  }
}

export function getGuideFallbackPillar({
  slug,
  category,
}: {
  slug?: string | null;
  category?: string | null;
}) {
  if (slug) {
    const directMatch = getGuidePillar(slug);
    if (directMatch) {
      return directMatch;
    }
  }

  const categoryFallbackSlug = category ? CATEGORY_FALLBACK_SLUGS[category] : null;
  if (!categoryFallbackSlug) {
    return null;
  }

  return getGuidePillar(categoryFallbackSlug);
}

export function toGuideCardItemFromPillar(pillar: GuidePillar): GuideCardItem {
  return {
    slug: pillar.slug,
    title: pillar.title,
    description: pillar.description,
    imageSrc: pillar.imageSrc,
    imageAlt: pillar.imageAlt,
    eyebrow: pillar.eyebrow,
  };
}

export function toGuideCardItemFromGuide(guide: {
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
}): GuideCardItem {
  const fallbackPillar = getGuideFallbackPillar({
    slug: guide.slug,
    category: guide.category,
  });

  return {
    slug: guide.slug,
    title: guide.title,
    description:
      guide.excerpt?.trim() ||
      fallbackPillar?.description ||
      'Evergreen baby gear guidance built to help expecting parents make clearer decisions.',
    imageSrc: guide.heroImageUrl?.trim() || fallbackPillar?.imageSrc || DEFAULT_GUIDE_IMAGE,
    imageAlt: guide.heroImageAlt?.trim() || fallbackPillar?.imageAlt || DEFAULT_GUIDE_ALT,
    eyebrow: fallbackPillar?.eyebrow || getGuideEyebrow(guide.category),
  };
}
