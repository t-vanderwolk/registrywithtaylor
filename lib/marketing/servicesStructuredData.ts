/**
 * /services page JSON-LD (schema.org). Reuses the SAME @id values as the homepage
 * and /about graphs so search + AI engines consolidate ONE Taylor Vanderwolk /
 * Taylor-Made Baby Co. / Baby Registry Consultation entity across the site.
 *
 * Nodes:
 *   • Service (#service-registry-consult) — the priced offering (main entity),
 *     with Offer ($75), provider Person, areaServed US, and an OfferCatalog.
 *   • WebPage (/services)                 — page type, links Service + Org.
 *   • BreadcrumbList                      — Home > Baby Registry Consultation.
 *   • FAQPage / HowTo are added in servicesStructuredDataExtras (Phase 2) so the
 *     schema always ships alongside the matching visible sections.
 */
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from '@/lib/marketing/metadata';
import { SERVICES_STEPS, SERVICES_FAQ } from '@/lib/marketing/servicesContent';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#taylor`;
const SERVICE_ID = `${SITE_URL}/#service-registry-consult`;
const SERVICES_URL = `${SITE_URL}/services`;
const BREADCRUMB_ID = `${SERVICES_URL}#breadcrumb`;
const HERO_IMAGE = `${SITE_URL}/assets/hero/hero-03.jpg`;

export const servicesStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': SERVICE_ID,
      name: 'Baby Registry Consultation',
      serviceType: 'Baby Registry Consulting',
      description:
        'One hour virtual baby registry consultation for expecting parents covering stroller selection and compatibility, car seat safety, nursery planning, feeding gear, and registry strategy. Delivered by Taylor Vanderwolk, a certified Tot Squad specialist with 7+ years of hands-on baby gear experience and 200+ families helped. Independent and unsponsored, with written follow up notes.',
      provider: { '@id': PERSON_ID },
      brand: { '@id': ORG_ID },
      offers: {
        '@type': 'Offer',
        name: 'One Hour Virtual Baby Registry Consultation',
        price: '75.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/book`,
        description: 'One 60 minute video call plus a pre-session intake review and written follow up notes.',
        priceValidUntil: '2026-12-31',
        validFrom: '2026-01-01',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Taylor-Made Baby Co. Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Baby Registry Consultation',
              description:
                'One hour virtual session covering strollers, car seats, nursery, feeding, and registry strategy. Includes a pre-session intake review and written follow up notes.',
            },
            price: '75.00',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Registry Review Add-On',
              description:
                'Taylor reviews an existing registry, flags redundant items, identifies gaps, and refines choices. Included as part of the consultation session.',
            },
            price: '0',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Private Planning Package',
              description:
                'Extended multi-session support covering registry, nursery, newborn preparation, and ongoing planning. Custom scope and pricing.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'DigitalDocument',
              name: 'Free Stroller Decision Guide',
              description:
                'The stroller framework Taylor uses in every consultation: 7 questions to ask, the vehicle compatibility checklist, full-size vs lightweight vs travel system, and a side by side brand guide.',
              url: SERVICES_URL,
            },
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        ],
      },
      serviceMode: 'https://schema.org/OnlineEventAttendanceMode',
      areaServed: { '@type': 'Country', name: 'United States' },
      audience: { '@type': 'Audience', audienceType: 'Expecting parents and new families' },
      termsOfService: 'Full refund if cancelled 24 hours before the session.',
      logo: SITE_LOGO_URL,
      url: SERVICES_URL,
    },
    {
      '@type': 'WebPage',
      '@id': SERVICES_URL,
      url: SERVICES_URL,
      name: 'Baby Registry Consultation — Expert Help for Expecting Parents',
      description:
        'Book a 1-hour virtual baby registry consultation with certified Tot Squad specialist Taylor Vanderwolk for $75. Strollers, car seats, nursery, feeding gear, and registry strategy for expecting parents across the United States.',
      isPartOf: { '@type': 'WebSite', url: SITE_URL, name: SITE_NAME },
      primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE },
      about: { '@id': SERVICE_ID },
      breadcrumb: { '@id': BREADCRUMB_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': BREADCRUMB_ID,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Baby Registry Consultation', item: SERVICES_URL },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': `${SERVICES_URL}#howto`,
      name: 'How to Book a Baby Registry Consultation with Taylor-Made Baby Co.',
      description:
        'Book a 1-hour virtual baby registry consultation with certified specialist Taylor Vanderwolk in 4 simple steps.',
      totalTime: 'PT1H',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '75' },
      tool: [
        { '@type': 'HowToTool', name: 'Zoom or Google Meet (video call)' },
        { '@type': 'HowToTool', name: 'Taylor’s pre-session intake form' },
      ],
      step: SERVICES_STEPS.map((s, i) => ({
        '@type': 'HowToStep',
        position: String(i + 1),
        name: s.title,
        text: s.body,
        ...(i === 0 ? { url: `${SITE_URL}/book` } : {}),
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SERVICES_URL}#faq`,
      mainEntity: SERVICES_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ],
};
