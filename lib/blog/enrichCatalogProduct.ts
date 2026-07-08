import { blogProductKey, type BlogCatalogMatch } from '@/lib/blog/blogProductCatalog';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';

// Merge a live affiliate-catalogue match into a product block: the catalog buy
// link (with retailer + price) leads, the catalog image replaces the authored
// one, and any authored links are kept after as fallbacks. Non-product blocks
// and unmatched products pass through untouched. Shared by the inline blog
// renderer and the end-of-post product recap so both cards stay identical.
export function enrichProductBlockWithCatalog(
  block: ParsedStyledBlock,
  catalogMap: Record<string, BlogCatalogMatch>,
): ParsedStyledBlock {
  if (block.type === 'catalog-product') {
    const match = catalogMap[blogProductKey(block.brand, block.productName)];
    if (!match || !match.affiliateUrl) return block;

    // Decide by the actual buy-link domain, not the price-derived retailer label:
    // a Babylist link whose PRICE happened to come from a MacroBaby row must still
    // fill the Babylist slot, never sprout a MacroBaby button pointing at Babylist.
    const affiliateIsMacro = /macrobaby\.com/i.test(match.affiliateUrl ?? '');
    return {
      ...block,
      babylistUrl: block.babylistUrl ?? (affiliateIsMacro ? null : match.affiliateUrl),
      macrobabyUrl: block.macrobabyUrl ?? (affiliateIsMacro ? match.affiliateUrl : null),
      // The card uses the SAME image the Resource tools use — the catalogue
      // (Babylist/MacroBaby) image — and only falls back to a manually-authored
      // image when the product isn't in the catalogue (e.g. Thule, coming-soon).
      imageUrl: match.imageUrl ?? block.imageUrl,
      price: block.price ?? match.price,
      priceSource: block.price != null ? block.priceSource : match.retailer,
    };
  }

  if (block.type !== 'product') return block;
  const match = catalogMap[blogProductKey(block.brand, block.productName)];
  if (!match || !match.affiliateUrl) return block;

  const priceLabel = match.price != null ? ` — $${Math.round(match.price)}` : '';
  const catalogLink = { label: `Shop ${match.retailer ?? 'now'}${priceLabel}`, url: match.affiliateUrl };
  const authored = block.affiliateLinks.filter((link) => link.url !== match.affiliateUrl);

  return {
    ...block,
    imageUrl: match.imageUrl ?? block.imageUrl,
    affiliateLinks: [catalogLink, ...authored],
  };
}
