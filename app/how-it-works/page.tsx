import Link from 'next/link';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import AuthorityStrip from '@/components/ui/AuthorityStrip';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import { Body } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'How It Works - Taylor-Made Baby Co.',
  description:
    'Learn how the Taylor-Made Baby Co. process moves from a free consultation to confident registry decisions.',
  path: '/how-it-works',
  imagePath: '/assets/hero/hero-02.jpg',
  imageAlt: 'How it works process',
});

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

export default function HowItWorksPage() {
  return (
    <SiteShell currentPath="/how-it-works">
      <main className="site-main">
        <Hero image="/assets/hero/hero-02.jpg" imageAlt="How It Works">
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl tracking-tight text-neutral-900 md:text-6xl">
              How It Works
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--1 max-w-2xl text-neutral-700">
              A clear workflow from first conversation to final decisions.
            </Body>

            <p className="hero-load-reveal hero-load-reveal--2 text-sm uppercase tracking-[0.2em] text-charcoal/60">
              Learn - Plan - Try - Buy
            </p>

            <div className="hero-load-reveal hero-load-reveal--3 pt-3">
              <Link
                href="/consultation"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book Your Free Consultation
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

        <MarketingSection tone="white" spacing="default" container="default" className="how-it-works-section">
          <div className="mx-auto w-full max-w-5xl">
            <RevealOnScroll>
              <MarketingSurface className="space-y-7 bg-[rgba(255,255,255,0.74)]">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Step 1</p>
                <h2 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
                  Free 45-Minute Video Consultation
                </h2>
                <Body className="text-neutral-700">You meet directly with Taylor.</Body>
                <Body className="text-neutral-700">During this session you:</Body>
                <ul className="space-y-5 pt-1">
                  <ChecklistItem>Learn what baby gear actually matters</ChecklistItem>
                  <ChecklistItem>Plan your registry category by category</ChecklistItem>
                  <ChecklistItem>Understand safety, longevity, and daily use</ChecklistItem>
                  <ChecklistItem>Avoid unnecessary purchases</ChecklistItem>
                </ul>
                <Body className="font-medium text-neutral-900">This is the Learn + Plan phase.</Body>
                <div className="pt-2">
                  <Link
                    href="/consultation"
                    className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                  >
                    Book Your Free Consultation
                  </Link>
                </div>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="default" container="default" className="how-it-works-section">
          <div className="mx-auto w-full max-w-5xl">
            <RevealOnScroll>
              <MarketingSurface className="space-y-6 bg-[rgba(255,255,255,0.7)]">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Step 2</p>
                <h2 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
                  Try Before You Buy
                </h2>
                <Body className="text-neutral-700">
                  After the consultation you will know exactly what gear you want to experience in person.
                </Body>
                <Body className="text-neutral-700">
                  If visiting NYC: you can schedule a stroller consultation at Albee Baby where the team already knows
                  your preferences.
                </Body>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default" container="default" className="how-it-works-section">
          <div className="mx-auto w-full max-w-5xl">
            <RevealOnScroll>
              <MarketingSurface className="space-y-6 bg-[rgba(255,255,255,0.74)]">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Step 3</p>
                <h2 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
                  Buy With Confidence
                </h2>
                <Body className="text-neutral-700">
                  You finalize your registry and purchases with clarity.
                </Body>
                <p className="text-lg text-neutral-900">No panic. No second guessing. No wasted gear.</p>
              </MarketingSurface>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
