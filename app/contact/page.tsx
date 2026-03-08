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
    'Have a question about baby gear, registry strategy, nursery planning, or home prep? Get in touch for personalized guidance.',
};

const serviceConfig = {
  'focused-edit': {
    label: 'Focused Session',
    intro: 'A practical review of your registry, gear shortlist, or one baby-prep decision.',
    fields: ['registryLink', 'dueDate', 'topConcerns'],
  },
  'signature-plan': {
    label: 'Signature Prep Support',
    intro: 'Hands-on support across registry strategy, nursery setup, and gear decisions.',
    fields: ['dueDate', 'homeType', 'budgetRange', 'biggestStress'],
  },
  'private-concierge': {
    label: 'Ongoing Planning Support',
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
          image="/assets/hero/hero-06.jpg"
          imageAlt="Contact consultation workspace"
        >
          <div className="space-y-6">
            <h1 className="hero-load-reveal font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <Body className="hero-load-reveal hero-load-reveal--1 max-w-xl text-neutral-700">
              Whether you need help with a registry, gear decision, nursery setup, or home prep, I&apos;m here to help you sort the next step.
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
