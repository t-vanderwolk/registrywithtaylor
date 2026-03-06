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
type StatusFilter = 'all' | 'new' | 'responded' | 'scheduled' | 'completed';

const STATUS_FILTERS: StatusFilter[] = ['all', 'new', 'responded', 'scheduled', 'completed'];

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

const toLabel = (status: string | null) => {
  const normalizedStatus = status?.trim() || 'new';
  if (normalizedStatus === 'new') return 'New';
  if (normalizedStatus === 'responded') return 'Responded';
  if (normalizedStatus === 'scheduled') return 'Scheduled';
  if (normalizedStatus === 'completed') return 'Completed';
  return normalizedStatus;
};

const toChipClassName = (status: string | null) => {
  const normalizedStatus = status?.trim() || 'new';
  if (normalizedStatus === 'new') return 'admin-chip admin-chip--draft';
  if (normalizedStatus === 'responded') return 'admin-chip admin-chip--ready';
  if (normalizedStatus === 'scheduled') return 'admin-chip admin-chip--scheduled';
  if (normalizedStatus === 'completed') return 'admin-chip admin-chip--published';
  return 'admin-chip admin-chip--archived';
};

export const dynamic = 'force-dynamic';

export default async function AdminConsultationsPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined;
  const statusFilter = normalizeStatusFilter(params?.status);

  const where = statusFilter === 'all'
    ? undefined
    : {
        status: statusFilter,
      };

  const [consultations, statusCounts] = await Promise.all([
    prisma.consultationRequest.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        email: true,
        dueDate: true,
        city: true,
        status: true,
        createdAt: true,
        response: {
          select: {
            scheduledTime: true,
          },
        },
      },
    }),
    prisma.consultationRequest.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
  ]);

  const countByStatus = statusCounts.reduce<Record<string, number>>((acc, row) => {
    const key = row.status?.trim() || 'new';
    acc[key] = row._count._all;
    return acc;
  }, {});

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Consultations"
        title="Consultation requests"
        subtitle="Review new requests, reply to families, and schedule sessions from one queue."
      />

      <section className="admin-kpi-grid md:grid-cols-3" aria-label="Consultation status totals">
        <AdminKpiCard label="New" value={String(countByStatus.new ?? 0)} />
        <AdminKpiCard label="Responded" value={String(countByStatus.responded ?? 0)} />
        <AdminKpiCard label="Scheduled" value={String(countByStatus.scheduled ?? 0)} />
      </section>

      <AdminSurface className="admin-stack gap-4">
        <AdminTabs
          ariaLabel="Filter consultation requests by status"
          activeValue={statusFilter}
          tabs={[
            { value: 'all', label: 'All', href: '/admin/consultations' },
            { value: 'new', label: 'New', href: '/admin/consultations?status=new' },
            { value: 'responded', label: 'Responded', href: '/admin/consultations?status=responded' },
            { value: 'scheduled', label: 'Scheduled', href: '/admin/consultations?status=scheduled' },
            { value: 'completed', label: 'Completed', href: '/admin/consultations?status=completed' },
          ]}
        />

        <AdminTable
          density="comfortable"
          columns={[
            { key: 'request', label: 'Request' },
            { key: 'dueDate', label: 'Due date' },
            { key: 'status', label: 'Status' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'action', label: 'Action', align: 'right' },
          ]}
          emptyState={
            <AdminEmptyState
              title="No consultation requests"
              hint="New consultation requests will appear here."
            />
          }
        >
          {consultations.map((consultation) => (
            <tr key={consultation.id} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <p className="text-admin font-medium">{consultation.name}</p>
                  <p className="admin-micro">{consultation.email}</p>
                  <p className="admin-micro">
                    {consultation.city || 'City not provided'}
                    {consultation.response?.scheduledTime
                      ? ` | Scheduled for ${formatDateTime(consultation.response.scheduledTime)}`
                      : ''}
                  </p>
                </div>
              </td>
              <td className="admin-micro">{formatDate(consultation.dueDate)}</td>
              <td>
                <span className={toChipClassName(consultation.status)}>{toLabel(consultation.status)}</span>
              </td>
              <td className="admin-micro">{formatDateTime(consultation.createdAt)}</td>
              <td className="text-right">
                <AdminButton asChild variant="secondary" size="sm">
                  <Link href={`/admin/consultations/${consultation.id}`}>Open</Link>
                </AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
