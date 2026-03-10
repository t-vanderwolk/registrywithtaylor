'use client';

import type { AffiliateNetwork } from '@prisma/client';
import AffiliateLogoBadge from '@/components/ui/AffiliateLogoBadge';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics';
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
  postId,
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

  const handleClick = () => {
    trackEvent(AnalyticsEvents.BLOG_AFFILIATE_CTA_CLICK, analyticsMeta);

    void fetch(`/api/blog/${postId}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'affiliate_click',
        meta: analyticsMeta,
      }),
      keepalive: true,
    }).catch(() => null);
  };

  if (variant === 'text') {
    return (
      <a
        href={resolvedDestinationUrl}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="link-underline text-sm uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
        data-affiliate-partner={partner?.slug ?? ''}
        data-affiliate-network={partner?.network ?? ''}
        data-affiliate-context="blog"
        onClick={handleClick}
      >
        {ctaText}
      </a>
    );
  }

  return (
    <a
      href={resolvedDestinationUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={
        variant === 'secondary'
          ? 'btn btn--secondary group inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]'
          : 'btn btn--primary group inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]'
      }
      data-affiliate-partner={partner?.slug ?? ''}
      data-affiliate-network={partner?.network ?? ''}
      data-affiliate-context="blog"
      onClick={handleClick}
      aria-label={partner ? `${ctaText} with ${partner.name}` : ctaText}
    >
      {partner?.logoUrl ? (
        <AffiliateLogoBadge src={partner.logoUrl} size="button" syncWithGroup />
      ) : null}
      <span>{ctaText}</span>
    </a>
  );
}
