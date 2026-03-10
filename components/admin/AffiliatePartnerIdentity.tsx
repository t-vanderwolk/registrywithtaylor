import type { AffiliateNetwork } from '@prisma/client';
import AffiliateLogoBadge from '@/components/ui/AffiliateLogoBadge';
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
    badge: 'compact' | 'button';
    title: string;
  }
> = {
  sm: {
    badge: 'compact',
    title: 'text-sm',
  },
  md: {
    badge: 'button',
    title: 'text-sm',
  },
};

export default function AffiliatePartnerIdentity({
  name,
  network,
  logoUrl,
  size = 'md',
  showNetwork = false,
  meta,
}: {
  name: string;
  network?: AffiliateNetwork;
  logoUrl?: string | null;
  size?: Size;
  showNetwork?: boolean;
  meta?: string | null;
}) {
  const fallbackLogo = getAffiliatePartnerLogo(name);
  const logoSrc = logoUrl?.trim() || fallbackLogo.src;
  const classes = sizeClasses[size];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <AffiliateLogoBadge src={logoSrc} alt="" size={classes.badge} interactive={false} />

      <div className="min-w-0">
        <p className={`truncate font-medium text-admin ${classes.title}`}>{name}</p>
        {showNetwork && network ? (
          <p className="admin-micro truncate">
            {NETWORK_LABEL[network]}
            {meta ? ` • ${meta}` : ''}
          </p>
        ) : meta ? (
          <p className="admin-micro truncate">{meta}</p>
        ) : fallbackLogo.isFallback ? (
          <p className="admin-micro truncate">Generic mark attached</p>
        ) : null}
      </div>
    </div>
  );
}
