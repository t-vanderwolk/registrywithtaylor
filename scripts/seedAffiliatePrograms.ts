import { AffiliateNetwork, CommissionType, PrismaClient } from '@prisma/client';
import {
  getDefaultRetailerFallbacks,
  inferAffiliatePaymentRisk,
  inferAffiliateTier,
} from '@/lib/affiliatePartners';
import { slugify } from '@/lib/slugify';

const prisma = new PrismaClient();

type AffiliateSeed = {
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  legacyPartnerName?: string | null;
  partnerType?: string;
  routingPriority?: number;
  allowedContexts?: string[];
  notes?: string | null;
  category?: string | null;
  programs: Array<{
    network: AffiliateNetwork;
    campaignId?: string | null;
    commission?: string | null;
    cookieLength?: string | null;
    legacyPartnerName?: string | null;
  }>;
};

const DEFAULT_ALLOWED_CONTEXTS = ['blog', 'guide', 'registry', 'academy'];

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

function commissionTypeFor(commission: string | null | undefined) {
  const cleaned = commission?.trim() ?? '';

  if (cleaned.includes('CPL') || cleaned.includes('$')) {
    return CommissionType.CPL;
  }

  if (cleaned.includes('-') || cleaned.toLowerCase() === 'varies') {
    return CommissionType.VARIABLE;
  }

  return CommissionType.PERCENTAGE;
}

function defaultRoutingPriority(network: AffiliateNetwork) {
  switch (network) {
    case AffiliateNetwork.DIRECT:
      return 10;
    case AffiliateNetwork.CJ:
      return 20;
    case AffiliateNetwork.IMPACT:
      return 40;
    case AffiliateNetwork.AWIN:
      return 50;
    default:
      return 99;
  }
}

const IMPACT_BRANDS: AffiliateSeed[] = [
  {
    name: 'Babeside',
    legacyPartnerName: 'Babeside',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '20%' }],
  },
  {
    name: 'Angelbliss',
    legacyPartnerName: 'Angelbliss',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '10%' }],
  },
  {
    name: 'Munchkin',
    website: 'https://www.munchkin.com',
    legacyPartnerName: 'Munchkin',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '8%' }],
  },
  {
    name: 'Mustela USA',
    website: 'https://www.mustelausa.com',
    logoUrl: '/assets/logos/mustela-logo.png',
    legacyPartnerName: 'Mustela USA',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '8%' }],
  },
  {
    name: 'Kids2Shop',
    logoUrl: '/assets/logos/kids2shop-logo.png',
    legacyPartnerName: 'Kids2Shop',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '7%' }],
  },
  {
    name: 'Pish Posh Baby',
    website: 'https://www.pishposhbaby.com',
    legacyPartnerName: 'Pish Posh Baby',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '6%' }],
  },
  {
    name: 'REBEL',
    logoUrl: '/assets/logos/robellogo.png',
    legacyPartnerName: 'REBEL',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '5%' }],
  },
  {
    name: 'Baby Tula',
    website: 'https://babytula.com',
    legacyPartnerName: 'Baby Tula',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: '4%' }],
  },
  {
    name: 'Happiest Baby',
    website: 'https://www.happiestbaby.com',
    logoUrl: '/assets/logos/happiestbaby-logo.png',
    legacyPartnerName: 'Happiest Baby',
    partnerType: 'service',
    routingPriority: 45,
    allowedContexts: ['blog', 'guide', 'academy'],
    notes: 'System-level revenue driver.',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: 'SNOO Rental $25 / AU 4% / EU 4%' }],
  },
  {
    name: 'Babylist',
    website: 'https://www.babylist.com',
    programs: [{ network: AffiliateNetwork.IMPACT, commission: 'Varies' }],
  },
];

