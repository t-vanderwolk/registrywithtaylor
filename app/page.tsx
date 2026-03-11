import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AuthorityStrip from '@/components/ui/AuthorityStrip';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, Eyebrow, H1, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import QuoteMark from '@/components/ui/QuoteMark';
import SectionIntro from '@/components/ui/SectionIntro';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import SiteShell from '@/components/SiteShell';
import JournalCard from '@/components/blog/JournalCard';
import PlanningPackageCards from '@/components/services/PlanningPackageCards';
import AddonServiceShowcase from '@/components/services/AddonServiceShowcase';
import type { AddonServiceCardData } from '@/components/services/AddonServiceCard';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Co. | Baby Gear & Registry Guidance',
  description:
    'Consultation-first baby planning guidance for registries, gear, nursery setup, and home preparation.',
  path: '/',
  imagePath: '/og-home.jpg',
  imageAlt: 'Taylor-Made Baby Co. - Baby gear and registry guidance.',
});

type InsightPreview = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  featured: boolean;
  featuredImageUrl: string | null;
  coverImage: string | null;
  featuredImage: {
    url: string;
  } | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
};

type TrustMoment = {
  iconSrc: string;
  title: string;
  description: string;
};

type ProcessPreviewStep = {
  step: string;
  title: string;
  description: string;
  iconSrc: string;
};

type MethodCard = {
  step: string;
  title: string;
  description: string;
};

const heroServiceChips = [
  'Registry Strategy',
  'Gear Planning',
  'Nursery & Home Prep',
  'Consultation-First Support',
];

const trustMoments: TrustMoment[] = [
  {
    iconSrc: '/assets/icons/buildregistry.png',
    title: 'Premium retail expertise',
    description: 'Hands-on experience with the baby gear categories families compare most.',
  },
  {
    iconSrc: '/assets/icons/cpst.png',
    title: 'Partner-backed safety support',
    description: 'Trusted guidance for car seat strategy, installation, and home readiness.',
  },
  {
    iconSrc: '/assets/icons/private.png',
    title: 'Warm concierge guidance',
    description: 'Calmer recommendations, thoughtful follow-up, and clear next steps.',
  },
];

const problemDrivers = [
  {
    title: 'Too many products',
    description: 'The list gets long before you know what your daily routine really needs.',
  },
  {
    title: 'Too many opinions',
    description: 'Advice from social media, friends, and stores rarely accounts for your real home.',
  },
  {
    title: 'Too little context',
    description: 'The details that matter most only become clear when they are fitted to your life.',
  },
];

const adviceChecklistItems = [
  'You want guidance without pressure or trend chasing.',
  'You want to know what to buy now, what to skip, and what can wait.',
  'You want your registry and gear choices matched to your space, budget, and routine.',
  'You want a calmer plan before the decisions start multiplying.',
];

const processPreviewSteps: ProcessPreviewStep[] = [
  {
    step: '01',
    title: 'Start with a consultation',
    description:
      'Bring the questions that feel most urgent right now, from registry categories to stroller and car seat comparisons.',
    iconSrc: '/assets/icons/virtual.png',
  },
  {
    step: '02',
    title: 'Choose your level of support',
    description:
      'Decide whether you need one focused session, a signature planning package, or ongoing concierge guidance.',
    iconSrc: '/assets/icons/private.png',
  },
  {
    step: '03',
    title: 'Build your plan with confidence',
    description:
      'Leave with a clearer registry, smarter purchase timing, and next steps tailored to daily life.',
    iconSrc: '/assets/icons/blueprint.png',
  },
];

const methodCards: MethodCard[] = [
  {
    step: '01',
    title: 'Filter the noise first',
    description:
      'We focus on the categories that shape daily life fastest so the planning process feels immediately lighter.',
  },
  {
    step: '02',
    title: 'Fit every recommendation to real life',
    description:
      'Suggestions are shaped around your space, routines, budget, travel needs, and comfort level with the options.',
  },
  {
    step: '03',
    title: 'Turn decisions into a plan',
    description:
      'You leave knowing what deserves attention now, what to compare in person, and what can wait until later.',
  },
];

