import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';
import BookingSectionTracker from '@/components/analytics/BookingSectionTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import AuthorityStrip from '@/components/ui/AuthorityStrip';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import { Body, H2 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
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

const authorityItems = [
  'Baby Gear Specialist',
  'Brand-Trained Expertise',
  'Private Planning for Modern Families',
];

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-4 text-sm md:text-base leading-relaxed text-neutral-700">
      <CheckIcon />
      <span>{children}</span>
    </li>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-5 leading-relaxed pt-2">
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
          imageAlt=""
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              How It Works
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              A calm, structured path from your complimentary consultation
              to a fully prepared home.
            </Body>

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

        <section className="border-y border-black/5 bg-white py-4">
          <div className="container">
            <p className="text-center text-sm uppercase tracking-[0.2em] text-black/60 md:hidden">
              Baby Gear Specialist · Brand-Trained Expertise · Private Planning for Modern Families
            </p>
            <AuthorityStrip items={authorityItems} className="hidden mt-0 md:flex md:gap-8" />
          </div>
        </section>

        <MarketingSection
          id="step-1"
          tone="white"
          spacing="default"
          container="default"
          className="how-it-works-section"
        >
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSurface className="bg-[rgba(255,255,255,0.72)] p-5 sm:p-6 md:p-10">
              <div className="grid items-stretch gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16">
                <RevealOnScroll>
                  <div className="space-y-6 md:max-w-[560px]">
                    <H2 className="font-serif text-neutral-900">
                      Start with Clarity
                    </H2>

                    <Body className="text-neutral-700">
                      Your journey begins with a virtual consultation through Target&apos;s Baby Concierge program,
                      where I serve as your dedicated specialist.
                    </Body>

                    <Body className="text-neutral-700">
                      Whether you&apos;re just starting your registry or refining it, we begin with clarity around what
                      fits your real lifestyle, space, and priorities.
                    </Body>

                    <Checklist
                      items={[
                        'Review your registry and starting point',
                        'Identify overbuying risks and gaps',
                        'Align purchases with your real lifestyle and space',
                      ]}
                    />

                    <Body className="pt-4 font-medium text-neutral-900">
                      This isn’t about adding more.
                      It’s about choosing well from the start.
                    </Body>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delayMs={120} className="min-w-0">
                  <BookingSectionTracker
                    id="booking-section"
                    sourcePage="/how-it-works"
                    service="complimentary-consultation"
                    className="flex h-full w-full min-w-0"
                  >
                    <MarketingSurface className="flex h-full w-full min-w-0 max-w-none flex-col space-y-6 bg-[rgba(248,244,240,0.78)] p-4 sm:p-5 md:ml-auto md:max-w-[620px] md:p-10">
                      <div className="space-y-3 text-center">
                        <Image
                          src="/assets/brand/totsquad.png"
                          alt="Target Baby Concierge powered by Tot Squad"
                          width={360}
                          height={84}
                          className="mx-auto h-auto max-h-14 w-full max-w-[240px] object-contain opacity-75 sm:max-w-[320px]"
                        />
                        <p className="text-sm text-neutral-600">
                          Consultation through Target Baby Concierge
                        </p>
                      </div>

                      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-black/10 bg-white min-h-[520px]">
                        <div
                          className="embedded-booking min-w-0 w-full"
                          data-url="https://babyconcierge.totsquad.com"
                          data-query="&t=s&uuid=1ec6c642-8cf5-4096-a860-301523e75853"
                          data-employee="taylor-vanderwolk"
                          data-lang="en"
                          data-autoresize="0"
                          data-showsidebar="1"
                          data-showservices="0"
                          style={{ width: '100%', minWidth: 0, minHeight: 520, height: '100%' }}
                        />

                        <Script
                          src="https://babyconcierge.totsquad.com/embed.js"
                          strategy="afterInteractive"
                        />
                      </div>
                    </MarketingSurface>
                  </BookingSectionTracker>
                </RevealOnScroll>
              </div>
            </MarketingSurface>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="default"
          container="default"
          className="how-it-works-section"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <MarketingSurface className="bg-[rgba(255,255,255,0.62)]">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <RevealOnScroll>
                  <div className="flex justify-center group">
                    <div className="max-w-[500px] w-full">
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src="/assets/editorial/step-2.png"
                          alt=""
                          aria-hidden="true"
                          fill
                          className="rounded-2xl object-cover shadow-sm transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                          sizes="(max-width: 1024px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delayMs={110}>
                  <div className="max-w-[540px] space-y-7">
                    <h2 className="text-xs tracking-[0.35em] uppercase text-neutral-500">
                      During Your Consultation
                    </h2>

                    <h3 className="font-serif text-2xl tracking-tight text-neutral-900 md:text-3xl">
                      We Clarify What Actually Matters
                    </h3>

                  <Body className="text-neutral-700">
                    Most sessions are 30 minutes. We focus on what actually matters.
                  </Body>

                  <Body className="text-neutral-700">
                    In your session, we review your registry, your home,
                    your lifestyle, and your timeline.
                  </Body>

                  <Body className="text-neutral-700">
                    We look at what’s essential, what’s unnecessary,
                    and what truly fits how you live.
                  </Body>

                  <Checklist
                    items={[
                      'Thoughtful registry review',
                      'Space and lifestyle alignment',
                      'Product comparisons without pressure',
                    ]}
                  />

                    <Body className="pt-4 font-medium text-neutral-900">
                      You leave feeling confident — not overwhelmed.
                    </Body>
                  </div>
                </RevealOnScroll>
              </div>
            </MarketingSurface>
          </div>
        </MarketingSection>

        <MarketingSection
          tone="white"
          spacing="default"
          container="default"
          className="how-it-works-section relative overflow-visible"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <MarketingSurface className="bg-[rgba(255,255,255,0.74)]">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <RevealOnScroll>
                  <div className="max-w-[540px] space-y-7">
                    <h2 className="text-xs tracking-[0.35em] uppercase text-neutral-500">
                      After Your Session
                    </h2>

                    <h3 className="font-serif text-2xl tracking-tight text-neutral-900 md:text-3xl">
                      Move Forward With Confidence
                    </h3>

                  <Body className="text-neutral-700">
                    You’ll walk away knowing exactly what to buy,
                    what to remove, and what can wait.
                  </Body>

                  <Body className="text-neutral-700">
                    Many families feel fully confident after one session. Others continue with private planning for
                    deeper, tailored support.
                  </Body>

                  <Body className="pt-4 font-medium text-neutral-900">
                    Either way, your preparation becomes intentional.
                  </Body>

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
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src="/assets/editorial/step-3.png"
                          alt=""
                          aria-hidden="true"
                          fill
                          className="rounded-2xl object-cover shadow-sm transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                          sizes="(max-width: 1024px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </MarketingSurface>
          </div>

        </MarketingSection>

        <MarketingSection
          tone="ivory"
          spacing="default"
          container="narrow"
          className="how-it-works-section"
        >
          <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
            <RevealOnScroll>
              <MarketingSurface className="bg-[rgba(255,255,255,0.72)] text-center space-y-6">
                <h2 className="text-xs tracking-[0.35em] uppercase text-neutral-500">
                  Beyond the Consultation
                </h2>

              <h3 className="font-serif text-2xl tracking-tight text-neutral-900 md:text-3xl">
                Taylor-Made Baby Co.
              </h3>

              <Body className="mx-auto max-w-2xl text-neutral-700">
                For families who want continued support after their consultation, private planning offers deeper
                structure and thoughtful guidance.
              </Body>

              <Body className="mx-auto max-w-xl text-neutral-600">
                This is where preparation becomes deeply personal — refined, structured, and fully aligned with your
                home and daily life.
              </Body>

                <div className="pt-6">
                  <Link
                    href="/services"
                    className={`${primaryCtaClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]`}
                  >
                    View Private Planning Services
                  </Link>
                </div>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
