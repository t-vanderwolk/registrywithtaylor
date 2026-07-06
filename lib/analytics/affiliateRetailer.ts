/**
 * Normalize an outbound affiliate URL to a human retailer label + its network.
 * Shared by the client beacon and the server endpoint so the dashboard's
 * "clicks by retailer" lines up with each affiliate network's own dashboard.
 */

export type AffiliateRetailer = {
  /** Display label, e.g. "Babylist", "Amazon", "Silver Cross". */
  retailer: string;
  /** The tracking network that would count the click, when known. */
  network: string | null;
};

const RULES: Array<{ test: RegExp; retailer: string; network: string | null }> = [
  { test: /babylist/i, retailer: 'Babylist', network: 'Impact' },
  { test: /(^|\.)amazon\.|amzn\.to/i, retailer: 'Amazon', network: 'Amazon Associates' },
  { test: /macrobaby/i, retailer: 'MacroBaby', network: 'Shopify' },
  { test: /silvercross/i, retailer: 'Silver Cross', network: 'UAP' },
  { test: /goodbuygear/i, retailer: 'GoodBuyGear', network: 'Impact' },
  { test: /anbbaby/i, retailer: 'ANB Baby', network: 'Awin' },
  // CJ (Commission Junction) + its redirect domains.
  { test: /(^|\.)cj\.com|dpbolvw\.net|tkqlhce\.com|jdoqocy\.com|anrdoezrs\.net|kqzyfj\.com|qksrv\.net|lduhtrp\.net|ftjcfx\.com/i, retailer: 'CJ', network: 'CJ' },
  { test: /awin1\.com|zenaps\.com|awin\./i, retailer: 'Awin', network: 'Awin' },
  { test: /linksynergy|rakuten/i, retailer: 'Rakuten', network: 'Rakuten' },
  { test: /shareasale/i, retailer: 'ShareASale', network: 'ShareASale' },
  { test: /impact\.com|impactradius|pxf\.io/i, retailer: 'Impact', network: 'Impact' },
];

export function affiliateRetailerFromUrl(url: string | null | undefined): AffiliateRetailer {
  const raw = (url ?? '').trim();
  if (!raw) return { retailer: 'Other', network: null };

  // Match against the whole URL (some links carry the retailer in the path/query,
  // e.g. babylist.pxf.io?u=<encoded babylist.com/...>).
  for (const rule of RULES) {
    if (rule.test.test(raw)) {
      return { retailer: rule.retailer, network: rule.network };
    }
  }

  // Fall back to the bare hostname so unknown retailers are still grouped sensibly.
  try {
    const host = new URL(raw, 'https://www.taylormadebabyco.com').hostname
      .replace(/^www\./, '')
      .toLowerCase();
    return { retailer: host || 'Other', network: null };
  } catch {
    return { retailer: 'Other', network: null };
  }
}