const AWIN_BRANDS: AffiliateSeed[] = [
  {
    name: 'Newton Baby',
    website: 'https://www.newtonbaby.com',
    logoUrl: '/assets/logos/newtonbaby-logo.png',
    legacyPartnerName: 'Newton Baby',
    partnerType: 'brand',
    routingPriority: 20,
    notes: 'Tier 1 premium confidence builder.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '83865', commission: '0-5%', cookieLength: '30 Days' }],
  },
  {
    name: 'Nanit',
    website: 'https://www.nanit.com',
    legacyPartnerName: 'Nanit',
    partnerType: 'brand',
    routingPriority: 20,
    notes: 'Tier 1 premium confidence builder.',
    programs: [{ network: AffiliateNetwork.AWIN, commission: 'Varies', cookieLength: 'Varies' }],
  },
  {
    name: 'Timo & Violet',
    website: 'https://timoandviolet.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/100626.png',
    legacyPartnerName: 'Timo & Violet',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '100626', commission: '13%', cookieLength: '30 Days' }],
  },
  {
    name: 'Make-A-Fort',
    website: 'https://www.makeafort.fun',
    logoUrl: '/assets/logos/make-a-fortlogo.png',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '93345', commission: '3-12%', cookieLength: '30 Days' }],
  },
  {
    name: 'ANB Baby',
    website: 'https://www.anbbaby.com',
    logoUrl: '/assets/logos/anbbaby.png',
    legacyPartnerName: 'ANB Baby NY',
    partnerType: 'retailer',
    routingPriority: 35,
    notes: 'Retail fallback layer.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '111006', commission: '4%', cookieLength: '30 Days' }],
  },
  {
    name: 'Grownsy',
    website: 'https://grownsy.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/102060.png',
    legacyPartnerName: 'Grownsy',
    partnerType: 'brand',
    routingPriority: 80,
    notes: 'Tier 3 conditional risk-monitored brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '102060', commission: '12%', cookieLength: '30 Days' }],
  },
  {
    name: 'Babu Bath',
    website: 'https://babubath.com',
    logoUrl: '/assets/logos/babubath.png',
    legacyPartnerName: 'Babu Bath',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '106552', commission: '5%', cookieLength: '30 Days' }],
  },
  {
    name: 'Bungle Nursery Cribs',
    website: 'https://www.bunglecribs.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/105000.png',
    legacyPartnerName: 'Bungle Nursery Cribs',
    partnerType: 'brand',
    routingPriority: 80,
    notes: 'Tier 3 conditional risk-monitored brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '105000', commission: '10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Owlet',
    website: 'https://owletcare.com',
    logoUrl: '/assets/logos/owlet-logo.png',
    legacyPartnerName: 'Owlet Baby Care',
    partnerType: 'brand',
    routingPriority: 20,
    notes: 'Tier 1 premium confidence builder.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '84414', commission: '3%', cookieLength: '15 Days' }],
  },
  {
    name: 'dadada Baby',
    website: 'https://dadadababy.com',
    logoUrl: '/assets/logos/dadadadalogo.png',
    legacyPartnerName: 'dadada Baby',
    partnerType: 'brand',
    routingPriority: 30,
    notes: 'Tier 1 nursery anchor purchase.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '106316', commission: '6%', cookieLength: '30 Days' }],
  },
  {
    name: "The Baby's Brew",
    website: 'https://www.thebabysbrew.com',
    logoUrl: '/assets/logos/thebabybrew.png',
    legacyPartnerName: "The Baby's Brew",
    partnerType: 'brand',
    routingPriority: 55,
    notes: 'Tier 2 feeding and innovation brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '97124', commission: '2-4%', cookieLength: '30 Days' }],
  },
  {
    name: 'Kyte Baby',
    website: 'https://kytebaby.com',
    logoUrl: '/assets/logos/kytebaby-logo.png',
    legacyPartnerName: 'Kyte Baby',
    partnerType: 'brand',
    routingPriority: 50,
    notes: 'Tier 2 high-conversion support brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '95571', commission: '0-10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Earth Mama Organics',
    website: 'https://earthmama.com',
    logoUrl: '/assets/logos/earthmama.png',
    legacyPartnerName: 'Earth Mama Organics',
    partnerType: 'brand',
    routingPriority: 50,
    notes: 'Tier 2 postpartum support brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '101823', commission: '0-10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Baby Brezza',
    website: 'https://babybrezza.com',
    legacyPartnerName: 'Baby Brezza',
    partnerType: 'brand',
    routingPriority: 50,
    notes: 'Tier 2 everyday conversion and feeding support brand.',
    programs: [{ network: AffiliateNetwork.AWIN, commission: 'Varies', cookieLength: 'Varies' }],
  },
  {
    name: 'Veer',
    website: 'https://goveer.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/106887.png',
    legacyPartnerName: 'Veer',
    partnerType: 'brand',
    routingPriority: 25,
    notes: 'Tier 1 gear and mobility brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '106887', commission: 'Varies', cookieLength: '30 Days' }],
  },
  {
    name: 'Mima',
    website: 'https://mimakidsusa.com',
    logoUrl: '/affiliate-logos/mima.png',
    legacyPartnerName: 'Mima',
    partnerType: 'brand',
    routingPriority: 80,
    notes: 'Tier 3 conditional risk-monitored brand.',
    programs: [{ network: AffiliateNetwork.AWIN, commission: 'Varies', cookieLength: 'Varies' }],
  },
  {
    name: 'Bella Luna Toys',
    website: 'https://bellalunatoys.com',
    logoUrl: '/assets/logos/bellaluna.png',
    legacyPartnerName: 'Bella Luna Toys',
    partnerType: 'brand',
    routingPriority: 60,
    notes: 'Tier 2 editorial and specialty brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '73291', commission: '5%', cookieLength: '30 Days' }],
  },
  {
    name: 'WAYB',
    website: 'https://wayb.com',
    logoUrl: '/assets/logos/wayblogo.png',
    legacyPartnerName: 'WAYB',
    partnerType: 'brand',
    routingPriority: 25,
    notes: 'Tier 1 gear and mobility brand with payment-risk monitoring.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '85533', commission: '3-10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Papablic',
    website: 'https://papablic.com',
    partnerType: 'brand',
    routingPriority: 55,
    notes: 'Tier 2 feeding and innovation brand.',
    programs: [{ network: AffiliateNetwork.AWIN, commission: '5%' }],
  },
  {
    name: 'Baby Trend',
    website: 'https://babytrend.com',
    logoUrl: '/assets/logos/babytrend.png',
    legacyPartnerName: 'Baby Trend',
    partnerType: 'brand',
    routingPriority: 28,
    notes: 'Tier 1 gear and mobility brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '97402', commission: '8%', cookieLength: '30 Days' }],
  },
  {
    name: 'Inklings Baby',
    website: 'https://inklingsbaby.com',
    logoUrl: '/assets/logos/inklinglogo.jpeg',
    legacyPartnerName: 'Inklings Baby',
    partnerType: 'brand',
    routingPriority: 60,
    notes: 'Tier 2 editorial and specialty brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '111620', commission: '5%', cookieLength: '60 Days' }],
  },
  {
    name: 'Le Lolo Postpartum',
    website: 'https://wearelelolo.com',
    logoUrl: '/assets/logos/lelolologo.png',
    legacyPartnerName: 'Le Lolo Postpartum',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '108028', commission: '10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Jool Baby',
    website: 'https://joolbaby.com',
    logoUrl: '/assets/logos/joolbabylogo.png',
    legacyPartnerName: 'Jool Baby',
    partnerType: 'brand',
    routingPriority: 50,
    notes: 'Tier 2 high-conversion support brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '99864', commission: '10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Prosto Concept',
    website: 'https://en.prosto.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/111345.png',
    legacyPartnerName: 'Prosto Concept',
    partnerType: 'brand',
    routingPriority: 70,
    notes: 'Opportunity watchlist brand with standout EPC.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '111345', commission: '25%', cookieLength: '45 Days' }],
  },
  {
    name: 'Petit from Poa',
    website: 'https://petitfrompoa.com',
    logoUrl: '/assets/logos/petitfrompoalogo.png',
    legacyPartnerName: 'Petit from Poa',
    partnerType: 'brand',
    routingPriority: 80,
    notes: 'Tier 3 conditional risk-monitored brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '97096', commission: '10%', cookieLength: '60 Days' }],
  },
  {
    name: 'Snuggle Me Organic',
    website: 'https://snugglemeorganic.com',
    logoUrl: '/assets/logos/snugglemeorganics.png',
    legacyPartnerName: 'Snuggle Me Organic',
    partnerType: 'brand',
    routingPriority: 80,
    notes: 'Tier 3 conditional risk-monitored brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '95590', commission: '2%', cookieLength: '30 Days' }],
  },
  {
    name: 'MyRegistry',
    website: 'https://www.myregistry.com',
    logoUrl: '/assets/logos/myregistry-logo.png',
    legacyPartnerName: 'MyRegistry.com',
    partnerType: 'service',
    routingPriority: 35,
    notes: 'System-level revenue driver.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '25355', commission: '$1.50 CPL', cookieLength: '30 Days' }],
  },
  {
    name: 'Belly Bandit',
    website: 'https://bellybandit.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/111580.png',
    legacyPartnerName: 'Belly Bandit',
    partnerType: 'brand',
    routingPriority: 60,
    notes: 'Tier 2 editorial and postpartum support brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '111580', commission: 'Varies', cookieLength: '45 Days' }],
  },
  {
    name: 'Baby Shusher',
    website: 'https://babyshusher.com',
    logoUrl: '/assets/logos/babyshusher.png',
    legacyPartnerName: 'Baby Shusher',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '89829', commission: '15%', cookieLength: '30 Days' }],
  },
  {
    name: 'Ergobaby',
    website: 'https://ergobaby.com',
    logoUrl: '/assets/logos/ergobabylogo.png',
    legacyPartnerName: 'ERGO Baby Carrier, Inc.',
    partnerType: 'brand',
    routingPriority: 50,
    notes: 'Tier 2 high-conversion support brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '101032', commission: '0-20%', cookieLength: '30 Days' }],
  },
  {
    name: 'The Uptown Baby',
    website: 'https://theuptownbaby.com',
    logoUrl: 'https://ui.awin.com/images/upload/merchant/profile/109836.png',
    legacyPartnerName: 'The Uptown Baby',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '109836', commission: '10%', cookieLength: '30 Days' }],
  },
  {
    name: 'Inglesina',
    website: 'https://inglesina.us',
    logoUrl: '/assets/logos/inglesinalogo.png',
    legacyPartnerName: 'Inglesina',
    partnerType: 'brand',
    routingPriority: 25,
    notes: 'Tier 1 gear and mobility brand.',
    programs: [{ network: AffiliateNetwork.AWIN, campaignId: '93418', commission: '0-15%', cookieLength: '30 Days' }],
  },
];

