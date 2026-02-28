import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import Hero from '@/components/ui/Hero';
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
          showRibbon
          ribbonClassName="translate-y-0 md:translate-y-1"
          className="hero-home-radial hero-bottom-fade md:pt-6 md:pb-28 z-20"
          contentClassName="marketing-hero-content marketing-hero-content--wide"
          contentStyle={{
            borderRadius: '32px',
            padding: '3.5rem 3rem',
          }}
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact consultation workspace"
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              Get in Touch
            </h1>
            <p className="hero-load-reveal hero-load-reveal--1 text-lg md:text-xl text-neutral-700 leading-relaxed max-w-xl">
              Whether you're exploring services or have a specific question, I'm here to help guide your next step.
            </p>
          </div>
        </Hero>

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="max-w-2xl mx-auto rounded-2xl bg-[var(--color-ivory)] p-10 md:p-12 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
              <ContactInquiryForm
                selectedService={selectedService || undefined}
                selectedServiceLabel={config?.label ?? null}
                selectedFields={selectedFields}
                dueDateRequired={dueDateRequired}
              />
            </div>
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
