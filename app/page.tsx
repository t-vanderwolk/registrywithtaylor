'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Hero from '@/components/ui/Hero';
import MarketingSection from '@/components/layout/MarketingSection';
import EndBowDivider from '@/components/layout/EndBowDivider';
import SiteShell from '@/components/SiteShell';
import ServiceFeatureRow from '@/components/home/ServiceFeatureRow';

export default function HomePage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const secondaryCtaClass =
    'btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';

  const features = [
    'Clarity First',
    'Calm Over Chaos',
    'Strategy > Trends',
    'Smart, Not Sprawling',
  ];
  const serviceOffers = [
    {
      id: 'registry',
      label: 'Registry',
      title: 'Registry Curation',
      description: 'Build a registry that fits your space, routines, and priorities — without the overwhelm spiral.',
      detailedBullets: [
        {
          emoji: '📅',
          text: 'Smart timing',
        },
        {
          emoji: '✅',
          text: 'Category clarity',
        },
        {
          emoji: '📝',
          text: 'Planning strategy',
        },
        {
          emoji: '🎯',
          text: 'Focused must-haves',
        },
        {
          emoji: '💡',
          text: 'What to skip',
        },
      ],
      image: '/assets/services/registry-guidance.jpg',
      alt: 'Registry planning editorial',
      href: '/services',
    },
    {
      id: 'nursery',
      label: 'Nursery',
      title: 'Nursery & Home Setup',
      description: 'Create a calm flow from day one — layout, essentials, and systems that make life easier.',
      detailedBullets: [
        {
          emoji: '🛏️',
          text: 'Room layout planning',
        },
        {
          emoji: '📐',
          text: 'Space optimization',
        },
        {
          emoji: '🧺',
          text: 'Storage systems',
        },
        {
          emoji: '🏡',
          text: 'Flow & functionality',
        },
        {
          emoji: '🪴',
          text: 'Calm environment styling',
        },
      ],
      image: '/assets/services/nursery-design.jpg',
      alt: 'Nursery design editorial',
      href: '/services',
    },
    {
      id: 'lifestyle',
      label: 'Lifestyle',
      title: 'Gear Planning & Personal Shopping',
      description: 'Research-backed guidance so you can choose well — for your car, your walk, your travel, your baby.',
      detailedBullets: [
        {
          emoji: '🛒',
          text: 'Smart purchasing strategy',
        },
        {
          emoji: '🚗',
          text: 'Car seat & travel planning',
        },
        {
          emoji: '🧳',
          text: 'Lifestyle compatibility',
        },
        {
          emoji: '🔍',
          text: 'Brand comparisons',
        },
        {
          emoji: '💳',
          text: 'Budget alignment',
        },
      ],
      image: '/assets/services/personal-shopping.jpg',
      alt: 'Personal shopping editorial',
      href: '/services',
    },
  ];

  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          showRibbon
          ribbonClassName="translate-y-1 md:translate-y-2"
          className="pb-20 md:pb-24"
          contentClassName="max-w-xl"
          image="/assets/hero/hero-01.jpg"
          imageAlt="Taylor-Made Baby Co. hero background"
        >
          <h1 className="text-5xl md:text-6xl font-serif leading-[1.1] mb-6">
            Baby prep, simplified.
          </h1>

          <p className="text-lg md:text-xl text-neutral-700 mb-6 max-w-[52ch]">
            Because parenthood should start with confidence, not confusion.
          </p>

          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500 mb-10">
            Bespoke baby planning services
            <br className="hidden sm:block" />
            Registry · Nursery · Gear Strategy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/contact"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Schedule a Complimentary Consultation
            </Link>

            <Link
              href="/services"
              className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              View Services
            </Link>
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Private · Personalized · No pressure
          </p>
        </Hero>

        <MarketingSection
          tone="white"
          container="wide"
          spacing={'compact' as never}
        >
          <div className="border-t border-b border-charcoal/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm tracking-wide uppercase text-charcoal/70 pt-11 pb-0">
              <p>Baby Gear Specialist</p>

              <p className="md:border-l md:border-r md:border-charcoal/10 md:px-6">
                Brand-Trained Product Expertise
              </p>

              <p>Private Planning for Modern Families</p>
            </div>
          </div>
        </MarketingSection>

        {/* Advice Section */}
        <MarketingSection tone="white" container="wide" className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-20 items-start">

            {/* LEFT COLUMN */}
            <div className="max-w-[560px]">
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                There’s no shortage of advice.
              </h2>

              <p className="text-lg leading-relaxed mb-6">
                Most of it loud.
                <br />
                Some of it helpful.
                <br />
                Very little of it tailored to you.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Between registry lists, social media trends, and well-meaning opinions, it’s easy to feel pressured to
                buy everything immediately.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Preparation shouldn’t feel reactive.
                <br />
                It should feel intentional.
              </p>

              <p className="text-lg leading-relaxed mb-10">
                That’s where thoughtful guidance makes all the difference.
              </p>

              <div className="mt-2 pt-8 border-t border-[var(--color-charcoal)]/10">
                <p className="text-base md:text-lg italic leading-relaxed text-[var(--color-charcoal)]/80">
                  So what does a baby planner actually do?
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:max-w-[520px] bg-[var(--color-ivory)] rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-serif mb-6">
                This is for you if…
              </h3>

              <ul className="space-y-5 text-base">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>You want clarity before you start buying</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>You value thoughtful, design-aware decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>Guidance over guesswork</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>Support without pressure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush-deep)]/80 mt-1">✓</span>
                  <span>Preparation that feels calm</span>
                </li>
              </ul>
            </div>

          </div>
        </MarketingSection>

        <MarketingSection
          container="default"
          className="bg-[var(--color-ivory)] py-32"
        >
          <div className="clarity-grid mx-auto max-w-6xl">
            <div className="clarity-left">
              <div className="space-y-8 max-w-[560px]">
                <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 tracking-tight">
                  What Is a Baby Planner?
                </h2>

                <div className="space-y-8 text-lg leading-relaxed text-neutral-700">
                  <p>
                    A baby planner guides the practical side of preparation.
                  </p>

                  <p>
                    Your doctor oversees medical care.<br />
                    Your family offers opinions.<br />
                    The internet offers everything.
                  </p>

                  <p className="text-neutral-900 font-medium">
                    I help you sort through it all.
                  </p>

                  <p>
                    From registry strategy to nursery layout to major purchasing decisions,
                    I guide you toward choices that reflect your real life — not trends, pressure, or panic buying.
                  </p>

                  <p className="text-neutral-900 font-medium">
                    This isn’t about buying more.<br />
                    It’s about choosing well.
                  </p>

                  <p>
                    Through structured planning sessions and private guidance,
                    I help families move from overwhelm to clarity — with intention, not urgency.
                  </p>

                  <p className="text-neutral-900 italic">
                    Preparation should feel steady. Thoughtful. Tailored.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="clarity-image-shell h-full">
                <Image
                  src="/assets/editorial/growing-with-confidence.jpg"
                  alt="Growing with confidence editorial image"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </MarketingSection>

        {/* Planning Overview — Stacked Editorial Journey */}

        <MarketingSection
          tone="white"
          spacing="spacious"
          container="narrow"
          className="py-28 md:py-32"
        >
          <div className="max-w-3xl mx-auto">

            {/* Section Intro */}
            <div className="mb-20 md:pl-4">
              <p className="uppercase tracking-[0.25em] text-xs text-muted-foreground mb-6">
                Planning Overview
              </p>

              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                How Families Typically Work With Me
              </h2>

              <p className="text-lg text-muted-foreground max-w-[60ch]">
                A structured, private approach to thoughtful baby preparation.
              </p>
            </div>

            {/* -------- Pillar 01 -------- */}
            <div className="mb-28">
              <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Text Column */}
                <div>
                  <p className="text-6xl font-serif text-[var(--color-soft-blush)] mb-6">
                    01
                  </p>

                  <h3 className="text-2xl font-serif mb-4">
                    Registry Clarity
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-[60ch]">
                    We begin by refining what truly belongs on your registry — guided by brand-trained insight,
                    lifestyle alignment, and long-term practicality.
                  </p>

                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Brand-informed recommendations</li>
                    <li>• Clear “buy now vs later” prioritization</li>
                    <li>• Registry structure built around your real life</li>
                  </ul>

                  <Link
                    href="/services"
                    className="text-sm tracking-wide underline underline-offset-4 hover:opacity-70 transition"
                  >
                    Explore Registry Support →
                  </Link>
                </div>

                {/* Image Column */}
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/assets/editorial/registry.jpg"
                      alt="Curated baby registry planning session"
                      width={800}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="border-t border-neutral-200 my-20" />


            {/* -------- Pillar 02 -------- */}
            <div className="mb-28">
              <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Image Column */}
                <div className="relative order-2 md:order-1">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/assets/editorial/nursery.jpg"
                      alt="Calm and functional nursery design"
                      width={800}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Text Column */}
                <div className="order-1 md:order-2">
                  <p className="text-6xl font-serif text-[var(--color-soft-blush)] mb-6">
                    02
                  </p>

                  <h3 className="text-2xl font-serif mb-4">
                    Home & Nursery Preparation
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-[60ch]">
                    Next, we translate your vision into a space that feels calm,
                    functional, and ready for daily life with baby.
                  </p>

                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Layout and furniture planning</li>
                    <li>• Safety-focused recommendations</li>
                    <li>• Sourcing and implementation guidance</li>
                  </ul>

                  <Link
                    href="/services"
                    className="text-sm tracking-wide underline underline-offset-4 hover:opacity-70 transition"
                  >
                    Explore Nursery Support →
                  </Link>
                </div>

              </div>
            </div>

            <div className="border-t border-neutral-200 my-20" />


            {/* -------- Pillar 03 -------- */}
            <div>
              <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Text Column */}
                <div>
                  <p className="text-6xl font-serif text-[var(--color-soft-blush)] mb-6">
                    03
                  </p>

                  <h3 className="text-2xl font-serif mb-4">
                    Intentional Gear Planning
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-[60ch]">
                    Finally, we design the daily systems — strollers, car seats, carriers —
                    chosen with longevity, safety, and real routines in mind.
                  </p>

                  <ul className="space-y-3 text-muted-foreground mb-6">
                    <li>• Stroller + car seat strategy</li>
                    <li>• Real-world usage planning</li>
                    <li>• Streamlined daily systems</li>
                  </ul>

                  <Link
                    href="/services"
                    className="text-sm tracking-wide underline underline-offset-4 hover:opacity-70 transition"
                  >
                    Explore Gear Planning →
                  </Link>
                </div>

                {/* Image Column */}
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/assets/editorial/gear.jpg"
                      alt="Thoughtfully selected baby gear essentials"
                      width={800}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </MarketingSection>

      {/* Founder Authority */}
      <MarketingSection
        tone="ivoryWarm"
        container="narrow"
        className="group relative overflow-visible !pt-20 md:!pt-24"
      >
        <div className="mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl">
            A Personal Note from Taylor
          </h3>

          <p className="mt-6 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
            After years in the baby gear industry — guiding families through registries,
            nursery builds, and major purchasing decisions — I saw how often preparation
            turned into pressure. 
          </p>

          <p className="mt-4 mx-auto text-center text-lg leading-relaxed text-[var(--color-muted)]">
            Taylor-Made Baby Co. was created to replace overwhelm with clarity —
            so you can prepare intentionally, not reactively.
          </p>

          <div className="mt-8">
            <Link href="/about" className={secondaryCtaClass}>
              Meet Taylor <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 w-screen -translate-x-1/2 z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
          <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72] translate-y-1 md:translate-y-2" />
        </div>
      </MarketingSection>

        {/* Journal Highlight */}
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="!pt-28 md:!pt-32"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left Editorial Intro */}
            <div className="space-y-6">

              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
                From The Blog
              </p>

              <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] leading-tight">
                Thoughtful guidance for modern parents
              </h2>

              <p className="text-lg text-[var(--color-muted)] max-w-lg">
                Honest, grounded conversations about baby gear, 
                preparation, and making decisions with clarity — 
                not pressure.
              </p>

              <Link
                href="/blog"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                View All Articles →
              </Link>

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

              <Link
                href="/blog/the-art-of-the-registry"
                className={secondaryCtaClass}
              >
                Read the Article →
              </Link>

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
