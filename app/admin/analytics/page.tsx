import Link from 'next/link';
import BlogRevenueCharts from '@/components/admin/analytics/BlogRevenueCharts';
import DailyCountsCharts from '@/components/admin/analytics/DailyCountsCharts';
import prisma from '@/lib/server/prisma';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';
import { getDailyAnalytics } from '@/lib/server/dailyAnalytics';
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
    dailyAnalytics,
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
    getDailyAnalytics(30),
  ]);
  const revenueLeaderRows = revenueAnalytics.posts.slice(0, 12);
  // Most-recent-first per-day table (last 14 rows keep it scannable).
  const dailyTableRows = [...dailyAnalytics.points].reverse().slice(0, 14);
  const views28dMap = new Map<string, number>(
    views28dByPost.map((row) => [row.postId, row._count._all]),
  );

  // Unified outbound affiliate clicks (tools + blog + tracked links), grouped by
  // retailer, so the numbers can be reconciled against each network's dashboard.
  // Cast to any + try/catch: the AffiliateClick table lands on the next deploy.
  type RetailerRow = { retailer: string; total: number; last28: number; network: string | null };
  let retailerRows: RetailerRow[] = [];
  let outbound28dTotal = 0;
  let outboundAllTotal = 0;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const [allTime, last28]: [
      Array<{ retailer: string; network: string | null; _count: { _all: number } }>,
      Array<{ retailer: string; _count: { _all: number } }>,
    ] = await Promise.all([
      db.outboundClick.groupBy({ by: ['retailer', 'network'], _count: { _all: true } }),
      db.outboundClick.groupBy({ by: ['retailer'], where: { createdAt: { gte: since28d } }, _count: { _all: true } }),
    ]);
    const last28Map = new Map(last28.map((r) => [r.retailer, r._count._all]));
    const merged = new Map<string, RetailerRow>();
    for (const r of allTime) {
      const existing = merged.get(r.retailer);
      const total = (existing?.total ?? 0) + r._count._all;
      merged.set(r.retailer, {
        retailer: r.retailer,
        network: existing?.network ?? r.network,
        total,
        last28: last28Map.get(r.retailer) ?? 0,
      });
    }
    retailerRows = [...merged.values()].sort((a, b) => b.total - a.total);
    outboundAllTotal = retailerRows.reduce((s, r) => s + r.total, 0);
    outbound28dTotal = retailerRows.reduce((s, r) => s + r.last28, 0);
  } catch {
    retailerRows = [];
  }

  // Free-tool usage funnel: opens → results → affiliate clicks, per tool.
  const TOOL_LABELS: Record<string, string> = {
    'stroller-finder': 'Stroller Finder',
    'travel-system-checker': 'Travel System Checker',
    'stroller-quiz': 'Stroller Quiz',
  };
  type ToolRow = { tool: string; label: string; opens: number; selections: number; results: number; clicks: number };
  let toolRows: ToolRow[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const [events28d, clicks28d]: [
      Array<{ tool: string; event: string; _count: { _all: number } }>,
      Array<{ source: string | null; _count: { _all: number } }>,
    ] = await Promise.all([
      db.toolEvent.groupBy({ by: ['tool', 'event'], where: { createdAt: { gte: since28d } }, _count: { _all: true } }),
      db.outboundClick.groupBy({
        by: ['source'],
        where: { createdAt: { gte: since28d }, source: { startsWith: 'tool:' } },
        _count: { _all: true },
      }),
    ]);
    const clickByTool = new Map<string, number>();
    for (const c of clicks28d) {
      const t = (c.source ?? '').replace(/^tool:/, '');
      clickByTool.set(t, (clickByTool.get(t) ?? 0) + c._count._all);
    }
    const byTool = new Map<string, ToolRow>();
    const ensure = (tool: string) => {
      let row = byTool.get(tool);
      if (!row) {
        row = { tool, label: TOOL_LABELS[tool] ?? tool, opens: 0, selections: 0, results: 0, clicks: clickByTool.get(tool) ?? 0 };
        byTool.set(tool, row);
      }
      return row;
    };
    for (const e of events28d) {
      const row = ensure(e.tool);
      if (e.event === 'opened') row.opens += e._count._all;
      else if (e.event === 'selection') row.selections += e._count._all;
      else if (e.event === 'result_viewed') row.results += e._count._all;
    }
    for (const t of clickByTool.keys()) ensure(t);
    // Keep the three known tools in a stable order.
    toolRows = Object.keys(TOOL_LABELS).map((tool) => ensure(tool));
  } catch {
    toolRows = [];
  }
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

      <AdminHeader
        eyebrow="Daily counts"
        title={`Traffic & engagement — last ${dailyAnalytics.days} days`}
        subtitle="First-party, bot-filtered daily counts for site traffic, blog readership, free-tool usage, and affiliate clicks. Total page views start logging from the deploy of the page-view tracker forward."
      />

      <section className="admin-kpi-grid" aria-label="Daily count totals">
        <AdminKpiCard label={`Total page views (${dailyAnalytics.days}d)`} value={dailyAnalytics.totals.totalTraffic.toLocaleString()} />
        <AdminKpiCard label={`Blog traffic (${dailyAnalytics.days}d)`} value={dailyAnalytics.totals.blogTraffic.toLocaleString()} />
        <AdminKpiCard label={`Blog post views (${dailyAnalytics.days}d)`} value={dailyAnalytics.totals.blogPostViews.toLocaleString()} />
        <AdminKpiCard label={`Outbound clicks (${dailyAnalytics.days}d)`} value={dailyAnalytics.totals.outboundClicks.toLocaleString()} />
        <AdminKpiCard label={`Affiliate clicks (${dailyAnalytics.days}d)`} value={dailyAnalytics.totals.affiliateClicks.toLocaleString()} />
        <AdminKpiCard label={`Tool opens (${dailyAnalytics.days}d)`} value={(dailyAnalytics.totals.toolFinder + dailyAnalytics.totals.toolChecker + dailyAnalytics.totals.toolQuiz).toLocaleString()} />
      </section>

      <DailyCountsCharts points={dailyAnalytics.points} days={dailyAnalytics.days} />

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2">Daily breakdown (most recent 14 days)</h2>
        <AdminTable
          density="compact"
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'totalTraffic', label: 'Total views', align: 'right' },
            { key: 'blogTraffic', label: 'Blog traffic', align: 'right' },
            { key: 'blogPostViews', label: 'Post views', align: 'right' },
            { key: 'outboundClicks', label: 'Outbound', align: 'right' },
            { key: 'affiliateClicks', label: 'Affiliate', align: 'right' },
            { key: 'toolFinder', label: 'Finder', align: 'right' },
            { key: 'toolChecker', label: 'Checker', align: 'right' },
            { key: 'toolQuiz', label: 'Quiz', align: 'right' },
          ]}
          emptyState={<p className="admin-body p-6">No daily data yet.</p>}
        >
          {dailyTableRows.map((row) => (
            <tr key={row.date} className="admin-row">
              <td className="admin-micro">{row.date}</td>
              <td className="text-right text-admin">{row.totalTraffic.toLocaleString()}</td>
              <td className="text-right text-admin">{row.blogTraffic.toLocaleString()}</td>
              <td className="text-right text-admin">{row.blogPostViews.toLocaleString()}</td>
              <td className="text-right text-admin">{row.outboundClicks.toLocaleString()}</td>
              <td className="text-right text-admin">{row.affiliateClicks.toLocaleString()}</td>
              <td className="text-right text-admin">{row.toolFinder.toLocaleString()}</td>
              <td className="text-right text-admin">{row.toolChecker.toLocaleString()}</td>
              <td className="text-right text-admin">{row.toolQuiz.toLocaleString()}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>

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
        eyebrow="Free Tools"
        title="Tool usage funnel (28 days)"
        subtitle="Bot-filtered usage of the Stroller Finder, Travel System Checker, and Stroller Quiz. Opens are counted once per visitor per tool per day; selections and results count every interaction."
      />

      <AdminSurface className="admin-stack">
        <AdminTable
          density="compact"
          columns={[
            { key: 'tool', label: 'Tool' },
            { key: 'opens', label: 'Opens', align: 'right' },
            { key: 'selections', label: 'Selections', align: 'right' },
            { key: 'results', label: 'Results viewed', align: 'right' },
            { key: 'clicks', label: 'Affiliate clicks', align: 'right' },
          ]}
          emptyState={
            <p className="admin-body p-6">
              No tool usage logged yet. This fills in once the tool-event table is deployed and visitors start
              using the Finder, Checker, or Quiz.
            </p>
          }
        >
          {toolRows.map((row) => (
            <tr key={row.tool} className="admin-row">
              <td className="text-admin">{row.label}</td>
              <td className="text-right text-admin">{row.opens.toLocaleString()}</td>
              <td className="text-right text-admin">{row.selections.toLocaleString()}</td>
              <td className="text-right text-admin">{row.results.toLocaleString()}</td>
              <td className="text-right text-admin">{row.clicks.toLocaleString()}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>

      <AdminHeader
        eyebrow="Affiliate"
        title="Outbound clicks by retailer"
        subtitle="Real, bot-filtered clicks on outbound affiliate links across the whole site (tools, blog, and tracked links). Use this to reconcile against each network's own dashboard."
      />

      <section className="admin-kpi-grid" aria-label="Outbound affiliate click metrics">
        <AdminKpiCard label="Outbound clicks (28d)" value={outbound28dTotal.toLocaleString()} />
        <AdminKpiCard label="Outbound clicks (all-time)" value={outboundAllTotal.toLocaleString()} />
        <AdminKpiCard label="Retailers tracked" value={String(retailerRows.length)} />
      </section>

      <AdminSurface className="admin-stack">
        <AdminTable
          density="compact"
          columns={[
            { key: 'retailer', label: 'Retailer' },
            { key: 'network', label: 'Network' },
            { key: 'last28', label: 'Clicks (28d)', align: 'right' },
            { key: 'total', label: 'Clicks (all-time)', align: 'right' },
          ]}
          emptyState={
            <p className="admin-body p-6">
              No outbound clicks logged yet. This table fills in once the affiliate-click table is deployed and
              visitors start clicking buy links.
            </p>
          }
        >
          {retailerRows.map((row) => (
            <tr key={row.retailer} className="admin-row">
              <td className="text-admin">{row.retailer}</td>
              <td className="admin-micro">{row.network ?? '—'}</td>
              <td className="text-right text-admin">{row.last28.toLocaleString()}</td>
              <td className="text-right text-admin">{row.total.toLocaleString()}</td>
            </tr>
          ))}
        </AdminTable>
        <p className="admin-micro">
          These are your first-party click counts (deduped, bots removed). Networks like Impact and CJ filter
          invalid clicks aggressively and will read lower; lightweight trackers (e.g. MacroBaby, Silver Cross via
          UAP) barely filter and will read higher. Time windows also differ per network dashboard.
        </p>
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
