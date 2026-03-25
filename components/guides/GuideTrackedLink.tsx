'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  getAnalyticsPageType,
  getClientPageAnalyticsContext,
  getInternalPathFromHref,
  trackEvent,
  type AnalyticsPayload,
} from '@/lib/analytics';
import { getAffiliateTrackingDataAttributes, trackAffiliateClick } from '@/lib/analytics/trackAffiliateClick';
import { isAffiliateLink } from '@/lib/analytics/isAffiliateLink';
import { GuideAnalyticsEvents, type GuideAnalyticsEventName } from '@/lib/guides/events';
import { sendGuideTrackingEvent } from '@/lib/guides/clientTracking';

type GuideTrackedLinkProps = {
  guideId: string;
  href: string;
  event: GuideAnalyticsEventName;
  sourceRoute: string;
  meta?: AnalyticsPayload;
  className?: string;
  children: ReactNode;
  track?: boolean;
  rel?: string;
  target?: string;
};

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

const getMetaText = (meta: AnalyticsPayload | undefined, ...keys: string[]) => {
  for (const key of keys) {
    const value = meta?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
};

export default function GuideTrackedLink({
  guideId,
  href,
  event,
  sourceRoute,
  meta,
  className,
  children,
  track = true,
  rel,
  target,
}: GuideTrackedLinkProps) {
  const external = isExternalHref(href);
  const shouldTrackAffiliateClick = event === GuideAnalyticsEvents.AFFILIATE_CLICK && isAffiliateLink(href);
  const affiliateMetadata = {
    product: getMetaText(meta, 'product', 'productName'),
    brand: getMetaText(meta, 'brand', 'brandName', 'partnerName', 'retailerLabel'),
    category: getMetaText(meta, 'category'),
    guide: sourceRoute.split('/').filter(Boolean).pop() ?? sourceRoute,
    position: getMetaText(meta, 'position', 'placement', 'context'),
  };

  const handleTrack = () => {
    if (!track) {
      return;
    }

    if (shouldTrackAffiliateClick) {
      trackAffiliateClick({
        url: href,
        ...affiliateMetadata,
      });
    }

    const pageContext = getClientPageAnalyticsContext(sourceRoute);
    const destinationPath = getInternalPathFromHref(href);
    const destination = destinationPath ?? href;
    const destinationPageType = destinationPath ? getAnalyticsPageType(destinationPath) : 'external';
    const payload = {
      ...(pageContext ?? {
        path: sourceRoute,
        pageType: 'guide' as const,
        referrer: null,
        referrerPageType: null,
      }),
      guideId,
      destination,
      destinationPageType,
      ...meta,
    };

    trackEvent(event, payload);

    sendGuideTrackingEvent({
      guideId,
      type: event,
      sourceRoute,
      meta: payload,
    });
  };

  if (external) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'sponsored nofollow noopener noreferrer'}
        className={className}
        data-analytics-managed="true"
        data-affiliate-track-source={shouldTrackAffiliateClick ? 'manual' : undefined}
        {...(shouldTrackAffiliateClick ? getAffiliateTrackingDataAttributes(affiliateMetadata) : {})}
        onClick={handleTrack}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      data-analytics-managed="true"
      data-affiliate-track-source={shouldTrackAffiliateClick ? 'manual' : undefined}
      {...(shouldTrackAffiliateClick ? getAffiliateTrackingDataAttributes(affiliateMetadata) : {})}
      onClick={handleTrack}
    >
      {children}
    </Link>
  );
}
