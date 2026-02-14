import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { Body, Display, Lead, SectionTitle } from '@/components/Typography';
import Hero from '@/components/ui/Hero';
import RibbonDivider from './ui/RibbonDivider';

const qualificationItems = [
  {
    title: 'You crave thoughtful, personal guidance',
    copy: 'You want a steady, experienced voice helping you filter what actually matters.',
  },
  {
    title: 'You want clarity without the noise',
    copy: 'You are overwhelmed by opinions and ready for decisions that fit your life.',
  },
  {
    title: 'You value intentional choices over trends',
    copy: 'You care more about longevity and function than what is popular this month.',
  },
  {
    title: 'You desire confidence before the baby arrives',
    copy: 'You want a grounded plan that leaves space for calm, flexibility, and real life.',
  },
];

const whyDifferent = [
  {
    title: 'Curated pacing',
    description: 'We build a season of sensible next steps so nothing feels rushed.',
  },
  {
    title: 'Executive touchpoints',
    description: 'Every call is live with a senior planner supported by concierge research.',
  },
  {
    title: 'Lasting clarity',
    description: 'You leave with rituals, lists, and reminders that feel effortless to follow.',
  },
];

const journalEntries = [
  {
    title: 'Building a registry without overbuying',
    description: 'How to choose the items that earn their place in your home.',
  },
  {
    title: 'Nursery layout that grows with you',
    description: 'Design a space that feels calm today and evolves with your family.',
  },
  {
    title: 'Rethinking the baby shower checklist',
    description: 'Lean into essentials and skip the noise.',
  },
];

export default function HomeContent() {
  return (
    <SiteShell currentPath="/">
      <main className="site-main">
        <Hero
          eyebrow="Taylor-Made Baby Planning"
          title="Baby prep, simplified."
          subtitle="Because parenthood should start with confidence, not confusion."
          primaryCta={{ label: 'Book a Free Consultation', href: '/contact' }}
          secondaryCta={{ label: 'View Services', href: '/services' }}
          tagline="Private · Personalized · No pressure"
          image="/assets/hero/hero-01.jpg"
        />
     

        <Section variant="warm" aria-label="Thoughtful advice">
          <div className="container text-center space-y-3">
            <SectionTitle>There’s a lot of advice out there.</SectionTitle>
            <Body className="mx-auto text-center">
              Most of it loud. Some of it helpful. Very little of it tailored to you.
            </Body>
            <Body className="mx-auto text-center">
              Taylor-Made Baby Planning delivers calm, thoughtful guidance that helps you prepare
              intentionally — with products, decisions, and timelines that fit your real life.
            </Body>
          </div>
        </Section>
   <RibbonDivider />
        <Section variant="neutral" className="this-for-you-section" aria-label="Qualifications">
          <div className="container">
            <h2 className="this-for-you-header">This is for you if…</h2>
            <div className="this-for-you-grid">
              {qualificationItems.map((item, index) => (
                <div key={item.title} className={`this-for-you-card stagger-${index}`}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Body>It’s not about buying more.</Body>
              <Body>It’s about choosing with intention.</Body>
            </div>
          </div>
        </Section>

        <Section variant="warm" aria-label="Why this feels different">
          <div className="container">
            <div className="space-y-3 text-center">
              <p className="hero__eyebrow">Why this feels different</p>
              <h2 className="section-title">A private planning signature</h2>
              <Body>Each touchpoint is crafted for calm clarity and tailored to your routines.</Body>
            </div>
            <div className="grid gap-6 md:grid-cols-3 mt-8">
              {whyDifferent.map((card) => (
                <article key={card.title} className="feature-card">
                  <h3>{card.title}</h3>
                  <Body className="body-copy--full">{card.description}</Body>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section variant="base" className="trust-block" aria-label="What feels different">
          <div className="container testimonial-card">
            <span className="quote-icon" aria-hidden="true">
              “
            </span>
            <Body>
              Taylor made every touchpoint effortless. The planning felt calm, deliberate, and deeply
              aligned with who we are. We entered parenthood with clarity and confidence.
            </Body>
            <Body className="micro-text">— Avery + Jordan, expecting</Body>
          </div>
        </Section>

        <Section variant="base" aria-label="Journal previews">
          <div className="container space-y-6">
            <div className="space-y-3 text-center">
              <p className="hero__eyebrow">Journal</p>
              <SectionTitle>Stories from the planning studio</SectionTitle>
              <Body>Notes on thoughtful rituals, registries, and real-life timing.</Body>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {journalEntries.map((entry) => (
                <article key={entry.title} className="feature-card">
                  <h3>{entry.title}</h3>
                  <Body className="body-copy--full">{entry.description}</Body>
                  <Link className="link-text" href="/blog">
                    Read story
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section variant="highlight" className="final-cta" aria-label="Closing call to action">
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
