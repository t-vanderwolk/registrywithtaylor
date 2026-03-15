import type { MetadataRoute } from 'next';
import { getPublicPostWhere } from '@/lib/blog/postStatus';
import { getGuidePath } from '@/lib/guides/routing';
import { getPublicGuideWhere } from '@/lib/guides/status';
import { guidePillars } from '@/lib/marketing/siteContent';
import { SITE_URL } from '@/lib/marketing/metadata';
import prisma from '@/lib/server/prisma';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';

const buildUrl = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: buildUrl('/') },
    { url: buildUrl('/services') },
    { url: buildUrl('/guides') },
    { url: buildUrl('/blog') },
  ];

  let guideEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const guides = await prisma.guide.findMany({
      where: getPublicGuideWhere(now),
      orderBy: [{ updatedAt: 'desc' }, { publishedAt: 'desc' }],
      select: {
        slug: true,
        topicCluster: true,
        updatedAt: true,
      },
    });

    guideEntries = guides.map((guide) => ({
      url: buildUrl(getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster })),
      lastModified: guide.updatedAt,
    }));
  } catch (error) {
    if (!isGuideStorageUnavailableError(error)) {
      console.error('Failed to build guide sitemap entries.', error);
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where: getPublicPostWhere(now),
      orderBy: [{ updatedAt: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    blogEntries = posts.map((post) => ({
      url: buildUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to build blog sitemap entries.', error);
  }

  const pillarEntries = guidePillars.map((pillar) => ({
    url: buildUrl(`/guides/${pillar.slug}`),
  }));

  return Array.from(
    new Map(
      [...staticEntries, ...pillarEntries, ...guideEntries, ...blogEntries].map((entry) => [entry.url, entry]),
    ).values(),
  );
}
