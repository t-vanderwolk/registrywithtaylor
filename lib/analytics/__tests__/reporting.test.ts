import { describe, expect, it } from 'vitest';
import { dedupeOutboundEvents, checklistClickSummary, type OutboundReportEvent } from '../outboundReporting';
import { outboundSource } from '../outboundSource';
import { estimateRevenuePerClick } from '../revenueEstimator';
const event = (extra: Partial<OutboundReportEvent> = {}): OutboundReportEvent => ({
  id: '1', retailer: 'Babylist', network: 'ShopMy', url: 'https://go.shopmy.us/test',
  source: 'link', path: '/tools/compare', brand: null, product: null, visitorHash: 'visitor',
  createdAt: new Date('2026-09-30T12:00:00Z'), ...extra,
});
describe('outbound reporting', () => {
  it('counts a legacy global + managed double emission once, preserving product attribution', () => {
    const result = dedupeOutboundEvents([event(), event({ id: '2', source: 'tool:stroller-compare', brand: 'Bugaboo', product: 'Butterfly 2 Plus', createdAt: new Date('2026-09-30T12:00:00.003Z') })]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ source: 'tool:stroller-compare', brand: 'Bugaboo', product: 'Butterfly 2 Plus' });
  });
  it('keeps different visitors, unknown visitors and genuine later clicks', () => {
    expect(dedupeOutboundEvents([event(), event({ id: '2', visitorHash: 'other' }), event({ id: '3', visitorHash: null }), event({ id: '4', visitorHash: null }), event({ id: '5', createdAt: new Date('2026-09-30T12:00:06Z') })])).toHaveLength(5);
  });
  it('totals all products before displaying the top 25, and does not merge equal names across brands', () => {
    const clicks = Array.from({ length: 30 }, (_, i) => event({ id: String(i), source: 'tool:baby-checklist', product: 'Same name', brand: `Brand ${i}` }));
    clicks.push(event({ source: 'tool:baby-checklist', product: null }));
    const summary = checklistClickSummary(clicks, new Date('2026-09-01'));
    expect(summary).toMatchObject({ total: 31, last28: 31, productCount: 30 });
    expect(summary.rows).toHaveLength(25);
    expect(summary.rows.every(row => row.last28 === 1)).toBe(true);
  });
  it('recovers tool and blog attribution without overwriting an adapter placement', () => {
    expect(outboundSource('link', '/tools/travel-system/results')).toBe('tool:travel-system-checker');
    expect(outboundSource('link', '/blog/a')).toBe('blog');
    expect(outboundSource('tool:travel-system-checker:adapter', '/tools/travel-system')).toBe('tool:travel-system-checker:adapter');
  });
  it('never treats a click as a confirmed order or missing settings as $0', () => {
    expect(estimateRevenuePerClick({ averageOrderValue: 500, commissionRate: .1 })).toBeNull();
    expect(estimateRevenuePerClick({ averageOrderValue: 500, commissionRate: .1, conversionRate: .02 })).toBe(1);
  });
});
