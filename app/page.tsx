import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import BlogPreview from '@/components/marketing/BlogPreview';
import ServiceCards from '@/components/marketing/ServiceCards';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { guidePillars, servicePackages, trustStripItems } from '@/lib/marketing/siteContent';
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

type TimelineStep = {
  stepLabel: string;
  title: string;
  description: string;
  emphasis?: string;
  bullets?: string[];
};

type FeaturedGuide = {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
};

type PreparationPartner = {
  name: string;
  logoSrc: string;
  logoAlt: string;
  width: number;
  height: number;
  logoClassName: string;
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

const tmbcApproachSteps = [
  {
    title: 'Learn',
    description: 'Understand the categories and options.',
  },
  {
    title: 'Plan',
    description: 'Create a thoughtful registry strategy.',
  },
  {
    title: 'Try',
    description: 'Experience the gear when possible.',
  },
  {
    title: 'Buy',
    description: 'Purchase intentionally and confidently.',
  },
] as const;

const featuredGuides: FeaturedGuide[] = [
  {
    ...guidePillars[0],
    title: 'Best Strollers of the Year',
  },
  {
    ...guidePillars[1],
    title: 'Best Infant Car Seats',
  },
  {
    ...guidePillars[2],
    title: 'Minimalist Baby Registry',
  },
  {
    ...guidePillars[3],
    title: 'Nursery Planning Guide',
  },
];

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
];

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

