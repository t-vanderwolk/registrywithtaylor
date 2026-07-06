import Link from 'next/link';
import BlogRevenueCharts from '@/components/admin/analytics/BlogRevenueCharts';
import prisma from '@/lib/server/prisma';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import StatusPill from '@/components/admin/ui/StatusPill';

const formatDateTime = (value?: Date | null) => {
  if (!value) {
    return '—';
  }

  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const formatRpm = (value: number) =>
  `${value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })}/1k`;

const getLifecycleLabel = (
  status: PostStatusValue,
  publishedAt?: Date | null,
  scheduledFor?: Date | null,
  archivedAt?: Date | null,
) => {
  if (status === 'PUBLISHED') {
    return formatDateTime(publishedAt);
  }

  if (status === 'SCHEDULED') {
    return formatDateTime(scheduledFor);
  }

  if (status === 'ARCHIVED') {
    return formatDateTime(archivedAt);
  }

  return 'Private draft';
};

export default async function AdminAnalyticsPage() {
  // Deduped, bot-filtered VIEW events (post-fix) over a rolling 28-day window —
  // this is the figure that lines up most closely with GA4. The `views` column
  // is an all-time cumulative counter that also includes pre-fix, un-deduped hits.
  const since28d = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

  const [
    totalPosts,
    postsByStatus,
    viewsSum,
    views28d,
    views28dByPost,
    mostViewedPost,
    postsByViews,
    revenueAnalytics,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.postAnalytics.count({ where: { event: 'VIEW', createdAt: { gte: since28d } } }),
    prisma.postAnalytics.groupBy({
      by: ['postId'],
      where: { event: 'VIEW', createdAt: { gte: since28d } },
      _count: { _all: true },
    }),
    prisma.post.findFirst({
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
      select: { id: true, title: true, slug: true, views: true, status: true },
    }),
    prisma.post.findMany({
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        status: true,
        publishedAt: true,
        scheduledFor: true,
        archivedAt: true,
      },
    }),
    getBlogRevenueAnalytics(),
  ]);
  const revenueLeaderRows = revenueAnalytics.posts.slice(0, 12);
  const views28dMap = new Map<string, number>(
    views28dByPost.map((row) => [row.postId, row._count._all]),
  );
  const countsByStatus = postsByStatus.reduce<Record<PostStatusValue, number>>(
    (acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    },
    {
      DRAFT: 0,
      SCHEDULED: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    },
  );

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Analytics"
        title="Blog performance overview"
        subtitle="Track output volume, status mix, and post-level readership at a glance."
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/blog">Manage blog</Link>
          </AdminButton>
        }
      />

      <section className="admin-kpi-grid" aria-label="Analytics metrics">
        <AdminKpiCard label="Total posts" value={String(totalPosts)} />
        <AdminKpiCard label="Drafts" value={String(countsByStatus.DRAFT)} />
        <AdminKpiCard label="Scheduled" value={String(countsByStatus.SCHEDULED)} />
        <AdminKpiCard label="Published" value={String(countsByStatus.PUBLISHED)} />
        <AdminKpiCard label="Archived" value={String(countsByStatus.ARCHIVED)} />
        <AdminKpiCard label="Views (28d, deduped)" value={views28d.toLocaleString()} />
        <AdminKpiCard label="Total views (all-time)" value={(viewsSum._sum.views ?? 0).toLocaleString()} />
      </section>

      <AdminSurface variant="muted" className="admin-stack">
        <p className="admin-eyebrow">How these numbers compare to GA &amp; Search Console</p>
        <p className="admin-body">
          &ldquo;Views (28d, deduped)&rdquo; counts one bot-filtered view per reader per post per 6-hour
          window, so it tracks closest to GA4. &ldquo;Total views (all-time)&rdquo; is a cumulative counter
          that also includes older, un-deduped hits, so it reads higher. Google Search Console measures
          something different again — only visits that arrive from Google Search — so it is expected to be
          the lowest of the three. GA4 also loses hits to ad/consent blockers, so it can sit a bit under the
          deduped figure. These are blog posts only; site-wide GA traffic includes tools, home, and services.
        </p>
      </AdminSurface>

      <AdminSurface variant="muted" className="admin-stack" >
        <p className="admin-eyebrow">Top performer</p>
        <p className="admin-body">
          {mostViewedPost
            ? `${mostViewedPost.title} (${mostViewedPost.views} views, ${POST_STATUS_LABELS[mostViewedPost.status].toLowerCase()})`
            : 'No post data yet.'}
        </p>
      </AdminSurface>

      <AdminSurface className="admin-stack" >
        <h2 className="admin-h2">Post view counts</h2>
        <AdminTable
          density="compact"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'status', label: 'Status' },
            { key: 'lifecycle', label: 'Lifecycle date' },
            { key: 'views28d', label: 'Views (28d)', align: 'right' },
            { key: 'views', label: 'Views (all-time)', align: 'right' },
          ]}
          emptyState={<p className="admin-body p-6">No post data yet.</p>}
        >
          {postsByViews.map((post) => (
            <tr key={post.id} className="admin-row">
              <td className="text-admin">{post.title}</td>
              <td>
                <span className="admin-table-code">{post.slug}</span>
              </td>
              <td>
                <StatusPill status={post.status} />
              </td>
              <td className="admin-micro">{getLifecycleLabel(post.status, post.publishedAt, post.scheduledFor, post.archivedAt)}</td>
              <td className="text-right text-admin">{(views28dMap.get(post.id) ?? 0).toLocaleString()}</td>
              <td className="text-right text-admin">{post.views.toLocaleString()}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>

      <AdminHeader
        eyebrow="Revenue Estimator"
        title="Blog revenue leaders"
        subtitle="Estimate affiliate value by combining click logs with program-level order value and commission assumptions."
      />

      <section className="admin-kpi-grid" aria-label="Blog revenue estimator metrics">
        <AdminKpiCard label="Est. revenue" value={formatCurrency(revenueAnalytics.summary.totalEstimatedRevenue)} />
        <AdminKpiCard label="Affiliate clicks" value={revenueAnalytics.summary.totalAffiliateClicks.toLocaleString()} />
        <AdminKpiCard label="Posts with clicks" value={revenueAnalytics.summary.monetizedPosts.toLocaleString()} />
        <AdminKpiCard label="Brands with clicks" value={revenueAnalytics.summary.monetizedBrands.toLocaleString()} />
      </section>

      <BlogRevenueCharts
        topEarningPosts={revenueAnalytics.topEarningPosts}
        revenueOverTime={revenueAnalytics.revenueOverTime}
      />

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2">Blog Revenue Leaders</h2>
        <AdminTable
          density="compact"
          columns={[
            { key: 'post', label: 'Blog Post' },
            { key: 'views', label: 'Views', align: 'right' },
            { key: 'clicks', label: 'Affiliate Clicks', align: 'right' },
            { key: 'revenue', label: 'Estimated Revenue', align: 'right' },
            { key: 'rpm', label: 'RPM', align: 'right' },
          ]}
          emptyState={<p className="admin-body p-6">No blog revenue data yet.</p>}
        >
          {revenueLeaderRows.map((post) => (
            <tr key={post.postId} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <p className="text-admin">{post.postTitle}</p>
                  <Link href={`/blog/${post.slug}`} target="_blank" className="admin-micro underline underline-offset-2">
                    /blog/{post.slug}
                  </Link>
                </div>
              </td>
              <td className="text-right text-admin">{post.views.toLocaleString()}</td>
              <td className="text-right text-admin">{post.affiliateClicks.toLocaleString()}</td>
              <td className="text-right text-admin">{formatCurrency(post.estimatedRevenue)}</td>
              <td className="text-right admin-micro">{formatRpm(post.rpm)}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2">Affiliate Brand Performance</h2>
        <AdminTable
          density="compact"
          columns={[
            { key: 'brand', label: 'Brand' },
            { key: 'clicks', label: 'Clicks', align: 'right' },
            { key: 'revenue', label: 'Estimated Revenue', align: 'right' },
          ]}
          emptyState={<p className="admin-body p-6">No affiliate brand data yet.</p>}
        >
          {revenueAnalytics.brandPerformance.slice(0, 12).map((brand) => (
            <tr key={brand.brandId} className="admin-row">
              <td className="text-admin">{brand.brandName}</td>
              <td className="text-right text-admin">{brand.affiliateClicks.toLocaleString()}</td>
              <td className="text-right text-admin">{formatCurrency(brand.estimatedRevenue)}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
