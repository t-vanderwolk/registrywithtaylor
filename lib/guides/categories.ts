export const GUIDE_CATEGORIES = [
  'Strollers',
  'Car Seats',
  'Registry Planning',
  'Nursery Planning',
  'Travel With Baby',
  'Baby Gear Guides',
] as const;

export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];

export const DEFAULT_GUIDE_CATEGORY: GuideCategory = GUIDE_CATEGORIES[0];

export function isGuideCategory(value: string): value is GuideCategory {
  return GUIDE_CATEGORIES.includes(value as GuideCategory);
}

export function normalizeGuideCategory(value: unknown, fallback: GuideCategory = DEFAULT_GUIDE_CATEGORY): GuideCategory {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim();
  return isGuideCategory(normalized) ? normalized : fallback;
}

