import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { getAcademyHomeData, getAcademyPathData, getAcademyPathSlugs } from '@/lib/academy/content';
import { servicePackages } from '@/lib/marketing/siteContent';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';
import { getGuideAnalyticsDashboard } from '@/lib/server/guideAnalytics';
import prisma from '@/lib/server/prisma';
import { requireAdminViewSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

const funnelStages = [
  {
    stage: 'Learn',
    route: '/academy',
    focus: 'Public education, Academy hubs, blog guides, and decision context.',
  },
  {
    stage: 'Plan',
    route: '/services',
    focus: 'Service positioning, offer comparison, registry and gear planning paths.',
  },
  {
    stage: 'Connect',
    route: '/consultation',
    focus: 'Consultation request flow, contact forms, and conversion handoff.',
  },
  {
    stage: 'Reflect',
    route: '/blog',
    focus: 'Editorial follow-through, content performance, and ongoing trust signals.',
  },
] as const;

const dashboardPreviews = [
  {
    name: 'Member Dashboard Preview',
    route: '/dashboard/reviewer#member-preview',
    focus: 'Progress cards, Academy path navigation, saved decisions, and next-step guidance.',
  },
  {
    name: 'Mentor Dashboard Preview',
    route: '/dashboard/reviewer#mentor-preview',
    focus: 'Workflow structure, client queues, session preparation, and follow-up rhythm using anonymized examples.',
  },
  {
    name: 'Admin Dashboard Preview',
    route: '/admin',
    focus: 'Navigation, aggregate metrics, content architecture, and analytics summaries without administrative controls.',
  },
] as const;

const roleMatrix = [
  { role: 'Admin', read: 'Yes', create: 'Yes', update: 'Yes', delete: 'Yes' },
  { role: 'Mentor', read: 'Not yet scoped', create: 'Not yet scoped', update: 'Not yet scoped', delete: 'No' },
  { role: 'Member', read: 'Public/member content', create: 'Own submissions', update: 'Own submissions', delete: 'Own submissions' },
  { role: 'Reviewer', read: 'Safe aggregate and content views', create: 'No', update: 'No', delete: 'No' },
] as const;

function statusCountLabel(status: PostStatusValue) {
  return POST_STATUS_LABELS[status] ?? status;
}

export default async function ReviewerDashboardPage() {
  const session = await requireAdminViewSession('/dashboard/reviewer');
  const isReviewerMode = session.user.role === 'REVIEWER';
  const academyHome = getAcademyHomeData();
  const academyPaths = await Promise.all(getAcademyPathSlugs().map((slug) => getAcademyPathData(slug)));

  const [
    totalPosts,
    postsByStatus,
    guideAnalytics,
    revenueAnalytics,
    consultationStatusCounts,
    inquiryStatusCounts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    getGuideAnalyticsDashboard({ scope: 'all' }),
    getBlogRevenueAnalytics(),
    prisma.consultationRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.contactInquiry.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ]);

  const blogStatusCounts = postsByStatus.reduce<Record<PostStatusValue, number>>(
    (acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    },
    { DRAFT: 0, SCHEDULED: 0, PUBLISHED: 0, ARCHIVED: 0 },
  );
  const consultationTotal = consultationStatusCounts.reduce((sum, row) => sum + row._count._all, 0);
  const inquiryTotal = inquiryStatusCounts.reduce((sum, row) => sum + row._count._all, 0);
  const moduleCount = academyPaths.reduce((sum, path) => sum + path.moduleCards.length, 0);
  const academyConversionRate =
    guideAnalytics.summary.totalViews > 0
      ? `${((guideAnalytics.summary.totalConsultationClicks / guideAnalytics.summary.totalViews) * 100).toFixed(1)}%`
      : '0.0%';

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">
        {isReviewerMode ? (
          <div className="admin-reviewer-banner" role="status">
            <span>Reviewer Mode · Read-only Access</span>
            <span>This area uses safe summaries, public content structure, and anonymized dashboard previews.</span>
          </div>
        ) : null}

        <AdminHeader
          eyebrow="Reviewer Home"
          title="Platform audit dashboard"
          subtitle="A read-only map of the Academy, dashboards, funnel structure, content system, and aggregate performance signals."
          actions={
            <>
              <AdminButton asChild variant="primary">
                <Link href="/admin">Admin preview</Link>
              </AdminButton>
              <AdminButton asChild variant="secondary">
                <Link href="/">Public site</Link>
              </AdminButton>
            </>
          }
        />

        <section className="admin-kpi-grid" aria-label="Reviewer audit summary">
          <AdminKpiCard label="Academy paths" value={String(academyHome.paths.length)} hint={`${moduleCount} core modules`} />
          <AdminKpiCard label="Academy views" value={guideAnalytics.summary.totalViews.toLocaleString()} hint="Aggregate only" />
          <AdminKpiCard label="Blog posts" value={String(totalPosts)} hint={`${blogStatusCounts.PUBLISHED} published`} />
          <AdminKpiCard label="Affiliate clicks" value={revenueAnalytics.summary.totalAffiliateClicks.toLocaleString()} hint="Summary totals" />
          <AdminKpiCard label="Consult requests" value={consultationTotal.toLocaleString()} hint="Status totals only" />
          <AdminKpiCard label="Contact inquiries" value={inquiryTotal.toLocaleString()} hint="Status totals only" />
        </section>

        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="Academy Overview"
            title="Path map and module structure"
            subtitle={academyHome.description}
            actions={
              <AdminButton asChild variant="secondary">
                <Link href="/academy">Open public Academy</Link>
              </AdminButton>
            }
          />
          <AdminTable
            density="compact"
            columns={[
              { key: 'path', label: 'Path' },
              { key: 'modules', label: 'Modules', align: 'right' },
              { key: 'sample', label: 'First module' },
              { key: 'focus', label: 'Structure' },
            ]}
          >
            {academyPaths.map((path) => (
              <tr key={path.slug} className="admin-row">
                <td>
                  <Link href={path.href} className="text-admin underline underline-offset-2">
                    {path.title}
                  </Link>
                </td>
                <td className="text-right text-admin">{path.moduleCards.length}</td>
                <td className="admin-micro">{path.moduleCards[0]?.title ?? 'No modules'}</td>
                <td className="admin-micro">{path.shortDescription}</td>
              </tr>
            ))}
          </AdminTable>
        </AdminSurface>

        <div className="grid gap-4 xl:grid-cols-2">
          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Dashboard Architecture" title="Preview surfaces" />
            <div className="admin-stack gap-3">
              {dashboardPreviews.map((preview, index) => (
                <div
                  key={preview.name}
                  id={index === 0 ? 'member-preview' : index === 1 ? 'mentor-preview' : undefined}
                  className="rounded-[20px] border border-[var(--admin-color-border)] bg-white/78 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="admin-stack gap-1">
                      <h2 className="admin-h2 text-[1.2rem]">{preview.name}</h2>
                      <p className="admin-body">{preview.focus}</p>
                    </div>
                    <AdminButton asChild variant="ghost" size="sm">
                      <Link href={preview.route}>Open</Link>
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          </AdminSurface>

          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Analytics Summary" title="Aggregate signals" />
            <section className="admin-kpi-grid md:grid-cols-2" aria-label="Reviewer analytics summary">
              <AdminKpiCard label="Academy actions" value={guideAnalytics.summary.totalEngagement.toLocaleString()} />
              <AdminKpiCard label="Academy conversions" value={guideAnalytics.summary.totalConsultationClicks.toLocaleString()} />
              <AdminKpiCard label="Academy conversion rate" value={academyConversionRate} />
              <AdminKpiCard label="Estimated revenue" value={`$${Math.round(revenueAnalytics.summary.totalEstimatedRevenue).toLocaleString()}`} />
            </section>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/analytics">Open analytics summary</Link>
            </AdminButton>
          </AdminSurface>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Content Overview" title="Blog, Academy, and services" />
            <AdminTable
              density="compact"
              columns={[
                { key: 'area', label: 'Area' },
                { key: 'summary', label: 'Summary' },
                { key: 'route', label: 'Route' },
              ]}
            >
              <tr className="admin-row">
                <td className="text-admin">Blog</td>
                <td className="admin-micro">
                  {Object.entries(blogStatusCounts)
                    .map(([status, count]) => `${statusCountLabel(status as PostStatusValue)}: ${count}`)
                    .join(' · ')}
                </td>
                <td>
                  <Link href="/admin/blog" className="admin-table-code underline underline-offset-2">
                    /admin/blog
                  </Link>
                </td>
              </tr>
              <tr className="admin-row">
                <td className="text-admin">Academy</td>
                <td className="admin-micro">
                  {academyHome.paths.length} paths · {moduleCount} core modules · {guideAnalytics.summary.totalGuides} learning records
                </td>
                <td>
                  <Link href="/admin/academy" className="admin-table-code underline underline-offset-2">
                    /admin/academy
                  </Link>
                </td>
              </tr>
              <tr className="admin-row">
                <td className="text-admin">Services</td>
                <td className="admin-micro">{servicePackages.length} primary packages on the public services page</td>
                <td>
                  <Link href="/services" className="admin-table-code underline underline-offset-2">
                    /services
                  </Link>
                </td>
              </tr>
            </AdminTable>
          </AdminSurface>

          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Funnel Overview" title="Learn, plan, connect, reflect" />
            <AdminTable
              density="compact"
              columns={[
                { key: 'stage', label: 'Stage' },
                { key: 'route', label: 'Route' },
                { key: 'focus', label: 'Review focus' },
              ]}
            >
              {funnelStages.map((stage) => (
                <tr key={stage.stage} className="admin-row">
                  <td className="text-admin">{stage.stage}</td>
                  <td>
                    <Link href={stage.route} className="admin-table-code underline underline-offset-2">
                      {stage.route}
                    </Link>
                  </td>
                  <td className="admin-micro">{stage.focus}</td>
                </tr>
              ))}
            </AdminTable>
          </AdminSurface>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Reviewer Access Map" title="Allowed and blocked routes" />
            <AdminTable
              density="compact"
              columns={[
                { key: 'type', label: 'Type' },
                { key: 'routes', label: 'Routes' },
              ]}
            >
              <tr className="admin-row">
                <td className="text-admin">Accessible</td>
                <td className="admin-micro">
                  /dashboard/reviewer, /admin, /admin/academy, /admin/blog, /admin/blog/categories, /admin/analytics, /admin/academy/analytics,
                  public site, Academy, blog, services, contact.
                </td>
              </tr>
              <tr className="admin-row">
                <td className="text-admin">Blocked</td>
                <td className="admin-micro">
                  Admin edit/create screens, planner mutations, media deletion/upload, affiliate management, consultations, inquiries, and all POST, PUT, PATCH, DELETE API mutations.
                </td>
              </tr>
            </AdminTable>
          </AdminSurface>

          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Role Matrix" title="Read and mutation permissions" />
            <AdminTable
              density="compact"
              columns={[
                { key: 'role', label: 'Role' },
                { key: 'read', label: 'Read' },
                { key: 'create', label: 'Create' },
                { key: 'update', label: 'Update' },
                { key: 'delete', label: 'Delete' },
              ]}
            >
              {roleMatrix.map((entry) => (
                <tr key={entry.role} className="admin-row">
                  <td className="text-admin">{entry.role}</td>
                  <td className="admin-micro">{entry.read}</td>
                  <td className="admin-micro">{entry.create}</td>
                  <td className="admin-micro">{entry.update}</td>
                  <td className="admin-micro">{entry.delete}</td>
                </tr>
              ))}
            </AdminTable>
          </AdminSurface>
        </div>

        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="UX Review Area"
            title="Read-only audit notes"
            subtitle="Production does not store reviewer notes. Use this area as a visual placeholder for the audit workflow."
          />
          <textarea
            className="admin-textarea min-h-[150px]"
            readOnly
            value={[
              'Reviewer notes are intentionally not saved in production.',
              'Capture UX, positioning, monetization, and journey observations in the external audit document.',
              'That keeps the platform inspection useful without adding another production data surface.',
            ].join('\n\n')}
          />
        </AdminSurface>
      </AdminContainer>
    </main>
  );
}
