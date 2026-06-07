import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import HomeAuthorityStrip from '@/components/home/HomeAuthorityStrip';
import SiteShell from '@/components/SiteShell';
import StartHereSection from '@/components/marketing/StartHereSection';
import TwoTierTestimonials from '@/components/marketing/TwoTierTestimonials';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import EditorialIllustration from '@/components/ui/EditorialIllustration';
import CheckIcon from '@/components/ui/CheckIcon';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const revalidate = 3600;

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Co. | Expert Baby Gear Guidance for Expecting Parents',
  description:
    'Expert baby gear guidance to help growing families choose thoughtfully, prepare their homes, and start parenthood with confidence.',
  path: '/',
  imagePath: '/assets/hero/hero-01.jpg',
  imageAlt: 'Taylor-Made Baby Co. baby gear planning editorial image.',
});

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

type AdvisorFocusItem = {
  title: string;
  iconSrc: string;
  iconAlt: string;
  width: number;
  height: number;
  iconClassName: string;
};

const advisorFocusAreas: AdvisorFocusItem[] = [
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

const homepageStrolleriaReviews = [
  {
    quote: "Taylor took what could have been a very overwhelming experience and made it so simple and easy. She spent 3+ hours with me as we talked through the pros/cons of each brand and was so patient and kind... Corporate, if you're reading this, time to give Taylor a promotion/raise!",
    name: 'Amanda M.',
    source: 'Strolleria client',
  },
  {
    quote: "She listened to what we were looking for, and was so honest and transparent about all of the baby gear we were considering. We ended up buying something completely different than our 'online research' because of her help.",
    name: 'Kathryn G.',
    source: 'Strolleria client',
  },
  {
    quote: 'She is truly a wealth of knowledge and guided us in the right direction based on our individual needs and preferences. Not only did we leave feeling confident in our selections, but Taylor made the entire process fun and exciting.',
    name: 'Caihlan S.',
    source: 'Strolleria client',
  },
  {
    quote: 'We came in not knowing what we wanted and Taylor listened to our preferences/lifestyle and provided us with great recommendations. She definitely made the process less overwhelming for us.',
    name: 'Talie W.',
    source: 'Strolleria client',
  },
  {
    quote: 'Taylor showed us more options than we would have known to ask about, which led to us completely changing what we wanted for our whole stroller setup.',
    name: 'Jennifer R.',
    source: 'Strolleria client',
  },
] as const;

const homepageAnonymousQuotes = [
  {
    quote: "Taylor was phenomenal. I'm recommending this service and especially her to my online group of Intended Parents through surrogacy. She truly understands this unique pathway to parenthood. 10/10!",
    attribution: 'Expecting parent',
  },
  {
    quote: "Taylor's knowledge made us more comfortable understanding the landscape of baby gear — what we actually need and what we don't — and how to build a system that works for our needs.",
    attribution: 'First-time parent',
  },
  {
    quote: "Taylor and I laughed the whole time but still able to get it done! Support I didn't know I needed!",
    attribution: 'Expecting parent',
  },
  {
    quote: 'Talking with Taylor made me feel more confident about my registry and she gave a lot of helpful suggestions.',
    attribution: 'First-time expecting parent',
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

function AdvisorFocusCard({
  item,
  delayMs = 0,
}: {
  item: AdvisorFocusItem;
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

export default function HomePage() {
  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <PageViewTracker path="/" pageType="homepage" />

        <Hero
          className="homepage-hero"
          title="Private Baby Planning & Registry Guidance for Growing Families"
          subtitle="Expert baby gear guidance to help you choose thoughtfully, prepare your home, and start parenthood with confidence."
          primaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          secondaryCta={{ label: 'Start with Academy', href: '/academy' }}
          tagline="Strollers | Car Seats | Registry | Nursery Setup"
          image="/assets/hero/hero-01.jpg"
          imageAlt="Curated baby gear arranged for planning and comparison"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <StartHereSection />

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

        <TwoTierTestimonials
          eyebrow="Client Stories"
          title="What families say about working with Taylor"
          description={<em>&ldquo;You don&rsquo;t have to figure this out alone.&rdquo;</em>}
          strolleriaReviews={homepageStrolleriaReviews}
          anonymousQuotes={homepageAnonymousQuotes}
          anonymousColumns={2}
        />

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <NewsletterCapture />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
