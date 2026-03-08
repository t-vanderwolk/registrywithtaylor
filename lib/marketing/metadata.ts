import type { Metadata } from 'next';

export const SITE_NAME = 'Taylor-Made Baby Co.';
export const SITE_URL = 'https://www.taylormadebabyco.com';
export const DEFAULT_SITE_TITLE = 'Taylor-Made Baby Co. | Baby Gear & Registry Guidance';
export const DEFAULT_SITE_DESCRIPTION =
  'Personalized help with registries, strollers, car seats, nursery planning, and home prep. Expert guidance on what to buy, what to skip, and what can wait.';
export const DEFAULT_OG_IMAGE_PATH = '/og-home.jpg';
export const DEFAULT_OG_IMAGE_ALT = 'Taylor-Made Baby Co. - Baby gear and registry guidance.';

type BuildMarketingMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | '/';
  imagePath: `/${string}`;
  imageAlt: string;
};

export function buildMarketingMetadata({
  title,
  description,
  path,
  imagePath,
  imageAlt,
}: BuildMarketingMetadataInput): Metadata {
  const canonicalUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const imageUrl = `${SITE_URL}${imagePath}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
