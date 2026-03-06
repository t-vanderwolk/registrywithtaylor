import Link from 'next/link';
import prisma from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminTabs from '@/components/admin/ui/AdminTabs';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';

type SearchParams = Promise<{ status?: string }> | undefined;
type StatusFilter = 'all' | 'new' | 'reviewed' | 'completed';

const STATUS_FILTERS: StatusFilter[] = ['all', 'new', 'reviewed', 'completed'];

const SERVICE_LABELS: Record<string, string> = {
  consultation: 'Complimentary Consultation',
  'focused-edit': 'The Focused Edit',
  'signature-plan': 'The Signature Plan',
  'private-concierge': 'The Private Concierge',
};

const normalizeStatusFilter = (value?: string): StatusFilter =>
  value && STATUS_FILTERS.includes(value as StatusFilter) ? (value as StatusFilter) : 'all';

const formatDateTime = (value?: Date | null) => {
  if (!value) return 'N/A';
  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatDate = (value?: Date | null) => {
  if (!value) return 'N/A';
  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const toStatusLabel = (status: string) => {
  if (status === 'new') return 'New';
  if (status === 'reviewed') return 'Reviewed';
  if (status === 'completed') return 'Completed';
  return status;
};

const toStatusChipClassName = (status: string) => {
  if (status === 'new') return 'admin-chip admin-chip--draft';
  if (status === 'reviewed') return 'admin-chip admin-chip--ready';
  if (status === 'completed') return 'admin-chip admin-chip--published';
  return 'admin-chip admin-chip--archived';
};

const toServiceLabel = (service: string | null) => {
  if (!service) {
    return 'General';
  }

  return SERVICE_LABELS[service] ?? service;
};

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const statusFilter = normalizeStatusFilter(params?.status);

  const where =
    statusFilter === 'all'
      ? undefined
      : {
          status: statusFilter,
        };

  const [inquiries, statusCounts] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        fullName: true,
        email: true,
        service: true,
        status: true,
        dueDate: true,
        location: true,
        createdAt: true,
      },
    }),
    prisma.contactInquiry.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
  ]);

  const countByStatus = statusCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Inquiries"
        title="Contact form inbox"
        subtitle="All website contact form submissions are routed here."
      />

      <section className="admin-kpi-grid md:grid-cols-3" aria-label="Contact inquiry totals">
        <AdminKpiCard label="New" value={String(countByStatus.new ?? 0)} />
        <AdminKpiCard label="Reviewed" value={String(countByStatus.reviewed ?? 0)} />
        <AdminKpiCard label="Completed" value={String(countByStatus.completed ?? 0)} />
      </section>

      <AdminSurface className="admin-stack gap-4">
        <AdminTabs
          ariaLabel="Filter inquiries by status"
          activeValue={statusFilter}
          tabs={[
            { value: 'all', label: 'All', href: '/admin/inquiries' },
            { value: 'new', label: 'New', href: '/admin/inquiries?status=new' },
            { value: 'reviewed', label: 'Reviewed', href: '/admin/inquiries?status=reviewed' },
            { value: 'completed', label: 'Completed', href: '/admin/inquiries?status=completed' },
          ]}
        />

        <AdminTable
          density="comfortable"
          columns={[
            { key: 'request', label: 'Inquiry' },
            { key: 'service', label: 'Service' },
            { key: 'dueDate', label: 'Due date' },
            { key: 'status', label: 'Status' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'action', label: 'Action', align: 'right' },
          ]}
          emptyState={
            <AdminEmptyState
              title="No inquiries found"
              hint="New website inquiries will appear here."
            />
          }
        >
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <p className="text-admin font-medium">{inquiry.fullName}</p>
                  <p className="admin-micro">{inquiry.email}</p>
                  <p className="admin-micro">{inquiry.location || 'Location not provided'}</p>
                </div>
              </td>
              <td className="admin-micro">{toServiceLabel(inquiry.service)}</td>
              <td className="admin-micro">{formatDate(inquiry.dueDate)}</td>
              <td>
                <span className={toStatusChipClassName(inquiry.status)}>{toStatusLabel(inquiry.status)}</span>
              </td>
              <td className="admin-micro">{formatDateTime(inquiry.createdAt)}</td>
              <td className="text-right">
                <AdminButton asChild variant="secondary" size="sm">
                  <Link href={`/admin/inquiries/${inquiry.id}`}>Open</Link>
                </AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
