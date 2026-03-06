import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';
import ContactInquiryForm from '@/components/contact/ContactInquiryForm';
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
  title: 'How It Works - Taylor-Made Baby Co.',
  description:
    'Understand how Taylor-Made Baby Co. guides couples through a step-by-step planning and registry process.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works planning process',
});

const primaryCtaClass = 'btn btn--primary';
const secondaryCtaClass = 'btn btn--secondary';

const authorityItems = [
  'Baby Gear Specialist',
  'Brand-Trained Expertise',
  'Private Planning for Modern Families',
];

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-4 text-sm leading-relaxed text-neutral-700 md:text-base">
      <CheckIcon />
      <span>{children}</span>
    </li>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-5 pt-2 leading-relaxed">
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
        <Hero image="/assets/hero/hero-02.jpg" imageAlt="How it works planning process">
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl tracking-tight text-neutral-900 md:text-6xl">
              How It Works
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              A calm, structured path from your free 1:1 consultation to a fully prepared home.
            </Body>

            <p className="hero-load-reveal hero-load-reveal--2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Start with a free personal 30-minute video consultation to see if my services are the right fit.
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="#step-1-form"
                className={`${primaryCtaClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]`}
              >
                Start Your Free Consultation
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
              Baby Gear Specialist | Brand-Trained Expertise | Private Planning for Modern Families
            </p>
            <AuthorityStrip items={authorityItems} className="mt-0 hidden md:flex md:gap-8" />
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
                    <H2 className="font-serif text-neutral-900">Start with Clarity</H2>

                    <Body className="text-neutral-700">
                      We begin with a personal 1:1 free 30-minute consultation focused on your lifestyle, budget, and
                      stage of planning.
                    </Body>

                    <Body className="text-neutral-700">
                      This first call is designed to help you decide if my services are the right fit before you commit
                      to anything.
                    </Body>

                    <Checklist
                      items={[
                        'Share your registry goals and biggest concerns',
                        'Get clear on what support you actually need',
                        'See if my planning approach is the right fit for your family',
                      ]}
                    />

                    <Body className="pt-4 font-medium text-neutral-900">
                      No pressure. Just clear next steps.
                    </Body>

                    <div className="group flex justify-center pt-2">
                      <div className="w-full max-w-[500px]">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                          <Image
                            src="/assets/editorial/hoiwitworks1.png"
                            alt=""
                            aria-hidden="true"
                            fill
                            className="rounded-2xl object-cover shadow-sm transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                            sizes="(max-width: 1024px) 100vw, 500px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delayMs={120} className="min-w-0">
                  <div id="step-1-form">
                    <MarketingSurface className="flex h-full w-full min-w-0 max-w-none flex-col space-y-6 bg-[rgba(248,244,240,0.78)] p-4 sm:p-5 md:ml-auto md:max-w-[620px] md:p-10">
                      <div className="space-y-2 text-center">
                        <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Step 1</p>
                        <h3 className="font-serif text-2xl tracking-tight text-neutral-900">
                          Free 1:1 Consultation (30 Minutes)
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Submit the form below and your request will go directly to the admin portal for review.
                        </p>
                      </div>

                      <ContactInquiryForm
                        selectedService="consultation"
                        selectedFields={[]}
                        dueDateRequired={false}
                      />
                    </MarketingSurface>
                  </div>
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
              <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
                <RevealOnScroll>
                  <div className="group flex justify-center">
                    <div className="w-full max-w-[500px]">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
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
                    <h2 className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                      During Your Consultation
                    </h2>

                    <h3 className="font-serif text-2xl tracking-tight text-neutral-900 md:text-3xl">
                      We Clarify What Actually Matters
                    </h3>

                    <Body className="text-neutral-700">
                      Most sessions are 30 minutes. We focus on what actually matters.
                    </Body>

                    <Body className="text-neutral-700">
                      In your session, we review your registry, your home, your lifestyle, and your timeline.
                    </Body>

                    <Body className="text-neutral-700">
                      We look at what is essential, what is unnecessary, and what truly fits how you live.
                    </Body>

                    <Checklist
                      items={[
                        'Thoughtful registry review',
                        'Space and lifestyle alignment',
                        'Product comparisons without pressure',
                      ]}
                    />

                    <Body className="pt-4 font-medium text-neutral-900">
                      You leave feeling confident, not overwhelmed.
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
          className="relative overflow-visible how-it-works-section"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <MarketingSurface className="bg-[rgba(255,255,255,0.74)]">
              <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
                <RevealOnScroll>
                  <div className="max-w-[540px] space-y-7">
                    <h2 className="text-xs uppercase tracking-[0.35em] text-neutral-500">After Your Session</h2>

                    <h3 className="font-serif text-2xl tracking-tight text-neutral-900 md:text-3xl">
                      Move Forward With Confidence
                    </h3>

                    <Body className="text-neutral-700">
                      You will walk away knowing exactly what to buy, what to remove, and what can wait.
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
                  <div className="group flex justify-center">
                    <div className="w-full max-w-[500px]">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
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
              <MarketingSurface className="space-y-6 bg-[rgba(255,255,255,0.72)] text-center">
                <h2 className="text-xs uppercase tracking-[0.35em] text-neutral-500">Beyond the Consultation</h2>

                <h3 className="font-serif text-2xl tracking-tight text-neutral-900 md:text-3xl">
                  Taylor-Made Baby Co.
                </h3>

                <Body className="mx-auto max-w-2xl text-neutral-700">
                  For families who want continued support after their consultation, private planning offers deeper
                  structure and thoughtful guidance.
                </Body>

                <Body className="mx-auto max-w-xl text-neutral-600">
                  This is where preparation becomes deeply personal, refined, structured, and fully aligned with your
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
