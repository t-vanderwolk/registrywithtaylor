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

const preparationPartnerCards = [
  {
    title: 'CPST car seat installations and checks',
    partner: 'with Lani Car Seat',
    description:
      'For families who want expert eyes on installation, fit, compatibility, and the details that are easy to second-guess on your own.',
    logo: {
      src: '/assets/logos/lanicarseat.png',
      alt: 'Lani Car Seat logo',
      width: 490,
      height: 490,
      label: 'Lani Car Seat',
    },
    bullets: [
      'Virtual car seat checks and fit guidance',
      'Installation support before baby arrives',
      'Calmer answers when safety questions feel high-stakes',
    ],
  },
  {
    title: 'In-home baby and child proofing',
    partner: 'with AZ Childproofers',
    description:
      'Support for families who want their home to feel safer, steadier, and more practical before baby starts moving through it.',
    logo: {
      src: '/assets/logos/azchildproof.png',
      alt: 'AZ Childproofers logo',
      width: 201,
      height: 201,
      label: 'AZ Childproofers',
    },
    bullets: [
      'In-home safety walkthroughs',
      'Room-by-room childproofing recommendations',
      'Guidance that works for real homes, not perfect ones',
    ],
  },
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
    title: 'Albee Baby Partnership',
    description:
      'Retail partnership insight that keeps Taylor close to premium gear assortments, comparison points, and what families are actually evaluating.',
    logos: [
      {
        src: '/assets/brand/albeebaby.png',
        alt: 'Albee Baby logo',
        label: 'Albee Baby',
        width: 574,
        height: 108,
      },
    ],
  },
  {
    ...trustStripItems[3],
    logos: [
      {
        src: '/assets/brand/tot-squad.png',
        alt: 'Tot Squad logo',
        label: 'Tot Squad',
        width: 1334,
        height: 345,
      },
    ],
  },
] as const;