const servicePillars: AddonServiceCardData[] = [
  {
    title: 'Intentional Gear Planning',
    iconSrc: '/assets/icons/gear-plan.png',
    description:
      'Compare the daily-use gear that matters most around your routine, storage, and long-term fit.',
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Compare daily-use, compact, and travel-friendly options',
      'Sort what fits your routine, storage, and terrain',
      'Choose a stroller strategy that works now and later',
    ],
  },
  {
    title: 'CPST Car Seat Installation & Safety Checks',
    iconSrc: '/assets/icons/cpst.png',
    description:
      'Car seat guidance built around installation, compatibility, and how the setup works in real life.',
    partnerLabel: 'In partnership with',
    partnerLogoSrc: '/assets/logos/lanicarseat.png',
    partnerLogoAlt: 'Lani Car Seat Consulting',
    partnerBadgeLines: ['Lani', 'Car Seat'],
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Figure out infant seat versus convertible strategy',
      'Compare compatibility, installation, and daily ease',
      'Narrow down what makes sense for your car and routine',
    ],
  },
  {
    title: 'Home & Nursery Preparation',
    iconSrc: '/assets/icons/nursery.png',
    description:
      'Shape the nursery, storage, and room flow so the space feels calm, functional, and ready to use.',
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Plan room flow for sleep, feeding, diapering, and storage',
      'Make the space feel functional instead of crowded',
      'Set up the nursery around real daily use',
    ],
  },
  {
    title: 'In-Home Baby & Toddler Proofing Installation',
    iconSrc: '/assets/icons/babyproof.png',
    description:
      'Prioritize the safety updates that matter first before little ones begin rolling, crawling, and climbing.',
    partnerLabel: 'In partnership with',
    partnerLogoSrc: '/assets/logos/azchildproof.png',
    partnerLogoAlt: 'Arizona Childproofers',
    partnerBadgeLines: ['Arizona', 'Child', 'Proofers'],
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Map what needs attention before baby arrives',
      'Prioritize safety updates by stage and by space',
      'Focus on what matters first instead of overdoing it',
    ],
  },
  {
    title: 'Intentional Purchasing Timeline',
    iconSrc: '/assets/icons/calender.png',
    description:
      'Build a smarter buying roadmap around timing, discounts, and what actually needs to happen now.',
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Build a buying roadmap around your actual timeline',
      'Plan what to purchase now, later, and during sales',
      'Use rewards, discounts, and completion perks more intentionally',
    ],
  },
  {
    title: 'Surrogacy & Adoption Planning Support',
    iconSrc: '/assets/icons/surrogacy.png',
    description:
      'Tailor registry and home-prep decisions around your timeline, travel logistics, and transition home.',
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Shape prep around your family’s timeline and transition home',
      'Align registry and gear decisions with travel and logistics',
      'Create a newborn setup plan that feels clear and workable',
    ],
  },
  {
    title: 'Virtual Parent Community Sessions',
    iconSrc: '/assets/icons/virtual.png',
    description:
      'Join live monthly sessions for practical baby-prep questions, calmer decisions, and shared perspective.',
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Join live monthly sessions from anywhere',
      'Ask questions about baby gear, registries, and preparation',
      'Learn in a supportive setting with other families',
    ],
  },
  {
    title: 'Baby Shower Support',
    iconSrc: '/assets/icons/giftbox.png',
    description:
      'Refine the registry and gifting plan before invitations go out so the list stays useful and intentional.',
    accordionVariant: 'stacked',
    cardVariant: 'pillar',
    features: [
      'Refine the registry before invitations go out',
      'Prioritize the items that matter most for gifting',
      'Keep the list useful, organized, and aligned with real needs',
    ],
  },
];

const featuredServicePillars: AddonServiceCardData[] = [
  { ...servicePillars[0], label: 'Registry & Gear' },
  { ...servicePillars[1], label: 'Safety Support' },
  { ...servicePillars[2], label: 'Nursery & Home' },
  { ...servicePillars[4], label: 'Buying Timeline' },
];

