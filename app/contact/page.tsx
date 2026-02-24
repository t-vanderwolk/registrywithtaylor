import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Contact — Taylor-Made Baby Co.',
  description:
    'Reach Taylor-Made Baby Co. by email, phone, or the contact form to discuss your registry and celebration plans.',
  path: '/contact',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Contact Taylor-Made Baby Co.',
});

function ContactForm() {
  return (
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
      <p className="form-status body-copy--full" aria-live="polite"></p>
      <button className="btn btn--primary" type="submit">
        Submit
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <SiteShell currentPath="/contact">
      <main className="site-main">
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">

            {/* LEFT COLUMN — COPY */}
            <div className="max-w-[520px] space-y-7">

              <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
                Let&apos;s Begin with Intention.
              </h1>

              <p className="text-lg text-neutral-700 leading-relaxed">
                For families seeking continued, private planning support beyond
                their complimentary consultation.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                After your Baby Concierge session, some families feel fully confident
                moving forward on their own.
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed">
                Others choose ongoing guidance through Taylor-Made Baby Co.
                - from nursery planning and registry refinement
                to complete home preparation.
              </p>

              <p className="text-neutral-900 font-medium">
                I personally review every inquiry and respond within 24 hours.
              </p>

              <p className="text-sm uppercase tracking-wide text-neutral-500 pt-4">
                Private · Personalized · No pressure
              </p>

            </div>

            {/* RIGHT COLUMN — FORM */}
            <div className="bg-[var(--color-ivory)] p-10 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.06)]">

              <ContactForm />

            </div>

          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="text-center space-y-6">

            <p className="text-lg text-neutral-700 leading-relaxed">
              Not sure if private planning is the right fit?
            </p>

            <Link href="/how-it-works" className="btn btn--secondary">
              Start with a Complimentary Consultation
            </Link>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
