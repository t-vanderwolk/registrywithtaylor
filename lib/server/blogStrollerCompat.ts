/**
 * Resolve each blog product card (a stroller) to its Travel System Checker
 * results page. Blog product names don't always slug-match the DB stroller model
 * (e.g. "Hub 2" vs "Hub2", "MIOS Comfort Collection" vs "MIOS"), so we match by
 * squashed brand + model/displayName and return the option's OWN results href —
 * which is guaranteed to resolve on the checker. Products with no matching
 * stroller (e.g. a "coming soon" pick not in the catalogue) get no link.
 */
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import { travelSystemResultsHref } from '@/lib/travelSystemRouting';
import { getTravelSystemStrollers } from '@/lib/server/travelSystemCompatibility';

type ProductRef = { brand: string; productName: string };

const squash = (value: string) =>
  (value ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

export async function resolveBlogStrollerCompatHrefs(
  products: ProductRef[],
): Promise<Record<string, string>> {
  const pairs = products.filter((p) => p.brand?.trim() && p.productName?.trim());
  if (pairs.length === 0) return {};

  let strollers: Array<{ brand: string; model: string; displayName?: string }>;
  try {
    strollers = await getTravelSystemStrollers();
  } catch {
    return {};
  }
  if (!strollers.length) return {};

  const out: Record<string, string> = {};
  for (const p of pairs) {
    const wantBrand = canonicalBrand(p.brand).toLowerCase();
    const wantName = squash(p.productName);
    if (!wantName) continue;

    const candidates = strollers
      .filter((option) => canonicalBrand(option.brand).toLowerCase() === wantBrand)
      .map((option) => ({ option, model: squash(option.model), display: squash(option.displayName ?? '') }))
      .filter(({ model, display }) => {
        if (!model && !display) return false;
        return (
          (model && (wantName.includes(model) || model.includes(wantName))) ||
          (display && (display.includes(wantName) || wantName.includes(display)))
        );
      })
      // Prefer the most specific (longest) model match.
      .sort((a, b) => b.model.length - a.model.length);

    const best = candidates[0]?.option;
    if (best) {
      out[blogProductKey(p.brand, p.productName)] = travelSystemResultsHref('stroller', best);
    }
  }

  return out;
}
