import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AnnotationReveal from '@/components/ui/AnnotationReveal';
import { H2, H3, Body } from '@/components/ui/MarketingHeading';
import CategoryCard from '@/components/resources/CategoryCard';
import GlossaryCard from '@/components/resources/GlossaryCard';
import ToolCard from '@/components/resources/ToolCard';
import TaylorsNote from '@/components/resources/TaylorsNote';
import CarSeatLifespanChart from '@/components/resources/CarSeatLifespanChart';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import {
  startCards,
  strollerCategories,
  strollerFinderCategoryHref,
  singleToDoubleCards,
  carSeatGlossary,
  strollerGlossary,
  taylorsNotes,
  whatsNext,
  freeTools,
} from '@/lib/resources/knowBeforeYouBuy';

const GLOSSARY_COUNT = carSeatGlossary.length + strollerGlossary.length;

const CTA_CLASS =
  'inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-cta-pink-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';
const CTA_GHOST =
  'inline-flex items-center justify-center rounded-full border border-[#e2a9b6] px-7 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition hover:bg-[#fdf1f4]';

const RESOURCE_STATS = [
  { value: `${strollerCategories.length}`, label: 'Stroller categories decoded' },
  { value: `${GLOSSARY_COUNT}`, label: 'Gear terms in plain English' },
  { value: `${freeTools.length}`, label: 'Free tools, no account' },
  { value: '$0', label: 'Always free to learn' },
] as const;

export const metadata = buildMarketingMetadata({
  title: 'Baby Gear Guide: Know Before You Buy | Taylor-Made Baby Co.',
  description:
    'A friendly baby gear guide from your baby registry consultant. Understand stroller categories, decode the car seat and stroller glossary, see how long each car seat actually lasts, and get pointed to the right free tool before you spend a dollar.',
  path: '/resources',
  imagePath: '/assets/hero/hero-04.jpg',
  imageAlt: 'Know Before You Buy, the Taylor-Made Baby Co. baby gear guide',
  keywords: [
    'baby gear guide',
    'stroller categories explained',
    'car seat glossary',
    'stroller glossary',
    'know before you buy baby gear',
    'travel system explained',
    'infant vs convertible car seat',
    'baby registry consultant',
  ],
});

