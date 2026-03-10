import type { AffiliateNetwork } from '@prisma/client';
import {
  calculateRevenuePerThousandViews,
  estimateRevenueForClicks,
  estimateRevenuePerClick,
} from '@/lib/analytics/revenueEstimator';
import prisma from '@/lib/server/prisma';

type BrandRecord = {
  id: string;
  name: string;
};

type ProgramRecord = {
  id: string;
  network: AffiliateNetwork;
  averageOrderValue: number | null;
  commissionRate: number | null;
  brand: BrandRecord;
};

type LinkRecord = {
  id: string;
  blogPostId: string | null;
  name: string | null;
  program: ProgramRecord | null;
  partner: {
    id: string;
    name: string;
    brand: BrandRecord | null;
    program: ProgramRecord | null;
  } | null;
};

export type BlogRevenuePostRow = {
  postId: string;
  postTitle: string;
  slug: string;
  views: number;
  affiliateClicks: number;
  estimatedRevenue: number;
  rpm: number;
};

export type BlogRevenueBrandRow = {
  brandId: string;
  brandName: string;
  affiliateClicks: number;
  estimatedRevenue: number;
};

export type RevenueChartPoint = {
  label: string;
  estimatedRevenue: number;
};

export type RevenueTimelinePoint = {
  date: string;
  affiliateClicks: number;
  estimatedRevenue: number;
};

export type BlogRevenueAnalyticsSnapshot = {
  posts: BlogRevenuePostRow[];
  topEarningPosts: RevenueChartPoint[];
  revenueOverTime: RevenueTimelinePoint[];
  brandPerformance: BlogRevenueBrandRow[];
  summary: {
    totalEstimatedRevenue: number;
    totalAffiliateClicks: number;
    monetizedPosts: number;
    monetizedBrands: number;
  };
};

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const toIsoDay = (value: Date) => value.toISOString().slice(0, 10);

