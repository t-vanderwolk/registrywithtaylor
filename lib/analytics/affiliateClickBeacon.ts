import { getAnalyticsPageType } from '@/lib/analytics';

/**
 * Fire-and-forget beacon that records a real outbound affiliate click on the
 * server (in addition to the GA event). Uses navigator.sendBeacon so the hit
 * survives the page navigating away to the retailer. Never throws / never blocks.
 */
export function sendAffiliateClickBeacon(input: {
  url?: string | null;
  retailer?: string | null;
  brand?: string | null;
  product?: string | null;
  source?: string | null;
}) {
  if (typeof window === 'undefined') return;
  const url = (input.url ?? '').trim();
  if (!url) return;

  try {
    const path = window.location.pathname;
    const payload = JSON.stringify({
      url,
      retailer: input.retailer ?? undefined,
      brand: input.brand ?? undefined,
      product: input.product ?? undefined,
      source: input.source ?? undefined,
      pageType: getAnalyticsPageType(path),
      path,
    });
    const endpoint = '/api/affiliate/click';

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
      return;
    }

    void fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
      credentials: 'same-origin',
    }).catch(() => undefined);
  } catch {
    // never block navigation
  }
}
