import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import SectionIntro from '@/components/ui/SectionIntro';
import CategoryCard from '@/components/resources/CategoryCard';
import GlossaryCard from '@/components/resources/GlossaryCard';
import ToolCard from '@/components/resources/ToolCard';
import TaylorsNote from '@/components/resources/TaylorsNote';
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

export const metadata = buildMarketingMetadata({
  title: 'Know Before You Buy | Taylor-Made Baby Co.',
  description:
    'The friendly starting point before you shop: understand stroller categories, decode the car-seat and stroller glossary, and get pointed to the right free tool — the Stroller Quiz, Stroller Finder, or Travel System Checker.',
  path: '/resources',
  imagePath: '/assets/hero/hero-04.jpg',
  imageAlt: 'Know Before You Buy — the Taylor-Made Baby Co. gear glossary',
});

export default function ResourcesPage() {
  return (
    <SiteShell currentPath="/resources">
      <main className="site-main">
        <PageViewTracker path="/resources" pageType="other" />

        {/* ── HERO ── */}
        <Hero
          className="homepage-hero"
          eyebrow="Free educational hub"
          title="Know Before You Buy"
          subtitle="Helping you understand baby gear before you buy it."
          image="/assets/hero/hero-04.jpg"
          imageAlt="Know Before You Buy"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        {/* ── INTRO + PULL QUOTE ── */}
        <MarketingSection tone="ivory" spacing="spacious">
          <div className="mx-auto max-w-2xl text-center">
            <p className="academy-script-note academy-script-note--sm academy-script-note--tilt-left">
              The baby aisle is not the boss of you.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-[1.18rem] leading-8 text-neutral-600">
              Most of the overwhelm in the baby aisle comes from vocabulary, not from the gear itself. Learn a
              handful of terms — what makes a stroller <em>modular</em>, what a <em>travel system</em> actually is,
              why an <em>adapter</em> matters — and shopping gets dramatically easier. Start here, then let one of
              the free tools do the sorting for you.
            </p>
          </div>
        </MarketingSection>

        {/* ── SECTION 1: Where would you like to start? ── */}
        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Choose your path"
            title="Where would you like to start?"
            description="Three quick doors in, depending on how far along you are."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3">
            {startCards.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex cursor-pointer flex-col rounded-[1.5rem] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-7 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-cta-pink)] hover:shadow-[0_26px_58px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)] active:translate-y-0"
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
            ))}
          </div>
        </MarketingSection>

        {/* ── SECTION 2: Stroller Categories ── */}
        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="The lay of the land"
            title="Stroller Categories"
            description="The nine kinds of strollers, in plain English. Tap any card to see real examples in the Stroller Finder."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {strollerCategories.map((c) => (
              <CategoryCard key={c.slug} name={c.name} blurb={c.blurb} href={strollerFinderCategoryHref(c.slug)} />
            ))}
          </div>

          {/* Single-to-Double, expanded */}
          <div className="mx-auto mt-14 max-w-4xl">
            <div className="text-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
                A closer look
              </p>
              <h3 className="mt-2 font-serif text-[1.5rem] leading-[1.12] tracking-[-0.03em] text-neutral-900 sm:text-[2rem]">
                Single-to-Double isn’t one thing
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-[1.08rem] leading-7 text-neutral-600">
                “Grows into a double” can mean two very different things. The difference decides which second seat you
                can actually buy.
              </p>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {singleToDoubleCards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-[1.4rem] border border-[var(--color-card-border)] bg-white p-6 shadow-[0_8px_28px_rgba(55,40,46,0.05)]"
                >
                  <h4 className="font-serif text-[1.45rem] leading-[1.12] tracking-[-0.02em] text-neutral-900">
                    {c.title}
                  </h4>
                  <p className="mt-2.5 text-[1.02rem] leading-[1.6] text-neutral-600">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Scattered note */}
        <MarketingSection tone="white" spacing="tight">
          <TaylorsNote tilt="right">{taylorsNotes[2].body}</TaylorsNote>
        </MarketingSection>

        {/* ── SECTION 3: Car Seat Glossary ── */}
        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="Decode it"
            title="Car Seat Glossary"
            description="The car-seat words that show up on every product page — and why each one actually matters."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {carSeatGlossary.map((t) => (
              <GlossaryCard key={t.term} term={t.term} definition={t.definition} whyItMatters={t.whyItMatters} />
            ))}
          </div>
        </MarketingSection>

        {/* ── SECTION 4: Stroller Glossary ── */}
        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Decode it"
            title="Stroller Glossary"
            description="Everything from “reversible seat” to “flip-flop friendly,” translated."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {strollerGlossary.map((t) => (
              <GlossaryCard key={t.term} term={t.term} definition={t.definition} whyItMatters={t.whyItMatters} />
            ))}
          </div>
        </MarketingSection>

        {/* ── SECTION 5: Taylor's Notes ── */}
        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="From Taylor"
            title="Taylor’s Notes"
            description="The unfiltered stuff I tell every client."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            <TaylorsNote tilt="left" signed={false}>
              {taylorsNotes[0].body}
            </TaylorsNote>
            <TaylorsNote tilt="right" signed={false}>
              {taylorsNotes[1].body}
            </TaylorsNote>
          </div>
          <div className="mt-6">
            <TaylorsNote>{taylorsNotes[2].body}</TaylorsNote>
          </div>
        </MarketingSection>

        {/* ── SECTION 6: Free Tools ── */}
        <MarketingSection tone="white" spacing="spacious">
          <SectionIntro
            eyebrow="Free tools"
            title="Let the tools do the sorting."
            description="Built to give you a clear next step in a few minutes — free, no account required."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {freeTools.map((t) => (
              <ToolCard key={t.href} title={t.title} description={t.description} href={t.href} cta={t.cta} />
            ))}
          </div>
        </MarketingSection>

        {/* ── SECTION 7: What's Next? ── */}
        <MarketingSection tone="ivory" spacing="spacious">
          <SectionIntro
            eyebrow="Keep going"
            title="What’s next?"
            description="Pick the next step that matches where you are."
            contentWidthClassName="max-w-3xl"
          />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-3">
            {whatsNext.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="group flex cursor-pointer flex-col rounded-[1.5rem] border border-[var(--color-card-border)] bg-white p-7 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-cta-pink)] hover:shadow-[0_26px_58px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)] active:translate-y-0"
              >
                <p className="font-handwritten-print text-[1.55rem] leading-none text-[var(--color-cta-pink)]">
                  {n.prompt}
                </p>
                <p className="mt-3 flex-1 font-serif text-[1.35rem] leading-[1.15] tracking-[-0.02em] text-neutral-900">
                  {n.action}
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-dark)] transition group-hover:text-[var(--color-cta-pink-hover)]">
                  Go
                  <span aria-hidden className="transition duration-200 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
