import Image from 'next/image';
import type { AffiliateNetwork } from '@prisma/client';
import { getAffiliatePartnerLogo } from '@/lib/affiliatePartnerLogos';

const NETWORK_LABEL: Record<AffiliateNetwork, string> = {
  CJ: 'CJ',
  IMPACT: 'Impact',
  AWIN: 'AWIN',
  DIRECT: 'Direct',
};

type Size = 'sm' | 'md';

const sizeClasses: Record<
  Size,
  {
    frame: string;
    imagePadding: string;
    title: string;
  }
> = {
  sm: {
    frame: 'h-10 w-10 rounded-[16px]',
    imagePadding: 'p-2',
    title: 'text-sm',
  },
  md: {
    frame: 'h-12 w-12 rounded-[18px]',
    imagePadding: 'p-2.5',
    title: 'text-sm',
  },
};

export default function AffiliatePartnerIdentity({
  name,
  network,
  size = 'md',
  showNetwork = false,
  meta,
}: {
  name: string;
  network?: AffiliateNetwork;
  size?: Size;
  showNetwork?: boolean;
  meta?: string | null;
}) {
  const logo = getAffiliatePartnerLogo(name);
  const classes = sizeClasses[size];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`relative shrink-0 overflow-hidden border border-[var(--admin-color-border)] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.04)] ${classes.frame}`}
      >
        <Image
          src={logo.src}
          alt={`${name} logo`}
          fill
          sizes={size === 'sm' ? '40px' : '48px'}
          className={`object-contain ${classes.imagePadding}`}
        />
      </div>

      <div className="min-w-0">
        <p className={`truncate font-medium text-admin ${classes.title}`}>{name}</p>
        {showNetwork && network ? (
          <p className="admin-micro truncate">
            {NETWORK_LABEL[network]}
            {meta ? ` • ${meta}` : ''}
          </p>
        ) : meta ? (
          <p className="admin-micro truncate">{meta}</p>
        ) : logo.isFallback ? (
          <p className="admin-micro truncate">Generic mark attached</p>
        ) : null}
      </div>
    </div>
  );
}
