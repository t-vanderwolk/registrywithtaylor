import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import AddonServiceGroup from '@/components/services/AddonServiceGroup';
import PlanningPackageCards from '@/components/services/PlanningPackageCards';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionDivider from '@/components/ui/SectionDivider';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import { serviceAddonGroups } from '@/data/serviceAddons';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Baby Prep Services — Taylor-Made Baby Co.',
  description:
    'Registry, gear, nursery, and home-prep support from Taylor-Made Baby Co. Get expert help choosing what to buy, what to skip, and what can wait.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Service consultation planning',
});

type ServiceChecklistProps = {
  items: string[];
  className?: string;
};

type MethodStep = {
  step: string;
  title: string;
  description: string;
};

type RetailerPartnership = {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidthClassName?: string;
  imageSrc: string;
  imageAlt: string;
  features: string[];
  href: string;
  ctaLabel: string;
  external: boolean;
};

const packageIncludes = [
  {
    title: 'Stroller & Car Seat Decisions',
    description:
      'Narrow the options down to what fits your car, your routine, and how often you actually move through the day with baby.',
  },
  {
    title: 'Registry Strategy',
    description:
      'Build a registry that reflects real life, with better decisions on what belongs on the list, what can wait, and what is not worth the clutter.',
  },
  {
    title: 'Nursery Layout Planning',
    description:
      'Map sleep, feeding, diapering, and storage around how your space works so the room feels useful from day one.',
  },
];

const methodSteps: MethodStep[] = [
  {
    step: '01',
    title: 'Registry Clarity',
    description:
      'We sort priorities, clean up the list, and decide what belongs on the registry now versus later.',
  },
  {
    step: '02',
    title: 'Home & Nursery Preparation',
    description:
      'We map the nursery, storage, safety needs, and daily setup around how your home actually works.',
  },
  {
    step: '03',
    title: 'Intentional Gear Planning',
    description:
      'We narrow the gear choices down to what fits your routines, your budget, and the way you plan to use it.',
  },
];

const commonQuestions: FAQEntry[] = [
  {
    question: 'Do I need a full service package?',
    answer:
      'Not at all. Many families begin with a single consultation and leave with complete clarity about their registry, nursery, and next steps.',
  },
  {
    question: 'Do you work virtually?',
    answer:
      'Yes. Most planning sessions happen virtually, with optional in-person support available in Phoenix when it makes sense.',
  },
  {
    question: 'How do I know where to start?',
    answer:
      'Start with the consultation. That conversation makes it easier to figure out whether you need focused help on one decision or broader support across the full prep process.',
  },
];

const retailerPartnerships: RetailerPartnership[] = [
  {
    label: 'Retail service card',
    eyebrow: 'In partnership with Tot Squad',
    title: 'Target Baby Concierge',
    description:
      'Families using Target Baby Concierge can access free one-on-one help for registry and gear decisions. I help you show up with a shortlist, clearer questions, and a better sense of what actually fits.',
    logoSrc: '/assets/brand/totsquad.png',
    logoAlt: 'Tot Squad',
    logoWidthClassName: 'w-[8.5rem]',
    imageSrc: '/assets/brand/target.png',
    imageAlt: 'Target Baby Concierge',
    features: [
      'Prep before the appointment',
      'Shortlist strollers, car seats, and feeding gear',
      'Use store time to compare the right products',
    ],
    href: 'https://babyconcierge.totsquad.com/',
    ctaLabel: 'Book Target Baby Concierge',
    external: true,
  },
  {
    label: 'Retail service card',
    eyebrow: 'Retailer expertise with Albee Baby',
    title: 'NYC Store Visit Prep',
    description:
      'If you are planning an in-store visit in NYC, I help you sort registry priorities, budget guardrails, and which big-ticket items are worth testing in person before you walk in.',
    logoSrc: '/assets/logos/albeebaby-round1.png',
    logoAlt: 'Albee Baby',
    logoWidthClassName: 'w-[8.25rem]',
    imageSrc: '/assets/brand/albeebabystore.png',
    imageAlt: 'Albee Baby store',
    features: [
      'Know what to test before you go',
      'Compare the right gear in store',
      'Leave with clearer next steps',
    ],
    href: '/contact',
    ctaLabel: 'Ask About Store Visit Prep',
    external: false,
  },
];

