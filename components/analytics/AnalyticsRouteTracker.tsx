'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_ID, pageview } from '@/lib/analytics/gtag';

export default function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const url = queryString ? `${pathname}?${queryString}` : pathname;

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
