import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import RibbonDivider from '@/components/layout/RibbonDivider';
import HomeAuthorityStrip from '@/components/home/HomeAuthorityStrip';
import HomeEditorialBreak from '@/components/home/HomeEditorialBreak';
import SiteShell from '@/components/SiteShell';
import HomeServicesSection from '@/components/home/HomeServicesSection';
import HomeTransitionSection from '@/components/home/HomeTransitionSection';
import ConsultationRequestSection from '@/components/marketing/ConsultationRequestSection';
import EcosystemFlow from '@/components/marketing/EcosystemFlow';
import RegistryEcosystemMap from '@/components/marketing/RegistryEcosystemMap';
import StartHereSection from '@/components/marketing/StartHereSection';
import CheckIcon from '@/components/ui/CheckIcon';
import EditorialIllustration from '@/components/ui/EditorialIllustration';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Co. | Expert Baby Gear Guidance for Expecting Parents',
  description:
    'Expert baby gear guidance to help growing families choose thoughtfully, prepare their homes, and start parenthood with confidence.',
  path: '/',
  imagePath: '/assets/hero/hero-01.jpg',
  imageAlt: 'Taylor-Made Baby Co. baby gear planning editorial image.',
});

type SearchParams = Promise<{ error?: string }> | undefined;

type TimelineStep = {
  stepLabel: string;
  title: string;
  description: string;
  emphasis?: string;
  bullets?: string[];
};

type JourneyStep = {
  stepLabel: string;
  title: string;
  description: string;
};

type PreparationPartner = {
  name: string;
  logoSrc: string;
  logoAlt: string;
  width: number;
  height: number;
  logoClassName: string;
};

type AdvisorExperienceCard = {
  title: string;
  logoSrc?: string;
  logoAlt?: string;
  width?: number;
  height?: number;
  logoClassName?: string;
  wordmark?: string;
  wordmarkClassName?: string;
};

const timelineSteps: TimelineStep[] = [
  {
    stepLabel: 'Step 1',
    title: 'Education First',
    description:
      'Understanding the categories first helps you avoid adding products that will not actually fit your lifestyle.',
    emphasis: "The goal is not a bigger registry. It's a smarter one.",
  },
  {
    stepLabel: 'Step 2',
    title: 'Smart Registry Setup',
    description: 'Registering strategically unlocks valuable perks.',
    bullets: [
      'Welcome box registrations',
      'Retailer registry rewards',
      'Loyalty program points',
      'Brand welcome gifts',
    ],
  },
  {
    stepLabel: 'Step 3',
    title: 'Intentional Purchasing',
    description: 'Timing purchases strategically helps families save hundreds.',
    bullets: [
      'Price matching opportunities',
      'Brand rebates',
      'Seasonal sales',
      'Reward stacking',
      'Registry completion discounts',
    ],
  },
  {
    stepLabel: 'Step 4',
    title: 'Avoid Hidden Costs',
    description: 'Many families unknowingly spend hundreds on shipping and handling.',
    bullets: [
      'Furniture freight charges',
      'Custom order lead times',
      'Unexpected delivery fees',
      'Missed in-store discounts',
    ],
  },
];

const journeySteps: JourneyStep[] = [
  {
    stepLabel: 'Step 1',
    title: 'Learn',
    description: 'Explore baby gear categories and preparation guidance before the registry starts filling itself in.',
  },
  {
    stepLabel: 'Step 2',
    title: 'Plan',
    description: 'Work with Taylor to shape your registry, priorities, and preparation timeline around real life.',
  },
  {
    stepLabel: 'Step 3',
    title: 'Try',
    description: 'Test products in store or through trusted partners so the shortlist feels grounded.',
  },
  {
    stepLabel: 'Step 4',
    title: 'Buy',
    description: 'Make confident purchases using registry perks, discounts, and better timing.',
  },
];

