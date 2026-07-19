import prisma from '@/lib/server/prisma';
import { getTravelSystemStrollers } from '@/lib/server/travelSystemCompatibility';
import { travelSystemSlug } from '@/lib/travelSystemRouting';
import {
  STROLLER_CATEGORY_LABELS,
  type StrollerCategory,
} from '@/lib/guides/travelSystemCompatibility';
import { resolveCompareAttributes, type BasketSize } from '@/lib/catalog/strollerCompareAttributes';

/**
 * A single stroller row for the side-by-side Compare tool. Combines the public,
 * buyable catalog (price, image, retailer links, finder category) with the real,
 * feed-backed specs (weights, fold, newborn/jogging suitability). `id` is the
 * shared travel-system slug so a comparison URL can be shared and deep-linked,
 * and each row can jump straight into the Travel System checker.
 */
export type StrollerCompareItem = {
  id: string;
  brand: string;
  model: string;
  displayName: string;
  categoryLabel: string | null;
  image: string | null;
  babylistUrl: string | null;
  babylistPrice: number | null;
  macroBabyUrl: string | null;
  macroBabyPrice: number | null;
  amazonUrl: string | null;
  ownWeightLbs: number | null;
  maxWeightLbs: number | null;
  foldType: string | null;
  suitableFromBirth: boolean;
  suitableForJogging: boolean;
  modular: boolean;
  travelSystemCompatible: boolean;
  fitsOverheadBin: boolean;
  /** Qualitative fallback bucket (Small/Medium/Large). */
  basketCapacity: BasketSize;
  /** Basket weight limit in lbs when curated in the DB; otherwise null (UI falls back to the bucket). */
  basketCapacityLbs: number | null;
};

type SpecRow = {
  ownWeightLbs: number | null;
  maxWeightLbs: number | null;
  foldType: string | null;
  suitableFromBirth: boolean;
  suitableForJogging: boolean;
  // Compare-tool overrides (may be absent until the migration + seed run).
  modular: boolean | null;
  fitsOverheadBin: boolean | null;
  basketCapacityLbs: number | null;
};

const specKey = (brand: string, model: string) => `${brand.trim().toLowerCase()}|${model.trim().toLowerCase()}`;

function categoryLabel(category: string | null | undefined): string | null {
  if (!category) return null;
  return STROLLER_CATEGORY_LABELS[category as StrollerCategory] ?? null;
}

/**
 * Full, buyable stroller catalog with specs merged in, deduped by slug and
 * sorted by brand then model — the source list for the Compare tool selectors.
 */
export async function getStrollerCompareCatalog(): Promise<StrollerCompareItem[]> {
  const options = await getTravelSystemStrollers();

  // One batched query for specs + compatibility counts, keyed by brand|model.
  // A stroller with at least one compatibility row is "travel system compatible".
  let specMap = new Map<string, SpecRow>();
  let compatibleKeys = new Set<string>();
  try {
    // Cast to `any` for the select: the compare-spec columns land in the
    // generated client only after the Heroku build regenerates it (same pattern
    // as app/admin/strollers/actions.ts). Result is typed manually below.
    const strollerRows = (await (prisma as unknown as {
      stroller: { findMany: (args: unknown) => Promise<unknown> };
    }).stroller.findMany({
      select: {
        brand: true,
        model: true,
        spec: {
          select: {
            ownWeightLbs: true,
            maxWeightLbs: true,
            foldType: true,
            suitableFromBirth: true,
            suitableForJogging: true,
            modular: true,
            fitsOverheadBin: true,
            basketCapacityLbs: true,
          },
        },
        _count: { select: { compatibilities: true } },
      },
    })) as Array<{ brand: string; model: string; spec: SpecRow | null; _count: { compatibilities: number } }>;
    specMap = new Map(
      strollerRows
        .filter((row) => row.spec)
        .map((row) => [specKey(row.brand, row.model), row.spec as SpecRow]),
    );
    compatibleKeys = new Set(
      strollerRows
        .filter((row) => row._count.compatibilities > 0)
        .map((row) => specKey(row.brand, row.model)),
    );
  } catch {
    // If the spec relation isn't available yet, fall back gracefully.
    specMap = new Map();
    compatibleKeys = new Set();
  }

  const seen = new Set<string>();
  const items: StrollerCompareItem[] = [];

  for (const option of options) {
    const id = travelSystemSlug({ brand: option.brand, model: option.model });
    if (seen.has(id)) continue;
    seen.add(id);

    const key = specKey(option.brand, option.model);
    const spec = specMap.get(key) ?? null;
    const image = option.babylistImage ?? option.macroBabyImage ?? option.bombiImage ?? null;
    const attrs = resolveCompareAttributes(option.brand, option.model, option.strollerCategory ?? null);

    items.push({
      id,
      brand: option.brand,
      model: option.model,
      displayName: option.displayName ?? `${option.brand} ${option.model}`.trim(),
      categoryLabel: categoryLabel(option.strollerCategory),
      image,
      babylistUrl: option.babylistUrl ?? null,
      babylistPrice: option.babylistPrice ?? null,
      macroBabyUrl: option.macroBabyUrl ?? null,
      macroBabyPrice: option.macroBabyPrice ?? null,
      amazonUrl: option.amazonUrl ?? null,
      ownWeightLbs: spec?.ownWeightLbs ?? null,
      maxWeightLbs: spec?.maxWeightLbs ?? null,
      foldType: spec?.foldType ?? null,
      suitableFromBirth: spec?.suitableFromBirth ?? false,
      suitableForJogging: spec?.suitableForJogging ?? false,
      // Prefer curated DB values; fall back to the category-derived defaults.
      modular: spec?.modular ?? attrs.modular,
      travelSystemCompatible: compatibleKeys.has(key),
      fitsOverheadBin: spec?.fitsOverheadBin ?? attrs.fitsOverheadBin,
      basketCapacity: attrs.basketCapacity,
      basketCapacityLbs: spec?.basketCapacityLbs ?? null,
    });
  }

  items.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
  return items;
}
