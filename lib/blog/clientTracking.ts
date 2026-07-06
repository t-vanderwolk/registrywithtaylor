import { AnalyticsEvents } from '@/lib/analytics/events';
import { getClientPageAnalyticsContext, trackEvent, type AnalyticsPayload } from '@/lib/analytics';
import { sendAffiliateClickBeacon } from '@/lib/analytics/affiliateClickBeacon';

export type BlogAffiliateTrackingMeta = AnalyticsPayload & {
  destinationUrl?: string;
  ctaText?: string;
  context?: string;
  partnerId?: string | null;
  partnerSlug?: string | null;
  partnerName?: string | null;
  brandId?: string | null;
  brandName?: string | null;
  programId?: string | null;
  productName?: string | null;
  network?: string | null;
};

type BlogAffiliateTrackingInput = {
  postId: string;
  slug: string;
  title: string;
  destinationUrl: string;
  ctaText: string;
  meta?: BlogAffiliateTrackingMeta;
};

export function buildBlogAffiliateTrackingPayload({
  postId,
  slug,
  title,
  destinationUrl,
  ctaText,
  meta = {},
}: BlogAffiliateTrackingInput) {
  const path = `/blog/${slug}`;
  const pageContext =
    getClientPageAnalyticsContext(path) ?? {
      path,
      pageType: 'blog' as const,
      referrer: null,
      referrerPageType: null,
    };

  return {
    ...pageContext,
    postId,
    slug,
    title,
    category: 'affiliate',
    label: ctaText,
    ctaText,
    destination: destinationUrl,
    destinationUrl,
    ...meta,
  };
}

export function sendBlogAffiliateTrackingEvent(input: BlogAffiliateTrackingInput) {
  const payload = buildBlogAffiliateTrackingPayload(input);

  trackEvent(AnalyticsEvents.BLOG_AFFILIATE_CTA_CLICK, payload);

  // Unified outbound-click log (feeds the dashboard's by-retailer breakdown).
  sendAffiliateClickBeacon({
    url: input.destinationUrl,
    brand: (input.meta?.brandName ?? input.meta?.partnerName) as string | undefined,
    product: input.meta?.productName as string | undefined,
    source: 'blog',
  });

  void fetch(`/api/blog/${input.postId}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'affiliate_click',
      meta: payload,
    }),
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => undefined);
}
