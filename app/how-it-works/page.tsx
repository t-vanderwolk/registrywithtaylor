import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import EndBowDivider from '@/components/layout/EndBowDivider';
import MarketingSection from '@/components/layout/MarketingSection';
import RibbonDivider from '@/components/layout/RibbonDivider';
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

const testimonialSlides = [
  {
    quote:
      'Working with Taylor made everything feel manageable. Instead of guessing what we needed, we had a clear plan — and that changed everything.',
    author: 'First-Time Parent, Scottsdale',
  },
  {
    quote:
      'Taylor helped us prioritize what actually works for our days instead of following another list.',
    author: 'Grateful Parents',
  },
  {
    quote:
      'We stopped second-guessing every purchase and finally felt prepared for baby.',
    author: 'Expecting Parent, Phoenix',
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell currentPath="/how-it-works">
      <main className="site-main">
        <section
          className="relative pt-24 md:pt-28 pb-20 md:pb-24 overflow-visible"
          style={{
            backgroundImage: 'linear-gradient(180deg, #f3ece5 0%, #f8f4f0 55%, #ffffff 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto text-center space-y-5 px-6 animate-hero-fade">
            <p className="hero-eyebrow !mb-0">
              How It Works
            </p>

            <h1 className="hero-title !mb-0">
              How It Works
            </h1>

            <p className="hero-subhead !mb-0 mx-auto">
              A clear, practical path from overwhelmed to prepared.
            </p>

            <div className="hero-cta-group justify-center">
              <Link href="/contact" className="btn btn--primary">
                BOOK A FREE CONSULTATION
              </Link>
              <Link href="/services" className="btn btn--secondary">
                VIEW SERVICES
              </Link>
            </div>
          </div>

          {/* Ribbon Divider */}
          <div className="absolute left-0 w-full z-20 pointer-events-none bottom-[-128px] md:bottom-[-148px]">
            <RibbonDivider />
          </div>
        </section>
        <div className="h-10 md:h-12 bg-gradient-to-b from-[#f8f4f0] via-[#f8f4f0]/70 to-white" />
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="relative overflow-visible"
        >
          <div className="max-w-4xl mx-auto rounded-[28px] bg-[var(--color-ivory)] shadow-[0_30px_60px_rgba(0,0,0,0.06)] px-8 md:px-16 py-16">

            {/* Step Label */}
            <p className="text-xs tracking-[0.35em] uppercase text-neutral-500 text-center mb-4">
              Step 1
            </p>

            {/* Headline */}
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-3">
              Complimentary Virtual Consultation
            </h2>

            {/* Subhead */}
            <p className="text-lg text-neutral-600 text-center mx-auto mb-6">
              Begin with clarity.
            </p>

            {/* Authority Line */}
            <div className="flex justify-center items-center mb-8">
              <Image
                src="/assets/brand/totsquad.png"
                alt="TotSquad Baby Concierge"
                width={320}
                height={60}
                className="h-8 md:h-10 w-auto opacity-80"
                priority={false}
              />
            </div>
<div>
            {/* Body Copy */}
            <div className="max-w-2xl mx-auto text-center text-neutral-700 leading-relaxed space-y-3">
              <p className="text-neutral-800 font-medium text-lg text-center mb-2 max-w-2xl mx-auto">
                Before anything is purchased, we talk.
              </p>
              <p className="text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                We review your space, lifestyle, priorities, and timeline so you know exactly what makes sense for your family.
              </p>
           

            {/* Icon Row */}
            <div className="grid grid-cols-4 gap-8 text-center mt-8 mb-6">

              <div>
                <div className="text-3xl mb-2">🏡</div>
                <p className="text-sm text-neutral-700">Lifestyle & space review</p>
              </div>

              <div>
                <div className="text-3xl mb-2">📝</div>
                <p className="text-sm text-neutral-700">Registry refinement</p>
              </div>

              <div>
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm text-neutral-700">Product comparisons</p>
              </div>

              <div>
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm text-neutral-700">Clarity</p>
              </div>

            </div>
</div>
    </div>        {/* CTA */}
            <div className="text-center mt-4">
              <Link
                href="/contact"
                className="btn btn--primary"
              >
                Book Complimentary Consultation →
              </Link>
            </div>

          </div>
        </MarketingSection>
        <MarketingSection
          tone="ivory"
          spacing="spacious"
          container="default"
        >
          <div className="group service-preview-row service-preview-row--normal max-w-6xl mx-auto">
            <div className="service-preview-text service-preview-text--normal w-full max-w-[520px] space-y-10">
              <p className="text-xs tracking-[0.35em] uppercase text-neutral-500 pt-[2px]">
                Step 2
              </p>

              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] tracking-[-0.01em]">
                  Build Your Plan
                </h2>

                <p className="text-neutral-700 leading-relaxed max-w-xl text-lg">
                  We create a personalized roadmap based on your home, lifestyle, priorities, and comfort level.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 pt-2">
                <div className="flex items-start gap-3">
                  <div className="text-xl">📝</div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      Registry strategy
                    </p>
                    <p className="text-sm text-neutral-600">
                      What to include, what to skip, and when to buy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl">🛏️</div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      Nursery layout
                    </p>
                    <p className="text-sm text-neutral-600">
                      Functional flow for your real home.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl">🚼</div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      Gear prioritization
                    </p>
                    <p className="text-sm text-neutral-600">
                      What matters now versus later.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-xl">💳</div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      Budget alignment
                    </p>
                    <p className="text-sm text-neutral-600">
                      Smart planning without overwhelm.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-preview-image service-preview-image--normal relative w-full max-w-[440px] aspect-square overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
              <Image
                src="/assets/editorial/step-2.png"
                alt="Planning notebook with curated registry guidance materials"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 440px"
              />
            </div>
          </div>
        </MarketingSection>
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
          className="relative overflow-visible"
        >
          <div className="group service-preview-row service-preview-row--reverse max-w-6xl mx-auto">
            <div className="service-preview-image service-preview-image--reverse relative w-full max-w-[440px] aspect-square overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
              <Image
                src="/assets/editorial/step-3.png"
                alt="Curated baby products arranged for implementation planning"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 440px"
              />
            </div>

            <div className="service-preview-text service-preview-text--reverse w-full max-w-[520px] space-y-10">
              <p className="text-xs tracking-[0.35em] uppercase text-neutral-500 pt-[2px]">
                Step 3
              </p>

              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] tracking-[-0.01em]">
                  Implement with Confidence
                </h2>

                <p className="text-neutral-700 leading-relaxed text-lg max-w-xl">
                  Once your plan is clear, we move into execution — with support at every step.
                </p>
              </div>

              <div className="space-y-6 max-w-xl">
                <div className="flex items-start gap-3 text-left">
                  <div className="text-xl leading-none mt-0.5 shrink-0">🛒</div>
                  <p className="text-neutral-700 leading-relaxed mb-0">
                    Smart purchasing timelines so you’re never rushed.
                  </p>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="text-xl leading-none mt-0.5 shrink-0">📦</div>
                  <p className="text-neutral-700 leading-relaxed mb-0">
                    Clear guidance on what to assemble, install, or prepare.
                  </p>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="text-xl leading-none mt-0.5 shrink-0">💬</div>
                  <p className="text-neutral-700 leading-relaxed mb-0">
                    Ongoing support as questions come up.
                  </p>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="text-xl leading-none mt-0.5 shrink-0">✨</div>
                  <p className="text-neutral-700 leading-relaxed mb-0">
                    Final walkthrough so everything feels ready.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-neutral-600 mb-6">
                  Ready to begin?
                </p>

                <Link
                  href="/book"
                  className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  Book Your Free Consultation
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 w-screen -translate-x-1/2 z-20 pointer-events-none bottom-[-128px] md:bottom-[-152px]">
            <EndBowDivider className="scale-y-[0.68] md:scale-y-[0.72]" />
          </div>
        </MarketingSection>

        <MarketingSection
          tone="ivoryWarm"
          spacing="spacious"
          container="default"
          className="!border-t-0 !pt-20 md:!pt-28"
        >
          <div className="max-w-3xl mx-auto text-center">

            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] tracking-[-0.01em] mb-6">
              When you’re ready for more personalized support.
            </h2>

            <p className="text-neutral-700 leading-relaxed text-lg text-center max-w-2xl mx-auto mb-6">
              For families seeking deeper, ongoing guidance, <span className="font-serif text-[1.1rem] tracking-[0.02em] text-[#2e2e2e]">Taylor-Made Baby Co.</span> offers bespoke planning services designed independently — and tailored entirely to your home, your routines, and your long-term needs.
            </p>

            <p className="text-neutral-700 leading-relaxed text-lg text-center max-w-2xl mx-auto mb-10">
              From comprehensive registry strategy and nursery design to hands-on product research and purchase planning, this private support extends far beyond a single conversation.
            </p>

            <div className="pt-2">
              <Link
                href="/services"
                className="btn btn--secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore Bespoke Services
              </Link>
            </div>

            <div className="mt-24 pt-12 border-t border-neutral-200/70">
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">
                Testimonial
              </p>

              <p className="text-[0.72rem] tracking-[0.28em] uppercase text-neutral-500 mb-8">
                First-Time Families
              </p>

              <div className="testimonial-fader mx-auto max-w-3xl">
                {testimonialSlides.map((item, index) => (
                  <article
                    key={`${item.author}-${index}`}
                    className="testimonial-fader__slide"
                    style={{ animationDelay: `${index * 6}s` }}
                  >
                    <p className="font-serif text-3xl md:text-4xl leading-[1.2] tracking-[-0.01em] text-neutral-900 mb-8">
                      “{item.quote}”
                    </p>
                    <p className="text-neutral-500 text-sm tracking-wide uppercase">
                      — {item.author}
                    </p>
                  </article>
                ))}
              </div>
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
