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

    const retailerIsMacro = (match.retailer ?? '').toLowerCase() === 'macrobaby';
    return {
      ...block,
      babylistUrl: block.babylistUrl ?? (retailerIsMacro ? null : match.affiliateUrl),
      macrobabyUrl: block.macrobabyUrl ?? (retailerIsMacro ? match.affiliateUrl : null),
      imageUrl: block.imageUrl ?? match.imageUrl,
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
