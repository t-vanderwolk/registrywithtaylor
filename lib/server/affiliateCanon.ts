import { AffiliateNetwork, type AffiliatePartner } from '@prisma/client';
import prisma from '@/lib/server/prisma';

const networkOrder: AffiliateNetwork[] = [
  AffiliateNetwork.CJ,
  AffiliateNetwork.IMPACT,
  AffiliateNetwork.AWIN,
  AffiliateNetwork.DIRECT,
];

const extractSortValue = (value: string) => {
  const matches = value.match(/-?\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) {
    return Number.NEGATIVE_INFINITY;
  }

  return Math.max(...matches.map((entry) => Number.parseFloat(entry)));
};

const sortByCommissionDescending = (a: AffiliatePartner, b: AffiliatePartner) => {
  const aScore = extractSortValue(a.commissionRate);
  const bScore = extractSortValue(b.commissionRate);
  if (aScore !== bScore) {
    return bScore - aScore;
  }

  return a.name.localeCompare(b.name);
};

export async function getAffiliateCanonGroupedByNetwork() {
  const partners = await prisma.affiliatePartner.findMany({
    orderBy: [{ network: 'asc' }, { name: 'asc' }],
  });

  return networkOrder
    .map((network) => ({
      network,
      partners: partners
        .filter((partner) => partner.network === network)
        .sort(sortByCommissionDescending),
    }))
    .filter((group) => group.partners.length > 0);
}
