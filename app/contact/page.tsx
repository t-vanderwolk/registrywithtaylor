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
  imagePath: '/assets/editorial/gear.jpg',
  imageAlt: 'Contact Taylor-Made Baby Co.',
});

const serviceConfig = {
  'focused-edit': {
    label: 'Focused Edit',
    intro: 'A practical review of your registry, gear shortlist, or one baby-prep decision.',
    fields: ['registryLink', 'dueDate', 'topConcerns'],
  },
  'signature-plan': {
    label: 'Signature Edit',
    intro: 'Hands-on support across registry strategy, nursery setup, and baby gear decisions.',
    fields: ['dueDate', 'homeType', 'budgetRange', 'biggestStress'],
  },
  'private-concierge': {
    label: 'Private Concierge',
    intro: 'Continued expert help as you sort registry, gear, and home-prep details.',
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
        <Hero
          className="homepage-hero"
          eyebrow="Contact"
          title="Get in Touch"
          subtitle="Whether you need help with a registry, gear decision, nursery setup, or home prep, I'm here to help you sort the next step."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact consultation workspace"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
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
