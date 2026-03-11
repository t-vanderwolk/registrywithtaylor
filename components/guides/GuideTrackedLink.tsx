'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { GuideAnalyticsEventName } from '@/lib/guides/events';
import { sendGuideTrackingEvent } from '@/lib/guides/clientTracking';

type GuideTrackedLinkProps = {
  guideId: string;
  href: string;
  event: GuideAnalyticsEventName;
  sourceRoute: string;
  meta?: Record<string, unknown>;
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

    sendGuideTrackingEvent({
      guideId,
      type: event,
      sourceRoute,
      meta,
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
