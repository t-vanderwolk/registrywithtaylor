'use client';

import { useEffect, useRef } from 'react';
import { trackPageView, type AnalyticsPageType } from '@/lib/analytics';

type PageViewTrackerProps = {
  path: string;
  pageType: AnalyticsPageType;
  slug?: string;
  title?: string;
};

export default function PageViewTracker({ path, pageType, slug, title }: PageViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    trackPageView({
      path,
      pageType,
      slug,
      title,
    });
  }, [pageType, path, slug, title]);

  return null;
}
