import { describe, expect, it } from 'vitest';
import { babylistShopMyUrl, shopMyProductUrl } from '@/lib/affiliateShopMy';
import { isAffiliateLink } from '@/lib/analytics/isAffiliateLink';

import {
  aggregateAffiliateRetailerCounts,
  canonicalizeAffiliateRetailer,
  normalizeAffiliateClickAttribution,
} from '@/lib/analytics/affiliateRetailer';

describe('affiliate retailer canonicalization', () => {
  it('attributes converted Babylist clicks to ShopMy without relabeling historical Impact clicks', () => {
    const old = 'https://babylist.pxf.io/c/123?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fproduct';
    const converted = babylistShopMyUrl(old);
    expect(canonicalizeAffiliateRetailer({ url: converted, retailer: 'babylist' })).toEqual({ retailer: 'Babylist', network: 'ShopMy' });
    expect(canonicalizeAffiliateRetailer({ url: old })).toEqual({ retailer: 'Babylist', network: 'Impact' });
    expect(isAffiliateLink(converted)).toBe(true);
    expect(aggregateAffiliateRetailerCounts([{ url: old, count: 2 }, { url: converted, count: 3 }], [{ url: converted, count: 1 }])).toEqual([
      { retailer: 'Babylist', network: 'Multiple networks', total: 5, last28: 1 },
    ]);
  });
  it.each([
    [{ retailer: 'Amazon' }, { retailer: 'Amazon', network: 'Amazon Associates' }],
    [{ retailer: 'amazon' }, { retailer: 'Amazon', network: 'Amazon Associates' }],
    [{ url: 'https://amzn.to/4hdEYM0' }, { retailer: 'Amazon', network: 'Amazon Associates' }],
    [{ retailer: 'Babylist' }, { retailer: 'Babylist', network: 'Impact' }],
    [{ retailer: 'babylist' }, { retailer: 'Babylist', network: 'Impact' }],
    [{ retailer: 'MacroBaby' }, { retailer: 'MacroBaby', network: 'Shopify' }],
    [{ retailer: 'macrobaby' }, { retailer: 'MacroBaby', network: 'Shopify' }],
    [{ retailer: 'bombi' }, { retailer: 'Bombi', network: null }],
    [{ url: 'https://hellobombi.com/products/bebee-v3-stroller' }, { retailer: 'Bombi', network: null }],
  ])('canonicalizes %o', (input, expected) => {
    expect(canonicalizeAffiliateRetailer(input)).toEqual(expected);
  });

  it('uses destination identity over a tool-specific retailer label', () => {
    expect(canonicalizeAffiliateRetailer({
      retailer: 'adapter',
      url: 'https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20',
    })).toEqual({ retailer: 'Amazon', network: 'Amazon Associates' });

    expect(canonicalizeAffiliateRetailer({
      retailer: 'adapter',
      network: 'amazon associates',
    })).toEqual({ retailer: 'Amazon', network: 'Amazon Associates' });

    expect(canonicalizeAffiliateRetailer({
      retailer: 'adapter',
      url: 'https://babylist.pxf.io/example',
    })).toEqual({ retailer: 'Babylist', network: 'Impact' });

    expect(canonicalizeAffiliateRetailer({
      retailer: 'adapter',
      url: 'https://www.macrobaby.com/products/example',
    })).toEqual({ retailer: 'MacroBaby', network: 'Shopify' });

    expect(canonicalizeAffiliateRetailer({
      retailer: 'adapter',
      url: 'https://uppababy.com/accessories/adapters/example',
    })).toEqual({ retailer: 'uppababy.com', network: null });
  });

  it('preserves adapter placement in the existing source field', () => {
    expect(normalizeAffiliateClickAttribution({
      retailer: 'adapter',
      url: 'https://amzn.to/4hdEYM0',
      source: 'tool:travel-system-checker',
    })).toEqual({
      retailer: 'Amazon',
      network: 'Amazon Associates',
      source: 'tool:travel-system-checker:adapter',
    });
  });
});

describe('affiliate retailer analytics aggregation', () => {
  it('merges Amazon, amazon, and Amazon adapter clicks into one row', () => {
    const rows = aggregateAffiliateRetailerCounts(
      [
        { retailer: 'Amazon', url: 'https://www.amazon.com/dp/B000000001', count: 2 },
        { retailer: 'amazon', network: 'amazon associates', url: 'https://www.amazon.com/dp/B000000002', count: 3 },
        { retailer: 'adapter', url: 'https://amzn.to/example', count: 4 },
      ],
      [
        { retailer: 'amazon', url: 'https://www.amazon.com/dp/B000000002', count: 1 },
        { retailer: 'adapter', network: 'Amazon Associates', url: 'https://amzn.to/example', count: 2 },
      ],
    );

    expect(rows).toEqual([
      { retailer: 'Amazon', network: 'Amazon Associates', total: 9, last28: 3 },
    ]);
  });

  it('merges Babylist casing and keeps MacroBaby canonical', () => {
    const rows = aggregateAffiliateRetailerCounts(
      [
        { retailer: 'Babylist', url: 'https://www.babylist.com/gp/example/1', count: 5 },
        { retailer: 'babylist', url: 'https://babylist.pxf.io/example', count: 7 },
        { retailer: 'macrobaby', url: 'https://www.macrobaby.com/products/example', count: 2 },
      ],
      [
        { retailer: 'babylist', url: 'https://babylist.pxf.io/example', count: 3 },
        { retailer: 'MacroBaby', url: 'https://www.macrobaby.com/products/example', count: 1 },
      ],
    );

    expect(rows).toEqual([
      { retailer: 'Babylist', network: 'Impact', total: 12, last28: 3 },
      { retailer: 'MacroBaby', network: 'Shopify', total: 2, last28: 1 },
    ]);
  });
});

describe('ShopMy department-store attribution', () => {
  const target = 'https://www.target.com/p/uppababy-vista-v3-full-size-stroller-greyson/-/A-95019221';
  const bloomingdales = 'https://www.bloomingdales.com/shop/product/uppababy-cruz-v3-stroller?ID=5664009';

  it.each([
    [target, 'Target'],
    [bloomingdales, "Bloomingdale's"],
    ['https://www.nordstrom.com/s/example-stroller/1234567', 'Nordstrom'],
  ])('credits a ShopMy-wrapped %s click to %s via ShopMy', (url, retailer) => {
    expect(canonicalizeAffiliateRetailer({ url: shopMyProductUrl(url), retailer })).toEqual({ retailer, network: 'ShopMy' });
  });

  it('labels an unwrapped Target URL as Target with no network', () => {
    expect(canonicalizeAffiliateRetailer({ url: target })).toEqual({ retailer: 'Target', network: null });
  });

  it('does not treat Nordstrom Rack as Nordstrom', () => {
    expect(canonicalizeAffiliateRetailer({ url: 'https://www.nordstromrack.com/s/example/1' }).retailer).toBe('nordstromrack.com');
  });

  it('merges raw and ShopMy-wrapped Target clicks into one report row', () => {
    expect(aggregateAffiliateRetailerCounts(
      [{ retailer: 'Target', url: target, count: 3 }, { url: shopMyProductUrl(target), count: 2 }],
      [{ retailer: 'Target', url: target, count: 1 }],
    )).toEqual([{ retailer: 'Target', network: 'ShopMy', total: 5, last28: 1 }]);
  });
});