function GuideFeatureCard({ guide }: { guide: FeaturedGuide }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.85rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,0,0,0.08)]">
      <Link href={`/guides/${guide.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={guide.imageSrc}
          alt={guide.imageAlt}
          fill
          sizes="(min-width: 1280px) 24vw, (min-width: 768px) 42vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </Link>

      <div className="flex h-full flex-col p-6">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">{guide.eyebrow}</p>
        <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
          <Link href={`/guides/${guide.slug}`} className="transition-opacity duration-200 hover:opacity-80">
            {guide.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-none text-sm leading-7 text-neutral-700">{guide.description}</p>
        <Link
          href={`/guides/${guide.slug}`}
          className="mt-auto inline-flex min-h-[44px] items-center pt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]"
        >
          Explore the Guide
        </Link>
      </div>
    </article>
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
              <div className="group relative space-y-7 pb-24 lg:pr-4 xl:pb-28">
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

                <div className="relative z-[1] flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                  <Link href="/consultation" className="btn btn--primary w-full sm:w-auto">
                    Book a Consultation
                  </Link>
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
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">
                    What Taylor helps you sort
                  </p>
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
                            loading="lazy"
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
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {authorityCards.map((item) => (
                <MarketingSurface
                  key={item.title}
                  className="flex h-full flex-col items-center text-center bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f8_100%)] xl:min-h-[18rem] xl:p-6"
                >
                  <div className="flex min-h-[8.5rem] items-center justify-center xl:min-h-[8.75rem]">
                    <h3 className="mx-auto max-w-[12rem] font-serif text-[1.28rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 xl:text-[1.16rem]">
                      {item.title}
                    </h3>
                  </div>
                  {item.logos.length ? (
                    <div className="mt-auto flex w-full flex-wrap items-center justify-center gap-3 pt-3 xl:pb-1">
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
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </MarketingSurface>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              align="left"
              title="Why this helps"
              description="Most parents are told to just start a registry. But thoughtful preparation means understanding when to register, where to register, and how to take advantage of the perks most families do not know exist."
              contentWidthClassName="max-w-4xl"
              titleClassName="max-w-[12ch]"
              descriptionClassName="max-w-[44rem]"
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {timelineSteps.map((step) => (
                <TimelineStepCard key={step.stepLabel} {...step} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center">
              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.06)] sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[12%] bottom-[10%] top-[20%] rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-3xl"
                />
                <div className="relative aspect-[4/3.55]">
                  <Image
                    src="/assets/services/smartbuying.jpeg"
                    alt="Baby planning materials arranged to represent intentional purchasing and thoughtful registry strategy."
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="max-w-[38rem]">
                <h2 className="font-serif text-[2.45rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[3rem]">
                  Intentional Purchasing
                </h2>
                <p className="mt-5 font-serif text-[1.8rem] leading-[1.14] tracking-[-0.03em] text-neutral-900 sm:text-[2.2rem]">
                  Some baby registries include 120 items.
                  <br />
                  You do not need 120 items.
                </p>
                <p className="mt-6 max-w-none text-[1rem] leading-8 text-neutral-700">
                  What you need are the right products for your routines, your space, and your lifestyle.
                </p>
                <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                  Taylor-Made Baby Co focuses on intentional preparation - helping families understand what matters
                  before they buy.
                </p>

                <MarketingSurface className="mt-8 rounded-[1.9rem] bg-[linear-gradient(180deg,#ffffff_0%,#fff4f6_100%)]">
                  <p className="max-w-none font-serif text-[1.65rem] leading-[1.18] tracking-[-0.03em] text-neutral-900">
                    Parents do not need more products.
                    <br />
                    They need better guidance.
                  </p>
                </MarketingSurface>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              title="The Taylor-Made Approach"
              description="Clear guidance. Thoughtful preparation."
              contentWidthClassName="max-w-3xl"
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {tmbcApproachSteps.map((step, index) => (
                <MarketingSurface
                  key={step.title}
                  className="h-full rounded-[1.9rem] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)]"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-serif text-[1.65rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-none text-[0.98rem] leading-8 text-neutral-700">{step.description}</p>
                </MarketingSurface>
              ))}
            </div>

            <div className="mt-16 overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] shadow-[0_22px_55px_rgba(0,0,0,0.06)]">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-center">
                <div className="px-6 py-8 sm:px-8 md:py-10">
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

                <div className="relative min-h-[18rem] border-t border-[rgba(0,0,0,0.06)] lg:min-h-full lg:border-l lg:border-t-0">
                  <Image
                    src="/assets/editorial/growing-with-confidence.jpg"
                    alt="Editorial image representing growing confidence through baby gear education and preparation."
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              title="Explore the Guides"
              description="Our guides break down the most important baby gear decisions with clear explanations, thoughtful comparisons, and real-world advice."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {featuredGuides.map((guide) => (
                <GuideFeatureCard key={guide.slug} guide={guide} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/guides" className="btn btn--primary">
                View All Guides
              </Link>
            </div>
          </div>
        </section>

        <ServiceCards
          className="homepage-section"
          container="wide"
          packages={servicePackages}
          eyebrow=""
          title="Services"
          description="Focused guidance for families who want expert support before they buy."
          ctaHref="/contact"
          ctaLabel="Start a Consultation"
        />

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionIntro
              title="Trusted Preparation Partners"
              description="Taylor-Made Baby works alongside trusted specialists to help families prepare safely and confidently."
              contentWidthClassName="max-w-4xl"
            />

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {preparationPartners.map((partner) => (
                <PreparationPartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
          </div>
        </section>

        <BlogPreview
          className="homepage-section"
          eyebrow=""
          title="From the Journal"
          description="Latest reads on baby gear, registry strategy, nursery planning, and the decisions parents tend to revisit most."
          linkLabel="Visit the Journal"
          linkHref="/journal"
          emptyMessage="Fresh journal posts will appear here as TMBC continues building the editorial library."
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

        <section className="bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.06)] bg-white/92 px-6 py-10 text-center shadow-[0_20px_55px_rgba(0,0,0,0.06)] md:px-10 md:py-12">
              <div className="absolute left-1/2 top-[-3.25rem] h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.2)_0%,rgba(232,154,174,0)_74%)]" />
              <h2 className="relative font-serif text-[2.1rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.7rem]">
                Start with confidence.
              </h2>
              <p className="relative mx-auto mt-5 max-w-[40rem] text-[1rem] leading-8 text-neutral-700">
                Baby preparation should feel calm, thoughtful, and clear.
              </p>
              <p className="relative mx-auto mt-4 max-w-[42rem] text-[1rem] leading-8 text-neutral-700">
                Taylor-Made Baby Co helps families navigate baby gear, registries, and preparation with expert
                guidance.
              </p>
              <Link href="/contact" className="btn btn--primary relative mt-8">
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
