import { AffiliateNetwork, CommissionType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedPartner = {
  name: string;
  slug: string;
  logoUrl: string;
  website: string;
  affiliateLink: string;
};

const CJ_PARTNERS: SeedPartner[] = [
  {
    name: 'Albee Baby',
    slug: 'albee-baby',
    affiliateLink: 'https://www.dpbolvw.net/click-101548494-15401958',
    website: 'https://www.albeebaby.com',
    logoUrl: '/affiliate-logos/albee-baby.png',
  },
  {
    name: 'Momcozy',
    slug: 'momcozy',
    affiliateLink: 'https://www.jdoqocy.com/click-101548494-17049857',
    website: 'https://momcozy.com',
    logoUrl: '/affiliate-logos/momcozy.png',
  },
  {
    name: 'SlumberPod',
    slug: 'slumberpod',
    affiliateLink: 'https://www.anrdoezrs.net/click-101548494-15871448',
    website: 'https://slumberpod.com',
    logoUrl: '/affiliate-logos/slumberpod.png',
  },
  {
    name: 'Colugo',
    slug: 'colugo',
    affiliateLink: 'https://www.tkqlhce.com/click-101548494-15872703',
    website: 'https://colugo.com',
    logoUrl: '/affiliate-logos/colugo.png',
  },
  {
    name: 'BC Babycare',
    slug: 'bc-babycare',
    affiliateLink: 'https://www.tkqlhce.com/click-101548494-17126163',
    website: 'https://bcbabycare.com',
    logoUrl: '/affiliate-logos/bcbabycare.png',
  },
];

function websiteDomains(website: string) {
  try {
    const hostname = new URL(website).hostname.toLowerCase();
    const normalized = hostname.replace(/^www\./, '');
    return normalized ? [normalized] : [];
  } catch {
    return [];
  }
}

async function upsertPartner(partner: SeedPartner) {
  const existingBySlug = await prisma.affiliatePartner.findUnique({
    where: { slug: partner.slug },
    select: { id: true },
  });

  const existingByNameNetwork = existingBySlug
    ? null
    : await prisma.affiliatePartner.findUnique({
        where: {
          name_network: {
            name: partner.name,
            network: AffiliateNetwork.CJ,
          },
        },
        select: { id: true },
      });

  const data = {
    name: partner.name,
    slug: partner.slug,
    logoUrl: partner.logoUrl,
    website: partner.website,
    affiliateLink: partner.affiliateLink,
    network: AffiliateNetwork.CJ,
    commissionType: CommissionType.PERCENTAGE,
    commissionRate: 'Variable',
    isActive: true,
    allowedDomains: websiteDomains(partner.website),
  };

  if (existingBySlug || existingByNameNetwork) {
    await prisma.affiliatePartner.update({
      where: { id: existingBySlug?.id ?? existingByNameNetwork!.id },
      data,
    });
    return 'updated';
  }

  await prisma.affiliatePartner.create({
    data,
  });
  return 'created';
}

async function main() {
  let createdCount = 0;
  let updatedCount = 0;

  for (const partner of CJ_PARTNERS) {
    const result = await upsertPartner(partner);
    if (result === 'created') {
      createdCount += 1;
    } else {
      updatedCount += 1;
    }
  }

  console.log(`CJ affiliates seeded: ${createdCount} created, ${updatedCount} updated.`);
}

main()
  .catch((error) => {
    console.error('Failed to seed affiliates:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
