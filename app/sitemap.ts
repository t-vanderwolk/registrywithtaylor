import type { MetadataRoute } from 'next';
import { getAcademySitemapPaths } from '@/lib/academy/content';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';

const buildUrl = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: buildUrl('/'), changeFrequency: 'weekly', priority: 1.0 },
    { url: buildUrl('/services'), changeFrequency: 'monthly', priority: 0.8 },
    { url: buildUrl('/academy'), changeFrequency: 'weekly', priority: 0.9 },
    { url: buildUrl('/blog'), changeFrequency: 'daily', priority: 0.9 },
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

  const academyEntries = getAcademySitemapPaths().map((entry) => ({
    url: buildUrl(entry),
    changeFrequency: 'monthly' as const,
    priority: entry.split('/').length <= 3 ? 0.8 : 0.6,
  }));

  return Array.from(
    new Map(
      [...staticEntries, ...academyEntries, ...blogEntries].map((entry) => [entry.url, entry]),
    ).values(),
  );
}
