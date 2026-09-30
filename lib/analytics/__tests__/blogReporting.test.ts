import { expect, it, vi } from 'vitest';
vi.mock('@/lib/server/prisma', () => ({ default: {
  post: { findMany: async () => [{ id: 'p', title: 'Post', slug: 'post', views: 100 }] },
  postAnalytics: { findMany: async () => [
    { postId: 'p', createdAt: new Date('2026-09-28'), meta: { brand: 'Bugaboo', product: 'Butterfly 2 Plus' } },
    { postId: 'p', createdAt: new Date('2026-09-30'), meta: { partnerId: 'legacy' } },
    { postId: 'p', createdAt: new Date('2026-09-30'), meta: {} },
  ] },
  affiliatePartner: { findMany: async () => [{ id: 'legacy', name: 'Amazon' }] },
} }));
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';
it('includes modern brands, legacy partners and unattributed clicks without inventing revenue', async () => {
  const result = await getBlogRevenueAnalytics();
  expect(result.summary.totalAffiliateClicks).toBe(3);
  expect(result.summary.totalEstimatedRevenue).toBeNull();
  expect(result.brandPerformance.map(b => b.brandName).sort()).toEqual(['Amazon', 'Bugaboo', 'Unattributed']);
  expect(result.revenueOverTime).toHaveLength(3);
  expect(result.revenueOverTime[1].affiliateClicks).toBe(0);
});
