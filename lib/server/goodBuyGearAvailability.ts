import 'server-only';
import { unstable_cache } from 'next/cache';
import { goodBuyGearListingSummary, goodBuyGearProductEndpoint } from '@/lib/catalog/goodBuyGearListing';

// An explicit Data Cache entry also works on the force-dynamic checklist page.
const listingSummary = unstable_cache(async (endpoint: string) => {
  const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(5000), redirect: 'error' });
  if (!response.ok) throw new Error(`GoodBuy Gear listing unavailable (${response.status})`);
  return goodBuyGearListingSummary(await response.json());
}, ['checklist-goodbuygear-listing-v3'], { revalidate: 900 });

/** Refresh only the saved product destination; never substitute another listing. */
export async function getGoodBuyGearAvailability(url: string) {
  const endpoint = goodBuyGearProductEndpoint(url);
  if (!endpoint) return goodBuyGearListingSummary(null);
  return listingSummary(endpoint).catch(() => goodBuyGearListingSummary(null));
}
