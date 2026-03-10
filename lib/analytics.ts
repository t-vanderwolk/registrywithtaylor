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
