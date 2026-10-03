export type GoodBuyGearBadgeOffer = { url?: string | null; price?: number | null; condition?: string; available?: boolean | null };

/** Shared visual used by the stroller tools and checklist. */
export default function GoodBuyGearBadge({ offer, productName, onClick }: {
  offer?: GoodBuyGearBadgeOffer | null;
  productName?: string;
  onClick?: () => void;
}) {
  if (!offer || offer.available === false || (!offer.url && offer.price == null)) return null;
  const condition = offer.condition ?? 'Open Box';
  const price = offer.price != null ? `$${Number.isInteger(offer.price) ? offer.price.toFixed(0) : offer.price.toFixed(2)}` : null;
  const label = `${condition === 'GoodBuy Gear' ? 'Shop' : condition}${price ? ` from ${price}` : ''} at GoodBuy Gear${productName ? ` for ${productName}` : ''}`;
  const content = <>
    <span className="tool-open-box-badge__eyebrow">{condition}</span>
    {price ? <span className="tool-open-box-badge__price">from {price}</span> : null}
    <span className="tool-open-box-badge__retailer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img loading="lazy" decoding="async" src="/assets/logos/goodbuygear2.png" alt="" className="tool-open-box-badge__logo" />
    </span>
    {offer.url ? <span className="tool-open-box-badge__arrow" aria-hidden="true">→</span> : null}
  </>;
  return offer.url ? (
    <a href={offer.url} target="_blank" rel="sponsored nofollow noopener noreferrer"
      className="shopmyskip tool-open-box-badge" aria-label={label} title={label}
      data-affiliate-track-source={onClick ? 'manual' : undefined}
      data-analytics-managed={onClick ? 'true' : undefined} onClick={onClick}>
      {content}
    </a>
  ) : <span className="tool-open-box-badge" title={label}>{content}</span>;
}
