#!/usr/bin/env tsx
/**
 * Assigns the Amazon AffiliatePartner to all AffiliateLink records
 * pointing to amzn.to or amazon.com that currently have no partnerId.
 *
 * These are pre-existing links not caught by fix-blog-link-partners
 * (which only targeted label:'blog' links).
 *
 * Run:
 *   npx tsx scripts/fix-amazon-links.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const amazon = await prisma.affiliatePartner.findFirst({
    where: { name: 'Amazon' },
    select: { id: true, name: true, allowedDomains: true },
  });

  if (!amazon) {
    console.error('❌  Amazon partner not found in database.');
    process.exit(1);
  }

  console.log(`✅  Amazon partner: ${amazon.id}`);
  console.log(`    allowedDomains: ${amazon.allowedDomains.join(', ')}\n`);

  const links = await prisma.affiliateLink.findMany({
    where: {
      partnerId: null,
      OR: [
        { destinationUrl: { contains: 'amzn.to' } },
        { destinationUrl: { contains: 'amazon.com' } },
        { url: { contains: 'amzn.to' } },
        { url: { contains: 'amazon.com' } },
      ],
    },
    select: { id: true, code: true, name: true, destinationUrl: true, label: true },
    orderBy: { destinationUrl: 'asc' },
  });

  console.log(`Found ${links.length} Amazon links with no partnerId:\n`);

  for (const link of links) {
    await prisma.affiliateLink.update({
      where: { id: link.id },
      data: { partnerId: amazon.id },
    });
    console.log(`  ✅  [${link.code}] ${link.name ?? '(no name)'} [label:${link.label ?? 'none'}]`);
    console.log(`         ${link.destinationUrl?.slice(0, 70)}`);
  }

  console.log(`\n  Fixed ${links.length} links → Amazon`);
}

main()
  .catch((e) => {
    console.error('\n❌  Fatal error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
