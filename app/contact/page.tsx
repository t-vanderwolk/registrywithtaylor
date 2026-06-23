import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import ContactInquiryForm from '@/components/contact/ContactInquiryForm';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Contact Taylor-Made Baby Co.',
  description:
    'Reach out with questions about baby gear guidance, registry strategy, nursery planning, or consultation support.',
  path: '/contact',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Contact Taylor-Made Baby Co.',
});

const serviceConfig = {
  'focused-edit': {
    label: 'Registry Consult',
    intro: 'A focused 1-hour session on your registry and the biggest product decisions.',
    fields: ['registryLink', 'dueDate', 'topConcerns'],
  },
  'signature-plan': {
    label: 'Longer-term planning',
    intro: 'Ongoing support across registry strategy, nursery setup, and baby gear decisions.',
    fields: ['dueDate', 'homeType', 'budgetRange', 'biggestStress'],
  },
  'private-concierge': {
    label: 'Full baby planning',
    intro: 'Continued, hands-on help as you sort registry, gear, and home-prep details.',
    fields: ['dueDate', 'location', 'levelOfSupport', 'timeline'],
  },
} as const;

type SearchParams = Promise<{ service?: string }> | undefined;
type ServiceKey = keyof typeof serviceConfig;
type ServiceField = (typeof serviceConfig)[ServiceKey]['fields'][number];

function isServiceKey(value: string): value is ServiceKey {
  return value in serviceConfig;
}

export default async function ContactPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const selectedService = params?.service ?? '';
  const resolvedService = isServiceKey(selectedService) ? selectedService : null;
  const config = resolvedService ? serviceConfig[resolvedService] : null;

  const selectedFields: readonly string[] = config?.fields ?? [];
  const hasField = (field: ServiceField) => selectedFields.includes(field);
  const dueDateRequired = hasField('dueDate');

  return (
    <SiteShell currentPath="/contact">
      <main className="site-main">
        <PageViewTracker path="/contact" pageType="contact" />

        <Hero
          className="homepage-hero"
          eyebrow="Contact"
          title="Contact Taylor"
          subtitle="Have a question, partnership idea, or need more support than a single Registry Consult? Send a note here."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact consultation workspace"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto mb-8 max-w-2xl rounded-[1.45rem] border border-[rgba(215,161,175,0.28)] bg-[linear-gradient(180deg,rgba(255,246,249,0.98)_0%,rgba(255,240,245,0.96)_100%)] px-6 py-5 shadow-[0_8px_24px_rgba(72,49,56,0.05)]">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/80">Looking to book a consultation?</p>
              <p className="mt-2 text-[0.97rem] leading-7 text-neutral-700">
                The booking form is separate.{' '}
                <Link href="/book" className="link-underline font-medium text-[var(--color-accent-dark)]">
                  Start here →
                </Link>
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="mx-auto mb-8 max-w-2xl rounded-[1.45rem] border border-[rgba(0,0,0,0.07)] bg-white/85 px-6 py-5 shadow-[0_8px_24px_rgba(72,49,56,0.04)]">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/80">
                Looking for more than one session?
              </p>
              <p className="mt-2 text-[0.97rem] leading-7 text-neutral-700">
                If you’re looking for more ongoing support with your registry, nursery, stroller and car
                seat decisions, or full baby planning, use this form and Taylor will help point you toward
                the right level of support.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <MarketingSurface className="mx-auto max-w-2xl space-y-6">
              <ContactInquiryForm
                selectedService={selectedService || undefined}
                selectedServiceLabel={config?.label ?? null}
                selectedFields={selectedFields}
                dueDateRequired={dueDateRequired}
              />
            </MarketingSurface>
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
