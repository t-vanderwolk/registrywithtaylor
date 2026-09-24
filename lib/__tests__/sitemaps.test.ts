import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SITEMAP_NAMES, serializeSitemap, serializeSitemapIndex } from '@/lib/seo/sitemaps';

const sources = vi.hoisted(() => ({
  blogs: vi.fn(), brands: vi.fn(), comparisons: vi.fn(), strollers: vi.fn(), carSeats: vi.fn(),
}));
vi.mock('@/lib/server/publicBlog', () => ({ getPublicBlogIndexPosts: sources.blogs }));
// The catalog sources stay mocked on purpose. Nothing in the sitemaps may reach
// for them any more (see 79f60fd) — these mocks are what proves it.
vi.mock('@/lib/server/publicStrollerCatalog', () => ({ getPublicStrollerCatalogBrands: sources.brands }));
vi.mock('@/lib/server/strollerCompareCatalog', () => ({ getStrollerCompareCatalog: sources.comparisons }));
vi.mock('@/lib/server/travelSystemCompatibility', () => ({
  getTravelSystemStrollers: sources.strollers, getTravelSystemCarSeats: sources.carSeats,
}));

import { getSitemapEntries } from '@/lib/server/sitemaps';
import { GET as getChild } from '@/app/sitemaps/[name]/route';
import { GET as getIndex } from '@/app/sitemap.xml/route';

/**
 * Retired in 79f60fd: one query-parameter URL per catalog entity (?brand=,
 * ?category=, ?ids=, ?stroller=, ?carSeat=) — ~400 interactive tool states
 * submitted as indexable pages. They now serve noindex, follow and canonicalise
 * to their clean tool landing page, which `pages.xml` still lists.
 */
const RETIRED_SITEMAPS = ['stroller-finder.xml', 'comparisons.xml', 'travel-systems.xml'];

beforeEach(() => {
  vi.clearAllMocks();
  sources.blogs.mockResolvedValue([
    { slug: 'stroller-guide', updatedAt: new Date('2026-09-01T00:00:00Z') },
    { slug: 'untitled-post-5', updatedAt: new Date('2026-09-01T00:00:00Z') },
  ]);
  sources.brands.mockResolvedValue([
    { brand: 'Orbit Baby', count: 1, types: [{ category: 'full-size' }] },
    { brand: 'Empty Brand', count: 0, types: [] },
  ]);
  sources.comparisons.mockResolvedValue([{ id: 'silver-cross-reef' }]);
  sources.strollers.mockResolvedValue([{ brand: 'Silver Cross', model: 'Reef' }]);
  sources.carSeats.mockResolvedValue([{ brand: 'Nuna', model: 'PIPA RX' }]);
});

describe('sitemap index and child documents', () => {
  it('keeps the root sitemap as an XML index of the children we still publish', async () => {
    const response = getIndex();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/xml');
    const xml = await response.text();
    expect(xml).toBe(serializeSitemapIndex());
    expect(xml).toContain('<sitemapindex');
    expect([...SITEMAP_NAMES]).toEqual(['pages.xml', 'blog.xml']);
    for (const name of SITEMAP_NAMES) expect(xml).toContain(`https://www.taylormadebabyco.com/sitemaps/${name}`);
    for (const name of RETIRED_SITEMAPS) expect(xml).not.toContain(name);
    expect(sources.blogs).not.toHaveBeenCalled();
  });

  it('publishes clean canonical URLs only, and no interactive tool state', async () => {
    const sections = await Promise.all(SITEMAP_NAMES.map(getSitemapEntries));
    const urls = sections.flat().map((entry) => entry.url);
    expect(sections[0]).toHaveLength(18);
    expect(sections[1]).toHaveLength(1);

    // The tools are still submitted — as their clean landing pages.
    for (const tool of ['/tools/stroller-finder', '/tools/compare', '/tools/travel-system', '/tools/stroller-quiz']) {
      expect(urls).toContain(`https://www.taylormadebabyco.com${tool}`);
    }
    // Never as a filtered or selected state of one.
    expect(urls.filter((url) => url.includes('?'))).toEqual([]);
    // Building those states needs the catalog, so nothing here may touch it.
    for (const source of [sources.brands, sources.comparisons, sources.strollers, sources.carSeats]) {
      expect(source).not.toHaveBeenCalled();
    }

    expect(urls.some((url) => /\/(academy|learn|guides|_next|admin)\b|untitled-post|reef-2|how-it-works/.test(url))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('escapes XML, deduplicates URLs and uses actual modification dates only', () => {
    const entry = { url: 'https://example.com/?brand=A&B', lastModified: new Date('2026-09-01T00:00:00Z') };
    const xml = serializeSitemap([entry, entry, { url: 'https://example.com/other' }]);
    expect(xml).toContain('brand=A&amp;B');
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
    expect(xml).toContain('<lastmod>2026-09-01T00:00:00.000Z</lastmod>');
  });

  it('serves valid child XML and returns 404 for an unknown child', async () => {
    const request = new Request('https://example.com/sitemaps/blog.xml');
    const valid = await getChild(request, { params: Promise.resolve({ name: 'blog.xml' }) });
    expect(valid.status).toBe(200);
    expect(await valid.text()).toContain('/blog/stroller-guide</loc>');
    sources.blogs.mockClear();
    const invalid = await getChild(request, { params: Promise.resolve({ name: 'unknown.xml' }) });
    expect(invalid.status).toBe(404);
    for (const name of RETIRED_SITEMAPS) {
      const retired = await getChild(request, { params: Promise.resolve({ name }) });
      expect(retired.status).toBe(404);
    }
    expect(sources.blogs).not.toHaveBeenCalled();
  });

  it('returns a retryable failure instead of publishing an empty or partial sitemap', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      // An outage and a source that comes back empty both have to fail loudly,
      // rather than publishing a sitemap that silently drops every URL.
      sources.blogs.mockRejectedValueOnce(new Error('Database unavailable'));
      sources.blogs.mockResolvedValueOnce([]);
      for (const _ of [0, 1]) {
        const response = await getChild(new Request('https://example.com'), { params: Promise.resolve({ name: 'blog.xml' }) });
        expect(response.status).toBe(503);
        expect(response.headers.get('Cache-Control')).toBe('no-store');
        expect(response.headers.get('Retry-After')).toBe('600');
      }
    } finally {
      log.mockRestore();
    }
  });
});
