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
import { resolveBlogCoverImage } from '@/lib/blog/images';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Co. | Calm, Personalized Baby Planning',
  description:
    'Personalized registry and nursery planning for modern families. Thoughtful guidance, mentor support, and intentional preparation — so parenthood starts with confidence, not confusion.',
  path: '/',
  imagePath: '/og-home.jpg',
  imageAlt: 'Taylor-Made Baby Co. – Start with confidence.',
});

type InsightPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured: boolean;
  coverImage: string | null;
  featuredImage: {
    url: string;
  } | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
};

const authorityItems = [
  'Baby Gear Specialist',
  'Brand-Trained Expertise',
  'Private Planning for Modern Families',
];

const formatInsightDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
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
      excerpt: true,
      content: true,
      featured: true,
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
      excerpt: true,
      content: true,
      featured: true,
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
          image="/assets/hero/hero-01.jpg"
          imageAlt=""
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Baby prep, simplified.
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Because parenthood should start with confidence, not confusion.
            </Body>

            <p className="hero-load-reveal hero-load-reveal--2 mx-auto max-w-lg text-center text-sm leading-relaxed text-black/70 md:text-base md:text-left">
              Private baby planning · Registry strategy · Nursery &amp; gear guidance · Brand-trained expertise
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 pt-4 flex flex-col sm:flex-row gap-4">
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
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:gap-14 md:items-start">
            {/* LEFT COLUMN */}
            <div>
              <div className="mx-auto max-w-xl text-left">
                <div className="flex justify-center md:justify-start">
                  <SectionDivider />
                </div>

                <H2 className="mb-6 text-center font-serif md:text-left">
                  There’s no shortage of advice.
                </H2>

                <div className="mb-10 space-y-8 md:space-y-10">
                  <RevealOnScroll delayMs={0}>
                    <Body className="mb-0">Most of it loud.</Body>
                  </RevealOnScroll>
                  <RevealOnScroll delayMs={110}>
                    <Body className="mb-0">Some of it helpful.</Body>
                  </RevealOnScroll>
                  <RevealOnScroll delayMs={220}>
                    <Body className="mb-0">Very little of it tailored to you.</Body>
                  </RevealOnScroll>
                </div>

                <Body className="mb-8">
                  Between registry lists, social media trends, and well-meaning opinions, it’s easy to feel pressured to
                  buy everything immediately.
                </Body>

                <Body className="mb-10">
                  Preparation shouldn’t feel reactive.
                  <br />
                  It should feel intentional.
                </Body>

                <div className="mt-2 hidden border-t border-[var(--color-charcoal)]/10 pt-8 md:block">
                  <Body className="italic text-[var(--color-charcoal)]/80">
                    So what does a baby planner actually do?
                  </Body>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <MarketingSurface className="bg-[linear-gradient(180deg,#f9f4ef_0%,#f4ece5_100%)] text-center md:text-left">
              <H3 className="mb-6 font-serif">
                This is for you if you want preparation to feel calm.
              </H3>

              <RevealOnScroll className="checklist-reveal">
                <ul className="mx-auto max-w-md space-y-5 leading-relaxed text-base text-left md:mx-0">
                  <li className="home-check-item home-check-item--1 flex items-start gap-4">
                    <CheckIcon />
                    <span>You want clarity before you start buying</span>
                  </li>
                  <li className="home-check-item home-check-item--2 flex items-start gap-4">
                    <CheckIcon />
                    <span>You value thoughtful, design-aware decisions</span>
                  </li>
                  <li className="home-check-item home-check-item--3 flex items-start gap-4">
                    <CheckIcon />
                    <span>Guidance over guesswork</span>
                  </li>
                  <li className="home-check-item home-check-item--4 flex items-start gap-4">
                    <CheckIcon />
                    <span>Support without pressure</span>
                  </li>
                  <li className="home-check-item home-check-item--5 flex items-start gap-4">
                    <CheckIcon />
                    <span>Preparation that feels calm</span>
                  </li>
                </ul>
              </RevealOnScroll>

            </MarketingSurface>
          </div>

          <div className="mt-8 border-t border-[var(--color-charcoal)]/10 pt-6 text-center md:hidden">
            <Body className="italic text-[var(--color-charcoal)]/80">
              So what does a baby planner actually do?
            </Body>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section homepage-post-bow-section"
        >
          <div className="clarity-grid">
            <div className="clarity-left">
              <div className="space-y-8">
                <RevealOnScroll>
                  <div className="max-w-prose space-y-8">
                    <div>
                      <SectionDivider />
                      <H2 className="font-serif text-neutral-900">
                        What Is a Baby Planner?
                      </H2>
                    </div>

                    <div className="space-y-6">
                      <Body className="md:leading-loose text-neutral-700">
                        A baby planner is like a wedding planner for early parenthood:
                        a steady guide for the practical side of preparation.
                      </Body>

                      <Body className="md:leading-loose text-neutral-700">
                        Your doctor handles medical care.
                        <br />
                        I handle practical preparation — registry strategy, nursery flow, and major gear decisions.
                      </Body>

                      <Body className="font-medium text-neutral-900">
                        I help you sort what matters now, what can wait, and what truly fits your life.
                      </Body>

                      <Body className="md:leading-loose text-neutral-700">
                        Together, we replace overwhelm with a clear, personalized plan so you can prepare intentionally.
                      </Body>
                    </div>
                  </div>
                </RevealOnScroll>

                <Body className="max-w-prose font-medium md:leading-loose text-neutral-900">
                  This isn’t about buying more.
                  <br />
                  It’s about choosing well.
                </Body>
              </div>
            </div>

            <div className="h-full">
              <RevealOnScroll delayMs={180}>
                <div className="clarity-image-shell h-full">
                  <Image
                    src="/assets/editorial/growing-with-confidence.jpg"
                    alt="Growing with confidence editorial image"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="rounded-2xl object-cover shadow-sm"
                  />
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Planning Overview — Stacked Editorial Journey */}
          <div className="mt-20 pt-16 md:mt-24 md:pt-20 border-t border-[rgba(0,0,0,0.08)]">
            {/* Section Intro */}
            <div className="mb-14 md:pl-4">
              <SectionDivider />

              <H2 className="mb-6 font-serif">
                A Thoughtful Path to Preparation
              </H2>

              <Body className="max-w-[60ch] text-muted-foreground">
                How Families Typically Work With Me
              </Body>
            </div>

            <div className="space-y-16 md:space-y-20">
              {/* -------- Pillar 01 -------- */}
              <div className="group">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  {/* Text Column */}
                  <div>
                    <RevealOnScroll>
                      <span className="mb-3 block text-sm tracking-[0.25em] text-black/60">
                        01
                      </span>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={90}>
                      <H3 className="mb-4 tracking-tight text-neutral-900">
                        Registry Clarity
                      </H3>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={170}>
                      <Body className="mb-6 max-w-[60ch] text-muted-foreground">
                        We begin by refining what truly belongs on your registry — guided by brand-trained insight,
                        lifestyle alignment, and long-term practicality.
                      </Body>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={250}>
                      <ul className="space-y-4 leading-relaxed text-muted-foreground mb-6">
                        <li>• Brand-informed recommendations</li>
                        <li>• Clear “buy now vs later” prioritization</li>
                        <li>• Registry structure built around your real life</li>
                      </ul>
                    </RevealOnScroll>
                  </div>

                  {/* Image Column */}
                  <RevealOnScroll delayMs={330}>
                    <div className="relative">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src="/assets/editorial/registry.jpg"
                          alt="Curated baby registry planning session"
                          fill
                          sizes="(min-width: 768px) 42vw, 100vw"
                          className="rounded-2xl object-cover shadow-sm transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>

              <div className="border-t border-neutral-200" />

              {/* -------- Pillar 02 -------- */}
              <div className="group">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  {/* Image Column */}
                  <RevealOnScroll delayMs={330} className="order-2 md:order-1">
                    <div className="relative">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src="/assets/editorial/nursery.jpg"
                          alt="Calm and functional nursery design"
                          fill
                          sizes="(min-width: 768px) 42vw, 100vw"
                          className="rounded-2xl object-cover shadow-sm transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Text Column */}
                  <div className="order-1 md:order-2">
                    <RevealOnScroll>
                      <span className="mb-3 block text-sm tracking-[0.25em] text-black/60">
                        02
                      </span>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={90}>
                      <H3 className="mb-4 tracking-tight text-neutral-900">
                        Home & Nursery Preparation
                      </H3>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={170}>
                      <Body className="mb-6 max-w-[60ch] text-muted-foreground">
                        Next, we translate your vision into a space that feels calm,
                        functional, and ready for daily life with baby.
                      </Body>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={250}>
                      <ul className="space-y-4 leading-relaxed text-muted-foreground mb-6">
                        <li>• Layout and furniture planning</li>
                        <li>• Safety-focused recommendations</li>
                        <li>• Sourcing and implementation guidance</li>
                      </ul>
                    </RevealOnScroll>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200" />

              {/* -------- Pillar 03 -------- */}
              <div className="group">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  {/* Text Column */}
                  <div>
                    <RevealOnScroll>
                      <span className="mb-3 block text-sm tracking-[0.25em] text-black/60">
                        03
                      </span>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={90}>
                      <H3 className="mb-4 tracking-tight text-neutral-900">
                        Intentional Gear Planning
                      </H3>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={170}>
                      <Body className="mb-6 max-w-[60ch] text-muted-foreground">
                        Finally, we design the daily systems — strollers, car seats, carriers —
                        chosen with longevity, safety, and real routines in mind.
                      </Body>
                    </RevealOnScroll>

                    <RevealOnScroll delayMs={250}>
                      <ul className="space-y-4 leading-relaxed text-muted-foreground mb-6">
                        <li>• Stroller + car seat strategy</li>
                        <li>• Real-world usage planning</li>
                        <li>• Streamlined daily systems</li>
                      </ul>
                    </RevealOnScroll>
                  </div>

                  {/* Image Column */}
                  <RevealOnScroll delayMs={330}>
                    <div className="relative">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src="/assets/editorial/gear.jpg"
                          alt="Thoughtfully selected baby gear essentials"
                          fill
                          sizes="(min-width: 768px) 42vw, 100vw"
                          className="rounded-2xl object-cover shadow-sm transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View Full Services <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          container="default"
          spacing="default"
          className="homepage-section relative overflow-visible"
        >
          <AuthorityStrip items={authorityItems} className="mt-0 md:gap-8" />

          <div className="mt-12 mx-auto max-w-3xl text-center space-y-6">
            <RevealOnScroll>
              <div className="relative px-6 py-10 md:px-10">
                <QuoteMark />
                <p className="relative text-lg font-serif leading-relaxed text-neutral-900 md:text-xl">
                  &ldquo;With four years between our kids, we quickly realized we were a little out of practice — and
                  that baby gear had definitely evolved. Taylor helped us figure out what we could reuse, what was
                  worth upgrading, and what we could skip entirely. It made the whole process feel calmer (and much
                  less chaotic). Big shout-out to Taylor — we only wish we had known about her the first time.&rdquo;
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <p className="text-sm text-neutral-600">
                — Philip & Lucia V., Santa Fe, NM · Parents of Two
              </p>
            </RevealOnScroll>
          </div>

          <MarketingSurface className="mx-auto mt-14 max-w-4xl bg-[#F7F4EF] text-center md:px-12">
            <H3 className="font-serif">
              A Personal Note from Taylor
            </H3>

            <RevealOnScroll>
              <div>
                <Body className="mt-6 mx-auto text-center text-[var(--color-muted)]">
                  With years immersed in premium baby retail, national pilot programs, and independent consulting,
                  I&apos;ve guided families through registries, nursery builds, and real purchasing decisions.
                </Body>

                <Body className="mt-4 mx-auto text-center text-[var(--color-muted)]">
                  I translate product complexity into clear next steps, so you can choose what truly fits your home and
                  routine with confidence.
                </Body>

                <Body className="mt-4 mx-auto text-center text-[var(--color-muted)]">
                  Taylor-Made Baby Co. was created to replace overwhelm with clarity — so you can prepare intentionally,
                  not reactively.
                </Body>
              </div>
            </RevealOnScroll>

            <div className="mt-8">
              <Link
                href="/about"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Meet Taylor <span aria-hidden>→</span>
              </Link>
            </div>
          </MarketingSurface>

        </MarketingSection>

        {/* Journal Highlight */}
        <MarketingSection
          tone="ivory"
          container="default"
          spacing="default"
          className="homepage-section"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {/* Left Editorial Intro */}
            <div className="space-y-6 md:max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
                From The Blog
              </p>

              <div>
                <SectionDivider />
                <H2 className="mb-6 font-serif text-neutral-900">
                  Insights
                </H2>
              </div>

              <Body className="text-neutral-600">
                Honest, grounded conversations about baby gear,
                preparation, and making decisions with clarity —
                not pressure.
              </Body>
            </div>

            <Link
              href="/blog"
              className="btn btn--secondary w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] md:w-auto"
            >
              View All Articles →
            </Link>
          </div>

          <div className="mt-12 flex flex-col space-y-12 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            {insightPreviews.length > 0 ? (
              insightPreviews.map((post, index) => (
                <RevealOnScroll key={post.id} delayMs={index * 90}>
                  <MarketingSurface className="marketing-card-hover group flex h-full flex-col transition-[transform,box-shadow] duration-300 hover:shadow-md">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <Image
                        src={resolveBlogCoverImage(post.featuredImage?.url ?? post.coverImage)}
                        alt={post.title}
                        width={1200}
                        height={675}
                        className="h-auto w-full"
                        loading="lazy"
                        unoptimized
                      />
                    </Link>

                    <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      {formatInsightDate(getPostDisplayDate(post))}
                    </p>

                    <H3 className="mt-3 font-serif text-[var(--text-primary)]">{post.title}</H3>

                    <Body className="mt-3 text-[var(--color-muted)]">
                      {toInsightExcerpt(post.excerpt, post.content)}
                    </Body>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex min-h-[44px] items-center pt-6 text-sm tracking-wide text-[var(--text-primary)] transition hover:opacity-70"
                    >
                      <span className="link-underline">Read More</span>
                      <span
                        aria-hidden
                        className="ml-1 inline-block transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[3px]"
                      >
                        →
                      </span>
                    </Link>
                  </MarketingSurface>
                </RevealOnScroll>
              ))
            ) : (
              <p className="text-[var(--color-muted)]">No articles published yet.</p>
            )}
          </div>
        </MarketingSection>

        <FinalCTA className="homepage-section" />
      </main>
    </SiteShell>
  );
}
