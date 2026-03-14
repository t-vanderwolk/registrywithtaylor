'use client';

import MarketingSurface from '@/components/ui/MarketingSurface';
import LuxuryAccordion from '@/components/ui/LuxuryAccordion';
import PartnerBrandMark from '@/components/ui/PartnerBrandMark';
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
  partnerBadgeLines?: string[];
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
  partnerBadgeLines,
  accordionVariant,
  accordionHeading,
  cardVariant = 'default',
  className = '',
  isOpen,
  onToggle,
}: AddonServiceCardProps) {
  const isPillarCard = cardVariant === 'pillar';
  const hasPartnerBrand = Boolean(partnerLogoSrc?.trim());
  const hasPartnerBadge = Boolean(partnerBadgeLines?.length);
  const iconSurfaceSrc = hasPartnerBrand ? partnerLogoSrc! : iconSrc ?? '/assets/icons/buildregistry.png';
  const iconSurfaceAlt = hasPartnerBrand ? partnerLogoAlt ?? partnerLabel ?? title : '';
  const iconSurfaceImageClassName = hasPartnerBrand
    ? 'scale-[0.9] opacity-[0.8] saturate-[0.92] contrast-[0.96] md:scale-[0.94]'
    : 'scale-[0.98]';

  return (
    <MarketingSurface
      className={[
        isPillarCard
          ? 'flex min-h-[19rem] min-w-0 flex-col p-6 sm:min-h-[22rem] sm:p-8 md:min-h-[23rem]'
          : 'flex min-h-[21.5rem] min-w-0 flex-col p-6 sm:min-h-[26rem] sm:p-8 md:min-h-[29rem]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-full flex-1 flex-col">
        {label ? (
          <span className="inline-flex w-fit rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/75">
            {label}
          </span>
        ) : null}

        <div
          className={[
            'flex w-full items-center justify-start',
            isPillarCard ? 'mb-5 mt-6 max-w-[10rem] sm:mb-6 sm:max-w-[11.5rem]' : 'mb-6 mt-6 max-w-[11rem] sm:mb-8 sm:max-w-[13.25rem]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {hasPartnerBadge ? (
            <PartnerBrandMark lines={partnerBadgeLines ?? []} size="addon" className="self-center" />
          ) : (
            <ServiceIconBadge
              src={iconSurfaceSrc}
              alt={iconSurfaceAlt}
              size="addon"
              className="self-center"
              imageClassName={iconSurfaceImageClassName}
            />
          )}
        </div>

        <h3
          className={[
            'max-w-none font-serif font-semibold leading-[1.12] tracking-[-0.03em] text-neutral-900',
            isPillarCard ? 'text-[1.7rem] sm:max-w-[14ch] md:text-[1.9rem]' : 'text-[1.45rem] sm:max-w-[18ch] md:text-[1.8rem]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h3>

        {partnerLogoSrc ? (
          <div className="mt-4 flex flex-col items-start gap-2 text-left">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-black/45">
              {partnerLabel ?? 'In partnership with'}
            </p>
          </div>
        ) : null}

        {description ? (
          <p
            className={[
              'mt-4 max-w-none text-neutral-700',
              isPillarCard ? 'text-[1rem] leading-7 sm:max-w-[20rem]' : 'text-base leading-7 sm:max-w-md md:text-[1.05rem]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
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
            buttonAlign="start"
          />
        </div>
      </div>
    </MarketingSurface>
  );
}
