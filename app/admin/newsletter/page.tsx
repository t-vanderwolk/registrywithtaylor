import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { formatNewsletterSource, getNewsletterAnalytics } from '@/lib/server/newsletter';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Newsletter · Admin',
  robots: { index: false, follow: false },
};

const formatDate = (value?: Date | null) =>
  value
    ? value.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

const workspaceLinks = [
  {
    title: 'Subscribers',
    description: 'View the local audience list, source, status, and subscriber emails.',
    href: '/admin/newsletter/subscribers',
    cta: 'Open subscribers',
  },
  {
    title: 'Issues',
    description: 'Track weekly newsletter drafts before a send workflow is connected.',
    href: '/admin/newsletter/issues',
    cta: 'Open issues',
  },
];

export default async function AdminNewsletterPage() {
  await requireAdminSession('/admin/newsletter');
  const newsletter = await getNewsletterAnalytics();

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Newsletter"
        title="Newsletter hub"
        subtitle="Local subscriber tracking and weekly issue planning inside the admin portal."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/newsletter/subscribers">Subscribers</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/newsletter/issues">Issues</Link>
            </AdminButton>
          </div>
        }
      />

      <section className="admin-kpi-grid md:grid-cols-3 xl:grid-cols-6" aria-label="Newsletter metrics">
        <AdminKpiCard label="Subscribers" value={newsletter.audience.totalSubscribers.toLocaleString()} />
        <AdminKpiCard label="New this month" value={newsletter.audience.signupsThisMonth.toLocaleString()} />
        <AdminKpiCard label="Last 30 days" value={newsletter.audience.signupsLast30Days.toLocaleString()} />
        <AdminKpiCard label="Unsubscribed" value={newsletter.audience.unsubscribed.toLocaleString()} />
        <AdminKpiCard label="Draft issues" value={newsletter.audience.draftIssueCount.toLocaleString()} />
        <AdminKpiCard label="Sent issues" value={newsletter.audience.sentIssueCount.toLocaleString()} />
      </section>

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Workspaces</p>
          <p className="admin-body">Start with the list or the weekly issue queue.</p>
        </div>
        <div className="admin-hub-grid">
          {workspaceLinks.map((workspace) => (
            <section key={workspace.href} className="admin-hub-group" aria-label={workspace.title}>
              <div className="admin-stack gap-1">
                <h2 className="admin-hub-title">{workspace.title}</h2>
                <p className="admin-micro">{workspace.description}</p>
              </div>
              <div className="admin-hub-links">
                <AdminButton asChild variant="primary" size="sm">
                  <Link href={workspace.href}>{workspace.cta}</Link>
                </AdminButton>
              </div>
            </section>
          ))}
        </div>
      </AdminSurface>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminSurface className="admin-stack">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="admin-h2">Recent subscribers</h2>
            <AdminButton asChild variant="secondary" size="sm">
              <Link href="/admin/newsletter/subscribers">View all</Link>
            </AdminButton>
          </div>
          <AdminTable
            density="compact"
            columns={[
              { key: 'email', label: 'Email' },
              { key: 'source', label: 'Source' },
              { key: 'date', label: 'Date', align: 'right' },
            ]}
            emptyState={<p className="admin-body p-4">No subscribers yet.</p>}
          >
            {newsletter.recentSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="admin-row">
                <td className="text-admin">{subscriber.email}</td>
                <td className="admin-micro">{formatNewsletterSource(subscriber.source)}</td>
                <td className="text-right admin-micro">{formatDate(subscriber.createdAt)}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>

        <AdminSurface className="admin-stack">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="admin-h2">Recent issues</h2>
            <div className="flex flex-wrap gap-2">
              <AdminButton asChild variant="secondary" size="sm">
                <Link href="/admin/newsletter/issues">View all</Link>
              </AdminButton>
              <AdminButton asChild variant="primary" size="sm">
                <Link href="/admin/newsletter/issues/new">New issue</Link>
              </AdminButton>
            </div>
          </div>
          <AdminTable
            density="compact"
            columns={[
              { key: 'issue', label: 'Issue' },
              { key: 'status', label: 'Status' },
              { key: 'updated', label: 'Updated', align: 'right' },
              { key: 'action', label: 'Action', align: 'right' },
            ]}
            emptyState={<p className="admin-body p-4">No newsletter issues yet.</p>}
          >
            {newsletter.recentIssues.map((issue) => (
              <tr key={issue.id} className="admin-row">
                <td>
                  <p className="text-admin">{issue.title}</p>
                  <p className="admin-micro">{issue.subject}</p>
                </td>
                <td className="admin-micro">{issue.status.toLowerCase()}</td>
                <td className="text-right admin-micro">{formatDate(issue.updatedAt)}</td>
                <td className="text-right">
                  <AdminButton asChild variant="secondary" size="sm">
                    <Link href={`/admin/newsletter/issues/${issue.id}`}>Open</Link>
                  </AdminButton>
                </td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>
      </div>
    </AdminStack>
  );
}
