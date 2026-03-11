import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import {
  WHAT_I_HELP_FAMILIES_CHOOSE_ITEMS,
  WHAT_I_HELP_FAMILIES_CHOOSE_TITLE,
} from '@/lib/marketing/copy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'About — Taylor-Made Baby Co.',
  description:
    'Learn how Taylor-Made Baby Co. helps families sort baby gear, registries, nurseries, and home prep with practical expert guidance.',
  path: '/about',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'About Taylor-Made Baby Co.',
});

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about">
      <main className="site-main">
        <Hero
          image="/assets/hero/hero-05.jpg"
          imageAlt="Soft baby essentials arranged for planning"
        >
          <div className="space-y-6">
            <p className="hero-load-reveal text-xs uppercase tracking-[0.3em] text-neutral-600">
              Meet Taylor
            </p>

            <h1 className="marketing-hero-headline hero-load-reveal hero-load-reveal--1">
              A Baby Gear Expert for the Real-Life Details of Early Parenthood
            </h1>

            <Body className="hero-load-reveal hero-load-reveal--2 max-w-xl text-neutral-700">
              I help families sort registry strategy, strollers, car seats, nursery setup, and the other baby-prep decisions that stack up fast.
            </Body>

            <div className="hero-load-reveal hero-load-reveal--3 flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/consultation"
                className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <RevealOnScroll>
                <div className="relative mx-auto w-full max-w-[420px] lg:mx-0">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/5 shadow-sm">
                    <Image
                      src="/assets/editorial/taylor.png"
                      alt="Taylor Vanderwolk, Founder of Taylor-Made Baby Co."
                      fill
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </RevealOnScroll>

              <div className="space-y-8">
                <RevealOnScroll delayMs={60}>
                  <H2 className="font-serif text-neutral-900">
                    A Baby Gear Expert in the Details
                  </H2>
                </RevealOnScroll>

                <RevealOnScroll delayMs={120}>
                  <Body className="max-w-2xl text-neutral-700">
                    I am a Baby Gear Expert and Registry Consultant who helps families figure out what to buy, what to
                    skip, and what can wait.
                  </Body>
                </RevealOnScroll>

                <RevealOnScroll delayMs={180}>
                  <div className="max-w-2xl space-y-6 text-left">
                    <Body className="text-neutral-700">
                      Here&apos;s the tea: baby gear gets confusing fast, and the early decisions matter more than they
                      look at first.
                    </Body>

                    <Body className="text-neutral-700">
                      With hands-on experience across premium retail floors, national pilot programs, and private
                      consulting, I&apos;ve guided hundreds of families through the early decisions that shape day-to-day
                      life with a baby.
                    </Body>

                    <Body className="text-neutral-700">
                      From registry structure to stroller and car seat strategy to feeding gear, sleep space, and
                      nursery flow, my work lives at the intersection of safety, design, and real-life functionality.
                    </Body>

                    <Body className="text-neutral-700">
                      When you invite me into that space - into your home, your routines, your questions at 10 p.m. - you&apos;re
                      trusting me with more than a checklist. You&apos;re trusting me with your story.
                    </Body>

                    <Body className="text-neutral-700">That&apos;s a responsibility I don&apos;t take lightly.</Body>

                    <Body className="text-neutral-700">
                      My role isn&apos;t to sell you more. It&apos;s to help you build a baby setup that works in your actual
                      home and routine.
                    </Body>

                    <Body className="font-medium text-neutral-900">{WHAT_I_HELP_FAMILIES_CHOOSE_TITLE}</Body>

                    <ul className="space-y-5 pt-2 leading-relaxed text-neutral-700">
                      {WHAT_I_HELP_FAMILIES_CHOOSE_ITEMS.map((item) => (
                        <li key={item} className="flex items-start gap-4">
                          <CheckIcon />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="max-w-2xl mx-auto space-y-8">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">
                The Taylor-Made Approach
              </H2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="space-y-1 pt-1">
                <H3 className="font-serif text-neutral-900">Real life over registry noise.</H3>
                <H3 className="font-serif text-neutral-900">Fit over features.</H3>
                <H3 className="font-serif text-neutral-900">Buy with purpose, not pressure.</H3>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={170}>
              <div className="space-y-6">
                <Body className="text-neutral-700">
                  Today&apos;s baby market offers endless options - and endless opinions. But more options don&apos;t create
                  better decisions. They create pressure.
                </Body>

                <Body className="text-neutral-700">The Taylor-Made approach is built on real-life fit.</Body>

                <Body className="text-neutral-700">
                  We slow the process down.
                  <br />
                  We look at how you actually live.
                  <br />
                  We consider your space, your routines, your budget, and your long-term plans.
                </Body>

                <Body className="text-neutral-700">Then we figure out what to buy, what to skip, and what can wait.</Body>

                <Body className="text-neutral-700">
                  No panic buying.
                  <br />
                  No trend chasing.
                  <br />
                  No &quot;just in case&quot; overload.
                </Body>

                <Body className="text-neutral-700">Just practical decisions that make sense for your real life.</Body>

                <Body className="text-neutral-700">Because the goal isn&apos;t to have everything.</Body>

                <Body className="text-neutral-700">It&apos;s to have what fits.</Body>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="max-w-2xl mx-auto space-y-7">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">
                What Makes This Different
              </H2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="space-y-6">
                <H3 className="text-neutral-900">Most baby guidance starts with products.</H3>
                <H3 className="text-neutral-900">This starts with how you actually live.</H3>

                <Body className="text-neutral-700">
                  Your home.
                  <br />
                  Your routines.
                  <br />
                  Your comfort level with risk, spending, and space.
                  <br />
                  Your decision-making style.
                </Body>

                <Body className="text-neutral-700">This isn&apos;t a template registry.</Body>
                <Body className="text-neutral-700">It isn&apos;t a sales floor disguised as advice.</Body>
                <Body className="text-neutral-700">And it isn&apos;t a checklist handed over and forgotten.</Body>

                <Body className="text-neutral-700">It&apos;s structured support for registry decisions, gear comparisons, nursery setup, and the daily details around getting ready for baby.</Body>

                <Body className="text-neutral-700">
                  Baby prep is nuanced. Emotional. Sometimes overwhelming in ways no one talks about.
                </Body>

                <Body className="text-neutral-700">
                  What makes this different is the level of care and discernment applied to every recommendation,
                  every comparison, every pause before a purchase.
                </Body>

                <H3 className="text-neutral-900">Not louder.</H3>
                <H3 className="text-neutral-900">Just more useful.</H3>

                <Body className="text-neutral-700">Because when baby prep fits your real life, the next season feels a whole lot steadier.</Body>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" container="wide" spacing="default">
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <RevealOnScroll>
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                Trusted retail and service partners.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
                <Image
                  src="/assets/brand/albeebaby.png"
                  alt="Albee Baby"
                  width={190}
                  height={52}
                  className="h-8 md:h-9 w-auto opacity-70 grayscale"
                />
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
