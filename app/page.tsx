import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AuthorityStrip from '@/components/ui/AuthorityStrip';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import QuoteMark from '@/components/ui/QuoteMark';
import SectionDivider from '@/components/ui/SectionDivider';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import SiteShell from '@/components/SiteShell';
import JournalCard from '@/components/blog/JournalCard';
import PlanningPackageCards from '@/components/services/PlanningPackageCards';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import {
  WHAT_I_HELP_FAMILIES_CHOOSE_BLURB,
  WHAT_I_HELP_FAMILIES_CHOOSE_SUPPORTING,
  WHAT_I_HELP_FAMILIES_CHOOSE_TITLE,
} from '@/lib/marketing/copy';
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

const authorityProofCards = [
  {
    title: 'Premium baby retail perspective',
    description:
      "Taylor has helped hundreds of families sort through strollers, car seats, registry planning, and nursery setup without the sales-floor overwhelm.",
  },
  {
    title: 'Brand-trained product knowledge',
    description:
      'Years across premium retailers and product training programs mean you get category-by-category guidance grounded in how the gear actually works.',
  },
  {
    title: 'Advice built for real life',
    description:
      'Recommendations are shaped around your space, budget, routines, and timeline, so the final plan feels usable once baby is home.',
  },
];

const decisionCategories = [
  {
    title: 'Strollers',
    iconSrc: '/assets/icons/gear-plan.png',
    description: 'Compare daily-use, compact, and travel-friendly options based on your routine, storage, and terrain.',
  },
  {
    title: 'Car Seats',
    iconSrc: '/assets/icons/carseat.png',
    description: 'Figure out infant seat versus convertible strategy, travel-system fit, and what makes sense for your car.',
  },
  {
    title: 'Sleep Spaces',
    iconSrc: '/assets/icons/nursery.png',
    description: 'Sort bassinets, mini cribs, full cribs, and room setup with safety and longevity in mind.',
  },
  {
    title: 'Nursery Layout',
    iconSrc: '/assets/icons/blueprint.png',
    description: 'Plan a room flow that supports sleep, feeding, diaper changes, storage, and daily ease.',
  },
  {
    title: 'Feeding Gear',
    iconSrc: '/assets/icons/feed.png',
    description: 'Choose bottles, prep tools, and feeding essentials without piling on things you may never use.',
  },
  {
    title: 'Registry Strategy',
    iconSrc: '/assets/icons/buildregistry.png',
    description: 'Build a registry around what belongs on the list now, what can wait, and what is better off-list.',
  },
  {
    title: 'Travel Gear',
    iconSrc: '/assets/icons/travel.png',
    description: 'Narrow down carriers, travel strollers, and on-the-go setups that fit how often you actually leave the house.',
  },
  {
    title: 'Babyproofing',
    iconSrc: '/assets/icons/babyproof.png',
    description: 'Map what needs attention before baby arrives and what can realistically wait until later stages.',
  },
];

const scenarioCards = [
  {
    problem: 'Small apartment nursery planning',
    decision: 'Choose a sleep setup, storage pieces, and gear footprint that work in tight quarters.',
    outcome: 'You end up with a room that feels functional instead of crowded.',
  },
  {
    problem: 'Second baby: reuse versus upgrade',
    decision: 'Sort what is still safe and useful, what no longer fits, and where an upgrade is actually worth it.',
    outcome: 'You save money, skip duplicate gear, and replace only what matters.',
  },
  {
    problem: 'Travel-heavy family stroller strategy',
    decision: 'Compare whether one stroller can do it all or if daily use and travel need separate answers.',
    outcome: 'Your stroller setup works at the airport, in the trunk, and on everyday errands.',
  },
  {
    problem: 'First-time parent registry decisions',
    decision: 'Organize the registry by daily routines, budget, and what is genuinely helpful in the first months.',
    outcome: 'The list feels useful, giftable, and far less random.',
  },
  {
    problem: 'Budget-conscious gear planning',
    decision: 'Prioritize the categories worth spending on and push lower-value purchases later.',
    outcome: 'You buy with purpose instead of panic.',
  },
];

