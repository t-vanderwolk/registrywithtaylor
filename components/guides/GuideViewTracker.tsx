'use client';

import { useEffect } from 'react';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { sendGuideTrackingEvent } from '@/lib/guides/clientTracking';

export default function GuideViewTracker({
  guideId,
  sourceRoute,
  enabled = true,
}: {
  guideId: string;
  sourceRoute: string;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    sendGuideTrackingEvent({
      guideId,
      type: GuideAnalyticsEvents.VIEW,
      sourceRoute,
    });
  }, [enabled, guideId, sourceRoute]);

  return null;
}
