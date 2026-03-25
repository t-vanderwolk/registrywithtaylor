import type { ReactNode } from 'react';
import AffiliateAnalyticsCharts from '@/components/dashboard/affiliate/AffiliateAnalyticsCharts';
import { getAffiliateAnalyticsDashboard } from '@/lib/server/affiliateAnalyticsDashboard';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

function DashboardCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(252,246,248,0.96)_100%)] p-5 shadow-[0_18px_44px_rgba(58,36,43,0.06)] sm:p-6">
      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/68">{label}</p>
      <p className="mt-3 font-serif text-[2rem] leading-none tracking-[-0.04em] text-charcoal sm:text-[2.35rem]">{value}</p>
      {hint ? <p className="mt-3 text-sm leading-relaxed text-charcoal/68">{hint}</p> : null}
    </div>
  );
}

function DashboardTable({
  title,
  eyebrow,
  columns,
  children,
}: {
  title: string;
  eyebrow: string;
  columns: string[];
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.96)_100%)] shadow-[0_18px_44px_rgba(58,36,43,0.06)]">
      <div className="border-b border-[rgba(215,161,175,0.14)] px-5 py-5 sm:px-6">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/68">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-[1.45rem] tracking-[-0.03em] text-charcoal">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[rgba(252,244,247,0.8)] text-left">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-charcoal/60 sm:px-6"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}

export default async function AffiliateDashboardPage() {
  await requireAdminSession('/dashboard/affiliate');
  const analytics = await getAffiliateAnalyticsDashboard();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf8_0%,#fdf4f6_52%,#f7efe8_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.96)_48%,rgba(249,241,236,0.98)_100%)] p-6 shadow-[0_24px_60px_rgba(58,36,43,0.08)] sm:p-8">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/68">Affiliate Analytics</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.4rem] leading-[0.98] tracking-[-0.05em] text-charcoal sm:text-[3.2rem]">
            Revenue signals, without the shrug.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-charcoal/72 sm:text-[1.05rem]">
            This dashboard standardizes affiliate click tracking across the site, then rolls it into product, brand,
            and guide-level summaries you can actually use.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-[rgba(215,161,175,0.2)] bg-white/88 px-4 py-2 text-sm text-charcoal/70 shadow-[0_10px_24px_rgba(58,36,43,0.05)]">
            Using the mock aggregation layer for now. The data contract is ready to swap to GA4, Supabase, or
            Postgres-backed events later.
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            label="Total Affiliate Clicks"
            value={analytics.summary.totalAffiliateClicks.toLocaleString()}
            hint="All tracked affiliate_click events in the current snapshot."
          />
          <DashboardCard
            label="Top Product"
            value={analytics.summary.topProduct?.label ?? '—'}
            hint={analytics.summary.topProduct ? `${analytics.summary.topProduct.clicks} clicks` : 'Waiting on click data.'}
          />
          <DashboardCard
            label="Top Brand"
            value={analytics.summary.topBrand?.label ?? '—'}
            hint={analytics.summary.topBrand ? `${analytics.summary.topBrand.clicks} clicks` : 'Waiting on click data.'}
          />
          <DashboardCard
            label="Top Guide"
            value={analytics.summary.topGuide?.label ?? '—'}
            hint={analytics.summary.topGuide ? `${analytics.summary.topGuide.clicks} clicks` : 'Waiting on click data.'}
          />
        </section>

        {!analytics.hasData ? (
          <section className="rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-10 text-center shadow-[0_18px_44px_rgba(58,36,43,0.06)]">
            <p className="font-serif text-[1.7rem] tracking-[-0.03em] text-charcoal">No affiliate data yet — interactions will appear here.</p>
          </section>
        ) : (
          <>
            <AffiliateAnalyticsCharts
              clicksOverTime={analytics.clicksOverTime}
              productChart={analytics.productChart}
              brandChart={analytics.brandChart}
            />

            <section className="grid gap-5 xl:grid-cols-3">
              <DashboardTable title="Top products" eyebrow="Products" columns={['Product', 'Clicks', 'Conversion Proxy']}>
                {analytics.topProducts.slice(0, 8).map((row) => (
                  <tr key={row.product} className="border-t border-[rgba(215,161,175,0.12)]">
                    <td className="px-5 py-4 text-sm font-medium text-charcoal sm:px-6">{row.product}</td>
                    <td className="px-5 py-4 text-sm text-charcoal/78 sm:px-6">{row.clicks.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-charcoal/78 sm:px-6">{formatPercent(row.clickShare)}</td>
                  </tr>
                ))}
              </DashboardTable>

              <DashboardTable title="Top guides" eyebrow="Guides" columns={['Guide', 'Clicks', 'Avg Clicks / Session']}>
                {analytics.topGuides.slice(0, 8).map((row) => (
                  <tr key={row.guide} className="border-t border-[rgba(215,161,175,0.12)]">
                    <td className="px-5 py-4 text-sm font-medium text-charcoal sm:px-6">{row.guide}</td>
                    <td className="px-5 py-4 text-sm text-charcoal/78 sm:px-6">{row.clicks.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-charcoal/78 sm:px-6">{row.avgClicksPerSession.toFixed(2)}</td>
                  </tr>
                ))}
              </DashboardTable>

              <DashboardTable title="Top brands" eyebrow="Brands" columns={['Brand', 'Total Clicks']}>
                {analytics.topBrands.slice(0, 8).map((row) => (
                  <tr key={row.brand} className="border-t border-[rgba(215,161,175,0.12)]">
                    <td className="px-5 py-4 text-sm font-medium text-charcoal sm:px-6">{row.brand}</td>
                    <td className="px-5 py-4 text-sm text-charcoal/78 sm:px-6">{row.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </DashboardTable>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
