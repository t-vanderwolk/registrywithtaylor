import { beforeEach, describe, expect, it, vi } from 'vitest';

const { beacon, gaEvent } = vi.hoisted(() => ({ beacon: vi.fn(), gaEvent: vi.fn() }));
vi.mock('@/lib/analytics/affiliateClickBeacon', () => ({ sendAffiliateClickBeacon: beacon }));
vi.mock('@/lib/analytics', () => ({ trackEvent: gaEvent }));
vi.mock('@/lib/analytics/toolEventBeacon', () => ({ sendToolEventBeacon: vi.fn() }));

import { shopMyProductUrl } from '@/lib/affiliateShopMy';
import { trackToolAffiliateClick } from '@/lib/analytics/tools';

describe('trackToolAffiliateClick', () => {
  beforeEach(() => {
    beacon.mockClear();
    gaEvent.mockClear();
  });

  it('records the ShopMy link the button actually opens for a Target click', () => {
    const href = 'https://www.target.com/p/uppababy-vista-v3-full-size-stroller-greyson/-/A-95019221';
    const opened = shopMyProductUrl(href);
    expect(opened.startsWith('https://go.shopmy.us/')).toBe(true);

    trackToolAffiliateClick('stroller-compare', { product: 'UPPAbaby Vista V3', retailer: 'Target', brand: 'UPPAbaby', url: href });

    expect(beacon).toHaveBeenCalledWith(expect.objectContaining({ url: opened, retailer: 'Target', source: 'tool:stroller-compare' }));
    expect(gaEvent).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ url: opened }));
  });

  it('leaves preserved Amazon links exactly as they are', () => {
    const href = 'https://www.amazon.com/dp/B0H4MFBV9N?tag=taylormadebab-20';
    trackToolAffiliateClick('travel-system-checker', { retailer: 'Amazon', url: href });
    expect(beacon).toHaveBeenCalledWith(expect.objectContaining({ url: href }));
  });

  it('does not invent a destination when the click has no URL', () => {
    trackToolAffiliateClick('stroller-quiz', { product: 'Example stroller' });
    expect(beacon).toHaveBeenCalledWith(expect.objectContaining({ url: undefined }));
  });
});
