export const BLOG_PLACEHOLDER_IMAGE = '/images/blog/placeholder.svg';

const absoluteUrlPattern = /^https?:\/\//i;

export const resolveBlogCoverImage = (coverImage: string | null | undefined) => {
  const normalizedCoverImage = coverImage?.trim();

  if (!normalizedCoverImage) {
    return BLOG_PLACEHOLDER_IMAGE;
  }

  if (normalizedCoverImage.startsWith('/') || absoluteUrlPattern.test(normalizedCoverImage)) {
    return normalizedCoverImage;
  }

  return BLOG_PLACEHOLDER_IMAGE;
};
