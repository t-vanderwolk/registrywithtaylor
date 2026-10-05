import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ findMany: vi.fn(), availability: vi.fn(), overrides: vi.fn() }));
vi.mock('@/lib/server/prisma', () => ({ default: { affiliateCatalogProduct: { findMany: mocks.findMany } } }));
vi.mock('@/lib/server/gbgBadgeOverrides', () => ({ getGbgBadgeOverrides: mocks.overrides }));
vi.mock('@/lib/server/goodBuyGearAvailability', () => ({ getGoodBuyGearAvailability: mocks.availability }));
import { resolveBlogGoodBuyGearOffers } from '@/lib/server/blogGoodBuyGear';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';

describe('blog GoodBuy Gear availability', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.findMany.mockResolvedValue([]);
    mocks.overrides.mockResolvedValue(new Map());
    mocks.availability.mockResolvedValue({ price: null, condition: 'GoodBuy Gear', available: false });
  });
  it('checks the exact authored URL even if the catalog is unavailable', async () => {
    mocks.findMany.mockRejectedValue(new Error('offline'));
    const url = 'https://goodbuygear.com/products/uppababy-mesa-v3';
    const result = await resolveBlogGoodBuyGearOffers([{ brand: 'UPPAbaby', productName: 'Mesa V3', goodBuyGearUrl: url }]);
    expect(mocks.availability).toHaveBeenCalledWith(url);
    expect(result[blogProductKey('UPPAbaby', 'Mesa V3')]).toEqual({url, price: null, condition: 'GoodBuy Gear', available: false});
  });
  it('filters feed stock and suppresses a feed offer that is now sold out', async () => {
    const url = 'https://goodbuygear.com/products/uppababy-mesa-v3';
    mocks.findMany.mockResolvedValue([{brand:'UPPAbaby',title:'Mesa V3',price:180,salePrice:null,affiliateUrl:url,productUrl:null,enrichment:null}]);
    const result = await resolveBlogGoodBuyGearOffers([{ brand: 'UPPAbaby', productName: 'Mesa V3' }]);
    expect(mocks.findMany.mock.calls[0][0].where.inStock).toBe(true);
    expect(result[blogProductKey('UPPAbaby','Mesa V3')].available).toBe(false);
    expect(result[blogProductKey('UPPAbaby','Mesa V3')].price).toBeNull();
  });
});
