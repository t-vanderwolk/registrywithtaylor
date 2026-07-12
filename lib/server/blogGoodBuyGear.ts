/**
 * Resolve GoodBuy Gear (open-box) offers for blog product cards.
 *
 * The main blog catalogue resolver deliberately excludes GoodBuy Gear (it's an
 * open-box marketplace, not the primary buy link). This companion resolver pulls
 * the matching `impact_goodbuygear` offer for each product so the card can show
 * an "Open Box from $X at GoodBuy Gear" badge — mirroring the Resource tools.
 *
 * Read-only. Degrades to {} if the catalogue tables aren't reachable.
 */
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { isGoodBuyGearUrl } from '@/lib/catalog/publicRetailerVisibility';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import prisma from '@/lib/server/prisma';

const GOODBUYGEAR_PROVIDER = 'impact_goodbuygear';

export type BlogGoodBuyGearOffer = { url: string | null; price: number | null };

type ProductRef = { brand: string; productName: string };

type Row = {
  brand: string | null;
  title: string;
  price: number | null;
  salePrice: number | null;
  affiliateUrl: string | null;
  productUrl: string | null;
  enrichment: { canonicalBrand: string | null; canonicalName: string | null } | null;
};

function norm(value: string | null | undefined) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Whole-word (token) match, so an ultra-short name like "m" (from "M+") does not
 * match the wrong open-box (e.g. a Helix "attachment"). Substring fallback kept for
 * names of 4+ chars.
 */
function nameMatches(haystack: string, wantName: string): boolean {
  if (!wantName) return false;
  if (new RegExp(`\\b${escapeRegex(wantName)}\\b`).test(haystack)) return true;
  return wantName.length >= 4 && haystack.includes(wantName);
}

export async function resolveBlogGoodBuyGearOffers(
  products: ProductRef[],
): Promise<Record<string, BlogGoodBuyGearOffer>> {
  const pairs = products.filter((p) => p.brand?.trim() && p.productName?.trim());
  if (pairs.length === 0) return {};

  const brandFilters = Array.from(
    new Set(pairs.flatMap((p) => [p.brand.trim(), canonicalBrand(p.brand)]).filter(Boolean)),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  let rows: Row[];
  try {
    rows = await db.affiliateCatalogProduct.findMany({
      where: {
        provider: GOODBUYGEAR_PROVIDER,
        isActiveInFeed: true,
        OR: brandFilters.map((b) => ({ brand: { equals: b, mode: 'insensitive' } })),
        NOT: { enrichment: { is: { reviewStatus: 'HIDDEN' } } },
      },
      select: {
        brand: true,
        title: true,
        price: true,
        salePrice: true,
        affiliateUrl: true,
        productUrl: true,
        enrichment: { select: { canonicalBrand: true, canonicalName: true } },
      },
    });
  } catch {
    return {};
  }

  const out: Record<string, BlogGoodBuyGearOffer> = {};
  for (const p of pairs) {
    const wantBrand = canonicalBrand(p.brand).toLowerCase();
    const wantName = norm(p.productName);
    if (!wantName) continue;

    const candidates = rows
      .filter((r) => {
        const rowBrand = canonicalBrand(r.enrichment?.canonicalBrand ?? r.brand ?? '').toLowerCase();
        if (rowBrand !== wantBrand) return false;
        const haystack = norm(`${r.enrichment?.canonicalName ?? ''} ${r.title ?? ''}`);
        return nameMatches(haystack, wantName);
      })
      .filter((r) => {
        const url = r.affiliateUrl ?? r.productUrl;
        return url && isGoodBuyGearUrl(url);
      });

    if (candidates.length === 0) continue;

    // Cheapest open-box offer first.
    candidates.sort(
      (a, b) =>
        ((a.salePrice ?? a.price) ?? Number.MAX_SAFE_INTEGER) -
        ((b.salePrice ?? b.price) ?? Number.MAX_SAFE_INTEGER),
    );

    const best = candidates[0];
    out[blogProductKey(p.brand, p.productName)] = {
      url: best.affiliateUrl ?? best.productUrl ?? null,
      price: best.salePrice ?? best.price ?? null,
    };
  }

  return out;
}
