import { Prisma } from '@prisma/client';
import type { PostArticleRecord, PostArticleRelatedPost } from '@/components/blog/PostArticleView';
import { getPublicPostWhere, isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { DEFAULT_BLOG_CATEGORY, normalizeBlogCategory, type BlogCategory } from '@/lib/blogCategories';
import { toBlogAuthorProfile } from '@/lib/server/blogAuthors';
import { postArticleSelect, toPostArticleRecord, type PostArticleQueryResult } from '@/lib/server/postArticleRecord';
import prisma from '@/lib/server/prisma';

const publicBlogIndexSelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  excerpt: true,
  content: true,
  readingTime: true,
  featuredImageUrl: true,
  coverImage: true,
  featured: true,
  featuredImage: {
    select: {
      url: true,
    },
  },
  published: true,
  publishedAt: true,
  scheduledFor: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect;

const publicBlogRelatedSelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  excerpt: true,
  content: true,
  focusKeyword: true,
  featuredImageUrl: true,
  coverImage: true,
  featuredImage: {
    select: {
      url: true,
    },
  },
  published: true,
  publishedAt: true,
  scheduledFor: true,
  createdAt: true,
} satisfies Prisma.PostSelect;

const publicBlogArticleSelect = {
  ...postArticleSelect,
  published: true,
} satisfies Prisma.PostSelect;

const legacyAuthorSelect = {
  id: true,
  email: true,
} satisfies Prisma.UserSelect;

const legacyPublicBlogListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  published: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect;

const legacyPublicBlogArticleSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: legacyAuthorSelect,
  },
} satisfies Prisma.PostSelect;

export type PublicBlogIndexRecord = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string | null;
  content: string;
  readingTime: number | null;
  featuredImageUrl: string | null;
  coverImage: string | null;
  featured: boolean;
  featuredImage: {
    url: string;
  } | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const FALLBACK_STATUS = 'PUBLISHED' as const;

const hasSchemaCompatibilityMessage = (message: string) => {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes('column') && normalized.includes('does not exist')) ||
    (normalized.includes('relation') && normalized.includes('does not exist')) ||
    (normalized.includes('table') && normalized.includes('does not exist'))
  );
};

export function isPublicBlogSchemaCompatibilityError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2021' || error.code === 'P2022';
  }

  if (error instanceof Error) {
    return hasSchemaCompatibilityMessage(error.message);
  }

  if (typeof error === 'string') {
    return hasSchemaCompatibilityMessage(error);
  }

  return false;
}

function toFallbackAuthor(author: { id: string; email: string }) {
  return toBlogAuthorProfile(
    {
      id: author.id,
      email: author.email,
      name: null,
      slug: null,
      bio: null,
      expertiseAreas: [],
      avatarUrl: null,
    },
    'Primary Author',
  );
}

function toLegacyIndexRecord(post: Prisma.PostGetPayload<{ select: typeof legacyPublicBlogListSelect }>): PublicBlogIndexRecord {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: DEFAULT_BLOG_CATEGORY,
    excerpt: post.excerpt,
    content: post.content,
    readingTime: null,
    featuredImageUrl: null,
    coverImage: null,
    featured: false,
    featuredImage: null,
    publishedAt: null,
    scheduledFor: null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function toLegacyArticleRecord(
  post: Prisma.PostGetPayload<{ select: typeof legacyPublicBlogArticleSelect }>,
): PostArticleRecord {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: DEFAULT_BLOG_CATEGORY,
    content: post.content,
    deck: null,
    excerpt: post.excerpt,
    focusKeyword: null,
    seoTitle: null,
    seoDescription: null,
    featuredImageUrl: null,
    coverImage: null,
    featuredImage: null,
    media: [],
    images: [],
    comments: [],
    affiliateBrands: [],
    status: FALLBACK_STATUS,
    publishedAt: null,
    scheduledFor: null,
    archivedAt: null,
    canonicalUrl: null,
    readingTime: null,
    shareTitle: null,
    shareDescription: null,
    authors: [toFallbackAuthor(post.author)],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function toLegacyRelatedRecord(
  post: Prisma.PostGetPayload<{ select: typeof legacyPublicBlogListSelect }>,
): PostArticleRelatedPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: DEFAULT_BLOG_CATEGORY,
    excerpt: post.excerpt,
    coverImage: null,
    publishedAt: null,
    scheduledFor: null,
    createdAt: post.createdAt,
  };
}

function tokenizeForSimilarity(...values: Array<string | null | undefined>) {
  return values
    .flatMap((value) =>
      (value ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 2),
    )
    .filter(Boolean);
}

function scoreRelatedPost(
  current: {
    category: string;
    title: string;
    excerpt?: string | null;
    focusKeyword?: string | null;
    content?: string | null;
  },
  candidate: {
    category: string;
    title: string;
    excerpt?: string | null;
    focusKeyword?: string | null;
    content?: string | null;
    publishedAt: Date | null;
    createdAt: Date;
  },
) {
  let score = 0;

  if (normalizeBlogCategory(current.category) === normalizeBlogCategory(candidate.category)) {
    score += 12;
  }

  if (current.focusKeyword && candidate.focusKeyword && current.focusKeyword.toLowerCase() === candidate.focusKeyword.toLowerCase()) {
    score += 10;
  }

  const currentTokens = new Set(tokenizeForSimilarity(current.title, current.excerpt, current.focusKeyword, current.content));
  const candidateTokens = new Set(
    tokenizeForSimilarity(candidate.title, candidate.excerpt, candidate.focusKeyword, candidate.content),
  );
  let overlapCount = 0;

  currentTokens.forEach((token) => {
    if (candidateTokens.has(token)) {
      overlapCount += 1;
    }
  });

  score += overlapCount * 3;

  const publishedTime = candidate.publishedAt?.getTime() ?? candidate.createdAt.getTime();
  score += publishedTime / 10_000_000_000_000;

  return score;
}

