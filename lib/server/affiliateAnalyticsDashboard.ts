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
  source: 'mock';
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

const MOCK_AFFILIATE_EVENTS: AffiliateAnalyticsEvent[] = [
  {
    id: 'evt-01',
    sessionId: 'sess-01',
    timestamp: '2026-03-18T14:05:00.000Z',
    url: 'https://www.amazon.com/dp/B0FOXX5?tag=tmbc-20',
    product: 'Bugaboo Fox 5',
    brand: 'Bugaboo',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-02',
    sessionId: 'sess-01',
    timestamp: '2026-03-18T14:08:00.000Z',
    url: 'https://www.amazon.com/dp/B0TRIV?tag=tmbc-20',
    product: 'Nuna TRIV next',
    brand: 'Nuna',
    category: 'Travel Stroller',
    guide: 'travel-strollers',
    position: 'hero-cta',
  },
  {
    id: 'evt-03',
    sessionId: 'sess-02',
    timestamp: '2026-03-18T18:21:00.000Z',
    url: 'https://silvercrossus.com/product/silver-cross-reef-2-foldable-stroller/?affiliate_pid=4762',
    product: 'Silver Cross Reef 2',
    brand: 'Silver Cross',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'product-card',
  },
  {
    id: 'evt-04',
    sessionId: 'sess-03',
    timestamp: '2026-03-19T09:12:00.000Z',
    url: 'https://www.amazon.com/dp/B0FOXX5?tag=tmbc-20',
    product: 'Bugaboo Fox 5',
    brand: 'Bugaboo',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-05',
    sessionId: 'sess-04',
    timestamp: '2026-03-19T15:44:00.000Z',
    url: 'https://amzn.to/4travel',
    product: 'Nuna TRIV next',
    brand: 'Nuna',
    category: 'Travel Stroller',
    guide: 'travel-strollers',
    position: 'sidebar-card',
  },
  {
    id: 'evt-06',
    sessionId: 'sess-05',
    timestamp: '2026-03-20T11:03:00.000Z',
    url: 'https://www.amazon.com/dp/B0GAZELLE?tag=tmbc-20',
    product: 'Cybex Gazelle S',
    brand: 'Cybex',
    category: 'Double Stroller',
    guide: 'double-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-07',
    sessionId: 'sess-06',
    timestamp: '2026-03-20T12:16:00.000Z',
    url: 'https://www.amazon.com/dp/B0FOXX5?tag=tmbc-20',
    product: 'Bugaboo Fox 5',
    brand: 'Bugaboo',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'cta-row',
  },
  {
    id: 'evt-08',
    sessionId: 'sess-06',
    timestamp: '2026-03-20T12:20:00.000Z',
    url: 'https://amzn.to/4travel',
    product: 'Nuna TRIV next',
    brand: 'Nuna',
    category: 'Travel Stroller',
    guide: 'travel-strollers',
    position: 'cta-row',
  },
  {
    id: 'evt-09',
    sessionId: 'sess-07',
    timestamp: '2026-03-21T10:08:00.000Z',
    url: 'https://silvercrossus.com/product/silver-cross-reef-2-foldable-stroller/?affiliate_pid=4762',
    product: 'Silver Cross Reef 2',
    brand: 'Silver Cross',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'product-card',
  },
  {
    id: 'evt-10',
    sessionId: 'sess-08',
    timestamp: '2026-03-21T17:40:00.000Z',
    url: 'https://www.amazon.com/dp/B0MIOS?tag=tmbc-20',
    product: 'Cybex Mios',
    brand: 'Cybex',
    category: 'Compact Stroller',
    guide: 'compact-strollers',
    position: 'collection-grid',
  },
  {
    id: 'evt-11',
    sessionId: 'sess-09',
    timestamp: '2026-03-22T08:34:00.000Z',
    url: 'https://www.amazon.com/dp/B0FOXX5?tag=tmbc-20',
    product: 'Bugaboo Fox 5',
    brand: 'Bugaboo',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'hero-cta',
  },
  {
    id: 'evt-12',
    sessionId: 'sess-10',
    timestamp: '2026-03-22T09:18:00.000Z',
    url: 'https://amzn.to/4travel',
    product: 'Nuna TRIV next',
    brand: 'Nuna',
    category: 'Travel Stroller',
    guide: 'travel-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-13',
    sessionId: 'sess-10',
    timestamp: '2026-03-22T09:25:00.000Z',
    url: 'https://www.amazon.com/dp/B0GAZELLE?tag=tmbc-20',
    product: 'Cybex Gazelle S',
    brand: 'Cybex',
    category: 'Double Stroller',
    guide: 'double-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-14',
    sessionId: 'sess-11',
    timestamp: '2026-03-23T13:11:00.000Z',
    url: 'https://silvercrossus.com/product/silver-cross-reef-2-foldable-stroller/?affiliate_pid=4762',
    product: 'Silver Cross Reef 2',
    brand: 'Silver Cross',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'sidebar-card',
  },
  {
    id: 'evt-15',
    sessionId: 'sess-12',
    timestamp: '2026-03-23T16:52:00.000Z',
    url: 'https://www.amazon.com/dp/B0TRIV?tag=tmbc-20',
    product: 'Nuna TRIV next',
    brand: 'Nuna',
    category: 'Travel Stroller',
    guide: 'travel-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-16',
    sessionId: 'sess-13',
    timestamp: '2026-03-24T09:05:00.000Z',
    url: 'https://www.amazon.com/dp/B0FOXX5?tag=tmbc-20',
    product: 'Bugaboo Fox 5',
    brand: 'Bugaboo',
    category: 'Full-Size Stroller',
    guide: 'full-size-modular-strollers',
    position: 'comparison-grid',
  },
  {
    id: 'evt-17',
    sessionId: 'sess-14',
    timestamp: '2026-03-24T11:27:00.000Z',
    url: 'https://www.amazon.com/dp/B0GAZELLE?tag=tmbc-20',
    product: 'Cybex Gazelle S',
    brand: 'Cybex',
    category: 'Double Stroller',
    guide: 'double-strollers',
    position: 'hero-cta',
  },
  {
    id: 'evt-18',
    sessionId: 'sess-14',
    timestamp: '2026-03-24T11:33:00.000Z',
    url: 'https://www.amazon.com/dp/B0TRIV?tag=tmbc-20',
    product: 'Nuna TRIV next',
    brand: 'Nuna',
    category: 'Travel Stroller',
    guide: 'travel-strollers',
    position: 'hero-cta',
  },
];

const mockAffiliateAnalyticsDataSource: AffiliateAnalyticsDataSource = {
  async listAffiliateClicks() {
    return MOCK_AFFILIATE_EVENTS;
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
  dataSource: AffiliateAnalyticsDataSource = mockAffiliateAnalyticsDataSource,
): Promise<AffiliateAnalyticsDashboardSnapshot> {
  const events = await dataSource.listAffiliateClicks();
  const totalAffiliateClicks = events.length;

  if (totalAffiliateClicks === 0) {
    return {
      source: 'mock',
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
    source: 'mock',
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
