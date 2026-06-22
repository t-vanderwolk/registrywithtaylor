import Link from 'next/link';
import prisma from '@/lib/server/prisma';
import { registryDelegate } from '@/lib/server/prismaRegistry';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { getGuideAnalyticsDashboard } from '@/lib/server/guideAnalytics';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import { getNewsletterAnalytics } from '@/lib/server/mailchimp';
import { requireAdminViewSession } from '@/lib/server/session';
import { isAcademyAdminEnabled } from '@/lib/featureFlags';

export const dynamic = 'force-dynamic';

type AdminNavLink = { href: string; label: string; editorOnly?: boolean; academyOnly?: boolean };

// Grouped admin navigation surfaced in the dashboard Quick links.
// editorOnly links are hidden for read-only (reviewer) admins.
const ADMIN_NAV_GROUPS: { title: string; links: AdminNavLink[] }[] = [
  {
    title: 'Content',
    links: [
      { href: '/admin/academy', label: 'Academy', academyOnly: true },
      { href: '/admin/blog', label: 'Blog' },
      { href: '/admin/blog/planner', label: 'Blog planner', editorOnly: true },
      { href: '/admin/guides', label: 'Guides' },
      { href: '/admin/media', label: 'Media library', editorOnly: true },
    ],
  },
  {
    title: 'People',
    links: [
      { href: '/admin/members', label: 'Members' },
      { href: '/admin/consultations', label: 'Consultations' },
      { href: '/admin/inquiries', label: 'Inquiries', editorOnly: true },
    ],
  },
  {
    title: 'Commerce',
    links: [
      { href: '/admin/affiliates', label: 'Affiliates', editorOnly: true },
      { href: '/admin/affiliate-links', label: 'Affiliate links', editorOnly: true },
      { href: '/admin/partners', label: 'Partners', editorOnly: true },
      { href: '/admin/catalog', label: 'Catalog', editorOnly: true },
    ],
  },
  {
    title: 'Insights & tools',
    links: [
      { href: '/admin/analytics', label: 'Analytics' },
      { href: '/admin/academy/analytics', label: 'Academy analytics', academyOnly: true },
      { href: '/admin/babylist', label: 'Babylist SKUs', editorOnly: true },
    ],
  },
];

