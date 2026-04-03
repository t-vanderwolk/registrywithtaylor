'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';
import {
  getAnalyticsPageType,
  getClientPageAnalyticsContext,
  getInternalPathFromHref,
  trackEvent,
} from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';
import {
  useBlogTrackingContext,
  useGuideTrackingContext,
} from '@/components/analytics/TrackingContext';
import type { InternalLinkKind } from '@/lib/internal-links/types';

type InternalLinkProps = {
  href: `/${string}`;
  children: ReactNode;
  className?: string;
  anchorText?: string;
  destinationKind?: InternalLinkKind;
  placement?: string;
};

export default function InternalLink({
  href,
  children,
  className = 'link-underline transition-colors duration-200 hover:text-neutral-900',
  anchorText,
  destinationKind = 'guide',
  placement = 'inline',
}: InternalLinkProps) {
  const blogContext = useBlogTrackingContext();
  const guideContext = useGuideTrackingContext();

  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    const pageContext = getClientPageAnalyticsContext();
    const destinationPath = getInternalPathFromHref(href) ?? href;
    const sourceContext =
      blogContext
        ? {
            sourceContentType: 'blog',
            sourceId: blogContext.postId,
            sourceSlug: blogContext.slug,
            sourceTitle: blogContext.title,
          }
        : guideContext
          ? {
              sourceContentType: 'guide',
              sourceId: guideContext.guideId,
              sourceSlug: guideContext.slug,
              sourceTitle: guideContext.title,
            }
          : {
              sourceContentType: pageContext?.pageType ?? 'other',
              sourceId: null,
              sourceSlug: null,
              sourceTitle: null,
            };

    trackEvent(AnalyticsEvents.INTERNAL_LINK_CLICK, {
      ...(pageContext ?? {
        path: href,
        pageType: 'other',
        referrer: null,
        referrerPageType: null,
      }),
      ...sourceContext,
      destination: destinationPath,
      destinationPageType: getAnalyticsPageType(destinationPath),
      destinationKind,
      anchorText: anchorText ?? (typeof children === 'string' ? children : undefined),
      label: anchorText ?? (typeof children === 'string' ? children : undefined) ?? destinationPath,
      placement,
      category: 'internal_links',
    });
  };

  return (
    <Link
      href={href}
      className={className}
      data-analytics-managed="true"
      data-internal-link="true"
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
