/**
 * /about page JSON-LD (schema.org). Reuses the SAME @id values as the homepage
 * graph (lib/marketing/homeStructuredData.ts) so search + AI engines consolidate
 * one Taylor Vanderwolk / Taylor-Made Baby Co. entity across pages instead of
 * creating duplicates.
 *
 * Phase 1 nodes (no new visible content required):
 *   • Person (#taylor)            — E-E-A-T author authority + entity disambiguation
 *   • AboutPage (/about)          — page type, links Person + Organization
 *   • BreadcrumbList              — Home > About Taylor Vanderwolk
 *   • Service (#service-registry-consult) — priced offering + OfferCatalog
 *
 * Phase 2 adds FAQPage, Review/AggregateRating, and HowTo alongside their
 * visible on-page sections (schema must match visible content).
 */
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from '@/lib/marketing/metadata';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#taylor`;
const SERVICE_ID = `${SITE_URL}/#service-registry-consult`;
const ABOUT_URL = `${SITE_URL}/about`;
const BREADCRUMB_ID = `${ABOUT_URL}#breadcrumb`;
const TAYLOR_IMAGE = `${SITE_URL}/assets/taylor.jpeg`;
const HERO_IMAGE = `${SITE_URL}/assets/hero/hero-05.jpg`;

export const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Taylor Vanderwolk',
      givenName: 'Taylor',
      familyName: 'Vanderwolk',
      jobTitle: 'Baby Registry Consultant',
      description:
        'Baby registry consultant and certified Tot Squad specialist with 7+ years of hands-on baby gear experience at Strolleria, Pottery Barn Kids, and the Target Baby Concierge program. Founder of Taylor-Made Baby Co., having helped 200+ expecting parents build confident baby registries.',
      disambiguatingDescription:
        'Taylor-Made Baby Co. is an independent baby registry consulting service founded by Taylor Vanderwolk. It is not affiliated with TaylorMade Golf, TaylorMade Audio, or any other brand using the TaylorMade name.',
      url: ABOUT_URL,
      mainEntityOfPage: ABOUT_URL,
      image: {
        '@type': 'ImageObject',
        url: TAYLOR_IMAGE,
        caption: 'Taylor Vanderwolk, Baby Registry Consultant',
      },
      worksFor: { '@id': ORG_ID },
      alumniOf: [
        { '@type': 'Organization', name: 'Strolleria', url: 'https://www.strolleria.com', description: 'Leading independent baby specialty retailer in the US' },
        { '@type': 'Organization', name: 'Pottery Barn Kids', description: 'Nursery Advisor role, furniture sizing and safe sleep' },
        { '@type': 'Organization', name: 'Target Baby Concierge (powered by Tot Squad)', description: 'Baby gear concierge program across 200+ Target stores' },
        { '@type': 'Organization', name: 'Tot Squad', url: 'https://www.totsquad.com', description: 'Certification body for the Target Baby Concierge program' },
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'certification',
          name: 'Tot Squad Certified Baby Gear Specialist',
          recognizedBy: { '@type': 'Organization', name: 'Tot Squad', url: 'https://www.totsquad.com' },
        },
      ],
      knowsAbout: [
        'Baby registry consulting',
        'Stroller selection',
        'Car seat safety',
        'Nursery planning',
        'Baby gear comparison',
        'Newborn preparation',
        'Registry strategy',
        'Baby shower planning',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Phoenix',
        addressRegion: 'AZ',
        addressCountry: 'US',
      },
      sameAs: ['https://www.instagram.com/taylorbabyconcierge'],
    },
    {
      '@type': 'AboutPage',
      '@id': ABOUT_URL,
      url: ABOUT_URL,
      name: 'About Taylor Vanderwolk, Baby Registry Consultant',
      description:
        'Meet Taylor Vanderwolk, a certified baby registry consultant and baby gear expert with 7+ years of experience at Strolleria, Pottery Barn Kids, and the Target Baby Concierge program. Independent, unsponsored guidance for expecting parents.',
      isPartOf: { '@type': 'WebSite', url: SITE_URL, name: SITE_NAME },
      primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE },
      mainEntity: { '@id': PERSON_ID },
      about: { '@id': ORG_ID },
      breadcrumb: { '@id': BREADCRUMB_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': BREADCRUMB_ID,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'About Taylor Vanderwolk', item: ABOUT_URL },
      ],
    },
    {
      '@type': 'Service',
      '@id': SERVICE_ID,
      name: 'Baby Registry Consultation',
      serviceType: 'Baby Registry Consulting',
      description:
        'One hour virtual baby registry consultation for expecting parents covering stroller selection, car seat safety, nursery planning, feeding gear, and registry strategy. Delivered by Taylor Vanderwolk, certified Tot Squad specialist with 7+ years experience and 200+ families helped.',
      provider: { '@id': PERSON_ID },
      offers: {
        '@type': 'Offer',
        name: 'One Hour Virtual Baby Registry Consultation',
        price: '75.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/book`,
        description: 'One 60 minute video call plus written follow up notes.',
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
                'One hour virtual session covering strollers, car seats, nursery, feeding, and registry strategy. Includes written follow up.',
            },
            price: '75.00',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'DigitalDocument',
              name: 'Free Baby Prep Starter Guide',
              description:
                'Free downloadable guide covering registry strategy, gear priorities, stroller checklist, car seat types, safe sleep essentials, and a trimester by trimester preparation timeline.',
              url: ABOUT_URL,
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
      url: `${SITE_URL}/book`,
    },
  ],
};
