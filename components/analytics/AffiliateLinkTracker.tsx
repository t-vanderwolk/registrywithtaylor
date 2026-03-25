'use client';

import { useEffect, useEffectEvent } from 'react';
import { isAffiliateLink } from '@/lib/analytics/isAffiliateLink';
import { trackAffiliateClick } from '@/lib/analytics/trackAffiliateClick';

/**
 * Audit summary before the global tracker was added:
 * 1. Events were fired from AnalyticsRouteTracker, AnalyticsClickTracker,
 *    BlogViewTracker, GuideViewTracker, BlogSoftCTA, TrackedAffiliateLink,
 *    GuideTrackedLink, plus the blog/guide server tracking routes.
 * 2. Existing affiliate-related event names included affiliate_outbound_click,
 *    blog_affiliate_cta_click, guide_affiliate_click, and AFFILIATE_CLICK in
 *    persisted blog analytics.
 * 3. Payloads varied by emitter and mixed fields such as destination,
 *    destinationUrl, partnerSlug, partnerId, brandName, productName, context,
 *    placement, guideId, postId, and ctaText.
 * 4. Gap: unmanaged affiliate anchors could only be caught heuristically and
 *    did not produce one consistent affiliate_click event shape across the app.
 */

const getGuideFromPath = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  if (segments[0] !== 'guides') {
    return undefined;
  }

  return segments[segments.length - 1];
};

export default function AffiliateLinkTracker() {
  const handleDocumentClick = useEffectEvent((event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    if (anchor.dataset.affiliateTrackSource === 'manual') {
      return;
    }

    if (!isAffiliateLink(anchor.href)) {
      return;
    }

    trackAffiliateClick({
      url: anchor.href,
      product: anchor.dataset.product,
      brand: anchor.dataset.brand,
      category: anchor.dataset.category,
      guide: anchor.dataset.guide ?? getGuideFromPath(window.location.pathname),
      position: anchor.dataset.position,
    });
  });

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [handleDocumentClick]);

  return null;
}
