import { Prisma } from '@prisma/client';
import prisma from '@/lib/server/prisma';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import {
  GUIDE_STORAGE_UNAVAILABLE_MESSAGE,
  isGuideStorageUnavailableError,
  logGuideStorageUnavailable,
} from '@/lib/server/guideStorage';

type GuideEventInput = {
  guideId: string;
  event: string;
  sourceRoute?: string | null;
  visitorHash?: string | null;
  meta?: Record<string, unknown> | null;
};

export type GuideAnalyticsCounts = {
  views: number;
  uniqueVisitors: number;
  affiliateClicks: number;
  consultationClicks: number;
  contactClicks: number;
  servicesClicks: number;
  newsletterClicks: number;
};

const emptyCounts = (): GuideAnalyticsCounts => ({
  views: 0,
  uniqueVisitors: 0,
  affiliateClicks: 0,
  consultationClicks: 0,
  contactClicks: 0,
  servicesClicks: 0,
  newsletterClicks: 0,
});

export async function logGuideEvent({
  guideId,
  event,
  sourceRoute,
  visitorHash,
  meta,
}: GuideEventInput) {
  return prisma.guideAnalytics.create({
    data: {
      guideId,
      event,
      sourceRoute: sourceRoute?.trim() || null,
      visitorHash: visitorHash?.trim() || null,
      meta: meta ? (meta as Prisma.InputJsonValue) : Prisma.DbNull,
    },
  });
}

export async function getGuideAnalyticsCountsByGuide(guideIds: string[], since?: Date) {
  const normalizedGuideIds = Array.from(new Set(guideIds.filter(Boolean)));
  const countsMap = new Map<string, GuideAnalyticsCounts>();

  if (normalizedGuideIds.length === 0) {
    return countsMap;
  }

  const where = {
    guideId: { in: normalizedGuideIds },
    ...(since
      ? {
          createdAt: {
            gte: since,
          },
        }
      : {}),
  };

  let eventCounts;
  let uniqueVisitors;
  try {
    [eventCounts, uniqueVisitors] = await Promise.all([
      prisma.guideAnalytics.groupBy({
        by: ['guideId', 'event'],
        where,
        _count: {
          _all: true,
        },
      }),
      prisma.guideAnalytics.findMany({
        where: {
          ...where,
          event: GuideAnalyticsEvents.VIEW,
          visitorHash: {
            not: null,
          },
        },
        select: {
          guideId: true,
          visitorHash: true,
        },
        distinct: ['guideId', 'visitorHash'],
      }),
    ]);
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      logGuideStorageUnavailable('getGuideAnalyticsCountsByGuide', error);
      return countsMap;
    }

    throw error;
  }

  for (const guideId of normalizedGuideIds) {
    countsMap.set(guideId, emptyCounts());
  }

  for (const row of eventCounts) {
    const bucket = countsMap.get(row.guideId) ?? emptyCounts();

    if (row.event === GuideAnalyticsEvents.VIEW) {
      bucket.views = row._count._all;
    }

    if (row.event === GuideAnalyticsEvents.AFFILIATE_CLICK) {
      bucket.affiliateClicks = row._count._all;
    }

    if (row.event === GuideAnalyticsEvents.TO_CONSULTATION_CLICK) {
      bucket.consultationClicks = row._count._all;
    }

    if (row.event === GuideAnalyticsEvents.TO_CONTACT_CLICK) {
      bucket.contactClicks = row._count._all;
    }

    if (row.event === GuideAnalyticsEvents.TO_SERVICES_CLICK) {
      bucket.servicesClicks = row._count._all;
    }

    if (row.event === GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK) {
      bucket.newsletterClicks = row._count._all;
    }

    countsMap.set(row.guideId, bucket);
  }

  for (const row of uniqueVisitors) {
    const bucket = countsMap.get(row.guideId) ?? emptyCounts();
    bucket.uniqueVisitors += 1;
    countsMap.set(row.guideId, bucket);
  }

  return countsMap;
}

