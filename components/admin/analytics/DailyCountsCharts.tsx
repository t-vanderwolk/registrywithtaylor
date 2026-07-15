'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import type { DailyPoint } from '@/lib/server/dailyAnalytics';

type DailyCountsChartsProps = {
  points: DailyPoint[];
  days: number;
};

const tickStyle = { fill: 'rgba(0, 0, 0, 0.62)', fontSize: 12 };

const tooltipStyle = {
  borderRadius: '18px',
  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 18px 44px rgba(0,0,0,0.10)',
} as const;

type SeriesKey = keyof Omit<DailyPoint, 'date'>;

type ChartDef = {
  title: string;
  eyebrow: string;
  lines: Array<{ key: SeriesKey; label: string; color: string }>;
};

// Grouped into a few readable charts rather than one spaghetti plot.
const CHARTS: ChartDef[] = [
  {
    eyebrow: 'Traffic',
    title: 'Site & blog traffic',
    lines: [
      { key: 'totalTraffic', label: 'Total page views', color: '#1e434c' },
      { key: 'blogTraffic', label: 'Blog traffic', color: '#c97455' },
      { key: 'blogPostViews', label: 'Blog post views', color: '#7a9e9f' },
    ],
  },
  {
    eyebrow: 'Affiliate',
    title: 'Affiliate & outbound clicks',
    lines: [
      { key: 'outboundClicks', label: 'Outbound clicks (site-wide)', color: '#c97455' },
      { key: 'affiliateClicks', label: 'Blog affiliate clicks', color: '#1e434c' },
    ],
  },
  {
    eyebrow: 'Free Tools',
    title: 'Tool opens (Finder · Checker · Quiz)',
    lines: [
      { key: 'toolFinder', label: 'Stroller Finder', color: '#1e434c' },
      { key: 'toolChecker', label: 'Travel System Checker', color: '#c97455' },
      { key: 'toolQuiz', label: 'Stroller Quiz', color: '#7a9e9f' },
    ],
  },
];

const numberFormatter = new Intl.NumberFormat('en-US');

export default function DailyCountsCharts({ points, days }: DailyCountsChartsProps) {
  const data = points.map((p) => ({ ...p, shortDate: p.date.slice(5) }));
  const hasData = points.some(
    (p) =>
      p.totalTraffic +
        p.blogTraffic +
        p.blogPostViews +
        p.affiliateClicks +
        p.outboundClicks +
        p.toolFinder +
        p.toolChecker +
        p.toolQuiz >
      0,
  );

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {CHARTS.map((chart) => (
        <AdminSurface key={chart.title} className="admin-stack gap-4">
          <div className="admin-stack gap-1">
            <p className="admin-eyebrow">{chart.eyebrow}</p>
            <h2 className="admin-h2">{chart.title}</h2>
            <p className="admin-micro">Daily counts, last {days} days.</p>
          </div>

          {!hasData ? (
            <p className="admin-body">
              No daily data yet. These lines fill in once the page-view, tool, and click logs are deployed and
              visitors start browsing.
            </p>
          ) : (
            <>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
                    <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="shortDate" tick={tickStyle} minTickGap={24} />
                    <YAxis tick={tickStyle} width={56} allowDecimals={false} />
                    <Tooltip
                      formatter={(value, name) => [
                        numberFormatter.format(Number(Array.isArray(value) ? value[0] : value ?? 0)),
                        name,
                      ]}
                      labelFormatter={(_label, payload) => payload?.[0]?.payload?.date ?? 'Date'}
                      contentStyle={tooltipStyle}
                    />
                    {chart.lines.map((line) => (
                      <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        name={line.label}
                        stroke={line.color}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {chart.lines.map((line) => (
                  <span key={line.key} className="admin-micro inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: line.color }}
                    />
                    {line.label}
                  </span>
                ))}
              </div>
            </>
          )}
        </AdminSurface>
      ))}
    </section>
  );
}
