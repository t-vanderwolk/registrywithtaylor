'use client';

import { useEffect, useRef } from 'react';
import type { FocusEvent, MouseEvent, ReactNode } from 'react';
import { trackBookingEvent, trackEvent } from '@/lib/analytics';
import { AnalyticsEvents, BookingAnalyticsEvents } from '@/lib/analytics/events';

type HowItWorksAnalyticsProps = {
  children: ReactNode;
};

const CTA_SELECTOR = '[data-analytics-consultation-cta]';
const BOOKING_SECTION_ID = 'free-consultation';
const BOOKING_FORM_SELECTOR = `#${BOOKING_SECTION_ID} form`;
const BOOKING_SOURCE_PAGE = '/how-it-works';

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
  const sectionInViewTrackedRef = useRef(false);
  const interactionTrackedRef = useRef(false);

  const trackBookingInteraction = (service: string) => {
    if (interactionTrackedRef.current) {
      return;
    }

    interactionTrackedRef.current = true;
    trackBookingEvent(BookingAnalyticsEvents.INTERACTION, {
      sourcePage: BOOKING_SOURCE_PAGE,
      service,
    });
  };

  useEffect(() => {
    const pageViewTimer = window.setTimeout(() => {
      trackEvent(AnalyticsEvents.HOW_IT_WORKS_VIEW, {
        page: BOOKING_SOURCE_PAGE,
      });
    }, 0);

    const consultationSection = document.getElementById(BOOKING_SECTION_ID);
    if (consultationSection) {
      trackBookingEvent(BookingAnalyticsEvents.SECTION_VIEWED, {
        sourcePage: BOOKING_SOURCE_PAGE,
        service: 'consultation_section',
      });
    }

    if (!consultationSection || typeof window.IntersectionObserver !== 'function') {
      return () => window.clearTimeout(pageViewTimer);
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || sectionInViewTrackedRef.current) {
          return;
        }

        sectionInViewTrackedRef.current = true;
        trackBookingEvent(BookingAnalyticsEvents.SECTION_IN_VIEW, {
          sourcePage: BOOKING_SOURCE_PAGE,
          service: 'consultation_section',
        });
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(consultationSection);

    return () => {
      window.clearTimeout(pageViewTimer);
      observer.disconnect();
    };
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
      page: BOOKING_SOURCE_PAGE,
      ctaLabel,
      destination: getDestination(ctaTarget),
    });

    trackBookingInteraction(ctaLabel);
  };

  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.closest(BOOKING_FORM_SELECTOR)) {
      return;
    }

    trackBookingInteraction('consultation_request_form');
  };

  return (
    <div onClickCapture={handleClickCapture} onFocusCapture={handleFocusCapture}>
      {children}
    </div>
  );
}
