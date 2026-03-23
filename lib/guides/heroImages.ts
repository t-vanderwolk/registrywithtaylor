import { getGuideParentSlug, resolveGuideSlugFromRouteSegment } from '@/lib/guides/routing';

type GuideHeroInput = {
  slug?: string | null;
  title?: string | null;
  category?: string | null;
  topicCluster?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

type GuideHeroImage = {
  src: string;
  alt: string;
};

const HERO_IMAGE_BY_KEY = {
  hero01: '/assets/hero/hero-01.jpg',
  hero02: '/assets/hero/hero-02.jpg',
  hero03: '/assets/hero/hero-03.jpg',
  hero04: '/assets/hero/hero-04.jpg',
  hero05: '/assets/hero/hero-05.jpg',
  hero06: '/assets/hero/hero-06.jpg',
  editorial: '/assets/hero/hero-baby-editorial.jpg',
  editorialV2: '/assets/hero/hero-baby-editorial-v2.jpg',
} as const;

const DEFAULT_POOL = [
  HERO_IMAGE_BY_KEY.editorialV2,
  HERO_IMAGE_BY_KEY.hero03,
  HERO_IMAGE_BY_KEY.hero04,
  HERO_IMAGE_BY_KEY.editorial,
  HERO_IMAGE_BY_KEY.hero05,
  HERO_IMAGE_BY_KEY.hero02,
] as const;

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pickFromPool(seed: string, pool: readonly string[]) {
  return pool[hashString(seed) % pool.length] ?? pool[0] ?? HERO_IMAGE_BY_KEY.editorialV2;
}

function getHeroPool({
  slug,
  parentSlug,
  category,
  title,
}: {
  slug: string;
  parentSlug: string | null;
  category: string;
  title: string;
}) {
  const context = `${slug} ${parentSlug ?? ''} ${category} ${title}`.toLowerCase();

  if (slug === 'guides-hub' || context.includes('guide hub')) {
    return [
      HERO_IMAGE_BY_KEY.editorialV2,
      HERO_IMAGE_BY_KEY.editorial,
      HERO_IMAGE_BY_KEY.hero03,
    ] as const;
  }

  if (parentSlug === 'minimalist-baby-registry' || context.includes('registry')) {
    return [
      HERO_IMAGE_BY_KEY.hero01,
      HERO_IMAGE_BY_KEY.hero02,
      HERO_IMAGE_BY_KEY.editorial,
    ] as const;
  }

  if (parentSlug === 'nursery-setup-guide' || context.includes('nursery')) {
    return [
      HERO_IMAGE_BY_KEY.hero02,
      HERO_IMAGE_BY_KEY.hero03,
      HERO_IMAGE_BY_KEY.editorialV2,
    ] as const;
  }

  if (parentSlug === 'best-strollers' || context.includes('stroller')) {
    return [
      HERO_IMAGE_BY_KEY.hero04,
      HERO_IMAGE_BY_KEY.hero05,
      HERO_IMAGE_BY_KEY.editorialV2,
    ] as const;
  }

  if (parentSlug === 'best-infant-car-seats' || context.includes('car seat')) {
    return [
      HERO_IMAGE_BY_KEY.hero05,
      HERO_IMAGE_BY_KEY.hero06,
      HERO_IMAGE_BY_KEY.editorial,
    ] as const;
  }

  if (context.includes('travel')) {
    return [
      HERO_IMAGE_BY_KEY.hero06,
      HERO_IMAGE_BY_KEY.editorial,
      HERO_IMAGE_BY_KEY.editorialV2,
    ] as const;
  }

  if (context.includes('feeding') || context.includes('postpartum') || context.includes('essentials')) {
    return [
      HERO_IMAGE_BY_KEY.hero03,
      HERO_IMAGE_BY_KEY.editorialV2,
      HERO_IMAGE_BY_KEY.hero06,
    ] as const;
  }

  return DEFAULT_POOL;
}

export function getGuideHeroFallback({
  slug,
  title,
  category,
  topicCluster,
}: Omit<GuideHeroInput, 'imageSrc' | 'imageAlt'>): GuideHeroImage {
  const resolvedSlug = slug ? resolveGuideSlugFromRouteSegment(slug) : 'guide';
  const resolvedTitle = title?.trim() || 'TMBC guide';
  const resolvedCategory = category?.trim() || '';
  const parentSlug = slug ? getGuideParentSlug({ slug: resolvedSlug, topicCluster }) : null;
  const seed = `${resolvedSlug}:${resolvedTitle}:${resolvedCategory}:${topicCluster ?? ''}`;
  const pool = getHeroPool({
    slug: resolvedSlug,
    parentSlug,
    category: resolvedCategory,
    title: resolvedTitle,
  });

  return {
    src: pickFromPool(seed, pool),
    alt: `Editorial hero image for ${resolvedTitle}`,
  };
}

export function resolveGuideHeroImage({
  slug,
  title,
  category,
  topicCluster,
  imageSrc,
  imageAlt,
}: GuideHeroInput): GuideHeroImage {
  const fallbackImage = getGuideHeroFallback({
    slug,
    title,
    category,
    topicCluster,
  });
  const trimmedSrc = imageSrc?.trim();
  const trimmedAlt = imageAlt?.trim();

  return {
    src: trimmedSrc || fallbackImage.src,
    alt: trimmedAlt || fallbackImage.alt,
  };
}
