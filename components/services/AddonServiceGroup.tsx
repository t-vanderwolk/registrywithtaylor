import AddonServiceShowcase from '@/components/services/AddonServiceShowcase';
import type { AddonServiceCardData } from '@/components/services/AddonServiceCard';
import type { ServiceGroupIconName } from '@/components/services/ServiceGroupIcon';
import { Body } from '@/components/ui/MarketingHeading';

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
  icon: _icon,
  services,
  isFirst = false,
  headingId,
}: AddonServiceGroupProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={[
        'space-y-8 py-12 md:py-16',
        isFirst ? 'pt-0' : 'mt-16 border-t border-neutral-200/80 pt-16 md:mt-20 md:pt-20',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="grid max-w-5xl gap-4 md:gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start lg:gap-14">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-black/45">Support Focus</p>

          <h3 id={headingId} className="font-serif text-2xl font-semibold tracking-tight text-black md:text-3xl">
            {title}
          </h3>
        </div>

        <Body className="max-w-2xl text-neutral-600">{description}</Body>
      </div>

      <AddonServiceShowcase services={services} />
    </section>
  );
}
