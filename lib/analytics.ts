type AnalyticsPayloadValue = string | number | boolean | null | undefined;

export type AnalyticsPayload = Record<string, AnalyticsPayloadValue>;

type GtagEvent = (
  command: 'event',
  eventName: string,
  payload?: AnalyticsPayload,
) => void;

type AnalyticsWindow = Window & typeof globalThis & { gtag?: GtagEvent };

const getAnalyticsWindow = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window as AnalyticsWindow;
};

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  const analyticsWindow = getAnalyticsWindow();
  if (!analyticsWindow) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', eventName, payload);
  }

  analyticsWindow.gtag?.('event', eventName, payload);
}

export type BookingAnalyticsPayload = {
  sourcePage?: string;
  service?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

export function trackBookingEvent(type: string, payload: BookingAnalyticsPayload = {}) {
  const analyticsWindow = getAnalyticsWindow();
  if (!analyticsWindow) {
    return;
  }

  const searchParams = new URLSearchParams(analyticsWindow.location.search);
  const body = {
    type,
    sourcePage: payload.sourcePage ?? analyticsWindow.location.pathname,
    service: payload.service,
    utmSource: payload.utmSource ?? searchParams.get('utm_source'),
    utmMedium: payload.utmMedium ?? searchParams.get('utm_medium'),
    utmCampaign: payload.utmCampaign ?? searchParams.get('utm_campaign'),
  };

  if (process.env.NODE_ENV !== 'production') {
    console.info('[booking-analytics]', type, body);
  }

  const requestBody = JSON.stringify(body);

  if (typeof analyticsWindow.navigator.sendBeacon === 'function') {
    const beacon = new Blob([requestBody], { type: 'application/json' });
    analyticsWindow.navigator.sendBeacon('/api/track/booking', beacon);
    return;
  }

  void fetch('/api/track/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => undefined);
}