async function upsertProgramLink({
  programId,
  partnerId,
  url,
  name = 'Shop',
}: {
  programId: string;
  partnerId?: string | null;
  url: string;
  name?: string;
}) {
  const existing = await prisma.affiliateLink.findFirst({
    where: {
      programId,
      name,
      code: null,
    },
    select: { id: true },
  });

  if (existing) {
    return prisma.affiliateLink.update({
      where: { id: existing.id },
      data: {
        partnerId: partnerId ?? null,
        name,
        url,
        destinationUrl: url,
      },
    });
  }

  return prisma.affiliateLink.create({
    data: {
      programId,
      partnerId: partnerId ?? null,
      name,
      url,
      destinationUrl: url,
    },
  });
}

async function seedBrand(seed: AffiliateSeed) {
  const brand = await prisma.brand.upsert({
    where: { name: seed.name },
    update: {
      website: seed.website ?? null,
      logoUrl: seed.logoUrl ?? null,
    },
    create: {
      name: seed.name,
      website: seed.website ?? null,
      logoUrl: seed.logoUrl ?? null,
    },
  });

  for (const programSeed of seed.programs) {
    const program = await prisma.affiliateProgram.upsert({
      where: {
        brandId_network: {
          brandId: brand.id,
          network: programSeed.network,
        },
      },
      update: {
        campaignId: programSeed.campaignId ?? null,
        commission: programSeed.commission ?? null,
        cookieLength: programSeed.cookieLength ?? null,
      },
      create: {
        brandId: brand.id,
        network: programSeed.network,
        campaignId: programSeed.campaignId ?? null,
        commission: programSeed.commission ?? null,
        cookieLength: programSeed.cookieLength ?? null,
      },
    });

    const legacyPartnerName = programSeed.legacyPartnerName ?? seed.legacyPartnerName ?? null;
    const legacyPartner = legacyPartnerName
      ? await prisma.affiliatePartner.findUnique({
          where: {
            name_network: {
              name: legacyPartnerName,
              network: programSeed.network,
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            affiliateLink: true,
            website: true,
            logoUrl: true,
          },
        })
      : null;

    const canonicalPartner = await prisma.affiliatePartner.findUnique({
      where: {
        name_network: {
          name: seed.name,
          network: programSeed.network,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    const canonicalUrl = legacyPartner?.affiliateLink?.trim() || seed.website?.trim() || null;
    const allowedDomain = hostnameFor(seed.website);
    const routingPriority = seed.routingPriority ?? defaultRoutingPriority(programSeed.network);
    const affiliateTier = inferAffiliateTier({
      name: seed.name,
      notes: seed.notes,
      routingPriority,
    });
    const paymentRisk = inferAffiliatePaymentRisk({
      name: seed.name,
      notes: seed.notes,
      affiliateTier,
    });
    const partnerRecord = {
      name: seed.name,
      slug: slugify(seed.name) || legacyPartner?.slug || 'affiliate-partner',
      network: programSeed.network,
      commissionType: commissionTypeFor(programSeed.commission),
      commissionRate: programSeed.commission?.trim() || 'Varies',
      category: seed.category ?? null,
      notes: seed.notes ?? null,
      isActive: true,
      allowedDomains: allowedDomain ? [allowedDomain] : [],
      website: seed.website?.trim() || legacyPartner?.website?.trim() || null,
      baseUrl: seed.website?.trim() || legacyPartner?.website?.trim() || '',
      affiliateTier,
      paymentRisk,
      retailerFallback: getDefaultRetailerFallbacks(seed.partnerType ?? 'brand'),
      logoUrl: legacyPartner?.logoUrl?.trim() || seed.logoUrl?.trim() || null,
      affiliateLink: canonicalUrl,
      brandId: brand.id,
      programId: program.id,
      partnerType: seed.partnerType ?? 'brand',
      affiliatePid: programSeed.campaignId?.trim() || null,
      routingPriority,
      allowedContexts: seed.allowedContexts ?? DEFAULT_ALLOWED_CONTEXTS,
    };

    const partner = canonicalPartner || legacyPartner
      ? await prisma.affiliatePartner.update({
        where: { id: canonicalPartner?.id ?? legacyPartner!.id },
        data: partnerRecord,
        select: { id: true },
      })
      : await prisma.affiliatePartner.create({
        data: partnerRecord,
        select: { id: true },
      });

    if (canonicalUrl) {
      await upsertProgramLink({
        programId: program.id,
        partnerId: partner.id,
        name: 'Shop',
        url: canonicalUrl,
      });
    }
  }
}

async function main() {
  for (const seed of [...IMPACT_BRANDS, ...AWIN_BRANDS]) {
    await seedBrand(seed);
  }

  const [brandCount, programCount, impactCount, awinCount] = await Promise.all([
    prisma.brand.count(),
    prisma.affiliateProgram.count(),
    prisma.affiliateProgram.count({ where: { network: AffiliateNetwork.IMPACT } }),
    prisma.affiliateProgram.count({ where: { network: AffiliateNetwork.AWIN } }),
  ]);

  console.log(`Affiliate architecture seeded: ${brandCount} brands, ${programCount} programs.`);
  console.log(`Impact programs: ${impactCount}`);
  console.log(`AWIN programs: ${awinCount}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed affiliate programs:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
