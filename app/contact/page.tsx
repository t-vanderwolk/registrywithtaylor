import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import ContactInquiryForm from '@/components/contact/ContactInquiryForm';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Contact a Baby Gear Consultant | Taylor-Made Baby Co.',
  description:
    'Get personalised baby gear, registry & nursery guidance from certified consultant Taylor Vanderwolk. Every message read personally — response within 24 hours.',
  path: '/contact',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Contact a baby gear & registry consultant — Taylor-Made Baby Co.',
});

const serviceConfig = {
  'focused-edit': {
    label: 'Registry Consult',
    intro: 'A focused 1-hour session on your registry and the biggest product decisions.',
    fields: ['registryLink', 'dueDate', 'topConcerns'],
  },
  'signature-plan': {
    label: 'Longer-term planning',
    intro: 'Ongoing support across registry strategy, nursery setup, and baby gear decisions.',
    fields: ['dueDate', 'homeType', 'budgetRange', 'biggestStress'],
  },
  'private-concierge': {
    label: 'Full baby planning',
    intro: 'Continued, hands-on help as you sort registry, gear, and home-prep details.',
    fields: ['dueDate', 'location', 'levelOfSupport', 'timeline'],
  },
} as const;

type SearchParams = Promise<{ service?: string }> | undefined;
type ServiceKey = keyof typeof serviceConfig;
type ServiceField = (typeof serviceConfig)[ServiceKey]['fields'][number];

function isServiceKey(value: string): value is ServiceKey {
  return value in serviceConfig;
}

const TRUST_BADGES = [
  'Tot Squad Certified Specialist',
  'Hands-On Baby Gear Experience',
  '500+ Families Helped',
  'Zero Affiliate Commission',
  'Response Within 24 Hours',
  'Virtual · US Nationwide',
];

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Fill in the short form (90 seconds)',
    body: 'The form asks for your name, email, due date, and your biggest baby planning challenge. You don’t need to know the right terminology or have done any research. Just describe where you are. Taylor reads every field before she replies.',
  },
  {
    n: '02',
    title: 'Taylor reads your message personally and responds within 24 hours',
    body: 'Every submission goes directly to Taylor — not to an assistant, not to a CRM auto-responder. She reads your message before she responds. Her reply will be specific to what you wrote, not a template. Most people hear back the same business day.',
  },
  {
    n: '03',
    title: 'You get a clear next step — specific to your situation',
    body: 'Taylor’s response will identify the right level of support for where you are: the free 30-minute intro call, the $75 Registry Consult, the TMBC Academy self-guided programme, or a custom ongoing arrangement. No pressure, no upsell. A clear next step.',
  },
];

const CREDENTIALS = [
  'Tot Squad Certified Specialist — the certification behind Target’s Baby Concierge programme',
  'Strolleria Baby Gear Specialist — years comparing 100+ strollers and travel systems hands-on',
  'Pottery Barn Kids Nursery Advisor — real furniture and nursery planning experience',
  '500+ Families Helped — across virtual consultations and in-person retail',
  'Zero Affiliate Commission — every recommendation is independent, no brand deals',
];

const BOOKING_TIERS = [
  {
    service: 'Introductory Call',
    duration: '30 minutes',
    price: 'Free',
    includes: 'Your top questions · Situation assessment · Recommended next step',
    booking: 'Start with the form below',
  },
  {
    service: 'Registry Consult',
    duration: '1 Hour',
    price: '$75',
    includes: 'Full registry · Stroller · Car seat · Nursery · Written follow-up notes · Virtual',
    booking: 'Book directly',
  },
  {
    service: 'Ongoing Support',
    duration: 'Ongoing',
    price: 'Custom',
    includes: 'Full pregnancy planning through the fourth trimester · Contact to discuss',
    booking: 'Start with the form below',
  },
];

const LEAD_MAGNET_BULLETS = [
  'Registry strategy overview — what to add now, what to wait on, what to skip entirely',
  'Stroller type decision tree — 6 questions that narrow 300 options to 3',
  'Car seat compatibility checklist — LATCH, base fit, and vehicle considerations',
  'Nursery planning timeline — what to buy by trimester',
  'Baby gear budget guide — where to spend, where to save, what to borrow',
  'Taylor’s one-line verdict on the 10 most-bought baby gear items',
];

