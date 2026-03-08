import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { Body } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Book Your Free Consultation - Taylor-Made Baby Co.',
  description:
    'Request your free 45-minute video consultation with Taylor to plan your registry with clarity.',
  path: '/consultation',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Free consultation request form',
});

type SearchParams = Promise<{ error?: string }> | undefined;

const inputClassName =
  'w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]';
const labelClassName = 'block text-sm font-medium text-neutral-900';

const ERROR_MESSAGES: Record<string, string> = {
  'invalid-form': 'Please try submitting the form again.',
  'invalid-email': 'Please enter a valid email address.',
  'invalid-date': 'Please enter a valid due date.',
  'rate-limit': 'Too many requests were submitted. Please try again shortly.',
  required: 'Name and email are required.',
};

export default async function ConsultationPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <Hero image="/assets/hero/hero-06.jpg" imageAlt="Consultation planning form">
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
              Book Your Free 45-Minute Consultation
            </h1>
            <Body className="hero-load-reveal hero-load-reveal--1 max-w-2xl text-neutral-700">
              Submit your request and Taylor will follow up directly to begin your Learn + Plan process.
            </Body>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-2xl space-y-6">
              <form action="/api/consultation-request" method="post" className="space-y-6">
                <input type="hidden" name="company" value="" tabIndex={-1} autoComplete="off" />

                <div className="space-y-2">
                  <label htmlFor="consultation-name" className={labelClassName}>
                    Name *
                  </label>
                  <input id="consultation-name" name="name" type="text" className={inputClassName} required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="consultation-email" className={labelClassName}>
                    Email *
                  </label>
                  <input
                    id="consultation-email"
                    name="email"
                    type="email"
                    className={inputClassName}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="consultation-due-date" className={labelClassName}>
                      Due Date
                    </label>
                    <input
                      id="consultation-due-date"
                      name="dueDate"
                      type="date"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="consultation-city" className={labelClassName}>
                      City
                    </label>
                    <input
                      id="consultation-city"
                      name="city"
                      type="text"
                      className={inputClassName}
                      placeholder="New York, NY"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="consultation-baby-number" className={labelClassName}>
                    First baby / second baby / third+
                  </label>
                  <select id="consultation-baby-number" name="babyNumber" className={inputClassName} defaultValue="">
                    <option value="">Select one</option>
                    <option value="first baby">First baby</option>
                    <option value="second baby">Second baby</option>
                    <option value="third+">Third+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="consultation-message" className={labelClassName}>
                    Short message
                  </label>
                  <textarea
                    id="consultation-message"
                    name="message"
                    rows={4}
                    className={inputClassName}
                    placeholder="Share what you want help with most."
                  />
                </div>

                {error ? (
                  <p className="text-sm text-red-600" aria-live="polite">
                    {error}
                  </p>
                ) : null}

                <button className="btn btn--primary w-full" type="submit">
                  Submit Consultation Request
                </button>
              </form>

              <p className="text-center text-sm text-neutral-600">
                Prefer to read the process first? <Link href="/how-it-works" className="link-underline">View How It Works</Link>
              </p>
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
