const AMAZON_ASIN_PATTERN = /^[A-Z0-9]{10}$/i;
const URL_PATTERN = /https?:\/\/[^\s)"'<>]+/gi;

export function isAmazonShortUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    return new URL(url).hostname.toLowerCase() === 'amzn.to';
  } catch {
    return false;
  }
}

export function isAmazonUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === 'amzn.to' || hostname === 'amazon.com' || hostname.endsWith('.amazon.com');
  } catch {
    return false;
  }
}

function normalizeAsin(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && AMAZON_ASIN_PATTERN.test(trimmed) ? trimmed.toUpperCase() : null;
}

export function parseAmazonAsinFromUrl(url: string | null | undefined): string | null {
  if (!url || !isAmazonUrl(url) || isAmazonShortUrl(url)) return null;

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index]?.toLowerCase();
      if (segment === 'dp' || segment === 'product' || segment === 'asin') {
        const asin = normalizeAsin(segments[index + 1]);
        if (asin) return asin;
      }
    }

    return segments.map(normalizeAsin).find(Boolean) ?? null;
  } catch {
    return null;
  }
}

export function extractAmazonUrlsFromText(value: string | null | undefined): string[] {
  if (!value) return [];
  const out: string[] = [];
  for (const match of value.matchAll(URL_PATTERN)) {
    const url = match[0].replace(/[),.;]+$/g, '');
    if (isAmazonUrl(url)) out.push(url);
  }
  return [...new Set(out)];
}

export function amazonUrlHasPartnerTag(url: string | null | undefined, partnerTag: string) {
  if (!url) return false;
  try {
    return new URL(url).searchParams.get('tag') === partnerTag;
  } catch {
    return false;
  }
}

export function assertAmazonDetailPageUrl(url: string | null | undefined, partnerTag: string) {
  if (!url || !isAmazonUrl(url) || isAmazonShortUrl(url)) {
    return { ok: false as const, reason: 'Amazon did not return a usable detailPageURL.' };
  }

  if (!amazonUrlHasPartnerTag(url, partnerTag)) {
    return { ok: false as const, reason: `Amazon detailPageURL is missing tag=${partnerTag}.` };
  }

  return { ok: true as const, url };
}

type FetchLike = typeof fetch;

export async function resolveAmazonShortUrl(
  url: string,
  fetchImpl: FetchLike = fetch,
): Promise<string | null> {
  if (!isAmazonShortUrl(url)) return url;

  let current = url;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetchImpl(current, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': 'TMBC-AmazonCreatorsSync/1.0' },
    });
    const location = response.headers.get('location');
    if (!location) {
      return response.url && !isAmazonShortUrl(response.url) ? response.url : null;
    }

    const next = new URL(location, current).toString();
    if (!isAmazonShortUrl(next)) return next;
    current = next;
  }

  return null;
}