const advisorFocusAreas = [
  {
    title: 'Stroller Strategy',
    iconSrc: '/assets/icons/gear-plan.png',
    iconAlt: 'Baby gear planning illustration',
    width: 1155,
    height: 864,
    iconClassName: 'max-h-[9.25rem] sm:max-h-[9.8rem]',
  },
  {
    title: 'CPST car seat checks and installs',
    iconSrc: '/assets/icons/cpst.png',
    iconAlt: 'CPST car seat checks and installs illustration',
    width: 264,
    height: 202,
    iconClassName: 'max-h-[8.9rem] sm:max-h-[9.4rem]',
  },
  {
    title: 'Registry Strategy',
    iconSrc: '/assets/icons/stragity.png',
    iconAlt: 'Registry strategy illustration',
    width: 1116,
    height: 770,
    iconClassName: 'max-h-[8.35rem] sm:max-h-[8.9rem]',
  },
  {
    title: 'Nursery Setup',
    iconSrc: '/assets/icons/nurserysetup.png',
    iconAlt: 'Nursery setup illustration',
    width: 378,
    height: 216,
    iconClassName: 'max-h-[8.15rem] sm:max-h-[8.7rem]',
  },
] as const;

const advisorExperienceCards: AdvisorExperienceCard[] = [
  {
    title: 'Strolleria',
    logoSrc: '/assets/logos/strolleria.png',
    logoAlt: 'Strolleria logo',
    width: 1844,
    height: 457,
    logoClassName: 'max-h-8',
  },
  {
    title: 'Pottery Barn Kids',
    logoSrc: '/assets/brand/potterybarnkids.png',
    logoAlt: 'Pottery Barn Kids logo',
    width: 1101,
    height: 152,
    logoClassName: 'max-h-7',
  },
  {
    title: 'Private Advisor',
    logoSrc: '/assets/brand/tot-squad.png',
    logoAlt: 'Private advisor brand mark',
    width: 1334,
    height: 345,
    logoClassName: 'max-h-8',
  },
  {
    title: 'Target Baby Concierge',
    logoSrc: '/assets/brand/totsquad.png',
    logoAlt: 'Target Baby Concierge powered by Tot Squad logo',
    width: 1065,
    height: 228,
    logoClassName: 'max-h-8',
  },
] as const;

const authorityStripLogos = [
  {
    src: '/assets/logos/strolleria.png',
    alt: 'Strolleria logo',
    width: 1844,
    height: 457,
    className: 'max-h-6',
  },
  {
    src: '/assets/brand/potterybarnkids.png',
    alt: 'Pottery Barn Kids logo',
    width: 1101,
    height: 152,
    className: 'max-h-5',
  },
  {
    src: '/assets/brand/totsquad.png',
    alt: 'Target Baby Concierge powered by Tot Squad logo',
    width: 1065,
    height: 228,
    className: 'max-h-6',
  },
] as const;

const preparationPartners: PreparationPartner[] = [
  {
    name: 'AZ Childproofers',
    logoSrc: '/assets/logos/azchildproof.png',
    logoAlt: 'AZ Childproofers logo',
    width: 201,
    height: 201,
    logoClassName: 'max-h-12',
  },
  {
    name: 'Lani Car Seats',
    logoSrc: '/assets/logos/lanicarseat.png',
    logoAlt: 'Lani Car Seats logo',
    width: 490,
    height: 490,
    logoClassName: 'max-h-12',
  },
  {
    name: 'Albee Baby',
    logoSrc: '/assets/brand/albeebaby.png',
    logoAlt: 'Albee Baby logo',
    width: 574,
    height: 108,
    logoClassName: 'max-h-8',
  },
] as const;

