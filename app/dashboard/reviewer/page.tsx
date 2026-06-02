import Link from 'next/link';
import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import { AFFILIATE_NETWORK_LABELS, formatAffiliateNetworks } from '@/lib/affiliateBrands';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';
import { BLOG_STAGES, BLOG_STAGE_LABELS, type BlogStageValue } from '@/lib/blog/postStage';
import { getAcademyHomeData, getAcademyPathData, getAcademyPathSlugs } from '@/lib/academy/content';
import { servicePackages } from '@/lib/marketing/siteContent';
import { getBlogRevenueAnalytics } from '@/lib/server/blogRevenueAnalytics';
import { getGuideAnalyticsDashboard } from '@/lib/server/guideAnalytics';
import prisma from '@/lib/server/prisma';
import { listPlannerPosts } from '@/lib/server/adminBlog';
import { listAdminAffiliatePartners } from '@/lib/server/affiliatePartners';
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
    plannerPosts,
    affiliatePartners,
    affiliateBrands,
    shortLinks,
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
    listPlannerPosts(),
    listAdminAffiliatePartners(),
    prisma.brand.findMany({
      orderBy: [{ name: 'asc' }],
      include: {
        programs: {
          orderBy: [{ network: 'asc' }, { createdAt: 'asc' }],
          include: {
            links: {
              where: { code: null },
              orderBy: [{ createdAt: 'asc' }],
            },
          },
        },
        legacyPartners: {
          orderBy: [{ network: 'asc' }, { name: 'asc' }],
          select: {
            id: true,
            name: true,
            network: true,
            commissionRate: true,
            isActive: true,
            logoUrl: true,
            affiliateLink: true,
          },
        },
      },
    }),
    prisma.affiliateLink.findMany({
      where: { code: { not: null } },
      orderBy: { createdAt: 'desc' },
      include: {
        partner: { select: { id: true, name: true, network: true } },
        program: {
          select: {
            id: true,
            network: true,
            brand: { select: { id: true, name: true } },
          },
        },
        _count: { select: { clicks: true } },
        clicks: {
          select: { createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
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

  const plannerByStage = BLOG_STAGES.reduce<Record<BlogStageValue, typeof plannerPosts>>((acc, stage) => {
    acc[stage] = plannerPosts.filter((post) => post.stage === stage);
    return acc;
  }, {} as Record<BlogStageValue, typeof plannerPosts>);

  const siteOrigin = process.env.NEXTAUTH_URL?.replace(/\/$/, '') || '';

  const formatLinkDate = (value: Date | null | undefined) => {
    if (!value) return '—';
    return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
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

        {/* Content Planner — read-only pipeline */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="Publish"
            title="Content planner"
            subtitle="Read-only view of the post pipeline across all stages."
            actions={
              <AdminButton asChild variant="secondary">
                <Link href="/admin/blog/planner">Open full planner</Link>
              </AdminButton>
            }
          />
          <div className="grid gap-4 xl:grid-cols-3">
            {BLOG_STAGES.map((stage) => (
              <AdminSurface key={stage} variant="muted" className="admin-stack gap-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="admin-eyebrow">{BLOG_STAGE_LABELS[stage]}</p>
                  <span className="admin-chip">{plannerByStage[stage].length}</span>
                </div>
                {plannerByStage[stage].length === 0 ? (
                  <p className="admin-micro">No posts in this stage.</p>
                ) : (
                  <div className="admin-stack gap-2">
                    {plannerByStage[stage].map((post) => (
                      <div
                        key={post.id}
                        className="rounded-[20px] border border-[var(--admin-color-border)] bg-white p-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="admin-stack gap-0.5 min-w-0">
                            <p className="text-sm font-medium text-admin truncate">{post.title}</p>
                            <p className="admin-micro">{post.category}</p>
                            {post.focusKeyword ? <span className="admin-chip">{post.focusKeyword}</span> : null}
                          </div>
                          <StatusPill status={post.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminSurface>
            ))}
          </div>
        </AdminSurface>

        {/* Affiliate Canon — brand catalog read-only */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="Affiliate Partners"
            title="Brand and network management"
            subtitle="Read-only view of canonical brands, affiliate programs, and destination links."
            actions={
              <AdminButton asChild variant="secondary">
                <Link href="/admin/affiliates">Open affiliate canon</Link>
              </AdminButton>
            }
          />
          {affiliateBrands.length === 0 ? (
            <p className="admin-micro">No affiliate brands yet.</p>
          ) : (
            <AdminTable
              density="comfortable"
              columns={[
                { key: 'brand', label: 'Brand' },
                { key: 'programs', label: 'Programs' },
                { key: 'links', label: 'Links' },
                { key: 'legacy', label: 'Legacy partner map' },
              ]}
            >
              {affiliateBrands.map((brand) => {
                const programNetworks = brand.programs.map((p) => p.network);
                return (
                  <tr key={brand.id} className="admin-row">
                    <td>
                      <div className="admin-stack gap-2">
                        <AffiliatePartnerIdentity
                          name={brand.name}
                          logoUrl={brand.logoUrl}
                          meta={brand.website ? brand.website.replace(/^https?:\/\//, '') : null}
                        />
                        {programNetworks.length > 0 ? (
                          <p className="admin-micro">{formatAffiliateNetworks(programNetworks)}</p>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div className="admin-stack gap-2">
                        {brand.programs.length === 0 ? (
                          <span className="admin-micro">No programs</span>
                        ) : (
                          brand.programs.map((program) => (
                            <div key={program.id} className="admin-stack gap-1">
                              <p className="text-admin">
                                {AFFILIATE_NETWORK_LABELS[program.network]}
                                {program.campaignId ? ` • ${program.campaignId}` : ''}
                              </p>
                              <p className="admin-micro">
                                {program.commission ?? 'Commission pending'}
                                {program.cookieLength ? ` • ${program.cookieLength}` : ''}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-stack gap-2">
                        {brand.programs.flatMap((p) => p.links).length === 0 ? (
                          <span className="admin-micro">No canonical links</span>
                        ) : (
                          brand.programs.flatMap((p) =>
                            p.links.map((link) => (
                              <div key={link.id} className="admin-stack gap-1">
                                <p className="text-admin">{link.name ?? 'Shop'}</p>
                                <p className="admin-micro break-all">{link.url ?? link.destinationUrl ?? '—'}</p>
                              </div>
                            )),
                          )
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-stack gap-2">
                        {brand.legacyPartners.length === 0 ? (
                          <span className="admin-micro">No legacy partner mappings</span>
                        ) : (
                          brand.legacyPartners.map((partner) => (
                            <AffiliatePartnerIdentity
                              key={partner.id}
                              name={partner.name}
                              network={partner.network}
                              logoUrl={partner.logoUrl}
                              size="sm"
                              showNetwork
                              meta={partner.isActive ? partner.commissionRate : 'Inactive'}
                            />
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          )}
        </AdminSurface>

        {/* Affiliate Partners — partner cards read-only */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="Monetize"
            title="Affiliate partners"
            subtitle="Read-only view of partner tiers, networks, routing priority, and commission rates."
            actions={
              <AdminButton asChild variant="secondary">
                <Link href="/admin/partners">Open partners</Link>
              </AdminButton>
            }
          />
          {affiliatePartners.length === 0 ? (
            <p className="admin-micro">No affiliate partners yet.</p>
          ) : (
            <AdminTable
              density="comfortable"
              columns={[
                { key: 'partner', label: 'Partner' },
                { key: 'tier', label: 'Tier' },
                { key: 'commission', label: 'Commission' },
                { key: 'priority', label: 'Priority', align: 'right' },
                { key: 'contexts', label: 'Contexts' },
                { key: 'status', label: 'Status' },
              ]}
            >
              {affiliatePartners.map((partner) => (
                <tr key={partner.id} className="admin-row">
                  <td>
                    <AffiliatePartnerIdentity
                      name={partner.name}
                      network={partner.network}
                      logoUrl={partner.logoUrl}
                      showNetwork
                      meta={partner.partnerType}
                    />
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <span className="admin-chip">{partner.affiliateTier}</span>
                      {partner.paymentRisk ? <span className="admin-chip admin-chip--draft">Risk</span> : null}
                    </div>
                  </td>
                  <td className="admin-micro">{partner.commissionRate}</td>
                  <td className="text-right admin-micro">{partner.routingPriority}</td>
                  <td className="admin-micro">{partner.allowedContexts.join(', ') || 'all'}</td>
                  <td className="admin-micro">{partner.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminSurface>

        {/* Short Links — read-only link table */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="Affiliate Links"
            title="Short links"
            subtitle="Read-only view of generated affiliate short links and click performance."
            actions={
              <AdminButton asChild variant="secondary">
                <Link href="/admin/affiliate-links">Open short links</Link>
              </AdminButton>
            }
          />
          <AdminTable
            density="comfortable"
            columns={[
              { key: 'link', label: 'Short URL' },
              { key: 'partner', label: 'Partner' },
              { key: 'context', label: 'Context' },
              { key: 'clicks', label: 'Clicks', align: 'right' },
              { key: 'lastClicked', label: 'Last clicked', align: 'right' },
            ]}
          >
            {shortLinks.map((link) => {
              const shortUrl = siteOrigin ? `${siteOrigin}/r/${link.code!}` : `/r/${link.code!}`;
              const lastClickedAt = link.clicks[0]?.createdAt ?? null;
              return (
                <tr key={link.id} className="admin-row">
                  <td>
                    <div className="admin-stack gap-1">
                      <Link href={shortUrl} target="_blank" className="admin-table-code hover:opacity-80">
                        {shortUrl}
                      </Link>
                      <p className="admin-micro truncate">→ {link.destinationUrl ?? link.url ?? '—'}</p>
                    </div>
                  </td>
                  <td>
                    {link.partner ? (
                      <AffiliatePartnerIdentity name={link.partner.name} network={link.partner.network} size="sm" />
                    ) : link.program ? (
                      <AffiliatePartnerIdentity name={link.program.brand.name} network={link.program.network} size="sm" />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="admin-micro">{link.label || '—'}</td>
                  <td className="text-right">{link._count.clicks}</td>
                  <td className="text-right admin-micro">{formatLinkDate(lastClickedAt)}</td>
                </tr>
              );
            })}
          </AdminTable>
        </AdminSurface>

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
