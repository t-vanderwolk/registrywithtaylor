import Link from 'next/link';
import prisma from '@/lib/server/prisma';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { getGuideAnalyticsDashboard } from '@/lib/server/guideAnalytics';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    consultationStatusCounts,
    inquiryStatusCounts,
    totalPosts,
    totalGuides,
    blogViews,
    mostViewedPost,
    guideAnalytics,
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
    prisma.guide.count().catch((error) => {
      if (isGuideStorageUnavailableError(error)) {
        return 0;
      }

      throw error;
    }),
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
    getGuideAnalyticsDashboard(),
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
  const totalGuideViews = guideAnalytics.summary.totalViews;
  const totalTrackedTraffic = totalBlogViews + totalGuideViews;
  const topGuide = guideAnalytics.topGuides[0] ?? null;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Overview"
        title="Admin dashboard"
        subtitle="Monitor consultation workflow, tracked web traffic, and the queues that keep the business moving."
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

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Web Traffic</h2>
        <section className="admin-kpi-grid md:grid-cols-3 xl:grid-cols-5" aria-label="Web traffic metrics">
          <AdminKpiCard
            label="Total Web Traffic"
            value={totalTrackedTraffic.toLocaleString()}
            hint="Tracked blog post and guide views"
          />
          <AdminKpiCard
            label="Blog Views"
            value={totalBlogViews.toLocaleString()}
            hint="Public journal article traffic"
          />
          <AdminKpiCard
            label="Guide Views"
            value={totalGuideViews.toLocaleString()}
            hint={guideAnalytics.storageReady ? 'Public guide traffic' : 'Guide analytics unavailable'}
          />
          <AdminKpiCard
            label="Guide Engagement"
            value={guideAnalytics.summary.totalEngagement.toLocaleString()}
            hint="Guide CTA and affiliate clicks"
          />
          <AdminKpiCard
            label="Guide to Book"
            value={guideAnalytics.summary.totalConsultationClicks.toLocaleString()}
            hint="Consultation clicks from guides"
          />
        </section>
        <div className="admin-stack gap-2">
          <p className="admin-body">
            {mostViewedPost || topGuide
              ? `Top traffic sources: ${
                  mostViewedPost ? `${mostViewedPost.title} (${mostViewedPost.views.toLocaleString()} blog views)` : 'No blog traffic yet'
                } · ${
                  topGuide ? `${topGuide.title} (${topGuide.views.toLocaleString()} guide views)` : 'No guide traffic yet'
                }`
              : 'Traffic totals will start filling in as public blog posts and guides collect views.'}
          </p>
          {!guideAnalytics.storageReady && guideAnalytics.storageMessage ? (
            <p className="admin-micro">{guideAnalytics.storageMessage}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton asChild variant="primary">
            <Link href="/admin/analytics">Open analytics overview</Link>
          </AdminButton>
          <AdminButton asChild variant="secondary">
            <Link href="/admin/guides/analytics">Open guide analytics</Link>
          </AdminButton>
        </div>
      </AdminSurface>

      <AdminSurface variant="muted" className="admin-stack gap-3">
        <p className="admin-eyebrow">Quick links</p>
        <p className="admin-body">Guides in system: {totalGuides} · Blog posts in system: {totalPosts}</p>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton asChild variant="secondary">
            <Link href="/admin/guides">Manage guides</Link>
          </AdminButton>
          <AdminButton asChild variant="secondary">
            <Link href="/admin/guides/analytics">Guide analytics</Link>
          </AdminButton>
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
