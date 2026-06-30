/**
 * Resolve blog product cards to the affiliate catalogue.
 *
 * Given the (brand, productName) pairs parsed from a post's product blocks, match
 * each to an affiliateCatalogProduct row and return the live affiliate buy link,
 * image, and current price. Provider preference mirrors the travel-system /
 * finder tools: Babylist + MacroBaby only, with GoodBuyGear destinations
 * excluded. Babylist is preferred, then MacroBaby.
 *
 * Read-only. Degrades to {} if the catalog tables aren't reachable.
 */
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { isGoodBuyGearUrl } from '@/lib/catalog/publicRetailerVisibility';
import { blogProductKey, type BlogCatalogMatch } from '@/lib/blog/blogProductCatalog';
import prisma from '@/lib/server/prisma';

const PROVIDERS = ['babylist_impact', 'shopify_macrobaby'];
const PROVIDER_RANK: Record<string, number> = { babylist_impact: 0, shopify_macrobaby: 1 };

type ProductRef = { brand: string; productName: string };

type CatalogRow = {
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  provider: string;
  enrichment: { canonicalBrand: string | null; canonicalName: string | null } | null;
};

function norm(value: string | null | undefined) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function resolveBlogProductCatalogLinks(
  products: ProductRef[],
): Promise<Record<string, BlogCatalogMatch>> {
  const pairs = products.filter((p) => p.brand?.trim() && p.productName?.trim());
  if (pairs.length === 0) return {};

  const brandFilters = Array.from(
    new Set(pairs.flatMap((p) => [p.brand.trim(), canonicalBrand(p.brand)]).filter(Boolean)),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  let rows: CatalogRow[];
  try {
    rows = await db.affiliateCatalogProduct.findMany({
      where: {
        provider: { in: PROVIDERS },
        isActiveInFeed: true,
        OR: brandFilters.map((b) => ({ brand: { equals: b, mode: 'insensitive' } })),
        // Exclude only explicitly hidden products; un-enriched rows still match.
        NOT: { enrichment: { is: { reviewStatus: 'HIDDEN' } } },
      },
      select: {
        brand: true,
        title: true,
        price: true,
        imageUrl: true,
        affiliateUrl: true,
        provider: true,
        enrichment: { select: { canonicalBrand: true, canonicalName: true } },
      },
    });
  } catch {
    return {};
  }

  const out: Record<string, BlogCatalogMatch> = {};
  for (const p of pairs) {
    const wantBrand = canonicalBrand(p.brand).toLowerCase();
    const wantName = norm(p.productName);
    if (!wantName) continue;

    const candidates = rows
      .filter((r) => {
        const rowBrand = canonicalBrand(r.enrichment?.canonicalBrand ?? r.brand ?? '').toLowerCase();
        if (rowBrand !== wantBrand) return false;
        const haystack = norm(`${r.enrichment?.canonicalName ?? ''} ${r.title ?? ''}`);
        return haystack.includes(wantName);
      })
      .filter((r) => r.affiliateUrl && !isGoodBuyGearUrl(r.affiliateUrl));

    if (candidates.length === 0) continue;

    candidates.sort(
      (a, b) =>
        (PROVIDER_RANK[a.provider] ?? 9) - (PROVIDER_RANK[b.provider] ?? 9) ||
        (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER) ||
        norm(a.title).length - norm(b.title).length,
    );

    const best = candidates[0];
    out[blogProductKey(p.brand, p.productName)] = {
      affiliateUrl: best.affiliateUrl,
      imageUrl: best.imageUrl ?? null,
      price: best.price ?? null,
      retailer: best.provider === 'shopify_macrobaby' ? 'MacroBaby' : 'Babylist',
    };
  }

  return out;
}
