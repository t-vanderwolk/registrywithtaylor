import prisma from '@/lib/server/prisma';
import { getTravelSystemStrollers } from '@/lib/server/travelSystemCompatibility';
import { travelSystemSlug } from '@/lib/travelSystemRouting';
import {
  STROLLER_CATEGORY_LABELS,
  type StrollerCategory,
} from '@/lib/guides/travelSystemCompatibility';

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
};

type SpecRow = {
  ownWeightLbs: number | null;
  maxWeightLbs: number | null;
  foldType: string | null;
  suitableFromBirth: boolean;
  suitableForJogging: boolean;
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

  // One batched query for every spec row, keyed by brand|model (case-insensitive).
  let specMap = new Map<string, SpecRow>();
  try {
    const specRows = await prisma.stroller.findMany({
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
          },
        },
      },
    });
    specMap = new Map(
      specRows
        .filter((row) => row.spec)
        .map((row) => [specKey(row.brand, row.model), row.spec as SpecRow]),
    );
  } catch {
    // If the spec relation isn't available yet, fall back to spec-less rows.
    specMap = new Map();
  }

  const seen = new Set<string>();
  const items: StrollerCompareItem[] = [];

  for (const option of options) {
    const id = travelSystemSlug({ brand: option.brand, model: option.model });
    if (seen.has(id)) continue;
    seen.add(id);

    const spec = specMap.get(specKey(option.brand, option.model)) ?? null;
    const image = option.babylistImage ?? option.macroBabyImage ?? option.bombiImage ?? null;

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
    });
  }

  items.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
  return items;
}
