/**
 * Homepage JSON-LD structured data (schema.org) for search + AI answer engines.
 *
 * Four connected nodes in one @graph:
 *   • Organization (#organization) — entity recognition / Knowledge Panel
 *   • Person (#taylor)             — E-E-A-T author authority
 *   • Service (#service-registry-consult) — priced offering for rich results / AI quotes
 *   • FAQPage                      — People Also Ask + AI Overview citations
 *
 * The FAQ questions come from HOME_FAQ so the schema always matches the visible
 * FAQ section on the page.
 */
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from '@/lib/marketing/metadata';
import { HOME_FAQ } from '@/lib/marketing/homeFaq';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#taylor`;
const SERVICE_ID = `${SITE_URL}/#service-registry-consult`;
const TAYLOR_IMAGE = `${SITE_URL}/assets/taylor.jpeg`;

export const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      alternateName: 'Taylor Made Baby Co',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO_URL,
        width: 1024,
        height: 1024,
      },
      description:
        'Taylor-Made Baby Co. is an expert baby registry consulting service for expecting parents, offering personalized stroller, car seat, nursery, and registry guidance from a verified Target Baby Concierge specialist.',
      foundingDate: '2022',
      founder: { '@id': PERSON_ID },
      areaServed: { '@type': 'Country', name: 'United States' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Phoenix',
        addressRegion: 'AZ',
        addressCountry: 'US',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: 'English',
        areaServed: 'US',
      },
      sameAs: ['https://www.instagram.com/taylorbabyconcierge'],
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Taylor Vanderwolk',
      givenName: 'Taylor',
      familyName: 'Vanderwolk',
      jobTitle: 'Baby Registry Consultant',
      description:
        'Baby registry consultant and certified Tot Squad specialist with 7+ years of hands-on baby gear experience at Strolleria, Pottery Barn Kids, and the Target Baby Concierge program. Founder of Taylor-Made Baby Co.',
      url: SITE_URL,
      image: TAYLOR_IMAGE,
      worksFor: { '@id': ORG_ID },
      alumniOf: [
        { '@type': 'Organization', name: 'Strolleria', url: 'https://www.strolleria.com' },
        { '@type': 'Organization', name: 'Pottery Barn Kids' },
        { '@type': 'Organization', name: 'Target Baby Concierge (powered by Tot Squad)' },
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'certification',
          name: 'Tot Squad Certified Baby Gear Specialist',
          recognizedBy: {
            '@type': 'Organization',
            name: 'Tot Squad',
            url: 'https://www.totsquad.com',
          },
        },
      ],
      knowsAbout: [
        'Baby registry consulting',
        'Stroller selection and comparison',
        'Car seat safety and installation',
        'Nursery planning and setup',
        'Baby gear brand comparison',
        'Newborn preparation',
        'Baby feeding equipment',
        'Travel gear for families with infants',
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
      '@type': 'Service',
      '@id': SERVICE_ID,
      name: 'Baby Registry Consultation',
      serviceType: 'Baby Registry Consulting',
      description:
        'One hour virtual baby registry consultation for expecting parents covering stroller selection, car seat safety, nursery planning, feeding gear, and registry strategy. Delivered by certified Tot Squad specialist Taylor Vanderwolk.',
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
      },
      serviceMode: 'https://schema.org/OnlineEventAttendanceMode',
      areaServed: { '@type': 'Country', name: 'United States' },
      audience: {
        '@type': 'Audience',
        audienceType: 'Expecting parents and new families',
      },
      termsOfService: 'Full refund if cancelled 24 hours before the session.',
      url: `${SITE_URL}/book`,
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: HOME_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};
