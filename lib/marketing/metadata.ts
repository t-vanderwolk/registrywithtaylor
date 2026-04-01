import type { Metadata } from 'next';

export const SITE_NAME = 'Taylor-Made Baby Co.';
export const SITE_URL = 'https://www.taylormadebabyco.com';
export const SITE_LOGO_PATH = '/assets/logos/tmbcblocks2.png';
export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`;
export const SITE_FAVICON_PATH = '/favicon.ico';
export const SITE_FAVICON_PNG_PATH = '/favicon.png';
export const SITE_APPLE_ICON_PATH = '/apple-touch-icon.png';
export const SITE_ICON_192_PATH = '/icon-192.png';
export const SITE_ICON_512_PATH = '/icon-512.png';
export const DEFAULT_SITE_TITLE = 'Taylor-Made Baby Co. | Baby Gear & Registry Guidance';
export const DEFAULT_SITE_DESCRIPTION =
  'Personalized help with registries, strollers, car seats, nursery planning, and home prep. Expert guidance on what to buy, what to skip, and what can wait.';
export const DEFAULT_OG_IMAGE_PATH = '/og-home.jpg';
export const DEFAULT_OG_IMAGE_ALT = 'Taylor-Made Baby Co. - Baby gear and registry guidance.';

type BuildMarketingMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | '/';
  imagePath: string;
  imageAlt: string;
  keywords?: string[];
  category?: string;
  type?: 'website' | 'article';
};

const DEFAULT_SITE_KEYWORDS = [
  'Taylor-Made Baby Co.',
  'baby gear guidance',
  'baby registry guidance',
  'nursery planning',
  'parenthood planning',
] as const;

function normalizeKeyword(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildTitleKeywords(title: string) {
  const segments = title
    .split(/[|:•·]/)
    .map((segment) => normalizeKeyword(segment))
    .filter((segment) => segment.length >= 3 && segment.length <= 72);

  return [normalizeKeyword(title), ...segments];
}

function buildScopedKeywords(path: BuildMarketingMetadataInput['path']) {
  const scopedKeywords: string[] = [];

  if (path.startsWith('/academy')) {
    scopedKeywords.push(
      'TMBC Baby Academy',
      'baby academy',
      'guided baby planning',
      'structured baby guidance',
    );
  }

  if (path.startsWith('/academy/registry')) {
    scopedKeywords.push('baby registry guide', 'registry planning help', 'registry strategy');
  }

  if (path.startsWith('/academy/nursery')) {
    scopedKeywords.push('nursery guide', 'nursery planning guide', 'nursery setup');
  }

  if (path.startsWith('/academy/gear')) {
    scopedKeywords.push('baby gear guide', 'stroller guide', 'car seat guidance');
  }

  if (path.startsWith('/academy/postpartum')) {
    scopedKeywords.push('postpartum guide', 'postpartum planning', 'new parent support');
  }

  if (path.startsWith('/blog')) {
    scopedKeywords.push('baby gear journal', 'baby gear article', 'registry advice');
  }

  if (path.startsWith('/guides')) {
    scopedKeywords.push('baby gear guide', 'product guidance', 'registry help');
  }

  return scopedKeywords;
}

function buildMetadataKeywords({
  title,
  path,
  keywords = [],
}: Pick<BuildMarketingMetadataInput, 'title' | 'path' | 'keywords'>) {
  return Array.from(
    new Set(
      [...DEFAULT_SITE_KEYWORDS, ...buildScopedKeywords(path), ...buildTitleKeywords(title), ...keywords]
        .map((keyword) => normalizeKeyword(keyword))
        .filter(Boolean),
    ),
  ).slice(0, 18);
}

export function buildMarketingMetadata({
  title,
  description,
  path,
  imagePath,
  imageAlt,
  keywords,
  category,
  type = 'website',
}: BuildMarketingMetadataInput): Metadata {
  const canonicalUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const imageUrl = /^https?:\/\//i.test(imagePath) ? imagePath : `${SITE_URL}${imagePath}`;
  const resolvedKeywords = buildMetadataKeywords({ title, path, keywords });

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: resolvedKeywords,
    category:
      category ??
      (path.startsWith('/academy')
        ? 'TMBC Academy'
        : path.startsWith('/blog')
          ? 'Journal'
          : 'Baby Planning'),
    authors: [{ name: 'Taylor Vanderwolk', url: SITE_URL }],
    creator: 'Taylor Vanderwolk',
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type,
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
