import type { AffiliateNetwork } from '@prisma/client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import SiteShell from '@/components/SiteShell';
import JournalCard from '@/components/blog/JournalCard';
import PostContent from '@/components/blog/PostContent';
import FinalCTA from '@/components/layout/FinalCTA';
import { Body, H1, H2, H3 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { type BlogCategory } from '@/lib/blogCategories';
import { SITE_URL } from '@/lib/marketing/metadata';
import { formatFileSize, isPdfMediaType } from '@/lib/media';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type BlogPostParams = {
  params: Promise<{ slug: string }>;
};

type DownloadableResource = {
  title: string;
  href: string;
  description: string | null;
  fileSize: string | null;
};

type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  featuredImage: {
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  } | null;
  media: Array<{
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }>;
  published: boolean;
  affiliates: Array<{
    affiliate: {
      id: string;
      name: string;
      network: AffiliateNetwork;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
};

type ExtractedResourceResult = {
  content: string;
  resource: DownloadableResource | null;
};

const AUTHOR_NAME = 'Taylor Vanderwolk';
const orderedListPattern = /^\d+\.\s+/;
const markdownPdfLinePattern =
  /^\s*(?:Resource\s*:\s*|Download(?:\s+PDF)?\s*:\s*)?\[([^\]]+)\]\(([^)\s]+\.pdf(?:\?[^)]*)?)\)(?:\s*(?:[-|·]\s*(.+))?)?\s*$/i;
const plainPdfLinePattern =
  /^\s*(?:Resource\s*:\s*|Download(?:\s+PDF)?\s*:\s*)?(https?:\/\/\S+\.pdf(?:\?\S+)?|\/\S+\.pdf(?:\?\S+)?)(?:\s*(?:[-|·]\s*(.+))?)?\s*$/i;
const fileSizePattern = /\b\d+(?:\.\d+)?\s?(?:KB|MB|GB)\b/i;

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toExcerpt = (excerpt: string | null, content: string, maxLength = 160) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const clean = stripMarkdown(content);
  if (!clean) {
    return '';
  }

  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

const toTitleCase = (value: string) =>
  value.replace(/\b\w/g, (character) => character.toUpperCase());

const titleFromHref = (href: string) => {
  const normalizedHref = href.split('?')[0] ?? href;
  const lastSegment = normalizedHref.split('/').filter(Boolean).pop() ?? 'downloadable-pdf';

  return toTitleCase(lastSegment.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '));
};

const isBodyTextLine = (line: string) => {
  const trimmed = line.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith('- ') &&
    !orderedListPattern.test(trimmed)
  );
};

const extractDownloadableResource = (content: string): ExtractedResourceResult => {
  const lines = content.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? '';
    if (!line) {
      continue;
    }

    const markdownMatch = line.match(markdownPdfLinePattern);
    const plainMatch = line.match(plainPdfLinePattern);

    if (!markdownMatch && !plainMatch) {
      continue;
    }

    const href = markdownMatch?.[2] ?? plainMatch?.[1];
    if (!href) {
      continue;
    }

    const title = (markdownMatch?.[1] ?? titleFromHref(href)).trim();
    const trailingCopy = (markdownMatch?.[3] ?? plainMatch?.[2] ?? '').trim();
    const fileSize = trailingCopy.match(fileSizePattern)?.[0] ?? null;
    const trailingDescription = trailingCopy
      .replace(fileSizePattern, '')
      .replace(/^[\s|·-]+|[\s|·-]+$/g, '')
      .trim();

    let description = trailingDescription || null;
    let descriptionIndex: number | null = null;

    if (!description) {
      for (let lookahead = index + 1; lookahead < lines.length; lookahead += 1) {
        const candidate = lines[lookahead]?.trim() ?? '';

        if (!candidate) {
          continue;
        }

        if (isBodyTextLine(candidate)) {
          description = candidate;
          descriptionIndex = lookahead;
        }
        break;
      }
    }

    const cleanedContent = lines
      .filter((_, candidateIndex) => candidateIndex !== index && candidateIndex !== descriptionIndex)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      content: cleanedContent,
      resource: {
        title,
        href,
        description: description ?? 'A concise PDF companion to this article.',
        fileSize,
      },
    };
  }

  return {
    content,
    resource: null,
  };
};

