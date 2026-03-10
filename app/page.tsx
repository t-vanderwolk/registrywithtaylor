import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AuthorityStrip from '@/components/ui/AuthorityStrip';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import QuoteMark from '@/components/ui/QuoteMark';
import SectionDivider from '@/components/ui/SectionDivider';
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
    'Personalized help with registries, strollers, car seats, nursery planning, and home prep. Expert guidance on what to buy, what to skip, and what can wait.',
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

const authorityItems = [
  'Hands-On Retail Experience',
  'Registry Strategy',
  'Nursery & Home Setup',
];

const adviceChecklistItems = [
  'You want guidance without pressure',
  'You prefer practical decisions over trend-driven lists',
  'You want a registry that reflects your real life',
  'You are trying to figure out what to buy now, what to skip, and what can wait',
  'You want gear decisions grounded in your space, budget, and routine',
];

const methodCards = [
  {
    step: '01',
    title: 'Start with the decisions that matter most',
    description:
      'We begin with the categories that shape everyday life fastest: stroller, car seat, registry priorities, sleep setup, and home flow.',
  },
  {
    step: '02',
    title: 'Build the plan around real life',
    description:
      'Recommendations are shaped around your space, budget, routines, travel needs, and the way your family will actually use the gear.',
  },
  {
    step: '03',
    title: 'Leave with clear next steps',
    description:
      'You know what to buy now, what to compare in person, what to skip, and what can wait until later.',
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

const aboutPartnerLogos = [
  {
    src: '/assets/logos/strolleria.png',
    alt: 'Strolleria',
    widthClassName: 'w-[10.5rem]',
  },
  {
    src: '/assets/logos/potterparn.png',
    alt: 'Pottery Barn Kids',
    widthClassName: 'w-[11.5rem]',
  },
  {
    src: '/assets/brand/totsquad.png',
    alt: 'Tot Squad',
    widthClassName: 'w-[9.75rem]',
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
        <Hero image="/assets/hero/hero-01.jpg" imageAlt="" innerStyle={{ paddingTop: 'clamp(7rem, 14vh, 11rem)' }}>
          <div className="space-y-6">
            <h1 className="marketing-hero-headline hero-load-reveal">
              Baby Planning &amp; Registry Guidance for Growing Families
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Because parenthood should start with confidence, not confusion.
            </Body>

            <p className="hero-load-reveal hero-load-reveal--2 mx-auto max-w-lg text-center text-base leading-relaxed text-black/70 md:text-left md:text-lg">
              Strollers · Car seats · Registry strategy · Nursery &amp; home preparation
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/contact"
                className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Request a Consultation
              </Link>

              <Link
                href="/services"
                className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View Services
              </Link>
            </div>

            <p className="hero-load-reveal hero-load-reveal--4 text-sm uppercase tracking-[0.2em] text-charcoal/60">
              Practical guidance · Clear next steps · No pressure
            </p>
          </div>
        </Hero>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="homepage-section homepage-post-bow-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>

              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-black/45">The Problem</p>

              <H2 className="mt-5 font-serif leading-tight md:text-[3.1rem] md:leading-[1.02]">
                Why Preparing for a Baby Feels Overwhelming
              </H2>

              <Body className="mx-auto mt-6 max-w-3xl text-[1.04rem] leading-relaxed text-neutral-700">
                Parents today face thousands of products, conflicting advice, and endless registry lists. Preparation
                quickly becomes reactive.
              </Body>

              <Body className="mx-auto mt-4 max-w-3xl text-[1.04rem] leading-relaxed text-neutral-700">
                Taylor-Made Baby Co. exists to replace that noise with a thoughtful plan.
              </Body>
            </div>
          </RevealOnScroll>

          <AuthorityStrip items={authorityItems} className="mt-12 md:gap-8" />

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start lg:gap-20">
            <RevealOnScroll>
              <div className="max-w-2xl pr-0 lg:pr-4">
                <SectionDivider />
                <H2 className="font-serif text-neutral-900">There&apos;s a lot of advice out there.</H2>
                <Body className="mt-6 text-neutral-700">
                  Most of it loud. Some of it helpful. Very little of it tailored to your actual home, budget, and
                  routine.
                </Body>
                <Body className="mt-4 text-neutral-700">
                  Between registry lists, social media trends, and well-meaning opinions, it gets very easy to feel
                  like every decision is urgent.
                </Body>
                <Body className="mt-4 text-neutral-700">
                  When everything feels urgent, nothing feels clear. That is where practical baby gear guidance makes a
                  difference.
                </Body>
                <Body className="mt-7 max-w-xl text-neutral-900">
                  The goal is not more input. It is a calmer plan for what matters first.
                </Body>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <MarketingSurface className="h-full bg-[linear-gradient(180deg,#fdf9f6_0%,#f7f1ea_100%)] md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">This is for you if...</p>
                <div className="mt-6 space-y-4">
                  {adviceChecklistItems.map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <CheckIcon />
                      <Body className="text-neutral-700">{item}</Body>
                    </div>
                  ))}
                </div>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section homepage-support-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>
              <H2 className="font-serif text-neutral-900">
                How Taylor-Made Baby Co. Supports Families
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                Support can be focused on one category or stretch across the full baby-prep picture. These are the
                areas families most often want help sorting.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <div className="mt-12">
              <AddonServiceShowcase services={servicePillars} gridClassName="xl:grid-cols-4" equalHeight />
            </div>
          </RevealOnScroll>

          <div className="mt-10 flex justify-center">
            <Link
              href="/services"
              className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              View All Services
            </Link>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section homepage-method-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>
              <H2 className="font-serif text-neutral-900">
                The Taylor-Made Method
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                The goal is not to hand you a longer list. It is to turn a long list of decisions into a plan that
                makes sense for your family.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {methodCards.map((item) => (
                <MarketingSurface key={item.title} className="h-full">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">{item.step}</p>
                  <H3 className="mt-4 font-serif text-neutral-900">
                    {item.title}
                  </H3>
                  <Body className="mt-6 text-neutral-700">
                    {item.description}
                  </Body>
                </MarketingSurface>
              ))}
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="homepage-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>
              <H2 className="font-serif text-neutral-900">
                Choose Your Support
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                Whether you need help with one decision or the full baby-prep picture, there is a clear place to
                start.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <PlanningPackageCards className="mt-12" />
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section homepage-testimonials-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center">
                <SectionDivider />
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.24em] text-black/45">From Families</p>
              <H2 className="mt-4 font-serif text-neutral-900">
                What Families Say
              </H2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <div className="mx-auto mt-12 grid max-w-5xl items-start gap-6 md:grid-cols-2">
              {homepageTestimonials.map((item) => (
                <MarketingSurface
                  key={item.attribution}
                  className="relative self-start overflow-hidden border-black/8 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:p-8"
                >
                  <div className="relative rounded-[1.75rem] border border-white/60 bg-white/55 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:px-6">
                    <div className="relative px-2 py-1 md:px-3">
                      <QuoteMark />
                      <p className="relative text-lg font-serif leading-relaxed text-neutral-900 md:text-[1.35rem] md:leading-[1.38]">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-black/6 pt-4">
                    <p className="text-sm text-neutral-600">{item.attribution}</p>
                  </div>
                </MarketingSurface>
              ))}
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="homepage-section"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <RevealOnScroll>
              <div className="max-w-2xl">
                <SectionDivider />
                <H2 className="font-serif text-neutral-900">
                  About Taylor
                </H2>
                <Body className="mt-6 text-neutral-700">
                  Taylor is a baby gear expert and registry consultant with hands-on experience across premium retail
                  floors, national pilot programs, and private family consultations.
                </Body>
                <Body className="mt-4 text-neutral-700">
                  She helps families sort strollers, car seats, sleep space, feeding gear, nursery flow, travel gear,
                  and the everyday prep questions that do not come with one obvious answer.
                </Body>
                <Body className="mt-4 text-neutral-700">
                  The goal is not to buy more. It is to build a baby setup that works in your actual home and routine.
                </Body>

                <div className="mt-10 space-y-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-black/45">Experience includes</p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                    {aboutPartnerLogos.map((logo) => (
                      <div key={logo.alt} className={`relative h-10 ${logo.widthClassName}`}>
                        <Image src={logo.src} alt={logo.alt} fill sizes="184px" className="object-contain object-left" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/about"
                    className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                  >
                    Meet Taylor <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <MarketingSurface className="h-full bg-[linear-gradient(180deg,#fdf9f6_0%,#f7f1ea_100%)]">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                  Expertise Snapshot
                </p>
                <div className="mt-6 space-y-6">
                  <div>
                    <H3 className="font-serif text-neutral-900">
                      Retail floor expertise
                    </H3>
                    <Body className="mt-3 text-neutral-600">
                      Deep familiarity with the products parents compare most when the options start to feel endless.
                    </Body>
                  </div>

                  <div>
                    <H3 className="font-serif text-neutral-900">
                      Product knowledge that translates
                    </H3>
                    <Body className="mt-3 text-neutral-600">
                      Taylor turns product details into practical answers for registry picks, gear strategy, and home
                      setup.
                    </Body>
                  </div>

                  <div>
                    <H3 className="font-serif text-neutral-900">
                      Real-life decision support
                    </H3>
                    <Body className="mt-3 text-neutral-600">
                      Advice is always grounded in how your family lives day to day, not in trend pressure or oversized
                      checklists.
                    </Body>
                  </div>
                </div>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <RevealOnScroll>
              <div className="space-y-6 md:max-w-2xl">
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Baby Prep Guides
                </p>

                <div>
                  <SectionDivider />
                  <H2 className="font-serif text-neutral-900">
                    Baby Prep Guides
                  </H2>
                </div>

                <Body className="text-neutral-600">
                  Practical guidance on baby gear, registry picks, nursery setup, and the decisions that pile up fast.
                </Body>
              </div>
            </RevealOnScroll>

            <Link
              href="/blog"
              className="btn btn--secondary w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] md:w-auto"
            >
              Explore the Blog →
            </Link>
          </div>

          <RevealOnScroll delayMs={90}>
            <div className="mx-auto mt-12 flex max-w-[1500px] flex-col space-y-12 md:grid md:auto-rows-fr md:grid-cols-3 md:gap-10 md:space-y-0">
              {insightPreviews.length > 0 ? (
                insightPreviews.map((post) => (
                  <div key={post.id} className="h-full">
                    <JournalCard
                      title={post.title}
                      slug={post.slug}
                      category={post.category}
                      coverImage={post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage}
                      excerpt={toInsightExcerpt(post.excerpt, post.content, 170)}
                      dateLabel={formatInsightDate(getPostDisplayDate(post))}
                      dateTime={getPostDisplayDate(post).toISOString()}
                    />
                  </div>
                ))
              ) : (
                <p className="text-[var(--color-muted)]">
                  No guides published yet.
                </p>
              )}
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA
          className="homepage-section"
          title="Start Your Baby Preparation with Confidence"
          description="Whether you are building your registry, designing your nursery, or preparing your home for a new arrival, Taylor-Made Baby Co. offers thoughtful guidance every step of the way."
          ctaLabel="Request Your Consultation"
        />
      </main>
    </SiteShell>
  );
}
