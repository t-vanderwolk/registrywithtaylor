import { canonicalBrand } from '@/lib/catalog/brandAliases';

export type FinderMode = 'brand' | 'category';

export type FinderSelection = {
  brand: string | null;
  category: string | null;
  mode: FinderMode;
};

/**
 * The finder's selection as encoded in the URL (?brand= / ?category= / ?view=).
 *
 * `app/tools/stroller-finder/page.tsx` resolves the same three params on the
 * server to decide what to render. This is the client's copy of that rule: the
 * finder applies a tile click in place and pushes the URL itself, so Back /
 * Forward — and any history restore that hands the component stale props — have
 * to be read back off the URL rather than out of the server render.
 *
 * `brands` is the catalog's list of brand names. An unknown brand resolves to
 * null (the finder falls back to the brand grid) rather than showing an empty
 * page; a cold load of that URL still 404s on the server as it always has.
 */
export function finderSelectionFromSearch(search: string, brands: string[]): FinderSelection {
  const params = new URLSearchParams(search);
  const requestedBrand = (params.get('brand') ?? '').trim();
  const requestedCategory = (params.get('category') ?? '').trim();
  const view = (params.get('view') ?? '').trim();

  const wanted = requestedBrand ? canonicalBrand(requestedBrand).toLowerCase() : '';
  const brand = wanted ? brands.find((entry) => entry.toLowerCase() === wanted) ?? null : null;
  // A brand wins over a category, exactly as the server resolves it.
  const category = brand ? null : requestedCategory || null;
  const mode: FinderMode = category || (!brand && view === 'category') ? 'category' : 'brand';

  return { brand, category, mode };
}
