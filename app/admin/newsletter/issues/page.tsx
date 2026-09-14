import Link from 'next/link';
import { NewsletterIssueStatus } from '@prisma/client';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminTabs from '@/components/admin/ui/AdminTabs';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Newsletter Issues · Admin',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ status?: string }> | undefined;
type StatusFilter = 'all' | NewsletterIssueStatus;

const STATUS_FILTERS: StatusFilter[] = [
  'all',
  NewsletterIssueStatus.DRAFT,
  NewsletterIssueStatus.READY,
  NewsletterIssueStatus.SCHEDULED,
  NewsletterIssueStatus.SENT,
  NewsletterIssueStatus.ARCHIVED,
];

const normalizeStatusFilter = (value?: string): StatusFilter =>
  value && STATUS_FILTERS.includes(value as StatusFilter) ? (value as StatusFilter) : 'all';

const statusLabel = (status: StatusFilter) => {
  if (status === 'all') return 'All';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDateTime = (value?: Date | null) =>
  value
    ? value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'N/A';

const toChipClassName = (status: NewsletterIssueStatus) => {
  if (status === NewsletterIssueStatus.SENT) return 'admin-chip admin-chip--published';
  if (status === NewsletterIssueStatus.SCHEDULED) return 'admin-chip admin-chip--scheduled';
  if (status === NewsletterIssueStatus.READY) return 'admin-chip admin-chip--ready';
  if (status === NewsletterIssueStatus.ARCHIVED) return 'admin-chip admin-chip--archived';
  return 'admin-chip admin-chip--draft';
};

function buildStatusHref(status: StatusFilter) {
  return status === 'all' ? '/admin/newsletter/issues' : `/admin/newsletter/issues?status=${status}`;
}

export default async function AdminNewsletterIssuesPage({ searchParams }: { searchParams?: SearchParams }) {
  await requireAdminSession('/admin/newsletter/issues');
  const params = searchParams ? await searchParams : undefined;
  const statusFilter = normalizeStatusFilter(params?.status);
  const where = statusFilter === 'all' ? undefined : { status: statusFilter };

  const [issues, statusCounts] = await Promise.all([
    prisma.newsletterIssue.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      take: 100,
      select: {
        id: true,
        title: true,
        subject: true,
        previewText: true,
        status: true,
        scheduledFor: true,
        sentAt: true,
        updatedAt: true,
      },
    }),
    prisma.newsletterIssue.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const countByStatus = statusCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  const totalIssues = statusCounts.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Newsletter"
        title="Newsletter issues"
        subtitle="Create and manage local weekly newsletter drafts before connecting a send workflow."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/newsletter">Newsletter hub</Link>
            </AdminButton>
            <AdminButton asChild variant="primary">
              <Link href="/admin/newsletter/issues/new">New issue</Link>
            </AdminButton>
          </div>
        }
      />

      <section className="admin-kpi-grid md:grid-cols-3 xl:grid-cols-5" aria-label="Newsletter issue totals">
        <AdminKpiCard label="All issues" value={totalIssues.toLocaleString()} />
        <AdminKpiCard label="Draft" value={(countByStatus.DRAFT ?? 0).toLocaleString()} />
        <AdminKpiCard label="Ready" value={(countByStatus.READY ?? 0).toLocaleString()} />
        <AdminKpiCard label="Scheduled" value={(countByStatus.SCHEDULED ?? 0).toLocaleString()} />
        <AdminKpiCard label="Sent" value={(countByStatus.SENT ?? 0).toLocaleString()} />
      </section>

      <AdminSurface className="admin-stack gap-4">
        <AdminTabs
          ariaLabel="Filter newsletter issues by status"
          activeValue={statusFilter}
          tabs={STATUS_FILTERS.map((status) => ({
            value: status,
            label: statusLabel(status),
            href: buildStatusHref(status),
          }))}
        />

        <AdminTable
          density="comfortable"
          columns={[
            { key: 'issue', label: 'Issue' },
            { key: 'status', label: 'Status' },
            { key: 'scheduled', label: 'Scheduled', align: 'right' },
            { key: 'sent', label: 'Sent', align: 'right' },
            { key: 'updated', label: 'Updated', align: 'right' },
            { key: 'action', label: 'Action', align: 'right' },
          ]}
          emptyState={
            <AdminEmptyState
              title="No newsletter issues yet"
              hint="This queue is ready for the weekly newsletter editor."
            />
          }
        >
          {issues.map((issue) => (
            <tr key={issue.id} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <p className="text-admin font-medium">{issue.title}</p>
                  <p className="admin-micro">{issue.subject}</p>
                  {issue.previewText ? <p className="admin-micro">{issue.previewText}</p> : null}
                </div>
              </td>
              <td>
                <span className={toChipClassName(issue.status)}>{statusLabel(issue.status)}</span>
              </td>
              <td className="text-right admin-micro">{formatDateTime(issue.scheduledFor)}</td>
              <td className="text-right admin-micro">{formatDateTime(issue.sentAt)}</td>
              <td className="text-right admin-micro">{formatDateTime(issue.updatedAt)}</td>
              <td className="text-right">
                <AdminButton asChild variant="secondary" size="sm">
                  <Link href={`/admin/newsletter/issues/${issue.id}`}>Open</Link>
                </AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
