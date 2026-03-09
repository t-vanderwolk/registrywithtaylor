import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import SiteShell from '@/components/SiteShell';
import PostArticleView, {
  extractDownloadableResource,
  toExcerpt,
  type PostArticleRecord,
} from '@/components/blog/PostArticleView';
import FinalCTA from '@/components/layout/FinalCTA';
import { getPostDisplayDate, getPublicPostWhere, isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { SITE_URL } from '@/lib/marketing/metadata';
import {
  affiliateBrandSelect,
  legacyPostAffiliateSelect,
  normalizePostAffiliateBrands,
} from '@/lib/server/affiliateBrands';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type BlogPostParams = {
  params: Promise<{ slug: string }>;
};

const AUTHOR_NAME = 'Taylor Vanderwolk';

const getBlogPost = cache(async (slug: string) =>
  prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      content: true,
      deck: true,
      excerpt: true,
      featuredImageUrl: true,
      coverImage: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      media: {
        select: {
          id: true,
          url: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
      affiliateBrands: {
        select: affiliateBrandSelect,
      },
      affiliates: {
        where: {
          affiliate: {
            isActive: true,
          },
        },
        select: legacyPostAffiliateSelect,
      },
      status: true,
      publishedAt: true,
      scheduledFor: true,
      archivedAt: true,
      focusKeyword: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  }));

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, SITE_URL).toString();
};

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !isPostPubliclyVisible(post.status, post.scheduledFor)) {
    return {};
  }

  const { content: articleContent } = extractDownloadableResource(post.content);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl;
  const description = post.seoDescription?.trim() || toExcerpt(post.excerpt, articleContent, 160);
  const displayDate = getPostDisplayDate(post);
  const metadataTitle = post.seoTitle?.trim() || `${post.title} | Taylor-Made Baby Co.`;
  const canonical = post.canonicalUrl?.trim() || `/blog/${post.slug}`;
  const keywords = [
    post.focusKeyword,
    post.category,
    'Taylor-Made Baby Co.',
    'baby registry planning',
    'nursery planning',
    'baby gear guidance',
  ].filter((value, index, collection): value is string => Boolean(value) && collection.indexOf(value) === index);

  return {
    title: metadataTitle,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.seoTitle?.trim() || post.title,
      description,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: displayDate.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [AUTHOR_NAME],
      tags: keywords,
      images: featuredImageUrl
        ? [
            {
              url: toAbsoluteUrl(featuredImageUrl),
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: featuredImageUrl ? 'summary_large_image' : 'summary',
      title: post.seoTitle?.trim() || post.title,
      description,
      images: featuredImageUrl ? [toAbsoluteUrl(featuredImageUrl)] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !isPostPubliclyVisible(post.status, post.scheduledFor)) {
    notFound();
  }

  const articlePost = {
    ...post,
    affiliateBrands: normalizePostAffiliateBrands({
      affiliateBrands: post.affiliateBrands,
      legacyAffiliates: post.affiliates,
    }),
  } as PostArticleRecord;

  const relatedPosts = await prisma.post.findMany({
    where: {
      ...getPublicPostWhere(),
      NOT: {
        id: post.id,
      },
    },
    orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      featuredImageUrl: true,
      coverImage: true,
      featuredImage: {
        select: {
          url: true,
        },
      },
      publishedAt: true,
      scheduledFor: true,
      createdAt: true,
    },
  });

  const { content: articleContent } = extractDownloadableResource(post.content);
  const featuredImageUrl = articlePost.featuredImage?.url ?? articlePost.coverImage ?? articlePost.featuredImageUrl;
  const headerExcerpt = toExcerpt(post.excerpt, articleContent, 180);
  const displayDate = getPostDisplayDate(post);
  const seoKeywords = [
    post.focusKeyword,
    post.category,
    'Taylor-Made Baby Co.',
    'baby registry planning',
    'nursery planning',
    'baby gear guidance',
  ].filter((value, index, collection): value is string => Boolean(value) && collection.indexOf(value) === index);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle?.trim() || post.title,
    description: post.seoDescription?.trim() || headerExcerpt,
    articleSection: post.category,
    keywords: seoKeywords,
    datePublished: displayDate.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: post.canonicalUrl?.trim() || `${SITE_URL}/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Taylor-Made Baby Co.',
      url: SITE_URL,
    },
    image: featuredImageUrl ? [toAbsoluteUrl(featuredImageUrl)] : undefined,
    inLanguage: 'en-US',
  };

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

      <PostArticleView
        post={articlePost}
        relatedPosts={relatedPosts.map((relatedPost) => ({
          id: relatedPost.id,
          title: relatedPost.title,
            slug: relatedPost.slug,
            category: normalizeBlogCategory(relatedPost.category),
            coverImage: relatedPost.featuredImage?.url ?? relatedPost.featuredImageUrl ?? relatedPost.coverImage,
            publishedAt: relatedPost.publishedAt,
            scheduledFor: relatedPost.scheduledFor,
            createdAt: relatedPost.createdAt,
          }))}
        />
        <FinalCTA />
      </main>
    </SiteShell>
  );
}
