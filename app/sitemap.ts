import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';
import { travelSystemResultsHref } from '@/lib/travelSystemRouting';

const buildUrl = (path: string) => new URL(path, SITE_URL).toString();

// /learn and /academy are intentionally excluded from the sitemap (and from the
// internal-link system) while those surfaces are hidden. The static set below
// mirrors the canonical base for taylormadebabyco.com.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: buildUrl('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: buildUrl('/services'), changeFrequency: 'monthly', priority: 0.9 },
    { url: buildUrl('/book'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
    // "Know Before You Buy" — the educational entry point before the tools.
    { url: buildUrl('/resources'), changeFrequency: 'weekly', priority: 0.95 },
    { url: buildUrl('/tools/stroller-quiz'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/tools/stroller-finder'), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl('/tools/travel-system'), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl('/blog'), changeFrequency: 'weekly', priority: 0.9 },
    { url: buildUrl('/contact'), changeFrequency: 'monthly', priority: 0.7 },
    { url: buildUrl('/faq'), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Travel-system results pages — one per public stroller and per infant car
  // seat, e.g. /tools/travel-system/results?stroller=uppababy-vista-v3
  let travelSystemEntries: MetadataRoute.Sitemap = [];
  try {
    const [strollers, carSeats] = await Promise.all([
      getTravelSystemStrollers(),
      getTravelSystemCarSeats(),
    ]);
    travelSystemEntries = [
      ...strollers.map((option) => ({
        url: buildUrl(travelSystemResultsHref('stroller', option)),
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })),
      ...carSeats.map((option) => ({
        url: buildUrl(travelSystemResultsHref('carSeat', option)),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error('Failed to build travel-system sitemap entries.', error);
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
      [...staticEntries, ...travelSystemEntries, ...blogEntries].map((entry) => [entry.url, entry]),
    ).values(),
  );
}
