#!/usr/bin/env tsx
/**
 * Fixes the 76 unmatched blog affiliate links by:
 *  1. Adding missing domains to existing AffiliatePartner records
 *  2. Creating minimal partner records for brands not yet in the system
 *  3. Deleting the self-referential short link that points back to this app
 *
 * After running this, run:
 *   npx tsx scripts/fix-blog-link-partners.ts --write
 * to apply the partnerId assignments.
 *
 * Run:
 *   npx tsx scripts/fix-partner-domains.ts
 * Or on Heroku:
 *   heroku run npx tsx scripts/fix-partner-domains.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── 1. Domains to add to EXISTING partners ──────────────────────────────────

const DOMAIN_ADDITIONS: { partnerName: string; newDomains: string[] }[] = [
  // Amazon: amzn.to is their short-link domain (used in 15 CTA buttons)
  {
    partnerName: 'Amazon',
    newDomains: ['amzn.to'],
  },
  // Albee Baby: all CJ Affiliate network redirect domains route through their
  // publisher account (click-101548494-...). Five CJ domains cover 47 links.
  {
    partnerName: 'Albee Baby',
    newDomains: ['kqzyfj.com', 'dpbolvw.net', 'anrdoezrs.net', 'jdoqocy.com', 'tkqlhce.com'],
  },
  // Silver Cross: blog posts link to silvercrossus.com; partner only has silvercrossbaby.com
  {
    partnerName: 'Silver Cross',
    newDomains: ['silvercrossus.com'],
  },
];

// ─── 2. Minimal partners to CREATE ────────────────────────────────────────────

const NEW_PARTNERS: {
  name: string;
  slug: string;
  network: 'CJ' | 'IMPACT' | 'AWIN' | 'DIRECT';
  allowedDomains: string[];
  website?: string;
  partnerType?: string;
}[] = [
  // Impact Radius brands with their pxf.io subdomains
  {
    name: 'Angelbliss',
    slug: 'angelbliss',
    network: 'IMPACT',
    allowedDomains: ['angelbliss.pxf.io'],
    website: 'https://www.angelbliss.com',
    partnerType: 'retailer',
  },
  {
    name: 'From Rebel',
    slug: 'from-rebel',
    network: 'IMPACT',
    allowedDomains: ['fromrebel.pxf.io'],
    website: 'https://fromrebel.com',
    partnerType: 'retailer',
  },
  // Direct-to-brand partners
  {
    name: 'Delta Children',
    slug: 'delta-children',
    network: 'DIRECT',
    allowedDomains: ['deltachildren.com'],
    website: 'https://www.deltachildren.com',
    partnerType: 'retailer',
  },
  {
    name: 'Target',
    slug: 'target',
    network: 'DIRECT',
    allowedDomains: ['target.com'],
    website: 'https://www.target.com',
    partnerType: 'retailer',
  },
  {
    name: 'Stokke',
    slug: 'stokke',
    network: 'DIRECT',
    allowedDomains: ['stokke.com'],
    website: 'https://www.stokke.com',
    partnerType: 'retailer',
  },
  {
    name: 'Hip Baby Gear',
    slug: 'hip-baby-gear',
    network: 'DIRECT',
    allowedDomains: ['hipbabygear.com'],
    website: 'https://www.hipbabygear.com',
    partnerType: 'retailer',
  },
  {
    name: 'Posh Baby',
    slug: 'posh-baby',
    network: 'DIRECT',
    allowedDomains: ['poshbaby.com'],
    website: 'https://www.poshbaby.com',
    partnerType: 'retailer',
  },
  // Totsquad: Taylor's own baby concierge booking page
  // totsquad.com covers babyconcierge.totsquad.com subdomain via suffix matching
  {
    name: 'Totsquad',
    slug: 'totsquad',
    network: 'DIRECT',
    allowedDomains: ['totsquad.com'],
    website: 'https://totsquad.com',
    partnerType: 'service',
  },
];

// ─── 3. Self-referential link to DELETE ───────────────────────────────────────
// CTA button that links to /r/fcGDLA5 on this very app — circular and wrong.
const LINK_CODES_TO_DELETE = ['UxT6vWw'];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔧  Fix partner domains + create missing partner records\n');

  // ── Step 1: Add domains to existing partners ─────────────────────────────
  console.log('── Step 1: Update existing partners\n');
  for (const { partnerName, newDomains } of DOMAIN_ADDITIONS) {
    const partner = await prisma.affiliatePartner.findFirst({
      where: { name: partnerName },
      select: { id: true, name: true, slug: true, allowedDomains: true },
    });

    if (!partner) {
      console.log(`  ⚠️   "${partnerName}" not found — skipping`);
      continue;
    }

    // Only add domains that aren't already present
    const toAdd = newDomains.filter((d) => !partner.allowedDomains.includes(d));
    if (toAdd.length === 0) {
      console.log(`  ✅  "${partnerName}" already has all required domains`);
      continue;
    }

    await prisma.affiliatePartner.update({
      where: { id: partner.id },
      data: { allowedDomains: { push: toAdd } },
    });

    console.log(`  ✅  ${partnerName}`);
    console.log(`       added: ${toAdd.join(', ')}`);
    console.log(`       now:   ${[...partner.allowedDomains, ...toAdd].join(', ')}`);
  }

  // ── Step 2: Create new partners ──────────────────────────────────────────
  console.log('\n── Step 2: Create new partners\n');
  for (const p of NEW_PARTNERS) {
    const existing = await prisma.affiliatePartner.findFirst({
      where: { OR: [{ slug: p.slug }, { name: p.name }] },
      select: { id: true, name: true, slug: true },
    });

    if (existing) {
      console.log(`  ✅  "${p.name}" already exists (slug: ${existing.slug})`);
      // Make sure allowedDomains includes our domains
      await prisma.affiliatePartner.update({
        where: { id: existing.id },
        data: {
          allowedDomains: {
            push: p.allowedDomains.filter(async (d) => {
              const fresh = await prisma.affiliatePartner.findUnique({
                where: { id: existing.id },
                select: { allowedDomains: true },
              });
              return !fresh?.allowedDomains.includes(d);
            }),
          },
        },
      });
      continue;
    }

    await prisma.affiliatePartner.create({
      data: {
        name: p.name,
        slug: p.slug,
        network: p.network,
        commissionType: 'PERCENTAGE',
        commissionRate: '0',
        allowedDomains: p.allowedDomains,
        website: p.website ?? null,
        partnerType: p.partnerType ?? 'retailer',
        isActive: true,
        baseUrl: '',
        allowedContexts: JSON.stringify(['blog']),
      },
    });
    console.log(`  ✅  Created "${p.name}" (${p.network})`);
    console.log(`       domains: ${p.allowedDomains.join(', ')}`);
  }

  // ── Step 3: Delete self-referential links ────────────────────────────────
  console.log('\n── Step 3: Delete self-referential short links\n');
  for (const code of LINK_CODES_TO_DELETE) {
    const link = await prisma.affiliateLink.findUnique({
      where: { code },
      select: { id: true, name: true, destinationUrl: true, _count: { select: { clicks: true } } },
    });

    if (!link) {
      console.log(`  ⚠️   Code ${code} not found — already deleted?`);
      continue;
    }

    if (link._count.clicks > 0) {
      console.log(`  ⚠️   Code ${code} has ${link._count.clicks} clicks — skipping delete (manual review needed)`);
      continue;
    }

    await prisma.affiliateLink.delete({ where: { code } });
    console.log(`  🗑️   Deleted [${code}] "${link.name}"`);
    console.log(`       was: ${link.destinationUrl?.slice(0, 65)}`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('  Done. Now run:');
  console.log('  npx tsx scripts/fix-blog-link-partners.ts --write');
  console.log('  (or: heroku run npx tsx scripts/fix-blog-link-partners.ts --write)');
  console.log('═'.repeat(60) + '\n');
}

main()
  .catch((e) => {
    console.error('\n❌  Fatal error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
