import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import { SectionTitle } from '@/components/Typography';
import EndBowDivider from '@/components/layout/EndBowDivider';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Services — Taylor-Made Baby Co.',
  description:
    'Bespoke baby planning services from Taylor-Made Baby Co. covering registries, nursery design, events, and ongoing support.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Service consultation planning',
});

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Hero
          eyebrow="Services"
          title="Bespoke Planning Services"
          subtitle="Preparation doesn’t have to feel chaotic. It can feel steady. Structured. Thoughtful."
          primaryCta={{ label: 'Begin with a Consultation →', href: '/book' }}
          image="/assets/hero/hero-03.jpg"
          imageAlt="Service consultation planning"
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
          spacing="spacious"
          container="default"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">

            <SectionTitle>
              Bespoke Baby Planning Services
            </SectionTitle>

            <p className="text-neutral-700 leading-relaxed text-lg">
              You don’t need more opinions.
              <br />
              You need a plan that fits your life.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-blush)] text-white px-8 py-3 text-sm tracking-wide transition hover:opacity-90"
              >
                Book a Consultation
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-8 py-3 text-sm tracking-wide transition hover:bg-neutral-100"
              >
                How It Works
              </Link>
            </div>

          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="default"
          container="default"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

            <div className="space-y-3">
              <p className="font-serif text-lg">Clarity before checkout.</p>
            </div>

            <div className="space-y-3">
              <p className="font-serif text-lg">Confidence before comparison.</p>
            </div>

            <div className="space-y-3">
              <p className="font-serif text-lg">A plan before you purchase.</p>
            </div>

          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-6xl mx-auto">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-[-0.02em]">
                Support, structured around you.
              </h2>

              <p className="uppercase tracking-[0.25em] text-xs text-neutral-500">
                Choose your planning experience
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

              {/* The Focused Edit */}
              <div className="rounded-3xl bg-white shadow-sm hover:shadow-md transition p-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl">The Focused Edit</h3>
                  <p className="text-neutral-600">A clear starting point</p>
                </div>

                <ul className="space-y-3 text-neutral-700">
                  <li>✓ 1 Planning Session</li>
                  <li>✓ Registry or Nursery Review</li>
                  <li>✓ Personalized Action Plan</li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm tracking-wide transition hover:bg-neutral-100"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* The Signature Plan (Most Popular) */}
              <div className="relative rounded-3xl bg-white shadow-md p-10 space-y-6">

                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-blush)] text-white text-xs tracking-wide px-4 py-1 rounded-full">
                  Most Popular
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl">The Signature Plan</h3>
                  <p className="text-neutral-600">A guided preparation journey</p>
                </div>

                <ul className="space-y-3 text-neutral-700">
                  <li>✓ 3 Planning Sessions</li>
                  <li>✓ Registry + Nursery Planning</li>
                  <li>✓ Timeline + Product Guidance</li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-blush)] text-white px-6 py-3 text-sm tracking-wide transition hover:opacity-90"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* The Private Concierge */}
              <div className="rounded-3xl bg-white shadow-sm hover:shadow-md transition p-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl">The Private Concierge</h3>
                  <p className="text-neutral-600">Your on-call pregnancy partner</p>
                </div>

                <ul className="space-y-3 text-neutral-700">
                  <li>✓ Ongoing Support</li>
                  <li>✓ Full Strategy + Planning</li>
                  <li>✓ Real-Time Guidance</li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm tracking-wide transition hover:bg-neutral-100"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-3xl mx-auto text-center space-y-10">

            {/* Partnership Label */}
            <p className="uppercase tracking-[0.2em] text-xs text-neutral-500">
              In Partnership With
            </p>

            {/* Albee Baby Logo */}
            <Image
              src="/assets/brand/albeebaby.png"
              alt="Albee Baby"
              width={180}
              height={48}
              className="mx-auto opacity-90"
            />

            {/* Headline */}
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] tracking-[-0.01em]">
              NYC In-Store Blueprint
            </h2>

            {/* Body Copy */}
            <p className="text-neutral-700 leading-relaxed text-lg">
              Before you walk into your in-store appointment, we handle the Learn and Plan.
            </p>

            <p className="text-neutral-600 leading-relaxed">
              You’ll arrive clear on your needs, confident in your budget,
              and ready to test and compare with purpose.
              The Albee Baby team will already be up to speed on your priorities,
              so your time in-store is productive — not overwhelming.
            </p>

            {/* CTA */}
            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-8 py-3 text-sm tracking-wide transition hover:bg-neutral-100"
              >
                Explore the NYC Blueprint
              </Link>
            </div>

          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-5xl mx-auto">

            <SectionTitle className="text-center">
              Additional Support
            </SectionTitle>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <div className="space-y-4">
                <h4 className="font-serif text-xl">Shower Registry Coordination</h4>
                <p className="text-neutral-600">Strategic oversight to prevent duplicates and gaps.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-xl">Travel Gear Planning</h4>
                <p className="text-neutral-600">Solutions for flights, road trips, and second homes.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-xl">Sibling & Pet Preparation</h4>
                <p className="text-neutral-600">Guidance for smooth family transitions.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-xl">Postpartum Home Setup</h4>
                <p className="text-neutral-600">Practical comfort planning before baby arrives.</p>
              </div>
            </div>

          </div>
        </MarketingSection>

        {/* End Bow Divider */}
        <div className="relative w-full -mt-24 md:-mt-32 z-20">
          <EndBowDivider />
        </div>

        <MarketingSection
          tone="ivoryWarm"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-2xl font-serif leading-relaxed">
              “I walked into the baby store already knowing what we needed.
              No panic. No second-guessing. Just clarity.”
            </p>
            <p className="text-neutral-600">— TMBC Client</p>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="blush"
          spacing="spacious"
          container="default"
        >
          <div>
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <SectionTitle>
                Start with clarity.
              </SectionTitle>

              <p className="text-neutral-700">
                Preparation doesn’t have to feel chaotic.
                It can feel steady. Structured. Supported.
              </p>

              <div>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-full bg-white text-neutral-900 px-8 py-3 text-sm tracking-wide transition hover:opacity-90"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
