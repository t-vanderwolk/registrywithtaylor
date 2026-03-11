import type { Prisma } from '@prisma/client';
import prisma from '@/lib/server/prisma';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import { getGuideAnalyticsCountsByGuide } from '@/lib/server/guideAnalytics';
import { normalizeGuideStatus, type GuideStatusValue } from '@/lib/guides/status';
import { GUIDE_STORAGE_UNAVAILABLE_MESSAGE, isGuideStorageUnavailableError } from '@/lib/server/guideStorage';

export const ADMIN_GUIDE_PAGE_SIZE = 25;

export type AdminGuideSort = 'updated' | 'publishedAt' | 'performance' | 'title';

export type AdminGuideListParams = {
  search: string;
  status: 'all' | GuideStatusValue;
  category: 'all' | string;
  sort: AdminGuideSort;
  page: number;
  pageSize: number;
};

export type AdminGuideListItem = {
  id: string;
  title: string;
  slug: string;
  status: GuideStatusValue;
  category: string;
  topicCluster: string | null;
  targetKeyword: string | null;
  excerpt: string | null;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
  scheduledFor: string | null;
  authorLabel: string;
  performance: {
    views: number;
    consultationClicks: number;
    affiliateClicks: number;
  };
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

const asSingle = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function parsePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseSort(value: string | undefined): AdminGuideSort {
  if (value === 'publishedAt' || value === 'performance' || value === 'title') {
    return value;
  }

  return 'updated';
}

function parseCategory(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized === 'all') {
    return 'all';
  }

  return normalized;
}

function parseStatus(value: string | undefined) {
  if (!value || value === 'all') {
    return 'all' as const;
  }

  return normalizeGuideStatus(value, 'DRAFT');
}

export function parseAdminGuideListParams(searchParams?: SearchParamsRecord): AdminGuideListParams {
  return {
    search: asSingle(searchParams?.search)?.trim() ?? '',
    status: parseStatus(asSingle(searchParams?.status)),
    category: parseCategory(asSingle(searchParams?.category)),
    sort: parseSort(asSingle(searchParams?.sort)),
    page: parsePage(asSingle(searchParams?.page)),
    pageSize: ADMIN_GUIDE_PAGE_SIZE,
  };
}

function buildWhere(params: AdminGuideListParams): Prisma.GuideWhereInput {
  const where: Prisma.GuideWhereInput = {};
  const and: Prisma.GuideWhereInput[] = [];

  if (params.search) {
    and.push({
      OR: [
        { title: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { topicCluster: { contains: params.search, mode: 'insensitive' } },
        { targetKeyword: { contains: params.search, mode: 'insensitive' } },
      ],
    });
  }

  if (params.status !== 'all') {
    and.push({ status: params.status });
  }

  if (params.category !== 'all') {
    and.push({ category: params.category });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

function buildOrderBy(sort: AdminGuideSort): Prisma.GuideOrderByWithRelationInput[] {
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

export async function listAdminGuides(params: AdminGuideListParams) {
  const where = buildWhere(params);
  const skip = (params.page - 1) * params.pageSize;
  const guideSelect = {
    id: true,
    title: true,
    slug: true,
    status: true,
    category: true,
    topicCluster: true,
    targetKeyword: true,
    excerpt: true,
    updatedAt: true,
    publishedAt: true,
    archivedAt: true,
    scheduledFor: true,
    author: {
      select: {
        name: true,
        email: true,
      },
    },
  } satisfies Prisma.GuideSelect;

  const [totalCount, totalGuides, draftCount, scheduledCount, publishedCount, archivedCount, categoryGroups] =
    await prisma.$transaction([
      prisma.guide.count({ where }),
      prisma.guide.count(),
      prisma.guide.count({ where: { status: 'DRAFT' } }),
      prisma.guide.count({ where: { status: 'SCHEDULED' } }),
      prisma.guide.count({ where: { status: 'PUBLISHED' } }),
      prisma.guide.count({ where: { status: 'ARCHIVED' } }),
      prisma.guide.groupBy({
        by: ['category'],
        _count: {
          _all: true,
        },
        orderBy: {
          category: 'asc',
        },
      }),
    ]);

  const guides =
    params.sort === 'performance'
      ? await prisma.guide.findMany({
          where,
          select: guideSelect,
        })
      : await prisma.guide.findMany({
          where,
          orderBy: buildOrderBy(params.sort),
          skip,
          take: params.pageSize,
          select: guideSelect,
        });

  const guideIds = guides.map((guide) => guide.id);
  const countsMap = await getGuideAnalyticsCountsByGuide(guideIds);

  const rows = guides.map((guide) => ({
    id: guide.id,
    title: guide.title,
    slug: guide.slug,
    status: guide.status,
    category: guide.category,
    topicCluster: guide.topicCluster,
    targetKeyword: guide.targetKeyword,
    excerpt: guide.excerpt,
    updatedAt: guide.updatedAt.toISOString(),
    publishedAt: guide.publishedAt?.toISOString() ?? null,
    archivedAt: guide.archivedAt?.toISOString() ?? null,
    scheduledFor: guide.scheduledFor?.toISOString() ?? null,
    authorLabel: guide.author.name?.trim() || guide.author.email,
    performance: {
      views: countsMap.get(guide.id)?.views ?? 0,
      consultationClicks: countsMap.get(guide.id)?.consultationClicks ?? 0,
      affiliateClicks: countsMap.get(guide.id)?.affiliateClicks ?? 0,
    },
  })) satisfies AdminGuideListItem[];

  const sortedRows =
    params.sort === 'performance'
      ? [...rows].sort(
          (left, right) =>
            right.performance.views - left.performance.views ||
            right.performance.consultationClicks - left.performance.consultationClicks ||
            right.performance.affiliateClicks - left.performance.affiliateClicks ||
            new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
        )
      : rows;
  const paginatedRows =
    params.sort === 'performance'
      ? sortedRows.slice(skip, skip + params.pageSize)
      : sortedRows;

  return {
    guides: paginatedRows,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / params.pageSize)),
    },
    kpis: {
      totalGuides,
      draftCount,
      scheduledCount,
      publishedCount,
      archivedCount,
    },
    categoryOptions: Array.from(
      new Set([
        ...GUIDE_CATEGORIES,
        ...categoryGroups.map((entry) => entry.category).filter((entry): entry is string => Boolean(entry)),
      ]),
    ),
    categoryCounts: categoryGroups.map((entry) => ({
      category: entry.category,
      count: getCategoryGroupCount(entry),
    })),
    storageReady: true,
    storageMessage: null,
  };
}

export async function listAdminGuidesSafe(params: AdminGuideListParams) {
  try {
    return await listAdminGuides(params);
  } catch (error) {
    if (!isGuideStorageUnavailableError(error)) {
      throw error;
    }

    return {
      guides: [] as AdminGuideListItem[],
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        totalCount: 0,
        totalPages: 1,
      },
      kpis: {
        totalGuides: 0,
        draftCount: 0,
        scheduledCount: 0,
        publishedCount: 0,
        archivedCount: 0,
      },
      categoryOptions: [...GUIDE_CATEGORIES],
      categoryCounts: GUIDE_CATEGORIES.map((category) => ({
        category,
        count: 0,
      })),
      storageReady: false,
      storageMessage: GUIDE_STORAGE_UNAVAILABLE_MESSAGE,
    };
  }
}
