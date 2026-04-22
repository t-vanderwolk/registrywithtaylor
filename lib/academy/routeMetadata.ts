import type { Metadata } from 'next';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

type BuildAcademyPageMetadataInput = {
  defaultTitle: string;
  description: string;
  path: `/${string}` | '/';
  imagePath: string;
  imageAlt: string;
  keywords?: string[];
  category?: string;
  type?: 'website' | 'article';
};

export function resolveAcademyMetadataImagePath(
  preferredPath: string | null | undefined,
  fallbackPath: string,
) {
  const normalizedPreferredPath = preferredPath?.trim();

  if (!normalizedPreferredPath) {
    return fallbackPath;
  }

  return normalizedPreferredPath.startsWith('/') || isRemoteImageUrl(normalizedPreferredPath)
    ? normalizedPreferredPath
    : fallbackPath;
}

export function buildAcademyPageMetadata({
  defaultTitle,
  description,
  path,
  imagePath,
  imageAlt,
  keywords = [],
  category = 'TMBC Academy',
  type = 'article',
}: BuildAcademyPageMetadataInput): Metadata {
  return buildMarketingMetadata({
    title: defaultTitle,
    description,
    path,
    imagePath: resolveAcademyMetadataImagePath(imagePath, imagePath),
    imageAlt,
    keywords: keywords.filter(Boolean),
    category,
    type,
  });
}
