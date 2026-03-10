import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import HowItWorksAnalytics from '@/components/analytics/HowItWorksAnalytics';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import LuxuryAccordion from '@/components/ui/LuxuryAccordion';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionDivider from '@/components/ui/SectionDivider';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'How It Works - Taylor-Made Baby Co.',
  description:
    'Understand the guided baby planning process at Taylor-Made Baby Co., from your consultation to confident preparation.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works planning process',
});

type ProcessStep = {
  step: string;
  title: string;
  description: string;
  iconSrc: string;
  bullets: string[];
  ctaLabel?: string;
};

type BenefitCard = {
  title: string;
  description: string;
  iconSrc: string;
};

type SearchParams = Promise<{ error?: string }> | undefined;

const processSteps: ProcessStep[] = [
  {
    step: 'Step One',
    title: 'Start with a Conversation',
    description:
      'Before families begin buying baby gear, we start with clarity. Through the Target Baby Concierge program, I offer complimentary consultations designed to help parents sort the early decisions before the list gets too loud.',
    iconSrc: '/assets/icons/virtual.png',
    bullets: [
      'Registry structure',
      'Early gear priorities',
      'Nursery planning questions',
      'Purchasing timeline',
    ],
    ctaLabel: 'Book Your Consultation',
  },
  {
    step: 'Step Two',
    title: 'Design Your Plan',
    description:
      'Once the foundation is clear, we refine the details. Every family’s home, lifestyle, and routines are different, so the baby plan should be too.',
    iconSrc: '/assets/icons/stragity.png',
    bullets: [
      'Registry refinement',
      'Nursery layout guidance',
      'Gear strategy',
      'Stroller and car seat planning',
    ],
  },
  {
    step: 'Step Three',
    title: 'Prepare with Confidence',
    description:
      'By the time baby arrives, nothing feels rushed. The decisions have a clear reason behind them, and the setup feels ready for real daily life.',
    iconSrc: '/assets/icons/gear-plan.png',
    bullets: [
      'A refined registry',
      'A clear purchasing plan',
      'A nursery designed for daily life',
      'Confidence in major gear decisions',
    ],
  },
];

const benefitCards: BenefitCard[] = [
  {
    title: 'Registry clarity',
    description: 'Know what belongs on the list now, what can wait, and what is not worth adding.',
    iconSrc: '/assets/icons/buildregistry.png',
  },
  {
    title: 'Thoughtful purchasing decisions',
    description: 'Buy with a plan instead of reacting to every recommendation and sale.',
    iconSrc: '/assets/icons/calender.png',
  },
  {
    title: 'A calm nursery layout',
    description: 'Shape the room around real routines so the setup feels functional from day one.',
    iconSrc: '/assets/icons/nursery.png',
  },
  {
    title: 'Confidence in baby gear',
    description: 'Make stroller, car seat, and everyday gear decisions with far less second-guessing.',
    iconSrc: '/assets/icons/carseats.png',
  },
  {
    title: 'Preparation that fits your life',
    description: 'The plan reflects your space, your routines, your budget, and the way you actually live.',
    iconSrc: '/assets/icons/family.png',
  },
];

