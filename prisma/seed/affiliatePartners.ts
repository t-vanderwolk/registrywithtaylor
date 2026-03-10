import { AffiliateNetwork, CommissionType, PrismaClient } from '@prisma/client';
import { resolveAffiliateDestinationUrl } from '@/lib/affiliatePartners';

const prisma = new PrismaClient();

type DirectAffiliateSeed = {
  name: string;
  slug: string;
  network: AffiliateNetwork;
  partnerType: string;
  affiliatePid: string | null;
  baseUrl: string;
  logoUrl: string;
  commissionRate: string;
  routingPriority: number;
  allowedContexts: string[];
};

const DIRECT_PARTNERS: DirectAffiliateSeed[] = [
  {
    name: 'Silver Cross',
    slug: 'silver-cross',
    network: AffiliateNetwork.DIRECT,
    partnerType: 'brand',
    affiliatePid: '4762',
    baseUrl: 'https://www.silvercrossbaby.com',
    logoUrl: '/images/partners/silvercross.png',
    commissionRate: '15%',
    routingPriority: 1,
    allowedContexts: ['blog', 'registry'],
  },
  {
    name: 'BabyQuip',
    slug: 'babyquip',
    network: AffiliateNetwork.DIRECT,
    partnerType: 'service',
    affiliatePid: null,
    baseUrl: 'https://www.babyquip.com',
    logoUrl: '/images/partners/babyquip.png',
    commissionRate: '10%',
    routingPriority: 1,
    allowedContexts: ['blog', 'academy'],
  },
  {
    name: 'MacroBaby',
    slug: 'macrobaby',
    network: AffiliateNetwork.DIRECT,
    partnerType: 'retailer',
    affiliatePid: null,
    baseUrl: 'https://www.macrobaby.com',
    logoUrl: '/images/partners/macrobaby.png',
    commissionRate: '5-10%',
    routingPriority: 1,
    allowedContexts: ['blog', 'registry'],
  },
  {
    name: 'Bebcare',
    slug: 'bebcare',
    network: AffiliateNetwork.DIRECT,
    partnerType: 'brand',
    affiliatePid: null,
    baseUrl: 'https://bebcare.com',
    logoUrl: '/images/partners/bebcare.png',
    commissionRate: '15%',
    routingPriority: 1,
    allowedContexts: ['blog', 'registry'],
  },
];

function hostnameFor(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function commissionTypeFor(rate: string) {
  return rate.includes('-') ? CommissionType.VARIABLE : CommissionType.PERCENTAGE;
}

async function upsertCanonicalLink({
  programId,
  partnerId,
  url,
  label,
}: {
  programId: string;
  partnerId: string;
  url: string;
  label: string;
}) {
  const existing = await prisma.affiliateLink.findFirst({
    where: {
      programId,
      partnerId,
      name: label,
      code: null,
    },
    select: { id: true },
  });

  if (existing) {
    return prisma.affiliateLink.update({
      where: { id: existing.id },
      data: {
        url,
        destinationUrl: url,
      },
    });
  }

  return prisma.affiliateLink.create({
    data: {
      programId,
      partnerId,
      name: label,
      url,
      destinationUrl: url,
    },
  });
}

async function main() {
  let seededCount = 0;

  for (const seed of DIRECT_PARTNERS) {
    const brand = await prisma.brand.upsert({
      where: { name: seed.name },
      update: {
        website: seed.baseUrl,
        logoUrl: seed.logoUrl,
      },
      create: {
        name: seed.name,
        website: seed.baseUrl,
        logoUrl: seed.logoUrl,
      },
      select: { id: true, name: true },
    });

    const program = await prisma.affiliateProgram.upsert({
      where: {
        brandId_network: {
          brandId: brand.id,
          network: seed.network,
        },
      },
      update: {
        commission: seed.commissionRate,
      },
      create: {
        brandId: brand.id,
        network: seed.network,
        campaignId: seed.affiliatePid,
        commission: seed.commissionRate,
      },
      select: { id: true },
    });

    const resolvedAffiliateLink =
      resolveAffiliateDestinationUrl({
        baseUrl: seed.baseUrl,
        affiliatePid: seed.affiliatePid,
      }) ?? seed.baseUrl;

    const allowedDomain = hostnameFor(seed.baseUrl);

    const partner = await prisma.affiliatePartner.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        network: seed.network,
        partnerType: seed.partnerType,
        affiliatePid: seed.affiliatePid,
        commissionType: commissionTypeFor(seed.commissionRate),
        commissionRate: seed.commissionRate,
        baseUrl: seed.baseUrl,
        website: seed.baseUrl,
        logoUrl: seed.logoUrl,
        affiliateLink: resolvedAffiliateLink,
        routingPriority: seed.routingPriority,
        allowedContexts: seed.allowedContexts,
        allowedDomains: allowedDomain ? [allowedDomain] : [],
        brandId: brand.id,
        programId: program.id,
        isActive: true,
      },
      create: {
        name: seed.name,
        slug: seed.slug,
        network: seed.network,
        partnerType: seed.partnerType,
        affiliatePid: seed.affiliatePid,
        commissionType: commissionTypeFor(seed.commissionRate),
        commissionRate: seed.commissionRate,
        baseUrl: seed.baseUrl,
        website: seed.baseUrl,
        logoUrl: seed.logoUrl,
        affiliateLink: resolvedAffiliateLink,
        routingPriority: seed.routingPriority,
        allowedContexts: seed.allowedContexts,
        allowedDomains: allowedDomain ? [allowedDomain] : [],
        brandId: brand.id,
        programId: program.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    await upsertCanonicalLink({
      programId: program.id,
      partnerId: partner.id,
      url: resolvedAffiliateLink,
      label: `${seed.name} Primary`,
    });

    seededCount += 1;
    console.log(`Seeded direct partner: ${partner.name}`);
  }

  console.log(`Direct affiliate partners seeded: ${seededCount}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed direct affiliate partners:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
