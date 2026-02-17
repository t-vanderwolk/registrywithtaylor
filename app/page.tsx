import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Planning — Modern Baby Preparation',
  description:
    'Taylor-Made Baby Planning delivers calm, private guidance so expecting parents can prepare confidently without overwhelm.',
  path: '/',
  imagePath: '/assets/hero/hero-01.jpg',
  imageAlt: 'Taylor-Made Baby Planning hero background',
});

export default function HomePage() {
  const features = [
    'Clarity First',
    'Calm Over Chaos',
    'Strategy > Trends',
    'Smart, Not Sprawling',
  ];

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          eyebrow="Taylor-Made Baby Planning"
          title="Baby prep, simplified."
          subtitle="Because parenthood should start with confidence, not confusion."
          primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
          secondaryCta={{ label: 'View Services', href: '/services' }}
          tagline="Private · Personalized · No pressure"
          image="/assets/hero/hero-01.jpg"
          imageAlt="Taylor-Made Baby Planning hero background"
          className="hero-bottom-fade hero-home-radial pb-16 z-20"
          showRibbon
          ribbonEnhanced
          contentStyle={{
            backgroundImage:
              'radial-gradient(circle at 24% 34%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.5) 44%, rgba(248,244,240,0.2) 72%, rgba(248,244,240,0) 100%)',
            borderRadius: '1.5rem',
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 2.8vw, 2rem)',
          }}
        />

        <MarketingSection
          tone="white"
          container="default"
          className="relative !pt-24 md:!pt-28"
        >
          <h2 className="section-title text-center">
            There’s a lot of advice out there.
          </h2>

          <p className="mt-6 text-[var(--color-muted)] max-w-xl mx-auto text-center">
            Most of it loud. Some of it helpful. Very little of it tailored to you.
          </p>

          <p className="mt-6 max-w-2xl mx-auto text-center">
            Between registry lists, social media trends, and well-meaning opinions,
            it’s easy to feel pressured to buy everything immediately.
          </p>

          <div className="mt-6 mx-auto w-16 h-px bg-[var(--color-border-soft)]" />
        </MarketingSection>

        <MarketingSection tone="ivory" container="narrow">
          <div className="text-center space-y-6">
            <h2 className="section-title">
              What Does a Baby Planner Do?
            </h2>

            <p>
              A baby planner helps you prepare intentionally for life with a newborn — from
              registry strategy and nursery layout to smart purchasing timelines.
            </p>

            <p>
              It’s not about buying everything. It’s about buying the right things —
              so you can prepare intentionally, not reactively.
            </p>

            <div className="pt-4">
              <Link href="/how-it-works" className="btn btn--secondary">
                How It Works →
              </Link>
            </div>
          </div>
        </MarketingSection>

        <MarketingSection tone="blush" spacing="spacious">
          <div className="mx-auto max-w-[720px] px-6 text-center">

            <p className="mb-4 text-xs tracking-widest uppercase text-[var(--color-muted)]">
              Who This Is For
            </p>

            <h2 className="text-4xl md:text-5xl font-display leading-tight text-[var(--text-primary)] mb-8">
              This Is Designed for Parents Who…
            </h2>

            <ul className="space-y-5 text-lg leading-relaxed text-[var(--text-primary)] text-left mx-auto">

              <li className="flex gap-3 items-start">
                <span className="mt-1 text-[var(--color-muted)] text-base">✓</span>
                <span>
                  Feel overwhelmed by conflicting advice from friends, TikTok, and registry lists.
                </span>
              </li>

              <li className="flex gap-3 items-start">
                <span className="mt-1 text-[var(--color-muted)] text-base">✓</span>
                <span>
                  Don’t want to buy everything — <em>just the right things.</em>
                </span>
              </li>

              <li className="flex gap-3 items-start">
                <span className="mt-1 text-[var(--color-muted)] text-base">✓</span>
                <span>
                  Worry about wasting money on gear they’ll never use.
                </span>
              </li>

              <li className="flex gap-3 items-start">
                <span className="mt-1 text-[var(--color-muted)] text-base">✓</span>
                <span>
                  Want their nursery and registry to feel thoughtful — not chaotic.
                </span>
              </li>

              <li className="flex gap-3 items-start">
                <span className="mt-1 text-[var(--color-muted)] text-base">✓</span>
                <span>
                  Crave clarity, calm, and a plan that actually fits their life.
                </span>
              </li>

            </ul>

            <div className="mt-10">
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-medium tracking-wide text-[var(--text-primary)] shadow-sm hover:shadow-md transition"
              >
                See How It Works →
              </Link>
            </div>

          </div>
        </MarketingSection>

        {/* Ways We Can Work Together */}
        <MarketingSection tone="white" container="default">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl md:text-5xl">Ways We Can Work Together</h2>
            <p className="mt-4 text-lg text-[var(--color-muted)]">
              Thoughtful planning support tailored to your real life — calm, clear, and never trend-chasing.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="card card--service">
                <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">Registry</p>
                <h3 className="mt-2 font-display text-2xl">Registry Curation</h3>
                <p className="mt-3 text-[var(--color-muted)]">
                  Build a registry that fits your space, routines, and priorities — without the overwhelm spiral.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[var(--text-primary)]/80">
                  <li>• Category-by-category clarity</li>
                  <li>• Smart timing + what to skip</li>
                </ul>
                <div className="mt-6">
                  <a href="/services" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                    Learn more <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              <div className="card card--service">
                <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">Nursery</p>
                <h3 className="mt-2 font-display text-2xl">Nursery & Home Setup</h3>
                <p className="mt-3 text-[var(--color-muted)]">
                  Create a calm flow from day one — layout, essentials, and systems that make life easier.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[var(--text-primary)]/80">
                  <li>• Space planning + must-haves</li>
                  <li>• Organization that stays realistic</li>
                </ul>
                <div className="mt-6">
                  <a href="/services" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                    Learn more <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              <div className="card card--service">
                <p className="text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">Lifestyle</p>
                <h3 className="mt-2 font-display text-2xl">Gear Planning & Personal Shopping</h3>
                <p className="mt-3 text-[var(--color-muted)]">
                  Research-backed guidance so you can choose well — for your car, your walk, your travel, your baby.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[var(--text-primary)]/80">
                  <li>• Shortlists tailored to you</li>
                  <li>• Tradeoffs explained simply</li>
                </ul>
                <div className="mt-6">
                  <a href="/services" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                    Learn more <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <a href="/services" className="btn btn--secondary">
                View All Services <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </MarketingSection>

      {/* Founder Authority */}
      <MarketingSection tone="ivoryWarm" container="narrow">
        <div className="mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl">
            A Personal Note from Taylor
          </h3>

          <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
            After years in the baby gear industry — guiding families through registries,
            nursery builds, and major purchasing decisions — I saw how often preparation
            turned into pressure. 
          </p>

          <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]">
            Taylor-Made Baby Planning was created to replace overwhelm with clarity —
            so you can prepare intentionally, not reactively.
          </p>

          <div className="mt-8">
            <a href="/about" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
              Meet Taylor <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </MarketingSection>

        <MarketingSection tone="white" container="narrow">
          <div className="text-center space-y-6">
            <h2 className="section-title">
              What Parents Say
            </h2>

            <blockquote className="text-2xl font-serif italic">
              “We saved money and avoided buying what we didn’t need.”
            </blockquote>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
