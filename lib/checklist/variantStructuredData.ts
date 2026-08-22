import { SITE_NAME, SITE_URL } from '@/lib/marketing/metadata';
import { VARIANTS, type VariantSlug } from './variants';

/**
 * JSON-LD for a checklist variant page: WebPage (self) + BreadcrumbList
 * (Home > Resources > <Variant> Checklist) + FAQPage (the visible on-page FAQ).
 * One @graph so it emits as a single <script> tag.
 */
export function buildVariantStructuredData(slug: VariantSlug) {
  const meta = VARIANTS[slug];
  const url = `${SITE_URL}/resources/baby-checklist/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: meta.title,
        url,
        description: meta.description,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Resources',
            item: `${SITE_URL}/resources`,
          },
          { '@type': 'ListItem', position: 3, name: meta.breadcrumbLabel, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: meta.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}
