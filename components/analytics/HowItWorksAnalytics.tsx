'use client';

import { useEffect } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';

type HowItWorksAnalyticsProps = {
  children: ReactNode;
};

const CTA_SELECTOR = '[data-analytics-consultation-cta]';

const getDestination = (element: HTMLElement) => {
  if (element instanceof HTMLAnchorElement) {
    return element.href;
  }

  if (element instanceof HTMLButtonElement) {
    return element.formAction || undefined;
  }

  return undefined;
};

export default function HowItWorksAnalytics({ children }: HowItWorksAnalyticsProps) {
  useEffect(() => {
    const pageViewTimer = window.setTimeout(() => {
      trackEvent(AnalyticsEvents.HOW_IT_WORKS_VIEW, {
        page: '/how-it-works',
      });
    }, 0);

    return () => window.clearTimeout(pageViewTimer);
  }, []);

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const ctaTarget = target.closest<HTMLElement>(CTA_SELECTOR);
    if (!ctaTarget) {
      return;
    }

    const ctaLabel = ctaTarget.dataset.analyticsConsultationCta?.trim();
    if (!ctaLabel) {
      return;
    }

    trackEvent(AnalyticsEvents.CONSULTATION_CLICK, {
      page: '/how-it-works',
      ctaLabel,
      destination: getDestination(ctaTarget),
    });
  };

  return <div onClickCapture={handleClickCapture}>{children}</div>;
}
