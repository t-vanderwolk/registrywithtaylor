import type { AffiliateNetwork } from '@prisma/client';

export const AFFILIATE_ROUTING_ORDER: AffiliateNetwork[] = ['DIRECT', 'IMPACT', 'AWIN', 'CJ'];
export const AFFILIATE_CONTEXT_OPTIONS = ['blog', 'registry', 'academy'] as const;

export type AffiliateUsageContext = (typeof AFFILIATE_CONTEXT_OPTIONS)[number];

export function getAffiliateNetworkPriority(network: AffiliateNetwork) {
  const index = AFFILIATE_ROUTING_ORDER.indexOf(network);
  return index >= 0 ? index : AFFILIATE_ROUTING_ORDER.length;
}

export function normalizeAffiliateContexts(value: unknown): AffiliateUsageContext[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.flatMap((entry) => {
        if (typeof entry !== 'string') {
          return [];
        }

        const normalized = entry.trim().toLowerCase();
        return AFFILIATE_CONTEXT_OPTIONS.includes(normalized as AffiliateUsageContext)
          ? [normalized as AffiliateUsageContext]
          : [];
      }),
    ),
  );
}

export function allowsAffiliateContext(value: unknown, context: AffiliateUsageContext) {
  const contexts = normalizeAffiliateContexts(value);
  return contexts.length === 0 || contexts.includes(context);
}

export function normalizeUrl(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function resolveAffiliateDestinationUrl({
  baseUrl,
  affiliatePid,
  destinationUrl,
}: {
  baseUrl?: string | null;
  affiliatePid?: string | null;
  destinationUrl?: string | null;
}) {
  const normalizedBaseUrl = normalizeUrl(baseUrl);
  const normalizedDestinationUrl = normalizeUrl(destinationUrl);

  if (!normalizedBaseUrl && !normalizedDestinationUrl) {
    return null;
  }

  const resolved = (() => {
    if (normalizedDestinationUrl?.startsWith('/') && normalizedBaseUrl) {
      return new URL(normalizedDestinationUrl, normalizedBaseUrl);
    }

    if (normalizedDestinationUrl) {
      return new URL(normalizedDestinationUrl);
    }

    return normalizedBaseUrl ? new URL(normalizedBaseUrl) : null;
  })();

  if (!resolved) {
    return null;
  }

  if (affiliatePid && !resolved.searchParams.has('affiliate_pid')) {
    resolved.searchParams.set('affiliate_pid', affiliatePid);
  }

  return resolved.toString();
}

export function buildDefaultAffiliateCtaText({
  name,
  partnerType,
}: {
  name: string;
  partnerType?: string | null;
}) {
  const normalizedType = partnerType?.trim().toLowerCase();

  if (normalizedType === 'service') {
    return `Explore ${name}`;
  }

  if (normalizedType === 'retailer') {
    return `Browse ${name}`;
  }

  return `Shop ${name}`;
}