const testimonial = {
  quote:
    'With four years between our kids, we quickly realized we were a little out of practice - and that baby gear had definitely evolved. Taylor helped us figure out what we could reuse, what was worth upgrading, and what we could skip entirely. It made the whole process feel calmer and much less chaotic. We only wish we had known about her the first time.',
  attribution: 'Philip & Lucia V., Santa Fe, NM · Parents of Two',
};

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
        <Hero image="/assets/hero/hero-01.jpg" imageAlt="">
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Baby prep, simplified.
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Because parenthood should start with confidence, not confusion.
            </Body>

            <p className="hero-load-reveal hero-load-reveal--2 mx-auto max-w-lg text-center text-sm leading-relaxed text-black/70 md:text-base md:text-left">
              Registry strategy · Strollers, car seats, and sleep space · Nursery &amp; home setup
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Schedule Your Complimentary Consultation
              </Link>

              <Link
                href="/services"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View Services
              </Link>
            </div>

            <p className="hero-load-reveal hero-load-reveal--4 text-sm uppercase tracking-[0.2em] text-charcoal/60">
              Private · Personalized · No pressure
            </p>
          </div>
        </Hero>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="homepage-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <SectionDivider />
              <H2 className="font-serif text-neutral-900">
                Trusted Baby Gear Guidance
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                Taylor has helped hundreds of families navigate the overwhelming world of baby gear, registry planning,
                and nursery setup. With hands-on experience across premium baby retailers, product training programs,
                and private consultations, she helps parents make practical decisions about what actually works.
              </Body>
            </div>
          </RevealOnScroll>

          <AuthorityStrip items={authorityItems} className="mt-8 md:gap-8" />

          <RevealOnScroll delayMs={90}>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {authorityProofCards.map((item) => (
                <MarketingSurface key={item.title} className="h-full bg-[linear-gradient(180deg,#fdf9f6_0%,#f7f1ea_100%)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                    Authority Proof
                  </p>
                  <H3 className="mt-4 font-serif text-neutral-900">
                    {item.title}
                  </H3>
                  <Body className="mt-4 text-neutral-600">
                    {item.description}
                  </Body>
                </MarketingSurface>
              ))}
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <SectionDivider />
              <H2 className="font-serif text-neutral-900">
                {WHAT_I_HELP_FAMILIES_CHOOSE_TITLE}
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                {WHAT_I_HELP_FAMILIES_CHOOSE_BLURB}
              </Body>
              <Body className="mx-auto mt-4 max-w-2xl text-neutral-700">
                {WHAT_I_HELP_FAMILIES_CHOOSE_SUPPORTING}
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {decisionCategories.map((item) => (
                <MarketingSurface key={item.title} className="h-full bg-white/90">
                  <ServiceIconBadge src={item.iconSrc} size="card" className="mb-8 self-center" />
                  <H3 className="font-serif text-neutral-900">
                    {item.title}
                  </H3>
                  <Body className="mt-4 text-neutral-600">
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
              <SectionDivider />
              <H2 className="font-serif text-neutral-900">
                Real Baby Gear Decisions
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                This is the practical side of baby prep: real homes, real budgets, real routines, and the gear decisions
                that need an actual answer.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {scenarioCards.map((item) => (
                <MarketingSurface key={item.problem} className="h-full">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                    Problem
                  </p>
                  <H3 className="mt-4 font-serif text-neutral-900">
                    {item.problem}
                  </H3>

                  <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                        Decision
                      </p>
                      <p className="mt-2">
                        {item.decision}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                        Outcome
                      </p>
                      <p className="mt-2">
                        {item.outcome}
                      </p>
                    </div>
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
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <SectionDivider />
              <H2 className="font-serif text-neutral-900">
                Choose Your Support
              </H2>
              <Body className="mx-auto mt-6 max-w-2xl text-neutral-700">
                Whether you need help with one decision or the full baby-prep picture, there is a clear place to start.
              </Body>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <PlanningPackageCards className="mt-12" />
          </RevealOnScroll>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="narrow"
          spacing="default"
          className="homepage-section"
        >
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <SectionDivider />
              <H2 className="font-serif text-neutral-900">
                What Families Say
              </H2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={90}>
            <MarketingSurface className="mx-auto mt-10 max-w-4xl bg-[#F7F4EF] text-center md:px-12">
              <div className="relative px-4 py-2 md:px-6">
                <QuoteMark />
                <p className="relative text-lg font-serif leading-relaxed text-neutral-900 md:text-xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
              <p className="mt-6 text-sm text-neutral-600">
                - {testimonial.attribution}
              </p>
            </MarketingSurface>
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
              View All Guides →
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
          title="Start your baby preparation with a plan that fits."
          description="If you are sorting strollers, car seats, registry picks, or nursery setup, one conversation can make the next steps a lot clearer."
        />
      </main>
    </SiteShell>
  );
}
