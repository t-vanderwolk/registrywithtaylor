import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';
import BookingSectionTracker from '@/components/analytics/BookingSectionTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'How It Works — Taylor-Made Baby Co.',
  description:
    'Understand how Taylor-Made Baby Co. guides couples through a step-by-step planning and registry process.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works planning process',
});

const primaryCtaClass =
  'btn btn--primary';

const secondaryCtaClass =
  'btn btn--secondary';

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm md:text-base leading-relaxed text-neutral-700">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(207,166,160,0.45)] bg-[rgba(207,166,160,0.14)] text-[11px] text-[var(--color-blush)]"
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 pt-2">
      {items.map((item) => (
        <ChecklistItem key={item}>{item}</ChecklistItem>
      ))}
    </ul>
  );
}

export default function HowItWorksPage() {
  return (
    <SiteShell currentPath="/how-it-works">
      <main className="site-main">
        <Hero
          image="/assets/hero/hero-02.jpg"
          imageAlt="How it works planning process"
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              How It Works
            </h1>

            <p className="hero-load-reveal hero-load-reveal--1 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              A calm, structured path from your complimentary consultation
              to a fully prepared home.
            </p>

            <p className="hero-load-reveal hero-load-reveal--2 max-w-2xl text-sm text-neutral-600 leading-relaxed">
              Consultation through Target Baby Concierge, with private planning available beyond.
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className={`${primaryCtaClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]`}
              >
                Schedule Your Complimentary Consultation
              </Link>

              <Link
                href="/services"
                className={`${secondaryCtaClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]`}
              >
                View Services
              </Link>
            </div>
          </div>
        </Hero>

        <section className="w-full bg-white border-t border-b border-charcoal/5">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-3 items-center text-center py-4 md:py-5 text-[10px] md:text-xs tracking-[0.16em] uppercase text-[#a68449]">
              <p>Baby Gear Specialist</p>
              <p className="border-l border-r border-charcoal/10 px-2 md:px-6">Brand-Trained Expertise</p>
              <p>Private Planning for Modern Families</p>
            </div>
          </div>
        </section>

        <MarketingSection
          id="step-1"
          tone="white"
          spacing="default"
          container="default"
          className="py-28 md:py-32"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <div className="rounded-2xl border border-black/5 bg-[rgba(255,255,255,0.72)] shadow-sm p-6 md:p-8 lg:p-10">
              <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-12 md:gap-16 items-stretch">
                <RevealOnScroll>
                  <div className="max-w-[560px] space-y-6">
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                    Start with Clarity
                  </h2>

                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Your journey begins with a complimentary virtual consultation through Target&apos;s Baby Concierge
                    program, where I serve as your dedicated specialist.
                  </p>

                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Whether you&apos;re just starting your registry or refining it, we begin with clarity around what
                    fits your real lifestyle, space, and priorities.
                  </p>

                  <Checklist
                    items={[
                      'Review your registry and starting point',
                      'Identify overbuying risks and gaps',
                      'Align purchases with your real lifestyle and space',
                    ]}
                  />

                  <p className="text-neutral-900 font-medium pt-4">
                    This isn’t about adding more.
                    It’s about choosing well from the start.
                  </p>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delayMs={120}>
                  <BookingSectionTracker
                    id="booking-section"
                    sourcePage="/how-it-works"
                    service="complimentary-consultation"
                    className="w-full h-full flex"
                  >
                    <div className="w-full max-w-[620px] md:ml-auto h-full flex flex-col space-y-6 rounded-2xl border border-black/5 bg-[rgba(248,244,240,0.78)] shadow-sm p-6 md:p-8">
                    <div className="text-center space-y-3">
                      <Image
                        src="/assets/brand/totsquad.png"
                        alt="Target Baby Concierge powered by Tot Squad"
                        width={360}
                        height={84}
                        className="mx-auto h-auto max-h-14 w-auto max-w-[320px] object-contain opacity-75"
                      />
                      <p className="text-sm text-neutral-600">
                        Consultation through Target Baby Concierge
                      </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-black/10 bg-white flex-1 min-h-[520px]">
                      <div
                        className="embedded-booking"
                        data-url="https://babyconcierge.totsquad.com"
                        data-query="&t=s&uuid=1ec6c642-8cf5-4096-a860-301523e75853"
                        data-employee="taylor-vanderwolk"
                        data-lang="en"
                        data-autoresize="0"
                        data-showsidebar="1"
                        data-showservices="0"
                        style={{ minWidth: 320, minHeight: 520, height: '100%' }}
                      />

                      <Script
                        src="https://babyconcierge.totsquad.com/embed.js"
                        strategy="afterInteractive"
                      />
                    </div>
                  </div>
                  </BookingSectionTracker>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="default"
          container="default"
          className="py-28 md:py-32"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <div className="rounded-2xl border border-black/5 bg-[rgba(255,255,255,0.62)] shadow-sm p-6 md:p-8 lg:p-10">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <RevealOnScroll>
                  <div className="flex justify-center group">
                    <div className="max-w-[500px] w-full">
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 shadow-sm bg-white">
                        <Image
                          src="/assets/editorial/step-2.png"
                          alt="Planning notebook with curated registry guidance materials"
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                          sizes="(max-width: 1024px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delayMs={110}>
                  <div className="max-w-[540px] space-y-7">
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
                    In your session, we review your registry, your home,
                    your lifestyle, and your timeline.
                  </p>

                  <p className="text-lg text-neutral-700 leading-relaxed">
                    We look at what’s essential, what’s unnecessary,
                    and what truly fits how you live.
                  </p>

                  <Checklist
                    items={[
                      'Thoughtful registry review',
                      'Space and lifestyle alignment',
                      'Product comparisons without pressure',
                    ]}
                  />

                    <p className="text-neutral-900 font-medium pt-4">
                      You leave feeling confident — not overwhelmed.
                    </p>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="default"
          container="default"
          className="relative overflow-visible py-28 md:py-32"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <div className="rounded-2xl border border-black/5 bg-[rgba(255,255,255,0.74)] shadow-sm p-6 md:p-8 lg:p-10">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <RevealOnScroll>
                  <div className="max-w-[540px] space-y-7">
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
                        className={`${secondaryCtaClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]`}
                      >
                        Explore Private Planning
                      </Link>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delayMs={110}>
                  <div className="flex justify-center group">
                    <div className="max-w-[500px] w-full">
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 shadow-sm bg-white">
                        <Image
                          src="/assets/editorial/step-3.png"
                          alt="Curated baby products arranged for implementation planning"
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                          sizes="(max-width: 1024px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>

        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="default"
          container="narrow"
          className="py-28 md:py-32"
        >
          <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
            <RevealOnScroll>
              <div className="rounded-2xl border border-black/5 bg-[rgba(255,255,255,0.72)] shadow-sm px-6 py-10 md:px-10 md:py-12 text-center space-y-6">
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
                This is where preparation becomes deeply personal — refined, structured, and fully aligned with your
                home and daily life.
              </p>

                <div className="pt-6">
                  <Link
                    href="/services"
                    className={`${primaryCtaClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]`}
                  >
                    View Private Planning Services
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
