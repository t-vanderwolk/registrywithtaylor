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
import type { GuideAnalyticsEventName } from '@/lib/guides/events';
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

  const handleTrack = () => {
    if (!track) {
      return;
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
        onClick={handleTrack}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} target={target} rel={rel} onClick={handleTrack}>
      {children}
    </Link>
  );
}
