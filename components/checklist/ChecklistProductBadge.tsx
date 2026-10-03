import GoodBuyGearBadge, { type GoodBuyGearBadgeOffer } from '@/components/affiliate/GoodBuyGearBadge';
import { isGoodBuyGearOffer } from '@/lib/catalog/publicRetailerVisibility';
import { shopMyProductUrl } from '@/lib/affiliateShopMy';
import type { RetailerLink } from '@/lib/retailerLinks';

/** Editorial badges stay text; an explicitly named GoodBuy Gear badge uses its saved retailer destination. */
export default function ChecklistProductBadge({ badge, links, productName, onRetailerClick, goodBuyGearOffer }: {
  badge?: string;
  goodBuyGearOffer?: GoodBuyGearBadgeOffer;
  links: RetailerLink[];
  productName: string;
  onRetailerClick: (link: RetailerLink) => void;
}) {
  const label = badge?.trim();
  if (!label) return null;
  const offer = /^good\s*buy\s*gear$/i.test(label) ? links.find(isGoodBuyGearOffer) : undefined;
  if (!offer) return <span className="tmbc-rec__pill">{label}</span>;
  const details = goodBuyGearOffer?.url === offer.url ? goodBuyGearOffer : undefined;
  return <GoodBuyGearBadge
    offer={{ url: shopMyProductUrl(offer.url), price: details?.price ?? null, condition: details?.condition ?? 'GoodBuy Gear', available: details?.available }}
    productName={productName}
    onClick={() => onRetailerClick({ ...offer, url: shopMyProductUrl(offer.url) })}
  />;
}