const homepageTestimonials = [
  {
    quote: 'Taylor helped us cut through the noise and make registry decisions that actually fit our life.',
    attribution: 'Maya & Jordan R., Denver, CO · First-Time Parents',
  },
  {
    quote: 'We finally knew what to buy now, what to skip, and what could wait.',
    attribution: 'Nina B., Portland, OR · First-Time Mom',
  },
];

const founderTrustPoints = [
  'Registry, stroller, and car seat guidance translated into plain language',
  'Recommendations grounded in space, routine, budget, and long-term fit',
  'Partner access for installation, safety, and childproofing support when needed',
];

const aboutPartnerLogos = [
  {
    src: '/assets/logos/strolleria.png',
    alt: 'Strolleria',
    widthClassName: 'w-[10.5rem]',
    imageClassName: 'object-contain object-left',
  },
  {
    src: '/assets/logos/potterparn.png',
    alt: 'Pottery Barn Kids',
    widthClassName: 'w-[11.5rem]',
    imageClassName: 'origin-left scale-[1.5] object-contain object-left',
  },
  {
    src: '/assets/brand/totsquad.png',
    alt: 'Tot Squad',
    widthClassName: 'w-[9.75rem]',
    imageClassName: 'object-contain object-left',
  },
] as const;

const formatInsightDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

const toInsightExcerpt = (excerpt: string | null, content: string, maxLength = 150) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const clean = stripMarkdown(content);
  if (!clean) {
    return '';
  }

  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

const estimateReadingTime = (content: string) => {
  const clean = stripMarkdown(content);
  const wordCount = clean ? clean.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 180));
};

function TrustMomentCard({ iconSrc, title, description }: TrustMoment) {
  return (
    <MarketingSurface className="h-full p-6">
      <ServiceIconBadge src={iconSrc} size="default" />
      <H3 className="mt-5 max-w-[11ch] text-[1.28rem] leading-[1.04] md:text-[1.55rem]">{title}</H3>
      <Body className="mt-3 max-w-none text-[0.96rem] leading-7 text-neutral-600">
        {description}
      </Body>
    </MarketingSurface>
  );
}

function ProcessPreviewCard({ step, title, description, iconSrc }: ProcessPreviewStep) {
  return (
    <MarketingSurface className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/80 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
          {step}
        </span>
        <ServiceIconBadge src={iconSrc} size="default" />
      </div>

      <H3 className="mt-8 max-w-[14ch]">{title}</H3>
      <Body className="mt-4 max-w-none text-neutral-600">{description}</Body>
    </MarketingSurface>
  );
}

function MethodCardItem({ step, title, description }: MethodCard) {
  return (
    <MarketingSurface className="flex h-full items-start gap-5 p-6 md:p-8">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/80 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
        {step}
      </span>
      <div className="min-w-0">
        <H3 className="text-[1.4rem] md:text-[1.65rem]">{title}</H3>
        <Body className="mt-3 max-w-none text-neutral-600">{description}</Body>
      </div>
    </MarketingSurface>
  );
}

function TestimonialCard({
  quote,
  attribution,
}: {
  quote: string;
  attribution: string;
}) {
  return (
    <MarketingSurface className="relative overflow-hidden bg-white">
      <div className="relative min-h-[13rem] px-1 pt-2 md:min-h-[14rem]">
        <div className="relative pl-12 pr-3 pt-4 md:pl-16 md:pr-5 md:pt-5">
          <QuoteMark className="absolute left-0 top-0 select-none text-[74px] leading-[0.78] text-[var(--tmbc-rose)]/14 md:text-[88px]" />
          <p className="relative z-[1] max-w-[21ch] font-serif text-[1.78rem] leading-[1.24] tracking-[-0.03em] text-neutral-900 md:text-[2.05rem]">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
      <div className="mt-3 border-t border-black/6 pt-5">
        <p className="max-w-none text-sm leading-6 text-neutral-600">{attribution}</p>
      </div>
    </MarketingSurface>
  );
}

