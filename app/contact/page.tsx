import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Display, Eyebrow, Lead, SectionTitle } from '@/components/Typography';

export const metadata = {
  title: 'Contact — Registry With Taylor',
  description:
    'Reach Registry With Taylor by email, phone, or the contact form to discuss your registry and celebration plans.',
};

export default function ContactPage() {
  return (
    <SiteShell currentPath="/contact">
      <main className="site-main">
        <Section variant="base" className="hero" aria-labelledby="contact-hero">
          <div className="container hero__content">
            <Eyebrow className="hero__eyebrow">Get in Touch</Eyebrow>
            <Display id="contact-hero" className="hero__title">
              Get in Touch
            </Display>
            <Lead className="hero__subtitle">
              Have questions or ready to start your registry? I’m here to help.
            </Lead>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="#contact-form">
                Book a Consultation
              </Link>
            </div>
          </div>
        </Section>

        <Section variant="warm" aria-label="Direct contacts">
          <div className="container">
            <SectionTitle className="section__title">Reach out directly</SectionTitle>
            <div className="feature-grid">
              <article className="feature-card">
                <h3 className="feature-card__title">Email</h3>
                <Body className="feature-card__body body-copy--full">registrywithtaylor@gmail.com</Body>
                <a
                  className="primary-nav__link"
                  href="mailto:registrywithtaylor@gmail.com"
                  aria-label="Email registry with taylor"
                >
                  Send an email
                </a>
              </article>
              <article className="feature-card">
                <h3 className="feature-card__title">Phone</h3>
                <Body className="feature-card__body body-copy--full">(505) 660-5436</Body>
                <a
                  className="primary-nav__link"
                  href="tel:+15056605436"
                  aria-label="Call registry with taylor"
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
