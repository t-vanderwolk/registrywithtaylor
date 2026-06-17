#!/usr/bin/env tsx
/**
 * Repairs blog-sourced AffiliateLink records that have partnerId: null
 * by matching each link's destination URL hostname against partner.allowedDomains.
 *
 * Without a valid partnerId, the /r/[code] redirect route blocks the redirect
 * (isDomainAllowed returns false when allowedDomains is empty) and falls back to /blog.
 *
 * Run:
 *   npx tsx scripts/fix-blog-link-partners.ts          # dry run (safe)
 *   npx tsx scripts/fix-blog-link-partners.ts --write  # apply fixes
 *
 * Or on Heroku:
 *   heroku run npx tsx scripts/fix-blog-link-partners.ts --write
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = !process.argv.includes('--write');

function extractHostname(url: string): string | null {
  try {
    return new URL(url).hostname.trim().toLowerCase() || null;
  } catch {
    return null;
  }
}

function domainMatches(hostname: string, allowedDomains: string[]): boolean {
  return allowedDomains.some((entry) => {
    const d = entry.trim().toLowerCase();
    return hostname === d || hostname.endsWith(`.${d}`);
  });
}

async function main() {
  if (DRY_RUN) {
    console.log('\n⚠️   DRY RUN — pass --write to apply fixes\n');
  }

  // Load all active partners with their allowedDomains
  const partners = await prisma.affiliatePartner.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, allowedDomains: true },
  });

  console.log(`Partners loaded: ${partners.length}`);

  // Build a lookup: hostname → partnerId (first match wins)
  // We'll also handle suffix matching (endsWith)
  // Partners with no allowedDomains are skipped for matching
  const partnersWithDomains = partners.filter((p) => p.allowedDomains.length > 0);
  console.log(`Partners with allowedDomains: ${partnersWithDomains.length}\n`);

  // Load all blog-label links with no partnerId (our recently created ones)
  const links = await prisma.affiliateLink.findMany({
    where: {
      label: 'blog',
      partnerId: null,
    },
    select: { id: true, code: true, destinationUrl: true, url: true, name: true },
    orderBy: { destinationUrl: 'asc' },
  });

  console.log(`Blog links with partnerId: null  →  ${links.length} to repair`);
  console.log('─'.repeat(70));

  let matched = 0;
  let unmatched = 0;

  // Group unmatched by hostname for a clear report
  const unmatchedByHost: Record<string, { code: string; name: string; url: string }[]> = {};

  for (const link of links) {
    const destUrl = link.destinationUrl?.trim() || link.url?.trim() || '';
    const hostname = extractHostname(destUrl);

    if (!hostname) {
      console.log(`  ❓  no hostname  [${link.code}] ${link.name}`);
      console.log(`         ${destUrl.slice(0, 65)}`);
      unmatched++;
      continue;
    }

    // Find matching partner
    const partner = partnersWithDomains.find((p) =>
      domainMatches(hostname, p.allowedDomains),
    );

    if (!partner) {
      // Collect for grouped report
      if (!unmatchedByHost[hostname]) unmatchedByHost[hostname] = [];
      unmatchedByHost[hostname].push({ code: link.code, name: link.name ?? '', url: destUrl });
      unmatched++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  🔵  would set partnerId  [${link.code}] ${link.name}`);
      console.log(`         ${hostname}  →  ${partner.name} (${partner.slug})`);
    } else {
      await prisma.affiliateLink.update({
        where: { id: link.id },
        data: { partnerId: partner.id },
      });
      console.log(`  ✅  fixed  [${link.code}] ${link.name}`);
      console.log(`         ${hostname}  →  ${partner.name}`);
    }
    matched++;
  }

  console.log('\n' + '═'.repeat(70));
  console.log('  RESULTS');
  console.log('═'.repeat(70));
  console.log(`  Total blog links (no partner)  ${links.length}`);
  console.log(`  Matched to a partner           ${matched}`);
  console.log(`  No partner match found         ${unmatched}`);
  console.log('═'.repeat(70));

  if (Object.keys(unmatchedByHost).length > 0) {
    console.log('\n  ⚠️   UNMATCHED HOSTNAMES');
    console.log('  These links will redirect to /blog until their partner is configured.\n');

    // Show partners that currently have allowedDomains for reference
    console.log('  Current partner allowedDomains:');
    for (const p of partnersWithDomains) {
      console.log(`    ${p.name.padEnd(30)} ${p.allowedDomains.join(', ')}`);
    }

    console.log('\n  Links that need a partner match:');
    for (const [host, items] of Object.entries(unmatchedByHost).sort()) {
      console.log(`\n  ${host}  (${items.length} link${items.length !== 1 ? 's' : ''})`);
      for (const item of items.slice(0, 3)) {
        console.log(`    [${item.code}] ${item.name}`);
        console.log(`           ${item.url.slice(0, 65)}`);
      }
      if (items.length > 3) console.log(`    … and ${items.length - 3} more`);
    }

    console.log('\n  To fix unmatched links:');
    console.log('  1. Add the hostname to the correct partner\'s allowedDomains in /admin/affiliate-partners');
    console.log('  2. Re-run this script with --write\n');
  } else if (matched > 0 && !DRY_RUN) {
    console.log('\n  All blog links now have a valid partnerId and will redirect correctly.\n');
  }
}

main()
  .catch((e) => {
    console.error('\n❌  Fatal error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
