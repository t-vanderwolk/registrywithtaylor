import Link from 'next/link';
import prisma from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [consultationStatusCounts, inquiryStatusCounts, totalPosts] = await Promise.all([
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
  ]);

  const consultationCountByStatus = consultationStatusCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});
  const inquiryCountByStatus = inquiryStatusCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Overview"
        title="Admin dashboard"
        subtitle="Monitor consultation workflow and jump into operational queues."
      />

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Consultation Requests</h2>
        <section className="admin-kpi-grid md:grid-cols-3" aria-label="Consultation request metrics">
          <AdminKpiCard label="New Requests" value={String(consultationCountByStatus.new ?? 0)} />
          <AdminKpiCard label="Scheduled" value={String(consultationCountByStatus.scheduled ?? 0)} />
          <AdminKpiCard label="Completed" value={String(consultationCountByStatus.completed ?? 0)} />
        </section>
        <div>
          <AdminButton asChild variant="primary">
            <Link href="/admin/consultations">Open consultation inbox</Link>
          </AdminButton>
        </div>
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Contact Inquiries</h2>
        <section className="admin-kpi-grid md:grid-cols-3" aria-label="Contact inquiry metrics">
          <AdminKpiCard label="New Inquiries" value={String(inquiryCountByStatus.new ?? 0)} />
          <AdminKpiCard label="Reviewed" value={String(inquiryCountByStatus.reviewed ?? 0)} />
          <AdminKpiCard label="Completed" value={String(inquiryCountByStatus.completed ?? 0)} />
        </section>
        <div>
          <AdminButton asChild variant="primary">
            <Link href="/admin/inquiries">Open inquiry inbox</Link>
          </AdminButton>
        </div>
      </AdminSurface>

      <AdminSurface variant="muted" className="admin-stack gap-3">
        <p className="admin-eyebrow">Quick links</p>
        <p className="admin-body">Blog posts in system: {totalPosts}</p>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton asChild variant="secondary">
            <Link href="/admin/blog">Manage blog</Link>
          </AdminButton>
          <AdminButton asChild variant="secondary">
            <Link href="/admin/analytics">View analytics</Link>
          </AdminButton>
          <AdminButton asChild variant="secondary">
            <Link href="/admin/inquiries">View inquiries</Link>
          </AdminButton>
        </div>
      </AdminSurface>
    </AdminStack>
  );
}
