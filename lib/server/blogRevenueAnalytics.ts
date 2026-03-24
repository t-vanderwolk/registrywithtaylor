import type { AffiliateNetwork } from '@prisma/client';
import {
  calculateRevenuePerThousandViews,
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

type PartnerRecord = {
  id: string;
  name: string | null;
  brand: BrandRecord | null;
  program: ProgramRecord | null;
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

const asMetaObject = (value: unknown) =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const getMetaText = (meta: Record<string, unknown> | null, key: string) => {
  const value = meta?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const getBrandKey = (brandId: string | null, brandName: string) =>
  brandId ?? `unresolved:${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const resolveProgramForEvent = ({
  meta,
  partnerMap,
  programMap,
}: {
  meta: Record<string, unknown> | null;
  partnerMap: Map<string, PartnerRecord>;
  programMap: Map<string, ProgramRecord>;
}) => {
  const programId = getMetaText(meta, 'programId');
  if (programId) {
    const program = programMap.get(programId);
    if (program) {
      return program;
    }
  }

  const partnerId = getMetaText(meta, 'partnerId');
  if (partnerId) {
    return partnerMap.get(partnerId)?.program ?? null;
  }

  return null;
};

const resolveBrandForEvent = ({
  meta,
  program,
  partnerMap,
}: {
  meta: Record<string, unknown> | null;
  program: ProgramRecord | null;
  partnerMap: Map<string, PartnerRecord>;
}) => {
  if (program?.brand) {
    return program.brand;
  }

  const partnerId = getMetaText(meta, 'partnerId');
  if (partnerId) {
    const partner = partnerMap.get(partnerId);
    if (partner?.brand) {
      return partner.brand;
    }

    if (partner?.name) {
      return {
        id: getBrandKey(null, partner.name),
        name: partner.name,
      } satisfies BrandRecord;
    }
  }

  const brandName = getMetaText(meta, 'brandName') ?? getMetaText(meta, 'partnerName');
  if (!brandName) {
    return null;
  }

  return {
    id: getBrandKey(getMetaText(meta, 'brandId'), brandName),
    name: brandName,
  } satisfies BrandRecord;
};

export async function getBlogRevenueAnalytics(): Promise<BlogRevenueAnalyticsSnapshot> {
  const [posts, affiliateClicks] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
      },
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
    }),
    prisma.postAnalytics.findMany({
      where: {
        event: 'AFFILIATE_CLICK',
      },
      select: {
        postId: true,
        createdAt: true,
        meta: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  const partnerIds = Array.from(
    new Set(
      affiliateClicks
        .map((event) => getMetaText(asMetaObject(event.meta), 'partnerId'))
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const programIds = Array.from(
    new Set(
      affiliateClicks
        .map((event) => getMetaText(asMetaObject(event.meta), 'programId'))
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const [partners, programs] = await Promise.all([
    partnerIds.length
      ? prisma.affiliatePartner.findMany({
          where: {
            id: {
              in: partnerIds,
            },
          },
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
                }
              },
            },
          }
        })
      : [],
    programIds.length
      ? prisma.affiliateProgram.findMany({
          where: {
            id: {
              in: programIds,
            },
          },
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
        })
      : [],
  ]);
  const partnerMap = new Map<string, PartnerRecord>(partners.map((partner) => [partner.id, partner]));
  const programMap = new Map<string, ProgramRecord>(programs.map((program) => [program.id, program]));
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

  const timelineMap = new Map<string, RevenueTimelinePoint>();

  for (const click of affiliateClicks) {
    const post = postMap.get(click.postId);
    if (!post) {
      continue;
    }

    const meta = asMetaObject(click.meta);
    const program = resolveProgramForEvent({
      meta,
      partnerMap,
      programMap,
    });
    const revenue = estimateRevenuePerClick(program);

    post.affiliateClicks += 1;
    post.estimatedRevenue += revenue;

    const brand = resolveBrandForEvent({
      meta,
      program,
      partnerMap,
    });
    if (brand) {
      const brandRow = brandMap.get(brand.id) ?? {
        brandId: brand.id,
        brandName: brand.name,
        affiliateClicks: 0,
        estimatedRevenue: 0,
      };

      brandRow.affiliateClicks += 1;
      brandRow.estimatedRevenue += revenue;
      brandMap.set(brand.id, brandRow);
    }

    const timelineKey = toIsoDay(click.createdAt);
    const point = timelineMap.get(timelineKey) ?? {
      date: timelineKey,
      affiliateClicks: 0,
      estimatedRevenue: 0,
    };

    point.affiliateClicks += 1;
    point.estimatedRevenue += revenue;
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
