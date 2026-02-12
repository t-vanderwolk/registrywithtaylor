// Taylor-Made Baby Planning – Production Homepage Stabilization

import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Display, Eyebrow, Lead, SectionTitle } from '@/components/Typography';

export const metadata = {
  title: 'Taylor-Made Baby Planning — Modern Baby Preparation',
  description:
    'Taylor-Made Baby Planning offers private, one-on-one guidance so expecting parents feel confident about every registry and preparation step.',
};

function RibbonDivider() {
  return (
    <div className="ribbon-divider my-10 w-[calc(100%+3rem)] -mx-6 overflow-hidden" aria-hidden="true">
      <div className="w-full">
        <Image
          src="/assets/brand/dividers/ribbon-wave.png"
          alt="Ribbon divider"
          width={1011}
          height={105}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Section variant="base" className="hero bg-white" id="hero">
          <div className="container hero__content">
            <div className="hero__media" aria-hidden="true">
              {/* IMAGE: homepage-hero-placeholder */}
            </div>
            <Eyebrow className="hero__eyebrow">VIRTUAL BABY PLANNING</Eyebrow>
            <Display className="hero__title">Baby prep, simplified.</Display>
            <Lead className="hero__subtitle">Private, one-on-one baby planning for expecting parents who want clarity.</Lead>
            <Body className="hero__subtitle">
              Because parenthood should start with confidence, not confusion.
            </Body>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="/contact">
                Book a Session
              </Link>
              <Link className="btn btn--ghost" href="/how-it-works">
                See How It Works
              </Link>
            </div>
            <div className="hero__divider" aria-hidden="true"></div>
            <Body className="text-sm text-neutral-500 text-center mt-6">
              Virtual friendly · Camera optional
            </Body>
          </div>
        </Section>

        <Section
          variant="base"
          className="intro-card !pt-24 !pb-12"
          aria-label="intro statement"
        >
          <div className="container">
            <SectionTitle className="section__title max-w-3xl mx-auto">There’s a lot of advice out there.</SectionTitle>
            <Body className="leading-relaxed max-w-2xl mx-auto">
              Most of it loud.
            </Body>
            <Body className="leading-relaxed max-w-2xl mx-auto">
              Some of it helpful.
            </Body>
            <Body className="leading-relaxed max-w-2xl mx-auto">
              Very little of it tailored to you.
            </Body>
            <Body className="font-medium text-neutral-800 leading-relaxed max-w-2xl mx-auto">
              You don’t need everything.
            </Body>
            <Body className="leading-relaxed max-w-2xl mx-auto">
              You don’t need the most expensive option.
            </Body>
            <Body className="leading-relaxed max-w-2xl mx-auto">
              And you definitely don’t need to feel overwhelmed.
            </Body>
            <Body className="leading-relaxed max-w-2xl mx-auto">
              Taylor-Made Baby Planning is calm, thoughtful guidance that helps you prepare intentionally — with products, decisions, and timelines that fit your real life.
            </Body>
            <div className="decorative-line" aria-hidden="true"></div>
          </div>
        </Section>
        <RibbonDivider />

        <section className="pt-32 pb-28 md:pb-32 px-6 bg-[#f4efe9] how-it-works-section">
          <div className="max-w-6xl mx-auto text-center">

            <h2 className="text-3xl md:text-4xl font-serif mb-24">
              How it works
            </h2>

            <div className="how-it-works-grid grid md:grid-cols-3 gap-16 md:gap-20 max-w-6xl mx-auto items-stretch">

              {/* Learn */}
              <div className="bg-white rounded-3xl p-16 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.06)]">
                <Image
                  src="/assets/icons/icon-learn.png"
                  alt="Learn"
                  width={112}
                  height={112}
                  className="mb-8 mx-auto w-28 h-auto"
                />
                <h3 className="text-2xl font-medium text-neutral-800 mt-2 mb-4">Learn</h3>
                <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  Understand what actually matters before deciding. No hype. Just clarity.
                </p>
              </div>

              {/* Plan */}
              <div className="bg-white rounded-3xl p-16 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.06)]">
                <Image
                  src="/assets/icons/icon-plan.png"
                  alt="Plan"
                  width={112}
                  height={112}
                  className="mb-8 mx-auto w-28 h-auto"
                />
                <h3 className="text-2xl font-medium text-neutral-800 mt-2 mb-4">Plan</h3>
                <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  Create a registry and preparation roadmap built around your lifestyle — not someone else’s checklist.
                </p>
              </div>

              {/* Try */}
              <div className="bg-white rounded-3xl p-16 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.06)]">
                <Image
                  src="/assets/icons/icon-try.png"
                  alt="Try"
                  width={112}
                  height={112}
                  className="mb-8 mx-auto w-28 h-auto"
                />
                <h3 className="text-2xl font-medium text-neutral-800 mt-2 mb-4">Try</h3>
                <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  Explore options confidently before committing, so your choices feel considered, not rushed.
                </p>
              </div>

            </div>

            <div className="mt-20 py-6 bg-[#eadfd6]">
              <div className="w-24 h-[1px] bg-neutral-300 mx-auto mb-6 opacity-40" />
            </div>

            <Body className="mt-8 text-center text-neutral-500 text-sm">
              Structured, calm guidance — not pressure.
            </Body>

          </div>
        </section>
        <Section variant="base" className="this-for-you" aria-label="this is for you">
          <div className="container">
            <SectionTitle className="section__title">This is for you if…</SectionTitle>
            <div className="this-for-you-grid">
              <Body className="body-copy--full"><span aria-hidden="true">✔</span> You feel overwhelmed by options</Body>
              <Body className="body-copy--full"><span aria-hidden="true">✔</span> You want a registry that fits your home and lifestyle</Body>
              <Body className="body-copy--full"><span aria-hidden="true">✔</span> You value thoughtful preparation</Body>
              <Body className="body-copy--full"><span aria-hidden="true">✔</span> You want experienced guidance</Body>
              <Body className="body-copy--full"><span aria-hidden="true">✔</span> You prefer clarity over confusion</Body>
            </div>
            <Body className="optional-small">It’s not about buying more.</Body>
            <Body className="optional-small">It’s about choosing well.</Body>
          </div>
        </Section>

        <Section variant="base" className="differentiator-section" aria-label="why this feels different">
          <div className="container">
            <Eyebrow className="mb-4">THE DIFFERENCE</Eyebrow>
            <SectionTitle className="section__title">Why this feels different</SectionTitle>
            <div className="differentiator-blurb space-y-6">
              <Lead className="text-taupe/80">
                If something works for you, great. If it doesn’t, we move on.
              </Lead>
              <div className="h-px bg-taupe/15"></div>
              <Body className="text-charcoal">
                Think experienced friend — but one who’s done the research.
              </Body>
              <div className="h-px bg-taupe/15"></div>
              <Body className="text-charcoal">
                Babies don’t arrive with a syllabus. We move step by step.
              </Body>
              <Body className="micro-note text-charcoal">Families leave feeling clearer, not pressured.</Body>
            </div>
          </div>
        </Section>

        <Section variant="base" aria-label="testimonial highlight">
          <div className="container card testimonial-card">
            {/* CARD: testimonial-1 */}
            <Body className="hero__subtitle">“Working with Taylor made everything feel manageable. We finally felt confident in our decisions instead of second-guessing them.”</Body>
            <Body className="hero__subtitle">— Expecting parent</Body>
          </div>
        </Section>

        <Section variant="base" className="band-white" aria-label="journal preview">
          <div className="container">
            <div className="journal-header">
              <SectionTitle className="section__title">Thoughtful notes</SectionTitle>
              <Lead className="hero__subtitle">Short reads for calmer planning.</Lead>
            </div>
            <div className="journal-grid">
              <Link className="journal-card" href="/blog">
                {/* IMAGE: blog-thumbnail-1 */}
                <Body className="body-copy--full">Building a Registry Without Overbuying</Body>
              </Link>
              <Link className="journal-card" href="/blog">
                {/* IMAGE: blog-thumbnail-2 */}
                <Body className="body-copy--full">Nursery Layout: What Actually Matters</Body>
              </Link>
            </div>
          </div>
        </Section>

        <div className="bg-gradient-to-b from-ivory to-blush-soft/30 py-12" aria-hidden="true"></div>

        <Section
          variant="base"
          className="final-cta"
          aria-label="closing call to action"
        >
          <div className="container hero__content">
            <SectionTitle className="section__title">Ready to enjoy baby prep?</SectionTitle>
            <Lead className="hero__subtitle">Let’s build a plan that feels calm, thoughtful, and tailored to you.</Lead>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="/contact">
                Book a Session
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <Section variant="neutral" className="trust-strip" aria-label="trust strip">
        <div className="container trust-strip__content">
          <span>Virtual friendly · Camera optional</span>
        </div>
      </Section>
    </SiteShell>
  );
}
