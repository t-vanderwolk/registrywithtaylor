import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({ query: vi.fn(), feed: vi.fn() }));
vi.mock('@/lib/server/prisma', () => ({ default: { $queryRaw: db.query, affiliateCatalogProduct: { findMany: db.feed } } }));
vi.mock('@/lib/server/amazonCreators/cache', () => ({
  getAmazonCacheMapForUrls: async () => new Map(),
  bestAmazonUrl: (url: string | null) => url,
  bestAmazonImage: (image: string | null) => image,
  bestAmazonPrice: (price: number | null) => price,
}));
vi.mock('@/lib/server/publicStrollerCatalog', () => ({ getPublicStrollerCatalogTravelSystemOptions: async () => [] }));
vi.mock('@/lib/travelSystemAffiliateLinks', () => ({ getAffiliateLinks: () => ({}) }));
import { getTravelSystemCarSeats, getTravelSystemCompatibility } from '@/lib/server/travelSystemCompatibility';

const links = [{ retailer: 'Target', url: 'https://www.target.com/p/exact-seat' }];
const seat = { id: 'seat', brand: 'Nuna', model: 'PIPA rx', displayName: 'Nuna PIPA rx', summary: null, babylistUrl: null, babylistPrice: null, babylistImage: null, amazonUrl: null };
const stroller = { id: 'stroller', brand: 'Nuna', model: 'MIXX next', displayName: 'Nuna MIXX next', summary: null, babylistUrl: 'https://babylist.pxf.io/stroller', babylistPrice: 800, babylistImage: null, amazonUrl: null };

beforeEach(() => {
  db.query.mockReset();
  db.feed.mockReset();
  db.feed.mockResolvedValue([]);
  db.query.mockImplementation(async (parts: TemplateStringsArray) => {
    const sql = parts.join('?');
    if (sql.includes('WHERE "retailerLinks" IS NOT NULL')) return [{ ...seat, retailerLinks: links }];
    if (sql.includes('FROM "Compatibility"')) return [];
    if (sql.includes('FROM "Stroller"')) return [stroller];
    if (sql.includes('FROM "CarSeat"')) return [seat];
    throw new Error(`Unexpected query: ${sql}`);
  });
});

describe('extra-only infant car seat visibility', () => {
  it('includes an extra-only seat in the browse catalog', async () => {
    const options = await getTravelSystemCarSeats();
    expect(options).toHaveLength(1);
    expect(options[0].extraRetailers).toEqual(links);
  });
  it('retains extra-only seats through same-brand matching and final filtering', async () => {
    const result = await getTravelSystemCompatibility('Nuna', 'MIXX next');
    expect(result?.compatibleCarSeats).toHaveLength(1);
    expect(result?.compatibleCarSeats[0].extraRetailers).toEqual(links);
    expect(db.query.mock.calls.filter(([parts]) => parts.join('').includes('WHERE "retailerLinks" IS NOT NULL'))).toHaveLength(1);
  });
  it('does not make an unshoppable seat public when extras are unavailable', async () => {
    const original = db.query.getMockImplementation()!;
    db.query.mockImplementation(async (parts: TemplateStringsArray) => parts.join('').includes('WHERE "retailerLinks" IS NOT NULL') ? [] : original(parts));
    expect(await getTravelSystemCarSeats()).toEqual([]);
  });
  it('attaches links before filtering explicit and shared-adapter results', async () => {
    const clek = { ...seat, id: 'clek', brand: 'Clek', model: 'Liing', displayName: 'Clek Liing' };
    const cybex = { ...stroller, brand: 'Cybex', model: 'Gazelle S' };
    db.query.mockImplementation(async (parts: TemplateStringsArray, ...values: string[]) => {
      const sql = parts.join('?');
      if (sql.includes('WHERE "retailerLinks" IS NOT NULL')) return [seat, clek].map((row) => ({ ...row, retailerLinks: links }));
      if (sql.includes('FROM "Compatibility"')) return [{ ...seat, carSeatId: seat.id, compatibilityType: 'ADAPTER', adapterRequired: true, adapterType: 'Adapter', adapterBabylistUrl: null, adapterImage: null, adapterPrice: null, confidence: 'HIGH', notes: null }];
      if (sql.includes('FROM "Stroller"')) return [cybex];
      if (sql.includes('FROM "CarSeat"')) {
        if (sql.includes('LOWER("brand") = LOWER')) return values[0]?.toLowerCase() === 'clek' ? [clek] : [];
        return [seat, clek];
      }
      throw new Error(`Unexpected query: ${sql}`);
    });
    const result = await getTravelSystemCompatibility('Cybex', 'Gazelle S');
    expect(result?.compatibleCarSeats.map((row) => row.brand).sort()).toEqual(['Clek', 'Nuna']);
    expect(result?.compatibleCarSeats.every((row) => row.extraRetailers?.[0].url === links[0].url)).toBe(true);
  });
});
