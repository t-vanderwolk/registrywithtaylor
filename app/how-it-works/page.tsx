import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Lead, SectionTitle } from '@/components/Typography';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'How It Works — Taylor-Made Baby Planning',
  description:
    'Understand how Taylor-Made Baby Planning guides couples through a step-by-step planning and registry process.',
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
              A calmer way to prepare.
            </h1>

            <p className="text-base md:text-lg text-neutral-700 max-w-xl mx-auto leading-relaxed mb-0">
              Because walking into a baby store shouldn't feel intimidating.
            </p>

            <div className="hero-cta-group justify-center">
              <Link href="/contact" className="btn-primary">
                Book a Free Consultation
              </Link>
              <Link href="/services" className="btn-secondary">
                View Services
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
        <Section
          variant="neutral"
          aria-label="intro copy"
          className="section-base !pt-4 md:!pt-6 !pb-16 md:!pb-20"
          style={{
            background: '#ffffff',
          }}
        >
          <div className="container spacing-card-gap text-center">
            <SectionTitle className="section__title">Why the checklist stops working</SectionTitle>
            <Lead className="mx-auto">Because walking into a baby store shouldn&apos;t feel intimidating.</Lead>
            <Body className="mx-auto">
              <strong>You don’t need to buy everything.</strong> You just need to know what you need — before you buy it.
            </Body>
            <Body className="mx-auto">We flip the script with a calm Learn → Plan → Try → Buy rhythm so you enter every decision curious and confident.</Body>
          </div>
        </Section>
        <Section
          variant="warm"
          aria-label="process steps"
          className="section-white section-spacing"
        >
          <div className="container spacing-card-gap">
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
        </Section>
        <Section
          variant="base"
          aria-label="benefits"
          className="section-ivory section-spacing"
        >
          <div className="container spacing-card-gap">
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
        </Section>
      </main>
    </SiteShell>
  );
}
