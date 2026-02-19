import type { Metadata } from 'next';

const SITE_NAME = 'Taylor-Made Baby Co.';
const SITE_URL = 'https://taylormadebabyplanning.com';

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
