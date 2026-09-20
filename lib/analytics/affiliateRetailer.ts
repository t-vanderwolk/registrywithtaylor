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

export type AffiliateRetailerInput = {
  retailer?: string | null;
  network?: string | null;
  url?: string | null;
};

export type AffiliateRetailerCountInput = AffiliateRetailerInput & {
  count: number;
};

export type AffiliateRetailerCount = AffiliateRetailer & {
  total: number;
  last28: number;
};

const RULES: Array<{ test: RegExp; retailer: string; network: string | null }> = [
  { test: /babylist/i, retailer: 'Babylist', network: 'Impact' },
  { test: /(^|\.)amazon\.|amzn\.to/i, retailer: 'Amazon', network: 'Amazon Associates' },
  { test: /macrobaby/i, retailer: 'MacroBaby', network: 'Shopify' },
  { test: /bombi/i, retailer: 'Bombi', network: null },
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

const CANONICAL_RETAILERS: Record<string, AffiliateRetailer> = {
  amazon: { retailer: 'Amazon', network: 'Amazon Associates' },
  babylist: { retailer: 'Babylist', network: 'Impact' },
  macrobaby: { retailer: 'MacroBaby', network: 'Shopify' },
  'macro baby': { retailer: 'MacroBaby', network: 'Shopify' },
  bombi: { retailer: 'Bombi', network: null },
};

const CANONICAL_NETWORKS: Record<string, string> = {
  'amazon associates': 'Amazon Associates',
  impact: 'Impact',
  shopify: 'Shopify',
};

function clean(value: string | null | undefined) {
  return value?.trim() || null;
}

function retailerRuleFromUrl(url: string | null | undefined): AffiliateRetailer | null {
  const raw = clean(url);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.hostname === 'go.shopmy.us') {
      const destination = parsed.searchParams.get('url');
      const host = destination ? new URL(destination).hostname.replace(/^www\./, '') : null;
      const retailer = host ? RULES.find((candidate) => candidate.test.test(host))?.retailer ?? host : 'ShopMy';
      return { retailer, network: 'ShopMy' };
    }
  } catch {
    // Historical URLs can be malformed; retain the existing fallback matching.
  }
  const rule = RULES.find((candidate) => candidate.test.test(raw));
  return rule ? { retailer: rule.retailer, network: rule.network } : null;
}

export function affiliateRetailerFromUrl(url: string | null | undefined): AffiliateRetailer {
  const raw = clean(url) ?? '';
  if (!raw) return { retailer: 'Other', network: null };

  // Match against the whole URL (some links carry the retailer in the path/query,
  // e.g. babylist.pxf.io?u=<encoded babylist.com/...>).
  const ruleMatch = retailerRuleFromUrl(raw);
  if (ruleMatch) return ruleMatch;

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

/**
 * Canonical retailer/network attribution for both new click writes and historical
 * analytics. A recognized destination URL is authoritative over a caller label.
 */
export function canonicalizeAffiliateRetailer(input: AffiliateRetailerInput): AffiliateRetailer {
  const retailer = clean(input.retailer);
  const retailerKey = retailer?.toLowerCase() ?? '';
  const network = clean(input.network);
  const canonicalNetwork = network ? CANONICAL_NETWORKS[network.toLowerCase()] ?? network : null;
  const urlRule = retailerRuleFromUrl(input.url);

  if (urlRule) return urlRule;

  const canonicalRetailer = CANONICAL_RETAILERS[retailerKey];
  if (canonicalRetailer) return canonicalRetailer;

  // `adapter` is placement metadata, never a retailer. Network attribution can
  // still identify Amazon when the URL is unavailable in a historical row.
  if (retailerKey === 'adapter') {
    if (canonicalNetwork === 'Amazon Associates') {
      return CANONICAL_RETAILERS.amazon;
    }
    const resolved = affiliateRetailerFromUrl(input.url);
    return {
      retailer: resolved.retailer,
      network: resolved.network ?? canonicalNetwork,
    };
  }

  if (retailer) {
    return { retailer, network: canonicalNetwork };
  }

  const resolved = affiliateRetailerFromUrl(input.url);
  return {
    retailer: resolved.retailer,
    network: resolved.network ?? canonicalNetwork,
  };
}

/** Preserve adapter placement while keeping `tool:<name>` as the source prefix. */
export function normalizeAffiliateClickAttribution(
  input: AffiliateRetailerInput & { source?: string | null },
) {
  const attribution = canonicalizeAffiliateRetailer(input);
  const source = clean(input.source);
  const isAdapterPlacement = clean(input.retailer)?.toLowerCase() === 'adapter';
  const placementSuffix = ':adapter';
  const sourceWithPlacement = isAdapterPlacement
    ? source?.endsWith(placementSuffix)
      ? source
      : `${(source ?? 'placement').slice(0, 64 - placementSuffix.length)}${placementSuffix}`
    : source;

  return { ...attribution, source: sourceWithPlacement };
}

/** Merge raw database groups into canonical retailer rows for admin reporting. */
export function aggregateAffiliateRetailerCounts(
  allTime: AffiliateRetailerCountInput[],
  last28: AffiliateRetailerCountInput[],
): AffiliateRetailerCount[] {
  const merged = new Map<string, AffiliateRetailerCount>();

  const add = (rows: AffiliateRetailerCountInput[], field: 'total' | 'last28') => {
    for (const row of rows) {
      const attribution = canonicalizeAffiliateRetailer(row);
      const existing = merged.get(attribution.retailer) ?? {
        ...attribution,
        total: 0,
        last28: 0,
      };
      existing[field] += row.count;
      if (!existing.network && attribution.network) existing.network = attribution.network;
      else if (attribution.network && existing.network !== attribution.network) existing.network = 'Multiple networks';
      merged.set(attribution.retailer, existing);
    }
  };

  add(allTime, 'total');
  add(last28, 'last28');
  return [...merged.values()].sort(
    (left, right) => right.total - left.total || left.retailer.localeCompare(right.retailer),
  );
}
