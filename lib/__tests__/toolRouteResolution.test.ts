import { beforeEach, describe, expect, it, vi } from 'vitest';

const sources = vi.hoisted(() => ({ brands: vi.fn(), comparisons: vi.fn() }));
vi.mock('@/lib/server/publicStrollerCatalog', () => ({ getPublicStrollerCatalogBrands: sources.brands }));
vi.mock('@/lib/server/strollerCompareCatalog', () => ({ getStrollerCompareCatalog: sources.comparisons }));
vi.mock('@/components/SiteShell', () => ({ default: () => null }));
vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('404'); },
  permanentRedirect: (path: string) => { throw new Error(`308:${path}`); },
}));

import ComparePage, { generateMetadata as compareMetadata } from '@/app/tools/compare/page';
import FinderPage, { generateMetadata as finderMetadata } from '@/app/tools/stroller-finder/page';

// Since 79f60fd, a selected/filtered tool state canonicalises to its clean
// landing page (and serves noindex, follow — see toolIndexingSeo.test.ts).
// Redirects, 404s and outage handling are what this file guards.
const COMPARE_CANONICAL = '/tools/compare';
const FINDER_CANONICAL = '/tools/stroller-finder';

beforeEach(() => {
  sources.comparisons.mockResolvedValue([
    { id: 'silver-cross-reef', brand: 'Silver Cross', model: 'Reef', displayName: 'Silver Cross Reef' },
    { id: 'uppababy-vista-v3', brand: 'UPPAbaby', model: 'Vista V3', displayName: 'UPPAbaby Vista V3' },
  ]);
  sources.brands.mockResolvedValue([
    { brand: 'Orbit Baby', count: 1, types: [{ category: 'full-size', label: 'Full Size' }] },
  ]);
});

describe('comparison route identity', () => {
  it('permanently redirects the historical Reef 2 URL to the current product URL', async () => {
    await expect(ComparePage({ searchParams: Promise.resolve({ ids: 'silver-cross-reef-2' }) }))
      .rejects.toThrow('308:/tools/compare?ids=silver-cross-reef');
    const metadata = await compareMetadata({ searchParams: Promise.resolve({ ids: 'silver-cross-reef-2' }) });
    expect(metadata.title).toContain('Silver Cross Reef');
    expect(metadata.alternates?.canonical).toBe(COMPARE_CANONICAL);
  });

  it('retains other products during an alias redirect', async () => {
    await expect(ComparePage({ searchParams: Promise.resolve({ ids: 'silver-cross-reef-2,uppababy-vista-v3' }) }))
      .rejects.toThrow('308:/tools/compare?ids=silver-cross-reef%2Cuppababy-vista-v3');
  });

  it('points a valid selection at the compare landing page and renders the base tool', async () => {
    const metadata = await compareMetadata({ searchParams: Promise.resolve({ ids: 'silver-cross-reef' }) });
    expect(metadata.alternates?.canonical).toBe(COMPARE_CANONICAL);
    await expect(ComparePage({})).resolves.toBeTruthy();
  });

  it('returns not found for unknown products instead of an empty 200 page', async () => {
    const props = { searchParams: Promise.resolve({ ids: 'silver-cross-reef-3' }) };
    await expect(ComparePage(props)).rejects.toThrow('404');
    await expect(compareMetadata(props)).rejects.toThrow('404');
  });

  it('does not treat a catalog outage as a permanently missing product', async () => {
    sources.comparisons.mockResolvedValue([]);
    await expect(ComparePage({ searchParams: Promise.resolve({ ids: 'silver-cross-reef' }) }))
      .rejects.toThrow('catalog is unavailable');
  });
});

describe('finder route identity', () => {
  it('uses the actual catalog brand for metadata and redirects spelling variants', async () => {
    const props = { searchParams: Promise.resolve({ brand: 'orbit baby' }) };
    const metadata = await finderMetadata(props);
    expect(metadata.title).toContain('Orbit Baby');
    expect(metadata.alternates?.canonical).toBe(FINDER_CANONICAL);
    await expect(FinderPage(props)).rejects.toThrow('308:/tools/stroller-finder?brand=Orbit%20Baby');
  });

  it('rejects unknown brands and categories instead of publishing duplicate generic pages', async () => {
    await expect(FinderPage({ searchParams: Promise.resolve({ brand: 'Unknown' }) })).rejects.toThrow('404');
    await expect(finderMetadata({ searchParams: Promise.resolve({ category: 'unknown' }) })).rejects.toThrow('404');
  });

  it('keeps real brand and category pages accessible', async () => {
    await expect(FinderPage({ searchParams: Promise.resolve({ brand: 'Orbit Baby' }) })).resolves.toBeTruthy();
    const metadata = await finderMetadata({ searchParams: Promise.resolve({ category: 'full-size' }) });
    expect(metadata.alternates?.canonical).toBe(FINDER_CANONICAL);
  });

  it('does not publish an empty catalog after an outage', async () => {
    sources.brands.mockResolvedValue([]);
    await expect(FinderPage({ searchParams: Promise.resolve({ brand: 'Orbit Baby' }) }))
      .rejects.toThrow('catalog is unavailable');
  });
});
