import Link from 'next/link';
import Section from '@/components/Section';
import SiteShell from '@/components/SiteShell';
import { SectionTitle } from '@/components/Typography';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const faqs = [
  {
    id: 'faq-1',
    question: 'Do I have to purchase everything you recommend?',
    answer:
      'No. Guidance is educational and collaborative — you decide what fits your lifestyle and budget.',
  },
  {
    id: 'faq-2',
    question: 'Are consultations virtual or in-person?',
    answer:
      'Primarily virtual, with flexibility for local clients who prefer an in-person walkthrough.',
  },
  {
    id: 'faq-3',
    question: 'Is this only for first-time parents?',
    answer:
      'No. Many returning parents use the services to refresh their registry or simplify the planning load.',
  },
  {
    id: 'faq-4',
    question: 'Do you receive commissions from brands?',
    answer:
      'Recommendations are based on fit first. Partnerships may exist, but they do not dictate guidance.',
  },
  {
    id: 'faq-5',
    question: 'How long is a consultation?',
    answer:
      'Typically 45–60 minutes depending on goals and the number of registry elements we review.',
  },
  {
    id: 'faq-6',
    question: 'Can I come back with questions later?',
    answer: 'Yes. Ongoing support and adjustments are encouraged as plans evolve.',
  },
  {
    id: 'faq-7',
    question: 'Do you help with nursery design?',
    answer: 'Yes — layout, product selection, and organization guidance are available.',
  },
  {
    id: 'faq-8',
    question: 'What happens after the consultation?',
    answer:
      'You’ll receive recap notes, curated suggestions, and optional follow-up support to keep momentum.',
  },
];

export const metadata = buildMarketingMetadata({
  title: 'FAQ — Taylor-Made Baby Co.',
  description:
    'Frequently asked questions about Taylor-Made Baby Co.\'s services, process, and support.',
  path: '/faq',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Frequently asked questions',
});

export default function FAQPage() {
  return (
    <SiteShell currentPath="/faq">
      <main className="site-main">
        <Hero
          eyebrow="Frequently Asked Questions"
          title="Frequently Asked Questions"
          subtitle="Quick answers to common registry and planning questions."
          image="/assets/hero/hero-05.jpg"
          imageAlt="Frequently asked questions background"
        />

        <Section variant="warm" aria-label="FAQ accordion">
          <div className="container">
            <SectionTitle className="section__title">Answers from our studio</SectionTitle>
            <div className="accordion" id="faq-accordion">
              {faqs.map((faq) => (
                <div className="accordion__item" key={faq.id}>
                  <button
                    className="accordion__trigger"
                    type="button"
                    aria-expanded="false"
                    aria-controls={faq.id}
                  >
                    {faq.question}
                    <span aria-hidden="true">+</span>
                  </button>
                  <div className="accordion__content" id={faq.id} aria-hidden="true">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section variant="neutral" aria-label="Still have questions">
          <div className="container hero__content">
            <SectionTitle className="section__title">Still have questions?</SectionTitle>
            <div className="hero__actions">
              <Link className="btn btn--primary" href="/contact">
                Contact
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </SiteShell>
  );
}
