import type { Metadata } from 'next';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

type AcademySeoGuideRecord = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  excerpt?: string | null;
  targetKeyword?: string | null;
  secondaryKeywords?: string[] | null;
  ogImageUrl?: string | null;
  heroImageUrl?: string | null;
  ogImageAlt?: string | null;
  heroImageAlt?: string | null;
};

type BuildAcademyPageMetadataInput = {
  defaultTitle: string;
  description: string;
  path: `/${string}` | '/';
  imagePath: string;
  imageAlt: string;
  keywords?: string[];
  category?: string;
  type?: 'website' | 'article';
  guide?: AcademySeoGuideRecord | null;
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
  guide,
}: BuildAcademyPageMetadataInput): Metadata {
  const preferredImagePath = guide?.ogImageUrl?.trim() || guide?.heroImageUrl?.trim() || null;
  const preferredImageAlt = guide?.ogImageAlt?.trim() || guide?.heroImageAlt?.trim() || null;

  return buildMarketingMetadata({
    title: guide?.seoTitle?.trim() || defaultTitle,
    description: guide?.seoDescription?.trim() || guide?.excerpt?.trim() || description,
    path,
    imagePath: resolveAcademyMetadataImagePath(preferredImagePath, imagePath),
    imageAlt: preferredImageAlt || imageAlt,
    keywords: [
      ...keywords,
      guide?.targetKeyword?.trim() || '',
      ...(guide?.secondaryKeywords ?? []),
    ].filter(Boolean),
    category,
    type,
  });
}
