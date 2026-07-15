'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_ID, pageview } from '@/lib/analytics/gtag';

export default function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const url = queryString ? `${pathname}?${queryString}` : pathname;

  // First-party page-view beacon (independent of GA): logs one bot-filtered view
  // per route change so the admin dashboard can chart daily total + blog traffic.
  useEffect(() => {
    if (!pathname) return;
    try {
      const payload = JSON.stringify({ path: pathname });
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/track/pageview', new Blob([payload], { type: 'application/json' }));
      } else {
        void fetch('/api/track/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => undefined);
      }
    } catch {
      // Never let analytics break navigation.
    }
  }, [pathname]);

  useEffect(() => {
    if (!GA_ID) {
      return;
    }

    let attempts = 0;
    let timeoutId: number | undefined;

    const trackWhenReady = () => {
      if (typeof window.gtag === 'function') {
        pageview(url);
        return;
      }

      if (attempts >= 20) {
        return;
      }

      attempts += 1;
      timeoutId = window.setTimeout(trackWhenReady, 250);
    };

    trackWhenReady();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [url]);

  return null;
}
