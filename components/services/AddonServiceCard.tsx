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
        'flex min-h-[29rem] min-w-0 flex-col rounded-2xl p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg md:p-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-full flex-1 flex-col">
        <div className="mb-8 rounded-[1.75rem] border border-black/5 bg-[linear-gradient(180deg,#fcf8f4_0%,#f3ebe3_100%)] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="flex min-h-[10rem] items-center justify-center">
            <ServiceIconBadge
              src={iconSrc ?? '/assets/icons/buildregistry.png'}
              size="addon"
              className="h-[7.1rem] w-[7.1rem] self-center"
              imageClassName="drop-shadow-[0_10px_18px_rgba(184,160,129,0.18)]"
            />
          </div>
        </div>

        <h3 className="max-w-[20ch] font-serif text-xl tracking-tight text-neutral-900 md:text-2xl">
          {title}
        </h3>

        <span className="mt-3 text-xs uppercase tracking-[0.25em] text-black/45">{label}</span>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-700">
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
