import Link from 'next/link';
import prisma from '@/lib/server/prisma';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
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
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalPosts,
    postsByStatus,
    viewsSum,
    mostViewedPost,
    postsByViews,
    bookingEventTotals,
    bookingEventsLast7Days,
    bookingEventsLast30Days,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
    prisma.post.aggregate({ _sum: { views: true } }),
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
    prisma.bookingEvent.groupBy({
      by: ['type'],
      _count: {
        _all: true,
      },
    }),
    prisma.bookingEvent.count({
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
    }),
    prisma.bookingEvent.count({
      where: {
        createdAt: {
          gte: last30Days,
        },
      },
    }),
  ]);

  const bookingCountByType = bookingEventTotals.reduce<Record<string, number>>((acc, row) => {
    acc[row.type] = row._count._all;
    return acc;
  }, {});

  const sectionViewedCount = bookingCountByType.booking_section_viewed ?? 0;
  const scrolledIntoViewCount = bookingCountByType.booking_scrolled_into_view ?? 0;
  const interactionCount = bookingCountByType.booking_interaction ?? 0;
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
        <AdminKpiCard label="Total views" value={(viewsSum._sum.views ?? 0).toLocaleString()} />
      </section>

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
            { key: 'views', label: 'Views', align: 'right' },
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
              <td className="text-right text-admin">{post.views}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>

      <AdminHeader
        eyebrow="Booking Funnel"
        title="How It Works engagement"
        subtitle="Track booking section visibility and interaction without iframe internals."
      />

      <section className="admin-kpi-grid" aria-label="Booking engagement metrics">
        <AdminKpiCard label="Section loaded" value={sectionViewedCount.toLocaleString()} />
        <AdminKpiCard label="Scrolled into view" value={scrolledIntoViewCount.toLocaleString()} />
        <AdminKpiCard label="Interaction" value={interactionCount.toLocaleString()} />
        <AdminKpiCard label="Last 7 days" value={bookingEventsLast7Days.toLocaleString()} />
        <AdminKpiCard label="Last 30 days" value={bookingEventsLast30Days.toLocaleString()} />
      </section>

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2">Booking events by type</h2>
        <AdminTable
          density="compact"
          columns={[
            { key: 'type', label: 'Event type' },
            { key: 'count', label: 'Count', align: 'right' },
          ]}
          emptyState={<p className="admin-body p-6">No booking events yet.</p>}
        >
          {bookingEventTotals.map((row) => (
            <tr key={row.type} className="admin-row">
              <td className="text-admin">
                <span className="admin-table-code">{row.type}</span>
              </td>
              <td className="text-right text-admin">{row._count._all}</td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