const authorityLogoClassName = (label: string) => {
  if (label === 'Lani Car Seat' || label === 'AZ Childproofers') {
    return 'max-h-10';
  }

  if (label === 'Albee Baby') {
    return 'max-h-7';
  }

  return 'max-h-8';
};

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
            <div className="group relative space-y-7 pb-24 lg:pr-4 xl:pb-28">
              <div className="relative z-[1] max-w-[40rem]">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Advisor Profile</p>
                <h2 className="mt-4 font-serif text-[2.4rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                  Meet Your Baby Gear Advisor
                </h2>
                <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                  I have spent years helping families sort strollers, car seats, registries, and nursery decisions in real life, not just in theory. I know how fast baby gear can go from exciting to weirdly overwhelming.
                </p>
                <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                  My approach is calm, practical, and built around what actually fits your home, your routines, and your budget. Your registry does not need to impress the internet. It just needs to work when life gets real.
                </p>
              </div>

              <div className="relative z-[1] flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
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

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[-9.75rem] left-[-1rem] z-0 sm:bottom-[-10.5rem] sm:left-[-0.5rem] lg:bottom-[-12rem] lg:left-[-1.25rem] xl:bottom-[-13.5rem] xl:left-[-2rem]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[10%] bottom-[14%] top-[18%] rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.24)_0%,rgba(232,154,174,0.08)_48%,transparent_76%)] blur-3xl transition duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                />
                <Image
                  src="/assets/editorial/babystuff.png"
                  alt=""
                  width={1443}
                  height={600}
                  sizes="(min-width: 1280px) 24rem, (min-width: 640px) 20rem, 16rem"
                  className="relative h-auto w-[16rem] origin-bottom-left scale-[1.04] object-contain drop-shadow-[0_18px_30px_rgba(216,137,160,0.16)] saturate-[1.04] contrast-[1.05] transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.07] group-hover:drop-shadow-[0_24px_42px_rgba(216,137,160,0.22)] sm:w-[20rem] xl:w-[24rem]"
                />
              </div>
            </div>

            <div>
              <div className="rounded-[1.8rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 shadow-[0_18px_42px_rgba(0,0,0,0.05)] sm:p-7">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">What Taylor helps you sort</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {advisorFocusAreas.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.35rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] p-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-6"
                    >
                      <div className="mx-auto flex h-[10.5rem] w-full items-center justify-center sm:h-[11rem]">
                        <Image
                          src={item.iconSrc}
                          alt={item.iconAlt}
                          width={item.width}
                          height={item.height}
                          sizes="(min-width: 1280px) 12rem, 34vw"
                          className={[
                            'h-auto w-auto object-contain drop-shadow-[0_16px_24px_rgba(43,38,40,0.10)]',
                            item.iconClassName,
                          ].join(' ')}
                        />
                      </div>
                      <p className="mx-auto mt-2 max-w-[12rem] bg-transparent text-[0.98rem] font-medium leading-[1.35] text-neutral-800 selection:bg-transparent selection:text-neutral-800">
                        {item.title}
                      </p>
                      <div className="mt-4 flex justify-center">
                        <CheckIcon frameClassName="mt-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_7rem] xl:items-start xl:gap-4">
            <SectionIntro
              eyebrow="Why Taylor-Made Baby Co"
              title="Real experience. Clear guidance. Much less guessing."
              description="Taylor's perspective comes from baby gear retail, nursery planning, concierge support, and private consultations. In other words, this is not advice built from one long night of scrolling."
              contentWidthClassName="max-w-4xl"
            />

            <div className="relative flex justify-center xl:justify-end xl:pt-3">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.12)_0%,rgba(232,154,174,0.04)_42%,transparent_72%)] blur-2xl"
              />
              <Image
                src="/assets/editorial/tmbc-seal.png"
                alt="Taylor-Made Baby Co. seal"
                width={320}
                height={304}
                sizes="(min-width: 1280px) 7rem, 22vw"
                className="relative h-auto w-[5.75rem] object-contain opacity-[0.88] drop-shadow-[0_10px_18px_rgba(177,145,124,0.14)] sm:w-[6.25rem] xl:w-[7rem]"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {authorityCards.map((item) => (
              <MarketingSurface
                key={item.title}
                className="flex h-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)] xl:aspect-square xl:p-6"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/80">
                  Experience
                </p>
                <h3 className="mt-4 font-serif text-[1.28rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 xl:text-[1.22rem]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-none text-sm leading-[1.75] text-neutral-700 xl:text-[0.92rem] xl:leading-[1.7]">
                  {item.description}
                </p>
                {item.logos.length ? (
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                    {item.logos.map((logo) => (
                      <div
                        key={logo.label}
                        className="flex min-h-[3.6rem] min-w-[6.5rem] items-center justify-center rounded-[1rem] border border-[rgba(0,0,0,0.06)] bg-white/92 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] xl:min-h-[3.35rem] xl:min-w-[6rem]"
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={logo.width}
                          height={logo.height}
                          sizes="(min-width: 1280px) 8rem, 32vw"
                          className={['h-auto w-auto object-contain', authorityLogoClassName(logo.label)].join(' ')}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </MarketingSurface>
            ))}
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
            className="group mt-6 flex justify-center xl:justify-start motion-safe:opacity-0 motion-safe:animate-[fadeUpSoft_900ms_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
            style={{ animationDelay: '120ms' }}
          >
            <div className="relative w-full max-w-[42rem] overflow-visible rounded-[2rem] bg-[#f7f5f3] xl:ml-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[14%] bottom-[6%] top-[22%] rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.24)_0%,rgba(232,154,174,0)_74%)] blur-3xl transition duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <Image
                src="/assets/editorial/bunny-gift.png"
                alt="Gifted bunny toy illustration arranged as a soft editorial accent."
                width={754}
                height={729}
                sizes="(min-width: 1280px) 24rem, 72vw"
                className="relative z-[1] mx-auto h-auto w-[72%] max-w-[26rem] scale-[1.03] object-contain drop-shadow-[0_22px_40px_rgba(216,137,160,0.16)] saturate-[1.04] contrast-[1.05] transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.06] group-hover:drop-shadow-[0_28px_48px_rgba(216,137,160,0.22)] xl:mx-0 xl:w-[60%] xl:max-w-[24rem]"
              />
            </div>
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
            eyebrow="Trusted Preparation Partners"
            title="Preparation goes beyond the registry."
            description="Taylor-Made Baby Co connects families with trusted specialists for car seat support and in-home childproofing when preparation needs to go beyond the shopping list."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {preparationPartnerCards.map((item) => (
              <MarketingSurface
                key={item.title}
                className="h-full rounded-[1.9rem] bg-white/95 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.05)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="max-w-[32rem]">
                    <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/45">Trusted support</p>
                    <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.05] tracking-[-0.03em] text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
                      {item.partner}
                    </p>
                  </div>
                  <div className="flex min-h-[4.75rem] min-w-[7.25rem] items-center justify-center rounded-[1.05rem] border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                    <Image
                      src={item.logo.src}
                      alt={item.logo.alt}
                      width={item.logo.width}
                      height={item.logo.height}
                      sizes="(min-width: 1024px) 8rem, 30vw"
                      className={[
                        'h-auto w-auto object-contain',
                        item.logo.label === 'Lani Car Seat' ? 'max-h-12' : 'max-h-10',
                      ].join(' ')}
                    />
                  </div>
                </div>

                <p className="mt-6 max-w-none text-[1rem] leading-8 text-neutral-700">{item.description}</p>

                <div className="mt-6 grid gap-4">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-4">
                      <CheckIcon frameClassName="mt-0.5" />
                      <p className="max-w-none text-[0.98rem] leading-8 text-neutral-700">{bullet}</p>
                    </div>
                  ))}
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
