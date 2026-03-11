'use client';

import { GuideAnalyticsEvents, type GuideAnalyticsEventName } from '@/lib/guides/events';

type GuideTrackingPayload = {
  guideId: string;
  type: GuideAnalyticsEventName;
  sourceRoute?: string;
  meta?: Record<string, unknown>;
};

export function sendGuideTrackingEvent({
  guideId,
  type,
  sourceRoute,
  meta,
}: GuideTrackingPayload) {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = JSON.stringify({
    type,
    sourceRoute,
    meta,
  });
  const url = `/api/guides/${guideId}/track`;

  if (type === GuideAnalyticsEvents.VIEW) {
    const sessionKey = `guide-view:${guideId}:${sourceRoute ?? window.location.pathname}`;
    if (window.sessionStorage.getItem(sessionKey)) {
      return;
    }
    window.sessionStorage.setItem(sessionKey, '1');
  }

  if (typeof window.navigator.sendBeacon === 'function') {
    const beacon = new Blob([payload], { type: 'application/json' });
    window.navigator.sendBeacon(url, beacon);
    return;
  }

  void fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => undefined);
}
