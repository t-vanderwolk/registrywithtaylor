/**
 * Populate real, structured stroller specs (StrollerSpec) from the catalog feed
 * payload (AffiliateCatalogProduct.rawPayload) — so the travel-system "About this
 * stroller" panel shows real numbers instead of curated approximations.
 *
 * Extracts, per stroller, from its matched catalog product's rawPayload:
 *   • maxWeightLbs      ← "Max Weight_NN" tag (most reliable) / body copy
 *   • ownWeightLbs      ← variant weight (lb) or grams, else body copy
 *   • suitableFromBirth ← newborn/preemie age tags or body copy
 *   • suitableForJogging← product type / tags mention jogging
 *   • foldType          ← body copy ("one-hand" / "compact")
 * It only fills fields it can read and never clobbers a curated value with null.
 *
 * The dry-run prints the rawPayload shape for the first few products so the
 * extraction can be verified against the real feed before applying.
 *
 *   npx tsx scripts/populateStrollerSpecsFromFeed.ts            # dry run
 *   npx tsx scripts/populateStrollerSpecsFromFeed.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:populate-specs-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Extracted = {
  ownWeightLbs: number | null;
  maxWeightLbs: number | null;
  foldType: string | null;
  suitableFromBirth: boolean | null;
  suitableForJogging: boolean | null;
};

function toTagList(raw: any): string[] {
  const tags = raw?.tags;
  if (Array.isArray(tags)) return tags.map((t) => String(t));
  if (typeof tags === 'string') return tags.split(',').map((t) => t.trim());
  return [];
}

function bodyText(raw: any): string {
  return String(raw?.body_html ?? raw?.description ?? raw?.bodyHtml ?? '').replace(/<[^>]+>/g, ' ');
}

function extract(raw: any): Extracted {
  const tags = toTagList(raw);
  const body = bodyText(raw);
  const out: Extracted = {
    ownWeightLbs: null,
    maxWeightLbs: null,
    foldType: null,
    suitableFromBirth: null,
    suitableForJogging: null,
  };

  // Max child weight — "Max Weight_50" tag is the cleanest signal.
  const maxTag = tags.map((t) => t.match(/max\s*weight[_\s]*(\d+(?:\.\d+)?)/i)).find(Boolean);
  if (maxTag) out.maxWeightLbs = Math.round(parseFloat(maxTag[1]));
  else {
    const m = body.match(/up to\s*(\d{2,3})\s*lb/i);
    if (m) out.maxWeightLbs = parseInt(m[1], 10);
  }

  // Own weight — a variant weight in lb, else grams, else body copy.
  const variant = Array.isArray(raw?.variants) ? raw.variants[0] : null;
  const unit = String(variant?.weight_unit ?? '').toLowerCase();
  if (variant?.weight && /lb/.test(unit) && variant.weight > 0) out.ownWeightLbs = Number(variant.weight);
  else if (variant?.grams && variant.grams > 0) out.ownWeightLbs = Math.round((variant.grams / 453.592) * 10) / 10;
  else if (typeof raw?.weight === 'number' && raw.weight > 0) out.ownWeightLbs = raw.weight;
  else {
    const m = body.match(/(\d{1,2}(?:\.\d)?)\s*lb[s.]?\b(?:[^.]{0,24}(?:with seat|weight|pushchair|stroller))?/i);
    if (m) out.ownWeightLbs = parseFloat(m[1]);
  }
  // Sanity clamp: strollers are ~9–45 lb; ignore obvious shipping-weight outliers.
  if (out.ownWeightLbs != null && (out.ownWeightLbs < 8 || out.ownWeightLbs > 60)) out.ownWeightLbs = null;

  const hay = `${tags.join(' ')} ${String(raw?.product_type ?? '')} ${body}`.toLowerCase();
  if (/newborn|preemie|from birth|birth to|age_1|age_2/.test(hay)) out.suitableFromBirth = true;
  if (/jogg|jogger|running stroller/.test(hay)) out.suitableForJogging = true;
  if (/one[-\s]?hand/.test(body.toLowerCase())) out.foldType = 'one-hand';
  else if (/compact fold/.test(body.toLowerCase())) out.foldType = 'compact';

  return out;
}

async function main() {
  const apply = process.argv.includes('--apply');

  const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    select: { id: true, brand: true, model: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });

  console.log(`── Populate StrollerSpec from feed ──  (${apply ? 'APPLY' : 'dry-run'})`);
  console.log(`  strollers: ${strollers.length}\n`);

  let matched = 0;
  let updated = 0;
  let shapeShown = 0;

  for (const s of strollers) {
    const product = await db.affiliateCatalogProduct.findFirst({
      where: {
        brand: { startsWith: s.brand, mode: 'insensitive' },
        title: { contains: s.model, mode: 'insensitive' },
        rawPayload: { not: null },
      },
      select: { title: true, rawPayload: true },
    });
    if (!product?.rawPayload) continue;
    matched += 1;

    // Reveal the payload shape for the first few, so extraction can be verified.
    if (shapeShown < 3) {
      const raw = product.rawPayload as any;
      console.log(`  [shape] ${s.brand} ${s.model}`);
      console.log(`    top-level keys: ${Object.keys(raw).join(', ')}`);
      if (Array.isArray(raw?.variants) && raw.variants[0]) {
        console.log(`    variant[0] keys: ${Object.keys(raw.variants[0]).join(', ')}`);
        console.log(`    variant[0].weight: ${raw.variants[0].weight} ${raw.variants[0].weight_unit ?? ''}`);
      }
      shapeShown += 1;
    }

    const e = extract(product.rawPayload);
    console.log(
      `  ${s.brand} ${s.model}: weight=${e.ownWeightLbs ?? '—'} lb, max=${e.maxWeightLbs ?? '—'} lb, fold=${e.foldType ?? '—'}, birth=${e.suitableFromBirth ?? '—'}, jog=${e.suitableForJogging ?? '—'}`,
    );

    if (!apply) continue;

    // Only set fields we actually read; leave the rest (curated quiz dims) intact.
    const data: Record<string, unknown> = {};
    if (e.ownWeightLbs != null) data.ownWeightLbs = e.ownWeightLbs;
    if (e.maxWeightLbs != null) data.maxWeightLbs = e.maxWeightLbs;
    if (e.foldType != null) data.foldType = e.foldType;
    if (e.suitableFromBirth != null) data.suitableFromBirth = e.suitableFromBirth;
    if (e.suitableForJogging != null) data.suitableForJogging = e.suitableForJogging;
    if (Object.keys(data).length === 0) continue;

    await db.strollerSpec.upsert({
      where: { strollerId: s.id },
      update: data,
      create: { strollerId: s.id, ...data },
    });
    updated += 1;
  }

  console.log(`\n  matched to a feed product: ${matched}/${strollers.length}`);
  if (apply) console.log(`  StrollerSpec rows updated: ${updated}`);
  else console.log('  (dry run — review the extracted values + payload shape, then re-run with --apply.)');
}

main()
  .catch((error) => {
    console.error('[populateStrollerSpecsFromFeed] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
