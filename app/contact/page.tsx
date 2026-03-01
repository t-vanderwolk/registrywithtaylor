import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
import { Body } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import ContactInquiryForm from '@/components/contact/ContactInquiryForm';

export const metadata = {
  title: 'Get in Touch | Taylor-Made Baby Co.',
  description:
    'Have a question about registry planning, nursery design, or private concierge services? Get in touch for personalized guidance.',
};

const serviceConfig = {
  'focused-edit': {
    label: 'The Focused Edit',
    intro: 'A refined review of your registry or planning decisions.',
    fields: ['registryLink', 'dueDate', 'topConcerns'],
  },
  'signature-plan': {
    label: 'The Signature Plan',
    intro: 'Full planning support across registry, nursery, and gear.',
    fields: ['dueDate', 'homeType', 'budgetRange', 'biggestStress'],
  },
  'private-concierge': {
    label: 'The Private Concierge',
    intro: 'White-glove planning with ongoing, high-touch support.',
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
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact consultation workspace"
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Get in Touch
            </h1>
            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Whether you're exploring services or have a specific question, I'm here to help guide your next step.
            </Body>
          </div>
        </Hero>

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
