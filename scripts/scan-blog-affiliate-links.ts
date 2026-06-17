#!/usr/bin/env tsx
/**
 * Scans all published blog posts for affiliate CTA buttons and registers
 * each unique destination URL as a short link in the AffiliateLink table.
 *
 * Affiliate links in TMBC blog posts live in the stored CTA button JSON:
 *   <!--TMBC_CTA_BUTTONS:{"buttons":[{"id":"cta-1","label":"...","url":"...","partnerId":"..."}]}-->
 *
 * Those buttons are referenced in the body as ::cta-slot cta-1, etc.
 *
 * Run from project root:
 *   npx tsx scripts/scan-blog-affiliate-links.ts
 *
 * Pass --dry-run to preview without writing anything:
 *   npx tsx scripts/scan-blog-affiliate-links.ts --dry-run
 *
 * Pass --cleanup to delete the 84 bad CDN-image records created by the
 * previous run before scanning:
 *   npx tsx scripts/scan-blog-affiliate-links.ts --cleanup
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes('--dry-run');
const CLEANUP = process.argv.includes('--cleanup');

// ─── CTA button parsing (mirrors lib/blog/ctaButtons.ts) ─────────────────────

type CtaButton = {
  id: string;
  label: string;
  url: string;
  variant: string;
  partnerId: string | null;
};

const CTA_STORAGE_PATTERN = /<!--TMBC_CTA_BUTTONS:([\s\S]*?)-->/g;

function parseCtaButtons(content: string): CtaButton[] {
  const matches = [...content.matchAll(CTA_STORAGE_PATTERN)];
  if (matches.length === 0) return [];

  // Use the last match (mirrors extractStoredCtaButtons)
  const raw = matches[matches.length - 1]?.[1] ?? '';
  try {
    const parsed = JSON.parse(raw) as { buttons?: unknown[] } | unknown[];
    const items = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { buttons?: unknown[] }).buttons)
        ? (parsed as { buttons: unknown[] }).buttons
        : [];

    return items
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item, i) => ({
        id: typeof item.id === 'string' && item.id ? item.id : `cta-${i + 1}`,
        label: typeof item.label === 'string' ? item.label.trim() : '',
        url: typeof item.url === 'string' ? item.url.trim() : '',
        variant: item.variant === 'secondary' || item.variant === 'text' ? item.variant : 'primary',
        partnerId: typeof item.partnerId === 'string' && item.partnerId ? item.partnerId : null,
      }))
      .filter((b) => b.label && b.url && /^https?:\/\//i.test(b.url));
  } catch {
    return [];
  }
}

// ─── Short-code generator ─────────────────────────────────────────────────────

async function generateShortCode(length = 7): Promise<string> {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const exists = await prisma.affiliateLink.findUnique({ where: { code }, select: { id: true } });
    if (!exists) return code;
  }
  throw new Error('Could not generate a unique short code after 20 attempts.');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (DRY_RUN) console.log('\n⚠️   DRY RUN — no records will be written\n');

  // ── Optional cleanup of previous bad run ────────────────────────────────────
  if (CLEANUP) {
    console.log('🧹  Cleaning up CDN image records from previous run…');
    const deleted = await prisma.affiliateLink.deleteMany({
      where: {
        OR: [
          { destinationUrl: { contains: '/cdn/shop/files/' } },
          { url: { contains: '/cdn/shop/files/' } },
        ],
        // Only delete ones with no clicks (safe to remove)
        clicks: { none: {} },
      },
    });
    console.log(`    Deleted ${deleted.count} bad records.\n`);
  }

  console.log('🔍  Scanning published blog posts for CTA affiliate links…\n');

  // Build the set of valid AffiliatePartner IDs so we don't pass a stale FK
  const validPartners = await prisma.affiliatePartner.findMany({
    select: { id: true },
  });
  const validPartnerIds = new Set(validPartners.map((p) => p.id));

  // Collect existing destination URLs to skip duplicates
  const existingLinks = await prisma.affiliateLink.findMany({
    select: { destinationUrl: true, url: true, name: true },
  });
  const seenUrls = new Set<string>();
  for (const l of existingLinks) {
    if (l.destinationUrl) seenUrls.add(l.destinationUrl.trim());
    if (l.url) seenUrls.add(l.url.trim());
  }

  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, slug: true, content: true },
    orderBy: { publishedAt: 'desc' },
  });

  console.log(`Published posts:      ${posts.length}`);
  console.log(`Existing short links: ${existingLinks.length}`);
  console.log('─'.repeat(70));

  let totalButtons = 0;
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const post of posts) {
    const buttons = parseCtaButtons(post.content);
    if (buttons.length === 0) continue;

    console.log(`\n📝  ${post.title}`);
    console.log(`    /blog/${post.slug}  (${buttons.length} CTA button${buttons.length !== 1 ? 's' : ''})`);

    for (const btn of buttons) {
      totalButtons++;
      const cleanUrl = btn.url;

      if (seenUrls.has(cleanUrl)) {
        console.log(`    ⏭  skip   [${btn.id}] ${btn.label}`);
        console.log(`           ${cleanUrl.slice(0, 65)}`);
        totalSkipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`    🔵  would create  [${btn.id}] ${btn.label}`);
        console.log(`           ${cleanUrl.slice(0, 65)}`);
        seenUrls.add(cleanUrl);
        totalCreated++;
        continue;
      }

      try {
        const code = await generateShortCode();
        await prisma.affiliateLink.create({
          data: {
            destinationUrl: cleanUrl,
            url: cleanUrl,
            code,
            label: 'blog',
            blogPostId: post.id,
            name: btn.label.slice(0, 120),
            partnerId: btn.partnerId && validPartnerIds.has(btn.partnerId) ? btn.partnerId : null,
          },
        });
        seenUrls.add(cleanUrl);
        totalCreated++;
        console.log(`    ✅  ${code}  [${btn.id}] ${btn.label}`);
        console.log(`           ${cleanUrl.slice(0, 65)}`);
      } catch (err) {
        totalErrors++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`    ❌  error  [${btn.id}] ${btn.label} — ${msg}`);
      }
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('  RESULTS');
  console.log('═'.repeat(70));
  console.log(`  Posts scanned    ${posts.length}`);
  console.log(`  CTA buttons      ${totalButtons}`);
  console.log(`  Created          ${totalCreated}`);
  console.log(`  Skipped          ${totalSkipped}  (URL already exists)`);
  if (totalErrors > 0) console.log(`  Errors           ${totalErrors}`);
  console.log('═'.repeat(70));

  if (totalButtons === 0) {
    console.log('\n  No CTA buttons found in any published post.\n');
  } else if (!DRY_RUN && totalCreated > 0) {
    console.log('\n  New short links are live at /admin/affiliate-links\n');
  } else if (DRY_RUN) {
    console.log('\n  Re-run without --dry-run to write these records.\n');
  }
}

main()
  .catch((e) => {
    console.error('\n❌  Fatal error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
