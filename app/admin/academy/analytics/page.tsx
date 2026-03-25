import Link from 'next/link';
import GuideAnalyticsCharts from '@/components/admin/guides/GuideAnalyticsCharts';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { getGuidePublicPath } from '@/lib/guides/publicPath';
import { getGuideAnalyticsDashboard } from '@/lib/server/guideAnalytics';

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

export const dynamic = 'force-dynamic';

export default async function AdminAcademyAnalyticsPage() {
  const analytics = await getGuideAnalyticsDashboard({ scope: 'academy' });
  const academyToConsultationConversion =
    analytics.summary.totalViews > 0
      ? `${((analytics.summary.totalConsultationClicks / analytics.summary.totalViews) * 100).toFixed(1)}%`
      : '0.0%';

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Academy Analytics"
        title="Academy module performance overview"
        subtitle="Track module views, affiliate engagement, and consultation clicks across the TMBC Baby Academy paths."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/academy">Academy editor</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/guides/analytics">All guide analytics</Link>
            </AdminButton>
          </>
        }
      />

      {analytics.storageReady ? (
        <>
          <section className="admin-kpi-grid" aria-label="Academy analytics metrics">
            <AdminKpiCard label="Total modules" value={String(analytics.summary.totalGuides)} />
            <AdminKpiCard label="Published modules" value={String(analytics.summary.publishedGuides)} />
            <AdminKpiCard label="Module views" value={analytics.summary.totalViews.toLocaleString()} />
            <AdminKpiCard label="Module engagement" value={analytics.summary.totalEngagement.toLocaleString()} />
            <AdminKpiCard label="Module to book" value={analytics.summary.totalConsultationClicks.toLocaleString()} />
            <AdminKpiCard label="Module to book rate" value={academyToConsultationConversion} />
            <AdminKpiCard label="Module to contact" value={analytics.summary.totalContactClicks.toLocaleString()} />
            <AdminKpiCard label="Affiliate clicks" value={analytics.summary.totalAffiliateClicks.toLocaleString()} />
          </section>

          <GuideAnalyticsCharts
            topGuides={analytics.topGuides.map((guide) => ({
              label: guide.title,
              views: guide.views,
              consultationClicks: guide.consultationClicks,
            }))}
            categoryPerformance={analytics.categoryPerformance.map((entry) => ({
              category: entry.category,
              views: entry.views,
              consultationClicks: entry.consultationClicks,
            }))}
            entityLabel="Module"
            entityLabelPlural="Modules"
          />

          <AdminSurface className="admin-stack">
            <h2 className="admin-h2">Top Performing Academy Modules</h2>
            <AdminTable
              density="compact"
              columns={[
                { key: 'module', label: 'Module' },
                { key: 'category', label: 'Category' },
                { key: 'views', label: 'Views', align: 'right' },
                { key: 'book', label: 'Book Clicks', align: 'right' },
                { key: 'contact', label: 'Contact Clicks', align: 'right' },
                { key: 'services', label: 'Services Clicks', align: 'right' },
                { key: 'affiliate', label: 'Affiliate Clicks', align: 'right' },
              ]}
              emptyState={<p className="admin-body p-6">No academy analytics yet.</p>}
            >
              {analytics.topGuides.map((guide) => (
                <tr key={guide.guideId} className="admin-row">
                  <td>
                    <div className="admin-stack gap-1">
                      <p className="text-admin">{guide.title}</p>
                      <Link
                        href={getGuidePublicPath({
                          slug: guide.slug,
                          topicCluster: guide.topicCluster,
                          canonicalUrl: guide.canonicalUrl,
                        })}
                        target="_blank"
                        className="admin-micro underline underline-offset-2"
                      >
                        {getGuidePublicPath({
                          slug: guide.slug,
                          topicCluster: guide.topicCluster,
                          canonicalUrl: guide.canonicalUrl,
                        })}
                      </Link>
                    </div>
                  </td>
                  <td className="admin-micro">{guide.category}</td>
                  <td className="text-right text-admin">{guide.views.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.consultationClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.contactClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.servicesClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.affiliateClicks.toLocaleString()}</td>
                </tr>
              ))}
            </AdminTable>
          </AdminSurface>

          <div className="grid gap-4 xl:grid-cols-2">
            <AdminSurface className="admin-stack">
              <h2 className="admin-h2">Top Affiliate Sections</h2>
              <AdminTable
                density="compact"
                columns={[
                  { key: 'module', label: 'Affiliate Section' },
                  { key: 'guide', label: 'Module' },
                  { key: 'clicks', label: 'Clicks', align: 'right' },
                ]}
                emptyState={<p className="admin-body p-6">No affiliate module clicks yet.</p>}
              >
                {analytics.topAffiliateSections.map((section) => (
                  <tr key={`${section.guideTitle}-${section.label}`} className="admin-row">
                    <td className="text-admin">{section.label}</td>
                    <td className="admin-micro">{section.guideTitle}</td>
                    <td className="text-right text-admin">{section.count.toLocaleString()}</td>
                  </tr>
                ))}
              </AdminTable>
            </AdminSurface>

            <AdminSurface className="admin-stack">
              <h2 className="admin-h2">Category Performance</h2>
              <AdminTable
                density="compact"
                columns={[
                  { key: 'category', label: 'Category' },
                  { key: 'guides', label: 'Modules', align: 'right' },
                  { key: 'views', label: 'Views', align: 'right' },
                  { key: 'book', label: 'Book Clicks', align: 'right' },
                  { key: 'contact', label: 'Contact Clicks', align: 'right' },
                ]}
                emptyState={<p className="admin-body p-6">No category performance data yet.</p>}
              >
                {analytics.categoryPerformance.map((entry) => (
                  <tr key={entry.category} className="admin-row">
                    <td className="text-admin">{entry.category}</td>
                    <td className="text-right text-admin">{entry.guideCount.toLocaleString()}</td>
                    <td className="text-right text-admin">{entry.views.toLocaleString()}</td>
                    <td className="text-right text-admin">{entry.consultationClicks.toLocaleString()}</td>
                    <td className="text-right text-admin">{entry.contactClicks.toLocaleString()}</td>
                  </tr>
                ))}
              </AdminTable>
            </AdminSurface>
          </div>

          <AdminSurface className="admin-stack">
            <h2 className="admin-h2">Recently Published Module Performance</h2>
            <AdminTable
              density="compact"
              columns={[
                { key: 'module', label: 'Module' },
                { key: 'published', label: 'Published' },
                { key: 'views', label: 'Views', align: 'right' },
                { key: 'book', label: 'Book Clicks', align: 'right' },
                { key: 'contact', label: 'Contact Clicks', align: 'right' },
                { key: 'services', label: 'Services Clicks', align: 'right' },
                { key: 'affiliate', label: 'Affiliate Clicks', align: 'right' },
              ]}
              emptyState={<p className="admin-body p-6">No published academy modules yet.</p>}
            >
              {analytics.recentlyPublished.map((guide) => (
                <tr key={guide.guideId} className="admin-row">
                  <td>
                    <div className="admin-stack gap-1">
                      <p className="text-admin">{guide.title}</p>
                      <span className="admin-micro">{guide.category}</span>
                    </div>
                  </td>
                  <td className="admin-micro">{formatDateTime(guide.publishedAt)}</td>
                  <td className="text-right text-admin">{guide.views.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.consultationClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.contactClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.servicesClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">{guide.affiliateClicks.toLocaleString()}</td>
                </tr>
              ))}
            </AdminTable>
          </AdminSurface>
        </>
      ) : (
        <GuideStorageNotice backHref="/admin" />
      )}
    </AdminStack>
  );
}
