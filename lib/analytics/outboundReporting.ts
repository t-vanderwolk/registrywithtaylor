import { outboundSource } from './outboundSource';
export type OutboundReportEvent = {
  id: string; retailer: string; network: string | null; url: string;
  source: string | null; path: string | null; brand: string | null; product: string | null;
  visitorHash: string | null; createdAt: Date;
};
/** Apply the collector's five-second rule to legacy double-emitted records without deleting history. */
export function dedupeOutboundEvents(events: OutboundReportEvent[]) {
  const result: OutboundReportEvent[] = [];
  const last = new Map<string, OutboundReportEvent>();
  for (const raw of [...events].sort((a, b) => +a.createdAt - +b.createdAt)) {
    const row = { ...raw, source: outboundSource(raw.source, raw.path) };
    const key = row.visitorHash ? `${row.visitorHash}|${row.url}` : null;
    const prior = key ? last.get(key) : undefined;
    if (prior && +row.createdAt - +prior.createdAt < 5000) {
      prior.brand ||= row.brand;
      prior.product ||= row.product;
      if (prior.source === 'link') prior.source = row.source;
      continue;
    }
    result.push(row);
    if (key) last.set(key, row);
  }
  return result;
}
export function checklistClickSummary(events: OutboundReportEvent[], since: Date) {
  const clicks = events.filter(e => e.source === 'tool:baby-checklist');
  const products = new Map<string, { product: string; brand: string | null; total: number; last28: number }>();
  for (const e of clicks) {
    if (!e.product) continue;
    const key = JSON.stringify([e.brand, e.product]);
    const row = products.get(key) ?? { product: e.product, brand: e.brand, total: 0, last28: 0 };
    row.total++;
    if (e.createdAt >= since) row.last28++;
    products.set(key, row);
  }
  return {
    total: clicks.length, last28: clicks.filter(e => e.createdAt >= since).length,
    productCount: products.size,
    rows: [...products.values()].sort((a,b) => b.total-a.total || a.product.localeCompare(b.product)).slice(0,25),
  };
}
