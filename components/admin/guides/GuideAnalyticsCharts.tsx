'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminSurface from '@/components/admin/ui/AdminSurface';

type GuideAnalyticsChartsProps = {
  topGuides: Array<{
    label: string;
    views: number;
    consultationClicks: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    views: number;
    consultationClicks: number;
  }>;
};

const tickStyle = {
  fill: 'rgba(0, 0, 0, 0.62)',
  fontSize: 12,
};

const formatTooltipMetric = (
  value: number | string | ReadonlyArray<number | string> | undefined,
  key: string,
) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);

  return [
    Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0',
    key === 'consultationClicks' ? 'Book clicks' : 'Views',
  ] as const;
};

export default function GuideAnalyticsCharts({
  topGuides,
  categoryPerformance,
}: GuideAnalyticsChartsProps) {
  const topGuideData = topGuides.map((guide) => ({
    ...guide,
    shortLabel: guide.label.length > 28 ? `${guide.label.slice(0, 25)}...` : guide.label,
  }));

  const categoryData = categoryPerformance.map((entry) => ({
    ...entry,
    shortLabel: entry.category.length > 22 ? `${entry.category.slice(0, 19)}...` : entry.category,
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <AdminSurface className="admin-stack gap-4">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Top Performing Guides</p>
          <h2 className="admin-h2">Guide views</h2>
        </div>

        {topGuideData.length === 0 ? (
          <p className="admin-body">No guide traffic data is available yet.</p>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGuideData} margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  tick={tickStyle}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={72}
                />
                <YAxis tick={tickStyle} width={72} />
                <Tooltip
                  labelFormatter={(_label, payload) => payload?.[0]?.payload?.label ?? 'Guide'}
                  formatter={(value, key) => formatTooltipMetric(value, String(key))}
                  contentStyle={{
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.10)',
                  }}
                />
                <Bar dataKey="views" fill="#1e434c" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSurface>

      <AdminSurface className="admin-stack gap-4">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Category Performance</p>
          <h2 className="admin-h2">Guide views by category</h2>
        </div>

        {categoryData.length === 0 ? (
          <p className="admin-body">No category data is available yet.</p>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="shortLabel" tick={tickStyle} interval={0} angle={-16} textAnchor="end" height={68} />
                <YAxis tick={tickStyle} width={72} />
                <Tooltip
                  labelFormatter={(_label, payload) => payload?.[0]?.payload?.category ?? 'Category'}
                  formatter={(value, key) => formatTooltipMetric(value, String(key))}
                  contentStyle={{
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.10)',
                  }}
                />
                <Bar dataKey="views" fill="#c97455" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminSurface>
    </section>
  );
}
