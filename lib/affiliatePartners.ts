import type { AffiliateNetwork } from '@prisma/client';

export const AFFILIATE_ROUTING_ORDER: AffiliateNetwork[] = ['DIRECT', 'IMPACT', 'AWIN', 'CJ'];
export const AFFILIATE_CONTEXT_OPTIONS = ['blog', 'guide', 'registry', 'academy'] as const;
export const AFFILIATE_TIER_OPTIONS = ['T1', 'T2', 'T3', 'TX'] as const;
export const DEFAULT_RETAILER_FALLBACKS = ['MacroBaby', 'ANB Baby', 'Albee Baby'] as const;

export type AffiliateUsageContext = (typeof AFFILIATE_CONTEXT_OPTIONS)[number];
export type AffiliateTier = (typeof AFFILIATE_TIER_OPTIONS)[number];

const EXPLICIT_AFFILIATE_TIER_BY_NAME: Record<string, AffiliateTier> = {
  'albee baby': 'T1',
  'anb baby': 'T1',
  babyquip: 'T1',
  'bebcare': 'T1',
  'dadada baby': 'T1',
  'happiest baby': 'T1',
  'macrobaby': 'T1',
  'modern nursery': 'T1',
  'nanit': 'T1',
  'newborn nursery furniture': 'T1',
  'newton baby': 'T1',
  'owlet': 'T1',
  'silver cross': 'T1',
  'veer': 'T1',
  'wayb': 'T1',
  'inglesina': 'T1',
  'baby trend': 'T1',
  'myregistry': 'T1',
  'baby brezza': 'T2',
  'bella luna toys': 'T2',
  'belly bandit': 'T2',
  'earth mama organics': 'T2',
  'ergobaby': 'T2',
  'inklings baby': 'T2',
  'jool baby': 'T2',
  'kyte baby': 'T2',
  'papablic': 'T2',
  "the baby's brew": 'T2',
  'bungle nursery cribs': 'T3',
  'grownsy': 'T3',
  'mima': 'T3',
  'petit from poa': 'T3',
  'snuggle me organic': 'T3',
  'prosto concept': 'TX',
};

const PAYMENT_RISK_PARTNERS = new Set([
  'bungle nursery cribs',
  'dadada baby',
  'grownsy',
  'mima',
  'papablic',
  'petit from poa',
  'snuggle me organic',
  "the baby's brew",
  'wayb',
]);

function normalizeNameKey(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

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

export function normalizeAffiliateTier(value: unknown, fallback: AffiliateTier = 'T3'): AffiliateTier {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().toUpperCase();
  return AFFILIATE_TIER_OPTIONS.includes(normalized as AffiliateTier) ? (normalized as AffiliateTier) : fallback;
}

export function normalizeRetailerFallbacks(
  value: unknown,
  fallback: string[] = [],
) {
  const entries = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  return Array.from(
    new Set(
      entries
        .flatMap((entry) => (typeof entry === 'string' ? [entry] : []))
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}

export function getDefaultRetailerFallbacks(partnerType?: string | null) {
  return partnerType?.trim().toLowerCase() === 'brand' ? [...DEFAULT_RETAILER_FALLBACKS] : [];
}

export function inferAffiliateTier({
  name,
  notes,
  routingPriority,
}: {
  name: string;
  notes?: string | null;
  routingPriority?: number | null;
}): AffiliateTier {
  const normalizedName = normalizeNameKey(name);
  const explicitTier = EXPLICIT_AFFILIATE_TIER_BY_NAME[normalizedName];
  if (explicitTier) {
    return explicitTier;
  }

  const noteText = notes?.trim().toLowerCase() ?? '';
  if (noteText.includes('tier 1')) {
    return 'T1';
  }

  if (noteText.includes('tier 2')) {
    return 'T2';
  }

  if (noteText.includes('tier 3')) {
    return 'T3';
  }

  if (noteText.includes('opportunity watchlist')) {
    return 'TX';
  }

  const normalizedPriority = typeof routingPriority === 'number' ? routingPriority : 99;
  if (normalizedPriority <= 35) {
    return 'T1';
  }

  if (normalizedPriority <= 60) {
    return 'T2';
  }

  return 'T3';
}

export function inferAffiliatePaymentRisk({
  name,
  notes,
  affiliateTier,
}: {
  name: string;
  notes?: string | null;
  affiliateTier?: AffiliateTier | null;
}) {
  const normalizedName = normalizeNameKey(name);
  if (PAYMENT_RISK_PARTNERS.has(normalizedName)) {
    return true;
  }

  const noteText = notes?.trim().toLowerCase() ?? '';
  if (
    noteText.includes('payment-risk') ||
    noteText.includes('risk-monitored') ||
    noteText.includes('low approval')
  ) {
    return true;
  }

  return affiliateTier === 'T3';
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
