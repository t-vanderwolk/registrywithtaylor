import type { Prisma } from '@prisma/client';
import type { PostArticleRecord } from '@/components/blog/PostArticleView';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import {
  affiliateBrandSelect,
  legacyPostAffiliateSelect,
  normalizePostAffiliateBrands,
} from '@/lib/server/affiliateBrands';
import { normalizePostAuthors } from '@/lib/server/blogAuthors';

export const postArticleSelect = {
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
  readingTime: true,
  shareTitle: true,
  shareDescription: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      email: true,
      name: true,
      slug: true,
      bio: true,
      expertiseAreas: true,
      avatarUrl: true,
    },
  },
  authorships: {
    select: {
      role: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          slug: true,
          bio: true,
          expertiseAreas: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  },
} satisfies Prisma.PostSelect;

export type PostArticleQueryResult = Prisma.PostGetPayload<{
  select: typeof postArticleSelect;
}>;

export function toPostArticleRecord(post: PostArticleQueryResult): PostArticleRecord {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: normalizeBlogCategory(post.category),
    content: post.content,
    deck: post.deck,
    excerpt: post.excerpt,
    focusKeyword: post.focusKeyword,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    featuredImageUrl: post.featuredImageUrl,
    coverImage: post.coverImage,
    featuredImage: post.featuredImage,
    media: post.media,
    images: post.images,
    affiliateBrands: normalizePostAffiliateBrands({
      affiliateBrands: post.affiliateBrands,
      legacyAffiliates: post.affiliates,
    }),
    status: post.status,
    publishedAt: post.publishedAt,
    scheduledFor: post.scheduledFor,
    archivedAt: post.archivedAt,
    canonicalUrl: post.canonicalUrl,
    readingTime: post.readingTime,
    shareTitle: post.shareTitle,
    shareDescription: post.shareDescription,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    authors: normalizePostAuthors({
      primaryAuthor: post.author,
      authorships: post.authorships,
    }),
  };
}
