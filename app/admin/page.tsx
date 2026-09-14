import Link from 'next/link';
import prisma from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { getAdminDashboardNavGroups } from '@/lib/admin/navigation';
import { formatNewsletterSource, getNewsletterAnalytics } from '@/lib/server/newsletter';
import { requireAdminViewSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await requireAdminViewSession();
  const readOnly = session.user.role === 'REVIEWER';
  const navGroups = getAdminDashboardNavGroups(readOnly);
  const [
    consultationStatusCounts,
    inquiryStatusCounts,
    totalPosts,
    blogViews,
    mostViewedPost,
    newsletter,
  ] = await Promise.all([
    prisma.consultationRequest.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
    prisma.contactInquiry.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
    prisma.post.count(),
    prisma.post.aggregate({
      _sum: {
        views: true,
      },
    }),
    prisma.post.findFirst({
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
      select: {
        title: true,
        slug: true,
        views: true,
      },
    }),
    getNewsletterAnalytics(),
  ]);

  const consultationCountByStatus = consultationStatusCounts.reduce<Record<string, number>>((acc, row) => {
    const key = row.status?.trim() || 'new';
    acc[key] = row._count._all;
    return acc;
  }, {});
  const inquiryCountByStatus = inquiryStatusCounts.reduce<Record<string, number>>((acc, row) => {
    const key = row.status?.trim() || 'new';
    acc[key] = row._count._all;
    return acc;
  }, {});
  const totalBlogViews = blogViews._sum.views ?? 0;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Overview"
        title={readOnly ? 'Admin dashboard preview' : 'Admin dashboard'}
        subtitle={
          readOnly
            ? 'Review aggregate workflow, traffic, and architecture signals without opening private customer records.'
            : 'Monitor consultation workflow, tracked web traffic, and the queues that keep the business moving.'
        }
      />

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Admin areas</p>
          <p className="admin-body">Choose a workspace by the job you need to do.</p>
        </div>
        <div className="admin-hub-grid">
          {navGroups.map((group) => (
            <section key={group.label} className="admin-hub-group" aria-label={`${group.label} links`}>
              <div className="admin-stack gap-1">
                <h2 className="admin-hub-title">{group.label}</h2>
                {group.summary ? <p className="admin-micro">{group.summary}</p> : null}
              </div>
              <div className="admin-hub-links">
                {group.links.map((link) => (
                  <AdminButton key={link.href} asChild variant="secondary" size="sm">
                    <Link href={link.href}>{link.label}</Link>
                  </AdminButton>
                ))}
              </div>
            </section>
          ))}
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Consultation Requests</h2>
        <section className="admin-kpi-grid md:grid-cols-3" aria-label="Consultation request metrics">
          <AdminKpiCard label="New Requests" value={String(consultationCountByStatus.new ?? 0)} />
          <AdminKpiCard label="Scheduled" value={String(consultationCountByStatus.scheduled ?? 0)} />
          <AdminKpiCard label="Completed" value={String(consultationCountByStatus.completed ?? 0)} />
        </section>
        {!readOnly ? (
          <div>
            <AdminButton asChild variant="primary">
              <Link href="/admin/consultations">Open consultation inbox</Link>
            </AdminButton>
          </div>
        ) : null}
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Contact Inquiries</h2>
        <section className="admin-kpi-grid md:grid-cols-3" aria-label="Contact inquiry metrics">
          <AdminKpiCard label="New Inquiries" value={String(inquiryCountByStatus.new ?? 0)} />
          <AdminKpiCard label="Reviewed" value={String(inquiryCountByStatus.reviewed ?? 0)} />
          <AdminKpiCard label="Completed" value={String(inquiryCountByStatus.completed ?? 0)} />
        </section>
        {!readOnly ? (
          <div>
            <AdminButton asChild variant="primary">
              <Link href="/admin/inquiries">Open inquiry inbox</Link>
            </AdminButton>
          </div>
        ) : null}
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Web Traffic</h2>
        <section className="admin-kpi-grid md:grid-cols-2" aria-label="Web traffic metrics">
          <AdminKpiCard
            label="Blog Views"
            value={totalBlogViews.toLocaleString()}
            hint="Public journal article traffic"
          />
          <AdminKpiCard
            label="Top Post"
            value={mostViewedPost ? mostViewedPost.views.toLocaleString() : '0'}
            hint={mostViewedPost ? mostViewedPost.title : 'No blog traffic yet'}
          />
        </section>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton asChild variant="primary">
            <Link href="/admin/analytics">Open analytics overview</Link>
          </AdminButton>
          <AdminButton asChild variant="secondary">
            <Link href="/admin/blog">Manage posts</Link>
          </AdminButton>
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="admin-stack gap-1">
            <h2 className="admin-h2">Newsletter</h2>
            <p className="admin-micro">Local subscriber tracking for the admin newsletter workflow.</p>
          </div>
          {!readOnly ? (
            <AdminButton asChild variant="primary">
              <Link href="/admin/newsletter">Open newsletter hub</Link>
            </AdminButton>
          ) : null}
        </div>

        <section className="admin-kpi-grid md:grid-cols-3 xl:grid-cols-6" aria-label="Newsletter metrics">
          <AdminKpiCard
            label="Subscribers"
            value={newsletter.audience.totalSubscribers.toLocaleString()}
            hint="Active local audience"
          />
          <AdminKpiCard
            label="Unsubscribed"
            value={newsletter.audience.unsubscribed.toLocaleString()}
            hint="Local opt-outs"
          />
          <AdminKpiCard
            label="Pending"
            value={newsletter.audience.pending.toLocaleString()}
            hint="Needs confirmation or cleanup"
          />
          <AdminKpiCard
            label="New this month"
            value={newsletter.audience.signupsThisMonth.toLocaleString()}
            hint={newsletter.audience.lastSubDate ? `Last sub ${newsletter.audience.lastSubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : undefined}
          />
          <AdminKpiCard
            label="Last 30 days"
            value={newsletter.audience.signupsLast30Days.toLocaleString()}
            hint="Recent signup volume"
          />
          <AdminKpiCard
            label="Draft issues"
            value={newsletter.audience.draftIssueCount.toLocaleString()}
            hint={`${newsletter.audience.sentIssueCount.toLocaleString()} sent issues tracked`}
          />
        </section>

        {newsletter.growthHistory.length > 0 ? (
          <div className="admin-stack gap-3">
            <p className="admin-eyebrow">Subscriber growth · last {newsletter.growthHistory.length} months</p>
            <AdminTable
              density="compact"
              columns={[
                { key: 'month', label: 'Month' },
                { key: 'subscribed', label: 'New', align: 'right' },
                { key: 'unsubscribed', label: 'Lost', align: 'right' },
                { key: 'net', label: 'Net', align: 'right' },
              ]}
            >
              {newsletter.growthHistory.map((row) => (
                <tr key={row.month} className="admin-row">
                  <td className="text-admin">{row.month}</td>
                  <td className="text-right text-admin">+{row.subscribed}</td>
                  <td className="text-right admin-micro">{row.unsubscribed > 0 ? `-${row.unsubscribed}` : '-'}</td>
                  <td className={`text-right text-admin font-medium ${row.net >= 0 ? '' : 'text-rose-600'}`}>
                    {row.net >= 0 ? `+${row.net}` : String(row.net)}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        ) : null}

        {!readOnly && newsletter.recentSubscribers.length > 0 ? (
          <div className="admin-stack gap-3">
            <p className="admin-eyebrow">Recent subscribers</p>
            <AdminTable
              density="compact"
              columns={[
                { key: 'email', label: 'Email' },
                { key: 'source', label: 'Source' },
                { key: 'status', label: 'Status' },
                { key: 'date', label: 'Date', align: 'right' },
              ]}
            >
              {newsletter.recentSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="admin-row">
                  <td className="text-admin">{subscriber.email}</td>
                  <td className="admin-micro">{formatNewsletterSource(subscriber.source)}</td>
                  <td className="admin-micro">{subscriber.status.toLowerCase()}</td>
                  <td className="text-right admin-micro">
                    {subscriber.createdAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        ) : null}
      </AdminSurface>

      <p className="admin-micro">Blog posts in system: {totalPosts}</p>
    </AdminStack>
  );
}
