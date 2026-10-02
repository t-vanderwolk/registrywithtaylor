/** Resolve only an explicitly saved GBG product destination; never search or model-match. */
export function goodBuyGearProductEndpoint(href: string): string | null {
  try {
    let url = new URL(href);
    for (let i = 0; i < 3; i++) {
      if (url.protocol !== 'https:' || url.username || url.password) return null;
      if (['goodbuygear.com', 'www.goodbuygear.com'].includes(url.hostname)) {
        if (!/^\/products\/[a-z0-9-]+\/?$/.test(url.pathname)) return null;
        return `https://goodbuygear.com${url.pathname.replace(/\/$/, '')}.js`;
      }
      const key = url.hostname === 'goodbuygear.pxf.io' ? 'u' : url.hostname === 'go.shopmy.us' ? 'url' : null;
      const destination = key ? url.searchParams.get(key) : null;
      if (!destination) return null;
      url = new URL(destination);
    }
  } catch { /* Invalid or unsupported link: no public request. */ }
  return null;
}

export function goodBuyGearListingSummary(value: unknown): { price: number | null; condition: string } {
  const fallback = { price: null, condition: 'GoodBuy Gear' };
  if (!value || typeof value !== 'object') return fallback;
  const data = value as { available?: unknown; tags?: unknown; variants?: unknown };
  if (data.available !== true || !Array.isArray(data.variants)) return fallback;
  const prices = data.variants.filter(v => v?.available === true && Number.isSafeInteger(v.price) && v.price > 0).map(v => v.price / 100);
  const conditions = ['Open Box', 'Barely Used', 'Gently Used', 'Loved', 'Unopened & Overstock'];
  const tags: unknown[] = Array.isArray(data.tags) ? data.tags : [];
  const condition = conditions.filter(c => tags.includes(`Condition_${c}`));
  return { price: prices.length ? Math.min(...prices) : null, condition: condition.length === 1 ? condition[0] : 'GoodBuy Gear' };
}
