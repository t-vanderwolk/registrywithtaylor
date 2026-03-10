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
    ? 'luxury-icon-object--partner scale-[0.84] md:scale-[0.9]'
    : 'drop-shadow-[0_10px_18px_rgba(184,160,129,0.18)]';

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
            'mx-auto flex w-full items-center justify-center',
            isPillarCard ? 'mb-5 max-w-[10rem] sm:mb-6 sm:max-w-[11.5rem]' : 'mb-6 max-w-[11rem] sm:mb-8 sm:max-w-[13.25rem]',
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
            'max-w-none text-center font-serif font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-900',
            isPillarCard ? 'text-[1.75rem] sm:max-w-[16ch] md:text-[1.95rem]' : 'text-xl sm:max-w-[20ch] md:text-[1.85rem]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h3>

        {partnerLogoSrc ? (
          <div className="mt-4 flex flex-col items-center gap-2 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-black/45">
              {partnerLabel ?? 'In partnership with'}
            </p>
          </div>
        ) : null}

        {label ? (
          <span className="mt-3 text-xs uppercase tracking-[0.25em] text-[var(--color-accent-dark)]/70">{label}</span>
        ) : null}

        {description ? (
          <p
            className={[
              'mt-4 max-w-none text-neutral-700',
              isPillarCard ? 'text-[1.02rem] leading-8 sm:max-w-[18rem]' : 'text-base leading-8 sm:max-w-md md:text-lg',
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
          />
        </div>
      </div>
    </MarketingSurface>
  );
}
