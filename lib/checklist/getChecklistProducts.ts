import 'server-only';
import prismaBase from '@/lib/server/prisma';
import { products as staticProducts, type ChecklistProduct } from '@/lib/checklist/products';
import { parseRetailerLinks } from '@/lib/retailerLinks';
import {
  bestAmazonImage,
  bestAmazonPrice,
  bestAmazonPriceSource,
  bestAmazonUrl,
  getAmazonCacheMapForUrls,
} from '@/lib/server/amazonCreators/cache';

// ChecklistProduct lands in the generated client on the Heroku build; cast so
// this typechecks before `prisma generate` runs in a fresh checkout.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// Removed picks remain in admin history but are excluded from the public checklist.
// Keep only the single-camera BM01 for Momcozy and remove all Mompush picks.
const EXCLUDED_CHECKLIST_PRODUCT_IDS = new Set([
  'amzcc-momcozy-bm01-baby-monitor-2-cameras-no-wifi',
  'amzcc-momcozy-bm04-smart-wifi-baby-monitor-2-cameras',
  'amzcc-mompush-nexis-carbon-fiber-travel-stroller',
  'amzcc-mompush-lithe-v2-travel-stroller',
  'amzcc-mompush-meteor2-bassinet-stroller',
]);

async function enrichWithAmazonCache(products: Record<string, ChecklistProduct>) {
  const cacheMap = await getAmazonCacheMapForUrls(Object.values(products).map((product) => product.amazonUrl));
  if (cacheMap.size === 0) return products;

  return Object.fromEntries(
    Object.entries(products).map(([id, product]) => {
      const amazonProduct = product.amazonUrl ? cacheMap.get(product.amazonUrl) : null;
      if (!amazonProduct) return [id, product];

      const price = bestAmazonPrice(product.price, amazonProduct);
      return [
        id,
        {
          ...product,
          amazonUrl: bestAmazonUrl(product.amazonUrl, amazonProduct) ?? product.amazonUrl,
          imageUrl: bestAmazonImage(product.imageUrl, amazonProduct) ?? undefined,
          price: price ?? undefined,
          priceSource: bestAmazonPriceSource(product.priceSource, amazonProduct) ?? undefined,
        },
      ];
    }),
  );
}

/**
 * Returns the checklist products keyed by id. Prefers the admin-editable DB rows
 * (ChecklistProduct); falls back to the static products.ts map when the table is
 * empty or unavailable (e.g. before the migration/seed have run) so the tool
 * never breaks.
 */
export async function getChecklistProducts(): Promise<Record<string, ChecklistProduct>> {
  try {
    const rows = await db.checklistProduct.findMany({ orderBy: { sortOrder: 'asc' } });
    if (!rows || rows.length === 0) return enrichWithAmazonCache(staticProducts);

    const map: Record<string, ChecklistProduct> = {};
    for (const r of rows) {
      if (EXCLUDED_CHECKLIST_PRODUCT_IDS.has(r.id) || r.brand.trim().toLowerCase() === 'mompush') continue;
      map[r.id] = {
        id: r.id,
        brand: r.brand,
        product: r.product,
        review: r.review ?? '',
        bestFor: r.bestFor ?? '',
        standout: r.standout ?? '',
        affiliateUrl: r.affiliateUrl,
        amazonUrl: r.amazonUrl ?? undefined,
        secondaryUrl: r.secondaryUrl ?? undefined,
        secondaryRetailer: r.secondaryRetailer ?? undefined,
        retailerLinks: parseRetailerLinks(r.retailerLinks),
        price: r.price ?? undefined,
        priceSource: r.priceSource ?? undefined,
        retailer: r.retailer ?? undefined,
        imageUrl: r.imageUrl ?? undefined,
        badge: r.badge ?? undefined,
        disclosure: r.disclosure ?? undefined,
        checklistItemId: r.checklistItemId ?? undefined,
        sortOrder: typeof r.sortOrder === 'number' ? r.sortOrder : undefined,
      };
    }
    return enrichWithAmazonCache(map);
  } catch {
    return enrichWithAmazonCache(staticProducts);
  }
}
