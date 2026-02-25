import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
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
          ribbonClassName="translate-y-4 md:translate-y-6"
          className="bg-paper hero-bottom-fade pb-24 md:pb-28"
          contentClassName="max-w-xl text-left"
          overlayStyle={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0.42) 72%, rgba(255,255,255,0.08) 100%), linear-gradient(to bottom, rgba(255,255,255,0) 72%, #f6f1ec 100%)',
          }}
          image="/assets/hero/hero-05.jpg"
          imageAlt="Soft baby essentials arranged for planning"
        >
          <h1 className="text-5xl md:text-6xl font-serif leading-[1.1] tracking-tight mb-6 text-neutral-900">
            Preparation should feel grounded - not overwhelming.
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-10 max-w-xl">
            I help families make calm, confident decisions from registry to nursery to daily life with baby.
          </p>

          <div>
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
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
              A Thoughtful Specialist in the Details
            </h2>

            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              I am a Baby Gear Expert and Registry Consultant focused on practical clarity for modern families.
              My work sits at the intersection of safety, design, and real-world usability.
            </p>

            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              Over years across premium retail floors, national pilot programs, and independent consulting, I have
              helped families choose what truly fits their home, routines, and priorities.
            </p>

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
          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
              The Taylor-Made Approach
            </h2>

            <div className="space-y-1 pt-1">
              <p className="font-serif text-2xl md:text-3xl text-neutral-900">Clarity over trends.</p>
              <p className="font-serif text-2xl md:text-3xl text-neutral-900">Fit over features.</p>
              <p className="font-serif text-2xl md:text-3xl text-neutral-900">Confidence over consumption.</p>
            </div>

            <p className="text-lg text-neutral-700 leading-relaxed">
              Today&apos;s baby market offers endless options, but more options do not create better decisions.
              My role is to translate the noise into a plan that feels steady and specific to your life.
            </p>

            <p className="text-lg text-neutral-700 leading-relaxed">
              Together, we invest in what your family truly needs now, what can wait, and what is worth skipping
              altogether.
            </p>

            <p className="text-lg text-neutral-700 leading-relaxed">
              Parenthood should start with confidence, not confusion.
            </p>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="max-w-2xl mx-auto text-center space-y-7">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
              What Makes This Different
            </h2>

            <div className="space-y-3 text-xl text-neutral-900">
              <p>This isn&apos;t a template registry.</p>
              <p>It isn&apos;t a sales floor disguised as advice.</p>
              <p>It isn&apos;t a checklist handed over and forgotten.</p>
            </div>

            <p className="text-lg text-neutral-700 leading-relaxed">
              This is thoughtful, private planning support that adapts to your home, your timeline, and your
              decision-making style - so every next step feels clear and grounded.
            </p>
          </div>
        </MarketingSection>

        <MarketingSection tone="white" container="wide" spacing="default">
          <div className="max-w-6xl mx-auto text-center space-y-10">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
              Only partners with the best.
            </p>

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
          </div>
        </MarketingSection>

        <MarketingSection tone="blush" container="narrow" spacing="spacious">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900">
              Start with confidence.
            </h2>

            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              When preparation feels clear, everything ahead feels lighter.
            </p>

            <div>
              <Link
                href="/contact"
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Book a Complimentary Consultation
              </Link>
            </div>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
