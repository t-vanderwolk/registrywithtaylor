'use client';

import MarketingSurface from '@/components/ui/MarketingSurface';
import LuxuryAccordion from '@/components/ui/LuxuryAccordion';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';

export type AddonServiceCardData = {
  label: string;
  title: string;
  description: string;
  features: string[];
  iconSrc?: string;
};

type AddonServiceCardProps = AddonServiceCardData & {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
};

export default function AddonServiceCard({
  label,
  title,
  description,
  features,
  iconSrc,
  className = '',
  isOpen,
  onToggle,
}: AddonServiceCardProps) {
  return (
    <MarketingSurface
      className={[
        'flex min-h-[30rem] min-w-0 flex-col rounded-2xl p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg md:p-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-full flex-1 flex-col">
        <ServiceIconBadge
          src={iconSrc ?? '/assets/icons/clipboard.png'}
          size="card"
          className="mb-8 self-center"
        />

        <h3 className="max-w-[18ch] font-serif text-xl tracking-tight text-neutral-900 md:text-2xl">
          {title}
        </h3>

        <span className="mt-2 text-xs uppercase tracking-[0.25em] text-black/50">{label}</span>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
          {description}
        </p>

        <div className="mt-auto pt-8">
          <LuxuryAccordion
            items={features}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        </div>
      </div>
    </MarketingSurface>
  );
}
