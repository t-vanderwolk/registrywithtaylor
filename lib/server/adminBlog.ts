import type { Prisma } from '@prisma/client';
import prisma from '@/lib/server/prisma';
import { BLOG_CATEGORIES } from '@/lib/blogCategories';
import { normalizePostStatus, type PostStatusValue } from '@/lib/blog/postStatus';
import { normalizeBlogStage, type BlogStageValue } from '@/lib/blog/postStage';

export const ADMIN_BLOG_PAGE_SIZE = 25;

export type AdminBlogSort = 'updated' | 'publishedAt' | 'title';
export type AdminBlogFeaturedFilter = 'all' | 'featured' | 'standard';

export type AdminBlogListParams = {
  search: string;
  status: 'all' | PostStatusValue;
  stage: 'all' | BlogStageValue;
  category: 'all' | string;
  featured: AdminBlogFeaturedFilter;
  sort: AdminBlogSort;
  page: number;
  pageSize: number;
};

export type AdminBlogListItem = {
  id: string;
  title: string;
  slug: string;
  status: PostStatusValue;
  stage: BlogStageValue;
  category: string;
  focusKeyword: string | null;
  excerpt: string | null;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
  scheduledFor: string | null;
  featured: boolean;
  authorLabel: string;
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

const asSingle = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function parsePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseSort(value: string | undefined): AdminBlogSort {
  if (value === 'publishedAt' || value === 'title') {
    return value;
  }

  return 'updated';
}

function parseFeatured(value: string | undefined): AdminBlogFeaturedFilter {
  if (value === 'featured' || value === 'standard') {
    return value;
  }

  return 'all';
}

function parseCategory(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized === 'all') {
    return 'all';
  }

  return normalized;
}

function parseStage(value: string | undefined) {
  if (!value || value === 'all') {
    return 'all' as const;
  }

  return normalizeBlogStage(value, 'DRAFT');
}

function parseStatus(value: string | undefined) {
  if (!value || value === 'all') {
    return 'all' as const;
  }

  return normalizePostStatus(value, 'DRAFT');
}

export function parseAdminBlogListParams(searchParams?: SearchParamsRecord): AdminBlogListParams {
  return {
    search: asSingle(searchParams?.search)?.trim() ?? '',
    status: parseStatus(asSingle(searchParams?.status)),
    stage: parseStage(asSingle(searchParams?.stage)),
    category: parseCategory(asSingle(searchParams?.category)),
    featured: parseFeatured(asSingle(searchParams?.featured)),
    sort: parseSort(asSingle(searchParams?.sort)),
    page: parsePage(asSingle(searchParams?.page)),
    pageSize: ADMIN_BLOG_PAGE_SIZE,
  };
}

function buildWhere(params: AdminBlogListParams): Prisma.PostWhereInput {
  const where: Prisma.PostWhereInput = {};
  const and: Prisma.PostWhereInput[] = [];

  if (params.search) {
    and.push({
      OR: [
        { title: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { deck: { contains: params.search, mode: 'insensitive' } },
        { focusKeyword: { contains: params.search, mode: 'insensitive' } },
      ],
    });
  }

  if (params.status !== 'all') {
    and.push({ status: params.status });
  }

  if (params.stage !== 'all') {
    and.push({ stage: params.stage });
  }

  if (params.category !== 'all') {
    and.push({ category: params.category });
  }

  if (params.featured === 'featured') {
    and.push({ featured: true });
  }

  if (params.featured === 'standard') {
    and.push({ featured: false });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

function buildOrderBy(sort: AdminBlogSort): Prisma.PostOrderByWithRelationInput[] {
  if (sort === 'title') {
    return [{ title: 'asc' }, { updatedAt: 'desc' }];
  }

  if (sort === 'publishedAt') {
    return [{ publishedAt: 'desc' }, { updatedAt: 'desc' }];
  }

  return [{ updatedAt: 'desc' }];
}

function getCategoryGroupCount(entry: { _count?: true | { _all?: number } }) {
  if (entry._count && typeof entry._count === 'object' && '_all' in entry._count) {
    return entry._count._all ?? 0;
  }

  return 0;
}

export async function listAdminPosts(params: AdminBlogListParams) {
  const where = buildWhere(params);
  const skip = (params.page - 1) * params.pageSize;

  const [posts, totalCount, totalPosts, draftCount, readyCount, publishedCount, categoryGroups] =
    await prisma.$transaction([
      prisma.post.findMany({
        where,
        orderBy: buildOrderBy(params.sort),
        skip,
        take: params.pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          stage: true,
          category: true,
          focusKeyword: true,
          excerpt: true,
          updatedAt: true,
          publishedAt: true,
          archivedAt: true,
          scheduledFor: true,
          featured: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
      prisma.post.count(),
      prisma.post.count({
        where: {
          stage: {
            in: ['IDEA', 'OUTLINE', 'DRAFT'],
          },
        },
      }),
      prisma.post.count({
        where: {
          stage: 'READY',
        },
      }),
      prisma.post.count({
        where: {
          status: 'PUBLISHED',
        },
      }),
      prisma.post.groupBy({
        by: ['category'],
        _count: {
          _all: true,
        },
        orderBy: {
          category: 'asc',
        },
      }),
    ]);

  return {
    posts: posts.map(
      (post) =>
        ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post.status,
          stage: post.stage,
          category: post.category,
          focusKeyword: post.focusKeyword,
          excerpt: post.excerpt,
          updatedAt: post.updatedAt.toISOString(),
          publishedAt: post.publishedAt?.toISOString() ?? null,
          archivedAt: post.archivedAt?.toISOString() ?? null,
          scheduledFor: post.scheduledFor?.toISOString() ?? null,
          featured: post.featured,
          authorLabel: post.author.name?.trim() || post.author.email,
        }) satisfies AdminBlogListItem,
    ),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / params.pageSize)),
    },
    kpis: {
      totalPosts,
      draftCount,
      readyCount,
      publishedCount,
    },
    categoryOptions: Array.from(
      new Set([
        ...BLOG_CATEGORIES,
        ...categoryGroups.map((entry) => entry.category).filter((entry): entry is string => Boolean(entry)),
      ]),
    ),
    categoryCounts: categoryGroups.map((entry) => ({
      category: entry.category,
      count: getCategoryGroupCount(entry),
    })),
  };
}

export async function listPlannerPosts() {
  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      stage: true,
      category: true,
      focusKeyword: true,
      updatedAt: true,
      publishedAt: true,
      scheduledFor: true,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    stage: post.stage,
    category: post.category,
    focusKeyword: post.focusKeyword,
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
    scheduledFor: post.scheduledFor?.toISOString() ?? null,
  }));
}