type GuideAnalyticsDashboard = {
  storageReady: boolean;
  storageMessage: string | null;
  summary: {
    totalGuides: number;
    publishedGuides: number;
    totalViews: number;
    totalUniqueVisitors: number;
    totalAffiliateClicks: number;
    totalConsultationClicks: number;
    totalContactClicks: number;
    totalServicesClicks: number;
    totalNewsletterClicks: number;
    totalEngagement: number;
  };
  topGuides: Array<{
    guideId: string;
    title: string;
    slug: string;
    category: string;
    views: number;
    uniqueVisitors: number;
    affiliateClicks: number;
    consultationClicks: number;
    contactClicks: number;
    servicesClicks: number;
    newsletterClicks: number;
    publishedAt: Date | null;
  }>;
  topAffiliateSections: Array<{
    label: string;
    guideTitle: string;
    count: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    guideCount: number;
    views: number;
    consultationClicks: number;
    contactClicks: number;
    servicesClicks: number;
    newsletterClicks: number;
    affiliateClicks: number;
  }>;
  recentlyPublished: Array<{
    guideId: string;
    title: string;
    slug: string;
    category: string;
    publishedAt: Date | null;
    views: number;
    consultationClicks: number;
    contactClicks: number;
    servicesClicks: number;
    newsletterClicks: number;
    affiliateClicks: number;
  }>;
};

