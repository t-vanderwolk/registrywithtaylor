import type { AcademyBreadcrumbItem } from '@/lib/academy/content';
import { SITE_LOGO_URL, SITE_NAME, SITE_URL } from '@/lib/marketing/metadata';

type AcademyStructuredDataListItem = {
  href: string;
  title: string;
  description?: string | null;
};

type AcademyBreadcrumbStructuredDataInput = {
  breadcrumbs: AcademyBreadcrumbItem[];
  currentPath: string;
};

type AcademyCollectionStructuredDataInput = {
  title: string;
  description: string;
  path: string;
  breadcrumbs: AcademyBreadcrumbItem[];
  items: AcademyStructuredDataListItem[];
  keywords?: string[];
};

type AcademyLearningResourceStructuredDataInput = {
  title: string;
  description: string;
  path: string;
  breadcrumbs: AcademyBreadcrumbItem[];
  keywords?: string[];
  teaches?: string[];
  hasPart?: AcademyStructuredDataListItem[];
  learningResourceType?: string;
};

function toAbsoluteUrl(path: string) {
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path}`;
}

function normalizeKeyword(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildAcademyKeywordList({
  title,
  path,
  keywords = [],
}: {
  title: string;
  path: string;
  keywords?: string[];
}) {
  const scopedKeywords = [
    'TMBC Baby Academy',
    'Taylor-Made Baby Co. Academy',
    'guided baby planning',
    title,
    path.startsWith('/academy/registry') ? 'baby registry guide' : '',
    path.startsWith('/academy/nursery') ? 'nursery planning guide' : '',
    path.startsWith('/academy/gear') ? 'baby gear guide' : '',
    path.startsWith('/academy/postpartum') ? 'postpartum planning guide' : '',
    ...keywords,
  ];

  return Array.from(
    new Set(scopedKeywords.map((keyword) => normalizeKeyword(keyword)).filter(Boolean)),
  ).slice(0, 16);
}

function buildOrganizationStructuredData() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO_URL,
      width: 1024,
      height: 1024,
    },
  };
}

export function buildAcademyBreadcrumbStructuredData({
  breadcrumbs,
  currentPath,
}: AcademyBreadcrumbStructuredDataInput) {
  const itemListElement = breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: toAbsoluteUrl(item.href ?? currentPath),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function buildAcademyCollectionStructuredData({
  title,
  description,
  path,
  breadcrumbs,
  items,
  keywords = [],
}: AcademyCollectionStructuredDataInput) {
  const resolvedKeywords = buildAcademyKeywordList({ title, path, keywords });

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: toAbsoluteUrl(path),
    inLanguage: 'en-US',
    keywords: resolvedKeywords.join(', '),
    breadcrumb: buildAcademyBreadcrumbStructuredData({
      breadcrumbs,
      currentPath: path,
    }),
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: 'TMBC Baby Academy',
      url: `${SITE_URL}/academy`,
    },
    publisher: buildOrganizationStructuredData(),
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: toAbsoluteUrl(item.href),
        name: item.title,
        description: item.description ?? undefined,
      })),
    },
  };
}

export function buildAcademyLearningResourceStructuredData({
  title,
  description,
  path,
  breadcrumbs,
  keywords = [],
  teaches = [],
  hasPart = [],
  learningResourceType = 'Guide',
}: AcademyLearningResourceStructuredDataInput) {
  const resolvedKeywords = buildAcademyKeywordList({
    title,
    path,
    keywords: [...keywords, ...teaches],
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: title,
    description,
    url: toAbsoluteUrl(path),
    inLanguage: 'en-US',
    learningResourceType,
    educationalUse: 'Guided baby planning',
    educationalLevel: 'Beginner',
    audience: {
      '@type': 'Audience',
      audienceType: 'Expecting parents and growing families',
    },
    teaches: teaches.slice(0, 10),
    keywords: resolvedKeywords.join(', '),
    breadcrumb: buildAcademyBreadcrumbStructuredData({
      breadcrumbs,
      currentPath: path,
    }),
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: 'TMBC Baby Academy',
      url: `${SITE_URL}/academy`,
    },
    provider: buildOrganizationStructuredData(),
    publisher: buildOrganizationStructuredData(),
    hasPart:
      hasPart.length > 0
        ? hasPart.map((item) => ({
            '@type': 'WebPage',
            name: item.title,
            url: toAbsoluteUrl(item.href),
            description: item.description ?? undefined,
          }))
        : undefined,
  };
}
