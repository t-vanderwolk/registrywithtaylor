/**
 * Root-cause cleanup: a lot of stroller *accessories / parts / frames* are
 * mis-filed under tmbcCategory "Strollers" (rain shields, snack trays, cup
 * holders, seat packs, stroller seats, frames, chassis, adapters, attachments,
 * connectors, blankets, dolls, gloves, lights, fans…). That's what pollutes the
 * finder and confuses the dedup. This moves them OUT of "Strollers" into
 * "Uncategorized / Needs Review" + HIDDEN, so they leave the finder for good and
 * the cleanup/restore (which only look at "Strollers") never touch them again.
 *
 * Conservative + positive matching: a row is only moved when its title clearly
 * names an accessory PHRASE — never on a bare word like "seat" that also appears
 * in real names (e.g. "Dragonfly Plus Seat Stroller"). Idempotent. Dry-run default.
 *
 *   npx tsx scripts/recategorizeStrollerAccessories.ts            # dry run (report)
 *   npx tsx scripts/recategorizeStrollerAccessories.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:recat-stroller-accessories-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

/** Clear accessory / part / frame phrases. Positive match only. */
const ACCESSORY_STRICT_RE =
  /\b(rain ?shield|rain ?cover|weather ?shield|sun ?canopy|snack ?tray|cup ?holder|cupholder|piggy ?back|pannier|caddy|blanket|footie|play ?mat|bumper ?bar|belly bar|cooler|cooling|\bfan\b|wall hook|sibling seat|second seat|seat pack|stroller seat|carry ?cot|frame only|frame base|stroller frame|\bchassis\b|\bbase\b|adapter|adaptor|attachment|connector|footmuff|\bliner\b|sleeve|cushion|warmmuff|glove|rear light|\blight\b|stroller cover|stroller bag|organi[sz]er|hood trim|parent console|ride[- ]?along|glider board|\bdoll\b|wooden)\b/i;

type Row = {
  id: string;
  brand: string | null;
  title: string;
  enrichment: { id: string; reviewStatus: string | null } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { enrichment: { is: { tmbcCategory: 'Strollers' } } },
    select: { id: true, brand: true, title: true, enrichment: { select: { id: true, reviewStatus: true } } },
  });

  const accessories = rows.filter((r) => r.enrichment && ACCESSORY_STRICT_RE.test(r.title));

  console.log(`── Recategorize stroller accessories out of "Strollers" ──  (${apply ? 'APPLY' : 'dry-run'})\n`);
  console.log(`  strollers-category rows: ${rows.length}   accessories to move: ${accessories.length}\n`);
  for (const r of accessories.slice(0, 150)) console.log(`    → ${r.brand ?? '?'} — ${r.title}`);
  if (accessories.length > 150) console.log(`    …and ${accessories.length - 150} more`);

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const ids = accessories.map((r) => r.enrichment!.id);
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: ids } },
    data: {
      tmbcCategory: 'Uncategorized / Needs Review',
      reviewStatus: 'HIDDEN',
      isPublic: false,
      needsReview: true,
    },
  });
  console.log(`\n  Moved ${res.count} accessory row(s) out of Strollers (reversible).`);
}

main()
  .catch((error) => {
    console.error('[recategorizeStrollerAccessories] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