function ServiceChecklist({ items, className = '' }: ServiceChecklistProps) {
  return (
    <ul className={['space-y-4 leading-relaxed', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4">
          <CheckIcon />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Hero image="/assets/hero/hero-03.jpg" imageAlt="" className="services-hero">
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
              Thoughtful Support for Every Stage of Baby Preparation
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-2xl text-neutral-700">
              From stroller and car seat decisions to registry strategy and nursery planning, Taylor-Made Baby Co.
              helps families prepare with clarity instead of overwhelm.
            </Body>

            <div className="hero-load-reveal hero-load-reveal--2 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/contact"
                className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Request a Consultation
              </Link>
            </div>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="default" container="default" className="services-page-section">
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mt-5 font-serif leading-tight">Choose Your Support</H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                If you already know you want focused help, a full prep package, or ongoing support, you can start there
                and move straight into the level of guidance that fits.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <PlanningPackageCards className="mt-16" />
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" container="default" className="services-page-section">
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mt-5 font-serif leading-tight">What Is Included in Every Package</H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                Every level of support is tailored, but the work stays grounded in real baby-prep outcomes: clearer
                decisions, fewer unnecessary purchases, and a home setup that feels more ready for daily life.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {packageIncludes.map((item) => (
              <MarketingSurface key={item.title} className="h-full bg-white/90">
                <H3 className="text-center font-serif text-neutral-900">{item.title}</H3>
                <Body className="mt-4 text-neutral-600">{item.description}</Body>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default" container="default" className="services-page-section">
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mt-5 font-serif leading-tight">Retailer Expertise &amp; Partnerships</H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                Retail support is not the main service. It is one more way I help families prepare before they shop,
                identify the right products, and use store appointments more efficiently.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {retailerPartnerships.map((partnership) => (
              <MarketingSurface key={partnership.title} className="flex h-full flex-col rounded-2xl bg-white/90 p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.24em] text-black/45">{partnership.eyebrow}</p>

                {partnership.logoSrc ? (
                  <div className="relative mt-5 h-10">
                    <div className={`relative h-full ${partnership.logoWidthClassName ?? 'w-[8rem]'}`}>
                      <Image
                        src={partnership.logoSrc}
                        alt={partnership.logoAlt ?? partnership.title}
                        fill
                        sizes="136px"
                        className="object-contain object-left"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-[1.75rem] border border-black/8 bg-[linear-gradient(180deg,#fcf8f4_0%,#f3ebe3_100%)]">
                  <Image
                    src={partnership.imageSrc}
                    alt={partnership.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-fill"
                  />
                </div>

                <H3 className="mt-8 font-serif text-neutral-900">{partnership.title}</H3>
                <Body className="mt-5 text-neutral-600">{partnership.description}</Body>

                <ServiceChecklist items={partnership.features} className="mt-8 text-charcoal/80" />

                <div className="mt-auto pt-8">
                  {partnership.external ? (
                    <a
                      href={partnership.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary w-full justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                    >
                      {partnership.ctaLabel}
                    </a>
                  ) : (
                    <Link
                      href={partnership.href}
                      className="btn btn--secondary w-full justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                    >
                      {partnership.ctaLabel}
                    </Link>
                  )}
                </div>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default" container="default" className="services-page-section">
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mt-5 font-serif leading-tight">A Thoughtful Path to Preparation</H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                After you choose the service that fits, the work follows a clear process so the next decisions do not
                stay fuzzy for long.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {methodSteps.map((step) => (
              <MarketingSurface key={step.title} className="h-full bg-white/90">
                <p className="text-xs uppercase tracking-[0.22em] text-black/45">{step.step}</p>
                <H3 className="mt-4 text-center font-serif text-neutral-900">{step.title}</H3>
                <Body className="mt-5 text-neutral-600">{step.description}</Body>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" container="default" className="services-page-section">
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-charcoal/55">
                Optional Add-On Support
              </p>

              <H2 className="mt-5 font-serif leading-tight">Optional Add-On Support</H2>

              <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                Some families want support beyond the core planning categories. These add-ons cover registry strategy,
                home preparation, caregiver support, and optional celebration help.
              </Body>
            </div>
          </RevealOnScroll>

          <div className="mt-16">
            {serviceAddonGroups.map((group, index) => (
              <AddonServiceGroup
                key={group.title}
                title={group.title}
                description={group.description}
                icon={group.icon}
                services={group.services}
                isFirst={index === 0}
                headingId={`service-addon-group-${index + 1}`}
              />
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default" container="narrow" className="services-page-section">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <H2 className="mt-5 font-serif leading-tight">Common Questions</H2>

              <Body className="mx-auto mt-6 max-w-2xl text-neutral-600">
                A few quick answers for families deciding how they want to begin.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <FAQAccordion items={commonQuestions} className="mx-auto mt-12 max-w-3xl bg-[#F7F4EF]" />
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA
          className="services-page-section mt-8 md:mt-10"
          title="Start Your Baby Preparation With Confidence"
          description="Clear preparation starts with one thoughtful conversation."
          ctaLabel="Schedule Your Consultation"
        />
      </main>
    </SiteShell>
  );
}
