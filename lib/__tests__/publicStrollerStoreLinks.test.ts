import { describe, expect, it, vi } from 'vitest';

const rows = vi.hoisted(() => [] as unknown[]);
vi.mock('@/lib/server/prisma', () => ({ default: { affiliateCatalogProduct: { findMany: async () => rows }, $queryRaw: async () => [] } }));
vi.mock('@/lib/server/gbgBadgeOverrides', () => ({ getGbgBadgeOverrides: async () => new Map() }));
vi.mock('@/lib/server/amazonCreators/cache', () => ({
  getAmazonCacheMapForUrls: async () => new Map(),
  bestAmazonUrl: (url: string | null) => url,
  bestAmazonImage: (image: string | null) => image,
  bestAmazonPrice: (price: number | null) => price,
}));
import { getPublicStrollerCatalogBrands, getPublicStrollerCatalogTravelSystemOptions } from '@/lib/server/publicStrollerCatalog';

type Row = { brand: string; title: string; type: string; url: string; provider?: string; name?: string; amazon?: string; image?: string };
const row = (r: Row) => ({
  provider: r.provider ?? 'manual_tmbc', brand: r.brand, title: r.title, price: null, imageUrl: r.image ?? null,
  productUrl: r.url, affiliateUrl: r.url, manualAmazonUrl: r.amazon ?? null, retailer: 'Manual', itemGroupId: null,
  enrichment: { productType: r.type, canonicalBrand: r.brand, canonicalName: r.name ?? null },
});
const TARGET = 'https://www.target.com/p/chicco-cortina-together-double-stroller-minerale/-/A-75558344';
rows.push(
  row({ brand: 'Chicco', title: 'Chicco - Cortina Together Double Stroller, Minerale', type: 'double stroller', url: 'https://www.macrobaby.com/products/chicco-cortina', provider: 'shopify_macrobaby' }),
  row({ brand: 'Chicco', title: 'Chicco Cortina Together Double Stroller', type: 'Double Stroller', url: TARGET, image: 'https://example.com/cortina.jpg' }),
  row({ brand: 'Silver Cross', title: 'Silver Cross Reef Stroller', type: 'Travel Stroller', url: 'https://silvercrossus.com/product/silver-cross-reef-2-foldable-stroller/' }),
  row({ brand: 'Mima', title: 'Mima Xari MAX Stroller, Black Chassis', name: 'Xari', type: 'full-size stroller', url: 'https://www.macrobaby.com/products/mima-xari-max', provider: 'shopify_macrobaby', image: 'https://example.com/xari.jpg' }),
  row({ brand: 'Bombi', title: 'Bombi Bebee Twin V2 Stroller', type: 'Double Stroller', url: 'https://bombigear.com/products/bebee-twin' }),
  row({ brand: 'Peg Perego', title: 'Peg-Perego Ypsi Single to Double Stroller, True Black', type: 'single-to-double stroller', url: 'https://www.macrobaby.com/products/peg-perego-ypsi', provider: 'shopify_macrobaby' }),
  row({ brand: 'Peg Perego', title: 'Peg-Perego - City Loop Full-Size Reversible Stroller', type: 'compact stroller', url: 'https://www.macrobaby.com/products/peg-perego-city-loop', provider: 'shopify_macrobaby', amazon: 'https://www.amazon.com/dp/B0F67Q7XJC?tag=taylormadebab-20' }),
);

async function product(brand: string, model: string) {
  const brands = await getPublicStrollerCatalogBrands();
  return brands.find((b) => b.brand === brand)?.types.flatMap((t) => t.products).find((p) => p.model === model) ?? null;
}

describe('public stroller catalog: store and direct links', () => {
  it('lists a stroller sold only through a hand-added Target link, under a Target button', async () => {
    const cortina = await product('Chicco', 'Cortina Together Double');
    expect(cortina?.source).toBe('store');
    expect(cortina?.extraRetailers).toEqual([{ retailer: 'Target', url: TARGET }]);
    expect(cortina?.retailers.amazon).toBeNull();
    expect(cortina?.retailers.macrobaby).toBeNull();
  });
  it('never files a direct-program or Bombi link under Amazon', async () => {
    const reef = await product('Silver Cross', 'Reef');
    expect(reef?.source).toBe('direct');
    expect(reef?.retailers.amazon).toBeNull();
    expect(reef?.extraRetailers).toEqual([]);
    const bebee = (await getPublicStrollerCatalogBrands()).find((b) => b.brand === 'Bombi')?.types[0]?.products[0];
    expect(bebee?.source).toBe('bombi');
    expect(bebee?.retailers.amazon).toBeNull();
  });
  it('keeps a model with an exact direct affiliate link listed after MacroBaby is switched off', async () => {
    const xari = await product('Mima', 'Xari');
    expect(xari?.source).toBe('direct');
    expect(xari?.image).toBe('https://example.com/xari.jpg');
  });
  it('drops a MacroBaby-only stroller and keeps one with a hand-added Amazon link', async () => {
    expect(await product('Peg Perego', 'Ypsi')).toBeNull();
    expect((await product('Peg Perego', 'City Loop'))?.retailers.amazon?.url).toBe('https://www.amazon.com/dp/B0F67Q7XJC?tag=taylormadebab-20');
  });
  it('passes store links and a photo through to the travel-system options', async () => {
    const option = (await getPublicStrollerCatalogTravelSystemOptions()).find((o) => o.brand === 'Chicco');
    expect(option?.extraRetailers).toEqual([{ retailer: 'Target', url: TARGET }]);
    expect(option?.fallbackImage).toBe('https://example.com/cortina.jpg');
    expect(option?.amazonUrl).toBeNull();
  });
});
