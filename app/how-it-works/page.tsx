import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import SiteShell from '@/components/SiteShell';
import EndBowDivider from '@/components/layout/EndBowDivider';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { Body, Lead, SectionTitle } from '@/components/Typography';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'How It Works — Taylor-Made Baby Co.',
  description:
    'Understand how Taylor-Made Baby Co. guides couples through a step-by-step planning and registry process.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works planning process',
});

const steps = [
  {
    title: 'Learn what each category does.',
    description:
      'Calm explanations replace guesswork so you know what each category is for before buying a single thing.',
    reassurance: 'Understanding without pressure.',
    icon: '/assets/icons/icon-learn.png',
  },
  {
    title: 'Plan your registry around your real life.',
    description:
      'Intentional decisions take the place of filler items so every add-on fits your space, routine, and vibe.',
    reassurance: 'Personalized planning.',
    icon: '/assets/icons/icon-plan.png',
  },
  {
    title: 'Try the gear with confidence.',
    description:
      'Walk into a store, demo a stroller, or test a product — you’ll know exactly what to look for.',
    reassurance: 'Hands-on confidence.',
    icon: '/assets/icons/icon-try.png',
  },
  {
    title: 'Buy what fits — skip what doesn’t.',
    description:
      'When you already understand the why, solid choices feel easy, intuitive, and aligned with your life.',
    reassurance: 'Decisions that fit you.',
    icon: '/assets/icons/icon-buy.png',
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell currentPath="/how-it-works">
      <main className="site-main">
        <Hero
          showRibbon
          ribbonEnhanced
          className="hero-bottom-fade pb-16 z-20"
          contentClassName="max-w-2xl"
          contentStyle={{
            borderRadius: '32px',
            padding: '3.5rem 3rem',
          }}
          image="/assets/hero/hero-02.jpg"
          imageAlt="How it works planning process"
        >
          <div className="space-y-6">

            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              How It Works
            </h1>

            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              A calm, structured path from your complimentary consultation
              to a fully prepared home.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn btn--primary"
              >
                Book a Complimentary Consultation
              </Link>

              <Link
                href="/services"
                className="btn btn--secondary"
              >
                View Services
              </Link>
            </div>

          </div>
        </Hero>

        <MarketingSection
          id="step-1"
          tone="white"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">

            {/* LEFT COLUMN — COPY */}
            <div className="max-w-[520px] space-y-7">

              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                Start with Clarity
              </h2>

              <p className="text-lg text-neutral-700 leading-relaxed">
                Your journey begins with a complimentary virtual consultation
                offered through the Target Baby Concierge program powered by Tot Squad.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                After creating your Target registry, you can schedule your session —
                where I will personally serve as your dedicated Baby Specialist,
                guiding you through every decision with clarity and intention.
              </p>

              <ul className="space-y-3 pt-2 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  Review your registry and starting point
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  Identify overbuying risks and gaps
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  Align purchases with your real lifestyle and space
                </li>
              </ul>

              <p className="text-neutral-900 font-medium pt-4">
                This isn’t about adding more.
                It’s about choosing well from the start.
              </p>

            </div>

            {/* RIGHT COLUMN — DIRECT BOOKING CARD */}
            <div className="flex justify-center">
              <div className="bg-[var(--color-ivory)] p-10 max-w-md w-full space-y-6 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.06)]">

                <div className="text-center space-y-2">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    Book Your Complimentary Consultation
                  </p>
                  <p className="text-sm text-neutral-600">
                    Complimentary session through the Target Baby Concierge program powered by Tot Squad — with Taylor as your dedicated Baby Specialist.
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white">

                  <div
                    className="embedded-booking"
                    data-url="https://babyconcierge.totsquad.com"
                    data-query="&t=s&uuid=1ec6c642-8cf5-4096-a860-301523e75853"
                    data-employee="taylor-vanderwolk"
                    data-lang="en"
                    data-autoresize="0"
                    data-showsidebar="1"
                    data-showservices="0"
                    style={{ minWidth: 320, height: 650 }}
                  />

                  <Script
                    src="https://babyconcierge.totsquad.com/embed.js"
                    strategy="afterInteractive"
                  />

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
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

            {/* LEFT COLUMN — IMAGE (keep existing if desired) */}
            <div className="flex justify-center group">
              <div className="max-w-[440px] w-full">
                <div className="service-preview-image service-preview-image--normal relative w-full aspect-square overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
                  <Image
                    src="/assets/editorial/step-2.png"
                    alt="Planning notebook with curated registry guidance materials"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 440px"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — COPY */}
            <div className="max-w-[520px] space-y-7">

              <p className="text-xs tracking-[0.35em] uppercase text-neutral-500">
                During Your Consultation
              </p>

              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                We Clarify What Actually Matters
              </h2>

              <p className="text-lg text-neutral-700 leading-relaxed">
                In your complimentary session, we review your registry, your home,
                your lifestyle, and your timeline.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                We look at what’s essential, what’s unnecessary,
                and what truly fits how you live.
              </p>

              <ul className="space-y-3 pt-2 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  Thoughtful registry review
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  Space and lifestyle alignment
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  Product comparisons without pressure
                </li>
              </ul>

              <p className="text-neutral-900 font-medium pt-4">
                You leave with clarity — not overwhelm.
              </p>

            </div>

          </div>
        </MarketingSection>
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="relative overflow-visible"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

            {/* LEFT COLUMN — COPY */}
            <div className="max-w-[520px] space-y-7">

              <p className="text-xs tracking-[0.35em] uppercase text-neutral-500">
                After Your Session
              </p>

              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                Move Forward With Confidence
              </h2>

              <p className="text-lg text-neutral-700 leading-relaxed">
                You’ll walk away knowing exactly what to buy,
                what to remove, and what can wait.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                Some families feel fully confident after one session.
                Others choose to continue with private planning support
                through Taylor-Made Baby Co.
              </p>

              <p className="text-neutral-900 font-medium pt-4">
                Either way, your preparation becomes intentional.
              </p>

              <div className="pt-4">
                <Link
                  href="/services"
                  className="btn btn--secondary"
                >
                  Explore Private Planning
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN — IMAGE */}
            <div className="flex justify-center group">
              <div className="max-w-[440px] w-full">
                <div className="service-preview-image service-preview-image--reverse relative w-full aspect-square overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
                  <Image
                    src="/assets/editorial/step-3.png"
                    alt="Curated baby products arranged for implementation planning"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 440px"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="absolute left-1/2 w-screen -translate-x-1/2 z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
            <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72]" />
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="narrow"
        >
          <div className="text-center space-y-6">

            <p className="text-xs tracking-[0.35em] uppercase text-neutral-500">
              Beyond the Consultation
            </p>

            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
              Taylor-Made Baby Co.
            </h2>

            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              For families who want continued structure, thoughtful decision-making,
              and hands-on guidance beyond their initial registry consultation,
              private planning support is available.
            </p>

            <p className="text-neutral-600 leading-relaxed max-w-xl mx-auto">
              From nursery design to complete gear strategy and personal shopping,
              this is where preparation becomes fully tailored.
            </p>

            <div className="pt-6">
              <Link
                href="/services"
                className="btn btn--primary"
              >
                View Private Planning Services
              </Link>
            </div>

          </div>
        </MarketingSection>

        <MarketingSection tone="blush" container="narrow" spacing="spacious">
          <div className="text-center space-y-8">

            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[var(--text-primary)]">
              Start with confidence.
            </h2>

            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
              Begin with a complimentary consultation and move forward with clarity — grounded, intentional, and even a little exciting.
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book Your Complimentary Consultation
              </Link>
            </div>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
