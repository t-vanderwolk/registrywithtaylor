'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

type BookingEventType =
  | 'booking_section_viewed'
  | 'booking_scrolled_into_view'
  | 'booking_interaction';

type BookingSectionTrackerProps = {
  sourcePage: string;
  service?: string;
  id?: string;
  className?: string;
  children: ReactNode;
};

type OptionalPayload = {
  sourcePage: string;
  service?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
};

function getStoredFlag(key: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function setStoredFlag(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Ignore storage errors (private mode / blocked storage).
  }
}

function sendBookingEvent(type: BookingEventType, payload: OptionalPayload) {
  void fetch('/api/track/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      type,
      ...payload,
    }),
  }).catch(() => undefined);
}

export default function BookingSectionTracker({
  sourcePage,
  service,
  id,
  className = '',
  children,
}: BookingSectionTrackerProps) {
  const bookingRef = useRef<HTMLDivElement>(null);
  const interactionTrackedRef = useRef(false);

  const payload = useMemo<OptionalPayload>(() => {
    if (typeof window === 'undefined') {
      return { sourcePage, service };
    }

    const params = new URLSearchParams(window.location.search);

    return {
      sourcePage,
      service: service ?? params.get('service') ?? undefined,
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      referrer: document.referrer || undefined,
    };
  }, [sourcePage, service]);

  useEffect(() => {
    const storageKey = `booking-track:${sourcePage}:booking_section_viewed`;
    if (getStoredFlag(storageKey)) {
      return;
    }

    sendBookingEvent('booking_section_viewed', payload);
    setStoredFlag(storageKey);
  }, [payload, sourcePage]);

  useEffect(() => {
    const target = bookingRef.current;
    if (!target) {
      return;
    }

    const storageKey = `booking-track:${sourcePage}:booking_scrolled_into_view`;
    if (getStoredFlag(storageKey)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          sendBookingEvent('booking_scrolled_into_view', payload);
          setStoredFlag(storageKey);
          observer.disconnect();
          break;
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [payload, sourcePage]);

  useEffect(() => {
    const target = bookingRef.current;
    if (!target) {
      return;
    }

    const storageKey = `booking-track:${sourcePage}:booking_interaction`;
    if (getStoredFlag(storageKey)) {
      interactionTrackedRef.current = true;
    }

    const handleClick = () => {
      if (interactionTrackedRef.current) {
        return;
      }

      interactionTrackedRef.current = true;
      sendBookingEvent('booking_interaction', payload);
      setStoredFlag(storageKey);
    };

    target.addEventListener('click', handleClick);
    return () => {
      target.removeEventListener('click', handleClick);
    };
  }, [payload, sourcePage]);

  return (
    <div id={id} ref={bookingRef} className={className}>
      {children}
    </div>
  );
}
