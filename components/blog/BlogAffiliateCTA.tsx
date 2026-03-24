'use client';

import type { AffiliateNetwork } from '@prisma/client';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import AffiliateLogoBadge from '@/components/ui/AffiliateLogoBadge';
import { buildBlogAffiliateAnalyticsMeta } from '@/lib/adminAnalytics.service';
import { resolveAffiliateDestinationUrl } from '@/lib/affiliatePartners';

type BlogAffiliateCTAProps = {
  postId: string;
  ctaText: string;
  destinationUrl: string;
  variant?: 'primary' | 'secondary' | 'text';
  partner?: {
    id: string;
    slug: string;
    name: string;
    network: AffiliateNetwork;
    logoUrl: string | null;
    baseUrl: string | null;
    affiliatePid: string | null;
  } | null;
};

export default function BlogAffiliateCTA({
  postId: _postId,
  ctaText,
  destinationUrl,
  variant = 'primary',
  partner = null,
}: BlogAffiliateCTAProps) {
  const analyticsMeta = buildBlogAffiliateAnalyticsMeta({
    partnerId: partner?.id ?? null,
    partnerSlug: partner?.slug ?? null,
    partnerName: partner?.name ?? null,
    network: partner?.network ?? null,
    destinationUrl:
      resolveAffiliateDestinationUrl({
        baseUrl: partner?.baseUrl ?? null,
        affiliatePid: partner?.affiliatePid ?? null,
        destinationUrl,
      }) ?? destinationUrl,
    ctaText,
  });
  const resolvedDestinationUrl = analyticsMeta.destinationUrl;

  if (variant === 'text') {
    return (
      <TrackedAffiliateLink
        href={resolvedDestinationUrl}
        ctaText={ctaText}
        className="link-underline text-sm uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
        meta={analyticsMeta}
      >
        {ctaText}
      </TrackedAffiliateLink>
    );
  }

  const buttonClassName =
    variant === 'secondary'
      ? 'btn btn--secondary blog-affiliate-cta blog-affiliate-cta--secondary group inline-flex items-center justify-start gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]'
      : 'btn btn--primary blog-affiliate-cta blog-affiliate-cta--primary group inline-flex items-center justify-start gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';

  return (
    <TrackedAffiliateLink
      href={resolvedDestinationUrl}
      ctaText={ctaText}
      className={buttonClassName}
      meta={analyticsMeta}
      aria-label={partner ? `${ctaText} with ${partner.name}` : ctaText}
    >
      {partner?.logoUrl ? (
        <AffiliateLogoBadge
          src={partner.logoUrl}
          alt={partner.name}
          size="button"
          interactive={false}
          syncWithGroup
          className="blog-affiliate-cta__logo shrink-0"
        />
      ) : null}
      <span className="blog-affiliate-cta__label">{ctaText}</span>
    </TrackedAffiliateLink>
  );
}
