import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'About — Taylor-Made Baby Co.',
  description:
    'Learn about Taylor-Made Baby Co. and the thoughtful, practical approach behind calm baby preparation.',
  path: '/about',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'About Taylor-Made Baby Co.',
});

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about">
      <main className="site-main">
        <Hero
          showRibbon
          ribbonEnhanced
          ribbonClassName="translate-y-2 md:translate-y-3"
          className="bg-paper hero-home-radial hero-bottom-fade md:pb-28"
          contentClassName="marketing-hero-content marketing-hero-content--narrow"
          overlayStyle={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0.42) 72%, rgba(255,255,255,0.08) 100%), linear-gradient(to bottom, rgba(255,255,255,0) 72%, #f6f1ec 100%)',
          }}
          image="/assets/hero/hero-05.jpg"
          imageAlt="Soft baby essentials arranged for planning"
        >
          <p className="hero-load-reveal text-xs uppercase tracking-[0.3em] text-neutral-600 mb-6">
            Meet Taylor
          </p>

          <h1 className="hero-load-reveal hero-load-reveal--1 text-5xl md:text-6xl font-serif leading-[1.1] tracking-tight mb-6 text-neutral-900">
            A Thoughtful Specialist in the Details of Early Parenthood
          </h1>

          <p className="hero-load-reveal hero-load-reveal--2 text-lg md:text-xl text-neutral-600 leading-relaxed mb-10 max-w-xl">
            I guide families through registry, nursery, and gear decisions with clarity and care.
          </p>

          <div className="hero-load-reveal hero-load-reveal--3">
            <Link
              href="/contact"
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Book a Complimentary Consultation
            </Link>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <RevealOnScroll>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                A Thoughtful Specialist in the Details
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
                I am a Baby Gear Expert and Registry Consultant focused on practical clarity for modern families.
                My work sits at the intersection of safety, design, and real-world usability.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayMs={170}>
              <div className="max-w-2xl mx-auto space-y-6 text-lg text-neutral-700 leading-relaxed text-left">
                <p>
                  With hands-on experience across premium retail floors, national pilot programs, and private consulting,
                  I&apos;ve guided hundreds of families through the earliest decisions of parenthood - the ones that feel
                  small until you realize they&apos;re not.
                </p>

                <p>
                  From registry strategy to nursery planning to daily gear systems, my work lives at the intersection of
                  safety, design, and real-life functionality - the place where beautiful meets practical and trends meet
                  reality.
                </p>

                <p>
                  This kind of planning is nuanced. It&apos;s personal. And it&apos;s often unfolding during one of the most
                  tender, vulnerable seasons of someone&apos;s life.
                </p>

                <p>
                  When you invite me into that space - into your home, your routines, your questions at 10 p.m. - you&apos;re
                  trusting me with more than a checklist. You&apos;re trusting me with your story.
                </p>

                <p>That&apos;s a responsibility I don&apos;t take lightly.</p>

                <p>
                  My role isn&apos;t to sell you more. It&apos;s to help you choose well. With clarity. With intention. With
                  confidence - because parenthood should start with confidence, not confusion.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={260}>
              <ul className="max-w-xl mx-auto text-left space-y-4 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  <span>Strollers and car seats</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  <span>Nursery design and room flow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  <span>Feeding essentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--color-blush)]">✓</span>
                  <span>Registry strategy</span>
                </li>
              </ul>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="max-w-2xl mx-auto space-y-8">
            <RevealOnScroll>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                The Taylor-Made Approach
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="space-y-1 pt-1">
                <p className="font-serif text-2xl md:text-3xl text-neutral-900">Clarity over noise.</p>
                <p className="font-serif text-2xl md:text-3xl text-neutral-900">Fit over features.</p>
                <p className="font-serif text-2xl md:text-3xl text-neutral-900">Confidence over consumption.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={170}>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>
                  Today&apos;s baby market offers endless options - and endless opinions. But more options don&apos;t create
                  better decisions. They create pressure.
                </p>

                <p>The Taylor-Made approach is built on discernment.</p>

                <p>
                  We slow the process down.
                  <br />
                  We look at how you actually live.
                  <br />
                  We consider your space, your routines, your budget, and your long-term plans.
                </p>

                <p>Then we build from there.</p>

                <p>
                  No panic buying.
                  <br />
                  No trend chasing.
                  <br />
                  No &quot;just in case&quot; overload.
                </p>

                <p>Just thoughtful decisions that make sense for your real life.</p>

                <p>Because the goal isn&apos;t to have everything.</p>

                <p>It&apos;s to have what fits.</p>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="max-w-2xl mx-auto space-y-7">
            <RevealOnScroll>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
                What Makes This Different
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p className="text-xl text-neutral-900">Most baby guidance focuses on products.</p>
                <p className="text-xl text-neutral-900">This focuses on people.</p>

                <p>
                  Your home.
                  <br />
                  Your routines.
                  <br />
                  Your comfort level with risk, spending, and space.
                  <br />
                  Your decision-making style.
                </p>

                <p>This isn&apos;t a template registry.</p>
                <p>It isn&apos;t a sales floor disguised as advice.</p>
                <p>And it isn&apos;t a checklist handed over and forgotten.</p>

                <p>It&apos;s structured, private planning support - designed to evolve with you.</p>

                <p>
                  Baby prep is nuanced. Emotional. Sometimes overwhelming in ways no one talks about.
                </p>

                <p>
                  What makes this different is the level of care and discernment applied to every recommendation,
                  every comparison, every pause before a purchase.
                </p>

                <p className="text-xl text-neutral-900">Not louder.</p>
                <p className="text-xl text-neutral-900">Just clearer.</p>

                <p>Because when preparation feels aligned, everything ahead feels lighter.</p>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" container="wide" spacing="default">
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <RevealOnScroll>
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                Only partners with the best.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
                <Image
                  src="/assets/brand/totsquad.png"
                  alt="Tot Squad"
                  width={210}
                  height={70}
                  className="h-9 md:h-10 w-auto opacity-70 grayscale"
                />
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
