import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Display, Lead, SectionTitle } from '@/components/Typography';

const services = [
  {
    title: 'Registry Curation',
    description: 'Distill every category so you gift and register with clarity.',
    reassurance: 'Focus on what fits your life.',
    href: '/how-it-works#registry',
    icon: '/assets/icons/icon-services-registry.png',
  },
  {
    title: 'Nursery & Home Setup',
    description: 'Calm layouts, textiles, and lighting that keep safety and serenity in balance.',
    reassurance: 'Create calm flow from day one.',
    href: '/contact',
    icon: '/assets/icons/icon-services-nursery.png',
  },
  {
    title: 'Gear Planning & Personal Shopping',
    description: 'Research-backed gear and gifting lists so you can stay fully present.',
    reassurance: 'We handle the research.',
    href: '/contact',
    icon: '/assets/icons/icon-services-shopping.png',
  },
  {
    title: 'Family Dynamics Support',
    description: 'Gentle scripts, boundaries, and expert perspective for tricky conversations.',
    reassurance: 'Kind, confident guidance.',
    href: '/contact',
    icon: '/assets/icons/icon-services-family.png',
  },
  {
    title: 'Baby Shower & Gifting Guidance',
    description: 'Coordinate invitations, wish lists, and thank-yous that respect every guest.',
    reassurance: 'Serve your people thoughtfully.',
    href: '/contact',
    icon: '/assets/icons/icon-services-babyshower.png',
  },
  {
    title: 'Travel & Everyday Logistics',
    description: 'Packing lists, rental coordination, and travel prep to keep life moving gently.',
    reassurance: 'Keep life moving — gently.',
    href: '/contact',
    icon: '/assets/icons/icon-services-travel.png',
  },
];

export const metadata = {
  title: 'Services — Taylor-Made Baby Planning',
  description:
    'Bespoke baby planning services from Taylor-Made Baby Planning covering registries, nursery design, events, and ongoing support.',
};

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <Section variant="base" className="hero" aria-labelledby="services-hero">
          <div className="container hero__content">
            <Display id="services-hero" className="hero__title">
              Bespoke Baby Planning Services
            </Display>
            <Lead className="hero__subtitle">Personalized guidance to help you plan with calm confidence.</Lead>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="/contact">
                Book a Free Consultation
              </Link>
              <Link className="link-text" href="/how-it-works">
                How It Works
              </Link>
            </div>
            <Body className="micro-note">No pressure. Camera optional.</Body>
          </div>
        </Section>

        <Section variant="warm" aria-label="service offerings">
          <div className="container">
            <div className="service-grid">
              {services.map((service) => (
                <article key={service.title} className="service-card">
                  <span
                    className="service-card__icon"
                    role="presentation"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${service.icon})` }}
                  />
                  <h3>{service.title}</h3>
                  <details className="service-card__details">
                    <summary className="service-card__summary">Tap to expand</summary>
                    <div className="service-card__body">
                      <Body className="body-copy--full">{service.description}</Body>
                      <Body className="micro-text body-copy--full">{service.reassurance}</Body>
                      <Link className="link-text" href={service.href}>
                        {service.title.includes('Registry') ? 'Explore registry planning' : 'Learn more'}
                      </Link>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </Section>
        <Section variant="neutral" className="mid-cta" aria-label="secondary cta">
          <div className="container">
            <div className="cta-panel">
              <h3>Ready to talk through your unique plan?</h3>
              <Link className="btn btn--secondary" href="/contact">
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </Section>

        <Section variant="base" className="trust-block" aria-label="testimonial">
          <div className="container testimonial-card">
            <span className="quote-icon" aria-hidden="true">
              “
            </span>
            <Body>Taylor helped us prioritize what actually works for our days instead of following another list.</Body>
            <Body className="micro-text">— Grateful parents</Body>
          </div>
        </Section>

        <Section variant="highlight" className="final-cta" aria-label="closing call to action">
          <div className="container final-cta__content">
            <SectionTitle className="section__title">Start with confidence.</SectionTitle>
            <Lead className="hero__subtitle">
              Book a free consultation and discover how thoughtful planning keeps you present for what matters most.
            </Lead>
            <div className="final-cta__actions">
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
