import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, SectionTitle } from '@/components/Typography';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Contact — Taylor-Made Baby Planning',
  description:
    'Reach Taylor-Made Baby Planning by email, phone, or the contact form to discuss your registry and celebration plans.',
  path: '/contact',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Contact Taylor-Made Baby Planning',
});

export default function ContactPage() {
  return (
    <SiteShell currentPath="/contact">
      <main className="site-main">
        <Hero
          eyebrow="Get in Touch"
          title="Get in Touch"
          subtitle="Have questions or ready to start your registry? I’m here to help."
          primaryCta={{ label: 'Book a Consultation', href: '#contact-form' }}
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact Taylor-Made Baby Planning"
        />

        <Section variant="warm" aria-label="Direct contacts">
          <div className="container">
            <SectionTitle className="section__title">Reach out directly</SectionTitle>
            <div className="feature-grid">
              <article className="feature-card">
                <h3 className="feature-card__title">Email</h3>
                <Body className="feature-card__body body-copy--full">registrywithtaylor@gmail.com</Body>
                <a
                  className="link-text"
                  href="mailto:registrywithtaylor@gmail.com"
                  aria-label="Email Taylor-Made Baby Planning"
                >
                  Send an email
                </a>
              </article>
              <article className="feature-card">
                <h3 className="feature-card__title">Phone</h3>
                <Body className="feature-card__body body-copy--full">(505) 660-5436</Body>
                <a
                  className="link-text"
                  href="tel:+15056605436"
                  aria-label="Call Taylor-Made Baby Planning"
                >
                  Call now
                </a>
              </article>
            </div>
          </div>
        </Section>

        <Section variant="neutral" aria-label="Contact form">
          <div className="container">
            <SectionTitle className="section__title">Send a message</SectionTitle>
            <form id="contact-form" className="contact-form" noValidate>
              <div className="form-field">
                <label className="form-field__label" htmlFor="contact-name">
                  Name *
                </label>
                <input className="form-field__input" type="text" id="contact-name" name="contact-name" required />
                <span className="form-message" aria-live="polite"></span>
              </div>
              <div className="form-field">
                <label className="form-field__label" htmlFor="contact-email">
                  Email *
                </label>
                <input className="form-field__input" type="email" id="contact-email" name="contact-email" required />
                <span className="form-message" aria-live="polite"></span>
              </div>
              <div className="form-field">
                <label className="form-field__label" htmlFor="contact-message">
                  Message *
                </label>
                <textarea className="form-field__textarea" id="contact-message" name="contact-message" required></textarea>
                <span className="form-message" aria-live="polite"></span>
              </div>
              <Body className="form-status body-copy--full" aria-live="polite"></Body>
              <button className="btn btn--primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </Section>

        <Section variant="base" aria-label="Response time">
          <div className="container">
            <Body className="hero__subtitle">Responses typically within 24 hours.</Body>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
