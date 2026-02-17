import Image from 'next/image';
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

        <MarketingSection
          container="default"
          className="bg-[var(--color-ivory)] py-32"
        >
          <div className="clarity-grid mx-auto max-w-6xl">

            {/* LEFT COLUMN — Text (two stacked blocks) */}
            <div className="clarity-left">

              {/* TOP TEXT BLOCK: headline, body, CTA */}
              <div className="space-y-8 max-w-xl">
                <h2 className="text-4xl lg:text-5xl font-serif text-[var(--text-primary)] leading-tight">
                  Designed for clarity, not chaos.
                </h2>

                <div className="space-y-6 text-lg text-[var(--color-muted)] leading-relaxed">
                  <p>
                    A baby planner helps you prepare intentionally for life with a newborn —
                    from registry strategy and nursery layout to smart purchasing timelines
                    and thoughtful decision guidance.
                  </p>

                  <p>
                    It’s not about buying everything —
                    <span className="italic"> it’s about buying the right things.</span>
                    So you can prepare intentionally, not reactively.
                  </p>
                </div>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center px-8 py-3 rounded-full border border-[var(--color-border-soft)] text-sm tracking-wide uppercase hover:bg-[var(--color-blush-soft)] transition-all duration-300"
                >
                  How It Works →
                </Link>
              </div>

              {/* BOTTOM TEXT BLOCK: “For parents who” list */}
              <div className="space-y-6 max-w-xl">
                <p className="text-xs tracking-[0.35em] uppercase text-[var(--color-muted)]">
                  For parents who
                </p>

                <ul className="space-y-4 text-[var(--color-muted)] leading-relaxed">
                  <li className="flex gap-3">
                    <span className="opacity-40">—</span>
                    <span>Feeling overwhelmed by conflicting advice and trends.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="opacity-40">—</span>
                    <span>Want to avoid impulse purchases and wasted money.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="opacity-40">—</span>
                    <span>Hoping for thoughtful planning, not pressure or chaos.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="opacity-40">—</span>
                    <span>Crave clarity, calm, and a plan that fits their life.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* RIGHT COLUMN — Editorial Image (full height) */}
            <div className="clarity-image-col">
              <div className="clarity-image-shell">
                <Image
                  src="/assets/editorial/growing-with-confidence.jpg"
                  alt="Growing with confidence editorial image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
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

        {/* Testimonials */}
        <MarketingSection tone="ivory" container="narrow" spacing="spacious">
          <div className="text-center space-y-10">

            <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)]">
              What Parents Say
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="w-16 h-px bg-[var(--color-muted)] mx-auto opacity-40" />
              
              <p className="text-3xl md:text-4xl font-serif italic text-[var(--text-primary)] leading-relaxed">
                “We saved money and avoided buying what we didn’t need.”
              </p>

              <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">
                First-Time Parents · Scottsdale
              </p>

            </div>

          </div>
        </MarketingSection>

        {/* Journal Highlight */}
        <MarketingSection tone="ivoryWarm" container="default" spacing="spacious">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left Editorial Intro */}
            <div className="space-y-6">

              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
                From The Journal
              </p>

              <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-tight">
                Thoughtful guidance for modern parents
              </h2>

              <p className="text-lg text-[var(--color-muted)] max-w-lg">
                Honest, grounded conversations about baby gear, 
                preparation, and making decisions with clarity — 
                not pressure.
              </p>

              <a
                href="/blog"
                className="inline-block text-sm uppercase tracking-widest border-b border-[var(--text-primary)] pb-1 hover:opacity-70 transition"
              >
                View All Articles →
              </a>

            </div>

            {/* Featured Article Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[rgba(0,0,0,0.05)] p-10 space-y-6">

              <h3 className="text-2xl font-serif text-[var(--text-primary)]">
                The Art of the Registry
              </h3>

              <p className="text-[var(--color-muted)] leading-relaxed">
                How to prepare for baby without overbuying, 
                overspending, or feeling overwhelmed.
              </p>

              <a
                href="/blog/the-art-of-the-registry"
                className="inline-flex items-center text-sm uppercase tracking-widest text-[var(--text-primary)] hover:opacity-70 transition"
              >
                Read the Article →
              </a>

            </div>

          </div>
        </MarketingSection>

        {/* Final Call To Action */}
        <MarketingSection tone="blush" container="narrow" spacing="spacious">
          <div className="text-center space-y-8">

            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[var(--text-primary)]">
              Start with confidence.
            </h2>

            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
              Begin with a complimentary consultation and move forward with clarity — grounded, intentional, and even a little exciting.
            </p>

            <div className="pt-4">
              <a
                href="/contact"
                className="btn btn--primary"
              >
                Book Your Complimentary Consultation
              </a>
            </div>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
