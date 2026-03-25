import { getGuidePath } from '@/lib/guides/routing';

const SITE_ORIGIN = 'https://www.taylormadebabyco.com';

export function normalizeGuideCanonicalPath(value?: string | null): `/${string}` | null {
  const rawValue = typeof value === 'string' ? value.trim() : '';
  if (!rawValue) {
    return null;
  }

  try {
    const url = new URL(rawValue, SITE_ORIGIN);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    return pathname.startsWith('/') ? (pathname as `/${string}`) : (`/${pathname}` as `/${string}`);
  } catch {
    const withoutHash = rawValue.split('#')[0] ?? rawValue;
    const withoutQuery = withoutHash.split('?')[0] ?? withoutHash;
    const normalized = withoutQuery.replace(/\/+$/, '') || '/';
    return normalized.startsWith('/') ? (normalized as `/${string}`) : (`/${normalized}` as `/${string}`);
  }
}

export function isAcademyPublicPath(value?: string | null) {
  const normalizedPath = normalizeGuideCanonicalPath(value);
  return normalizedPath === '/academy' || normalizedPath?.startsWith('/academy/') === true;
}

export function getGuidePublicPath({
  slug,
  topicCluster,
  canonicalUrl,
}: {
  slug: string;
  topicCluster?: string | null;
  canonicalUrl?: string | null;
}): `/${string}` {
  return normalizeGuideCanonicalPath(canonicalUrl) ?? getGuidePath({ slug, topicCluster });
}