export default async function AdminDashboardPage() {
  const session = await requireAdminViewSession();
  const readOnly = session.user.role === 'REVIEWER';
  const academyAdminEnabled = isAcademyAdminEnabled();
  const [
    consultationStatusCounts,
    inquiryStatusCounts,
    totalPosts,
    totalGuides,
    blogViews,
    mostViewedPost,
    guideAnalytics,
    newsletter,
    totalRegistries,
    totalMembers,
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
    getNewsletterAnalytics(),
    registryDelegate.count().catch(() => 0),
    prisma.learner.count().catch(() => 0),
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
        title={readOnly ? 'Admin dashboard preview' : 'Admin dashboard'}
        subtitle={
          readOnly
            ? 'Review aggregate workflow, traffic, and architecture signals without opening private customer records.'
            : 'Monitor consultation workflow, tracked web traffic, and the queues that keep the business moving.'
        }
      />

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Consultation Requests</h2>
        <section className="admin-kpi-grid md:grid-cols-3" aria-label="Consultation request metrics">
          <AdminKpiCard label="New Requests" value={String(consultationCountByStatus.new ?? 0)} />
          <AdminKpiCard label="Scheduled" value={String(consultationCountByStatus.scheduled ?? 0)} />
          <AdminKpiCard label="Completed" value={String(consultationCountByStatus.completed ?? 0)} />
        </section>
        {!readOnly ? (
          <div>
            <AdminButton asChild variant="primary">
              <Link href="/admin/consultations">Open consultation inbox</Link>
            </AdminButton>
          </div>
        ) : null}
      </AdminSurface>

      {academyAdminEnabled ? (
        <AdminSurface className="admin-stack gap-5">
          <h2 className="admin-h2">Academy Members</h2>
          <section className="admin-kpi-grid md:grid-cols-3" aria-label="Academy member metrics">
            <AdminKpiCard label="Enrolled Members"       value={String(totalMembers)}    hint="Active learners" />
            <AdminKpiCard label="Registry Submissions"   value={String(totalRegistries)} hint="Total registries saved by members" />
            <AdminKpiCard label="Avg Registries / Member" value={totalMembers > 0 ? (totalRegistries / totalMembers).toFixed(1) : '0'} hint="Engagement indicator" />
          </section>
          {!readOnly ? (
            <div>
              <AdminButton asChild variant="primary">
                <Link href="/admin/members">Open members panel</Link>
              </AdminButton>
            </div>
          ) : null}
        </AdminSurface>
      ) : null}

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Contact Inquiries</h2>
        <section className="admin-kpi-grid md:grid-cols-3" aria-label="Contact inquiry metrics">
          <AdminKpiCard label="New Inquiries" value={String(inquiryCountByStatus.new ?? 0)} />
          <AdminKpiCard label="Reviewed" value={String(inquiryCountByStatus.reviewed ?? 0)} />
          <AdminKpiCard label="Completed" value={String(inquiryCountByStatus.completed ?? 0)} />
        </section>
        {!readOnly ? (
          <div>
            <AdminButton asChild variant="primary">
              <Link href="/admin/inquiries">Open inquiry inbox</Link>
            </AdminButton>
          </div>
        ) : null}
      </AdminSurface>

      <AdminSurface className="admin-stack gap-5">
        <h2 className="admin-h2">Web Traffic</h2>
        <section
          className={`admin-kpi-grid md:grid-cols-3 ${academyAdminEnabled ? 'xl:grid-cols-5' : 'xl:grid-cols-2'}`}
          aria-label="Web traffic metrics"
        >
          <AdminKpiCard
            label="Total Web Traffic"
            value={totalTrackedTraffic.toLocaleString()}
            hint="Tracked blog post and academy views"
          />
          <AdminKpiCard
            label="Blog Views"
            value={totalBlogViews.toLocaleString()}
            hint="Public journal article traffic"
          />
          {academyAdminEnabled ? (
            <>
              <AdminKpiCard
                label="Academy Views"
                value={totalGuideViews.toLocaleString()}
                hint={guideAnalytics.storageReady ? 'Public learning-content traffic' : 'Academy analytics unavailable'}
              />
              <AdminKpiCard
                label="Academy Actions"
                value={guideAnalytics.summary.totalEngagement.toLocaleString()}
                hint="Academy CTA and affiliate clicks"
              />
              <AdminKpiCard
                label="Academy Conversions"
                value={guideAnalytics.summary.totalConsultationClicks.toLocaleString()}
                hint="Consultation clicks from academy content"
              />
            </>
          ) : null}
        </section>
        <div className="admin-stack gap-2">
          <p className="admin-body">
            {mostViewedPost || topGuide
              ? `Top traffic sources: ${
                  mostViewedPost ? `${mostViewedPost.title} (${mostViewedPost.views.toLocaleString()} blog views)` : 'No blog traffic yet'
                } · ${
                  topGuide ? `${topGuide.title} (${topGuide.views.toLocaleString()} academy views)` : 'No academy traffic yet'
                }`
              : 'Traffic totals will start filling in as public blog posts and academy content collect views.'}
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
            <Link href="/admin/academy">{readOnly ? 'Academy structure' : 'Academy editor'}</Link>
          </AdminButton>
          <AdminButton asChild variant="secondary">
            <Link href="/admin/academy/analytics">Academy analytics</Link>
          </AdminButton>
        </div>
      </AdminSurface>

      {newsletter.configured ? (
        <AdminSurface className="admin-stack gap-5">
          <h2 className="admin-h2">Newsletter</h2>

          {newsletter.error ? (
            <p className="admin-micro">{newsletter.error}</p>
          ) : newsletter.audience ? (
            <>
              <section className="admin-kpi-grid md:grid-cols-3 xl:grid-cols-6" aria-label="Newsletter metrics">
                <AdminKpiCard
                  label="Subscribers"
                  value={newsletter.audience.totalSubscribers.toLocaleString()}
                  hint="Active audience"
                />
                <AdminKpiCard
                  label="Unsubscribed"
                  value={newsletter.audience.unsubscribed.toLocaleString()}
                  hint="All-time opt-outs"
                />
                <AdminKpiCard
                  label="Cleaned"
                  value={newsletter.audience.cleaned.toLocaleString()}
                  hint="Bounced or invalid"
                />
                <AdminKpiCard
                  label="Avg open rate"
                  value={`${(newsletter.audience.openRate * 100).toFixed(1)}%`}
                  hint="Across all campaigns"
                />
                <AdminKpiCard
                  label="Avg click rate"
                  value={`${(newsletter.audience.clickRate * 100).toFixed(1)}%`}
                  hint="Across all campaigns"
                />
                <AdminKpiCard
                  label="Campaigns sent"
                  value={newsletter.audience.campaignCount.toLocaleString()}
                  hint={newsletter.audience.lastSubDate ? `Last sub ${new Date(newsletter.audience.lastSubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : undefined}
                />
              </section>

              {newsletter.growthHistory.length > 0 ? (
                <div className="admin-stack gap-3">
                  <p className="admin-eyebrow">Subscriber growth · last {newsletter.growthHistory.length} months</p>
                  <AdminTable
                    density="compact"
                    columns={[
                      { key: 'month', label: 'Month' },
                      { key: 'subscribed', label: 'New', align: 'right' },
                      { key: 'unsubscribed', label: 'Lost', align: 'right' },
                      { key: 'net', label: 'Net', align: 'right' },
                    ]}
                  >
                    {newsletter.growthHistory.map((row) => (
                      <tr key={row.month} className="admin-row">
                        <td className="text-admin">{row.month}</td>
                        <td className="text-right text-admin">+{row.subscribed}</td>
                        <td className="text-right admin-micro">{row.unsubscribed > 0 ? `−${row.unsubscribed}` : '—'}</td>
                        <td className={`text-right text-admin font-medium ${row.net >= 0 ? '' : 'text-rose-600'}`}>
                          {row.net >= 0 ? `+${row.net}` : String(row.net)}
                        </td>
                      </tr>
                    ))}
                  </AdminTable>
                </div>
              ) : null}

              {newsletter.recentCampaigns.length > 0 ? (
                <div className="admin-stack gap-3">
                  <p className="admin-eyebrow">Recent campaigns</p>
                  <AdminTable
                    density="comfortable"
                    columns={[
                      { key: 'campaign', label: 'Campaign' },
                      { key: 'sent', label: 'Sent', align: 'right' },
                      { key: 'opens', label: 'Unique opens', align: 'right' },
                      { key: 'openRate', label: 'Open rate', align: 'right' },
                      { key: 'clicks', label: 'Clicks', align: 'right' },
                      { key: 'clickRate', label: 'Click rate', align: 'right' },
                    ]}
                  >
                    {newsletter.recentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="admin-row">
                        <td>
                          <div className="admin-stack gap-0.5">
                            <p className="text-admin">{campaign.title}</p>
                            {campaign.subjectLine && campaign.subjectLine !== campaign.title ? (
                              <p className="admin-micro">{campaign.subjectLine}</p>
                            ) : null}
                            {campaign.sentAt ? (
                              <p className="admin-micro">
                                {new Date(campaign.sentAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            ) : null}
                          </div>
                        </td>
                        <td className="text-right text-admin">{campaign.emailsSent.toLocaleString()}</td>
                        <td className="text-right text-admin">{campaign.uniqueOpens.toLocaleString()}</td>
                        <td className="text-right text-admin">{`${(campaign.openRate * 100).toFixed(1)}%`}</td>
                        <td className="text-right text-admin">{campaign.clicks.toLocaleString()}</td>
                        <td className="text-right text-admin">{`${(campaign.clickRate * 100).toFixed(1)}%`}</td>
                      </tr>
                    ))}
                  </AdminTable>
                </div>
              ) : null}
            </>
          ) : null}
        </AdminSurface>
      ) : null}

      <AdminSurface variant="muted" className="admin-stack gap-4">
        <p className="admin-eyebrow">Quick links</p>
        <p className="admin-body">Learning content in system: {totalGuides} · Blog posts in system: {totalPosts}</p>
        <div className="admin-stack gap-4">
          {ADMIN_NAV_GROUPS.map((group) => {
            const links = group.links.filter(
              (link) => (!link.editorOnly || !readOnly) && (!link.academyOnly || academyAdminEnabled),
            );
            if (links.length === 0) return null;
            return (
              <div key={group.title} className="admin-stack gap-2">
                <p className="admin-eyebrow opacity-60">{group.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {links.map((link) => (
                    <AdminButton key={link.href} asChild variant="secondary">
                      <Link href={link.href}>{link.label}</Link>
                    </AdminButton>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AdminSurface>
    </AdminStack>
  );
}
