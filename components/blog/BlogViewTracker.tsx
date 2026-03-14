'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';

type BlogViewTrackerProps = {
  postId: string;
  slug: string;
  title: string;
  enabled?: boolean;
};

export default function BlogViewTracker({
  postId,
  slug,
  title,
  enabled = true,
}: BlogViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!enabled || trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    const path = `/blog/${slug}`;
    const payload = {
      path,
      pageType: 'blog' as const,
      slug,
      title,
      category: 'blog',
      label: slug,
    };

    trackPageView(payload);
    trackEvent(AnalyticsEvents.BLOG_VIEW, payload);

    void fetch(`/api/blog/${postId}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'view',
        meta: payload,
      }),
      keepalive: true,
      credentials: 'same-origin',
    }).catch(() => undefined);
  }, [enabled, postId, slug, title]);

  return null;
}
