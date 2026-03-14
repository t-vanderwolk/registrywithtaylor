'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { sendGuideTrackingEvent } from '@/lib/guides/clientTracking';

export default function GuideViewTracker({
  guideId,
  sourceRoute,
  slug,
  title,
  enabled = true,
}: {
  guideId: string;
  sourceRoute: string;
  slug: string;
  title: string;
  enabled?: boolean;
}) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!enabled || trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    const payload = {
      path: sourceRoute,
      pageType: 'guide' as const,
      slug,
      title,
    };

    trackPageView(payload);
    trackEvent(GuideAnalyticsEvents.VIEW, payload);

    sendGuideTrackingEvent({
      guideId,
      type: GuideAnalyticsEvents.VIEW,
      sourceRoute,
      meta: payload,
    });
  }, [enabled, guideId, slug, sourceRoute, title]);

  return null;
}