function toAffiliateSectionLabel(meta: Record<string, unknown> | null | undefined) {
  if (!meta) {
    return 'Affiliate module';
  }

  const candidates = [
    meta.moduleTitle,
    meta.productName,
    meta.ctaLabel,
    meta.retailerLabel,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return 'Affiliate module';
}

export async function getGuideAnalyticsDashboard(): Promise<GuideAnalyticsDashboard> {
  let guides;
  let affiliateClickEvents;
  try {
    [guides, affiliateClickEvents] = await Promise.all([
      prisma.guide.findMany({
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          status: true,
          publishedAt: true,
        },
      }),
      prisma.guideAnalytics.findMany({
        where: {
          event: GuideAnalyticsEvents.AFFILIATE_CLICK,
        },
        orderBy: [{ createdAt: 'desc' }],
        select: {
          guideId: true,
          meta: true,
        },
      }),
    ]);
  } catch (error) {
    if (!isGuideStorageUnavailableError(error)) {
      throw error;
    }

    logGuideStorageUnavailable('getGuideAnalyticsDashboard', error);

    return {
      storageReady: false,
      storageMessage: GUIDE_STORAGE_UNAVAILABLE_MESSAGE,
      summary: {
        totalGuides: 0,
        publishedGuides: 0,
        totalViews: 0,
        totalUniqueVisitors: 0,
        totalAffiliateClicks: 0,
        totalConsultationClicks: 0,
        totalNewsletterClicks: 0,
        totalContactClicks: 0,
        totalServicesClicks: 0,
        totalEngagement: 0,
      },
      topGuides: [],
      topAffiliateSections: [],
      categoryPerformance: [],
      recentlyPublished: [],
    };
  }

  const countsMap = await getGuideAnalyticsCountsByGuide(guides.map((guide) => guide.id));
  const publishedGuides = guides.filter((guide) => guide.status === 'PUBLISHED');

  const topGuides = guides
    .map((guide) => {
      const counts = countsMap.get(guide.id) ?? emptyCounts();

      return {
        guideId: guide.id,
        title: guide.title,
        slug: guide.slug,
        category: guide.category,
        views: counts.views,
        uniqueVisitors: counts.uniqueVisitors,
        affiliateClicks: counts.affiliateClicks,
        consultationClicks: counts.consultationClicks,
        contactClicks: counts.contactClicks,
        servicesClicks: counts.servicesClicks,
        newsletterClicks: counts.newsletterClicks,
        publishedAt: guide.publishedAt,
      };
    })
    .sort(
      (left, right) =>
        right.views - left.views ||
        right.consultationClicks - left.consultationClicks ||
        right.affiliateClicks - left.affiliateClicks ||
        left.title.localeCompare(right.title),
    );

  const topAffiliateSections = Array.from(
    affiliateClickEvents.reduce<Map<string, { label: string; guideTitle: string; count: number }>>((acc, event) => {
      const guide = guides.find((entry) => entry.id === event.guideId);
      const label = toAffiliateSectionLabel(event.meta as Record<string, unknown> | null | undefined);
      const key = `${event.guideId}:${label}`;
      const existing = acc.get(key);

      acc.set(key, {
        label,
        guideTitle: guide?.title ?? 'Guide',
        count: (existing?.count ?? 0) + 1,
      });

      return acc;
    }, new Map()).values(),
  )
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, 12);

  const categoryBuckets = new Map<
    string,
    {
      category: string;
      guideCount: number;
      views: number;
      consultationClicks: number;
      contactClicks: number;
      servicesClicks: number;
      newsletterClicks: number;
      affiliateClicks: number;
    }
  >();

  for (const guide of guides) {
    const bucket = categoryBuckets.get(guide.category) ?? {
      category: guide.category,
      guideCount: 0,
      views: 0,
      consultationClicks: 0,
      contactClicks: 0,
      servicesClicks: 0,
      newsletterClicks: 0,
      affiliateClicks: 0,
    };
    const counts = countsMap.get(guide.id) ?? emptyCounts();

    bucket.guideCount += 1;
    bucket.views += counts.views;
    bucket.consultationClicks += counts.consultationClicks;
    bucket.contactClicks += counts.contactClicks;
    bucket.servicesClicks += counts.servicesClicks;
    bucket.newsletterClicks += counts.newsletterClicks;
    bucket.affiliateClicks += counts.affiliateClicks;
    categoryBuckets.set(guide.category, bucket);
  }

  const totalViews = topGuides.reduce((sum, guide) => sum + guide.views, 0);
  const totalUniqueVisitors = topGuides.reduce((sum, guide) => sum + guide.uniqueVisitors, 0);
  const totalAffiliateClicks = topGuides.reduce((sum, guide) => sum + guide.affiliateClicks, 0);
  const totalConsultationClicks = topGuides.reduce((sum, guide) => sum + guide.consultationClicks, 0);
  const totalContactClicks = topGuides.reduce((sum, guide) => sum + guide.contactClicks, 0);
  const totalServicesClicks = topGuides.reduce((sum, guide) => sum + guide.servicesClicks, 0);
  const totalNewsletterClicks = topGuides.reduce((sum, guide) => sum + guide.newsletterClicks, 0);

  return {
    storageReady: true,
    storageMessage: null,
    summary: {
      totalGuides: guides.length,
      publishedGuides: publishedGuides.length,
      totalViews,
      totalUniqueVisitors,
      totalAffiliateClicks,
      totalConsultationClicks,
      totalContactClicks,
      totalServicesClicks,
      totalNewsletterClicks,
      totalEngagement:
        totalAffiliateClicks +
        totalConsultationClicks +
        totalContactClicks +
        totalServicesClicks +
        totalNewsletterClicks,
    },
    topGuides: topGuides.slice(0, 12),
    topAffiliateSections,
    categoryPerformance: [...categoryBuckets.values()].sort(
      (left, right) => right.views - left.views || left.category.localeCompare(right.category),
    ),
    recentlyPublished: publishedGuides
      .slice()
      .sort(
        (left, right) =>
          (right.publishedAt?.getTime() ?? 0) - (left.publishedAt?.getTime() ?? 0) ||
          left.title.localeCompare(right.title),
      )
      .slice(0, 8)
      .map((guide) => {
        const counts = countsMap.get(guide.id) ?? emptyCounts();

        return {
          guideId: guide.id,
          title: guide.title,
          slug: guide.slug,
          category: guide.category,
          publishedAt: guide.publishedAt,
          views: counts.views,
          consultationClicks: counts.consultationClicks,
          contactClicks: counts.contactClicks,
          servicesClicks: counts.servicesClicks,
          newsletterClicks: counts.newsletterClicks,
          affiliateClicks: counts.affiliateClicks,
        };
      }),
  };
}
