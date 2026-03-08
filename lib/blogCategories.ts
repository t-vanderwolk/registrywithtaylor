export const BLOG_CATEGORIES = [
  'Registry Strategy',
  'Gear & Safety',
  'Nursery & Home',
  'Transitions & Family',
  'Planning & Events',
] as const;

export const BLOG_GUIDES_TITLE = 'Baby Prep Guides';
export const BLOG_NAV_LABEL = 'Guides';

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const DEFAULT_BLOG_CATEGORY: BlogCategory = BLOG_CATEGORIES[0];

export function isBlogCategory(value: string): value is BlogCategory {
  return BLOG_CATEGORIES.includes(value as BlogCategory);
}

export function normalizeBlogCategory(value: unknown): BlogCategory {
  if (typeof value !== 'string') {
    return DEFAULT_BLOG_CATEGORY;
  }

  const normalized = value.trim();
  return isBlogCategory(normalized) ? normalized : DEFAULT_BLOG_CATEGORY;
}

export function getBlogCategoryLabel(value: BlogCategory | string) {
  if (value === 'Planning & Events') {
    return 'Planning & Preparation';
  }

  return value;
}
