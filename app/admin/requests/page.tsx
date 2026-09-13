import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Requests · Admin',
  robots: { index: false, follow: false },
};

// GiftCertificate is deploy-gated in some environments.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

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

const statusCount = (rows: Array<{ status: string | null; _count: { _all: number } }>) =>
  rows.reduce<Record<string, number>>((acc, row) => {
    const key = row.status?.trim() || 'new';
    acc[key] = row._count._all;
    return acc;
  }, {});

const workspaceLinks = [
  {
    title: 'Consultation requests',
    description: 'Review intake details, reply to families, and schedule registry sessions.',
    href: '/admin/consultations',
    cta: 'Open consultations',
  },
  {
    title: 'Contact inquiries',
    description: 'Triage service requests and general website messages.',
    href: '/admin/inquiries',
    cta: 'Open inquiries',
  },
  {
    title: 'Gift certificates',
    description: 'Resend prepaid consult gifts and mark issued certificates as redeemed.',
    href: '/admin/gifts',
    cta: 'Open gifts',
  },
];

export default async function AdminRequestsPage() {
  await requireAdminSession('/admin/requests');

  const [
    consultationCounts,
    inquiryCounts,
    recentConsultations,
    recentInquiries,
    gifts,
  ] = await Promise.all([
    prismaBase.consultationRequest.groupBy({ by: ['status'], _count: { _all: true } }),
    prismaBase.contactInquiry.groupBy({ by: ['status'], _count: { _all: true } }),
    prismaBase.consultationRequest.findMany({
      orderBy: [{ createdAt: 'desc' }],
      take: 5,
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    }),
    prismaBase.contactInquiry.findMany({
      orderBy: [{ createdAt: 'desc' }],
      take: 5,
      select: { id: true, fullName: true, email: true, service: true, status: true, createdAt: true },
    }),
    db.giftCertificate
      .findMany({
        orderBy: { createdAt: 'desc' },
        take: 300,
        select: { id: true, code: true, status: true, amountCents: true, recipientName: true, createdAt: true },
      })
      .catch(() => []),
  ]);

  const consultationsByStatus = statusCount(consultationCounts);
  const inquiriesByStatus = statusCount(inquiryCounts);
  const issuedGifts = gifts.filter((gift: { status: string }) => gift.status === 'ISSUED').length;
  const redeemedGifts = gifts.filter((gift: { status: string }) => gift.status === 'REDEEMED').length;
  const giftRevenue = gifts
    .filter((gift: { status: string }) => gift.status !== 'PENDING_PAYMENT' && gift.status !== 'REFUNDED')
    .reduce((sum: number, gift: { amountCents: number }) => sum + gift.amountCents, 0);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Clients & Requests"
        title="Request command center"
        subtitle="One starting point for consultation requests, website inquiries, and prepaid gift certificates."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton asChild variant="secondary">
              <Link href="/admin/consultations">Consultations</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/inquiries">Inquiries</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/gifts">Gifts</Link>
            </AdminButton>
          </div>
        }
      />

      <section className="admin-kpi-grid" aria-label="Request metrics">
        <AdminKpiCard label="New consultations" value={String(consultationsByStatus.new ?? 0)} />
        <AdminKpiCard label="Scheduled consultations" value={String(consultationsByStatus.scheduled ?? 0)} />
        <AdminKpiCard label="New inquiries" value={String(inquiriesByStatus.new ?? 0)} />
        <AdminKpiCard label="Awaiting gift redemption" value={String(issuedGifts)} />
        <AdminKpiCard label="Redeemed gifts" value={String(redeemedGifts)} />
        <AdminKpiCard label="Gift revenue" value={`$${(giftRevenue / 100).toFixed(0)}`} />
      </section>

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Workspaces</p>
          <p className="admin-body">Start with the queue you need to handle.</p>
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
            <h2 className="admin-h2">Recent consultation requests</h2>
            <AdminButton asChild variant="secondary" size="sm">
              <Link href="/admin/consultations">View all</Link>
            </AdminButton>
          </div>
          <AdminTable
            density="compact"
            columns={[
              { key: 'family', label: 'Family' },
              { key: 'status', label: 'Status' },
              { key: 'submitted', label: 'Submitted', align: 'right' },
            ]}
            emptyState={<p className="admin-body p-4">No consultation requests yet.</p>}
          >
            {recentConsultations.map((request) => (
              <tr key={request.id} className="admin-row">
                <td>
                  <Link href={`/admin/consultations/${request.id}`} className="text-admin underline underline-offset-2">
                    {request.name}
                  </Link>
                  <p className="admin-micro">{request.email}</p>
                </td>
                <td className="admin-micro">{request.status || 'new'}</td>
                <td className="text-right admin-micro">{formatDateTime(request.createdAt)}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>

        <AdminSurface className="admin-stack">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="admin-h2">Recent contact inquiries</h2>
            <AdminButton asChild variant="secondary" size="sm">
              <Link href="/admin/inquiries">View all</Link>
            </AdminButton>
          </div>
          <AdminTable
            density="compact"
            columns={[
              { key: 'family', label: 'Contact' },
              { key: 'service', label: 'Service' },
              { key: 'submitted', label: 'Submitted', align: 'right' },
            ]}
            emptyState={<p className="admin-body p-4">No contact inquiries yet.</p>}
          >
            {recentInquiries.map((inquiry) => (
              <tr key={inquiry.id} className="admin-row">
                <td>
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="text-admin underline underline-offset-2">
                    {inquiry.fullName}
                  </Link>
                  <p className="admin-micro">{inquiry.email}</p>
                </td>
                <td className="admin-micro">{inquiry.service || 'General'}</td>
                <td className="text-right admin-micro">{formatDateTime(inquiry.createdAt)}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>
      </div>
    </AdminStack>
  );
}
