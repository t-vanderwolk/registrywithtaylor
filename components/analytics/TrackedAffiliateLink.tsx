'use client';

import type { ReactNode } from 'react';
import BabylistShopLink from '@/components/affiliate/BabylistShopLink';
import ProductShopLink from '@/components/affiliate/ProductShopLink';
import { babylistShopMyUrl, shopMyProductUrl } from '@/lib/affiliateShopMy';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { sendGuideTrackingEvent } from '@/lib/guides/clientTracking';
import { getClientPageAnalyticsContext, trackEvent, type AnalyticsPayload } from '@/lib/analytics';
import { getAffiliateTrackingDataAttributes, trackAffiliateClick } from '@/lib/analytics/trackAffiliateClick';
import { sendBlogAffiliateTrackingEvent, type BlogAffiliateTrackingMeta } from '@/lib/blog/clientTracking';
import { useBlogTrackingContext, useGuideTrackingContext } from '@/components/analytics/TrackingContext';

type TrackedAffiliateLinkProps = {
  href: string;
  ctaText: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  rel?: string;
  target?: string;
  meta?: AnalyticsPayload & BlogAffiliateTrackingMeta;
  onClick?: () => void;
  productShopLink?: boolean;
};

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

export default function TrackedAffiliateLink({
  href,
  ctaText,
  children,
  className,
  ariaLabel,
  rel,
  target,
  meta,
  onClick,
  productShopLink = false,
}: TrackedAffiliateLinkProps) {
  const destination = productShopLink ? shopMyProductUrl(href) : babylistShopMyUrl(href);
  const ShoppingLink = productShopLink ? ProductShopLink : BabylistShopLink;
  const blogTrackingContext = useBlogTrackingContext();
  const guideTrackingContext = useGuideTrackingContext();
  const affiliateMetadata = {
    product: getMetaText(meta, 'product', 'productName'),
    brand: getMetaText(meta, 'brand', 'brandName', 'partnerName'),
    category: getMetaText(meta, 'category'),
    guide: guideTrackingContext?.slug ?? getMetaText(meta, 'guide'),
    position: getMetaText(meta, 'position', 'placement', 'context'),
  };

  const handleClick = () => {
    trackAffiliateClick({
      url: destination,
      ...affiliateMetadata,
    });

    if (blogTrackingContext) {
      sendBlogAffiliateTrackingEvent({
        postId: blogTrackingContext.postId,
        slug: blogTrackingContext.slug,
        title: blogTrackingContext.title,
        destinationUrl: destination,
        ctaText,
        meta,
      });
    } else if (guideTrackingContext) {
      const pageContext =
        getClientPageAnalyticsContext(guideTrackingContext.sourceRoute) ?? {
          path: guideTrackingContext.sourceRoute,
          pageType: 'guide' as const,
          referrer: null,
          referrerPageType: null,
        };
      const payload = {
        ...pageContext,
        guideId: guideTrackingContext.guideId,
        slug: guideTrackingContext.slug,
        title: guideTrackingContext.title,
        destination,
        destinationPageType: 'external',
        ctaLabel: ctaText,
        label: ctaText,
        ...meta,
      };

      trackEvent(GuideAnalyticsEvents.AFFILIATE_CLICK, payload);
      sendGuideTrackingEvent({
        guideId: guideTrackingContext.guideId,
        type: GuideAnalyticsEvents.AFFILIATE_CLICK,
        sourceRoute: guideTrackingContext.sourceRoute,
        meta: payload,
      });
    }

    onClick?.();
  };

  return (
    <ShoppingLink
      href={href}
      target={target ?? '_blank'}
      rel={rel ?? 'sponsored nofollow noopener noreferrer'}
      aria-label={ariaLabel}
      className={className}
      data-analytics-managed="true"
      data-affiliate-track-source="manual"
      {...getAffiliateTrackingDataAttributes(affiliateMetadata)}
      onClick={handleClick}
    >
      {children}
    </ShoppingLink>
  );
}
