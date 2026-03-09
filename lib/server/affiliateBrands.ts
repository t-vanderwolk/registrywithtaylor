import { type Prisma } from '@prisma/client';
import { formatAffiliateNetworks, sortAffiliateNetworks, type AffiliateBrandCard } from '@/lib/affiliateBrands';
import prisma from '@/lib/server/prisma';

const cleanText = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const affiliateBrandSelect = {
  id: true,
  name: true,
  logoUrl: true,
  website: true,
  programs: {
    orderBy: [{ network: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      network: true,
      campaignId: true,
      commission: true,
      cookieLength: true,
      links: {
        orderBy: [{ createdAt: 'asc' }],
        select: {
          id: true,
          name: true,
          url: true,
          destinationUrl: true,
        },
      },
    },
  },
  legacyPartners: {
    where: { isActive: true },
    orderBy: [{ updatedAt: 'desc' }],
    select: {
      id: true,
      name: true,
      network: true,
      logoUrl: true,
      website: true,
      affiliateLink: true,
    },
  },
} satisfies Prisma.BrandSelect;

const legacyPostAffiliateSelect = {
  affiliate: {
    select: {
      id: true,
      name: true,
      network: true,
      logoUrl: true,
      website: true,
      affiliateLink: true,
      brandId: true,
    },
  },
} satisfies Prisma.BlogPostAffiliateSelect;

type AffiliateBrandRecord = Prisma.BrandGetPayload<{ select: typeof affiliateBrandSelect }>;
type LegacyPostAffiliateRecord = Prisma.BlogPostAffiliateGetPayload<{ select: typeof legacyPostAffiliateSelect }>;

function buildBrandCard(brand: AffiliateBrandRecord): AffiliateBrandCard {
  const primaryProgram = brand.programs.find((program) =>
    program.links.some((link) => cleanText(link.url) || cleanText(link.destinationUrl)),
  );
  const primaryLink = primaryProgram?.links.find((link) => cleanText(link.url) || cleanText(link.destinationUrl)) ?? null;
  const legacyPartnerWithLink =
    brand.legacyPartners.find((partner) => cleanText(partner.affiliateLink)) ??
    brand.legacyPartners.find((partner) => cleanText(partner.website)) ??
    null;
  const networks = sortAffiliateNetworks(
    Array.from(
      new Set([
        ...brand.programs.map((program) => program.network),
        ...brand.legacyPartners.map((partner) => partner.network),
      ]),
    ),
  );

  return {
    id: brand.id,
    name: brand.name,
    logoUrl:
      cleanText(brand.logoUrl) ??
      cleanText(brand.legacyPartners.find((partner) => cleanText(partner.logoUrl))?.logoUrl) ??
      null,
    website: cleanText(brand.website) ?? cleanText(legacyPartnerWithLink?.website) ?? null,
    shopUrl:
      cleanText(primaryLink?.url) ??
      cleanText(primaryLink?.destinationUrl) ??
      cleanText(legacyPartnerWithLink?.affiliateLink) ??
      cleanText(brand.website) ??
      cleanText(legacyPartnerWithLink?.website) ??
      null,
    legacyAffiliateUrl: cleanText(legacyPartnerWithLink?.affiliateLink),
    networks,
    primaryProgram: primaryProgram
      ? {
          id: primaryProgram.id,
          network: primaryProgram.network,
          campaignId: cleanText(primaryProgram.campaignId),
          commission: cleanText(primaryProgram.commission),
          cookieLength: cleanText(primaryProgram.cookieLength),
          linkId: primaryLink?.id ?? null,
          linkName: cleanText(primaryLink?.name),
        }
      : null,
  };
}

function buildBrandCardFromLegacy(record: LegacyPostAffiliateRecord): AffiliateBrandCard | null {
  const affiliate = record.affiliate;
  const fallbackUrl = cleanText(affiliate.affiliateLink) ?? cleanText(affiliate.website);
  if (!fallbackUrl && !affiliate.brandId) {
    return null;
  }

  return {
    id: affiliate.brandId ?? `legacy:${affiliate.id}`,
    name: affiliate.name,
    logoUrl: cleanText(affiliate.logoUrl),
    website: cleanText(affiliate.website),
    shopUrl: fallbackUrl,
    legacyAffiliateUrl: cleanText(affiliate.affiliateLink),
    networks: [affiliate.network],
    primaryProgram: null,
  };
}

function mergeBrandCards(existing: AffiliateBrandCard, next: AffiliateBrandCard): AffiliateBrandCard {
  const networks = sortAffiliateNetworks(Array.from(new Set([...existing.networks, ...next.networks])));

  return {
    ...existing,
    logoUrl: existing.logoUrl ?? next.logoUrl,
    website: existing.website ?? next.website,
    shopUrl: existing.shopUrl ?? next.shopUrl,
    legacyAffiliateUrl: existing.legacyAffiliateUrl ?? next.legacyAffiliateUrl,
    primaryProgram: existing.primaryProgram ?? next.primaryProgram,
    networks,
  };
}

export function normalizePostAffiliateBrands({
  affiliateBrands,
  legacyAffiliates = [],
}: {
  affiliateBrands: AffiliateBrandRecord[];
  legacyAffiliates?: LegacyPostAffiliateRecord[];
}) {
  const merged = new Map<string, AffiliateBrandCard>();

  for (const brand of affiliateBrands) {
    const card = buildBrandCard(brand);
    merged.set(card.id, card);
  }

  for (const legacyAffiliate of legacyAffiliates) {
    const fallback = buildBrandCardFromLegacy(legacyAffiliate);
    if (!fallback) {
      continue;
    }

    const existing = merged.get(fallback.id);
    merged.set(fallback.id, existing ? mergeBrandCards(existing, fallback) : fallback);
  }

  return [...merged.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export async function listAffiliateBrandOptions() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      logoUrl: true,
      website: true,
      programs: {
        select: {
          network: true,
        },
      },
      legacyPartners: {
        where: { isActive: true },
        select: {
          network: true,
        },
      },
    },
  });

  return brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    logoUrl: cleanText(brand.logoUrl),
    website: cleanText(brand.website),
    networks: sortAffiliateNetworks(
      Array.from(
        new Set([
          ...brand.programs.map((program) => program.network),
          ...brand.legacyPartners.map((partner) => partner.network),
        ]),
      ),
    ),
  }));
}