export default function ResourcesPage() {
  return (
    <SiteShell currentPath="/resources">
      <main className="site-main">
        <PageViewTracker path="/resources" pageType="other" />
        <AnnotationReveal />

        {/* ── HERO ── */}
        <Hero
          className="homepage-hero"
          eyebrow="Free educational hub"
          title="Know Before You Buy"
          subtitle="A calm, plain-English baby gear guide for expecting parents. Understand strollers and car seats before you shop, then let a free tool do the sorting for you."
          primaryCta={{ label: 'Book a Registry Consult ($75)', href: '/book' }}
          secondaryCta={{ label: 'Take the Stroller Quiz', href: '/tools/stroller-quiz' }}
          image="/assets/hero/hero-04.jpg"
          imageAlt="Know Before You Buy"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        {/* ── PROOF STRIP ── */}
        <MarketingSection tone="ivory" spacing="tight" container="default">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {RESOURCE_STATS.map((s, i) => (
              <RevealOnScroll key={s.label} delayMs={Math.min(i * 60, 240)}>
                <div>
                  <div className="font-serif text-[2rem] leading-none text-[var(--color-accent-dark)] sm:text-[2.4rem]">{s.value}</div>
                  <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-neutral-500">{s.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* ── INTRO ── */}
        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-5 text-center">
            <RevealOnScroll>
              <p className="academy-script-note academy-script-note--sm academy-script-note--tilt-left">
                The baby aisle is not the boss of you.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
              <Body className="mx-auto max-w-xl text-[1.12rem] leading-8 text-neutral-600">
                Most of the baby aisle panic comes from vocabulary, not the gear. Once you know what makes a
                stroller modular, what a travel system really is, and why an adapter matters, the whole thing gets a lot
                less scary. Start here, then let a free tool do the sorting for you.
              </Body>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* ── SECTION 1: Where would you like to start? ── */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Choose your path</p>
              <H2 className="mt-3 font-serif">Where would you like to start?</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">
                Three quick doors in, depending on how far along you are.
              </Body>
            </RevealOnScroll>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3">
              {startCards.map((c, i) => (
                <RevealOnScroll key={c.href} delayMs={Math.min(i * 70, 210)}>
                  <Link
                    href={c.href}
                    className="group flex h-full cursor-pointer flex-col rounded-[1.5rem] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-cta-pink)] hover:shadow-[0_26px_58px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)] active:translate-y-0 sm:p-7"
                  >
                    <p className="text-[1rem] leading-[1.5] text-neutral-500">{c.prompt}</p>
                    <h3 className="mt-2.5 flex-1 font-serif text-[1.4rem] leading-[1.14] tracking-[-0.03em] text-neutral-900 sm:text-[1.55rem]">
                      {c.action}
                    </h3>
                    <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white transition group-hover:bg-[var(--color-cta-pink-hover)]">
                      {c.cta}
                      <span aria-hidden className="transition duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* ── SECTION 2: Stroller Categories ── */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">The lay of the land</p>
              <H2 className="mt-3 font-serif">Stroller Categories</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">
                The nine kinds of strollers, in plain English. Tap any card to see real examples in the Stroller
                Finder.
              </Body>
            </RevealOnScroll>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {strollerCategories.map((c, i) => (
                <RevealOnScroll key={c.slug} delayMs={Math.min(i * 45, 260)}>
                  <CategoryCard name={c.name} blurb={c.blurb} href={strollerFinderCategoryHref(c.slug)} />
                </RevealOnScroll>
              ))}
            </div>

            {/* Single-to-Double, expanded */}
            <div className="mx-auto mt-14 max-w-4xl">
              <RevealOnScroll>
                <div className="text-center">
                  <p className="mkt-eyebrow">A closer look</p>
                  <H3 className="mt-2 font-serif">Single-to-Double isn’t one thing</H3>
                  <Body className="mx-auto mt-3 max-w-xl text-neutral-600">
                    Grows into a double can mean two very different things. The difference decides which second
                    seat you can actually buy.
                  </Body>
                </div>
              </RevealOnScroll>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {singleToDoubleCards.map((c, i) => (
                  <RevealOnScroll key={c.title} delayMs={i * 80}>
                    <div className="mkt-card h-full rounded-[1.4rem] border border-[var(--color-card-border)] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6 shadow-[0_8px_28px_rgba(55,40,46,0.05)]">
                      <h4 className="font-serif text-[1.45rem] leading-[1.12] tracking-[-0.02em] text-neutral-900">{c.title}</h4>
                      <p className="mt-2.5 text-[1.02rem] leading-[1.6] text-neutral-600">{c.body}</p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </MarketingSection>

        {/* Scattered note */}
        <MarketingSection tone="ivory" spacing="tight" container="narrow">
          <TaylorsNote tilt="right">{taylorsNotes[2].body}</TaylorsNote>
        </MarketingSection>

        {/* ── SECTION 3: Car seat lifespan chart ── */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <RevealOnScroll>
              <div>
                <p className="mkt-eyebrow">The math</p>
                <H2 className="mt-3 font-serif">How long each car seat actually lasts</H2>
                <Body className="mt-3 text-neutral-600">
                  Not every seat lasts the same. Here is roughly how many years each stage buys you, so you can
                  weigh buy once versus buy right for now.
                </Body>
                <Body className="mt-3 text-neutral-600">
                  An infant seat is the easiest for year one but ages out fastest. A convertible skips the carrier
                  entirely. An all-in-one stretches the furthest, at the cost of a bulkier newborn setup.
                </Body>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <CarSeatLifespanChart />
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* ── SECTION 4: Car Seat Glossary ── */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Decode it</p>
              <H2 className="mt-3 font-serif">Car Seat Glossary</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">
                The car seat words that show up on every product page, and why each one actually matters to you.
              </Body>
            </RevealOnScroll>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {carSeatGlossary.map((t, i) => (
                <RevealOnScroll key={t.term} delayMs={Math.min(i * 35, 280)}>
                  <GlossaryCard term={t.term} definition={t.definition} whyItMatters={t.whyItMatters} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* ── SECTION 5: Stroller Glossary ── */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Decode it</p>
              <H2 className="mt-3 font-serif">Stroller Glossary</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">
                Everything from reversible seat to flip-flop friendly, translated.
              </Body>
            </RevealOnScroll>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {strollerGlossary.map((t, i) => (
                <RevealOnScroll key={t.term} delayMs={Math.min(i * 30, 280)}>
                  <GlossaryCard term={t.term} definition={t.definition} whyItMatters={t.whyItMatters} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* ── SECTION 6: Taylor's Notes ── */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">From Taylor</p>
              <H2 className="mt-3 font-serif">Taylor’s Notes</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">The unfiltered stuff I tell every client.</Body>
            </RevealOnScroll>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <RevealOnScroll>
                <TaylorsNote tilt="left" signed={false}>{taylorsNotes[0].body}</TaylorsNote>
              </RevealOnScroll>
              <RevealOnScroll delayMs={90}>
                <TaylorsNote tilt="right" signed={false}>{taylorsNotes[1].body}</TaylorsNote>
              </RevealOnScroll>
            </div>
            <RevealOnScroll delayMs={120}>
              <div className="mt-6">
                <TaylorsNote>{taylorsNotes[2].body}</TaylorsNote>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* ── SECTION 7: Free Tools ── */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Free tools</p>
              <H2 className="mt-3 font-serif">Let the tools do the sorting.</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">
                A clear next step in a few minutes. Free, and no account required.
              </Body>
            </RevealOnScroll>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {freeTools.map((t, i) => (
                <RevealOnScroll key={t.href} delayMs={Math.min(i * 70, 210)}>
                  <ToolCard title={t.title} description={t.description} href={t.href} cta={t.cta} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* ── SECTION 8: What's Next? ── */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Keep going</p>
              <H2 className="mt-3 font-serif">What’s next?</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">Pick the next step that matches where you are.</Body>
            </RevealOnScroll>
            <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3">
              {whatsNext.map((n, i) => (
                <RevealOnScroll key={n.href} delayMs={Math.min(i * 70, 210)}>
                  <Link
                    href={n.href}
                    className="group flex h-full cursor-pointer flex-col rounded-[1.5rem] border border-[var(--color-card-border)] bg-white p-6 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-cta-pink)] hover:shadow-[0_26px_58px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)] active:translate-y-0 sm:p-7"
                  >
                    <p className="font-handwritten-print text-[1.55rem] leading-none text-[var(--color-cta-pink)]">{n.prompt}</p>
                    <p className="mt-3 flex-1 font-serif text-[1.35rem] leading-[1.15] tracking-[-0.02em] text-neutral-900">{n.action}</p>
                    <span className="mt-5 inline-flex w-fit items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-dark)] transition group-hover:text-[var(--color-cta-pink-hover)]">
                      Go
                      <span aria-hidden className="transition duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* ── CLOSING CTA ── */}
        <section className="bg-[linear-gradient(180deg,#fbeef2,#f2d3db)] py-20 md:py-24">
          <RevealOnScroll className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight tracking-[-0.03em] text-neutral-900">
              When the guide gets you close, but not all the way there.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-[1.85] text-neutral-700">
              One hour with Taylor turns everything you just learned into a plan for your exact home, car, budget, and
              registry, so you can stop researching and start deciding.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/book" className={CTA_CLASS}>Book a Registry Consultation</Link>
              <Link href="/tools/stroller-quiz" className={CTA_GHOST}>Take the Stroller Quiz</Link>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="price-seal">
                <span className="price-seal__price">$75</span>
                <span className="price-seal__label">1-Hour Session</span>
              </span>
              <p className="text-[0.76rem] text-neutral-500">$75 · US Nationwide · Full refund if cancelled 24+ hrs before</p>
            </div>
          </RevealOnScroll>
        </section>
      </main>
    </SiteShell>
  );
}
