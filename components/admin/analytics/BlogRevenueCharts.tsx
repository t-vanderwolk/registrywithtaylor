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
import AdminSurface from '@/components/admin/ui/AdminSurface';

type RevenueChartsProps = {
  topEarningPosts: Array<{
    label: string;
    estimatedRevenue: number;
  }>;
  revenueOverTime: Array<{
    date: string;
    affiliateClicks: number;
    estimatedRevenue: number;
  }>;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const tickStyle = {
  fill: 'rgba(0, 0, 0, 0.62)',
  fontSize: 12,
};

const formatTooltipCurrency = (value: number | string | ReadonlyArray<number | string> | undefined) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
  return currencyFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
};

export default function BlogRevenueCharts({
  topEarningPosts,
  revenueOverTime,
}: RevenueChartsProps) {
  const barData = topEarningPosts.map((post) => ({
    ...post,
    shortLabel: post.label.length > 26 ? `${post.label.slice(0, 23)}...` : post.label,
  }));

  const lineData = revenueOverTime.map((point) => ({
    ...point,
    shortDate: point.date.slice(5),
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <AdminSurface className="admin-stack gap-4">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Top Earning Posts</p>
          <h2 className="admin-h2">Estimated revenue leaders</h2>
        </div>

        {barData.length === 0 ? (
          <p className="admin-body">No affiliate click data is available yet.</p>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  tick={tickStyle}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={72}
                />
                <YAxis
                  tick={tickStyle}
                  width={84}
                  tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
                />
                <Tooltip
                  formatter={(value) => formatTooltipCurrency(value)}
                  labelFormatter={(_label, payload) => payload?.[0]?.payload?.label ?? 'Post'}
                  contentStyle={{
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.10)',
                  }}
                />
                <Bar dataKey="estimatedRevenue" fill="#c97455" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSurface>

      <AdminSurface className="admin-stack gap-4">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Revenue Over Time</p>
          <h2 className="admin-h2">Estimated affiliate revenue trend</h2>
        </div>

        {lineData.length === 0 ? (
          <p className="admin-body">No revenue timeline is available yet.</p>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="shortDate" tick={tickStyle} minTickGap={24} />
                <YAxis
                  tick={tickStyle}
                  width={84}
                  tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
                />
                <Tooltip
                  formatter={(value) => formatTooltipCurrency(value)}
                  labelFormatter={(_label, payload) => payload?.[0]?.payload?.date ?? 'Date'}
                  contentStyle={{
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.10)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="estimatedRevenue"
                  stroke="#1e434c"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSurface>
    </section>
  );
}
