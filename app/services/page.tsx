import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Lead, SectionTitle } from '@/components/Typography';
import RibbonDivider from '@/components/layout/RibbonDivider';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { marketingServices } from '@/lib/marketing/services';

export const metadata = buildMarketingMetadata({
  title: 'Services — Taylor-Made Baby Planning',
  description:
    'Bespoke baby planning services from Taylor-Made Baby Planning covering registries, nursery design, events, and ongoing support.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Service consultation planning',
});

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Hero
          eyebrow="Services"
          title="Bespoke Baby Planning Services"
          subtitle="Personalized guidance to help you plan with calm confidence."
          primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
          secondaryCta={{ label: 'How It Works', href: '/how-it-works' }}
          image="/assets/hero/hero-03.jpg"
          imageAlt="Service consultation planning"
          className="hero-bottom-fade !h-[74vh] !min-h-[560px] md:!min-h-[620px]"
          showRibbon={false}
        />

        <div className="relative -mt-24 md:-mt-28 -mb-14 md:-mb-16 z-20 pointer-events-none overflow-visible">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #fcf7f2 52%, #f8f4f0 100%)',
            }}
          />
          <div className="relative z-10">
            <RibbonDivider />
          </div>
        </div>

        <Section
          variant="base"
          aria-label="service offerings"
          className="!pb-16 md:!pb-20"
          style={{ paddingTop: '1.25rem' }}
        >
          <div className="container spacing-card-gap">
            <div className="space-y-3 text-center max-w-3xl mx-auto">
              <p className="hero__eyebrow">Services</p>
              <SectionTitle className="section__title">Support designed around your real life.</SectionTitle>
              <Lead className="mx-auto">
                Pick the support you need now, then add more as your plans evolve. Everything is tailored to your routines, home, and priorities.
              </Lead>
            </div>

            <div className="service-grid">
              {marketingServices.map((service) => (
                <article key={service.title} className="service-card card-surface">
                  <Image
                    className="service-card__icon"
                    src={service.icon}
                    alt=""
                    aria-hidden="true"
                    width={64}
                    height={64}
                  />
                  <h3>{service.title}</h3>
                  <Body className="service-card__subcopy body-copy--full">{service.reassurance}</Body>
                  <details className="service-card__details">
                    <summary className="service-card__summary">Learn more</summary>
                    <div className="service-card__body">
                      <Body className="body-copy--full">{service.description}</Body>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section
          variant="neutral"
          aria-label="planning approach"
        >
          <div className="container spacing-card-gap">
            <div className="space-y-3 text-center max-w-3xl mx-auto">
              <SectionTitle className="section__title">A calm planning rhythm you can trust</SectionTitle>
              <Lead className="mx-auto">
                We keep each step focused so you can make clear decisions without pressure or overwhelm.
              </Lead>
            </div>

            <div className="feature-grid">
              <article className="feature-card card-surface">
                <h3 className="feature-card__title">Learn first</h3>
                <Body className="feature-card__body body-copy--full">
                  Understand categories and product differences before you commit to purchases.
                </Body>
              </article>
              <article className="feature-card card-surface">
                <h3 className="feature-card__title">Plan with intention</h3>
                <Body className="feature-card__body body-copy--full">
                  Build a registry around your actual routines, home layout, and support system.
                </Body>
              </article>
              <article className="feature-card card-surface">
                <h3 className="feature-card__title">Buy with confidence</h3>
                <Body className="feature-card__body body-copy--full">
                  Move forward knowing each item has a purpose and fits how you want to live.
                </Body>
              </article>
            </div>
          </div>
        </Section>

        <Section variant="base" aria-label="testimonial">
          <div className="container">
            <div className="card-surface max-w-3xl mx-auto text-center spacing-card-gap">
              <span className="quote-icon" aria-hidden="true">
                "
              </span>
              <Body className="mx-auto">
                Taylor helped us prioritize what actually works for our days instead of following another list.
              </Body>
              <Body className="micro-text mx-auto">Grateful parents</Body>
            </div>
          </div>
        </Section>

        <Section variant="highlight" aria-label="closing call to action">
          <div className="container">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <SectionTitle className="section__title">Start with confidence.</SectionTitle>
              <Lead className="mx-auto">
                Book a free consultation and get a clear, personalized plan that keeps you present for what matters most.
              </Lead>
              <div className="hero__actions">
                <Link className="btn btn--primary" href="/contact">
                  Book a Free Consultation
                </Link>
                <Link className="btn btn--secondary" href="/how-it-works">
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
