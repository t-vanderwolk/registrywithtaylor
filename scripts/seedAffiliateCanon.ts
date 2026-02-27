import prisma from '@/lib/server/prisma';
import { AffiliateNetwork, CommissionType } from '@prisma/client';

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
};

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
    name: 'ANB Baby NY',
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
    name: 'ERGO Baby Carrier, Inc.',
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
    name: 'MyRegistry.com',
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
    name: 'Owlet Baby Care',
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
];

async function main() {
  await prisma.affiliatePartner.deleteMany();
  await prisma.affiliatePartner.createMany({
    data: affiliateCanon.map((partner) => ({
      ...partner,
      advertiserId: partner.advertiserId ?? null,
      category: partner.category ?? null,
      threeMonthEpc: partner.threeMonthEpc ?? null,
      sevenDayEpc: partner.sevenDayEpc ?? null,
      notes: partner.notes ?? null,
      isActive: partner.isActive ?? true,
    })),
  });

  const grouped = await prisma.affiliatePartner.groupBy({
    by: ['network'],
    _count: { _all: true },
    orderBy: { network: 'asc' },
  });

  console.log('Affiliate canon seeded. Counts by network:');
  for (const entry of grouped) {
    console.log(`- ${entry.network}: ${entry._count._all}`);
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed affiliate canon:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
