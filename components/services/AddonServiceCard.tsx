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
        'flex min-h-[24.5rem] min-w-0 flex-col rounded-2xl p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg sm:min-h-[26rem] sm:p-8 md:min-h-[29rem]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-full flex-1 flex-col">
        <div className="mx-auto mb-8 flex aspect-square w-full max-w-[13.25rem] items-center justify-center rounded-[1.75rem] border border-black/12 bg-[linear-gradient(180deg,#fcf8f4_0%,#f3ebe3_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="flex h-full w-full items-center justify-center p-6">
            <ServiceIconBadge
              src={iconSrc ?? '/assets/icons/buildregistry.png'}
              size="addon"
              className="h-[7.45rem] w-[7.45rem] self-center"
              imageClassName="drop-shadow-[0_10px_18px_rgba(184,160,129,0.18)]"
            />
          </div>
        </div>

        <h3 className="max-w-none font-serif text-xl tracking-tight text-neutral-900 sm:max-w-[20ch] md:text-2xl">
          {title}
        </h3>

        <span className="mt-3 text-xs uppercase tracking-[0.25em] text-black/45">{label}</span>

        <p className="mt-4 max-w-none text-sm leading-relaxed text-neutral-700 sm:max-w-md">
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
