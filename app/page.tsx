import SiteShell from '@/components/SiteShell';
import Link from 'next/link';
import Image from 'next/image';
import CTASection from '@/components/marketing/CTASection';
import BlogPreview from '@/components/marketing/BlogPreview';
import GuideGrid from '@/components/marketing/GuideGrid';
import ServiceCards from '@/components/marketing/ServiceCards';
import TestimonialCarousel from '@/components/marketing/TestimonialCarousel';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import IconFrame from '@/components/ui/IconFrame';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import {
  guidePillars,
  homepageTestimonials,
  servicePackages,
  trustStripItems,
} from '@/lib/marketing/siteContent';
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

const problemMoments = [
  {
    title: 'Too much noise',
    description: 'Every product page sounds essential. They cannot all be essential.',
  },
  {
    title: 'Too little context',
    description: 'The right choice depends on your car, storage, budget, routine, and how you plan to move through the day.',
  },
  {
    title: 'Too much pressure',
    description: 'A lot of parents feel like they need to get everything right before baby arrives. You do not. You need a steadier plan.',
  },
] as const;

const preparationSupportItems = [
  'CPST car seat installation guidance',
  'Virtual car seat checks with Lani Car Seats',
  'Home safety walkthroughs with AZ Childproofers',
  'Nursery and home preparation planning',
] as const;