function warnLegacyPublicBlogFallback(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[publicBlog] Falling back to legacy blog read path for ${scope}: ${message}`);
}

// A transient "can't reach database" error (P1001 / PrismaClientInitializationError)
// shouldn't crash a static build or a page render — the blog index/preview just
// renders empty and refills on the next request once the DB is reachable again.
function isDatabaseUnreachableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = (error as { name?: string }).name ?? '';
  const code = (error as { errorCode?: string; code?: string }).errorCode ?? (error as { code?: string }).code ?? '';
  const message = error instanceof Error ? error.message : String(error);
  return (
    name === 'PrismaClientInitializationError' ||
    code === 'P1001' ||
    /can't reach database server|can not reach database server|connection refused|ECONNREFUSED|ETIMEDOUT/i.test(message)
  );
}

export async function getPublicBlogIndexPosts(now: Date = new Date()): Promise<PublicBlogIndexRecord[]> {
  try {
    const posts = await prisma.post.findMany({
      where: getPublicPostWhere(now),
      // Popularity order: most-viewed first, with recency as the tiebreaker.
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
      select: publicBlogIndexSelect,
    });

    return posts.map((post) => ({
      ...post,
      category: normalizeBlogCategory(post.category),
    }));
  } catch (error) {
    if (isDatabaseUnreachableError(error)) {
      console.warn('[publicBlog] blog index: database unreachable — returning empty list for this render');
      return [];
    }

    if (!isPublicBlogSchemaCompatibilityError(error)) {
      throw error;
    }

    warnLegacyPublicBlogFallback('blog index', error);

    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [{ createdAt: 'desc' }],
      select: legacyPublicBlogListSelect,
    });

    return posts.map(toLegacyIndexRecord);
  }
}

export async function getPublicBlogPostBySlug(
  slug: string,
  now: Date = new Date(),
): Promise<PostArticleRecord | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: publicBlogArticleSelect,
    });

    if (!post || !isPostPubliclyVisible(post.status, post.scheduledFor, now, post.published)) {
      return null;
    }

    const { published: _published, ...articlePayload } = post;
    return toPostArticleRecord(articlePayload as PostArticleQueryResult);
  } catch (error) {
    if (isDatabaseUnreachableError(error)) {
      console.warn(`[publicBlog] blog post "${slug}": database unreachable — treating as not found for this render`);
      return null;
    }

    if (!isPublicBlogSchemaCompatibilityError(error)) {
      throw error;
    }

    warnLegacyPublicBlogFallback(`blog post "${slug}"`, error);

    const post = await prisma.post.findUnique({
      where: { slug },
      select: legacyPublicBlogArticleSelect,
    });

    if (!post || !post.published) {
      return null;
    }

    return toLegacyArticleRecord(post);
  }
}

export async function getPublicRelatedBlogPosts(
  postId: string,
  take = 3,
  now: Date = new Date(),
): Promise<PostArticleRelatedPost[]> {
  try {
    const [currentPost, posts] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          category: true,
          excerpt: true,
          content: true,
          focusKeyword: true,
        },
      }),
      prisma.post.findMany({
        where: {
          ...getPublicPostWhere(now),
          NOT: {
            id: postId,
          },
        },
        orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
        select: publicBlogRelatedSelect,
      }),
    ]);

    const rankedPosts = currentPost
      ? [...posts].sort(
          (left, right) =>
            scoreRelatedPost(currentPost, right) - scoreRelatedPost(currentPost, left),
        )
      : posts;

    return rankedPosts.slice(0, take).map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: normalizeBlogCategory(post.category),
      excerpt: post.excerpt || null,
      coverImage: post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage,
      publishedAt: post.publishedAt,
      scheduledFor: post.scheduledFor,
      createdAt: post.createdAt,
    }));
  } catch (error) {
    if (!isPublicBlogSchemaCompatibilityError(error)) {
      throw error;
    }

    warnLegacyPublicBlogFallback('related posts', error);

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        NOT: {
          id: postId,
        },
      },
      take,
      orderBy: [{ createdAt: 'desc' }],
      select: legacyPublicBlogListSelect,
    });

    return posts.slice(0, take).map(toLegacyRelatedRecord);
  }
}

export async function getPublicBlogPostsByAuthorId(
  authorId: string,
  now: Date = new Date(),
): Promise<PublicBlogIndexRecord[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        ...getPublicPostWhere(now),
        OR: [{ authorId }, { authorships: { some: { userId: authorId } } }],
      },
      orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
      select: publicBlogIndexSelect,
    });

    return posts.map((post) => ({
      ...post,
      category: normalizeBlogCategory(post.category),
    }));
  } catch (error) {
    if (!isPublicBlogSchemaCompatibilityError(error)) {
      throw error;
    }

    warnLegacyPublicBlogFallback(`author posts for "${authorId}"`, error);

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        authorId,
      },
      orderBy: [{ createdAt: 'desc' }],
      select: legacyPublicBlogListSelect,
    });

    return posts.map(toLegacyIndexRecord);
  }
}
