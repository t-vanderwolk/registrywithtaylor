import type { AffiliateNetwork } from '@prisma/client';

export const AFFILIATE_NETWORK_ORDER: AffiliateNetwork[] = ['CJ', 'IMPACT', 'AWIN', 'DIRECT'];

export const AFFILIATE_NETWORK_LABELS: Record<AffiliateNetwork, string> = {
  CJ: 'CJ',
  IMPACT: 'Impact',
  AWIN: 'AWIN',
  DIRECT: 'Direct',
};

export type AffiliateBrandCard = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  shopUrl: string | null;
  legacyAffiliateUrl: string | null;
  networks: AffiliateNetwork[];
  primaryProgram: {
    id: string;
    network: AffiliateNetwork;
    campaignId: string | null;
    commission: string | null;
    cookieLength: string | null;
    linkId: string | null;
    linkName: string | null;
  } | null;
};

export function sortAffiliateNetworks(networks: AffiliateNetwork[]) {
  return [...networks].sort(
    (left, right) =>
      AFFILIATE_NETWORK_ORDER.indexOf(left) - AFFILIATE_NETWORK_ORDER.indexOf(right) || left.localeCompare(right),
  );
}

export function formatAffiliateNetworks(networks: AffiliateNetwork[]) {
  return sortAffiliateNetworks(networks)
    .map((network) => AFFILIATE_NETWORK_LABELS[network])
    .join(' • ');
}
