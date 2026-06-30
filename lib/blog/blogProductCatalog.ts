/**
 * Shared, client-safe types + key for wiring blog product cards to the affiliate
 * catalogue. The server resolver (lib/server/blogCatalogLinks.ts) produces a
 * Record<key, BlogCatalogMatch>; the client PostContent looks matches up by the
 * same key. Keep this module free of any server-only imports (prisma, etc.).
 */
export type BlogCatalogMatch = {
  affiliateUrl: string | null;
  imageUrl: string | null;
  price: number | null;
  retailer: string | null; // 'Babylist' | 'MacroBaby'
};

/** Stable key shared by the server resolver and the client renderer. */
export function blogProductKey(brand: string, productName: string): string {
  return `${(brand ?? '').trim().toLowerCase()}:::${(productName ?? '').trim().toLowerCase()}`;
}
