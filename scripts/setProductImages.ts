/**
 * Set the catalog image for specific products.
 *
 * Data-driven so adding an image is a one-line edit rather than a new script.
 * Products are matched by externalId when we know it (manual_tmbc items), or by
 * brand + model regex for feed products.
 *
 * Only AffiliateCatalogProduct.imageUrl is written. For manual_tmbc products the
 * feed sync never runs, so the value is permanent; for feed products a later
 * sync CAN overwrite it — use the admin editor's manual fields for those if it
 * needs to stick.
 *
 *   npx tsx scripts/setProductImages.ts            # dry run (default)
 *   npx tsx scripts/setProductImages.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:product-images-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

type ImageTarget = {
  label: string;
  /** Exact match for manual_tmbc products. */
  externalId?: string;
  /** Fallback match for feed products. */
  brand?: string;
  model?: RegExp;
  imageUrl: string;
};

const TARGETS: ImageTarget[] = [
  {
    label: 'Thule Shine',
    externalId: 'manual-thule-shine',
    brand: 'Thule',
    model: /shine/i,
    imageUrl: 'https://m.media-amazon.com/images/I/71XTVOxaksL._AC_SL1500_.jpg',
  },
];

async function resolve(target: ImageTarget): Promise<Array<{ id: string; title: string; imageUrl: string | null }>> {
  if (target.externalId) {
    const hit = await db.affiliateCatalogProduct.findFirst({
      where: { externalId: target.externalId },
      select: { id: true, title: true, imageUrl: true },
    });
    if (hit) return [hit];
  }
  if (!target.brand || !target.model) return [];
  const candidates: Array<{ id: string; title: string; imageUrl: string | null }> =
    await db.affiliateCatalogProduct.findMany({
      where: { brand: { equals: target.brand, mode: 'insensitive' } },
      select: { id: true, title: true, imageUrl: true },
    });
  return candidates.filter((c) => target.model!.test(c.title));
}

async function main() {
  console.log(`── Set product images ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);
  let changed = 0;

  for (const target of TARGETS) {
    const rows = await resolve(target);

    if (rows.length === 0) {
      console.log(`  ✗ ${target.label}: no matching product found — skipped`);
      continue;
    }
    if (rows.length > 1) {
      console.log(`  ! ${target.label}: ${rows.length} products matched, updating all:`);
    }

    for (const row of rows) {
      const before = row.imageUrl ? `${row.imageUrl.slice(0, 60)}…` : '(none)';
      if (row.imageUrl === target.imageUrl) {
        console.log(`  = ${target.label}: already set — no change`);
        continue;
      }
      console.log(`  ${APPLY ? '✔' : '·'} ${row.title}`);
      console.log(`      was: ${before}`);
      console.log(`      now: ${target.imageUrl}`);
      changed += 1;
      if (APPLY) {
        await db.affiliateCatalogProduct.update({
          where: { id: row.id },
          data: { imageUrl: target.imageUrl },
        });
      }
    }
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${changed} product(s) ${APPLY ? 'updated' : 'would change'}.`);
  if (!APPLY) console.log('Re-run with --apply to write.');
  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[setProductImages] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
