/**
 * The travel-system checker only treats a stroller as "public" (and therefore
 * shows its compatible car seats) when it has a Babylist / MacroBaby / Amazon
 * link. The Bombi Bēbee strollers were added with a Bombi-direct catalog offer
 * but no retailer on the Stroller row, so the checker couldn't surface their
 * compatibility.
 *
 * This copies each Bombi stroller's Amazon affiliate link from the affiliate
 * catalogue onto the matching Stroller row (Stroller.amazonUrl), so the new
 * car-seat compatibility renders in the by-stroller view.
 *
 * Idempotent (a row that already has amazonUrl is left alone). Dry-run default.
 *
 *   npx tsx scripts/setBombiStrollerAmazonLinks.ts            # dry run
 *   npx tsx scripts/setBombiStrollerAmazonLinks.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/setBombiStrollerAmazonLinks.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { isAmazonUrl } from '@/lib/catalog/publicRetailerVisibility';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

/** Fold diacritics + non-alphanumerics so "Bēbee V3" ↔ "bebee v3". */
function norm(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Distinguishing tokens for a Bombi stroller model (e.g. "v3", "twin"). */
function modelTokens(model: string): string[] {
  return norm(model)
    .split(' ')
    .filter((t) => t && t !== 'bebee' && t !== 'bombi' && t !== 'lightweight' && t !== 'stroller');
}

type CatalogRow = { title: string; affiliateUrl: string | null; productUrl: string | null };
type StrollerRow = { id: string; brand: string; model: string; displayName: string | null; amazonUrl: string | null };

async function main() {
  console.log(`── Set Bombi stroller Amazon links ──  (${APPLY ? 'APPLY' : 'dry-run'})\n`);

  const catalog: CatalogRow[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Bombi', mode: 'insensitive' } },
    select: { title: true, affiliateUrl: true, productUrl: true },
  });
  const amazonProducts = catalog
    .map((c) => ({ title: c.title, url: [c.affiliateUrl, c.productUrl].find((u) => isAmazonUrl(u)) ?? null }))
    .filter((c): c is { title: string; url: string } => !!c.url);

  const strollers: StrollerRow[] = await db.stroller.findMany({
    where: { brand: { contains: 'Bombi', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true, amazonUrl: true },
  });

  if (strollers.length === 0) {
    console.log('No Bombi strollers found in the Stroller table.');
    return;
  }

  let set = 0;
  for (const s of strollers) {
    const tokens = modelTokens(s.model);
    // A catalogue Amazon product matches when its title carries this model's
    // distinguishing tokens (e.g. "v3", or "twin").
    const match = amazonProducts.find((c) => {
      const t = norm(c.title);
      return tokens.length > 0 && tokens.every((tok) => t.includes(tok));
    });

    const status = s.amazonUrl
      ? 'already set'
      : match
        ? `→ ${match.url.slice(0, 70)}`
        : 'NO Amazon link in catalogue';
    console.log(`  ${s.brand} ${s.model}  [${status}]`);

    if (!s.amazonUrl && match && APPLY) {
      await db.stroller.update({ where: { id: s.id }, data: { amazonUrl: match.url } });
      set += 1;
    } else if (!s.amazonUrl && match) {
      set += 1; // would set
    }
  }

  console.log(`\n${APPLY ? `✓ Set amazonUrl on ${set} Bombi stroller(s).` : `(dry run — ${set} would be set. Re-run with --apply.)`}`);
  console.log('  Any "NO Amazon link" row needs a Babylist / MacroBaby / Amazon link before the');
  console.log('  checker will surface its compatibility (Bombi-direct alone is finder-only).');
}

main()
  .catch((err) => {
    console.error('[setBombiStrollerAmazonLinks] failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
