import Link from 'next/link';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';

type PlanningPackage = {
  serviceKey: 'focused-edit' | 'signature-plan' | 'private-concierge';
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
  badge?: string;
};

const planningPackages: PlanningPackage[] = [
  {
    serviceKey: 'focused-edit',
    eyebrow: 'One Priority',
    title: 'A Focused Session',
    summary: 'For one decision that needs expert help now.',
    description:
      'Use this session for a stroller and car seat comparison, a registry cleanup, a sleep-space question, or a nursery layout decision that needs a practical answer.',
    features: [
      'Stroller and car seat guidance',
      'Registry review for one priority area',
      'Written recommendations and next steps',
      'Buy-now versus later direction',
    ],
    ctaLabel: 'Book Focused',
  },
  {
    serviceKey: 'signature-plan',
    eyebrow: 'Full Prep Support',
    title: 'The Signature Package',
    summary: 'For families who want help across the full baby-prep picture.',
    description:
      'This package covers the big categories together, from registry structure and gear choices to nursery planning and a practical purchase timeline.',
    features: [
      'Registry structure and product selection',
      'Stroller, car seat, sleep, and feeding gear guidance',
      'Nursery planning recommendations',
      'Personalized gear purchasing timeline',
    ],
    ctaLabel: 'Start Signature',
    featured: true,
    badge: 'Most Popular',
  },
  {
    serviceKey: 'private-concierge',
    eyebrow: 'Ongoing Support',
    title: 'The Concierge Experience',
    summary: 'For families who want an expert in the mix while details keep moving.',
    description:
      'Ongoing support for families who want help as decisions stack up, store visits get scheduled, and home-prep details keep changing in real time.',
    features: [
      'Ongoing gear and registry support',
      'Nursery and home-prep guidance',
      'Prep for store visits and product comparisons',
      'Follow-up as priorities shift',
    ],
    ctaLabel: 'Explore Concierge',
  },
];

function ServiceChecklist({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={['space-y-3 leading-relaxed sm:space-y-4', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4">
          <CheckIcon />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PlanningPackageCards({ className = '' }: { className?: string }) {
  return (
    <div className={['grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-8', className].filter(Boolean).join(' ')}>
      {planningPackages.map((pkg) => {
        const isFeatured = Boolean(pkg.featured);

        return (
          <div key={pkg.serviceKey} className="relative flex h-full flex-col pt-4 sm:pt-6">
            {pkg.badge ? (
              <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 select-none" aria-hidden="true">
                <span className="inline-flex rounded-full border border-[rgba(232,154,174,0.28)] bg-white/90 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70 shadow-sm">
                  {pkg.badge}
                </span>
              </div>
            ) : null}

            <MarketingSurface
              className={[
                'flex h-full flex-col items-center rounded-2xl p-6 text-center shadow-sm sm:p-8',
                'min-h-[auto]',
                isFeatured ? 'border-[var(--color-accent)] shadow-lg' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <p className="pt-1 text-center text-xs uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/70">
                {pkg.eyebrow}
              </p>

              <H3 className="mt-4 text-center font-serif leading-tight">
                {pkg.title}
              </H3>

              <p className="mt-3 text-center text-base leading-relaxed text-neutral-600">
                {pkg.summary}
              </p>

              <Body className="mt-5 mb-7 text-center text-neutral-600 sm:mt-6 sm:mb-8">
                {pkg.description}
              </Body>

              <ServiceChecklist items={pkg.features} className="mx-auto mb-8 max-w-md text-left text-charcoal/80 sm:mb-10" />

              <Link
                href={`/contact?service=${pkg.serviceKey}`}
                className={[
                  'mt-auto w-full self-center justify-center sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]',
                  isFeatured ? 'btn btn--primary' : 'btn btn--secondary',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {pkg.ctaLabel} <span aria-hidden className="ml-2">→</span>
              </Link>
            </MarketingSurface>
          </div>
        );
      })}
    </div>
  );
}
