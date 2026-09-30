import AnalyticsRefresh from '@/components/admin/analytics/AnalyticsRefresh';
import { getOutboundAnalyticsEvents } from '@/lib/server/outboundAnalytics';
import { checklistClickSummary } from '@/lib/analytics/outboundReporting';
import Link from 'next/link';
import BlogRevenueCharts from '@/components/admin/analytics/BlogRevenueCharts';
import prisma from '@/lib/server/prisma';
import {
  aggregateAffiliateRetailerCounts,
  type AffiliateRetailerCount,
} from '@/lib/analytics/affiliateRetailer';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import StatusPill from '@/components/admin/ui/StatusPill';

export const dynamic = 'force-dynamic';

const formatDateTime = (value?: Date | null) => {
  if (!value) {
    return '—';
  }

  return value.toLocaleString('en-US', {
    timeZone: 'America/Phoenix',
    timeZoneName: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const ANALYTICS_NAV = [
  { label: 'Blog', href: '#analytics-blog' },
  { label: 'Tools', href: '#analytics-tools' },
  { label: 'Compare', href: '#analytics-compare' },
  { label: 'Checklist', href: '#analytics-checklist' },
  { label: 'Affiliate', href: '#analytics-affiliate' },
  { label: 'Blog clicks & revenue', href: '#analytics-revenue' },
];

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
  // this uses our own visitor rule, not GA4 sessions. The `views` column
  // is an all-time cumulative counter that also includes pre-fix, un-deduped hits.
  const loadedAt = new Date();
  const unavailable: string[] = [];
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

  const outbound = await getOutboundAnalyticsEvents().catch((error) => {
    console.error('[admin analytics] Outbound clicks unavailable', error);
    unavailable.push('Outbound clicks');
    return [];
  });
  const recentOutbound = outbound.filter(e => e.createdAt >= since28d);
  const toCounts = (events: typeof outbound) => events.map(e => ({ ...e, count: 1 }));
  const retailerRows: AffiliateRetailerCount[] = aggregateAffiliateRetailerCounts(toCounts(outbound), toCounts(recentOutbound));
  const outboundAllTotal = outbound.length;
  const outbound28dTotal = recentOutbound.length;
  const latestActivity = await Promise.all([
    prisma.postAnalytics.aggregate({ where: { event: 'VIEW' }, _max: { createdAt: true } }),
    prisma.toolEvent.aggregate({ _max: { createdAt: true } }),
    prisma.outboundClick.aggregate({ _max: { createdAt: true } }),
  ].map(p => p.then(r => r._max.createdAt).catch(() => undefined)));

  // Free-tool usage funnel: opens → results → affiliate clicks, per tool.
  const TOOL_LABELS: Record<string, string> = {
    'stroller-finder': 'Stroller Finder',
    'travel-system-checker': 'Travel System Checker',
    'stroller-quiz': 'Stroller Quiz',
    'stroller-compare': 'Stroller Compare',
    'baby-checklist': 'Baby Registry Checklist',
  };
  type ToolRow = { tool: string; label: string; opens: number; selections: number; results: number; clicks: number };
  let toolRows: ToolRow[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const events28d = await db.toolEvent.groupBy({ by: ['tool', 'event'], where: { createdAt: { gte: since28d } }, _count: { _all: true } });
    const clickByTool = new Map<string, number>();
    for (const click of recentOutbound) {
      const tool = click.source?.match(/^tool:([^:]+)/)?.[1];
      if (tool) clickByTool.set(tool, (clickByTool.get(tool) ?? 0) + 1);
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
    // Keep the known tools in a stable order.
    toolRows = Object.keys(TOOL_LABELS).map((tool) => ensure(tool));
  } catch (error) {
    console.error('[admin analytics] Tool activity unavailable', error);
    unavailable.push('Tool activity');
    toolRows = [];
  }

  // Compare-tool detail: which strollers people actually put head to head, and
  // whether they compare two or all three. Both come from the same ToolEvent
  // rows the funnel above reads, filtered to tool = 'stroller-compare'.
  type ComparedRow = { name: string; picks: number };
  let comparedRows: ComparedRow[] = [];
  const compareDepth = { twoWay: 0, threeWay: 0 };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = prisma as any;
    const [picks, depths]: [
      Array<{ value: string | null; _count: { _all: number } }>,
      Array<{ value: string | null; _count: { _all: number } }>,
    ] = await Promise.all([
      db.toolEvent.groupBy({
        by: ['value'],
        where: {
          tool: 'stroller-compare',
          event: 'selection',
          kind: 'stroller',
          createdAt: { gte: since28d },
        },
        _count: { _all: true },
      }),
      db.toolEvent.groupBy({
        by: ['value'],
        where: { tool: 'stroller-compare', event: 'result_viewed', createdAt: { gte: since28d } },
        _count: { _all: true },
      }),
    ]);

    // Sorted in JS rather than via a groupBy orderBy on _count — the distinct
    // set is bounded by the catalog, and this can't fail silently at runtime.
    comparedRows = picks
      .filter((p) => p.value)
      .map((p) => ({ name: p.value as string, picks: p._count._all }))
      .sort((a, b) => b.picks - a.picks || a.name.localeCompare(b.name))
      .slice(0, 12);

    for (const d of depths) {
      if (d.value === '3-way') compareDepth.threeWay += d._count._all;
      else if (d.value === '2-way') compareDepth.twoWay += d._count._all;
    }


  } catch (error) {
    console.error('[admin analytics] Compare activity unavailable', error);
    unavailable.push('Compare activity');
    comparedRows = [];
  }

  const checklist = checklistClickSummary(outbound, since28d);
  const checklistProductRows = checklist.rows;
  const checklistClickAll = checklist.total;
  const checklistClick28 = checklist.last28;

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
        title="Analytics command center"
        subtitle="Review blog readership, free-tool funnels, checklist clicks, affiliate activity, and revenue connection status from one organized workspace."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/blog">Blog Hub</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/affiliates">Affiliate Hub</Link>
            </AdminButton>
          </div>
        }
      />

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <p className="admin-body">Updated {formatDateTime(loadedAt)}. Refreshes every minute while this page is visible. <AnalyticsRefresh /></p>
        <div className="admin-kpi-grid">
          {['Latest blog view', 'Latest tool activity', 'Latest affiliate click'].map((label, index) => (
            <AdminKpiCard key={label} label={label} value={latestActivity[index] === undefined ? 'Unavailable' : latestActivity[index] ? formatDateTime(latestActivity[index]) : 'No events yet'} />
          ))}
        </div>
        {unavailable.length > 0 ? <p role="alert" className="admin-body">Could not load: {unavailable.join(', ')}. Counts in those sections are unavailable, not confirmed zeros. Refresh to retry.</p> : null}
        <p className="admin-micro">These timestamps show the last recorded activity, not a guarantee of continuous traffic. Revenue and sales are not connected to this dashboard.</p>
      </AdminSurface>

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Analytics workspaces</p>
          <p className="admin-body">Jump to the part of the dashboard you need without scrolling through every report.</p>
        </div>
        <div className="admin-hub-links">
          {ANALYTICS_NAV.map((item) => (
            <AdminButton key={item.href} asChild variant="secondary" size="sm">
              <a href={item.href}>{item.label}</a>
            </AdminButton>
          ))}
        </div>
      </AdminSurface>

      <section id="analytics-blog" className="admin-stack gap-4">
        <SectionIntro
          eyebrow="Blog"
          title="Blog readership"
          body="Post volume, status mix, deduped 28-day views, and all-time post counters."
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
            &ldquo;Views (28d, deduped)&rdquo; uses a six-hour browser cookie plus a daily visitor check to remove repeat views. It does not use the same definition as GA4. &ldquo;Total views (all-time)&rdquo; is a cumulative counter
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
      </section>

      <section id="analytics-tools" className="admin-stack gap-4">
        <SectionIntro
          eyebrow="Free Tools"
          title="Tool activity (28 days)"
          body="Activity over the last 28 days for all five tools, including the checklist. Opens are deduplicated per visitor per 24 hours; selections and results are interactions, not unique people. Checklist results count product link opens."
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
                No tool activity is available. See the data status above for any loading errors.
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
      </section>

      <section id="analytics-compare" className="admin-stack gap-4">
        <SectionIntro
          eyebrow="Stroller Compare"
          title="What people put head to head (28 days)"
          body="Each distinct set of two or three strollers is counted once per page visit. A visitor can create multiple comparisons; these counts do not measure abandonment."
        />

        <section className="admin-kpi-grid" aria-label="Stroller Compare metrics">
          <AdminKpiCard label="2-stroller comparisons" value={compareDepth.twoWay.toLocaleString()} />
          <AdminKpiCard label="3-stroller comparisons" value={compareDepth.threeWay.toLocaleString()} />
        </section>

        <AdminSurface className="admin-stack">
          <AdminTable
            density="compact"
            columns={[
              { key: 'name', label: 'Stroller' },
              { key: 'picks', label: 'Times added', align: 'right' },
            ]}
            emptyState={
              <p className="admin-body p-6">
                No comparison selections are available for the last 28 days.
              </p>
            }
          >
            {comparedRows.map((row) => (
              <tr key={row.name} className="admin-row">
                <td className="text-admin">{row.name}</td>
                <td className="text-right text-admin">{row.picks.toLocaleString()}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>
      </section>

      <section id="analytics-checklist" className="admin-stack gap-4">
        <SectionIntro
          eyebrow="Baby Registry Checklist"
          title="Checklist product clicks"
          body="Outbound clicks on checklist shopping links. Totals include every product; the table shows the top 25, grouped by brand and product."
        />

        <section className="admin-kpi-grid" aria-label="Baby checklist product-click metrics">
          <AdminKpiCard label="Checklist clicks (28d)" value={checklistClick28.toLocaleString()} />
          <AdminKpiCard label="Checklist clicks (all-time)" value={checklistClickAll.toLocaleString()} />
          <AdminKpiCard label="Products clicked" value={String(checklist.productCount)} />
        </section>

        <AdminSurface className="admin-stack">
          <AdminTable
            density="compact"
            columns={[
              { key: 'product', label: 'Product' },
              { key: 'brand', label: 'Brand' },
              { key: 'last28', label: 'Clicks (28d)', align: 'right' },
              { key: 'total', label: 'Clicks (all-time)', align: 'right' },
            ]}
            emptyState={
              <p className="admin-body p-6">
                No checklist product clicks logged yet. This fills in once visitors start clicking the buy-buttons on
                the Baby Registry Checklist.
              </p>
            }
          >
            {checklistProductRows.map((row) => (
              <tr key={`${row.brand ?? ''}-${row.product}`} className="admin-row">
                <td className="text-admin">{row.product}</td>
                <td className="admin-micro">{row.brand ?? '—'}</td>
                <td className="text-right text-admin">{row.last28.toLocaleString()}</td>
                <td className="text-right text-admin">{row.total.toLocaleString()}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>
      </section>

      <section id="analytics-affiliate" className="admin-stack gap-4">
        <SectionIntro
          eyebrow="Affiliate"
          title="Outbound clicks by retailer"
          body="Real, bot-filtered clicks on outbound affiliate links across tools, blog, and tracked links."
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
                No outbound clicks are available. See the data status above for any loading errors.
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
            These are first-party click counts. Repeat events for the same identified visitor and destination
            within five seconds are counted once, including historical double-emitted events. ShopMy, Amazon,
            Impact and other networks apply their own filters and reporting windows; their totals can differ.
          </p>
        </AdminSurface>
      </section>

      <section id="analytics-revenue" className="admin-stack gap-4">
        <SectionIntro
          eyebrow="Blog Clicks & Revenue"
          title="Blog affiliate activity (all time)"
          body="Blog affiliate clicks and attributed brands. Confirmed orders and commission earnings are not connected; missing revenue is shown as unavailable, never as $0."
        />

        <section className="admin-kpi-grid" aria-label="Blog revenue estimator metrics">
          <AdminKpiCard label="Revenue connection" value="Not connected" hint="View confirmed earnings in your affiliate network dashboards." />
          <AdminKpiCard label="Affiliate clicks" value={revenueAnalytics.summary.totalAffiliateClicks.toLocaleString()} />
          <AdminKpiCard label="Posts with clicks" value={revenueAnalytics.summary.monetizedPosts.toLocaleString()} />
          <AdminKpiCard label="Brands with clicks" value={revenueAnalytics.summary.monetizedBrands.toLocaleString()} />
        </section>

        <BlogRevenueCharts
          topEarningPosts={revenueAnalytics.topEarningPosts}
          revenueOverTime={revenueAnalytics.revenueOverTime}
        />

        <AdminSurface className="admin-stack">
          <h2 className="admin-h2">Blog Click Leaders</h2>
          <AdminTable
            density="compact"
            columns={[
              { key: 'post', label: 'Blog Post' },
              { key: 'views', label: 'Views', align: 'right' },
              { key: 'clicks', label: 'Affiliate Clicks', align: 'right' },
              { key: 'revenue', label: 'Revenue', align: 'right' },
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
                <td className="text-right text-admin">Not connected</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>

        <AdminSurface className="admin-stack">
          <h2 className="admin-h2">Blog Brand / Legacy Partner Clicks</h2>
          <p className="admin-micro">Current cards identify the product brand. Older links may identify the retailer or affiliate partner instead. Unattributed clicks remain visible.</p>
          <AdminTable
            density="compact"
            columns={[
              { key: 'brand', label: 'Brand' },
              { key: 'clicks', label: 'Clicks', align: 'right' },
              { key: 'revenue', label: 'Revenue', align: 'right' },
            ]}
            emptyState={<p className="admin-body p-6">No affiliate brand data yet.</p>}
          >
            {revenueAnalytics.brandPerformance.slice(0, 12).map((brand) => (
              <tr key={brand.brandId} className="admin-row">
                <td className="text-admin">{brand.brandName}</td>
                <td className="text-right text-admin">{brand.affiliateClicks.toLocaleString()}</td>
                <td className="text-right text-admin">Not connected</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>
      </section>
    </AdminStack>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="admin-stack gap-1.5">
      <p className="admin-eyebrow">{eyebrow}</p>
      <h2 className="admin-h2">{title}</h2>
      <p className="admin-body max-w-3xl">{body}</p>
    </div>
  );
}
