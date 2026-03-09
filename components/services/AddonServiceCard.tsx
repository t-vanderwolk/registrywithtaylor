'use client';

import Image from 'next/image';
import MarketingSurface from '@/components/ui/MarketingSurface';
import LuxuryAccordion from '@/components/ui/LuxuryAccordion';
import ServiceIconBadge from '@/components/ui/ServiceIconBadge';

export type AddonServiceCardData = {
  label?: string;
  title: string;
  description?: string;
  features: string[];
  iconSrc?: string;
  partnerLabel?: string;
  partnerLogoSrc?: string;
  partnerLogoAlt?: string;
  accordionVariant?: 'checklist' | 'stacked' | 'labeled';
  accordionHeading?: string;
  cardVariant?: 'default' | 'pillar';
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
  partnerLabel,
  partnerLogoSrc,
  partnerLogoAlt,
  accordionVariant,
  accordionHeading,
  cardVariant = 'default',
  className = '',
  isOpen,
  onToggle,
}: AddonServiceCardProps) {
  const isPillarCard = cardVariant === 'pillar';

  return (
    <MarketingSurface
      className={[
        isPillarCard
          ? 'flex min-h-[18rem] min-w-0 flex-col rounded-2xl p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg sm:min-h-[22rem] sm:p-8 md:min-h-[23rem]'
          : 'flex min-h-[21.5rem] min-w-0 flex-col rounded-2xl p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg sm:min-h-[26rem] sm:p-8 md:min-h-[29rem]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-full flex-1 flex-col">
        <div
          className={[
            'mx-auto flex aspect-square w-full items-center justify-center rounded-[1.75rem] border border-black/12 bg-[linear-gradient(180deg,#fcf8f4_0%,#f3ebe3_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
            isPillarCard ? 'mb-5 max-w-[10rem] sm:mb-6 sm:max-w-[11.5rem]' : 'mb-6 max-w-[11rem] sm:mb-8 sm:max-w-[13.25rem]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={['flex h-full w-full items-center justify-center', isPillarCard ? 'p-4 sm:p-5' : 'p-5 sm:p-6'].join(' ')}>
            <ServiceIconBadge
              src={iconSrc ?? '/assets/icons/buildregistry.png'}
              size="addon"
              className={isPillarCard ? 'h-[5.8rem] w-[5.8rem] self-center sm:h-[6.8rem] sm:w-[6.8rem]' : 'h-[6.35rem] w-[6.35rem] self-center sm:h-[7.45rem] sm:w-[7.45rem]'}
              imageClassName="drop-shadow-[0_10px_18px_rgba(184,160,129,0.18)]"
            />
          </div>
        </div>

        <h3 className="max-w-none text-center font-serif text-[1.35rem] tracking-tight text-neutral-900 sm:max-w-[20ch] md:text-2xl">
          {title}
        </h3>

        {partnerLogoSrc ? (
          <div className="mt-4 flex flex-col items-center gap-2 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-black/45">
              {partnerLabel ?? 'In partnership with'}
            </p>
            <div className="relative h-9 w-full max-w-[9.5rem]">
              <Image
                src={partnerLogoSrc}
                alt={partnerLogoAlt ?? title}
                fill
                sizes="152px"
                className="object-contain"
              />
            </div>
          </div>
        ) : null}

        {label ? (
          <span className="mt-3 text-xs uppercase tracking-[0.25em] text-black/45">{label}</span>
        ) : null}

        {description ? (
          <p className="mt-4 max-w-none text-sm leading-relaxed text-neutral-700 sm:max-w-md">
            {description}
          </p>
        ) : null}

        <div className={isPillarCard ? 'mt-auto pt-5 sm:pt-6' : 'mt-auto pt-6 sm:pt-8'}>
          <LuxuryAccordion
            items={features}
            isOpen={isOpen}
            onToggle={onToggle}
            contentVariant={accordionVariant}
            panelHeading={accordionHeading}
          />
        </div>
      </div>
    </MarketingSurface>
  );
}
