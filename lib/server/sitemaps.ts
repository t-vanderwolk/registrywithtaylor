import 'server-only';
import type { MetadataRoute } from 'next';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';
import { getPublicStrollerCatalogBrands } from '@/lib/server/publicStrollerCatalog';
import { getStrollerCompareCatalog } from '@/lib/server/strollerCompareCatalog';
import { getTravelSystemCarSeats, getTravelSystemStrollers } from '@/lib/server/travelSystemCompatibility';
import { strollerCategories, strollerFinderCategoryHref, strollerFinderBrandHref } from '@/lib/resources/knowBeforeYouBuy';
import { travelSystemResultsHref } from '@/lib/travelSystemRouting';
import { comparePath } from '@/lib/strollerCompareRouting';
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
    case 'stroller-finder.xml': {
      const brands = await getPublicStrollerCatalogBrands();
      const categories = new Set<string>(brands.flatMap((brand) => brand.types.map((type) => type.category)));
      return [
        ...strollerCategories.filter((category) => categories.has(category.slug)).map((category) => ({
          url: sitemapUrl(strollerFinderCategoryHref(category.slug)),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })),
        ...brands.filter((brand) => brand.count > 0).map((brand) => ({
          url: sitemapUrl(strollerFinderBrandHref(brand.brand)),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })),
      ];
    }
    case 'comparisons.xml': {
      const catalog = await getStrollerCompareCatalog();
      return catalog.map((item) => ({
        url: sitemapUrl(comparePath([item.id])),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
    case 'travel-systems.xml': {
      const [strollers, carSeats] = await Promise.all([
        getTravelSystemStrollers(), getTravelSystemCarSeats(),
      ]);
      // Neither half should disappear from a successful sitemap during an outage.
      if (!strollers.length || !carSeats.length) throw new Error('Travel-system sitemap data is unavailable.');
      return [
        ...strollers.map((stroller) => ({
          url: sitemapUrl(travelSystemResultsHref('stroller', stroller)),
          changeFrequency: 'weekly' as const,
          priority: 0.65,
        })),
        ...carSeats.map((carSeat) => ({
          url: sitemapUrl(travelSystemResultsHref('carSeat', carSeat)),
          changeFrequency: 'weekly' as const,
          priority: 0.65,
        })),
      ];
    }
  }
}
