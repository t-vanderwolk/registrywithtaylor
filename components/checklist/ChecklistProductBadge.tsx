import ProductShopLink from '@/components/affiliate/ProductShopLink';
import { isGoodBuyGearOffer } from '@/lib/catalog/publicRetailerVisibility';
import { shopMyProductUrl } from '@/lib/affiliateShopMy';
import type { RetailerLink } from '@/lib/retailerLinks';

/** Editorial badges stay text; an explicitly named GoodBuy Gear badge uses its saved retailer destination. */
export default function ChecklistProductBadge({ badge, links, productName, onRetailerClick }: {
  badge?: string;
  links: RetailerLink[];
  productName: string;
  onRetailerClick: (link: RetailerLink) => void;
}) {
  const label = badge?.trim();
  if (!label) return null;
  const offer = /^good\s*buy\s*gear$/i.test(label) ? links.find(isGoodBuyGearOffer) : undefined;
  if (!offer) return <span className="tmbc-rec__pill">{label}</span>;
  return (
    <ProductShopLink
      href={offer.url}
      className="tmbc-rec__pill"
      aria-label={`Shop at GoodBuy Gear for ${productName}`}
      data-affiliate-track-source="manual"
      data-analytics-managed="true"
      onClick={() => onRetailerClick({ ...offer, url: shopMyProductUrl(offer.url) })}
    >
      {label} <span aria-hidden="true">→</span>
    </ProductShopLink>
  );
}
