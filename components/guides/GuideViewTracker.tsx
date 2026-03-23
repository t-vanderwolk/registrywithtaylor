'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { sendGuideTrackingEvent } from '@/lib/guides/clientTracking';
import { getGuideJourneyState, TMBC_GUIDE_JOURNEY_STORAGE_KEY } from '@/lib/guides/masterJourney';

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
      category: 'guides',
      label: slug,
    };

    trackPageView(payload);
    trackEvent(GuideAnalyticsEvents.VIEW, payload);

    sendGuideTrackingEvent({
      guideId,
      type: GuideAnalyticsEvents.VIEW,
      sourceRoute,
      meta: payload,
    });

    try {
      window.localStorage.setItem(
        TMBC_GUIDE_JOURNEY_STORAGE_KEY,
        JSON.stringify(
          getGuideJourneyState({
            slug,
            title,
            sourceRoute,
          }),
        ),
      );
    } catch {
      return;
    }
  }, [enabled, guideId, slug, sourceRoute, title]);

  return null;
}
