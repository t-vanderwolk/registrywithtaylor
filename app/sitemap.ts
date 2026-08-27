import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';
import { getTravelSystemStrollers } from '@/lib/server/travelSystemCompatibility';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { strollerCategories, strollerFinderCategoryHref, strollerFinderBrandHref } from '@/lib/resources/knowBeforeYouBuy';

const buildUrl = (path: string) => new URL(path, SITE_URL).toString();

// /learn and /academy are intentionally excluded from the sitemap (and from the
// internal-link system) while those surfaces are hidden. The static set below
// mirrors the canonical base for taylormadebabyco.com.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: buildUrl('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: buildUrl('/services'), changeFrequency: 'monthly', priority: 0.9 },
    { url: buildUrl('/book'), changeFrequency: 'monthly', priority: 0.8 },
    // Gift a Registry Consult — buyer-facing landing; /redeem is intentionally
    // low-priority (recipients reach it from their certificate, not search).
    { url: buildUrl('/gift'), changeFrequency: 'monthly', priority: 0.7 },
    { url: buildUrl('/redeem'), changeFrequency: 'yearly', priority: 0.2 },
    { url: buildUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
    // "Know Before You Buy" — the educational entry point before the tools.
    { url: buildUrl('/resources'), changeFrequency: 'weekly', priority: 0.95 },
    { url: buildUrl('/resources/baby-checklist'), changeFrequency: 'monthly', priority: 0.85 },
    { url: buildUrl('/tools/stroller-quiz'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/tools/stroller-finder'), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl('/tools/compare'), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl('/tools/travel-system'), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl('/blog'), changeFrequency: 'weekly', priority: 0.9 },
    { url: buildUrl('/contact'), changeFrequency: 'monthly', priority: 0.7 },
    { url: buildUrl('/faq'), changeFrequency: 'monthly', priority: 0.7 },
    { url: buildUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: buildUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
    { url: buildUrl('/refund'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Stroller Finder category landing pages (deep-linked from Know Before You Buy),
  // e.g. /tools/stroller-finder?category=full-size — one discoverable page per type.
  const categoryEntries: MetadataRoute.Sitemap = strollerCategories.map((category) => ({
    url: buildUrl(strollerFinderCategoryHref(category.slug)),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // NOTE: /tools/travel-system/results?stroller=…&carSeat=… pages are
  // intentionally noindex (see app/tools/travel-system/results/page.tsx — they
  // canonicalize to a noindexed bare path). A sitemap must never list noindexed
  // URLs, so those result permutations are deliberately excluded here. Only the
  // indexable /tools/travel-system page (in staticEntries) and the discoverable
  // Stroller Finder brand landing pages below are included.
  let brandEntries: MetadataRoute.Sitemap = [];
  try {
    const strollers = await getTravelSystemStrollers();

    // Stroller Finder brand landing pages, e.g. /tools/stroller-finder?brand=Cybex —
    // one discoverable page per brand, deduped and canonicalized (so "CYBEX" and
    // "Cybex" collapse to a single entry).
    const brandNames = Array.from(
      new Set(strollers.map((option) => canonicalBrand(option.brand)).filter(Boolean)),
    ).sort();
    brandEntries = brandNames.map((brand) => ({
      url: buildUrl(strollerFinderBrandHref(brand)),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Failed to build stroller-finder brand sitemap entries.', error);
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublicBlogIndexPosts(new Date());
    blogEntries = posts
      .filter((post) => post.slug && !post.slug.startsWith('untitled-post'))
      .map((post) => ({
        url: buildUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Failed to build blog sitemap entries.', error);
  }

  // De-dupe by URL (variant strollers can share a slug) while preserving order.
  return Array.from(
    new Map(
      [...staticEntries, ...categoryEntries, ...brandEntries, ...blogEntries].map((entry) => [entry.url, entry]),
    ).values(),
  );
}
