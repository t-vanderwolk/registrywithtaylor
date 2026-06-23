import type { MetadataRoute } from 'next';
import {
  getLearnSitemapPaths,
  getSubmoduleSitemapPaths,
} from '@/lib/academy/content';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';
import { isAcademyEnabled } from '@/lib/featureFlags';

const buildUrl = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: buildUrl('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: buildUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/services'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/book'), changeFrequency: 'monthly', priority: 0.85 },
    ...(isAcademyEnabled()
      ? [{ url: buildUrl('/academy'), changeFrequency: 'monthly' as const, priority: 0.8 }]
      : []),
    { url: buildUrl('/blog'), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl('/faq'), changeFrequency: 'monthly', priority: 0.7 },
    { url: buildUrl('/contact'), changeFrequency: 'monthly', priority: 0.7 },
    { url: buildUrl('/tools/stroller-quiz'), changeFrequency: 'monthly', priority: 0.75 },
    { url: buildUrl('/tools/travel-system'), changeFrequency: 'monthly', priority: 0.75 },
    { url: buildUrl('/tools/stroller-finder'), changeFrequency: 'monthly', priority: 0.75 },
    { url: buildUrl('/resources'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  ];

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

  // /learn/* + /academy/* — only included while Academy is publicly enabled.
  const academyOn = isAcademyEnabled();

  const learnEntries: MetadataRoute.Sitemap = academyOn
    ? getLearnSitemapPaths().map((path) => ({
        url: buildUrl(path),
        changeFrequency: 'monthly' as const,
        priority: path === '/learn' ? 0.9 : path.split('/').length === 3 ? 0.85 : 0.75,
      }))
    : [];

  const submoduleEntries: MetadataRoute.Sitemap = academyOn
    ? getSubmoduleSitemapPaths().map((path) => ({
        url: buildUrl(path),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    : [];

  return Array.from(
    new Map(
      [...staticEntries, ...learnEntries, ...submoduleEntries, ...blogEntries].map((entry) => [
        entry.url,
        entry,
      ]),
    ).values(),
  );
}
