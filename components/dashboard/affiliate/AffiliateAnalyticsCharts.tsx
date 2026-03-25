'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AffiliateAnalyticsDashboardSnapshot } from '@/lib/server/affiliateAnalyticsDashboard';

type AffiliateAnalyticsChartsProps = Pick<
  AffiliateAnalyticsDashboardSnapshot,
  'clicksOverTime' | 'productChart' | 'brandChart'
>;

const shortLabel = (value: string, maxLength = 22) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;

const tooltipStyle = {
  borderRadius: '20px',
  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 18px 44px rgba(58,36,43,0.10)',
  backgroundColor: 'rgba(255,255,255,0.98)',
};

const tickStyle = {
  fontSize: 12,
};

export default function AffiliateAnalyticsCharts({
  clicksOverTime,
  productChart,
  brandChart,
}: AffiliateAnalyticsChartsProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <div className="xl:col-span-2 rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.96)_100%)] p-5 shadow-[0_18px_44px_rgba(58,36,43,0.06)] sm:p-6">
        <div className="space-y-1">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70">Clicks Over Time</p>
          <h2 className="font-serif text-[1.45rem] tracking-[-0.03em] text-charcoal">Affiliate click trend</h2>
        </div>
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clicksOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={tickStyle} minTickGap={28} />
              <YAxis allowDecimals={false} tick={tickStyle} width={36} />
              <Tooltip
                formatter={(value) => [`${value} clicks`, 'Clicks']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={tooltipStyle}
              />
              <Line type="monotone" dataKey="clicks" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.96)_100%)] p-5 shadow-[0_18px_44px_rgba(58,36,43,0.06)] sm:p-6">
        <div className="space-y-1">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70">Top Products</p>
          <h2 className="font-serif text-[1.45rem] tracking-[-0.03em] text-charcoal">What gets the click</h2>
        </div>
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productChart.map((row) => ({ ...row, shortLabel: shortLabel(row.label) }))}
              margin={{ top: 8, right: 8, left: 0, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="shortLabel" tick={tickStyle} interval={0} angle={-18} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={tickStyle} width={36} />
              <Tooltip
                formatter={(value) => [`${value} clicks`, 'Clicks']}
                labelFormatter={(_label, payload) => payload?.[0]?.payload?.label ?? 'Product'}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="clicks" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.96)_100%)] p-5 shadow-[0_18px_44px_rgba(58,36,43,0.06)] sm:p-6">
        <div className="space-y-1">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/70">Top Brands</p>
          <h2 className="font-serif text-[1.45rem] tracking-[-0.03em] text-charcoal">Brands that keep showing up</h2>
        </div>
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={brandChart.map((row) => ({ ...row, shortLabel: shortLabel(row.label) }))}
              margin={{ top: 8, right: 8, left: 0, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="shortLabel" tick={tickStyle} interval={0} angle={-18} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={tickStyle} width={36} />
              <Tooltip
                formatter={(value) => [`${value} clicks`, 'Clicks']}
                labelFormatter={(_label, payload) => payload?.[0]?.payload?.label ?? 'Brand'}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="clicks" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
