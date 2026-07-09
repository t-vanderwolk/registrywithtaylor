/**
 * Mirror of blogStrollerCompat for CAR SEAT product cards: resolve each blog
 * car-seat card to its Travel System Checker results page (compatible strollers
 * for that seat). Blog product names don't always slug-match the DB car-seat
 * model, so we match by squashed brand + model/displayName and return the
 * option's OWN results href (guaranteed to resolve on the checker). Car seats
 * with no matching DB row get no link.
 */
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import { travelSystemResultsHref } from '@/lib/travelSystemRouting';
import { getTravelSystemCarSeats } from '@/lib/server/travelSystemCompatibility';

type ProductRef = { brand: string; productName: string };

const squash = (value: string) =>
  (value ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

export async function resolveBlogCarSeatCompatHrefs(
  products: ProductRef[],
): Promise<Record<string, string>> {
  const pairs = products.filter((p) => p.brand?.trim() && p.productName?.trim());
  if (pairs.length === 0) return {};

  let carSeats: Array<{ brand: string; model: string; displayName?: string }>;
  try {
    carSeats = await getTravelSystemCarSeats();
  } catch {
    return {};
  }
  if (!carSeats.length) return {};

  const out: Record<string, string> = {};
  for (const p of pairs) {
    const wantBrand = canonicalBrand(p.brand).toLowerCase();
    const wantName = squash(p.productName);
    if (!wantName) continue;

    const candidates = carSeats
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
      out[blogProductKey(p.brand, p.productName)] = travelSystemResultsHref('carSeat', best);
    }
  }

  return out;
}