const getBlogPost = cache(async (slug: string) =>
  (await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      content: true,
      excerpt: true,
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
      published: true,
      affiliates: {
        where: {
          affiliate: {
            isActive: true,
          },
        },
        select: {
          affiliate: {
            select: {
              id: true,
              name: true,
              network: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  })) as BlogPostRecord | null);

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, SITE_URL).toString();
};

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !post.published) {
    return {};
  }

  const { content: articleContent } = extractDownloadableResource(post.content);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage;
  const description = toExcerpt(post.excerpt, articleContent, 160);
  const keywords = [
    post.category,
    'Taylor-Made Baby Co.',
    'baby registry planning',
    'nursery planning',
    'baby gear guidance',
  ];

  return {
    title: `${post.title} | Taylor-Made Baby Co.`,
    description,
    keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.createdAt.toISOString(),
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
      title: post.title,
      description,
      images: featuredImageUrl ? [toAbsoluteUrl(featuredImageUrl)] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;

  const post = await getBlogPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      NOT: {
        id: post.id,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      createdAt: true,
    },
  });

  const { content: articleContent, resource } = extractDownloadableResource(post.content);
  const featuredImageUrl = post.featuredImage?.url ?? post.coverImage;
  const attachedPdfResources = post.media.filter((media) => isPdfMediaType(media.fileType));
  const headerExcerpt = toExcerpt(post.excerpt, articleContent, 180);
  const isAffiliate = post.affiliates.length > 0;
  const seoKeywords = [
    post.category,
    'Taylor-Made Baby Co.',
    'baby registry planning',
    'nursery planning',
    'baby gear guidance',
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: headerExcerpt,
    articleSection: post.category,
    keywords: seoKeywords,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
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
        <section className="section-base bg-white">
          <article className="max-w-3xl mx-auto px-6">
            {featuredImageUrl && (
              <RevealOnScroll>
                <div className="mb-12 overflow-hidden rounded-2xl">
                  <img
                    src={featuredImageUrl}
                    alt={post.title}
                    className="aspect-[16/9] w-full rounded-2xl object-cover shadow-sm"
                  />
                </div>
              </RevealOnScroll>
            )}

            <RevealOnScroll>
              <header className="space-y-8">
                <div className="space-y-5">
                  <H1 className="font-serif leading-[1.05] text-neutral-900">
                    {post.title}
                  </H1>
                  <span className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">
                    {post.category}
                  </span>
                  {headerExcerpt && (
                    <Body className="max-w-[40ch] text-charcoal/80">
                      {headerExcerpt}
                    </Body>
                  )}
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-charcoal/60">
                    <span className="font-medium text-charcoal/75">{AUTHOR_NAME}</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                    <time dateTime={post.createdAt.toISOString()}>
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                  <div className="h-px w-20 bg-black/10" aria-hidden="true" />
                </div>
              </header>
            </RevealOnScroll>

            {isAffiliate && (
              <RevealOnScroll delayMs={90}>
                <MarketingSurface className="mt-10 bg-[#F7F4EF] p-6 text-sm leading-relaxed text-charcoal/70 md:p-6">
                  This article includes affiliate relationships with select brand partners chosen for relevance to the
                  topic. Recommendations remain editorial, and Taylor-Made Baby Co. may earn a commission if you
                  decide to purchase through linked partners.
                </MarketingSurface>
              </RevealOnScroll>
            )}

            <RevealOnScroll delayMs={170}>
              <div className="mt-14">
                <PostContent
                  postId={post.id}
                  content={articleContent}
                  className="mx-auto max-w-[72ch]"
                />
              </div>
            </RevealOnScroll>

            {attachedPdfResources.length > 0 ? (
              <RevealOnScroll delayMs={210}>
                <div className="mt-16 space-y-4">
                  {attachedPdfResources.map((media) => (
                    <MarketingSurface
                      key={media.id}
                      className="bg-[#F7F4EF]"
                    >
                      <H3 className="tracking-tight text-neutral-900">Downloadable Resource</H3>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{media.fileName}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-charcoal/55">
                        PDF · {formatFileSize(media.fileSize)}
                      </p>
                      <a
                        href={media.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline mt-4 inline-block text-sm"
                      >
                        Download PDF →
                      </a>
                    </MarketingSurface>
                  ))}
                </div>
              </RevealOnScroll>
            ) : resource ? (
              <RevealOnScroll delayMs={210}>
                <MarketingSurface className="mt-16">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-charcoal/60">
                      Resource
                    </p>
                    <H2 className="font-serif text-neutral-900">
                      {resource.title}
                    </H2>
                    {resource.description && (
                      <Body className="text-charcoal/70">
                        {resource.description}
                      </Body>
                    )}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center uppercase tracking-[0.14em] text-neutral-800 transition-colors duration-200 hover:text-neutral-900"
                      >
                        <span className="link-underline">Download PDF</span>
                        <span aria-hidden className="ml-1">→</span>
                      </a>
                      {resource.fileSize && (
                        <span className="text-charcoal/55">{resource.fileSize}</span>
                      )}
                    </div>
                  </div>
                </MarketingSurface>
              </RevealOnScroll>
            ) : null}

            {post.affiliates.length > 0 && (
              <RevealOnScroll delayMs={250}>
                <div className="mt-16 border-t border-black/5 pt-10">
                  <div className="space-y-4">
                    <H2 className="font-serif text-neutral-900">
                      Referenced Brand Partners
                    </H2>
                    <Body className="text-charcoal/68">
                      Mentioned for context and planning relevance within this article.
                    </Body>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {post.affiliates.map(({ affiliate }) => (
                      <span
                        key={affiliate.id}
                        className="inline-flex rounded-full border border-black/5 bg-[#F7F4EF] px-4 py-2 text-sm text-charcoal/75"
                      >
                        {affiliate.name}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            )}
          </article>
        </section>

        {relatedPosts.length > 0 && (
          <section className="section-base border-t border-black/5 bg-[#FBF8F4]">
            <div className="max-w-5xl mx-auto px-6">
              <RevealOnScroll>
                <div className="mx-auto max-w-2xl space-y-4 text-center">
                  <span className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">
                    Continue Reading
                  </span>
                  <H2 className="font-serif text-neutral-900">
                    More from the Journal
                  </H2>
                </div>
              </RevealOnScroll>

              <div className="mt-12 grid gap-10 md:grid-cols-3">
                {relatedPosts.map((relatedPost, index) => (
                  <RevealOnScroll key={relatedPost.id} delayMs={index * 80}>
                    <JournalCard
                      title={relatedPost.title}
                      slug={relatedPost.slug}
                      category={relatedPost.category}
                      dateLabel={formatDate(relatedPost.createdAt)}
                      dateTime={relatedPost.createdAt.toISOString()}
                    />
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
