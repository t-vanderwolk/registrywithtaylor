import { Prisma } from '@prisma/client';
import prisma from '@/lib/server/prisma';

/**
 * Daily-count analytics for the admin dashboard.
 *
 * Builds a zero-filled per-day time series (default last 30 days) from the
 * first-party, bot-filtered logs the site already keeps:
 *   • totalTraffic    — every counted page view (PageView)
 *   • blogTraffic     — page views on /blog + /blog/* (PageView pageType='blog')
 *   • blogPostViews   — individual blog-post VIEW events (PostAnalytics)
 *   • affiliateClicks — blog affiliate-link clicks (AffiliateClick)
 *   • outboundClicks  — all outbound affiliate clicks, site-wide (OutboundClick)
 *   • toolFinder / toolChecker / toolQuiz — free-tool opens (ToolEvent, 'opened')
 *
 * Every query is wrapped so a not-yet-migrated table degrades to zeros instead
 * of throwing. Days are UTC buckets, labelled YYYY-MM-DD.
 */

export type DailyPoint = {
  date: string;
  totalTraffic: number;
  blogTraffic: number;
  blogPostViews: number;
  affiliateClicks: number;
  outboundClicks: number;
  toolFinder: number;
  toolChecker: number;
  toolQuiz: number;
};

export type DailyAnalytics = {
  days: number;
  points: DailyPoint[];
  totals: Omit<DailyPoint, 'date'>;
};

type DayCountRow = { day: Date; n: bigint | number };
type DayToolRow = { day: Date; tool: string; n: bigint | number };

const DAY_MS = 24 * 60 * 60 * 1000;

/** UTC YYYY-MM-DD key for a date. */
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Ordered list of the last `days` UTC day keys, oldest → newest (incl. today). */
function dayAxis(days: number, now = Date.now()): string[] {
  const todayUtc = Math.floor(now / DAY_MS) * DAY_MS;
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    keys.push(dayKey(new Date(todayUtc - i * DAY_MS)));
  }
  return keys;
}

async function safeRows<T>(run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run();
  } catch {
    return [];
  }
}

function toMap(rows: DayCountRow[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of rows) m.set(dayKey(new Date(r.day)), Number(r.n));
  return m;
}

export async function getDailyAnalytics(days = 30): Promise<DailyAnalytics> {
  const since = new Date(Date.now() - days * DAY_MS);

  const [totalRows, blogTrafficRows, postViewRows, affiliateRows, outboundRows, toolRows] =
    await Promise.all([
      safeRows<DayCountRow>(() =>
        prisma.$queryRaw<DayCountRow[]>(Prisma.sql`
          SELECT date_trunc('day', "createdAt") AS day, count(*) AS n
          FROM "PageView" WHERE "createdAt" >= ${since}
          GROUP BY 1`),
      ),
      safeRows<DayCountRow>(() =>
        prisma.$queryRaw<DayCountRow[]>(Prisma.sql`
          SELECT date_trunc('day', "createdAt") AS day, count(*) AS n
          FROM "PageView" WHERE "createdAt" >= ${since} AND "pageType" = 'blog'
          GROUP BY 1`),
      ),
      safeRows<DayCountRow>(() =>
        prisma.$queryRaw<DayCountRow[]>(Prisma.sql`
          SELECT date_trunc('day', "createdAt") AS day, count(*) AS n
          FROM "PostAnalytics" WHERE "createdAt" >= ${since} AND "event" = 'VIEW'
          GROUP BY 1`),
      ),
      safeRows<DayCountRow>(() =>
        prisma.$queryRaw<DayCountRow[]>(Prisma.sql`
          SELECT date_trunc('day', "createdAt") AS day, count(*) AS n
          FROM "AffiliateClick" WHERE "createdAt" >= ${since}
          GROUP BY 1`),
      ),
      safeRows<DayCountRow>(() =>
        prisma.$queryRaw<DayCountRow[]>(Prisma.sql`
          SELECT date_trunc('day', "createdAt") AS day, count(*) AS n
          FROM "OutboundClick" WHERE "createdAt" >= ${since}
          GROUP BY 1`),
      ),
      safeRows<DayToolRow>(() =>
        prisma.$queryRaw<DayToolRow[]>(Prisma.sql`
          SELECT date_trunc('day', "createdAt") AS day, "tool" AS tool, count(*) AS n
          FROM "ToolEvent" WHERE "createdAt" >= ${since} AND "event" = 'opened'
          GROUP BY 1, 2`),
      ),
    ]);

  const totalMap = toMap(totalRows);
  const blogTrafficMap = toMap(blogTrafficRows);
  const postViewMap = toMap(postViewRows);
  const affiliateMap = toMap(affiliateRows);
  const outboundMap = toMap(outboundRows);

  const finderMap = new Map<string, number>();
  const checkerMap = new Map<string, number>();
  const quizMap = new Map<string, number>();
  for (const r of toolRows) {
    const key = dayKey(new Date(r.day));
    const n = Number(r.n);
    if (r.tool === 'stroller-finder') finderMap.set(key, (finderMap.get(key) ?? 0) + n);
    else if (r.tool === 'travel-system-checker') checkerMap.set(key, (checkerMap.get(key) ?? 0) + n);
    else if (r.tool === 'stroller-quiz') quizMap.set(key, (quizMap.get(key) ?? 0) + n);
  }

  const points: DailyPoint[] = dayAxis(days).map((date) => ({
    date,
    totalTraffic: totalMap.get(date) ?? 0,
    blogTraffic: blogTrafficMap.get(date) ?? 0,
    blogPostViews: postViewMap.get(date) ?? 0,
    affiliateClicks: affiliateMap.get(date) ?? 0,
    outboundClicks: outboundMap.get(date) ?? 0,
    toolFinder: finderMap.get(date) ?? 0,
    toolChecker: checkerMap.get(date) ?? 0,
    toolQuiz: quizMap.get(date) ?? 0,
  }));

  const totals = points.reduce<Omit<DailyPoint, 'date'>>(
    (acc, p) => {
      acc.totalTraffic += p.totalTraffic;
      acc.blogTraffic += p.blogTraffic;
      acc.blogPostViews += p.blogPostViews;
      acc.affiliateClicks += p.affiliateClicks;
      acc.outboundClicks += p.outboundClicks;
      acc.toolFinder += p.toolFinder;
      acc.toolChecker += p.toolChecker;
      acc.toolQuiz += p.toolQuiz;
      return acc;
    },
    {
      totalTraffic: 0,
      blogTraffic: 0,
      blogPostViews: 0,
      affiliateClicks: 0,
      outboundClicks: 0,
      toolFinder: 0,
      toolChecker: 0,
      toolQuiz: 0,
    },
  );

  return { days, points, totals };
}
