const DEFAULT_BASE_URL = 'https://www.taylormadebabyco.com';

const AFFILIATE_HOST_KEYWORDS = [
  'amazon.',
  'amzn.to',
  'awin',
  'impact.com',
  'impactradius',
  'shareasale',
  'cj.com',
  'linksynergy',
  'rakuten',
  'skimresources',
  'howl.me',
  'shopstyle',
  'ltkcoupons',
] as const;

const AFFILIATE_QUERY_KEYS = [
  'aff',
  'affid',
  'aff_id',
  'affiliate',
  'affiliate_id',
  'affiliate_pid',
  'partner',
  'partner_id',
  'referrer',
  'referrer_id',
  'tag',
  'linkcode',
  'ascsubtag',
  'subid',
  'clickid',
  'irclickid',
  'pubid',
  'u1',
  's1',
  'awc',
  'ranmid',
  'raneaid',
  'ransiteid',
  'utm_medium',
] as const;

const AFFILIATE_QUERY_VALUE_PATTERNS = [/affiliate/i, /partner/i];
const INTERNAL_AFFILIATE_PATH_PREFIXES = ['/r/'] as const;

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return DEFAULT_BASE_URL;
};

const normalizeSearchParamKey = (value: string) => value.trim().toLowerCase();

export function isAffiliateLink(urlLike: string | URL | null | undefined) {
  if (!urlLike) {
    return false;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = urlLike instanceof URL ? urlLike : new URL(urlLike, getBaseUrl());
  } catch {
    return false;
  }

  if (
    INTERNAL_AFFILIATE_PATH_PREFIXES.some(
      (prefix) => parsedUrl.pathname === prefix.slice(0, -1) || parsedUrl.pathname.startsWith(prefix),
    )
  ) {
    return true;
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (AFFILIATE_HOST_KEYWORDS.some((keyword) => hostname.includes(keyword))) {
    return true;
  }

  for (const [rawKey, rawValue] of parsedUrl.searchParams.entries()) {
    const key = normalizeSearchParamKey(rawKey);
    const value = rawValue.trim();

    if (AFFILIATE_QUERY_KEYS.includes(key as (typeof AFFILIATE_QUERY_KEYS)[number])) {
      if (key !== 'utm_medium' || value.toLowerCase() === 'affiliate') {
        return true;
      }
    }

    if (AFFILIATE_QUERY_VALUE_PATTERNS.some((pattern) => pattern.test(value))) {
      return true;
    }
  }

  return false;
}

export const AFFILIATE_LINK_RULES = {
  hostKeywords: AFFILIATE_HOST_KEYWORDS,
  queryKeys: AFFILIATE_QUERY_KEYS,
  queryValuePatterns: AFFILIATE_QUERY_VALUE_PATTERNS,
  internalPathPrefixes: INTERNAL_AFFILIATE_PATH_PREFIXES,
} as const;
