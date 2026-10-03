import 'server-only';
import { unstable_cache } from 'next/cache';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import { resolveProductLinks } from '@/lib/checklist/productLinks';
import type { ChecklistProduct } from '@/lib/checklist/products';
import { goodBuyGearListingSummary, goodBuyGearProductEndpoint } from '@/lib/catalog/goodBuyGearListing';
import type { BlogGoodBuyGearOffer } from './blogGoodBuyGear';

// An explicit Data Cache entry also works on the force-dynamic checklist page.
const listingSummary = unstable_cache(async (endpoint: string) => {
  const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(5000), redirect: 'error' });
  if (!response.ok) throw new Error(`GoodBuy Gear listing unavailable (${response.status})`);
  return goodBuyGearListingSummary(await response.json());
}, ['checklist-goodbuygear-listing-v2'], { revalidate: 900 });

/** Saved exact destinations override feed matches. Prices refresh without editing the card reference price. */
export async function resolveChecklistGoodBuyGearOffers(products: ChecklistProduct[], automatic: Record<string, BlogGoodBuyGearOffer>) {
  const result: Record<string, BlogGoodBuyGearOffer & { condition?: string }> = { ...automatic };
  const requests = new Map<string, Promise<{ price: number | null; condition: string }>>();
  await Promise.all(products.map(async product => {
    const link = resolveProductLinks(product).find(link => goodBuyGearProductEndpoint(link.url));
    if (!link) return;
    const endpoint = goodBuyGearProductEndpoint(link.url)!;
    // Recover outside the cache: transient errors must not cache an empty badge.
    if (!requests.has(endpoint)) requests.set(endpoint, listingSummary(endpoint).catch(() => goodBuyGearListingSummary(null)));
    result[blogProductKey(product.brand, product.product)] = { url: link.url, ...await requests.get(endpoint)! };
  }));
  return result;
}
