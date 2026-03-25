import type { MetadataRoute } from 'next';
import { getAcademySitemapPaths } from '@/lib/academy/content';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogIndexPosts } from '@/lib/server/publicBlog';

const buildUrl = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: buildUrl('/') },
    { url: buildUrl('/services') },
    { url: buildUrl('/academy') },
    { url: buildUrl('/blog') },
  ];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = await getPublicBlogIndexPosts(new Date());

    blogEntries = posts.map((post) => ({
      url: buildUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to build blog sitemap entries.', error);
  }

  const academyEntries = getAcademySitemapPaths().map((entry) => ({
    url: buildUrl(entry),
  }));

  return Array.from(
    new Map(
      [...staticEntries, ...academyEntries, ...blogEntries].map((entry) => [entry.url, entry]),
    ).values(),
  );
}
