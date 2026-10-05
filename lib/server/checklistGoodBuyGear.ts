import 'server-only';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import { resolveProductLinks } from '@/lib/checklist/productLinks';
import type { ChecklistProduct } from '@/lib/checklist/products';
import { goodBuyGearProductEndpoint, type GoodBuyGearListingSummary } from '@/lib/catalog/goodBuyGearListing';
import { getGoodBuyGearAvailability } from './goodBuyGearAvailability';
import type { BlogGoodBuyGearOffer } from './blogGoodBuyGear';

/** Saved exact destinations override feed matches. Prices refresh without editing the card reference price. */
export async function resolveChecklistGoodBuyGearOffers(products: ChecklistProduct[], automatic: Record<string, BlogGoodBuyGearOffer>) {
  const result: Record<string, BlogGoodBuyGearOffer & { condition?: string; available?: boolean | null }> = { ...automatic };
  const requests = new Map<string, Promise<GoodBuyGearListingSummary>>();
  await Promise.all(products.map(async product => {
    const link = resolveProductLinks(product).find(link => goodBuyGearProductEndpoint(link.url));
    if (!link) return;
    const endpoint = goodBuyGearProductEndpoint(link.url)!;
    // Recover outside the cache: transient errors must not cache an empty badge.
    if (!requests.has(endpoint)) requests.set(endpoint, getGoodBuyGearAvailability(link.url));
    result[blogProductKey(product.brand, product.product)] = { url: link.url, ...await requests.get(endpoint)! };
  }));
  return result;
}