export async function resolveAffiliateBrandIdsFromLegacyAffiliateIds(affiliateIds: string[]) {
  if (affiliateIds.length === 0) {
    return [];
  }

  const partners = await prisma.affiliatePartner.findMany({
    where: {
      id: {
        in: affiliateIds,
      },
      brandId: {
        not: null,
      },
    },
    select: {
      brandId: true,
    },
  });

  return Array.from(new Set(partners.flatMap((partner) => (partner.brandId ? [partner.brandId] : []))));
}

export async function resolveLegacyAffiliateIdsFromBrandIds(brandIds: string[]) {
  if (brandIds.length === 0) {
    return [];
  }

  const partners = await prisma.affiliatePartner.findMany({
    where: {
      brandId: {
        in: brandIds,
      },
    },
    select: {
      id: true,
      brandId: true,
      network: true,
      isActive: true,
      affiliateLink: true,
      website: true,
    },
    orderBy: [{ name: 'asc' }],
  });

  const byBrand = new Map<string, typeof partners>();
  for (const partner of partners) {
    if (!partner.brandId) {
      continue;
    }

    const group = byBrand.get(partner.brandId) ?? [];
    group.push(partner);
    byBrand.set(partner.brandId, group);
  }

  return brandIds.flatMap((brandId) => {
    const options = byBrand.get(brandId) ?? [];
    const sorted = [...options].sort((left, right) => {
      const leftScore =
        (left.isActive ? 0 : 100) +
        (cleanText(left.affiliateLink) ? 0 : 10) +
        (cleanText(left.website) ? 0 : 5);
      const rightScore =
        (right.isActive ? 0 : 100) +
        (cleanText(right.affiliateLink) ? 0 : 10) +
        (cleanText(right.website) ? 0 : 5);

      return leftScore - rightScore;
    });

    return sorted[0]?.id ? [sorted[0].id] : [];
  });
}

export async function listAffiliateLinkOptions() {
  const links = await prisma.affiliateLink.findMany({
    where: {
      programId: {
        not: null,
      },
      OR: [
        { url: { not: null } },
        { destinationUrl: { not: null } },
      ],
    },
    orderBy: [{ updatedAt: 'desc' }],
    select: {
      id: true,
      name: true,
      url: true,
      destinationUrl: true,
      programId: true,
      partnerId: true,
      program: {
        select: {
          id: true,
          network: true,
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return links
    .filter((link) => link.program)
    .map((link) => ({
      id: link.id,
      name: cleanText(link.name) ?? 'Shop',
      url: cleanText(link.url) ?? cleanText(link.destinationUrl) ?? '',
      partnerId: link.partnerId,
      programId: link.programId!,
      brandId: link.program!.brand.id,
      brandName: link.program!.brand.name,
      network: link.program!.network,
      label: `${link.program!.brand.name} • ${formatAffiliateNetworks([link.program!.network])} • ${cleanText(link.name) ?? 'Shop'}`,
    }))
    .filter((link) => link.url);
}

export { affiliateBrandSelect, legacyPostAffiliateSelect };