const tmbcApproachSteps = [
  {
    title: 'Learn',
    description: 'Understand your options.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6 text-[var(--color-accent-dark)]">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
  },
  {
    title: 'Plan',
    description: 'Create a thoughtful registry strategy.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6 text-[var(--color-accent-dark)]">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Try',
    description: 'Test what fits your lifestyle.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6 text-[var(--color-accent-dark)]">
        <path d="M10 17h4V5H2v12h3" />
        <path d="M14 7h5l3 4v6h-2" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Buy',
    description: 'Purchase intentionally with confidence.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6 text-[var(--color-accent-dark)]">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
] as const;

const authorityCards = [
  {
    ...trustStripItems[0],
    logos: [
      {
        src: '/assets/logos/strolleria.png',
        alt: 'Strolleria logo',
        label: 'Strolleria',
        width: 1844,
        height: 457,
      },
    ],
  },
  {
    ...trustStripItems[1],
    logos: [
      {
        src: '/assets/brand/potterybarnkids.png',
        alt: 'Pottery Barn Kids logo',
        label: 'Pottery Barn Kids',
        width: 1101,
        height: 152,
      },
    ],
  },
  {
    ...trustStripItems[2],
    logos: [
      {
        src: '/assets/brand/totsquad.png',
        alt: 'Tot Squad logo',
        label: 'Tot Squad',
        width: 1065,
        height: 228,
      },
    ],
  },
  {
    ...trustStripItems[3],
    logos: [
      {
        src: '/assets/logos/lanicarseat.png',
        alt: 'Lani Car Seat logo',
        label: 'Lani Car Seat',
        width: 490,
        height: 490,
      },
      {
        src: '/assets/logos/azchildproof.png',
        alt: 'AZ Childproofers logo',
        label: 'AZ Childproofers',
        width: 201,
        height: 201,
      },
    ],
  },
] as const;

const advisorFocusAreas = [
  {
    title: 'Stroller Strategy',
    iconSrc: '/assets/icons/gear-plan.png',
    iconAlt: 'Baby gear planning illustration',
    width: 1155,
    height: 864,
  },
  {
    title: 'Car Seat Fit',
    iconSrc: '/assets/icons/carseat.png',
    iconAlt: 'Car seat illustration',
    width: 264,
    height: 175,
  },
  {
    title: 'Registry Planning',
    iconSrc: '/assets/icons/buildregistry.png',
    iconAlt: 'Registry planning illustration',
    width: 195,
    height: 116,
  },
  {
    title: 'Nursery Setup',
    iconSrc: '/assets/icons/nursery.png',
    iconAlt: 'Nursery illustration',
    width: 286,
    height: 170,
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

export default async function HomePage() {
  const now = new Date();
  const insightPreviews = (await prisma.post.findMany({
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

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          className="homepage-hero"
          eyebrow="Taylor-Made Baby Co."
          title="Private Baby Planning & Registry Guidance for Growing Families"
          subtitle="Expert baby gear guidance to help you choose thoughtfully, prepare your home, and start parenthood with confidence."
          primaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          secondaryCta={{ label: 'Explore the Guides', href: '/guides' }}
          tagline={`Strollers • Car Seats • Registry • Nursery\u00A0Setup`}
          image="/assets/hero/hero-01.jpg"
          imageAlt="Curated baby gear arranged for planning and comparison"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious" className="homepage-post-bow-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-12 xl:gap-16">
            <div className="space-y-7 lg:pr-4">
              <div className="max-w-[38rem]">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Advisor Profile</p>
                <h2 className="mt-4 font-serif text-[2.4rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                  Meet Your Baby Gear Advisor
                </h2>
                <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                  Taylor helps expecting parents sort strollers, car seats, registries, nurseries, and timing decisions without turning the process into a second full-time job.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                <Link href="/consultation" className="btn btn--primary w-full sm:w-auto">
                  Book a Consultation
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75 sm:justify-start"
                >
                  Meet Taylor
                  <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.8rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)] sm:p-7">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">What Taylor helps you sort</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {advisorFocusAreas.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-white/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                    >
                      <div className="flex min-h-[4rem] items-center">
                        <Image
                          src={item.iconSrc}
                          alt={item.iconAlt}
                          width={item.width}
                          height={item.height}
                          sizes="(min-width: 1280px) 5rem, 20vw"
                          className="h-auto max-h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <p className="max-w-none text-[0.98rem] font-medium leading-7 text-neutral-800">{item.title}</p>
                        <CheckIcon frameClassName="mt-0.5 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/assets/editorial/tmbc-seal.png"
                  alt="Taylor-Made Baby Co. seal"
                  width={320}
                  height={304}
                  sizes="(min-width: 1280px) 10rem, 28vw"
                  className="h-auto w-[8.5rem] object-contain opacity-90 sm:w-[9.5rem] xl:w-[10rem]"
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <SectionIntro
              eyebrow="Why Taylor-Made Baby Co"
              title="Real experience. Clear guidance. Much less guessing."
              description="Taylor's perspective comes from baby gear retail, nursery planning, concierge support, and private consultations. In other words, this is not advice built from one long night of scrolling."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {authorityCards.map((item) => (
                <MarketingSurface key={item.title} className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)]">
                  <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/80">
                    Experience
                  </p>
                  <h3 className="mt-4 font-serif text-[1.45rem] leading-[1.1] text-neutral-900">{item.title}</h3>
                  <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{item.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {item.logos.map((logo) => (
                      <div
                        key={logo.label}
                        className="flex min-h-[4.25rem] min-w-[7.25rem] items-center justify-center rounded-[1.05rem] border border-[rgba(0,0,0,0.06)] bg-white px-3 py-3"
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={logo.width}
                          height={logo.height}
                          sizes="(min-width: 1280px) 8rem, 32vw"
                          className={[
                            'h-auto w-auto object-contain',
                            logo.label === 'Lani Car Seat' || logo.label === 'AZ Childproofers' ? 'max-h-10' : 'max-h-8',
                          ].join(' ')}
                        />
                      </div>
                    ))}
                  </div>
                </MarketingSurface>
              ))}
            </div>
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" className="homepage-method-section">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)] xl:items-start xl:gap-14">
            <div className="max-w-[42rem]">
              <SectionIntro
                align="left"
                eyebrow="Why this helps"
                title={
                  <>
                    <span className="block">Some baby registries include 120 items.</span>
                    <span className="block">You do not need 120 items.</span>
                  </>
                }
                description="What you need are the right products for your space, your routines, and your lifestyle."
                contentWidthClassName="max-w-[38rem]"
                titleClassName="max-w-[14ch]"
                descriptionClassName="max-w-[35rem]"
              />
            </div>

            <MarketingSurface className="self-start rounded-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)] lg:ml-auto lg:max-w-[33rem]">
              <p className="mt-0 max-w-none font-serif text-[1.7rem] leading-[1.2] tracking-[-0.03em] text-neutral-900">
                Parents do not need more products.
                <br />
                They need better guidance.
              </p>
            </MarketingSurface>
          </div>

          <div
            className="mt-6 flex justify-center motion-safe:opacity-0 motion-safe:animate-[fadeUpSoft_900ms_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
            style={{ animationDelay: '120ms' }}
          >
            <div className="relative w-full max-w-[44rem] overflow-visible rounded-[2rem] bg-[#f7f5f3]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[14%] bottom-[6%] top-[22%] rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.24)_0%,rgba(232,154,174,0)_74%)] blur-3xl"
              />
              <Image
                src="/assets/editorial/babystuff.png"
                alt="Curated baby essentials arranged to reflect a minimalist baby registry philosophy."
                width={1443}
                height={600}
                sizes="(min-width: 1280px) 44rem, 92vw"
                className="relative z-[1] h-auto w-full origin-left -translate-x-4 scale-[1.12] object-contain drop-shadow-[0_22px_40px_rgba(216,137,160,0.12)] sm:-translate-x-6"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3 xl:mt-10">
            {problemMoments.map((moment) => (
              <MarketingSurface
                key={moment.title}
                className="h-full rounded-[1.75rem] p-6 md:min-h-[13.5rem] md:p-7"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">
                  {moment.title}
                </p>
                <p className="mt-4 max-w-none text-[0.98rem] leading-8 text-neutral-700">{moment.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="spacious" className="homepage-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] lg:items-center">
            <SectionIntro
              align="left"
              eyebrow="TMBC Philosophy"
              title="The Taylor-Made Approach"
              description="Learn what matters. Build a plan. Try what fits. Buy with confidence."
              contentWidthClassName="max-w-3xl"
            />

            <div className="lg:justify-self-end">
              <Image
                src="/assets/services/smartbuying.jpeg"
                alt="Baby planning checklist illustration representing intentional purchasing and registry planning."
                width={1086}
                height={724}
                sizes="(min-width: 1024px) 30rem, 100vw"
                className="mx-auto w-full max-w-[30rem] rounded-xl border border-white/70 shadow-[0_25px_50px_rgba(0,0,0,0.08)] contrast-[1.02] saturate-[1.02]"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tmbcApproachSteps.map((step) => (
              <MarketingSurface key={step.title} className="h-full bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)]">
                <IconFrame size="sm" className="text-[var(--color-accent-dark)]" interactive={false}>
                  {step.icon}
                </IconFrame>
                <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-none text-sm leading-7 text-neutral-700">{step.description}</p>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <GuideGrid
          className="homepage-section"
          guides={[
            { ...guidePillars[0], title: 'Best Strollers of 2026' },
            { ...guidePillars[1], title: 'Best Infant Car Seats' },
            { ...guidePillars[2], title: 'Minimalist Baby Registry Guide' },
          ]}
          columns="three"
          title="Start with the question that keeps coming back to your browser tabs."
          description="Many families start by exploring one of these guides before booking a consultation."
          footerNote="When you're ready to make decisions, book a private consultation."
          footerCtaHref="/consultation"
          footerCtaLabel="Book a Consultation"
        />

        <ServiceCards
          className="homepage-section"
          container="wide"
          packages={servicePackages}
          eyebrow="Work With Taylor"
          title="When you want a real recommendation, not one more opinion."
          description="The guides can get you grounded. A consultation helps when the decision still feels personal, expensive, or weirdly hard to make. Which, honestly, is most baby gear."
        />

        <MarketingSection tone="ivoryWarm" spacing="spacious" className="homepage-section">
          <SectionIntro
            eyebrow="Safety & Preparation"
            title="Preparation goes beyond the registry."
            description="Taylor-Made Baby Co connects families with trusted safety specialists to help prepare their homes and vehicles before baby arrives."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {preparationSupportItems.map((item) => (
              <MarketingSurface
                key={item}
                className="h-full rounded-[1.75rem] bg-white/95 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <CheckIcon frameClassName="mt-0.5" />
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/45">Trusted support</p>
                    <p className="mt-3 max-w-none text-[1rem] leading-8 text-neutral-700">{item}</p>
                  </div>
                </div>
              </MarketingSurface>
            ))}
          </div>
        </MarketingSection>

        <TestimonialCarousel
          className="homepage-testimonials-section"
          testimonials={homepageTestimonials}
          title="What changes when the advice actually fits your life."
          description="The win is not owning more things. It is feeling confident in what you chose, why you chose it, and what can wait."
        />

        <BlogPreview
          className="homepage-section"
          eyebrow="From Taylor&apos;s Journal"
          title="Thoughtful reads for the questions parents keep circling back to."
          description="Insights, guidance, and honest perspective from Taylor."
          linkLabel="Visit the Journal"
          emptyMessage="Fresh journal posts will land here as the editorial side of TMBC grows."
          posts={insightPreviews.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: normalizeBlogCategory(post.category),
            excerpt: toInsightExcerpt(post.excerpt, post.content),
            coverImage: post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage,
            dateLabel: formatInsightDate(getPostDisplayDate(post)),
            dateTime: getPostDisplayDate(post).toISOString(),
            readingTime: post.readingTime,
            authorName: 'Taylor Vanderwolk',
          }))}
        />

        <CTASection
          className="homepage-support-section"
          eyebrow="When you want help deciding"
          title="When you want expert guidance that fits real life."
          description="Taylor-Made Baby Co. is here to make baby gear decisions feel simpler, steadier, and a lot less like an internet scavenger hunt."
          note="Start with confidence."
        />
      </main>
    </SiteShell>
  );
}
