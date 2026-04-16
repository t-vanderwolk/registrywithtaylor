import prisma from '@/lib/server/prisma';
import { AffiliateNetwork, CommissionType } from '@prisma/client';
import { getAffiliatePartnerLogo } from '@/lib/affiliatePartnerLogos';
import {
  getDefaultRetailerFallbacks,
  inferAffiliatePaymentRisk,
  inferAffiliateTier,
} from '@/lib/affiliatePartners';
import { slugify } from '@/lib/slugify';

type AffiliateSeed = {
  name: string;
  network: AffiliateNetwork;
  advertiserId?: string;
  commissionType: CommissionType;
  commissionRate: string;
  category?: string;
  threeMonthEpc?: number;
  sevenDayEpc?: number;
  notes?: string;
  isActive?: boolean;
  website?: string;
  logoUrl?: string | null;
  partnerType?: string;
  routingPriority?: number;
  allowedContexts?: string[];
};

function hostnameFor(value: string | null | undefined) {
  const cleaned = value?.trim();

  if (!cleaned) {
    return null;
  }

  try {
    return new URL(cleaned).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function resolveCanonicalLogoUrl(name: string, logoUrl: string | null | undefined) {
  const cleanedLogoUrl = logoUrl?.trim();
  if (cleanedLogoUrl) {
    return cleanedLogoUrl;
  }

  const resolvedLogo = getAffiliatePartnerLogo(name);
  return resolvedLogo.isFallback ? null : resolvedLogo.src;
}

const affiliateCanon: AffiliateSeed[] = [
  {
    name: 'Albee Baby',
    network: AffiliateNetwork.CJ,
    advertiserId: '4488778',
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '2%',
    category: 'Babies',
    threeMonthEpc: 84.35,
    sevenDayEpc: 66.98,
  },
  {
    name: 'Bc Babycare',
    network: AffiliateNetwork.CJ,
    advertiserId: '7582444',
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
    threeMonthEpc: 8.51,
    sevenDayEpc: 5.71,
  },
  {
    name: 'Coco Moon Hawai‘i',
    network: AffiliateNetwork.CJ,
    advertiserId: '7396985',
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '8%',
    threeMonthEpc: 44.16,
    sevenDayEpc: 20.32,
  },
  {
    name: 'Colugo',
    network: AffiliateNetwork.CJ,
    advertiserId: '7017782',
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '8%',
    threeMonthEpc: 14.43,
    sevenDayEpc: 2.64,
  },
  {
    name: 'Huggies Amazon Marketplace',
    network: AffiliateNetwork.CJ,
    advertiserId: '7590486',
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'N/A',
    sevenDayEpc: 9.74,
  },
  {
    name: 'Momcozy',
    network: AffiliateNetwork.CJ,
    advertiserId: '7327388',
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '8%',
    threeMonthEpc: 76.68,
    sevenDayEpc: 76.37,
  },
  {
    name: 'SlumberPod',
    network: AffiliateNetwork.CJ,
    advertiserId: '7166676',
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
    threeMonthEpc: 45.33,
    sevenDayEpc: 35.79,
  },
  {
    name: 'Babeside',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '20%',
  },
  {
    name: 'Angelbliss',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
  },
  {
    name: 'Munchkin',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '8%',
  },
  {
    name: 'Mustela USA',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '8%',
  },
  {
    name: 'Kids2Shop',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '7%',
  },
  {
    name: 'Pish Posh Baby',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '6%',
  },
  {
    name: 'REBEL',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
  },
  {
    name: 'Baby Tula',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '4%',
  },
  {
    name: 'Happiest Baby',
    network: AffiliateNetwork.IMPACT,
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'SNOO Rental $25 / AU 4% / EU 4%',
  },
  {
    name: 'ANB Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '4%',
  },
  {
    name: 'Awin (USD)',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.CPL,
    commissionRate: '$30 Lead',
  },
  {
    name: 'Babu Bath',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
  },
  {
    name: 'Baby Shusher',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '15%',
  },
  {
    name: 'Baby Trend',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '8%',
  },
  {
    name: 'Bella Luna Toys',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
  },
  {
    name: 'Bundle Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '1-3%',
  },
  {
    name: 'Bungle Nursery Cribs',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
    notes: 'Tier 3 conditional risk-monitored brand.',
    partnerType: 'brand',
    routingPriority: 80,
  },
  {
    name: 'dadada Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '6%',
  },
  {
    name: 'Earth Mama Organics',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '0-10%',
  },
  {
    name: 'Ergobaby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '0-20%',
  },
  {
    name: 'Grownsy',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '12%',
  },
  {
    name: 'Inglesina',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '0-15%',
  },
  {
    name: 'Inklings Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
  },
  {
    name: 'Jool Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
  },
  {
    name: 'Kyte Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '0-10%',
  },
  {
    name: 'Le Lolo Postpartum',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
  },
  {
    name: 'Make-A-Fort',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '3-12%',
  },
  {
    name: 'MyRegistry',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.CPL,
    commissionRate: '$1.50 CPL',
  },
  {
    name: 'Newton Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '0-5%',
  },
  {
    name: 'Nanit',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'Varies',
    notes: 'Tier 1 premium confidence builder.',
  },
  {
    name: 'Owlet',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '3%',
  },
  {
    name: 'Papablic',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
  },
  {
    name: 'Veer',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'Varies',
    notes: 'Tier 1 gear and mobility brand.',
  },
  {
    name: 'Petit from Poa',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
  },
  {
    name: 'Prosto Concept',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '25%',
  },
  {
    name: 'Snuggle Me Organic',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '2%',
  },
  {
    name: 'Belly Bandit',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'Varies',
    notes: 'Tier 2 editorial and postpartum support brand.',
  },
  {
    name: "The Baby's Brew",
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '2-4%',
  },
  {
    name: 'The Uptown Baby',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
  },
  {
    name: 'Timo & Violet',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '13%',
  },
  {
    name: 'Tommee Tippee',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '20%',
  },
  {
    name: 'Tutti Bambini',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '4%',
  },
  {
    name: 'WAYB',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '3-10%',
  },
  {
    name: 'Baby Brezza',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'Varies',
    notes: 'Tier 2 high-conversion support brand.',
  },
  {
    name: 'Mima',
    network: AffiliateNetwork.AWIN,
    commissionType: CommissionType.VARIABLE,
    commissionRate: 'Varies',
    notes: 'Tier 3 conditional risk-monitored brand.',
  },
  {
    name: 'Silver Cross',
    network: AffiliateNetwork.DIRECT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '15%',
  },
  {
    name: 'BabyQuip',
    network: AffiliateNetwork.DIRECT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '10%',
  },
  {
    name: 'MacroBaby',
    network: AffiliateNetwork.DIRECT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5-10%',
  },
  {
    name: 'Bebcare',
    network: AffiliateNetwork.DIRECT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '15%',
  },
  {
    name: 'Modern Nursery',
    network: AffiliateNetwork.DIRECT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
    notes: 'Retail fallback layer.',
  },
  {
    name: 'Newborn Nursery Furniture',
    network: AffiliateNetwork.DIRECT,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: '5%',
    notes: 'Tier 1 nursery anchor purchase.',
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const partner of affiliateCanon) {
    const slug = slugify(partner.name) || 'partner';
    const website = partner.website?.trim() || null;
    const allowedDomain = hostnameFor(website);
    const existing =
      (await prisma.affiliatePartner.findUnique({
        where: { slug },
        select: {
          id: true,
          website: true,
          baseUrl: true,
          logoUrl: true,
          affiliateLink: true,
          partnerType: true,
          routingPriority: true,
          allowedContexts: true,
          allowedDomains: true,
        },
      })) ??
      (await prisma.affiliatePartner.findUnique({
        where: {
          name_network: {
            name: partner.name,
            network: partner.network,
          },
        },
        select: {
          id: true,
          website: true,
          baseUrl: true,
          logoUrl: true,
          affiliateLink: true,
          partnerType: true,
          routingPriority: true,
          allowedContexts: true,
          allowedDomains: true,
        },
      }));
    const partnerType = partner.partnerType ?? existing?.partnerType ?? 'brand';
    const routingPriority = partner.routingPriority ?? existing?.routingPriority ?? 99;
    const resolvedLogoUrl = resolveCanonicalLogoUrl(partner.name, partner.logoUrl);
    const affiliateTier = inferAffiliateTier({
      name: partner.name,
      notes: partner.notes,
      routingPriority,
    });
    const paymentRisk = inferAffiliatePaymentRisk({
      name: partner.name,
      notes: partner.notes,
      affiliateTier,
    });

    const data = {
      name: partner.name,
      slug,
      network: partner.network,
      advertiserId: partner.advertiserId ?? null,
      commissionType: partner.commissionType,
      commissionRate: partner.commissionRate,
      category: partner.category ?? null,
      threeMonthEpc: partner.threeMonthEpc ?? null,
      sevenDayEpc: partner.sevenDayEpc ?? null,
      notes: partner.notes ?? null,
      isActive: partner.isActive ?? true,
      website: website ?? existing?.website ?? null,
      baseUrl: website ?? existing?.baseUrl ?? existing?.website ?? '',
      affiliateTier,
      paymentRisk,
      retailerFallback: getDefaultRetailerFallbacks(partnerType),
      logoUrl: resolvedLogoUrl ?? existing?.logoUrl ?? null,
      affiliateLink: existing?.affiliateLink ?? website ?? null,
      partnerType,
      routingPriority,
      allowedContexts: partner.allowedContexts ?? existing?.allowedContexts ?? ['blog', 'guide', 'registry', 'academy'],
      allowedDomains: allowedDomain ? [allowedDomain] : (existing?.allowedDomains ?? []),
    };

    if (existing) {
      await prisma.affiliatePartner.update({
        where: { id: existing.id },
        data,
      });
      updated += 1;
    } else {
      await prisma.affiliatePartner.create({
        data,
      });
      created += 1;
    }
  }

  const grouped = await prisma.affiliatePartner.groupBy({
    by: ['network'],
    _count: { _all: true },
    orderBy: { network: 'asc' },
  });

  console.log('Affiliate canon seeded. Counts by network:');
  for (const entry of grouped) {
    console.log(`- ${entry.network}: ${entry._count._all}`);
  }
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed affiliate canon:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
