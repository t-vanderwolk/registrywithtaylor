import type { AffiliateNetwork } from '@prisma/client';

export function buildBlogAffiliateAnalyticsMeta({
  partnerId,
  partnerSlug,
  partnerName,
  network,
  destinationUrl,
  ctaText,
}: {
  partnerId: string | null;
  partnerSlug: string | null;
  partnerName: string | null;
  network: AffiliateNetwork | null;
  destinationUrl: string;
  ctaText: string;
}) {
  return {
    partnerId,
    partnerSlug,
    partnerName,
    network,
    destinationUrl,
    ctaText,
    context: 'blog',
  };
}
