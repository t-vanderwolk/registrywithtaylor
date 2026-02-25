import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import PostContent from '@/components/blog/PostContent';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type BlogPostParams = {
  params: Promise<{ slug: string }>;
};

type MaybeTagged = {
  tags?: string[] | null;
};

type BlogPostRecord = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
};

const isMissingCoverImageColumnError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError
  && error.code === 'P2022'
  && error.message.includes('Post.coverImage');

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

const getPrimaryTag = (post: MaybeTagged): string | null => {
  if (!Array.isArray(post.tags) || post.tags.length === 0) {
    return null;
  }
  return post.tags[0] || null;
};

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;

  let post: BlogPostRecord | null = null;

  try {
    post = await prisma.post.findFirst({
      where: {
        slug,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (!isMissingCoverImageColumnError(error)) {
      throw error;
    }

    const fallbackPost = await prisma.post.findFirst({
      where: {
        slug,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        createdAt: true,
      },
    });

    post = fallbackPost
      ? {
          ...fallbackPost,
          coverImage: null,
        }
      : null;
  }

  if (!post) {
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
      createdAt: true,
    },
  });

  const headerExcerpt = toExcerpt(post.excerpt, post.content, 180);
  const primaryTag = getPrimaryTag(post as MaybeTagged);

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main">
        <MarketingSection tone="white" spacing="spacious" container="default">
          <article className="max-w-3xl mx-auto">
            <header className="space-y-6">
              {primaryTag && (
                <p className="inline-flex rounded-full border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-600">
                  {primaryTag}
                </p>
              )}
              <p className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                By Taylor Vanderwolk · {formatDate(post.createdAt)}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-neutral-900 leading-tight">
                {post.title}
              </h1>
              {headerExcerpt && (
                <p className="text-lg text-neutral-700 leading-relaxed">
                  {headerExcerpt}
                </p>
              )}
            </header>

            <div className="mt-10 border-t border-neutral-200" />

            {post.coverImage ? (
              <div className="mt-10 overflow-hidden rounded-[28px] border border-neutral-200/70">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden
                className="mt-10 w-full aspect-[16/10] rounded-[28px] border border-neutral-200/70 bg-[linear-gradient(135deg,#f8f4f0_0%,#f1e7dc_52%,#fbf8f4_100%)]"
              />
            )}

            <div className="mt-12 max-w-3xl mx-auto">
              <PostContent postId={post.id} content={post.content} />
            </div>
          </article>
        </MarketingSection>

        {relatedPosts.length > 0 && (
          <MarketingSection tone="ivory" spacing="spacious" container="narrow">
            <div className="space-y-8">
              <h2 className="font-serif text-3xl tracking-tight text-neutral-900 text-center">
                Next Reads
              </h2>
              <div className="border-t border-neutral-200">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="border-b border-neutral-200 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl tracking-tight text-neutral-900">
                          <Link href={`/blog/${relatedPost.slug}`} className="hover:opacity-80 transition">
                            {relatedPost.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {formatDate(relatedPost.createdAt)}
                        </p>
                      </div>
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="text-xs uppercase tracking-[0.14em] text-neutral-800 hover:opacity-75 transition"
                      >
                        Read -&gt;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </MarketingSection>
        )}

        <MarketingSection tone="ivoryWarm" spacing="spacious" container="narrow">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-neutral-900">
              Want a plan that fits your real life?
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto">
              Get thoughtful guidance for registry, nursery, and gear decisions so preparation feels calm and tailored.
            </p>
            <div>
              <Link href="/services" className="btn btn--secondary">
                Explore Services -&gt;
              </Link>
            </div>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
