export const BLOG_PLACEHOLDER_IMAGE = '/images/blog/placeholder.svg';

const absoluteUrlPattern = /^https?:\/\//i;

const categoryFallbackImages: Record<string, string> = {
  'Registry Strategy': '/assets/editorial/registry.jpg',
  'Gear & Safety': '/assets/editorial/gear.jpg',
  'Nursery & Home': '/assets/editorial/nursery.jpg',
  'Transitions & Family': '/assets/editorial/growing-with-confidence.jpg',
  'Planning & Events': '/assets/editorial/registry.jpg',
};

export const getBlogCategoryFallbackImage = (category?: string | null) => {
  if (!category) {
    return BLOG_PLACEHOLDER_IMAGE;
  }

  return categoryFallbackImages[category] ?? BLOG_PLACEHOLDER_IMAGE;
};

export const resolveBlogCoverImage = (coverImage: string | null | undefined, category?: string | null) => {
  const normalizedCoverImage = coverImage?.trim();

  if (!normalizedCoverImage) {
    return getBlogCategoryFallbackImage(category);
  }

  if (normalizedCoverImage.startsWith('/') || absoluteUrlPattern.test(normalizedCoverImage)) {
    return normalizedCoverImage;
  }

  return getBlogCategoryFallbackImage(category);
};

export const isRemoteImageUrl = (value: string | null | undefined) => {
  const normalizedValue = value?.trim();

  return Boolean(normalizedValue && absoluteUrlPattern.test(normalizedValue));
};
