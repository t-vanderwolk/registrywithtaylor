import { describe, expect, it, vi } from 'vitest';

const TARGET = 'https://www.target.com/p/peg-perego-vivace/-/A-91123586';
const db = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/lib/server/prisma', () => ({ default: { $queryRaw: db.query, affiliateCatalogProduct: { findMany: async () => [] } } }));
vi.mock('@/lib/server/amazonCreators/cache', () => ({
  getAmazonCacheMapForUrls: async () => new Map(),
  bestAmazonUrl: (url: string | null) => url,
  bestAmazonImage: (image: string | null) => image,
  bestAmazonPrice: (price: number | null) => price,
}));
vi.mock('@/lib/server/publicStrollerCatalog', () => ({
  getPublicStrollerCatalogTravelSystemOptions: async () => [{
    brand: 'Peg Perego', model: 'Vivace', displayName: 'Peg Perego Vivace', summary: null, strollerCategory: 'full-size',
    babylistUrl: null, babylistImage: null, babylistPrice: null, macroBabyUrl: null, macroBabyImage: null, macroBabyPrice: null,
    bombiUrl: null, bombiImage: null, bombiPrice: null, amazonUrl: null, amazonImage: null, amazonPrice: null,
    extraRetailers: [{ retailer: 'Target', url: TARGET }], fallbackImage: 'https://example.com/vivace.jpg',
  }],
}));
vi.mock('@/lib/travelSystemAffiliateLinks', () => ({ getAffiliateLinks: () => ({}), babylistAffiliateUrl: (_b: string, _m: string, _k: string, url: string) => url }));
import { getTravelSystemCompatibility, getTravelSystemCompatibilityByCarSeat } from '@/lib/server/travelSystemCompatibility';

const seat = { id: 'seat', carSeatId: 'seat', brand: 'Peg Perego', model: 'Primo Viaggio Nido', displayName: 'Peg Perego Primo Viaggio Nido', summary: null, babylistUrl: 'https://www.babylist.com/gp/nido/1/2', babylistPrice: 300, babylistImage: null, amazonUrl: null, seatType: 'INFANT' };
const link = { compatibilityType: 'DIRECT', adapterRequired: false, adapterType: null, adapterBabylistUrl: null, adapterImage: null, adapterPrice: null, notes: null, confidence: 'HIGH' };
const vivace = { id: 'vivace', brand: 'Peg Perego', model: 'Vivace', displayName: 'Peg Perego Vivace', summary: null, babylistUrl: null, babylistPrice: null, babylistImage: null, amazonUrl: null };
const ypsi = { ...vivace, id: 'ypsi', model: 'Ypsi', displayName: 'Peg Perego Ypsi' };

db.query.mockImplementation(async (parts: TemplateStringsArray) => {
  const sql = parts.join('?');
  if (sql.includes('WHERE "retailerLinks" IS NOT NULL')) return [];
  if (sql.includes('FROM "Compatibility"') && sql.includes('compat."carSeatId" =')) return [vivace, ypsi].map((s) => ({ ...s, strollerId: s.id, ...link }));
  if (sql.includes('FROM "Compatibility"') && sql.includes('compat."strollerId" =')) return [{ ...seat, ...link }];
  if (sql.includes('FROM "Compatibility"')) return [];
  if (sql.includes('FROM "Stroller"')) return [vivace];
  if (sql.includes('FROM "CarSeat"')) return [seat];
  return [];
});

describe('strollers sold only through a hand-added store link, in the travel-system checker', () => {
  it('stay in the by-car-seat results, with their store button and photo', async () => {
    const result = await getTravelSystemCompatibilityByCarSeat('Peg Perego', 'Primo Viaggio Nido');
    expect(result?.compatibleStrollers.map((row) => row.model)).toEqual(['Vivace']);
    expect(result?.compatibleStrollers[0].extraRetailers).toEqual([{ retailer: 'Target', url: TARGET }]);
    expect(result?.compatibleStrollers[0].imageUrl).toBe('https://example.com/vivace.jpg');
  });
  it('keep their store button on the stroller-first page', async () => {
    const result = await getTravelSystemCompatibility('Peg Perego', 'Vivace');
    expect(result?.stroller.extraRetailers).toEqual([{ retailer: 'Target', url: TARGET }]);
    expect(result?.compatibleCarSeats.map((row) => row.model)).toEqual(['Primo Viaggio Nido']);
  });
});
