import { getOutboundAnalyticsEvents } from '@/lib/server/outboundAnalytics';
type AffiliateAnalyticsEvent = {
  id: string;
  sessionId: string;
  timestamp: string;
  url: string;
  product?: string | null;
  brand?: string | null;
  category?: string | null;
  guide?: string | null;
  position?: string | null;
};

type LeaderboardRow = {
  label: string;
  clicks: number;
};

export type AffiliateProductRow = {
  product: string;
  clicks: number;
  clickShare: number;
};

export type AffiliateGuideRow = {
  guide: string;
  clicks: number;
  avgClicksPerSession: number;
};

export type AffiliateBrandRow = {
  brand: string;
  clicks: number;
};

export type AffiliateTimelinePoint = {
  date: string;
  clicks: number;
};

export type AffiliateAnalyticsDashboardSnapshot = {
  source: 'database';
  hasData: boolean;
  summary: {
    totalAffiliateClicks: number;
    topProduct: LeaderboardRow | null;
    topBrand: LeaderboardRow | null;
    topGuide: LeaderboardRow | null;
  };
  topProducts: AffiliateProductRow[];
  topGuides: AffiliateGuideRow[];
  topBrands: AffiliateBrandRow[];
  clicksOverTime: AffiliateTimelinePoint[];
  productChart: Array<{ label: string; clicks: number }>;
  brandChart: Array<{ label: string; clicks: number }>;
};

interface AffiliateAnalyticsDataSource {
  listAffiliateClicks(): Promise<AffiliateAnalyticsEvent[]>;
}

const databaseAffiliateAnalyticsDataSource: AffiliateAnalyticsDataSource = {
  async listAffiliateClicks() {
    return (await getOutboundAnalyticsEvents()).map(e => ({
      id: e.id, sessionId: e.visitorHash ?? e.id, timestamp: e.createdAt.toISOString(),
      url: e.url, product: e.product, brand: e.brand,
      guide: /^\/(guides|academy|learn)(\/|$)/.test(e.path ?? '') ? e.path : null,
    }));
  },
};

const normalizeLabel = (value: string | null | undefined) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
};

const toIsoDay = (value: string) => value.slice(0, 10);

const rankLeaderboard = (counts: Map<string, number>) =>
  Array.from(counts.entries())
    .map(([label, clicks]) => ({ label, clicks }))
    .sort((left, right) => right.clicks - left.clicks || left.label.localeCompare(right.label));

const fillTimelineGaps = (points: AffiliateTimelinePoint[]) => {
  if (points.length <= 1) {
    return points;
  }

  const pointMap = new Map(points.map((point) => [point.date, point]));
  const filled: AffiliateTimelinePoint[] = [];
  let cursor = new Date(`${points[0].date}T00:00:00.000Z`);
  const end = new Date(`${points[points.length - 1].date}T00:00:00.000Z`);

  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10);
    filled.push(pointMap.get(date) ?? { date, clicks: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return filled;
};

export async function getAffiliateAnalyticsDashboard(
  dataSource: AffiliateAnalyticsDataSource = databaseAffiliateAnalyticsDataSource,
): Promise<AffiliateAnalyticsDashboardSnapshot> {
  const events = await dataSource.listAffiliateClicks();
  const totalAffiliateClicks = events.length;

  if (totalAffiliateClicks === 0) {
    return {
      source: 'database',
      hasData: false,
      summary: {
        totalAffiliateClicks: 0,
        topProduct: null,
        topBrand: null,
        topGuide: null,
      },
      topProducts: [],
      topGuides: [],
      topBrands: [],
      clicksOverTime: [],
      productChart: [],
      brandChart: [],
    };
  }

  const productCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  const guideCounts = new Map<string, number>();
  const timelineCounts = new Map<string, number>();
  const guideSessions = new Map<string, Set<string>>();

  for (const event of events) {
    const product = normalizeLabel(event.product);
    const brand = normalizeLabel(event.brand);
    const guide = normalizeLabel(event.guide);
    const day = toIsoDay(event.timestamp);

    timelineCounts.set(day, (timelineCounts.get(day) ?? 0) + 1);

    if (product) {
      productCounts.set(product, (productCounts.get(product) ?? 0) + 1);
    }

    if (brand) {
      brandCounts.set(brand, (brandCounts.get(brand) ?? 0) + 1);
    }

    if (guide) {
      guideCounts.set(guide, (guideCounts.get(guide) ?? 0) + 1);
      const sessions = guideSessions.get(guide) ?? new Set<string>();
      sessions.add(event.sessionId);
      guideSessions.set(guide, sessions);
    }
  }

  const rankedProducts = rankLeaderboard(productCounts);
  const rankedBrands = rankLeaderboard(brandCounts);
  const rankedGuides = rankLeaderboard(guideCounts);

  const topProducts = rankedProducts.map((row) => ({
    product: row.label,
    clicks: row.clicks,
    clickShare: Number(((row.clicks / totalAffiliateClicks) * 100).toFixed(1)),
  }));
  const topBrands = rankedBrands.map((row) => ({
    brand: row.label,
    clicks: row.clicks,
  }));
  const topGuides = rankedGuides.map((row) => {
    const sessions = guideSessions.get(row.label)?.size ?? 0;

    return {
      guide: row.label,
      clicks: row.clicks,
      avgClicksPerSession: Number((row.clicks / Math.max(sessions, 1)).toFixed(2)),
    };
  });
  const clicksOverTime = fillTimelineGaps(
    Array.from(timelineCounts.entries())
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((left, right) => left.date.localeCompare(right.date)),
  );

  return {
    source: 'database',
    hasData: true,
    summary: {
      totalAffiliateClicks,
      topProduct: rankedProducts[0] ?? null,
      topBrand: rankedBrands[0] ?? null,
      topGuide: rankedGuides[0] ?? null,
    },
    topProducts,
    topGuides,
    topBrands,
    clicksOverTime,
    productChart: topProducts.slice(0, 6).map((row) => ({
      label: row.product,
      clicks: row.clicks,
    })),
    brandChart: topBrands.slice(0, 6).map((row) => ({
      label: row.brand,
      clicks: row.clicks,
    })),
  };
}