const CONTACT_FAQS: FAQEntry[] = [
  {
    question: 'What is a baby gear consultant?',
    answer:
      'A baby gear consultant is a specialist who helps expecting parents choose the right strollers, car seats, nursery furniture, and registry products based on their specific home, vehicle, lifestyle, and budget — rather than a generic “best of” list. Taylor Vanderwolk at Taylor-Made Baby Co. brings hands-on experience from Strolleria and Pottery Barn Kids, plus certification as a Tot Squad specialist through Target’s Baby Concierge programme. She works with families virtually across the US.',
  },
  {
    question: 'How much does a baby registry consultation cost?',
    answer:
      'Taylor-Made Baby Co. offers a complimentary 30-minute introductory call with no obligation — you complete a short intake form and Taylor schedules a focused session around your specific questions. The Registry Consult service is $75 for a full 1-hour virtual session covering your complete registry, stroller shortlist, car seat compatibility, and nursery setup, with written follow-up notes included. Longer-term planning support is available — contact Taylor via the form to discuss.',
  },
  {
    question: 'Can I get baby gear advice virtually?',
    answer:
      'Yes. All consultations at Taylor-Made Baby Co. are available virtually and work exactly as well online as in person. Sessions are built around your specific home layout, vehicle make and model, daily routine, and budget — not a generic checklist. Taylor works with expecting parents across the US, from city apartments to suburban homes, covering the same stroller, car seat, nursery, and registry decisions regardless of location. Response to initial enquiries within 24 hours.',
  },
  {
    question: 'How quickly does Taylor respond to enquiries?',
    answer:
      'Taylor personally reviews every contact form submission and responds within 24 hours — with no automated responses, no assistant filtering, and no generic templates. Every reply comes directly from Taylor, with context from your specific message already read. Most enquiries receive a response the same business day. After her reply, she will direct you to the right level of support for your situation: the free intro call, the $75 Registry Consult, or ongoing planning support.',
  },
  {
    question: 'What baby topics can I get help with?',
    answer:
      'Taylor provides guidance on baby registry strategy, stroller selection, infant car seat safety and compatibility, nursery planning and safe sleep setup, baby gear budgeting, and full baby planning from pregnancy through the fourth trimester. She also covers feeding gear, newborn kit essentials, and travel systems. If you have a specific product question — comparing two stroller options, checking car seat fit for your vehicle — bring it to the form and she will address it directly.',
  },
  {
    question: 'Do I need to know what I want before reaching out?',
    answer:
      'No prior research is needed — and many clients reach out specifically because they do not know where to start. The contact form has a short field for your biggest challenge right now. Taylor reads it before replying, so her response is specific to your situation rather than a generic starting point. Many parents who come in “not knowing anything” leave their consultation with a complete, clear registry and a stroller decision they feel confident about.',
  },
  {
    question: 'Is Taylor-Made Baby Co. affiliated with any baby gear brands?',
    answer:
      'No. Taylor-Made Baby Co. provides fully independent guidance and accepts zero affiliate commission from any baby gear brand. Recommendations are based solely on fit for the parent’s specific home, car, routine, and budget — the same framework Taylor applied during her years as a hands-on specialist at Strolleria and as a certified Tot Squad consultant. No sponsorship, no paid placements, no brand deals influence any recommendation Taylor gives.',
  },
  {
    question: 'What happens after I submit the contact form?',
    answer:
      'After submitting the form, Taylor reads your message personally and responds within 24 hours. Based on what you share, she will direct you to the most appropriate next step: the complimentary 30-minute introductory call (no cost), the 1-hour Registry Consult ($75), the TMBC Academy self-guided programme, or a custom ongoing planning arrangement. The response will be specific to what you wrote — not a template. You will know exactly what to do next when Taylor replies.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Taylor took what could have been a very overwhelming experience and made it so simple and easy! She was an absolute joy to work with and incredibly knowledgeable.',
    name: 'Amanda M.',
    source: 'Strolleria · Verified review',
  },
  {
    quote:
      'We had an amazing experience with Taylor. She listened to what we were looking for, and was so honest and transparent about all of the baby gear we were considering.',
    name: 'Kathryn G.',
    source: 'Strolleria · Verified review',
  },
];

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_URL}/contact#page`,
  name: 'Contact Taylor-Made Baby Co.',
  description:
    'Reach out for personalised baby gear guidance, registry strategy, nursery planning, or consultation support from certified baby gear specialist Taylor Vanderwolk. Every message is personally read — response within 24 hours.',
  url: `${SITE_URL}/contact`,
  inLanguage: 'en-US',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
    ],
  },
  mainEntity: {
    '@type': 'Person',
    '@id': `${SITE_URL}/about#taylor`,
    name: 'Taylor Vanderwolk',
    jobTitle: 'Baby Gear Consultant',
    description:
      'Certified Tot Squad specialist and baby registry consultant with hands-on experience at Strolleria, Pottery Barn Kids, and Target Baby Concierge.',
    email: 'hello@taylormadebabyco.com',
    telephone: '+14807124347',
    url: `${SITE_URL}/about`,
    knowsAbout: [
      'Baby registry strategy',
      'Stroller selection and compatibility',
      'Infant car seat safety',
      'Nursery planning',
      'Baby gear budgeting',
      'Travel system selection',
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional Certification',
      name: 'Tot Squad Certified Baby Gear Specialist',
    },
    sameAs: [
      'https://instagram.com/taylorbabyconcierge',
      'https://wa.me/14807124347',
    ],
    worksFor: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Taylor-Made Baby Co.' },
  },
  isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Taylor-Made Baby Co.', url: SITE_URL },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#organization`,
      name: 'Taylor-Made Baby Co.',
      description:
        'Independent, hands-on baby gear guidance for expecting parents — registry, stroller, car seat, and nursery planning from certified specialist Taylor Vanderwolk. Virtual consultations, US Nationwide.',
      url: `${SITE_URL}/`,
      telephone: '+14807124347',
      email: 'hello@taylormadebabyco.com',
      priceRange: '$-$$$',
      currenciesAccepted: 'USD',
      paymentAccepted: 'Credit Card, Debit Card',
      sameAs: ['https://instagram.com/taylorbabyconcierge', 'https://wa.me/14807124347'],
      areaServed: { '@type': 'Country', name: 'United States' },
      founder: { '@type': 'Person', '@id': `${SITE_URL}/about#taylor`, name: 'Taylor Vanderwolk' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Baby Planning Services — Taylor-Made Baby Co.',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Complimentary 30-Minute Consultation',
            description:
              'Free introductory call. Taylor reviews your intake form and addresses your top baby planning questions.',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/contact`,
          },
          {
            '@type': 'Offer',
            name: 'Registry Consult — 1-Hour Virtual Session',
            description:
              'Full registry, stroller, car seat, and nursery planning consultation. Written follow-up notes included.',
            price: '75',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/book`,
          },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#registry-consultation`,
      name: 'Registry Consult — 1-Hour Virtual Session',
      provider: { '@id': `${SITE_URL}/#organization` },
      serviceType: 'Baby Registry Consultation',
      description:
        'One-hour virtual consultation covering baby registry, stroller, car seat, and nursery planning with written follow-up notes.',
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: {
        '@type': 'Offer',
        price: '75',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/book`,
      },
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CONTACT_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export default async function ContactPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const selectedService = params?.service ?? '';
  const resolvedService = isServiceKey(selectedService) ? selectedService : null;
  const config = resolvedService ? serviceConfig[resolvedService] : null;

  const selectedFields: readonly string[] = config?.fields ?? [];
  const hasField = (field: ServiceField) => selectedFields.includes(field);
  const dueDateRequired = hasField('dueDate');

  return (
    <SiteShell currentPath="/contact">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="site-main">
        <PageViewTracker path="/contact" pageType="contact" />

        <Hero
          className="homepage-hero"
          eyebrow="Contact"
          title="Contact a Baby Gear & Registry Consultant"
          subtitle="Get personalised baby gear, registry, and nursery guidance from certified consultant Taylor Vanderwolk. Every message is read personally — response within 24 hours."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact consultation workspace"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mx-auto mb-6 max-w-2xl text-[0.72rem] text-neutral-500">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="link-underline text-[var(--color-accent-dark)]">Home</Link>
              </li>
              <li aria-hidden className="text-neutral-300">›</li>
              <li aria-current="page" className="text-neutral-600">Contact</li>
            </ol>
          </nav>

          <RevealOnScroll>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[0.9rem] font-semibold text-neutral-800">
                Taylor Vanderwolk — Certified Tot Squad Specialist · Former Strolleria Baby Gear Specialist · 500+ Families Helped
              </p>
              <p className="mt-2 text-[0.78rem] uppercase tracking-[0.14em] text-[var(--color-accent-dark)]/80">
                Free Intro Call · Virtual · US Nationwide · Response Within 24 Hours · Zero Affiliate Commission
              </p>
              <p className="mt-3 text-[0.9rem] text-neutral-600">
                Prefer to talk it through? Call or text{' '}
                <a href="tel:+14807124347" className="link-underline font-medium text-[var(--color-accent-dark)]">
                  480-712-4347
                </a>
                .
              </p>
            </div>
          </RevealOnScroll>

          {/* Trust badges */}
          <RevealOnScroll>
            <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge}
                  className="rounded-[1rem] border border-[rgba(0,0,0,0.07)] bg-white/85 px-3 py-2.5 text-center text-[0.74rem] font-semibold leading-tight text-neutral-700 shadow-[0_6px_18px_rgba(72,49,56,0.04)]"
                >
                  {badge}
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Intro copy */}
          <RevealOnScroll>
            <div className="mx-auto mt-10 max-w-2xl">
              <h2 className="font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-neutral-900">
Real Baby Gear &amp; Registry Help — Response Within 24 Hours
              </h2>
              <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
                Whether you have a quick stroller question, need a full registry review, or want ongoing baby planning
                support from pregnancy through the fourth trimester — this is where to start.
              </p>
              <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
                Taylor Vanderwolk reads every message personally. There are no automated responses, no assistants
                handling initial enquiries, and no generic reply templates. You send your question. She reads it. You
                hear back within 24 hours — with a specific, practical answer.
              </p>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        {/* Contact form */}
        <MarketingSection tone="blush" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto mb-6 max-w-2xl text-center">
              <h2 className="font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-neutral-900">
                Ready for Ongoing Baby Gear &amp; Registry Support?
              </h2>
              <p className="mt-2 text-[0.97rem] leading-7 text-neutral-700">
                Whether it’s one question or a full pregnancy planning partnership — start here and Taylor will find the
                right level for your situation.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="mx-auto mb-6 max-w-2xl rounded-[1.45rem] border border-[rgba(215,161,175,0.28)] bg-[linear-gradient(180deg,rgba(255,246,249,0.98)_0%,rgba(255,240,245,0.96)_100%)] px-6 py-5 text-center shadow-[0_8px_24px_rgba(72,49,56,0.05)]">
              <p className="text-[0.97rem] leading-7 text-neutral-700">
                Already know what you need? Skip the form and book a Registry Consult directly — $75 · 1 hour · Virtual ·
                US Nationwide.{' '}
                <Link href="/book" className="link-underline font-semibold text-[var(--color-accent-dark)]">
                  Book now →
                </Link>
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-2xl space-y-6">
              <ContactInquiryForm
                selectedService={selectedService || undefined}
                selectedServiceLabel={config?.label ?? null}
                selectedFields={selectedFields}
                dueDateRequired={dueDateRequired}
              />
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>

        {/* How it works */}
        <MarketingSection tone="white" spacing="default" container="default">
          <RevealOnScroll>
            <h2 className="text-center font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-neutral-900">
              How Taylor’s Contact Process Works — 3 Steps
            </h2>
          </RevealOnScroll>
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <RevealOnScroll key={step.n}>
                <div className="h-full rounded-[1.4rem] border border-[rgba(0,0,0,0.07)] bg-white/90 p-6 shadow-[0_10px_28px_rgba(72,49,56,0.05)]">
                  <p className="font-serif text-[1.6rem] text-[var(--color-cta-pink)]">{step.n}</p>
                  <h3 className="mt-2 text-[1rem] font-semibold leading-snug text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-7 text-neutral-600">{step.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* Bio block */}
        <MarketingSection tone="blush" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/taylor2.png"
                  alt="Taylor Vanderwolk, certified baby gear & registry consultant at Taylor-Made Baby Co."
                  width={132}
                  height={165}
                  className="h-[165px] w-[132px] flex-none rounded-[1.2rem] object-cover shadow-[0_10px_28px_rgba(72,49,56,0.12)]"
                />
                <div>
                  <h2 className="font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-neutral-900">
                    About Taylor Vanderwolk — Baby Gear &amp; Registry Consultant
                  </h2>
                  <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
                    This contact form goes directly to Taylor Vanderwolk — a certified baby gear specialist and baby
                    registry consultant with real, hands-on experience helping expecting parents make stroller, car
                    seat, registry, and nursery decisions.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
                Before founding Taylor-Made Baby Co., Taylor worked as a specialist at Strolleria (the leading US baby
                specialty retailer), as a nursery advisor at Pottery Barn Kids, and as a certified consultant in the Tot
                Squad programme — the baby concierge service powering 200+ Target Baby stores nationwide. She has since
                appeared on the BabyQuip Tiny Travels podcast discussing real-life baby gear decision-making.
              </p>
              <ul className="mt-5 space-y-2.5">
                {CREDENTIALS.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[0.92rem] leading-7 text-neutral-700">
                    <span aria-hidden className="text-[var(--color-cta-pink)]">★</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <blockquote className="mt-6 rounded-[1.3rem] border border-[rgba(215,161,175,0.25)] bg-white/80 px-5 py-4 text-[0.95rem] italic leading-7 text-neutral-700">
                “My approach is calm, practical, and built around what actually fits your home, your routines, and your
                budget. Your registry does not need to impress the internet. It just needs to work when life gets real.”
                <footer className="mt-2 not-italic text-[0.8rem] font-semibold text-neutral-500">— Taylor Vanderwolk</footer>
              </blockquote>
            </div>
          </RevealOnScroll>

          {/* Testimonials */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <RevealOnScroll key={t.name}>
                <figure className="h-full rounded-[1.3rem] border border-[rgba(0,0,0,0.07)] bg-white/90 p-5 shadow-[0_8px_22px_rgba(72,49,56,0.04)]">
                  <blockquote className="text-[0.92rem] leading-7 text-neutral-700">“{t.quote}”</blockquote>
                  <figcaption className="mt-3 text-[0.78rem] font-semibold text-neutral-500">
                    {t.name} · {t.source}
                  </figcaption>
                </figure>
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* Direct booking */}
        <MarketingSection tone="white" spacing="default" container="default">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-neutral-900">
                Already Know What You Need? Book a Consultation Directly.
              </h2>
              <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
                The contact form is the right starting point if you want to describe your situation first. If you
                already know you want a full registry review, stroller consultation, or nursery planning session — you
                can book directly without messaging first.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="mx-auto mt-7 max-w-4xl overflow-hidden rounded-[1.4rem] border border-[rgba(0,0,0,0.08)] bg-white/92 shadow-[0_12px_30px_rgba(72,49,56,0.05)]">
              <div className="grid grid-cols-1 divide-y divide-[rgba(0,0,0,0.06)] md:grid-cols-3 md:divide-x md:divide-y-0">
                {BOOKING_TIERS.map((tier) => (
                  <div key={tier.service} className="p-5">
                    <p className="font-serif text-[1.15rem] text-neutral-900">{tier.service}</p>
                    <p className="mt-1 text-[0.8rem] uppercase tracking-[0.12em] text-[var(--color-accent-dark)]/80">
                      {tier.duration} · {tier.price}
                    </p>
                    <p className="mt-2 text-[0.88rem] leading-6 text-neutral-600">{tier.includes}</p>
                    <p className="mt-3 text-[0.8rem] font-semibold text-neutral-500">{tier.booking}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="mx-auto mt-6 max-w-md text-center">
              <Link href="/book" className="btn btn--primary w-full">
                Book a Registry Consult — $75
              </Link>
              <p className="mt-2 text-[0.78rem] text-neutral-500">
                1 Hour · Virtual · US Nationwide · Full refund if cancelled 24+ hours before
              </p>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        {/* Lead magnet */}
        <MarketingSection tone="blush" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl">
              <h2 className="font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-neutral-900">
                Download the Free Baby Prep Starter Guide
              </h2>
              <p className="mt-3 text-[0.97rem] leading-7 text-neutral-700">
                The Baby Prep Starter Guide is the calm, practical starting point Taylor gives every new client before
                their first consultation. If you are not ready to message yet — start here.
              </p>
              <ul className="mt-5 space-y-2.5">
                {LEAD_MAGNET_BULLETS.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[0.92rem] leading-7 text-neutral-700">
                    <span aria-hidden className="text-[var(--color-cta-pink)]">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/resources" className="btn btn--secondary">
                  Send Me the Free Guide →
                </Link>
                <p className="mt-2 text-[0.78rem] text-neutral-500">
                  No spam. Unsubscribe anytime. Sent to 500+ expecting parents.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        {/* FAQ */}
        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <h2 className="text-center font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-neutral-900">
              Baby Gear Consultation FAQs — Questions Expecting Parents Ask
            </h2>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="mx-auto mt-7 max-w-2xl">
              <FAQAccordion items={CONTACT_FAQS} />
            </div>
          </RevealOnScroll>
        </MarketingSection>

        {/* Closing */}
        <MarketingSection tone="blush" spacing="tight" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl rounded-[1.4rem] bg-[var(--color-accent-dark)] px-6 py-7 text-center text-white shadow-[0_14px_34px_rgba(72,49,56,0.12)]">
              <p className="font-serif text-[1.35rem] leading-snug">
                The form is the first step. A conversation is where the clarity begins.
              </p>
              <p className="mt-2 text-[0.92rem] leading-7 text-white/85">
                One message to Taylor — she reads it, responds within 24 hours, and tells you exactly what you need next.
              </p>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
