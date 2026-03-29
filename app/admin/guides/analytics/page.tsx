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

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

function asSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminGuideAnalyticsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : undefined;
  const academyScope = asSingle(params?.scope) === 'academy';
  const analytics = await getGuideAnalyticsDashboard({ scope: academyScope ? 'academy' : 'all' });
  const guideToConsultationConversion =
    analytics.summary.totalViews > 0
      ? `${((analytics.summary.totalConsultationClicks / analytics.summary.totalViews) * 100).toFixed(1)}%`
      : '0.0%';

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow={academyScope ? 'Guide Analytics · Academy Scope' : 'Guide Analytics'}
        title={academyScope ? 'Academy performance overview' : 'Guide and academy performance overview'}
        subtitle={
          academyScope
            ? 'Track Academy record views, engagement, and conversion clicks without leaving the shared guide analytics workspace.'
            : 'Track guide views, academy module engagement, and the next-step clicks that move readers toward booking, contact, or services.'
        }
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href={academyScope ? '/admin/guides' : '/admin/guides?scope=academy'}>
                {academyScope ? 'All guide records' : 'Academy records'}
              </Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href={academyScope ? '/admin/guides?scope=academy' : '/admin/guides'}>
                {academyScope ? 'Manage Academy records' : 'Manage guides'}
              </Link>
            </AdminButton>
          </>
        }
      />

      {analytics.storageReady ? (
        <>
          <section className="admin-kpi-grid" aria-label="Guide analytics metrics">
            <AdminKpiCard label={academyScope ? 'Academy records' : 'Tracked records'} value={String(analytics.summary.totalGuides)} />
            <AdminKpiCard label={academyScope ? 'Published Academy records' : 'Published records'} value={String(analytics.summary.publishedGuides)} />
            <AdminKpiCard label={academyScope ? 'Academy views' : 'Guide + academy views'} value={analytics.summary.totalViews.toLocaleString()} />
            <AdminKpiCard label={academyScope ? 'Academy engagement' : 'Guide + academy engagement'} value={analytics.summary.totalEngagement.toLocaleString()} />
            <AdminKpiCard label={academyScope ? 'Academy to book' : 'Guide + academy to book'} value={analytics.summary.totalConsultationClicks.toLocaleString()} />
            <AdminKpiCard label={academyScope ? 'Academy to book rate' : 'Guide + academy to book rate'} value={guideToConsultationConversion} />
            <AdminKpiCard label={academyScope ? 'Academy to contact' : 'Guide + academy to contact'} value={analytics.summary.totalContactClicks.toLocaleString()} />
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
          />

          <AdminSurface className="admin-stack">
            <h2 className="admin-h2">{academyScope ? 'Top Performing Academy Records' : 'Top Performing Guide and Academy Records'}</h2>
            <AdminTable
              density="compact"
              columns={[
                { key: 'guide', label: 'Guide' },
                { key: 'category', label: 'Category' },
                { key: 'views', label: 'Views', align: 'right' },
                { key: 'book', label: 'Book Clicks', align: 'right' },
                { key: 'contact', label: 'Contact Clicks', align: 'right' },
                { key: 'services', label: 'Services Clicks', align: 'right' },
                { key: 'affiliate', label: 'Affiliate Clicks', align: 'right' },
              ]}
              emptyState={<p className="admin-body p-6">{academyScope ? 'No Academy analytics yet.' : 'No guide or academy analytics yet.'}</p>}
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
                  { key: 'guide', label: 'Guide' },
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
                  { key: 'guides', label: 'Guides', align: 'right' },
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
            <h2 className="admin-h2">{academyScope ? 'Recently Published Academy Performance' : 'Recently Published Performance'}</h2>
            <AdminTable
              density="compact"
              columns={[
                { key: 'guide', label: 'Guide' },
                { key: 'published', label: 'Published' },
                { key: 'views', label: 'Views', align: 'right' },
                { key: 'book', label: 'Book Clicks', align: 'right' },
                { key: 'contact', label: 'Contact Clicks', align: 'right' },
                { key: 'services', label: 'Services Clicks', align: 'right' },
                { key: 'affiliate', label: 'Affiliate Clicks', align: 'right' },
              ]}
              emptyState={<p className="admin-body p-6">{academyScope ? 'No published Academy records yet.' : 'No published guide or academy records yet.'}</p>}
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
