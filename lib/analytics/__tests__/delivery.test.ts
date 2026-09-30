import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendAffiliateClickBeacon } from '../affiliateClickBeacon';
import { sendToolEventBeacon } from '../toolEventBeacon';
import { pageview } from '../gtag';
afterEach(() => vi.unstubAllGlobals());
function setup(queued: boolean) {
  const sendBeacon = vi.fn(() => queued); const fetch = vi.fn(async (_url: string, _init: RequestInit) => ({})); const gtag = vi.fn();
  vi.stubGlobal('window', { location: { pathname: '/tools/compare', origin: 'https://taylormadebabyco.com', search: '' }, document: { title: 'Compare strollers' }, gtag });
  vi.stubGlobal('navigator', { sendBeacon }); vi.stubGlobal('fetch', fetch);
  return { sendBeacon, fetch, gtag };
}
describe('analytics delivery', () => {
  it('falls back to keepalive fetch when a browser refuses a beacon', async () => {
    const { fetch } = setup(false);
    sendAffiliateClickBeacon({ url: 'https://amzn.to/test' });
    sendToolEventBeacon({ tool: 'stroller-compare', event: 'opened' });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[0][1].body as string)).toMatchObject({ source: 'tool:stroller-compare' });
    expect(fetch.mock.calls[0][1].keepalive).toBe(true);
  });
  it('does not resend an accepted beacon', () => {
    const { fetch } = setup(true);
    sendAffiliateClickBeacon({ url: 'https://amzn.to/test' });
    sendToolEventBeacon({ tool: 'stroller-compare', event: 'opened' });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('sends an explicit GA page view once per route despite disabled automatic config views', () => {
    const { gtag } = setup(true);
    pageview('/tools/compare'); pageview('/tools/compare'); pageview('/tools/stroller-finder');
    expect(gtag).toHaveBeenCalledTimes(2);
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({ page_location: 'https://taylormadebabyco.com/tools/compare' }));
  });
});
