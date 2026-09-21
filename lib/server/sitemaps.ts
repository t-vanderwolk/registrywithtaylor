import 'server-only';
import type { MetadataRoute } from 'next';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';
import { sitemapUrl, type SitemapName } from '@/lib/seo/sitemaps';

// Hidden learning routes, retired URLs, and assets are deliberately absent.
const PAGE_ENTRIES: MetadataRoute.Sitemap = [
  { url: sitemapUrl('/'), changeFrequency: 'weekly', priority: 1.0 },
  { url: sitemapUrl('/services'), changeFrequency: 'monthly', priority: 0.9 },
  { url: sitemapUrl('/book'), changeFrequency: 'monthly', priority: 0.8 },
  { url: sitemapUrl('/gift'), changeFrequency: 'monthly', priority: 0.7 },
  { url: sitemapUrl('/redeem'), changeFrequency: 'yearly', priority: 0.2 },
  { url: sitemapUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
  { url: sitemapUrl('/resources'), changeFrequency: 'weekly', priority: 0.95 },
  { url: sitemapUrl('/resources/baby-checklist'), changeFrequency: 'monthly', priority: 0.85 },
  { url: sitemapUrl('/tools/stroller-quiz'), changeFrequency: 'monthly', priority: 0.8 },
  { url: sitemapUrl('/tools/stroller-finder'), changeFrequency: 'daily', priority: 0.9 },
  { url: sitemapUrl('/tools/compare'), changeFrequency: 'daily', priority: 0.9 },
  { url: sitemapUrl('/tools/travel-system'), changeFrequency: 'daily', priority: 0.9 },
  { url: sitemapUrl('/blog'), changeFrequency: 'weekly', priority: 0.9 },
  { url: sitemapUrl('/contact'), changeFrequency: 'monthly', priority: 0.7 },
  { url: sitemapUrl('/faq'), changeFrequency: 'monthly', priority: 0.7 },
  { url: sitemapUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  { url: sitemapUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
  { url: sitemapUrl('/refund'), changeFrequency: 'yearly', priority: 0.3 },
];

export async function getSitemapEntries(name: SitemapName): Promise<MetadataRoute.Sitemap> {
  switch (name) {
    case 'pages.xml':
      return PAGE_ENTRIES;
    case 'blog.xml': {
      const posts = await getPublicBlogIndexPosts(new Date());
      return posts
        .filter((post) => post.slug && !post.slug.startsWith('untitled-post'))
        .map((post) => ({
          url: sitemapUrl(`/blog/${post.slug}`),
          lastModified: post.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.7,
        }));
    }
    // NOTE: `stroller-finder.xml`, `comparisons.xml` and `travel-systems.xml` were
    // intentionally removed. They emitted one query-parameter URL per catalog entity
    // (?brand=, ?category=, ?ids=, ?stroller=, ?carSeat=) — ~400 interactive tool
    // states submitted as individually indexable pages. Those states now serve
    // `noindex, follow` and canonicalise to their clean tool landing page, which
    // remains listed in PAGE_ENTRIES above. Do not reintroduce parameterised URLs here.
  }
}