const consultationHighlights = [
  'Ask the biggest registry and gear questions before the list gets longer',
  'Get direction on stroller, car seat, nursery, and purchase-timing decisions',
  'Figure out what deserves attention first and what can wait',
  'Leave with a calmer sense of what the next step should be',
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 pt-2 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4 text-sm leading-relaxed text-neutral-700 md:text-base">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function HowItWorksPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <SiteShell currentPath="/how-it-works">
      <HowItWorksAnalytics>
        <main className="site-main">
          <Hero image="/assets/hero/hero-02.jpg" imageAlt="How it works planning process">
            <div className="space-y-6">
              <h1 className="marketing-hero-headline hero-load-reveal">
                How Baby Planning with Taylor-Made Baby Co. Works
              </h1>

              <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
                Preparation does not start with a shopping list. It starts with clarity.
              </Body>

              <div className="hero-load-reveal hero-load-reveal--2 flex flex-col gap-4 pt-4 sm:flex-row">
                <Link
                  href="#free-consultation"
                  data-analytics-consultation-cta="Schedule Your Complimentary Consultation"
                  className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  Schedule Your Complimentary Consultation
                </Link>
              </div>
            </div>
          </Hero>

          <MarketingSection
            tone="white"
            spacing="default"
            container="default"
            className="how-it-works-section"
            id="free-consultation"
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-start lg:gap-14">
              <RevealOnScroll>
                <div className="max-w-2xl">
                  <SectionDivider />
                  <p className="mt-6 text-xs uppercase tracking-[0.24em] text-black/45">Complimentary Consultation</p>
                  <H2 className="mt-4 font-serif leading-tight">Free 1:1 Consultation (30 Minutes)</H2>

                  <Body className="mt-6 text-neutral-700">
                    This is where families get out of research mode and into a clear plan. The first conversation is
                    designed to sort the questions, categories, and next steps that matter most right now.
                  </Body>

                  <Body className="mt-4 text-neutral-700">
                    You do not need to have every product decision figured out before reaching out. The call is there
                    to help you narrow what deserves attention first.
                  </Body>

                  <Checklist items={consultationHighlights} />

                  <Body className="mt-8 text-neutral-600">
                    If it makes sense to keep going, Taylor can recommend the right next layer of support after the
                    call. If not, you still leave with clearer direction than you had before.
                  </Body>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={90}>
                <MarketingSurface className="rounded-[2rem] bg-[linear-gradient(180deg,#fdf9f6_0%,#f7f1ea_100%)] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.06)] md:p-10">
                  <p className="text-xs uppercase tracking-[0.24em] text-black/45">Start Here</p>
                  <H3 className="mt-4 font-serif text-neutral-900">Request your consultation</H3>
                  <Body className="mt-4 text-neutral-700">
                    Share a few basics and Taylor will follow up directly with next steps for your complimentary
                    session.
                  </Body>

                  <div className="mt-8">
                    <ConsultationRequestForm
                      errorCode={params?.error ?? null}
                      returnPath="/how-it-works#free-consultation"
                      successPath="/consultation/confirmation"
                    />
                  </div>
                </MarketingSurface>
              </RevealOnScroll>
            </div>
          </MarketingSection>

          <MarketingSection tone="ivory" spacing="default" container="default" className="how-it-works-section">
            <RevealOnScroll>
              <div className="mx-auto max-w-4xl text-center">
                <div className="flex justify-center">
                  <SectionDivider />
                </div>

                <H2 className="mt-5 font-serif leading-tight">A Calm, Guided Path</H2>

                <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                  The process works best when it moves in order: start with clarity, shape the plan around real life,
                  and prepare without rushing the decisions that matter most.
                </Body>
              </div>
            </RevealOnScroll>

            <div className="mt-16 grid gap-8 xl:grid-cols-3">
              {processSteps.map((step) => (
                <MarketingSurface key={step.title} className="flex h-full flex-col rounded-2xl bg-white/90 p-8 md:p-10">
                  <div className="mx-auto mb-8 flex w-full items-center justify-center">
                    <ServiceIconBadge src={step.iconSrc} size="addon" />
                  </div>

                  <p className="text-center text-xs uppercase tracking-[0.24em] text-black/45">{step.step}</p>
                  <H3 className="mt-4 text-center font-serif text-neutral-900">{step.title}</H3>

                  <Body className="mt-5 text-neutral-700">{step.description}</Body>

                  <Checklist items={step.bullets} />

                  {step.ctaLabel ? (
                    <div className="mt-auto pt-8">
                      <Link
                        href="#free-consultation"
                        data-analytics-consultation-cta={step.ctaLabel}
                        className="btn btn--primary w-full justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                      >
                        {step.ctaLabel}
                      </Link>
                    </div>
                  ) : null}
                </MarketingSurface>
              ))}
            </div>
          </MarketingSection>

          <MarketingSection tone="white" spacing="default" container="default" className="how-it-works-section">
            <RevealOnScroll>
              <div className="mx-auto max-w-4xl text-center">
                <div className="flex justify-center">
                  <SectionDivider />
                </div>

                <H2 className="mt-5 font-serif leading-tight">What Families Gain from the Process</H2>

                <Body className="mx-auto mt-6 max-w-3xl text-neutral-600">
                  The outcome is not just a better list. It is a preparation plan that feels calmer, more intentional,
                  and easier to act on.
                </Body>
              </div>
            </RevealOnScroll>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {benefitCards.map((card) => (
                <MarketingSurface key={card.title} className="flex h-full flex-col rounded-2xl bg-white/90 p-8 text-center">
                  <div className="mx-auto mb-6 flex w-full items-center justify-center">
                    <ServiceIconBadge src={card.iconSrc} size="default" />
                  </div>

                  <H3 className="font-serif text-neutral-900">{card.title}</H3>

                  <div className="mt-auto pt-6">
                    <LuxuryAccordion
                      items={[card.description]}
                      contentVariant="stacked"
                      panelClassName="text-left"
                    />
                  </div>
                </MarketingSurface>
              ))}
            </div>
          </MarketingSection>

          <FinalCTA
            className="how-it-works-section"
            title="Start Your Baby Planning Journey"
            description="Clear preparation often begins with a single thoughtful conversation."
            ctaLabel="Schedule Your Consultation"
            ctaAnalyticsLabel="Schedule Your Consultation"
          />
        </main>
      </HowItWorksAnalytics>
    </SiteShell>
  );
}
