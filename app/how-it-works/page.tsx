import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import SiteShell from '@/components/SiteShell';
import EndBowDivider from '@/components/layout/EndBowDivider';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'How It Works — Taylor-Made Baby Co.',
  description:
    'Understand how Taylor-Made Baby Co. guides couples through a step-by-step planning and registry process.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works planning process',
});

export default function HowItWorksPage() {
  return (
    <SiteShell currentPath="/how-it-works">
      <main className="site-main">
        <Hero
          showRibbon
          ribbonClassName="translate-y-1 md:translate-y-2"
          className="hero-bottom-fade pb-20 md:pb-24 z-20"
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

            <p className="mx-auto max-w-2xl text-center text-sm text-neutral-600 leading-relaxed">
              Complimentary consultation through Target Baby Concierge, with private planning available beyond.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn btn--primary"
              >
                Schedule Your Complimentary Consultation
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

        <section className="bg-white border-t border-b border-charcoal/5">
          <div className="grid grid-cols-3 items-center text-center py-4 md:py-5 text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#a68449]">
            <p>Baby Gear Specialist</p>
            <p className="border-l border-r border-charcoal/10 px-2 md:px-6">Brand Trained Expertise</p>
            <p>Private Planning for Modern Families</p>
          </div>
        </section>

        <MarketingSection
          id="step-1"
          tone="white"
          spacing="spacious"
          container="default"
          className="py-24 md:py-32"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-12 md:gap-16 items-stretch">

            {/* LEFT COLUMN — COPY */}
            <div className="max-w-[520px] space-y-6 pt-4 md:pt-8 pb-6 md:pb-8">

              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                Start with Clarity
              </h2>

              <p className="text-lg text-neutral-700 leading-relaxed">
                Your journey begins with a complimentary virtual consultation through Target&apos;s Baby Concierge
                program, where I serve as your dedicated specialist.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                Whether you&apos;re just starting your registry or refining it, we begin with clarity around what fits
                your real lifestyle, space, and priorities.
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
            <div className="w-full h-full flex">
              <div className="bg-[var(--color-ivory)] p-8 md:p-10 w-full max-w-[620px] md:ml-auto h-full flex flex-col space-y-6 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.06)]">

                <div className="text-center space-y-3">
                  <Image
                    src="/assets/brand/totsquad.png"
                    alt="Target Baby Concierge powered by Tot Squad"
                    width={360}
                    height={84}
                    className="mx-auto h-auto max-h-14 w-auto max-w-[320px] object-contain opacity-75"
                  />
                  <p className="text-sm text-neutral-600">
                    Complimentary consultation through Target Baby Concierge
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white flex-1 min-h-[540px]">

                  <div
                    className="embedded-booking"
                    data-url="https://babyconcierge.totsquad.com"
                    data-query="&t=s&uuid=1ec6c642-8cf5-4096-a860-301523e75853"
                    data-employee="taylor-vanderwolk"
                    data-lang="en"
                    data-autoresize="0"
                    data-showsidebar="1"
                    data-showservices="0"
                    style={{ minWidth: 320, minHeight: 540, height: '100%' }}
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
                In 30 focused minutes, we concentrate on what actually matters.
              </p>

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
                You leave feeling confident — not overwhelmed.
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
                Many families feel fully confident after one session. Others continue with private planning for
                deeper, tailored support.
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
              For families who want continued support after their consultation, private planning offers deeper
              structure and thoughtful guidance.
            </p>

            <p className="text-neutral-600 leading-relaxed max-w-xl mx-auto">
              This is where preparation becomes deeply personal — refined, structured, and fully aligned with your home and daily life.
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
              Begin with a complimentary consultation and move forward with a clear, grounded plan.
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Schedule Your Complimentary Consultation
              </Link>
            </div>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
