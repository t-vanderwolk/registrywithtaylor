import Image from 'next/image';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
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

export default function HowItWorksPage() {
  return (
    <SiteShell currentPath="/how-it-works">
      <main className="site-main">
        <section
          className="relative pt-24 md:pt-28 pb-8 md:pb-10 overflow-visible"
          style={{
            backgroundImage: 'linear-gradient(180deg, #f3ece5 0%, #f8f4f0 55%, #ffffff 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto text-center space-y-5 px-6 animate-hero-fade">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
              How It Works
            </p>

            <h1 className="font-serif text-[clamp(3rem,5.5vw,5rem)] tracking-[-0.02em] text-neutral-900 leading-[1.05] mb-0">
              How It Works
            </h1>

            <p className="text-base md:text-lg text-neutral-700 max-w-xl mx-auto leading-relaxed mb-0">
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
          <div className="relative mt-5 -mb-10 left-1/2 -translate-x-1/2 w-screen pointer-events-none">
            <div className="relative w-full h-[8vw] min-h-[85px]">
              <Image
                src="/assets/dividers/ribbon-divider.png"
                alt=""
                aria-hidden="true"
                fill
                priority
                className="object-fill opacity-100 drop-shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
              />

              {/* Silk highlight layer */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.05) 100%)',
                  mixBlendMode: 'soft-light',
                }}
              />
            </div>
          </div>
        </section>
        <div className="h-10 md:h-12 bg-gradient-to-b from-[#f8f4f0] via-[#f8f4f0]/70 to-white" />
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
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
                className="h-6 md:h-7 w-auto opacity-70"
                priority={false}
              />
            </div>

            {/* Body Copy */}
            <div className="max-w-2xl mx-auto text-center text-neutral-700 leading-relaxed space-y-3">
              <p className="text-neutral-800 font-medium text-lg text-center mb-2 max-w-2xl mx-auto">
                Before anything is purchased, we talk.
              </p>
              <p className="text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                We review your space, lifestyle, priorities, and timeline so you know exactly what makes sense for your family.
              </p>
            </div>

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

            {/* CTA */}
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
          container="default"
          spacing="spacious"
        >
          <div className="spacing-card-gap">
            <SectionTitle className="section__title">The model</SectionTitle>
            <div className="steps-grid">
              {steps.map((step) => (
                <article key={step.title} className="step-card card-surface">
                  <Image
                    src={step.icon}
                    alt={`${step.title} icon`}
                    width={150}
                    height={150}
                    className="step-card__image"
                  />
                  <h3>{step.title}</h3>
                  <details className="step-card__details">
                    <summary className="step-card__summary">Tap to expand</summary>
                    <div className="step-card__body">
                      <Body className="body-copy--full">{step.description}</Body>
                      <Body className="micro-note body-copy--full">{step.reassurance}</Body>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </MarketingSection>
        <MarketingSection
          tone="ivory"
          container="default"
          spacing="spacious"
        >
          <div className="spacing-card-gap">
            <SectionTitle className="section__title">Why this model works</SectionTitle>
            <div className="benefits-grid">
              {['Understand before spending.', 'Plan once, not repeatedly.', 'Buy with clarity and confidence.'].map((benefit) => (
                <article key={benefit} className="benefit-card card-surface">
                  <span aria-hidden="true">•</span>
                  <Body className="body-copy--full">{benefit}</Body>
                </article>
              ))}
            </div>
            <section className="accordion" aria-label="common questions">
              {[1].map(() => (
                <div key="faq-1" className="accordion__item">
                  <button
                    className="accordion__trigger"
                    type="button"
                    aria-expanded="false"
                    aria-controls="faq-1"
                  >
                    What happens after the consultation?
                    <span aria-hidden="true">+</span>
                  </button>
                  <div className="accordion__content" id="faq-1" aria-hidden="true">
                    You’ll receive recap notes, curated suggestions, and optional follow-up support to keep momentum.
                  </div>
                </div>
              ))}
            </section>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