const fillTimelineGaps = (points: RevenueTimelinePoint[]) => {
  if (points.length <= 1) {
    return points;
  }

  const filled: RevenueTimelinePoint[] = [];
  let cursor = new Date(`${points[0].date}T00:00:00.000Z`);
  const end = new Date(`${points[points.length - 1].date}T00:00:00.000Z`);
  const pointMap = new Map(points.map((point) => [point.date, point]));

  while (cursor <= end) {
    const key = toIsoDay(cursor);
    filled.push(
      pointMap.get(key) ?? {
        date: key,
        affiliateClicks: 0,
        estimatedRevenue: 0,
      },
    );

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return filled;
};

const resolveProgramForLink = (link?: LinkRecord | null) => link?.program ?? link?.partner?.program ?? null;

const resolveBrandForLink = (link?: LinkRecord | null) =>
  resolveProgramForLink(link)?.brand ?? link?.partner?.brand ?? null;

export async function getBlogRevenueAnalytics(): Promise<BlogRevenueAnalyticsSnapshot> {
  const [posts, clickGroups, timelineClicks] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
      },
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
    }),
    prisma.affiliateClick.groupBy({
      by: ['postId', 'linkId'],
      where: {
        postId: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
    }),
    prisma.affiliateClick.findMany({
      where: {
        postId: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
        linkId: true,
        postId: true,
      },
    }),
  ]);

  const linkIds = Array.from(
    new Set([
      ...clickGroups.map((group) => group.linkId),
      ...timelineClicks.map((click) => click.linkId),
    ]),
  );

  const links = linkIds.length
    ? await prisma.affiliateLink.findMany({
        where: {
          id: {
            in: linkIds,
          },
        },
        select: {
          id: true,
          blogPostId: true,
          name: true,
          program: {
            select: {
              id: true,
              network: true,
              averageOrderValue: true,
              commissionRate: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
              program: {
                select: {
                  id: true,
                  network: true,
                  averageOrderValue: true,
                  commissionRate: true,
                  brand: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    : [];

  const linkMap = new Map<string, LinkRecord>(links.map((link) => [link.id, link]));
  const postMap = new Map(
    posts.map((post) => [
      post.id,
      {
        postId: post.id,
        postTitle: post.title,
        slug: post.slug,
        views: post.views,
        affiliateClicks: 0,
        estimatedRevenue: 0,
        rpm: 0,
      } satisfies BlogRevenuePostRow,
    ]),
  );
  const brandMap = new Map<string, BlogRevenueBrandRow>();

  for (const group of clickGroups) {
    const link = linkMap.get(group.linkId);
    const postId = group.postId ?? link?.blogPostId;
    if (!postId) {
      continue;
    }

    const post = postMap.get(postId);
    if (!post) {
      continue;
    }

    const clickCount = group._count._all;
    const program = resolveProgramForLink(link);
    const revenue = estimateRevenueForClicks(clickCount, program);

    post.affiliateClicks += clickCount;
    post.estimatedRevenue += revenue;

    const brand = resolveBrandForLink(link);
    if (!brand) {
      continue;
    }

    const brandRow = brandMap.get(brand.id) ?? {
      brandId: brand.id,
      brandName: brand.name,
      affiliateClicks: 0,
      estimatedRevenue: 0,
    };

    brandRow.affiliateClicks += clickCount;
    brandRow.estimatedRevenue += revenue;
    brandMap.set(brand.id, brandRow);
  }

  const timelineMap = new Map<string, RevenueTimelinePoint>();

  for (const click of timelineClicks) {
    const link = linkMap.get(click.linkId);
    const postId = click.postId ?? link?.blogPostId;
    if (!postId || !postMap.has(postId)) {
      continue;
    }

    const timelineKey = toIsoDay(click.createdAt);
    const point = timelineMap.get(timelineKey) ?? {
      date: timelineKey,
      affiliateClicks: 0,
      estimatedRevenue: 0,
    };

    point.affiliateClicks += 1;
    point.estimatedRevenue += estimateRevenuePerClick(resolveProgramForLink(link));
    timelineMap.set(timelineKey, point);
  }

  const postRows = Array.from(postMap.values())
    .map((post) => {
      const estimatedRevenue = roundCurrency(post.estimatedRevenue);
      const rpm = roundCurrency(calculateRevenuePerThousandViews(estimatedRevenue, post.views));

      return {
        ...post,
        estimatedRevenue,
        rpm,
      };
    })
    .sort(
      (left, right) =>
        right.estimatedRevenue - left.estimatedRevenue ||
        right.affiliateClicks - left.affiliateClicks ||
        right.views - left.views ||
        left.postTitle.localeCompare(right.postTitle),
    );

  const brandPerformance = Array.from(brandMap.values())
    .map((brand) => ({
      ...brand,
      estimatedRevenue: roundCurrency(brand.estimatedRevenue),
    }))
    .sort(
      (left, right) =>
        right.estimatedRevenue - left.estimatedRevenue ||
        right.affiliateClicks - left.affiliateClicks ||
        left.brandName.localeCompare(right.brandName),
    );

  const revenueOverTime = fillTimelineGaps(
    Array.from(timelineMap.values())
      .map((point) => ({
        ...point,
        estimatedRevenue: roundCurrency(point.estimatedRevenue),
      }))
      .sort((left, right) => left.date.localeCompare(right.date)),
  );

  return {
    posts: postRows,
    topEarningPosts: postRows.slice(0, 8).map((post) => ({
      label: post.postTitle,
      estimatedRevenue: post.estimatedRevenue,
    })),
    revenueOverTime,
    brandPerformance,
    summary: {
      totalEstimatedRevenue: roundCurrency(postRows.reduce((sum, post) => sum + post.estimatedRevenue, 0)),
      totalAffiliateClicks: postRows.reduce((sum, post) => sum + post.affiliateClicks, 0),
      monetizedPosts: postRows.filter((post) => post.affiliateClicks > 0).length,
      monetizedBrands: brandPerformance.filter((brand) => brand.affiliateClicks > 0).length,
    },
  };
}
