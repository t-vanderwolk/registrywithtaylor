/**
 * JSON-LD for /tools/travel-system (the free Stroller & Car Seat Compatibility
 * Checker). Adds the schema the SEO/GEO strategy calls for: a referenceable
 * Organization (with founder), the Service it belongs to, a BreadcrumbList that
 * mirrors the visible breadcrumb, a HowTo for the 3-step tool flow, and a
 * FAQPage built from TRAVEL_SYSTEM_FAQS.
 *
 * The FAQ answers here are the SINGLE SOURCE for both the schema `text` and the
 * visible on-page FAQ, so they stay word-for-word identical (a Google structured
 * data requirement — mismatched schema vs. visible text gets rich results
 * suppressed).
 */
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from '@/lib/marketing/metadata';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#taylor`;
const TOOL_URL = `${SITE_URL}/tools/travel-system`;
const RESOURCES_URL = `${SITE_URL}/resources`;

/** Visible FAQ text === schema text. Answers are the full, standalone versions. */
export const TRAVEL_SYSTEM_FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'How do I know if my car seat is compatible with my stroller?',
    answer:
      'Compatibility depends on whether your stroller accepts a direct click-in from the same brand or needs a specific adapter. Enter your stroller and car seat models into our free checker above for an instant, accurate match — no guesswork, no returning the wrong adapter.',
  },
  {
    question: 'What is a travel system?',
    answer:
      'A travel system is a stroller and infant car seat designed (or adapted) to work together, letting the car seat click directly onto the stroller frame so you can move the baby from car to stroller without waking them. Some are sold as matched bundles; others are mixed brands connected with an adapter.',
  },
  {
    question: 'Do I need a separate adapter for my stroller and car seat?',
    answer:
      "If your stroller and car seat are different brands, you'll usually need a third-party adapter. Same-brand combinations typically click together directly with no extra hardware. Our tool tells you exactly which situation applies to your setup before you buy anything.",
  },
  {
    question: 'Is this compatibility checker really free?',
    answer:
      'Yes. The Travel System Compatibility Checker is completely free, requires no account or email, and takes under two minutes to give you a clear, specific answer for your exact stroller and car seat models.',
  },
  {
    question: "What if my exact stroller or car seat isn't listed?",
    answer:
      "If your combination isn't in our database yet, message Taylor through the contact page and we'll research the exact pairing for you, usually within one business day — or book a 1-hour Registry Consult for full, personalized guidance.",
  },
  {
    question: 'Are all car seat adapters safe to use?',
    answer:
      "Only use adapters tested and rated for your specific stroller and car seat models by the manufacturer. Avoid generic ‘universal’ adapters unless explicitly approved by both brands, since an unsafe or loose fit can affect the stroller's stability and the car seat's secure lock-in.",
  },
  {
    question: 'Should I buy a travel system bundle or mix brands?',
    answer:
      'Bundled travel systems guarantee compatibility out of the box, while mixing brands can save money if you already own a car seat. Use the checker first to confirm any mixed combination is genuinely safe and supported before buying an adapter.',
  },
  {
    question: 'Can I get personalized help choosing a stroller and car seat?',
    answer:
      'Yes — book a focused 1-hour Registry Consult ($75) with certified baby gear consultant Taylor Vanderwolk for tailored stroller, car seat, and full registry guidance that goes beyond what the free tool covers.',
  },
];

export const travelSystemStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: SITE_LOGO_URL },
      founder: {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Taylor Vanderwolk',
        jobTitle: 'Baby Gear Consultant & Registry Expert',
        url: `${SITE_URL}/about`,
      },
    },
    {
      '@type': 'Service',
      '@id': `${TOOL_URL}#service`,
      serviceType: 'Stroller & Car Seat Compatibility Consultation',
      provider: { '@id': ORG_ID, '@type': 'Organization', name: SITE_NAME },
      areaServed: 'US',
      audience: { '@type': 'Audience', audienceType: 'Expecting and new parents' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Baby Gear & Registry Consulting',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: 'Free Travel System Compatibility Checker' },
            price: '0',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: '1-Hour Registry Consult' },
            price: '75',
            priceCurrency: 'USD',
          },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${TOOL_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Baby Gear Tools', item: RESOURCES_URL },
        { '@type': 'ListItem', position: 3, name: 'Travel System Checker', item: TOOL_URL },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': `${TOOL_URL}#howto`,
      name: 'How to Check Stroller and Car Seat Compatibility',
      totalTime: 'PT2M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Select your stroller',
          text: 'Choose your stroller brand and model from the list.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Select your car seat',
          text: 'Choose your infant car seat brand and model.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Get your result',
          text: 'Instantly see Direct-Fit, Adapter Required, or Not Compatible.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${TOOL_URL}#faq`,
      mainEntity: TRAVEL_SYSTEM_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
};
