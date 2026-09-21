import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/metadata';

/**
 * Only sitemaps of genuinely indexable, canonical URLs.
 *
 * `stroller-finder.xml`, `comparisons.xml` and `travel-systems.xml` were removed:
 * they emitted one query-parameter URL per catalog entity
 * (`?brand=`, `?category=`, `?ids=`, `?stroller=`, `?carSeat=`) — ~400 interactive
 * tool states submitted as individually indexable pages. Google discovered them
 * all at once and crawled none ("Discovered – currently not indexed"). Those
 * states now serve `noindex, follow` and canonicalise to their clean tool landing
 * page, which stays in `pages.xml`.
 */
export const SITEMAP_NAMES = ['pages.xml', 'blog.xml'] as const;

export type SitemapName = (typeof SITEMAP_NAMES)[number];

export function isSitemapName(name: string): name is SitemapName {
  return SITEMAP_NAMES.some((entry) => entry === name);
}

export function sitemapUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[character]!);
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const XML_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';

export function serializeSitemapIndex() {
  const entries = SITEMAP_NAMES.map((name) =>
    `<sitemap><loc>${escapeXml(sitemapUrl(`/sitemaps/${name}`))}</loc></sitemap>`,
  );
  return `${XML_HEADER}\n<sitemapindex xmlns="${XML_NAMESPACE}">\n${entries.join('\n')}\n</sitemapindex>\n`;
}

export function serializeSitemap(entries: MetadataRoute.Sitemap) {
  const unique = Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
  const urls = unique.map((entry) => {
    const lastModified = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
    return [
      '<url>',
      `<loc>${escapeXml(entry.url)}</loc>`,
      lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : '',
      entry.changeFrequency ? `<changefreq>${escapeXml(entry.changeFrequency)}</changefreq>` : '',
      entry.priority != null ? `<priority>${entry.priority}</priority>` : '',
      '</url>',
    ].join('');
  });
  return `${XML_HEADER}\n<urlset xmlns="${XML_NAMESPACE}">\n${urls.join('\n')}\n</urlset>\n`;
}

export function sitemapResponse(xml: string) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
