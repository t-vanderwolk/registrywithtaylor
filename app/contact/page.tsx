import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import RibbonDivider from '@/components/layout/RibbonDivider';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Contact — Taylor-Made Baby Co.',
  description:
    'Reach Taylor-Made Baby Co. by email, phone, or the contact form to discuss your registry and celebration plans.',
  path: '/contact',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Contact Taylor-Made Baby Co.',
});

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

const inputClassName =
  'w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]';

const labelClassName = 'block text-sm font-medium text-neutral-900';

function isServiceKey(value: string): value is ServiceKey {
  return value in serviceConfig;
}

export default async function ContactPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const selectedService = params?.service ?? '';
  const resolvedService = isServiceKey(selectedService) ? selectedService : null;
  const config = resolvedService ? serviceConfig[resolvedService] : null;

  const heroTitle = config ? `Begin ${config.label}` : 'Book a Complimentary Consultation';
  const heroSubline = config
    ? config.intro
    : 'Share a few details and I will personally guide you toward the right next step.';

  const selectedFields: readonly string[] = config?.fields ?? [];
  const hasField = (field: ServiceField) => selectedFields.includes(field);
  const dueDateRequired = hasField('dueDate');

  return (
    <SiteShell currentPath="/contact">
      <main className="site-main">
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="narrow"
          className="relative overflow-visible !pt-20 md:!pt-24 !pb-20 md:!pb-24"
        >
          <div className="text-center space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
              {heroTitle}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {heroSubline}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 md:h-20 bg-white z-10" />
          <div className="absolute left-1/2 -bottom-4 md:-bottom-6 w-screen -translate-x-1/2 z-20 pointer-events-none">
            <RibbonDivider decorative className="opacity-90" />
          </div>
        </MarketingSection>

        <MarketingSection tone="white" spacing="default" container="narrow">
          <div className="max-w-2xl mx-auto rounded-2xl bg-[var(--color-ivory)] p-10 md:p-12 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
            {config && (
              <div className="inline-block px-4 py-1 text-xs uppercase tracking-wide bg-[var(--color-blush)]/10 text-[var(--color-blush)] rounded-full">
                Selected Service: {config.label}
              </div>
            )}

            <form className="space-y-6" noValidate>
              {resolvedService && <input type="hidden" name="service" value={resolvedService} />}

              <div className="space-y-2">
                <label htmlFor="fullName" className={labelClassName}>
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={inputClassName}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className={labelClassName}>
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={inputClassName}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dueDate" className={labelClassName}>
                  Due Date {dueDateRequired ? '*' : '(Optional)'}
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className={inputClassName}
                  required={dueDateRequired}
                />
              </div>

              {hasField('registryLink') && (
                <div className="space-y-2">
                  <label htmlFor="registryLink" className={labelClassName}>
                    Registry URL
                  </label>
                  <input
                    id="registryLink"
                    name="registryLink"
                    type="url"
                    placeholder="https://"
                    className={inputClassName}
                  />
                </div>
              )}

              {hasField('homeType') && (
                <div className="space-y-2">
                  <label htmlFor="homeType" className={labelClassName}>
                    Home Type
                  </label>
                  <select
                    id="homeType"
                    name="homeType"
                    className={inputClassName}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="apartment">Apartment</option>
                    <option value="city-living">City Living</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {hasField('budgetRange') && (
                <div className="space-y-2">
                  <label htmlFor="budgetRange" className={labelClassName}>
                    Budget Range
                  </label>
                  <select
                    id="budgetRange"
                    name="budgetRange"
                    className={inputClassName}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="private-discussion">Prefer to discuss privately</option>
                    <option value="conscious-flexible">Conscious but flexible</option>
                    <option value="investment-focused">Investment-focused</option>
                  </select>
                </div>
              )}

              {hasField('biggestStress') && (
                <div className="space-y-2">
                  <label htmlFor="biggestStress" className={labelClassName}>
                    What feels most overwhelming right now?
                  </label>
                  <textarea
                    id="biggestStress"
                    name="biggestStress"
                    rows={4}
                    className={inputClassName}
                  />
                </div>
              )}

              {hasField('location') && (
                <div className="space-y-2">
                  <label htmlFor="location" className={labelClassName}>
                    City + State
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className={inputClassName}
                    placeholder="Chicago, IL"
                  />
                </div>
              )}

              {hasField('levelOfSupport') && (
                <div className="space-y-2">
                  <label htmlFor="levelOfSupport" className={labelClassName}>
                    Preferred Level of Support
                  </label>
                  <select
                    id="levelOfSupport"
                    name="levelOfSupport"
                    className={inputClassName}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="strategic-guidance">Strategic guidance</option>
                    <option value="nursery-planning">Nursery planning</option>
                    <option value="full-purchasing-oversight">Full purchasing oversight</option>
                    <option value="ongoing-concierge">Ongoing concierge</option>
                  </select>
                </div>
              )}

              {hasField('timeline') && (
                <div className="space-y-2">
                  <label htmlFor="timeline" className={labelClassName}>
                    When are you hoping to begin?
                  </label>
                  <textarea
                    id="timeline"
                    name="timeline"
                    rows={4}
                    className={inputClassName}
                  />
                </div>
              )}

              {hasField('topConcerns') && (
                <div className="space-y-2">
                  <label htmlFor="topConcerns" className={labelClassName}>
                    What are your top concerns?
                  </label>
                  <textarea
                    id="topConcerns"
                    name="topConcerns"
                    rows={4}
                    className={inputClassName}
                  />
                </div>
              )}

              {!config && (
                <div className="space-y-2">
                  <label htmlFor="notes" className={labelClassName}>
                    How can I support you?
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className={inputClassName}
                  />
                </div>
              )}

              <button className="btn btn--primary w-full" type="submit">
                Submit Inquiry
              </button>

              <p className="text-sm text-neutral-600 text-center">
                I personally review every inquiry and respond within 24 hours.
              </p>
            </form>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