export default async function HomePage() {
  const now = new Date();
  const featuredInsight = (await prisma.post.findFirst({
    where: {
      status: 'PUBLISHED',
      featured: true,
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      featured: true,
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
  })) as InsightPreview | null;

  const insightCandidates = (await prisma.post.findMany({
    where: getPublicPostWhere(now),
    orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      featured: true,
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

  const insightPreviews = [featuredInsight, ...insightCandidates]
    .filter((post): post is InsightPreview => Boolean(post))
    .filter((post, index, collection) => collection.findIndex((entry) => entry.id === post.id) === index)
    .slice(0, 3);

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          className="hero-cta-buffer"
          image="/assets/hero/hero-baby-editorial-v2.jpg"
          imageAlt="Baby essentials arranged in a calm editorial nursery scene"
          sectionStyle={{
            minHeight: 'clamp(45rem, 86vh, 60rem)',
          }}
          innerStyle={{
            paddingTop: 'clamp(7rem, 14vh, 11rem)',
            paddingBottom: 'clamp(5.5rem, 9vw, 8rem)',
          }}
          overlayStyle={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 34%, rgba(255,255,255,0.22) 60%, rgba(255,255,255,0.04) 100%), linear-gradient(to bottom, rgba(255,255,255,0.04) 58%, #f6f1ec 100%)',
          }}
          ribbonClassName="translate-y-8 scale-y-[0.84] origin-bottom md:translate-y-10"
        >
          <div className="space-y-6">
            <Eyebrow className="hero-load-reveal">Taylor-Made Baby Co.</Eyebrow>

            <H1 className="marketing-hero-headline hero-load-reveal hero-load-reveal--1 max-w-[13ch] text-[44px] leading-[0.92] tracking-[-0.055em] md:text-[52px] lg:text-[64px]">
              Baby planning guidance that makes the next decisions feel clear.
            </H1>

            <Body className="hero-load-reveal hero-load-reveal--2 max-w-[36rem] text-neutral-700">
              Taylor-Made Baby Co. helps growing families sort registry strategy, gear choices, nursery flow, and home
              preparation with expert guidance grounded in real life.
            </Body>

            <AuthorityStrip
              items={heroServiceChips}
              className="hero-load-reveal hero-load-reveal--3 max-w-[42rem] justify-start text-left"
              itemClassName="border-white/55 bg-white/24 text-charcoal shadow-[0_12px_24px_rgba(43,38,40,0.08)] backdrop-blur-md"
            />

            <div className="hero-load-reveal hero-load-reveal--4 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/consultation"
                className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Request Consultation
              </Link>

              <Link
                href="/services"
                className="btn btn--secondary w-full bg-white/75 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore Services
              </Link>
            </div>

            <p className="hero-load-reveal hero-load-reveal--5 text-[0.72rem] uppercase tracking-[0.22em] text-charcoal/60">
              Complimentary consultation · Thoughtful guidance · Clear next steps
            </p>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="tight" className="border-b border-black/[0.04]">
          <RevealOnScroll>
            <div className="relative rounded-[2rem] border border-rose-100 bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f6_100%)] px-6 py-8 shadow-[0_18px_46px_rgba(0,0,0,0.05)] md:-mt-10 md:px-10 md:py-10">
              <SectionIntro
                align="left"
                eyebrow="You're in capable hands"
                title="Trusted support for the details families second-guess most."
                description="Taylor brings hands-on product knowledge, concierge-level planning, and partner-backed safety expertise to the decisions that tend to feel the most overwhelming."
                contentWidthClassName="max-w-3xl"
                titleClassName="max-w-[17ch]"
                descriptionClassName="max-w-[44rem]"
              />

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {trustMoments.map((item) => (
                  <TrustMomentCard key={item.title} {...item} />
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" className="bg-[#faf7f6]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16">
            <RevealOnScroll>
              <div>
                <SectionIntro
                  align="left"
                  eyebrow="The problem"
                  title="The registry is not the hard part. Making confident decisions is."
                  description="Families today are sorting thousands of products, conflicting opinions, and endless checklists before they have a plan for what actually fits."
                  contentWidthClassName="max-w-2xl"
                />

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {problemDrivers.map((item) => (
                    <MarketingSurface key={item.title} className="p-5">
                      <p className="max-w-none text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/74">
                        {item.title}
                      </p>
                      <p className="mt-3 max-w-none text-sm leading-6 text-neutral-600">{item.description}</p>
                    </MarketingSurface>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <MarketingSurface className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf8f7_100%)]">
                <Eyebrow>This is for you if</Eyebrow>

                <div className="mt-6 space-y-4">
                  {adviceChecklistItems.map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <CheckIcon />
                      <Body className="max-w-none text-neutral-700">{item}</Body>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-black/6 pt-6">
                  <p className="max-w-none font-serif text-[1.55rem] leading-[1.22] tracking-[-0.03em] text-neutral-900">
                    The goal is not more input. It is a calmer plan for what matters first.
                  </p>
                </div>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default">
          <RevealOnScroll>
            <SectionIntro
              eyebrow="How it works"
              title="A clear path from the first conversation to a more confident plan."
              description="The homepage version is simple: start with consultation, choose the support that fits, and move forward with clarity."
            />
          </RevealOnScroll>

          <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-3">
            {processPreviewSteps.map((step, index) => (
              <RevealOnScroll key={step.title} delayMs={index * 80}>
                <ProcessPreviewCard {...step} />
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delayMs={120}>
            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <Link
                href="/how-it-works"
                className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View How It Works
              </Link>
              <p className="max-w-none text-sm text-neutral-600">
                Every support path begins with a complimentary consultation.
              </p>
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" className="bg-[#faf7f6]">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <RevealOnScroll>
              <SectionIntro
                align="left"
                eyebrow="Services preview"
                title="Curated support for registries, gear, safety, and home prep."
                description="Get focused help for one category or build support around the full baby-prep picture. The homepage preview keeps it to the services families ask for most."
                contentWidthClassName="max-w-2xl"
              />
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <Link
                href="/services"
                className="btn btn--secondary w-full md:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore Services
              </Link>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delayMs={110}>
            <div className="mt-8 md:mt-10">
              <AddonServiceShowcase services={featuredServicePillars} gridClassName="xl:grid-cols-4" equalHeight />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={140}>
            <p className="mt-6 max-w-none text-sm text-neutral-600">
              Additional support is available for adoption, surrogacy, community sessions, baby shower preparation, and
              more.
            </p>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="blush" spacing="default" className="bg-rose-50">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
            <RevealOnScroll>
              <div className="max-w-xl">
                <SectionIntro
                  align="left"
                  eyebrow="The Taylor-Made Method"
                  title="Not louder. Just more useful."
                  description="Taylor's approach is built to bring discernment to the categories families usually feel pressured to rush."
                  contentWidthClassName="max-w-xl"
                />

                <div className="relative mt-8 overflow-hidden rounded-[1.7rem] border border-rose-100 bg-white/92 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)] md:p-8">
                  <QuoteMark className="absolute left-5 top-4 select-none text-[70px] leading-none text-[var(--tmbc-rose)]/14 md:text-[82px]" />
                  <div className="relative pl-10">
                    <p className="max-w-none font-serif text-[1.7rem] leading-[1.16] tracking-[-0.03em] text-neutral-900 md:text-[2rem]">
                      The goal is not to hand you a longer list. It is to help you know what fits.
                    </p>
                    <Body className="mt-4 max-w-none text-neutral-600">
                      Recommendations are designed to reduce pressure, respect your real life, and keep the planning
                      process grounded in what will actually be useful once baby is here.
                    </Body>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <div className="space-y-5">
              {methodCards.map((item, index) => (
                <RevealOnScroll key={item.title} delayMs={index * 90}>
                  <MethodCardItem {...item} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default">
          <RevealOnScroll>
            <SectionIntro
              eyebrow="Support levels"
              title="Choose the level of planning support that fits."
              description={
                <>
                  Every package begins with a complimentary consultation, then moves into the level of guidance that
                  makes sense for your family.
                </>
              }
            />
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <PlanningPackageCards className="mt-8 md:mt-10" />
          </RevealOnScroll>

          <RevealOnScroll delayMs={130}>
            <p className="mt-8 max-w-none text-center text-sm text-neutral-600">
              Not sure which level fits best?{' '}
              <Link href="/consultation" className="link-underline">
                Start with a consultation
              </Link>
              .
            </p>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" className="bg-[#faf7f6]">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <RevealOnScroll>
              <SectionIntro
                align="left"
                eyebrow="From the Journal"
                title="Educational guidance that reinforces expertise between consultations."
                description="Featured articles keep the brand grounded in practical education around baby gear, registry planning, and home preparation."
                contentWidthClassName="max-w-2xl"
              />
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <Link
                href="/blog"
                className="btn btn--secondary w-full md:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Browse the Journal
              </Link>
            </RevealOnScroll>
          </div>

          <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3">
            {insightPreviews.length > 0 ? (
              insightPreviews.map((post, index) => (
                <RevealOnScroll key={post.id} delayMs={index * 80}>
                  <JournalCard
                    className="h-full"
                    title={post.title}
                    slug={post.slug}
                    category={post.category}
                    coverImage={post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage}
                    excerpt={toInsightExcerpt(post.excerpt, post.content, 170)}
                    dateLabel={formatInsightDate(getPostDisplayDate(post))}
                    dateTime={getPostDisplayDate(post).toISOString()}
                    readingTime={estimateReadingTime(post.content)}
                  />
                </RevealOnScroll>
              ))
            ) : (
              <p className="max-w-none text-[var(--color-muted)]">No guides published yet.</p>
            )}
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start lg:gap-14">
            <div>
              <RevealOnScroll>
                <SectionIntro
                  align="left"
                  eyebrow="From families"
                  title="What families say once the process starts feeling clear."
                  description="The outcome is calmer decision-making, clearer priorities, and far less second-guessing."
                  contentWidthClassName="max-w-2xl"
                />
              </RevealOnScroll>

              <div className="mt-8 grid gap-6 md:mt-10">
                {homepageTestimonials.map((item, index) => (
                  <RevealOnScroll key={item.attribution} delayMs={index * 90}>
                    <TestimonialCard {...item} />
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <RevealOnScroll delayMs={110}>
              <MarketingSurface className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf8f7_100%)]">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-rose-100 bg-white shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
                    <Image
                      src="/assets/editorial/taylor.png"
                      alt="Taylor Vanderwolk"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <Eyebrow>Meet Taylor</Eyebrow>
                    <H3 className="mt-3 text-[1.55rem] md:text-[1.9rem]">
                      Warm, expert guidance for the early decisions that shape daily life.
                    </H3>
                  </div>
                </div>

                <Body className="mt-6 max-w-none text-neutral-600">
                  Taylor is a baby gear expert and registry consultant with hands-on experience across premium retail
                  floors, national pilot programs, and private family consultations.
                </Body>

                <div className="mt-6 space-y-4">
                  {founderTrustPoints.map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <CheckIcon />
                      <Body className="max-w-none text-neutral-700">{item}</Body>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-black/6 pt-6">
                  <p className="max-w-none text-[0.72rem] uppercase tracking-[0.24em] text-black/45">
                    Experience includes
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-5">
                    {aboutPartnerLogos.map((logo) => (
                      <div key={logo.alt} className={`relative h-10 ${logo.widthClassName}`}>
                        <Image src={logo.src} alt={logo.alt} fill sizes="184px" className={logo.imageClassName} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/about"
                    className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                  >
                    Meet Taylor
                  </Link>
                </div>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <FinalCTA
          eyebrow="Ready when you are"
          title="Request your consultation before the list gets louder."
          description="If you want a clearer plan for your registry, gear, nursery, or home prep, the next step is a complimentary conversation with Taylor."
          ctaLabel="Request Consultation"
          note="Complimentary 45-minute consultation"
          ctaAnalyticsLabel="Homepage Final CTA"
        />
      </main>
    </SiteShell>
  );
}
