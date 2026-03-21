import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import SiteShell from '@/components/SiteShell';
import PostArticleView, {
  extractDownloadableResource,
  toExcerpt,
} from '@/components/blog/PostArticleView';
import FinalCTA from '@/components/layout/FinalCTA';
import { extractFaqEntries } from '@/lib/blog/contentText';
import { getPostDisplayDate } from '@/lib/blog/postStatus';
import { SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogPostBySlug, getPublicRelatedBlogPosts } from '@/lib/server/publicBlog';

export const dynamic = 'force-dynamic';

type BlogPostParams = {
  params: Promise<{ slug: string }>;
};

const getBlogPost = cache(async (slug: string) => getPublicBlogPostBySlug(slug));

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, SITE_URL).toString();
};

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {};
  }

  const { content: articleContent } = extractDownloadableResource(post.content);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl;
  const description =
    post.shareDescription?.trim() || post.seoDescription?.trim() || toExcerpt(post.excerpt, articleContent, 160);
  const displayDate = getPostDisplayDate(post);
  const metadataTitle = post.shareTitle?.trim() || post.seoTitle?.trim() || `${post.title} | Taylor-Made Baby Co.`;
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
      authors: post.authors.map((author) => author.name),
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
      title: post.shareTitle?.trim() || post.seoTitle?.trim() || post.title,
      description,
      images: featuredImageUrl ? [toAbsoluteUrl(featuredImageUrl)] : undefined,
    },
    other: {
      'pinterest-rich-pin': 'true',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getPublicRelatedBlogPosts(post.id);
  const { content: articleContent } = extractDownloadableResource(post.content);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl;
  const headerExcerpt = toExcerpt(post.excerpt, articleContent, 180);
  const displayDate = getPostDisplayDate(post);
  const faqEntries = extractFaqEntries(articleContent);
  const canonicalUrl = post.canonicalUrl?.trim() ? toAbsoluteUrl(post.canonicalUrl) : `${SITE_URL}/blog/${post.slug}`;
  const seoKeywords = [
    post.focusKeyword,
    post.category,
    'Taylor-Made Baby Co.',
    'baby registry planning',
    'nursery planning',
    'baby gear guidance',
  ].filter((value, index, collection): value is string => Boolean(value) && collection.indexOf(value) === index);
  const authorSchemas = post.authors.map((author) => ({
    '@type': 'Person',
    '@id': author.slug ? `${SITE_URL}/blog/author/${author.slug}` : `${canonicalUrl}#author-${author.id}`,
    name: author.name,
    description: author.bio ?? undefined,
    url: author.slug ? `${SITE_URL}/blog/author/${author.slug}` : undefined,
    knowsAbout: author.expertiseAreas.length > 0 ? author.expertiseAreas : undefined,
  }));
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.shareTitle?.trim() || post.seoTitle?.trim() || post.title,
        description: post.shareDescription?.trim() || post.seoDescription?.trim() || headerExcerpt,
        articleSection: post.category,
        keywords: seoKeywords,
        datePublished: displayDate.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        mainEntityOfPage: canonicalUrl,
        author: authorSchemas.map((author) => ({ '@id': author['@id'] })),
        publisher: {
          '@type': 'Organization',
          name: 'Taylor-Made Baby Co.',
          url: SITE_URL,
        },
        image: featuredImageUrl ? [toAbsoluteUrl(featuredImageUrl)] : undefined,
        inLanguage: 'en-US',
      },
      ...authorSchemas,
      ...(faqEntries.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faqEntries.map((entry) => ({
                '@type': 'Question',
                name: entry.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: entry.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PostArticleView post={post} relatedPosts={relatedPosts} />
        <FinalCTA />
      </main>
    </SiteShell>
  );
}
