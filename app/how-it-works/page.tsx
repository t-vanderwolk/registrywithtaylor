import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Lead, SectionTitle } from '@/components/Typography';
import Hero from '@/components/ui/Hero';

export const metadata = {
  title: 'How It Works — Taylor-Made Baby Planning',
  description:
    'Understand how Taylor-Made Baby Planning guides couples through a step-by-step planning and registry process.',
};

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
        <Hero
          eyebrow="How It Works"
          title="Transparent process, confident decisions."
          subtitle="A calm, intentional approach to building your registry."
          primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
          image="/assets/hero/hero-02.jpg"
        />

        <Section variant="neutral" aria-label="intro copy">
          <div className="container">
            <SectionTitle className="section__title">Why the checklist stops working</SectionTitle>
            <Lead>Because walking into a baby store shouldn&apos;t feel intimidating.</Lead>
            <Body>
              <strong>You don’t need to buy everything.</strong> You just need to know what you need — before you buy it.
            </Body>
            <Body>We flip the script with a calm Learn → Plan → Try → Buy rhythm so you enter every decision curious and confident.</Body>
          </div>
        </Section>

        <Section variant="warm" aria-label="process steps">
          <div className="container">
            <SectionTitle className="section__title">The model</SectionTitle>
            <div className="steps-grid">
              {steps.map((step) => (
                <article key={step.title} className="step-card">
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

        <Section variant="base" aria-label="benefits">
          <div className="container">
            <SectionTitle className="section__title">Why this model works</SectionTitle>
            <div className="benefits-grid">
              {['Understand before spending.', 'Plan once, not repeatedly.', 'Buy with clarity and confidence.'].map((benefit) => (
                <article key={benefit} className="benefit-card">
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

        <Section variant="highlight" className="final-cta" aria-label="closing call to action">
          <div className="container hero__content">
            <SectionTitle className="section__title">Ready when you are.</SectionTitle>
            <Lead className="hero__subtitle">No pressure. Just clarity when you need it.</Lead>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="/contact">
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
