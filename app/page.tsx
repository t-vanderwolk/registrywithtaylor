import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import RibbonDivider from '@/components/layout/RibbonDivider';
import SiteShell from '@/components/SiteShell';
import HomeServicesSection from '@/components/home/HomeServicesSection';
import BlogPreview from '@/components/marketing/BlogPreview';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import CheckIcon from '@/components/ui/CheckIcon';
import EditorialIllustration from '@/components/ui/EditorialIllustration';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionIntro from '@/components/ui/SectionIntro';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { isTransientPrismaConnectionError } from '@/lib/server/prismaConnection';
import prisma from '@/lib/server/prisma';

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

type InsightPreview = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  featuredImageUrl: string | null;
  coverImage: string | null;
  featuredImage: {
    url: string;
  } | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
  readingTime: number | null;
};

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

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toInsightExcerpt = (excerpt: string | null, content: string, maxLength = 170) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const clean = stripMarkdown(content);
  if (!clean) {
    return '';
  }

  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

const formatInsightDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

async function loadHomepageInsightPreviews(now: Date) {
  try {
    return (await prisma.post.findMany({
      where: getPublicPostWhere(now),
      orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        content: true,
        readingTime: true,
        featuredImageUrl: true,
        coverImage: true,
        featuredImage: {
          select: {
            url: true,
          },
        },
        publishedAt: true,
        scheduledFor: true,
        createdAt: true,
      },
    })) as InsightPreview[];
  } catch (error) {
    if (!isTransientPrismaConnectionError(error)) {
      throw error;
    }

    console.error('Homepage journal preview unavailable because the database could not be reached.', error);
    return [];
  }
}

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
      <div className="sort-grid-card flex h-full flex-col rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] text-center shadow-[0_10px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.78)]">
        <div className="mx-auto flex min-h-[10.5rem] w-full items-center justify-center sm:min-h-[11rem]">
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
        <p className="mx-auto max-w-[12rem] bg-transparent text-[0.98rem] font-medium leading-[1.35] text-neutral-800 selection:bg-transparent selection:text-neutral-800">
          {item.title}
        </p>
        <div className="mt-auto flex justify-center pt-4">
          <CheckIcon frameClassName="mt-0" />
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
  const now = new Date();
  const insightPreviews = await loadHomepageInsightPreviews(now);

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
                <div className="rounded-[1.8rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)] sm:p-7">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">
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

        <section className="bg-white pt-4 pb-28 md:pt-6 lg:pt-8">
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              spacing="tight"
              title="Trusted Preparation Partners"
              description="Taylor-Made Baby works alongside trusted specialists to help families prepare safely and confidently."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {preparationPartners.map((partner) => (
                <PreparationPartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="journey"
          className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-24 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              spacing="tight"
              title="The Taylor-Made Method"
              description="A calmer baby-prep process starts with education, moves into planning, and ends with purchases that actually make sense for your life."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {journeySteps.map((step) => (
                <MarketingSurface
                  key={step.stepLabel}
                  className="h-full rounded-[1.9rem] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)]"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                    {step.stepLabel}
                  </p>
                  <h3 className="mt-4 font-serif text-[1.65rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-none text-[0.98rem] leading-8 text-neutral-700">{step.description}</p>
                </MarketingSurface>
              ))}
            </div>
          </div>
        </section>

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
              {timelineSteps.map((step) => (
                <TimelineStepCard key={step.stepLabel} {...step} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] shadow-[0_22px_55px_rgba(0,0,0,0.06)]">
              <RevealOnScroll>
                <div className="px-6 py-8 sm:px-8 md:py-10">
                  <div className="max-w-3xl">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                      Learning Hub
                    </p>
                    <h3 className="mt-4 font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 sm:text-[2.35rem]">
                      Start with learning.
                    </h3>
                    <p className="mt-5 max-w-none text-[1rem] leading-8 text-neutral-700">
                      Every confident registry begins with understanding the options.
                    </p>
                    <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                      The Taylor-Made Baby Learning Hub helps families explore baby gear categories, nursery planning,
                      and postpartum preparation before making purchasing decisions.
                    </p>
                    <Link href="/learn" className="btn btn--primary mt-8">
                      Enter the Learning Hub
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <HomeServicesSection />

        <section
          id="request-a-consult"
          className="relative z-10 overflow-visible bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] pt-28 pb-8 md:pb-10"
        >
          <div className="relative z-20 mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(20rem,1fr)] lg:items-start lg:gap-12 xl:gap-16">
              <RevealOnScroll>
                <div className="max-w-[36rem]">
                  <div className="relative z-10">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">
                      Request a Consultation
                    </p>
                    <h2 className="mt-4 font-serif text-[2.3rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                      Start with confidence.
                    </h2>
                    <p className="mt-5 max-w-none text-[1rem] leading-8 text-neutral-700">
                      If you want expert eyes on your registry, stroller shortlist, car seat plan, or nursery setup,
                      start here.
                    </p>
                    <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                      Submit a short request and Taylor will follow up directly. The first conversation is meant to bring
                      clarity, not more tabs to compare.
                    </p>

                    <div className="mt-8 space-y-4 text-sm leading-7 text-neutral-700">
                      <p>Complimentary first conversation</p>
                      <p>Available virtually or in person</p>
                      <p>Built for real homes, real routines, and the decisions that actually matter</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={120}>
                <MarketingSurface className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] p-6 shadow-[0_24px_58px_rgba(55,40,46,0.06)] sm:p-8">
                  <div className="absolute inset-x-[12%] top-[-8%] h-24 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-2xl" />

                  <div className="relative">
                    <ConsultationRequestForm
                      errorCode={params?.error ?? null}
                      returnPath="/#request-a-consult"
                      successPath="/consultation/confirmation"
                      submitLabel="Request a Consultation"
                    />

                    <p className="mt-6 text-center text-sm text-neutral-600">
                      Prefer to review the full page first?{' '}
                      <Link href="/consultation" className="link-underline">
                        View consultation details
                      </Link>
                    </p>
                  </div>
                </MarketingSurface>
              </RevealOnScroll>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-[-2.9rem] z-10 w-full overflow-hidden md:bottom-[-3.6rem]">
            <RibbonDivider
              className="mx-auto w-full max-w-none"
              showGlow={false}
              imageClassName="h-[5rem] w-full object-cover object-center md:h-[6rem] lg:h-[6.5rem] drop-shadow-none"
            />
          </div>
        </section>

        <BlogPreview
          className="homepage-post-bow-section"
          eyebrow=""
          title="From the Journal"
          description="A few recent notes on baby gear, registry strategy, and practical preparation."
          linkLabel="Visit the Journal"
          linkHref="/journal"
          emptyMessage="Fresh journal posts will appear here as TMBC continues building the editorial library."
          posts={insightPreviews.slice(0, 2).map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: normalizeBlogCategory(post.category),
            excerpt: toInsightExcerpt(post.excerpt, post.content),
            coverImage: post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage,
            dateLabel: formatInsightDate(getPostDisplayDate(post)),
            dateTime: getPostDisplayDate(post).toISOString(),
            readingTime: post.readingTime,
          }))}
        />
      </main>
    </SiteShell>
  );
}
