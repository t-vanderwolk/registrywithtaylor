import { describe, expect, it } from 'vitest';
import { isStoreUrlOn, storeRetailerName } from '@/lib/catalog/storeRetailers';
import { getExactDirectAffiliateLink, isDirectProgramUrl } from '@/lib/catalog/directAffiliateLinks';

const shopMy = (url: string) => `https://go.shopmy.us/apx/y5Etg8?url=${encodeURIComponent(url)}`;
const awin = (url: string) => `https://www.awin1.com/cread.php?awinmid=115993&awinaffid=2588613&platform=dl&ued=${encodeURIComponent(url)}`;

describe('store link names', () => {
  it('names known stores and brand shops', () => {
    expect(storeRetailerName('https://www.target.com/p/x/-/A-1')).toBe('Target');
    expect(storeRetailerName('https://www.nordstrom.com/s/x/1')).toBe('Nordstrom');
    expect(storeRetailerName('https://us.britax.com/shop/strollers/x')).toBe('Britax');
    expect(storeRetailerName('https://www.chiccousa.com/shop/x.html')).toBe('Chicco');
    expect(storeRetailerName('https://safety1st.com/products/x')).toBe('Safety 1st');
  });
  it('reads through ShopMy and Awin wrappers without building one', () => {
    expect(storeRetailerName(shopMy('https://www.target.com/p/x/-/A-1'))).toBe('Target');
    expect(storeRetailerName(awin('https://mimakidsusa.com/products/mima-creo-stroller'))).toBe('Mima');
  });
  it('falls back to the bare host for an unknown store, and null for junk', () => {
    expect(storeRetailerName('https://www.examplestore.com/p/1')).toBe('examplestore.com');
    expect(storeRetailerName('not a url')).toBeNull();
    expect(storeRetailerName(null)).toBeNull();
  });
  it('matches hosts exactly or by subdomain, never by look-alike', () => {
    expect(isStoreUrlOn('https://bombigear.com/products/x', ['bombigear.com'])).toBe(true);
    expect(isStoreUrlOn('https://notbombigear.com/products/x', ['bombigear.com'])).toBe(false);
  });
});

describe('direct programs', () => {
  it('only counts an exact per-model link as buyable', () => {
    expect(getExactDirectAffiliateLink('Mima', 'Xari')).toContain('mima-xari-max-stroller');
    expect(getExactDirectAffiliateLink('Silver Cross', 'Reef')).toContain('silver-cross-reef-2');
    expect(getExactDirectAffiliateLink('Mima', 'Unknown')).toBeNull();
    expect(getExactDirectAffiliateLink('Chicco', 'Cortina Together Double')).toBeNull();
  });
  it('recognises a hand-added link on the brand’s own direct shop', () => {
    expect(isDirectProgramUrl('Mima', awin('https://mimakidsusa.com/products/mima-miro-stroller'))).toBe(true);
    expect(isDirectProgramUrl('Silver Cross', 'https://silvercrossus.com/product/cove-2-full-size-stroller/')).toBe(true);
    expect(isDirectProgramUrl('Chicco', 'https://www.chiccousa.com/x.html')).toBe(false);
  });
});
