import { Prisma, type AffiliateNetwork } from '@prisma/client';
import {
  type AffiliateTier,
  buildDefaultAffiliateCtaText,
  getAffiliateNetworkPriority,
  getDefaultRetailerFallbacks,
  inferAffiliatePaymentRisk,
  inferAffiliateTier,
  normalizeAffiliateTier,
  normalizeAffiliateContexts,
  normalizeRetailerFallbacks,
  resolveAffiliateDestinationUrl,
} from '@/lib/affiliatePartners';
import { resolveAffiliatePartnerLogoUrl } from '@/lib/affiliatePartnerLogos';
import prisma from '@/lib/server/prisma';

export type AffiliatePartnerOptionRecord = {
  id: string;
  slug: string;
  name: string;
  network: AffiliateNetwork;
  partnerType: string;
  affiliateTier: AffiliateTier;
  paymentRisk: boolean;
  retailerFallback: string[];
  baseUrl: string | null;
  website: string | null;
  logoUrl: string | null;
  affiliatePid: string | null;
  defaultDestinationUrl: string | null;
  routingPriority: number;
  allowedContexts: string[];
};

function cleanText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isMissingAffiliateStrategyColumnsError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2022') {
    return false;
  }

  const column = typeof error.meta?.column === 'string' ? error.meta.column : '';
  return ['affiliateTier', 'paymentRisk', 'retailerFallback'].some((field) => column.includes(field));
}

type PartnerRecordBase = {
  id: string;
  slug: string;
  name: string;
  network: AffiliateNetwork;
  partnerType: string;
  baseUrl: string | null;
  website: string | null;
  logoUrl: string | null;
  affiliatePid: string | null;
  routingPriority: number;
  allowedContexts: unknown;
  affiliateTier?: string | null;
  paymentRisk?: boolean | null;
  retailerFallback?: unknown;
  notes?: string | null;
};

function mapPartnerRecord(partner: PartnerRecordBase): AffiliatePartnerOptionRecord {
  const affiliateTier = normalizeAffiliateTier(
    partner.affiliateTier,
    inferAffiliateTier({
      name: partner.name,
      notes: partner.notes,
      routingPriority: partner.routingPriority,
    }),
  );

  return {
    id: partner.id,
    slug: partner.slug,
    name: partner.name,
    network: partner.network,
    partnerType: partner.partnerType,
    affiliateTier,
    paymentRisk:
      typeof partner.paymentRisk === 'boolean'
        ? partner.paymentRisk
        : inferAffiliatePaymentRisk({
            name: partner.name,
            notes: partner.notes,
            affiliateTier,
          }),
    retailerFallback: normalizeRetailerFallbacks(
      partner.retailerFallback,
      getDefaultRetailerFallbacks(partner.partnerType),
    ),
    baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
    website: cleanText(partner.website),
    logoUrl: resolveAffiliatePartnerLogoUrl(partner.name, partner.logoUrl),
    affiliatePid: cleanText(partner.affiliatePid),
    defaultDestinationUrl: resolveAffiliateDestinationUrl({
      baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
      affiliatePid: cleanText(partner.affiliatePid),
    }),
    routingPriority: partner.routingPriority,
    allowedContexts: normalizeAffiliateContexts(partner.allowedContexts),
  } satisfies AffiliatePartnerOptionRecord;
}

export async function listAffiliatePartnerOptions(): Promise<AffiliatePartnerOptionRecord[]> {
  try {
    const partners = await prisma.affiliatePartner.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ routingPriority: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        network: true,
        partnerType: true,
        affiliateTier: true,
        paymentRisk: true,
        retailerFallback: true,
        baseUrl: true,
        website: true,
        logoUrl: true,
        affiliatePid: true,
        routingPriority: true,
        allowedContexts: true,
        notes: true,
      },
    });

    return partners.map(mapPartnerRecord);
  } catch (error) {
    if (!isMissingAffiliateStrategyColumnsError(error)) {
      throw error;
    }

    const partners = await prisma.affiliatePartner.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ routingPriority: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        network: true,
        partnerType: true,
        baseUrl: true,
        website: true,
        logoUrl: true,
        affiliatePid: true,
        routingPriority: true,
        allowedContexts: true,
        notes: true,
      },
    });

    return partners.map(mapPartnerRecord);
  }
}

export async function getAffiliatePartnerLookup(partnerIds: string[]) {
  if (partnerIds.length === 0) {
    return new Map<string, AffiliatePartnerOptionRecord>();
  }

  try {
    const partners = await prisma.affiliatePartner.findMany({
      where: {
        id: {
          in: partnerIds,
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        network: true,
        partnerType: true,
        affiliateTier: true,
        paymentRisk: true,
        retailerFallback: true,
        baseUrl: true,
        website: true,
        logoUrl: true,
        affiliatePid: true,
        routingPriority: true,
        allowedContexts: true,
        notes: true,
      },
    });

    return new Map(partners.map((partner) => [partner.id, mapPartnerRecord(partner)]));
  } catch (error) {
    if (!isMissingAffiliateStrategyColumnsError(error)) {
      throw error;
    }

    const partners = await prisma.affiliatePartner.findMany({
      where: {
        id: {
          in: partnerIds,
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        network: true,
        partnerType: true,
        baseUrl: true,
        website: true,
        logoUrl: true,
        affiliatePid: true,
        routingPriority: true,
        allowedContexts: true,
        notes: true,
      },
    });

    return new Map(partners.map((partner) => [partner.id, mapPartnerRecord(partner)]));
  }
}

export async function listAdminAffiliatePartners() {
  try {
    const partners = await prisma.affiliatePartner.findMany({
      orderBy: [{ routingPriority: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        network: true,
        partnerType: true,
        affiliateTier: true,
        paymentRisk: true,
        retailerFallback: true,
        affiliatePid: true,
        baseUrl: true,
        website: true,
        logoUrl: true,
        commissionRate: true,
        routingPriority: true,
        allowedContexts: true,
        isActive: true,
        updatedAt: true,
        notes: true,
      },
    });

    return partners.map((partner) => ({
      ...partner,
      ...mapPartnerRecord(partner),
      suggestedCta: buildDefaultAffiliateCtaText({
        name: partner.name,
        partnerType: partner.partnerType,
      }),
    }));
  } catch (error) {
    if (!isMissingAffiliateStrategyColumnsError(error)) {
      throw error;
    }

    const partners = await prisma.affiliatePartner.findMany({
      orderBy: [{ routingPriority: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        network: true,
        partnerType: true,
        affiliatePid: true,
        baseUrl: true,
        website: true,
        logoUrl: true,
        commissionRate: true,
        routingPriority: true,
        allowedContexts: true,
        isActive: true,
        updatedAt: true,
        notes: true,
      },
    });

    return partners.map((partner) => ({
      ...partner,
      ...mapPartnerRecord(partner),
      suggestedCta: buildDefaultAffiliateCtaText({
        name: partner.name,
        partnerType: partner.partnerType,
      }),
    }));
  }
}

export function sortAffiliatePartnersByCanonPriority<T extends { network: AffiliateNetwork; routingPriority?: number | null; name: string }>(
  partners: T[],
) {
  return [...partners].sort((left, right) => {
    const priorityDelta = (left.routingPriority ?? 99) - (right.routingPriority ?? 99);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    const networkDelta = getAffiliateNetworkPriority(left.network) - getAffiliateNetworkPriority(right.network);
    if (networkDelta !== 0) {
      return networkDelta;
    }

    return left.name.localeCompare(right.name);
  });
}
