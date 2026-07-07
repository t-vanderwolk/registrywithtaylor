/**
 * Fire-and-forget beacon that records a free-tool interaction on the server (in
 * addition to the GA event), so the admin dashboard can show a usage funnel.
 * Never throws / never blocks.
 */
export function sendToolEventBeacon(input: {
  tool: string;
  event: 'opened' | 'selection' | 'result_viewed';
  kind?: string | null;
  value?: string | null;
}) {
  if (typeof window === 'undefined') return;

  try {
    const payload = JSON.stringify({
      tool: input.tool,
      event: input.event,
      kind: input.kind ?? undefined,
      value: input.value ?? undefined,
      path: window.location.pathname,
    });
    const endpoint = '/api/tools/event';

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
    // never block the UI
  }
}
