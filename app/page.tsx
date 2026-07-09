import Image from 'next/image';
import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import HomeAuthorityStrip from '@/components/home/HomeAuthorityStrip';
import HomeJournalPreview from '@/components/home/HomeJournalPreview';
import SiteShell from '@/components/SiteShell';
import StartHereSection from '@/components/marketing/StartHereSection';
import TwoTierTestimonials from '@/components/marketing/TwoTierTestimonials';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import EditorialIllustration from '@/components/ui/EditorialIllustration';
import CheckIcon from '@/components/ui/CheckIcon';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import PodcastFeature from '@/components/marketing/PodcastFeature';
import RegistryConsultOffer from '@/components/marketing/RegistryConsultOffer';
import { HOME_FAQ } from '@/lib/marketing/homeFaq';
import { homeStructuredData } from '@/lib/marketing/homeStructuredData';
// The homepage "From the Journal" preview reuses the blog JournalCard, whose
// styles (.tmbc-blog-card + 4/3 media) live in blog.css. The blog layout isn't
// in scope here, so import the stylesheet directly or the cards render bare.
import '../styles/blog.css';

export const revalidate = 3600;

export const metadata = buildMarketingMetadata({
  title: 'Baby Registry Consultant for Expecting Parents | Taylor-Made Baby Co.',
  description:
    'Expert baby registry consultant for expecting parents. Personalized stroller, car seat, nursery, and registry guidance from a verified Target Baby Concierge specialist. Book a $75 one hour virtual session.',
  path: '/',
  imagePath: '/assets/hero/hero-01.jpg',
  imageAlt: 'Taylor-Made Baby Co. baby gear planning editorial image.',
  keywords: [
    'baby registry consultant',
    'baby registry expert',
    'baby gear consultant',
    'baby gear expert',
    'baby registry help',
    'Target Baby Concierge Specialist',
    'expecting parents registry guide',
  ],
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
    title: 'Stroller Systems',
    iconSrc: '/assets/icons/gear-plan.png',
    iconAlt: 'Baby gear planning illustration',
    width: 1155,
    height: 864,
    iconClassName: 'max-h-[9.25rem] sm:max-h-[9.8rem]',
  },
  {
    title: 'Car seat selection & compatibility',
    iconSrc: '/assets/icons/cpst.png',
    iconAlt: 'Car seat selection and compatibility illustration',
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
    logoAlt: 'Strolleria, baby gear specialist experience',
    width: 1844,
    height: 457,
    logoClassName: 'max-h-8',
  },
  {
    title: 'Pottery Barn Kids',
    logoSrc: '/assets/brand/potterybarnkids.png',
    logoAlt: 'Pottery Barn Kids, nursery advisor experience',
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
    logoAlt: 'Target Baby Concierge powered by Tot Squad, certified specialist',
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

const fitMoments = [
  {
    title: 'You want expert judgment',
    description: 'Not another list of links, but a clearer sense of what actually deserves your attention.',
  },
  {
    title: 'You want decisions matched to real life',
    description: 'Your car, storage, travel habits, budget, and room layout should shape the recommendations.',
  },
  {
    title: 'You want to buy with confidence',
    description: 'The goal is a better plan, fewer mismatched purchases, and less second-guessing.',
  },
] as const;

const howItWorks = [
  {
    step: 'Step 1',
    title: 'Book your consult',
    description: 'Grab a time and share a bit about your home, routine, car, and where your registry stands right now.',
  },
  {
    step: 'Step 2',
    title: 'Taylor preps',
    description: 'Every intake is personally read before we meet — so the session starts with momentum, not catch-up.',
  },
  {
    step: 'Step 3',
    title: '1-hour session',
    description: 'We talk through your registry, narrow the biggest product decisions, and get clear on what you actually need first.',
  },
  {
    step: 'Step 4',
    title: 'Follow-up notes',
    description: 'You leave with written next steps. Want longer-term support? Reach out through the contact form and Taylor will point you to the right level.',
  },
] as const;

const authorityStripLogos = [
  {
    src: '/assets/logos/strolleria.png',
    alt: 'Strolleria, where Taylor worked as a baby gear specialist',
    width: 1844,
    height: 457,
    className: 'max-h-6',
  },
  {
    src: '/assets/brand/potterybarnkids.png',
    alt: 'Pottery Barn Kids, where Taylor advised on nursery design',
    width: 1101,
    height: 152,
    className: 'max-h-5',
  },
  {
    src: '/assets/brand/totsquad.png',
    alt: 'Target Baby Concierge powered by Tot Squad, where Taylor is a certified specialist',
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
            vivid
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
        />

        <Hero
          className="homepage-hero"
          title="Baby Registry Consultant for Expecting Parents"
          subtitle="Strollers, car seats, nursery, and registry guidance from a verified Target Baby Concierge specialist, built around your home, your budget, and your real life."
          primaryCta={{ label: 'Book a Registry Consult', href: '/book' }}
          secondaryCta={{ label: 'Read the Journal', href: '/blog' }}
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
          badge={
            <a
              href="https://open.spotify.com/episode/7e2c0icuRxEKotUPdB0aOS"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3.5 rounded-full border border-[rgba(215,161,175,0.4)] bg-white/95 py-2.5 pl-3 pr-5 shadow-[0_10px_26px_rgba(72,49,56,0.09)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(215,161,175,0.28)] bg-[#fdf7f4]">
                <Image
                  src="/assets/logos/babyquip.png"
                  alt="BabyQuip Tiny Travels podcast"
                  width={512}
                  height={512}
                  sizes="44px"
                  className="h-7 w-7 object-contain"
                  loading="lazy"
                />
              </span>
              <span className="text-left">
                <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/75">
                  As heard on
                </span>
                <span className="block font-serif text-[1.08rem] leading-tight tracking-[-0.02em] text-neutral-900">
                  BabyQuip Tiny Travels
                </span>
              </span>
              <span
                aria-hidden
                className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-cta-pink)] text-white transition group-hover:bg-[var(--color-cta-pink-hover)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-3 w-3">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </a>
          }
        />

        <section className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-12 xl:gap-16">
              <div className="space-y-7 lg:pr-4">
                <RevealOnScroll>
                  <div className="relative z-[1] max-w-[40rem]">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Advisor Profile</p>
                    <h2 className="mt-4 font-serif text-[2.4rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                      Your Baby Registry Expert
                    </h2>
                    <p className="mt-3 border-l-[3px] border-[var(--color-cta-pink)]/55 pl-4 text-[1.9rem] italic leading-[1.15] tracking-[-0.01em] text-[var(--color-cta-pink)] [font-family:var(--font-accent)] sm:text-[2.15rem]">
                      Taylor Vanderwolk
                    </p>
                    <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                      I have spent years helping families sort strollers, car seats, registries, and nursery decisions
                      in real life, not just in theory. I know how fast baby gear can go from exciting to weirdly
                      overwhelming.
                    </p>
                    <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                      My approach is calm, practical, and built around what actually fits your home, your routines, and
                      your budget. Your registry does not need to impress the internet. It just needs to work when life
                      gets real. When you are ready, you can{' '}
                      <Link
                        href="/services"
                        className="font-semibold text-[var(--color-accent-dark)] underline decoration-[var(--color-cta-pink)]/40 underline-offset-4 transition hover:decoration-[var(--color-cta-pink)]"
                      >
                        book a baby registry consultation
                      </Link>{' '}
                      and we will work through it together in one focused hour.
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

        {/* ── Who this is for ─────────────────────────────────────── */}
        <section className="bg-[linear-gradient(180deg,#fff_0%,#fdf9f6_100%)] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <RevealOnScroll>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Who this is for</p>
              <h2 className="mt-4 font-serif text-[2rem] leading-[1.0] tracking-[-0.04em] text-neutral-900 sm:text-[2.5rem]">
                For expecting parents who want better decisions, not just more information.
              </h2>
            </RevealOnScroll>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3 md:gap-6">
              {fitMoments.map((moment, i) => (
                <RevealOnScroll key={moment.title} delayMs={i * 60}>
                  <div className="h-full rounded-[1.35rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(252,247,244,0.93)_100%)] p-6 shadow-[0_8px_24px_rgba(72,49,56,0.05)]">
                    <h3 className="font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                      {moment.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-neutral-700">{moment.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────── */}
        <section className="bg-[linear-gradient(180deg,#fdf9f6_0%,#f7f3ef_100%)] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <RevealOnScroll>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">How it works</p>
              <h2 className="mt-4 font-serif text-[2rem] leading-[1.0] tracking-[-0.04em] text-neutral-900 sm:text-[2.5rem]">
                How a baby registry consultation works, step by step.
              </h2>
            </RevealOnScroll>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              {howItWorks.map((item, i) => (
                <RevealOnScroll key={item.step} delayMs={i * 60}>
                  <div className="h-full rounded-[1.35rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(252,247,244,0.93)_100%)] p-6 shadow-[0_8px_24px_rgba(72,49,56,0.05)]">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">{item.step}</p>
                    <h3 className="mt-4 font-serif text-[1.5rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-neutral-700">{item.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <RegistryConsultOffer variant="compact" />

        {/* ── Trusted Prep Partners ────────────────────────────────── */}
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <p className="text-center text-[0.68rem] uppercase tracking-[0.28em] text-black/40">
                Trusted Prep Partners
              </p>
              <p className="mx-auto mt-3 max-w-xl text-center text-[0.95rem] leading-7 text-neutral-500">
                Services Taylor recommends and works alongside for car seat safety, home childproofing, and newborn sleep.
              </p>
            </RevealOnScroll>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Lani Car Seats */}
              <RevealOnScroll delayMs={60}>
                <div className="flex h-full flex-col items-center rounded-[1.4rem] border border-[rgba(198,167,94,0.18)] bg-[linear-gradient(180deg,#fdfbf8_0%,#f9f4ec_100%)] px-7 py-8 text-center shadow-[0_12px_32px_rgba(55,40,46,0.05)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(198,167,94,0.18)] bg-white shadow-[0_6px_18px_rgba(55,40,46,0.06)]">
                    <Image
                      src="/assets/logos/lanicarseat.png"
                      alt="Lani Car Seats logo"
                      width={490}
                      height={490}
                      sizes="80px"
                      className="h-12 w-12 rounded-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-[1.2rem] leading-snug tracking-[-0.02em] text-neutral-900">
                    Lani Car Seats
                  </h3>
                  <p className="mt-2.5 max-w-none text-[0.9rem] leading-6 text-neutral-500">
                    CPST-certified car seat installation and safety checks — available virtually and in the Phoenix area.
                  </p>
                </div>
              </RevealOnScroll>

              {/* AZ Childproofers */}
              <RevealOnScroll delayMs={120}>
                <div className="flex h-full flex-col items-center rounded-[1.4rem] border border-[rgba(198,167,94,0.18)] bg-[linear-gradient(180deg,#fdfbf8_0%,#f9f4ec_100%)] px-7 py-8 text-center shadow-[0_12px_32px_rgba(55,40,46,0.05)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(198,167,94,0.18)] bg-white shadow-[0_6px_18px_rgba(55,40,46,0.06)]">
                    <Image
                      src="/assets/logos/azchildproof.png"
                      alt="AZ Childproofers logo"
                      width={201}
                      height={201}
                      sizes="80px"
                      className="h-12 w-12 rounded-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-[1.2rem] leading-snug tracking-[-0.02em] text-neutral-900">
                    AZ Childproofers
                  </h3>
                  <p className="mt-2.5 max-w-none text-[0.9rem] leading-6 text-neutral-500">
                    Professional childproofing assessments and installations for Arizona families.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Tiny Toes Newborn */}
              <RevealOnScroll delayMs={180}>
                <a
                  href="https://www.tinytoesnewborn.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col items-center rounded-[1.4rem] border border-[rgba(198,167,94,0.18)] bg-[linear-gradient(180deg,#fdfbf8_0%,#f9f4ec_100%)] px-7 py-8 text-center shadow-[0_12px_32px_rgba(55,40,46,0.05)] transition duration-200 hover:shadow-[0_16px_40px_rgba(55,40,46,0.08)]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(198,167,94,0.18)] bg-white shadow-[0_6px_18px_rgba(55,40,46,0.06)]">
                    <Image
                      src="/assets/logos/tinytoessleep.jpeg"
                      alt="Tiny Toes Newborn logo"
                      width={200}
                      height={200}
                      sizes="80px"
                      className="h-12 w-12 rounded-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-[1.2rem] leading-snug tracking-[-0.02em] text-neutral-900">
                    Tiny Toes Newborn
                  </h3>
                  <p className="mt-2.5 max-w-none text-[0.9rem] leading-6 text-neutral-500">
                    Newborn sleep consulting and support for families navigating the fourth trimester.
                  </p>
                </a>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <PodcastFeature />

        <TwoTierTestimonials
          eyebrow="Client Stories"
          title="What families say about working with Taylor"
          description={<em>&ldquo;You don&rsquo;t have to figure this out alone.&rdquo;</em>}
          strolleriaReviews={homepageStrolleriaReviews}
          anonymousQuotes={homepageAnonymousQuotes}
          anonymousColumns={2}
        />

        {/* ── FAQ (People Also Ask + FAQPage schema) ──────────────── */}
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <RevealOnScroll>
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Common questions</p>
              <h2 className="mt-4 font-serif text-[2rem] leading-[1.0] tracking-[-0.04em] text-neutral-900 sm:text-[2.5rem]">
                Baby registry consultant FAQ
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-8 text-neutral-700">
                The questions expecting parents ask most, answered straight.
              </p>
            </RevealOnScroll>

            <div className="mt-8 space-y-3 sm:mt-10">
              {HOME_FAQ.map((item, i) => (
                <RevealOnScroll key={item.question} delayMs={i * 40}>
                  <details className="group rounded-[1.2rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] px-5 py-4 shadow-[0_8px_24px_rgba(72,49,56,0.04)] sm:px-6 sm:py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[1.2rem] leading-[1.2] tracking-[-0.02em] text-neutral-900 marker:hidden [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span
                        aria-hidden
                        className="mt-0.5 shrink-0 text-[1.35rem] leading-none text-[var(--color-accent-dark)] transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[0.98rem] leading-8 text-neutral-700">{item.answer}</p>
                  </details>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <HomeJournalPreview />

        <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,var(--color-paper)_100%)] py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <NewsletterCapture />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
