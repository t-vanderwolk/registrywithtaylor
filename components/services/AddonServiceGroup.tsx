import AddonServiceShowcase from '@/components/services/AddonServiceShowcase';
import type { AddonServiceCardData } from '@/components/services/AddonServiceCard';
import { getServiceGroupIconAsset, type ServiceGroupIconName } from '@/components/services/ServiceGroupIcon';
import { Body } from '@/components/ui/MarketingHeading';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';

type AddonServiceGroupProps = {
  title: string;
  description: string;
  icon: ServiceGroupIconName;
  services: AddonServiceCardData[];
  isFirst?: boolean;
  headingId: string;
};

export default function AddonServiceGroup({
  title,
  description,
  icon,
  services,
  isFirst = false,
  headingId,
}: AddonServiceGroupProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={[
        'space-y-10 py-20',
        isFirst ? 'pt-0' : 'mt-24 border-t border-neutral-200 pt-24',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-black/45">Service Group</p>

          <div className="flex items-center gap-4">
            <ServiceIconBadge src={getServiceGroupIconAsset(icon)} />

            <h3 id={headingId} className="font-serif text-2xl font-semibold tracking-tight text-black md:text-3xl">
              {title}
            </h3>
          </div>
        </div>

        <Body className="max-w-xl text-neutral-600">{description}</Body>
      </div>

      <AddonServiceShowcase services={services} />
    </section>
  );
}
