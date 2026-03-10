import type { Prisma } from '@prisma/client';
import { normalizeAuthorAssignments } from '@/lib/blog/authors';

export const postEditorSelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  stage: true,
  deck: true,
  excerpt: true,
  focusKeyword: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
  featuredImageUrl: true,
  coverImage: true,
  featuredImageId: true,
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
  content: true,
  status: true,
  publishedAt: true,
  scheduledFor: true,
  archivedAt: true,
  featured: true,
  published: true,
  authorId: true,
  readingTime: true,
  shareTitle: true,
  shareDescription: true,
  createdAt: true,
  updatedAt: true,
  affiliates: {
    select: {
      affiliateId: true,
    },
  },
  affiliateBrands: {
    select: {
      id: true,
    },
  },
  authorships: {
    select: {
      userId: true,
      role: true,
    },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  },
} satisfies Prisma.PostSelect;

export type PostEditorQueryResult = Prisma.PostGetPayload<{
  select: typeof postEditorSelect;
}>;

export function toPostEditorRecord(post: PostEditorQueryResult) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    stage: post.stage,
    deck: post.deck,
    excerpt: post.excerpt,
    focusKeyword: post.focusKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    readingTime: post.readingTime,
    shareTitle: post.shareTitle,
    shareDescription: post.shareDescription,
    featuredImageUrl: post.featuredImageUrl,
    coverImage: post.coverImage,
    featuredImageId: post.featuredImageId,
    featuredImage: post.featuredImage,
    content: post.content,
    mediaIds: post.media.map((entry) => entry.id),
    media: post.media,
    images: post.images,
    status: post.status,
    publishedAt: post.publishedAt,
    scheduledFor: post.scheduledFor,
    archivedAt: post.archivedAt,
    featured: post.featured,
    published: post.published,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    affiliateBrandIds: post.affiliateBrands.map((entry) => entry.id),
    authors: normalizeAuthorAssignments(post.authorships, post.authorId),
  };
}
