/**
 * /gift page JSON-LD (schema.org). Reuses the SAME @id values as the homepage,
 * /about, and /services graphs so search + AI engines consolidate ONE
 * Taylor-Made Baby Co. / Baby Registry Consultation entity across the site.
 *
 * Nodes:
 *   • Product (#gift-registry-consult) — the giftable certificate (main entity),
 *     with an Offer ($75), brand Org, and the underlying Service it unlocks.
 *   • WebPage (/gift)      — page type, links Product + Org.
 *   • BreadcrumbList       — Home > Baby Registry Consultation > Gift a Consult.
 *   • HowTo                — the 3-step gifting flow (buy → they redeem → they book).
 */
import { SITE_NAME, SITE_URL, SITE_LOGO_URL } from '@/lib/marketing/metadata';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#taylor`;
const SERVICE_ID = `${SITE_URL}/#service-registry-consult`;
const GIFT_ID = `${SITE_URL}/#gift-registry-consult`;
const GIFT_URL = `${SITE_URL}/gift`;
const SERVICES_URL = `${SITE_URL}/services`;
const BREADCRUMB_ID = `${GIFT_URL}#breadcrumb`;
const HERO_IMAGE = `${SITE_URL}/assets/hero/hero-06.jpg`;

export const giftStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      '@id': GIFT_ID,
      name: 'Baby Registry Consultation Gift Certificate',
      description:
        'Gift a prepaid 1-hour virtual baby registry consultation with Gugu Guru certified specialist Taylor Vanderwolk. The perfect baby shower or new-parent gift: you purchase in minutes, the recipient gets a certificate and books their own time. Covers strollers, car seats, nursery, feeding gear, and registry strategy, with independent guidance and written follow up notes.',
      category: 'Gift Certificate',
      // Brand carries an explicit name (in addition to the shared Org @id) so
      // Google Merchant listings has the required brand.name field.
      brand: { '@type': 'Brand', '@id': ORG_ID, name: SITE_NAME },
      image: HERO_IMAGE,
      url: GIFT_URL,
      offers: {
        '@type': 'Offer',
        name: 'Registry Consultation Gift Certificate',
        price: '75.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: GIFT_URL,
        description:
          'A prepaid 1-hour virtual Registry Consult, redeemable by the recipient at a time that works for them.',
        priceValidUntil: '2026-12-31',
        validFrom: '2026-01-01',
        seller: { '@id': ORG_ID },
        // Digital gift certificate: delivered instantly by email at no cost, so
        // "shipping" is free with same-day delivery. Satisfies the Merchant
        // listings shippingDetails requirement for a non-physical product.
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
            transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
          },
        },
        // Gift certificates are non-refundable (see /refund), so returns are not
        // permitted. Provides the required hasMerchantReturnPolicy field honestly.
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'US',
          returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        },
      },
      isRelatedTo: { '@id': SERVICE_ID },
      logo: SITE_LOGO_URL,
    },
    {
      '@type': 'WebPage',
      '@id': GIFT_URL,
      url: GIFT_URL,
      name: 'Gift a Baby Registry Consultation | Taylor-Made Baby Co.',
      description:
        'Give the gift of confidence: a prepaid 1-hour virtual baby registry consultation with Taylor Vanderwolk. Purchase in minutes; the recipient books their own time. A thoughtful baby shower and new-parent gift.',
      isPartOf: { '@type': 'WebSite', url: SITE_URL, name: SITE_NAME },
      primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE },
      about: { '@id': GIFT_ID },
      breadcrumb: { '@id': BREADCRUMB_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': BREADCRUMB_ID,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Baby Registry Consultation', item: SERVICES_URL },
        { '@type': 'ListItem', position: 3, name: 'Gift a Consult', item: GIFT_URL },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': `${GIFT_URL}#howto`,
      name: 'How to Gift a Baby Registry Consultation',
      description:
        'Give a prepaid 1-hour virtual baby registry consultation as a gift in three simple steps.',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '75' },
      step: [
        {
          '@type': 'HowToStep',
          position: '1',
          name: 'Purchase the gift',
          text: 'Add the recipient’s name and an optional message, then check out securely with Stripe. It takes about a minute.',
          url: GIFT_URL,
        },
        {
          '@type': 'HowToStep',
          position: '2',
          name: 'They receive a certificate',
          text: 'We email the recipient a personalized gift certificate with a unique redemption code — or you can choose to deliver it yourself.',
        },
        {
          '@type': 'HowToStep',
          position: '3',
          name: 'They book their session',
          text: 'The recipient redeems their code and books a 1-hour virtual Registry Consult at a time that works for them. No further payment needed.',
          url: `${SITE_URL}/redeem`,
        },
      ],
    },
  ],
};
