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
import { getAcademyMemberStats, ACADEMY_PATH_CONFIG } from '@/lib/server/academyAnalytics';

const formatDateTime = (value?: Date | null) => {
  if (!value) return '—';
  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const PREVIEW_MODULE_LABELS: Record<string, string> = {
  'preview-art-of-the-registry': 'The Art of the Registry',
  'preview-nursery-foundations': 'Nursery Foundations',
  'preview-stroller-foundations': 'The Stroller Equation',
};

const PATH_ORDER = ['registry', 'nursery', 'gear', 'postpartum'] as const;

export const dynamic = 'force-dynamic';

export default async function AdminAcademyAnalyticsPage() {
  const [academyAnalytics, previewAnalytics, memberStats] = await Promise.all([
    getGuideAnalyticsDashboard({ scope: 'academy' }),
    getGuideAnalyticsDashboard({ scope: 'preview' }),
    getAcademyMemberStats(),
  ]);

  const academyConversionRate =
    academyAnalytics.summary.totalViews > 0
      ? `${((academyAnalytics.summary.totalConsultationClicks / academyAnalytics.summary.totalViews) * 100).toFixed(1)}%`
      : '0.0%';

  const activeLearnerRate =
    memberStats.totalLearners > 0
      ? `${Math.round((memberStats.activeLearners / memberStats.totalLearners) * 100)}%`
      : '0%';

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Academy Analytics"
        title="Academy performance overview"
        subtitle="Member engagement, preview module traffic, and conversion data across all learning content."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/academy">Manage academy</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/analytics">Analytics overview</Link>
            </AdminButton>
          </>
        }
      />

      {/* ── Member Engagement Summary ───────────────────────────────────────── */}
      <section aria-label="Member engagement summary">
        <h2 className="admin-h2 mb-4">Member Engagement</h2>
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Total members"
            value={String(memberStats.totalLearners)}
          />
          <AdminKpiCard
            label="Active learners"
            value={String(memberStats.activeLearners)}
            hint="Members with at least one module visited"
          />
          <AdminKpiCard
            label="Learner activity rate"
            value={activeLearnerRate}
          />
          <AdminKpiCard
            label="Preview module views"
            value={previewAnalytics.summary.totalViews.toLocaleString()}
            hint="Art of Registry + Nursery + Stroller Equation"
          />
        </div>
      </section>

      {/* ── Academy Paths ───────────────────────────────────────────────────── */}
      <section aria-label="Academy path breakdown">
        <h2 className="admin-h2 mb-4">Academy Paths</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PATH_ORDER.map((pathSlug) => {
            const config = ACADEMY_PATH_CONFIG[pathSlug];
            const stat = memberStats.pathStats.find((p) => p.pathSlug === pathSlug);
            const activeMembers = stat?.activeMembers ?? 0;
            const totalVisits = stat?.totalVisits ?? 0;
            const avgModules = stat?.avgModulesPerMember ?? 0;

            return (
              <AdminSurface key={pathSlug} className="admin-stack gap-3">
                <div>
                  <p className="admin-eyebrow capitalize">{pathSlug} path</p>
                  <p className="text-admin font-semibold mt-1">{config.title}</p>
                  <p className="admin-micro mt-0.5">{config.moduleCount} modules</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="admin-micro">Active members</p>
                    <p className="text-admin font-semibold">{activeMembers}</p>
                  </div>
                  <div>
                    <p className="admin-micro">Total visits</p>
                    <p className="text-admin font-semibold">{totalVisits.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="admin-micro">Avg modules / member</p>
                    <p className="text-admin font-semibold">{avgModules}</p>
                  </div>
                </div>
                {stat && stat.topModules.length > 0 && (
                  <div>
                    <p className="admin-micro mb-1">Most visited</p>
                    {stat.topModules.map((m) => (
                      <p key={m.moduleSlug} className="admin-micro truncate">
                        <span className="font-medium">{m.moduleSlug}</span>
                        <span className="text-[var(--color-text-muted)] ml-1">
                          ({m.visitCount.toLocaleString()})
                        </span>
                      </p>
                    ))}
                  </div>
                )}
              </AdminSurface>
            );
          })}
        </div>
      </section>

      {/* ── Preview Modules ─────────────────────────────────────────────────── */}
      <section aria-label="Preview module analytics">
        <h2 className="admin-h2 mb-1">Preview Modules</h2>
        <p className="admin-micro mb-4 text-[var(--color-text-muted)]">
          Public free lessons — The Art of the Registry, Nursery Foundations, The Stroller
          Equation. Views are tracked on first visit per browser session.
        </p>

        {previewAnalytics.storageReady ? (
          <>
            <div className="admin-kpi-grid mb-6">
              <AdminKpiCard
                label="Total preview views"
                value={previewAnalytics.summary.totalViews.toLocaleString()}
              />
              <AdminKpiCard
                label="Unique visitors"
                value={previewAnalytics.summary.totalUniqueVisitors.toLocaleString()}
              />
              <AdminKpiCard
                label="Preview conversions"
                value={previewAnalytics.summary.totalConsultationClicks.toLocaleString()}
                hint="Consultation clicks from preview pages"
              />
              <AdminKpiCard
                label="Affiliate clicks"
                value={previewAnalytics.summary.totalAffiliateClicks.toLocaleString()}
              />
            </div>

            <AdminSurface className="admin-stack">
              <AdminTable
                density="compact"
                columns={[
                  { key: 'lesson', label: 'Free Preview Lesson' },
                  { key: 'url', label: 'URL' },
                  { key: 'views', label: 'Views', align: 'right' },
                  { key: 'unique', label: 'Unique Visitors', align: 'right' },
                  { key: 'conversions', label: 'Conversions', align: 'right' },
                  { key: 'affiliate', label: 'Affiliate Clicks', align: 'right' },
                ]}
                emptyState={
                  <p className="admin-body p-6">
                    No preview module views yet. Data populates after the first visit to each
                    lesson.
                  </p>
                }
              >
                {previewAnalytics.topGuides.map((guide) => (
                  <tr key={guide.guideId} className="admin-row">
                    <td className="text-admin">
                      {PREVIEW_MODULE_LABELS[guide.slug] ?? guide.title}
                    </td>
                    <td>
                      <Link
                        href={guide.canonicalUrl ?? `/learn/${guide.slug.replace('preview-', '')}`}
                        target="_blank"
                        className="admin-micro underline underline-offset-2"
                      >
                        {guide.canonicalUrl ?? `/learn/${guide.slug.replace('preview-', '')}`}
                      </Link>
                    </td>
                    <td className="text-right text-admin">{guide.views.toLocaleString()}</td>
                    <td className="text-right text-admin">
                      {guide.uniqueVisitors.toLocaleString()}
                    </td>
                    <td className="text-right text-admin">
                      {guide.consultationClicks.toLocaleString()}
                    </td>
                    <td className="text-right text-admin">
                      {guide.affiliateClicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </AdminSurface>
          </>
        ) : (
          <GuideStorageNotice backHref="/admin/academy/analytics" />
        )}
      </section>

      {/* ── Academy Content Metrics (Guide-model analytics) ─────────────────── */}
      {academyAnalytics.storageReady ? (
        <>
          <section aria-label="Academy content metrics">
            <h2 className="admin-h2 mb-4">Academy Content Metrics</h2>
            <div className="admin-kpi-grid">
              <AdminKpiCard
                label="Academy modules"
                value={String(academyAnalytics.summary.totalGuides)}
              />
              <AdminKpiCard
                label="Published modules"
                value={String(academyAnalytics.summary.publishedGuides)}
              />
              <AdminKpiCard
                label="Total views"
                value={academyAnalytics.summary.totalViews.toLocaleString()}
              />
              <AdminKpiCard
                label="Total actions"
                value={academyAnalytics.summary.totalEngagement.toLocaleString()}
              />
              <AdminKpiCard
                label="Consultation conversions"
                value={academyAnalytics.summary.totalConsultationClicks.toLocaleString()}
              />
              <AdminKpiCard label="Conversion rate" value={academyConversionRate} />
              <AdminKpiCard
                label="Contact clicks"
                value={academyAnalytics.summary.totalContactClicks.toLocaleString()}
              />
              <AdminKpiCard
                label="Affiliate clicks"
                value={academyAnalytics.summary.totalAffiliateClicks.toLocaleString()}
              />
            </div>
          </section>

          <GuideAnalyticsCharts
            topGuides={academyAnalytics.topGuides.map((guide) => ({
              label: guide.title,
              views: guide.views,
              consultationClicks: guide.consultationClicks,
            }))}
            categoryPerformance={academyAnalytics.categoryPerformance.map((entry) => ({
              category: entry.category,
              views: entry.views,
              consultationClicks: entry.consultationClicks,
            }))}
            entityLabel="Academy module"
            entityLabelPlural="Academy Modules"
          />

          <AdminSurface className="admin-stack">
            <h2 className="admin-h2">Top Academy Modules</h2>
            <AdminTable
              density="compact"
              columns={[
                { key: 'content', label: 'Module' },
                { key: 'category', label: 'Category' },
                { key: 'views', label: 'Views', align: 'right' },
                { key: 'conversions', label: 'Conversions', align: 'right' },
                { key: 'contact', label: 'Contact', align: 'right' },
                { key: 'services', label: 'Services', align: 'right' },
                { key: 'affiliate', label: 'Affiliate', align: 'right' },
              ]}
              emptyState={<p className="admin-body p-6">No academy analytics yet.</p>}
            >
              {academyAnalytics.topGuides.map((guide) => (
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
                  <td className="text-right text-admin">
                    {guide.consultationClicks.toLocaleString()}
                  </td>
                  <td className="text-right text-admin">{guide.contactClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">
                    {guide.servicesClicks.toLocaleString()}
                  </td>
                  <td className="text-right text-admin">
                    {guide.affiliateClicks.toLocaleString()}
                  </td>
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
                  { key: 'content', label: 'Module' },
                  { key: 'clicks', label: 'Clicks', align: 'right' },
                ]}
                emptyState={<p className="admin-body p-6">No affiliate module clicks yet.</p>}
              >
                {academyAnalytics.topAffiliateSections.map((section) => (
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
                  { key: 'records', label: 'Modules', align: 'right' },
                  { key: 'views', label: 'Views', align: 'right' },
                  { key: 'conversions', label: 'Conversions', align: 'right' },
                  { key: 'contact', label: 'Contact', align: 'right' },
                ]}
                emptyState={<p className="admin-body p-6">No category data yet.</p>}
              >
                {academyAnalytics.categoryPerformance.map((entry) => (
                  <tr key={entry.category} className="admin-row">
                    <td className="text-admin">{entry.category}</td>
                    <td className="text-right text-admin">{entry.guideCount.toLocaleString()}</td>
                    <td className="text-right text-admin">{entry.views.toLocaleString()}</td>
                    <td className="text-right text-admin">
                      {entry.consultationClicks.toLocaleString()}
                    </td>
                    <td className="text-right text-admin">
                      {entry.contactClicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </AdminSurface>
          </div>

          <AdminSurface className="admin-stack">
            <h2 className="admin-h2">Recently Published</h2>
            <AdminTable
              density="compact"
              columns={[
                { key: 'content', label: 'Module' },
                { key: 'published', label: 'Published' },
                { key: 'views', label: 'Views', align: 'right' },
                { key: 'conversions', label: 'Conversions', align: 'right' },
                { key: 'contact', label: 'Contact', align: 'right' },
                { key: 'services', label: 'Services', align: 'right' },
                { key: 'affiliate', label: 'Affiliate', align: 'right' },
              ]}
              emptyState={<p className="admin-body p-6">No published modules yet.</p>}
            >
              {academyAnalytics.recentlyPublished.map((guide) => (
                <tr key={guide.guideId} className="admin-row">
                  <td>
                    <div className="admin-stack gap-1">
                      <p className="text-admin">{guide.title}</p>
                      <span className="admin-micro">{guide.category}</span>
                    </div>
                  </td>
                  <td className="admin-micro">{formatDateTime(guide.publishedAt)}</td>
                  <td className="text-right text-admin">{guide.views.toLocaleString()}</td>
                  <td className="text-right text-admin">
                    {guide.consultationClicks.toLocaleString()}
                  </td>
                  <td className="text-right text-admin">{guide.contactClicks.toLocaleString()}</td>
                  <td className="text-right text-admin">
                    {guide.servicesClicks.toLocaleString()}
                  </td>
                  <td className="text-right text-admin">
                    {guide.affiliateClicks.toLocaleString()}
                  </td>
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
