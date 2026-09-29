import { beforeEach, describe, expect, it, vi } from 'vitest';
const db = vi.hoisted(() => ({ query: vi.fn(), feed: vi.fn() }));
vi.mock('@/lib/server/prisma', () => ({ default: { $queryRaw: db.query, affiliateCatalogProduct: { findMany: db.feed } } }));
vi.mock('@/lib/server/gbgBadgeOverrides', () => ({ getGbgBadgeOverrides: async () => new Map() }));
vi.mock('@/lib/travelSystemAffiliateLinks', () => ({ getAffiliateLinks: () => ({}) }));
vi.mock('@/lib/server/amazonCreators/cache', () => ({
  getAmazonCacheMapForUrls: async () => new Map(), bestAmazonUrl: () => null,
  bestAmazonImage: () => null, bestAmazonPrice: () => null,
}));
import { getPublicCarSeatBrands } from '@/lib/server/publicCarSeatCatalog';
import { carSeatRetailerIdentity as identity } from '@/lib/catalog/carSeatRetailerIdentity';
const nordstrom = { retailer: 'Nordstrom', url: 'https://www.nordstrom.com/s/test-seat/1234567' };
const bloomingdales = { retailer: "Bloomingdale's", url: 'https://www.bloomingdales.com/shop/product/test?ID=1234' };
function feed(brand: string, model: string, title = `${brand} ${model} Infant Car Seat`) {
  return { provider: 'babylist_impact', brand, title, price: 500, imageUrl: null,
    productUrl: 'https://www.babylist.com/gp/test/123/456', affiliateUrl: 'https://www.babylist.com/gp/test/123/456',
    retailer: 'Babylist', itemGroupId: null, enrichment: { canonicalBrand: brand, canonicalName: model, productType: 'infant car seat' } };
}
beforeEach(() => { db.query.mockReset(); db.feed.mockReset(); });
describe('infant finder curated retailers', () => {
  it('merges reviewed color-bearing aliases, retains primary offers and prior retailer order, and deduplicates extras', async () => {
    db.feed.mockResolvedValue([feed('Nuna', 'Nuna PIPA aire rx in Biscotti')]);
    db.query.mockResolvedValue([{ brand: 'Nuna', model: 'PIPA Aire rx', retailerLinks: [bloomingdales, nordstrom, nordstrom] }]);
    const brands = await getPublicCarSeatBrands();
    const product = brands[0].types[0].products[0];
    expect(product.model).toBe('Nuna PIPA aire rx in Biscotti');
    expect(product.price).toBe(500);
    expect(product.retailers.babylist?.url).toBe('https://www.babylist.com/gp/test/123/456');
    expect(product.extraRetailers).toEqual([bloomingdales, nordstrom]);
  });
  it('does not invent finder cards for curated seats absent from the feed', async () => {
    db.feed.mockResolvedValue([]);
    db.query.mockResolvedValue([{ brand: 'Maxi-Cosi', model: 'Ambra', retailerLinks: [nordstrom] }]);
    expect(await getPublicCarSeatBrands()).toEqual([]);
  });
  it('holds the Mico Pro/Pro+ conflict', async () => {
    db.feed.mockResolvedValue([feed('Maxi-Cosi', 'Mico Pro', 'Maxi-Cosi Mico Pro+ Infant Car Seat in Sea Shadow')]);
    db.query.mockResolvedValue([{ brand: 'Maxi-Cosi', model: 'Mico Pro', retailerLinks: [nordstrom] }]);
    expect((await getPublicCarSeatBrands())[0].types[0].products[0].extraRetailers).toEqual([]);
  });
  it.each([
    ['UPPAbaby', 'UPPAbaby Aria V2 in Ada', 'Aria V2'],
    ['UPPAbaby', 'UPPAbaby Mesa V3 in Ada', 'Mesa V3'],
    ['Nuna', 'Nuna PIPA rx in Caviar/Cognac', 'PIPA RX'],
    ['Cybex', 'Cloud T Comfort Extend', 'Cloud T'],
  ])('matches reviewed alias %s %s', (brand, alias, model) => {
    expect(identity(brand, alias)).toBe(identity(brand, model));
  });
  it.each([
    ['UPPAbaby', 'Aria', 'Aria V2'], ['Cybex', 'Aton G2', 'Aton G2 Swivel'],
    ['Maxi-Cosi', 'Mico Pro', 'Mico Pro+'], ['Nuna', 'PIPA Aire', 'PIPA Aire rx'],
    ['Chicco', 'KeyFit Max Zip ClearLux', 'KeyFit Max Zip ClearTex'],
    ['Doona', 'Doona', 'X'], ['Maxi-Cosi', 'Peri 180', 'The Kindred Collection Peri 180'],
  ])('keeps %s %s separate from %s', (brand, left, right) => {
    expect(identity(brand, left)).not.toBe(identity(brand, right));
  });
});
