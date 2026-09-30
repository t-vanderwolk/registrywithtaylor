import prisma from '@/lib/server/prisma';
export type BlogRevenuePostRow = {
  postId: string; postTitle: string; slug: string; views: number; affiliateClicks: number;
  estimatedRevenue: null; rpm: null;
};
export type BlogRevenueBrandRow = {
  brandId: string; brandName: string; affiliateClicks: number; estimatedRevenue: null;
};
export type RevenueChartPoint = { label: string; affiliateClicks: number; estimatedRevenue: null };
export type RevenueTimelinePoint = { date: string; affiliateClicks: number; estimatedRevenue: null };
export type BlogRevenueAnalyticsSnapshot = {
  posts: BlogRevenuePostRow[]; topEarningPosts: RevenueChartPoint[]; revenueOverTime: RevenueTimelinePoint[];
  brandPerformance: BlogRevenueBrandRow[];
  summary: { totalEstimatedRevenue: null; totalAffiliateClicks: number; monetizedPosts: number; monetizedBrands: number };
  revenueStatus: 'not_connected';
};
const text = (meta: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) if (typeof meta[key] === 'string' && (meta[key] as string).trim()) return (meta[key] as string).trim();
  return null;
};
export async function getBlogRevenueAnalytics(): Promise<BlogRevenueAnalyticsSnapshot> {
  const [posts, clicks] = await Promise.all([
    prisma.post.findMany({ select: { id: true, title: true, slug: true, views: true } }),
    prisma.postAnalytics.findMany({ where: { event: 'AFFILIATE_CLICK' }, select: { postId: true, createdAt: true, meta: true }, orderBy: { createdAt: 'asc' } }),
  ]);
  const metas = clicks.map(c => c.meta && typeof c.meta === 'object' && !Array.isArray(c.meta) ? c.meta as Record<string, unknown> : {});
  const ids = [...new Set(metas.map(m => text(m, 'partnerId')).filter((id): id is string => !!id))];
  const partners = ids.length ? await prisma.affiliatePartner.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } }) : [];
  const partnerNames = new Map(partners.map(p => [p.id, p.name]));
  const postMap = new Map<string, BlogRevenuePostRow>(posts.map(p => [p.id, {
    postId: p.id, postTitle: p.title, slug: p.slug, views: p.views, affiliateClicks: 0, estimatedRevenue: null, rpm: null,
  }]));
  const brands = new Map<string, BlogRevenueBrandRow>();
  const timeline = new Map<string, RevenueTimelinePoint>();
  clicks.forEach((click, index) => {
    const post = postMap.get(click.postId);
    if (!post) return;
    post.affiliateClicks++;
    const meta = metas[index];
    // Current cards use brand/product; legacy posts used brandName/partnerName.
    const name = text(meta, 'brand', 'brandName', 'partnerName') ?? partnerNames.get(text(meta, 'partnerId') ?? '') ?? 'Unattributed';
    const key = name.toLowerCase();
    const brand = brands.get(key) ?? { brandId: key, brandName: name, affiliateClicks: 0, estimatedRevenue: null };
    brand.affiliateClicks++; brands.set(key, brand);
    const day = click.createdAt.toISOString().slice(0,10);
    const point = timeline.get(day) ?? { date: day, affiliateClicks: 0, estimatedRevenue: null };
    point.affiliateClicks++; timeline.set(day, point);
  });
  const rows = [...postMap.values()].sort((a,b) => b.affiliateClicks-a.affiliateClicks || b.views-a.views || a.postTitle.localeCompare(b.postTitle));
  const brandPerformance = [...brands.values()].sort((a,b) => b.affiliateClicks-a.affiliateClicks || a.brandName.localeCompare(b.brandName));
  const days = [...timeline.keys()].sort();
  const revenueOverTime: RevenueTimelinePoint[] = [];
  if (days.length) for (let day = new Date(days[0]+'T00:00:00Z'); day <= new Date(days.at(-1)!+'T00:00:00Z'); day.setUTCDate(day.getUTCDate()+1)) {
    const key = day.toISOString().slice(0,10);
    revenueOverTime.push(timeline.get(key) ?? { date: key, affiliateClicks: 0, estimatedRevenue: null });
  }
  // Clicks alone cannot establish earnings. AOV × commission is commission per ORDER, not per click.
  return { posts: rows, brandPerformance, revenueOverTime, revenueStatus: 'not_connected',
    topEarningPosts: rows.filter(p => p.affiliateClicks > 0).slice(0,8).map(p => ({ label: p.postTitle, affiliateClicks: p.affiliateClicks, estimatedRevenue: null })),
    summary: { totalEstimatedRevenue: null, totalAffiliateClicks: clicks.length, monetizedPosts: rows.filter(p => p.affiliateClicks > 0).length, monetizedBrands: brands.size },
  };
}