function TimelineStepCard({ stepLabel, title, description, emphasis, bullets }: TimelineStep) {
  return (
    <MarketingSurface className="h-full rounded-[1.9rem] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)]">
      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{stepLabel}</p>
      <h3 className="mt-4 font-serif text-[1.6rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
        {title}
      </h3>
      <p className="mt-4 max-w-none text-[0.98rem] leading-8 text-neutral-700">{description}</p>
      {emphasis ? (
        <p className="mt-4 max-w-none font-medium leading-8 text-neutral-800">{emphasis}</p>
      ) : null}
      {bullets?.length ? (
        <ul className="mt-5 space-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
              />
              <span className="max-w-none text-[0.95rem] leading-7 text-neutral-700">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </MarketingSurface>
  );
}

function AdvisorFocusCard({
  item,
  delayMs = 0,
}: {
  item: (typeof advisorFocusAreas)[number];
  delayMs?: number;
}) {
  return (
    <RevealOnScroll delayMs={delayMs}>
      <div className="sort-grid-card flex h-full flex-col rounded-[1.35rem] border border-[rgba(174,132,145,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(250,242,239,0.98)_100%)] px-4 py-4 text-center shadow-[0_16px_34px_rgba(57,39,45,0.06),inset_0_1px_0_rgba(255,255,255,0.82)]">
        <div className="mx-auto flex min-h-[10.5rem] w-full items-center justify-center rounded-[1.05rem] border border-[rgba(196,156,94,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,239,234,0.88)_100%)] sm:min-h-[11rem]">
          <EditorialIllustration
            src={item.iconSrc}
            alt={item.iconAlt}
            sizes="(min-width: 1280px) 12rem, 34vw"
            decorative
            scale="card"
            className="mx-auto"
            loading="lazy"
          />
        </div>
        <p className="mx-auto mt-4 max-w-[12rem] bg-transparent text-[1.02rem] font-semibold leading-[1.35] text-[#2E2529] selection:bg-transparent selection:text-[#2E2529]">
          {item.title}
        </p>
        <div className="mt-auto flex justify-center pt-4">
          <div className="inline-flex rounded-full border border-[rgba(215,161,175,0.18)] bg-white/92 px-2.5 py-2 shadow-[0_8px_18px_rgba(58,36,43,0.06)]">
            <CheckIcon frameClassName="mt-0" />
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}

function AdvisorExperienceCard({ card, delayMs = 0 }: { card: AdvisorExperienceCard; delayMs?: number }) {
  return (
    <RevealOnScroll delayMs={delayMs}>
      <div className="flex h-full min-h-[8.5rem] flex-col items-center justify-center rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] p-4 text-center shadow-[0_10px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.75)] sm:min-h-[9rem] sm:p-5">
        <div className="flex min-h-[2.5rem] items-center justify-center">
          {card.logoSrc && card.logoAlt && card.width && card.height ? (
            <Image
              src={card.logoSrc}
              alt={card.logoAlt}
              width={card.width}
              height={card.height}
              sizes="(min-width: 1024px) 10rem, 42vw"
              className={['h-auto w-auto object-contain opacity-[0.94]', card.logoClassName ?? 'max-h-8'].join(' ')}
              loading="lazy"
            />
          ) : (
            <span className={card.wordmarkClassName ?? 'font-serif text-[1.4rem] tracking-[-0.04em] text-neutral-900'}>
              {card.wordmark}
            </span>
          )}
        </div>

        <p className="mt-4 text-[0.74rem] uppercase tracking-[0.2em] text-black/48">{card.title}</p>
      </div>
    </RevealOnScroll>
  );
}

function PreparationPartnerCard({ partner }: { partner: PreparationPartner }) {
  return (
    <MarketingSurface className="flex h-full min-h-[13rem] flex-col items-center justify-center rounded-[1.9rem] bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)] text-center">
      <div className="flex h-16 items-center justify-center">
        <Image
          src={partner.logoSrc}
          alt={partner.logoAlt}
          width={partner.width}
          height={partner.height}
          sizes="(min-width: 1024px) 12rem, 40vw"
          className={['h-auto w-auto object-contain', partner.logoClassName].join(' ')}
          loading="lazy"
        />
      </div>
      <p className="mt-6 text-[0.72rem] uppercase tracking-[0.2em] text-black/55">{partner.name}</p>
    </MarketingSurface>
  );
}

export default async function HomePage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <PageViewTracker path="/" pageType="homepage" />

        <Hero
          className="homepage-hero"
          title="Private Baby Planning & Registry Guidance for Growing Families"
          subtitle="Expert baby gear guidance to help you choose thoughtfully, prepare your home, and start parenthood with confidence."
          primaryCta={{ label: 'Schedule a Consultation', href: '/contact' }}
          secondaryCta={{ label: 'Start with Learning', href: '/learn' }}
          tagline="Strollers | Car Seats | Registry | Nursery Setup"
          image="/assets/hero/hero-01.jpg"
          imageAlt="Curated baby gear arranged for planning and comparison"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <StartHereSection />

        <RegistryEcosystemMap />

        <HomeAuthorityStrip
          text="Real-world experience from Strolleria, Pottery Barn Kids, and Target Baby Concierge."
          logos={authorityStripLogos}
        />

        <section className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-12 xl:gap-16">
              <div className="space-y-7 lg:pr-4">
                <RevealOnScroll>
                  <div className="relative z-[1] max-w-[40rem]">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Advisor Profile</p>
                    <h2 className="mt-4 font-serif text-[2.4rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                      Meet Your Baby Gear Advisor
                    </h2>
                    <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                      I have spent years helping families sort strollers, car seats, registries, and nursery decisions
                      in real life, not just in theory. I know how fast baby gear can go from exciting to weirdly
                      overwhelming.
                    </p>
                    <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                      My approach is calm, practical, and built around what actually fits your home, your routines, and
                      your budget. Your registry does not need to impress the internet. It just needs to work when life
                      gets real.
                    </p>
                  </div>
                </RevealOnScroll>

                <div className="max-w-[40rem]">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Experience includes</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {advisorExperienceCards.map((card, index) => (
                      <AdvisorExperienceCard
                        key={card.logoSrc ?? card.wordmark ?? card.title}
                        card={card}
                        delayMs={90 + index * 50}
                      />
                    ))}
                  </div>
                </div>

                <RevealOnScroll delayMs={120}>
                  <div className="relative z-[1] flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                    <Link
                      href="/about"
                      className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75 sm:justify-start"
                    >
                      Meet Taylor
                      <span aria-hidden className="ml-2">
                        →
                      </span>
                    </Link>
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll delayMs={140}>
                <div className="rounded-[1.8rem] border border-[rgba(174,132,145,0.2)] bg-[linear-gradient(180deg,#ffffff_0%,#f9f1ec_100%)] p-6 shadow-[0_20px_48px_rgba(48,31,37,0.07)] sm:p-7">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#7A626C]">
                    What Taylor helps you sort
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {advisorFocusAreas.map((item, index) => (
                      <AdvisorFocusCard key={item.title} item={item} delayMs={index * 60} />
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <HomeTransitionSection
          eyebrow="Why this exists"
          title="Most parents don't need more options. They need clarity."
          body="That's what this is designed to provide."
          secondaryLine="A calmer point of view, a shorter path through the noise, and help that still feels practical when life gets busy."
          tone="linen"
          cta={{ href: '/guides/strollers', label: 'Explore real product guidance' }}
        />

        <div className="relative z-10 h-0 overflow-visible">
          <div className="pointer-events-none absolute left-1/2 top-0 z-20 w-screen -translate-x-1/2 -translate-y-1/2">
            <RibbonDivider />
          </div>
        </div>

        <HomeServicesSection />

        <HomeTransitionSection
          eyebrow="What this solves"
          title="Instead of guessing, overbuying, or second-guessing every decision..."
          body="This gives you a clear path forward."
          secondaryLine="Not louder advice. Just a better sequence for figuring out what actually fits your life."
          tone="ivory"
          cta={{ href: '/guides', label: 'Not sure where to begin? Start here' }}
        />

        <HomeEditorialBreak
          imageSrc="/assets/editorial/registry.jpg"
          imageAlt="Registry planning notebook and checklist on a linen table."
          tone="linen"
          eyebrow="Registry perspective"
          title="The list works better when life comes first."
          description="A good registry is not a trophy. It is a plan for what will actually help once baby is here."
        />

        <EcosystemFlow
          id="journey"
          title="The Taylor-Made Method"
          description="A calmer baby-prep process starts with education, moves into planning, and ends with purchases that actually make sense for your life."
          steps={journeySteps}
          cta={{ href: '/guides', label: 'Start with the Guides' }}
        />

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative isolate">
              <div className="relative z-10">
                <SectionIntro
                  align="left"
                  spacing="tight"
                  title="Why this helps"
                  description="Most parents are told to just start a registry. But thoughtful preparation means understanding when to register, where to register, and how to take advantage of the perks most families do not know exist."
                  contentWidthClassName="max-w-4xl"
                  titleClassName="max-w-[12ch]"
                  descriptionClassName="max-w-[44rem]"
                />
              </div>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {timelineSteps.map((step, index) => (
                <RevealOnScroll key={step.stepLabel} delayMs={index * 70}>
                  <TimelineStepCard {...step} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              spacing="tight"
              title="Trusted Preparation Partners"
              description="Taylor-Made Baby works alongside trusted specialists to help families prepare safely and confidently."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {preparationPartners.map((partner, index) => (
                <RevealOnScroll key={partner.name} delayMs={index * 70}>
                  <PreparationPartnerCard partner={partner} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fbf7f3_0%,#f2e9e1_100%)] py-28">
          <div className="pointer-events-none absolute inset-x-0 top-8 h-40 bg-[radial-gradient(circle_at_center,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_72%)] blur-3xl" />
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-[2.35rem] border border-[rgba(215,161,175,0.24)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.96)_48%,rgba(249,243,238,0.98)_100%)] shadow-[0_28px_72px_rgba(65,46,53,0.08)]">
              <div className="pointer-events-none absolute right-[-4rem] top-[-3rem] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_72%)]" />
              <div className="pointer-events-none absolute left-[-3rem] bottom-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(196,156,94,0.12)_0%,rgba(196,156,94,0)_72%)]" />
              <RevealOnScroll>
                <div className="relative grid gap-8 px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                  <div className="max-w-3xl">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                      Guides
                    </p>
                    <h3 className="mt-4 max-w-[14ch] font-serif text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
                      Start with the Guides.
                    </h3>
                    <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-8 text-neutral-700">
                      If you are not ready to book anything yet, this is the best place to begin.
                    </p>
                    <p className="mt-4 max-w-[42rem] text-[1.02rem] leading-8 text-neutral-700">
                      TMBC Guides walk you through strollers, car seats, registry planning, and nursery decisions in a calmer order, so you can understand what matters before you buy anything.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {['Strollers', 'Car Seats', 'Registry Planning', 'Nursery'].map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-white/78 px-4 py-2 text-sm text-charcoal shadow-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <Link href="/guides" className="btn btn--primary mt-8">
                      Explore the Guides
                    </Link>
                  </div>

                  <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.2)] bg-white/88 p-5 shadow-[0_16px_36px_rgba(65,46,53,0.06)]">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                      Best place to begin
                    </p>
                    <p className="mt-4 font-serif text-[1.55rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
                      Start with your question, not the product list.
                    </p>
                    <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-700">
                      <p>Use the hub when you want calmer answers before you commit to anything.</p>
                      <p>Pick the category that feels the most immediate and let the rest narrow from there.</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <HomeEditorialBreak
          imageSrc="/assets/editorial/toys-rainbow.png"
          imageAlt="Soft editorial still life with baby toys and a rainbow motif."
          tone="blush"
          eyebrow="A calmer next step"
          title="You do not have to figure it all out today."
          description="Some of the best decisions happen after the panic leaves the room."
        />

        <HomeTransitionSection
          eyebrow="A calmer next step"
          title="Most families come to me feeling unsure where to start."
          body="This is where we make it simple."
          secondaryLine="We'll figure out what actually fits your life."
          tone="blush"
          titleClassName="max-w-[22ch]"
        />

        <ConsultationRequestSection
          errorCode={params?.error ?? null}
          returnPath="/#request-a-consult"
          successPath="/consultation/confirmation"
          submitLabel="Request a Consultation"
        />
      </main>
    </SiteShell>
  );
}
