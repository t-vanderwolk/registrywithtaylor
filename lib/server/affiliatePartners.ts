import type { AffiliateNetwork } from '@prisma/client';
import {
  buildDefaultAffiliateCtaText,
  getAffiliateNetworkPriority,
  normalizeAffiliateContexts,
  resolveAffiliateDestinationUrl,
} from '@/lib/affiliatePartners';
import { getAffiliatePartnerLogo } from '@/lib/affiliatePartnerLogos';
import prisma from '@/lib/server/prisma';

export type AffiliatePartnerOptionRecord = {
  id: string;
  slug: string;
  name: string;
  network: AffiliateNetwork;
  partnerType: string;
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

export async function listAffiliatePartnerOptions() {
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
    },
  });

  return partners.map((partner) => {
    const fallbackLogo = getAffiliatePartnerLogo(partner.name);

    return {
      id: partner.id,
      slug: partner.slug,
      name: partner.name,
      network: partner.network,
      partnerType: partner.partnerType,
      baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
      website: cleanText(partner.website),
      logoUrl: cleanText(partner.logoUrl) ?? fallbackLogo.src,
      affiliatePid: cleanText(partner.affiliatePid),
      defaultDestinationUrl: resolveAffiliateDestinationUrl({
        baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
        affiliatePid: cleanText(partner.affiliatePid),
      }),
      routingPriority: partner.routingPriority,
      allowedContexts: normalizeAffiliateContexts(partner.allowedContexts),
    } satisfies AffiliatePartnerOptionRecord;
  });
}

export async function getAffiliatePartnerLookup(partnerIds: string[]) {
  if (partnerIds.length === 0) {
    return new Map<string, AffiliatePartnerOptionRecord>();
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
    },
  });

  return new Map(
    partners.map((partner) => {
      const fallbackLogo = getAffiliatePartnerLogo(partner.name);

      return [
        partner.id,
        {
          id: partner.id,
          slug: partner.slug,
          name: partner.name,
          network: partner.network,
          partnerType: partner.partnerType,
          baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
          website: cleanText(partner.website),
          logoUrl: cleanText(partner.logoUrl) ?? fallbackLogo.src,
          affiliatePid: cleanText(partner.affiliatePid),
          defaultDestinationUrl: resolveAffiliateDestinationUrl({
            baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
            affiliatePid: cleanText(partner.affiliatePid),
          }),
          routingPriority: partner.routingPriority,
          allowedContexts: normalizeAffiliateContexts(partner.allowedContexts),
        } satisfies AffiliatePartnerOptionRecord,
      ];
    }),
  );
}

export async function listAdminAffiliatePartners() {
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
    },
  });

  return partners.map((partner) => ({
    ...partner,
    baseUrl: cleanText(partner.baseUrl) ?? cleanText(partner.website),
    logoUrl: cleanText(partner.logoUrl) ?? getAffiliatePartnerLogo(partner.name).src,
    allowedContexts: normalizeAffiliateContexts(partner.allowedContexts),
    suggestedCta: buildDefaultAffiliateCtaText({
      name: partner.name,
      partnerType: partner.partnerType,
    }),
  }));
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
