import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import SiteShell from '@/components/SiteShell';
import PostArticleView, {
  extractDownloadableResource,
} from '@/components/blog/PostArticleView';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import { extractFaqEntries } from '@/lib/blog/contentText';
import { buildBlogSeoSnapshot } from '@/lib/blog/seo';
import { getPostDisplayDate } from '@/lib/blog/postStatus';
import { SITE_LOGO_URL, SITE_NAME, SITE_URL } from '@/lib/marketing/metadata';
import { getPublicBlogPostBySlug, getPublicRelatedBlogPosts } from '@/lib/server/publicBlog';

export const revalidate = 3600;

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
  const seoSnapshot = buildBlogSeoSnapshot({
    title: post.title,
    slug: post.slug,
    category: post.category,
    content: articleContent,
    excerpt: post.excerpt,
    deck: post.deck,
    focusKeyword: post.focusKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    shareTitle: post.shareTitle,
    shareDescription: post.shareDescription,
    canonicalUrl: post.canonicalUrl,
    readingTime: post.readingTime,
  });
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl;
  const displayDate = getPostDisplayDate(post);
  const imageUrl = featuredImageUrl ? toAbsoluteUrl(featuredImageUrl) : undefined;

  return {
    title: seoSnapshot.shareTitle,
    description: seoSnapshot.shareDescription,
    keywords: seoSnapshot.keywords,
    category: post.category,
    authors: post.authors.map((author) => ({ name: author.name })),
    creator: post.authors[0]?.name || SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: seoSnapshot.canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title: seoSnapshot.shareTitle,
      description: seoSnapshot.shareDescription,
      type: 'article',
      url: seoSnapshot.canonicalUrl,
      siteName: SITE_NAME,
      publishedTime: displayDate.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.authors.map((author) => author.name),
      tags: seoSnapshot.keywords,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: seoSnapshot.shareTitle,
      description: seoSnapshot.shareDescription,
      images: imageUrl ? [imageUrl] : undefined,
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
  const seoSnapshot = buildBlogSeoSnapshot({
    title: post.title,
    slug: post.slug,
    category: post.category,
    content: articleContent,
    excerpt: post.excerpt,
    deck: post.deck,
    focusKeyword: post.focusKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    shareTitle: post.shareTitle,
    shareDescription: post.shareDescription,
    canonicalUrl: post.canonicalUrl,
    readingTime: post.readingTime,
  });
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage ?? post.featuredImageUrl;
  const displayDate = getPostDisplayDate(post);
  const faqEntries = extractFaqEntries(articleContent);
  const canonicalUrl = seoSnapshot.canonicalUrl;
  const authorSchemas = post.authors.map((author) => ({
    '@type': 'Person',
    '@id': `${canonicalUrl}#author-${author.id}`,
    name: author.name,
    description: author.bio ?? undefined,
    knowsAbout: author.expertiseAreas.length > 0 ? author.expertiseAreas : undefined,
  }));
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#blog-post`,
        headline: seoSnapshot.shareTitle,
        description: seoSnapshot.shareDescription,
        articleSection: post.category,
        keywords: seoSnapshot.keywords,
        datePublished: displayDate.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        dateCreated: post.createdAt.toISOString(),
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        author: authorSchemas.map((author) => ({ '@id': author['@id'] })),
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: SITE_LOGO_URL,
            width: 1024,
            height: 1024,
          },
        },
        image: featuredImageUrl ? [toAbsoluteUrl(featuredImageUrl)] : undefined,
        inLanguage: 'en-US',
        wordCount: seoSnapshot.wordCount,
        timeRequired: `PT${seoSnapshot.readingTime}M`,
        isAccessibleForFree: true,
        about: seoSnapshot.keywords.map((keyword) => ({
          '@type': 'Thing',
          name: keyword,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Baby Gear Journal',
            item: `${SITE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: canonicalUrl,
          },
        ],
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
        <PostArticleView
          post={post}
          relatedPosts={relatedPosts}
          newsletterCapture={<NewsletterCapture />}
        />
      </main>
    </SiteShell>
  );
}
