/**
 * /tools/stroller-quiz JSON-LD (schema.org). Reuses the SAME @id values as the homepage,
 * /about, and /services graphs so search + AI engines consolidate ONE Taylor Vanderwolk /
 * Taylor-Made Baby Co. entity across the site.
 *
 * Nodes:
 *   • SoftwareApplication (#tool) — identifies the quiz as a free interactive tool, with
 *     author Person, publisher Org, audience, and a feature list.
 *   • WebPage (/tools/stroller-quiz) — page type, links the tool + Org + breadcrumb.
 *   • BreadcrumbList — Home > Baby Gear Tools > Best Stroller Quiz.
 *   • FAQPage — the 8 quiz Q&As, for People Also Ask + AI Overviews.
 */
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from '@/lib/marketing/metadata';
import { QUIZ_FAQ } from '@/lib/marketing/strollerQuizContent';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#taylor`;
const TOOLS_URL = `${SITE_URL}/tools`;
const QUIZ_URL = `${SITE_URL}/tools/stroller-quiz`;
const TOOL_ID = `${QUIZ_URL}#tool`;
const BREADCRUMB_ID = `${QUIZ_URL}#breadcrumb`;

export const strollerQuizStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': TOOL_ID,
      name: 'Best Stroller Quiz, Taylor-Made Baby Co.',
      description:
        'Answer 8 questions to get a personalised stroller recommendation from certified baby gear expert Taylor Vanderwolk. Covers lifestyle, home, vehicle, budget, and family plans. Free, with no sign-up required.',
      url: QUIZ_URL,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      author: {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Taylor Vanderwolk',
        jobTitle: 'Baby Registry Consultant',
      },
      publisher: { '@id': ORG_ID },
      audience: { '@type': 'Audience', audienceType: 'Expecting parents choosing a stroller' },
      isAccessibleForFree: true,
      featureList: [
        'Personalised stroller recommendation',
        '8-question quiz format',
        'Vehicle compatibility consideration',
        'Budget range filtering',
        'Lifestyle and home type matching',
        'Link to expert baby registry consultation',
      ],
      logo: SITE_LOGO_URL,
    },
    {
      '@type': 'WebPage',
      '@id': QUIZ_URL,
      url: QUIZ_URL,
      name: 'Best Stroller Quiz for Expecting Parents, Find Your Perfect Match',
      description:
        'Answer 8 questions and get your personalised stroller recommendation from certified baby gear expert Taylor Vanderwolk. Free, instant results, then book a 1-hour consultation for $75.',
      isPartOf: { '@type': 'WebSite', url: SITE_URL, name: SITE_NAME },
      mainEntity: { '@id': TOOL_ID },
      breadcrumb: { '@id': BREADCRUMB_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': BREADCRUMB_ID,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Baby Gear Tools', item: TOOLS_URL },
        { '@type': 'ListItem', position: 3, name: 'Best Stroller Quiz', item: QUIZ_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${QUIZ_URL}#faq`,
      mainEntity: QUIZ_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ],
};
