import Link from 'next/link';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';

type PlanningPackage = {
  serviceKey: 'focused-edit' | 'signature-plan' | 'private-concierge';
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  iconSrc: string;
  ctaLabel: string;
  featured?: boolean;
  badge?: string;
};

const planningPackages: PlanningPackage[] = [
  {
    serviceKey: 'focused-edit',
    eyebrow: 'One Priority',
    title: 'Focused Baby Gear Consultation',
    summary: 'For one decision that needs expert help now.',
    description:
      'Use this session for a stroller and car seat comparison, a registry cleanup, a sleep-space question, or a nursery layout decision that needs a practical answer.',
    iconSrc: '/assets/icons/buildregistry.png',
    features: [
      'Stroller and car seat guidance',
      'Registry review for one priority area',
      'Written recommendations and next steps',
      'Buy-now versus later direction',
    ],
    ctaLabel: 'Book a Focused Consultation',
  },
  {
    serviceKey: 'signature-plan',
    eyebrow: 'Full Prep Support',
    title: 'Complete Registry & Gear Plan',
    summary: 'For families who want help across the full baby-prep picture.',
    description:
      'This package covers the big categories together, from registry structure and gear choices to nursery planning and a practical purchase timeline.',
    iconSrc: '/assets/icons/calender.png',
    features: [
      'Registry structure and product selection',
      'Stroller, car seat, sleep, and feeding gear guidance',
      'Nursery planning recommendations',
      'Personalized gear purchasing timeline',
    ],
    ctaLabel: 'Start the Complete Plan',
    featured: true,
    badge: 'Most Popular',
  },
  {
    serviceKey: 'private-concierge',
    eyebrow: 'Ongoing Support',
    title: 'Private Baby Planning Support',
    summary: 'For families who want an expert in the mix while details keep moving.',
    description:
      'Ongoing support for families who want help as decisions stack up, store visits get scheduled, and home-prep details keep changing in real time.',
    iconSrc: '/assets/icons/private.png',
    features: [
      'Ongoing gear and registry support',
      'Nursery and home-prep guidance',
      'Prep for store visits and product comparisons',
      'Follow-up as priorities shift',
    ],
    ctaLabel: 'Explore Private Support',
  },
];

function ServiceChecklist({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={['space-y-4 leading-relaxed', className].filter(Boolean).join(' ')}>
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
    <div className={['grid grid-cols-1 gap-8 md:grid-cols-3', className].filter(Boolean).join(' ')}>
      {planningPackages.map((pkg) => {
        const isFeatured = Boolean(pkg.featured);

        return (
          <MarketingSurface
            key={pkg.serviceKey}
            className={[
              'flex h-full flex-col rounded-2xl p-8 shadow-sm md:p-8',
              isFeatured ? 'border-[var(--color-accent)] shadow-lg' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <ServiceIconBadge src={pkg.iconSrc} size="card" className="mb-8 self-center" />

            {pkg.badge ? (
              <div className="mb-5">
                <span className="pointer-events-none inline-flex rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent-dark)] select-none">
                  {pkg.badge}
                </span>
              </div>
            ) : null}

            <p className="text-xs uppercase tracking-[0.2em] text-black/45">
              {pkg.eyebrow}
            </p>

            <H3 className="mt-4 font-serif leading-tight">
              {pkg.title}
            </H3>

            <p className="mt-3 text-sm text-neutral-600">
              {pkg.summary}
            </p>

            <Body className="mt-6 mb-8 text-neutral-600">
              {pkg.description}
            </Body>

            <ServiceChecklist items={pkg.features} className="mb-10 text-charcoal/80" />

            <Link
              href={`/contact?service=${pkg.serviceKey}`}
              className={[
                'mt-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]',
                isFeatured ? 'btn btn--primary' : 'btn btn--secondary',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {pkg.ctaLabel} <span aria-hidden className="ml-2">→</span>
            </Link>
          </MarketingSurface>
        );
      })}
    </div>
  );
}
