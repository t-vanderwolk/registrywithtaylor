'use client';

import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import { AmazonMark, BabylistHeartIcon } from '@/components/tools/StrollerCatalogFinder';

type CatalogProductButton = {
  key: 'babylist' | 'macrobaby' | 'shop' | 'amazon';
  url: string;
  label: string;
  variant: 'primary' | 'secondary';
};

type BlogCatalogProductCardProps = {
  brand: string;
  productName: string;
  note?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  priceSource?: string | null;
  babylistUrl?: string | null;
  macrobabyUrl?: string | null;
  shopUrl?: string | null;
  shopRetailer?: string | null;
  amazonUrl?: string | null;
  position: number;
};

function formatPrice(price: number) {
  return Number.isInteger(price) ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
}

export default function BlogCatalogProductCard({
  brand,
  productName,
  note,
  imageUrl,
  price,
  priceSource,
  babylistUrl,
  macrobabyUrl,
  shopUrl,
  shopRetailer,
  amazonUrl,
  position,
}: BlogCatalogProductCardProps) {
  // Buttons mirror the Resource-tool card: a primary catalogue retailer first,
  // Amazon second. Babylist leads when we have it, then MacroBaby, then a direct
  // brand retailer (e.g. Silver Cross) for products off Babylist/Amazon.
  const buttons: CatalogProductButton[] = [];
  if (babylistUrl) {
    buttons.push({ key: 'babylist', url: babylistUrl, label: 'Add to Babylist', variant: 'primary' });
  } else if (macrobabyUrl) {
    buttons.push({ key: 'macrobaby', url: macrobabyUrl, label: 'Shop MacroBaby', variant: 'primary' });
  } else if (shopUrl) {
    buttons.push({
      key: 'shop',
      url: shopUrl,
      label: shopRetailer ? `Shop ${shopRetailer}` : 'Shop now',
      variant: 'primary',
    });
  }
  if (amazonUrl) {
    buttons.push({
      key: 'amazon',
      url: amazonUrl,
      label: 'Shop on Amazon',
      variant: buttons.length === 0 ? 'primary' : 'secondary',
    });
  }

  if (buttons.length === 0) return null;

  const displayBrand = brand.trim();
  const fullName = `${displayBrand} ${productName}`.trim();

  return (
    <div className="tool-card tool-card--interactive tool-product-card not-prose my-8">
      <div className="tool-card__media tool-product-card__media">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={fullName} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{displayBrand}</span>
        )}
      </div>
      <div className="tool-product-card__body">
        {displayBrand ? <p className="tool-product-card__brand">{displayBrand}</p> : null}
        <p className="tool-product-card__title">{productName}</p>
        {note ? <p className="tool-product-card__note">{note}</p> : null}
        {price != null ? (
          <p className="tool-product-card__price">
            {formatPrice(price)}
            {priceSource ? <span>via {priceSource}</span> : null}
          </p>
        ) : null}

        <div className="tool-product-card__actions">
          {buttons.map((button) => (
            <TrackedAffiliateLink
              key={button.key}
              href={button.url}
              ctaText={button.label}
              ariaLabel={`${button.label} — ${fullName}`}
              className={`tool-btn tool-btn--${button.variant} tool-btn--block flex items-center justify-center gap-2`}
              meta={{
                product: fullName,
                brand: displayBrand,
                retailer: button.key,
                position,
                context: 'blog-catalog-card',
              }}
            >
              {button.key === 'babylist' ? <BabylistHeartIcon className="shrink-0" /> : null}
              {button.key === 'amazon' ? (
                <>
                  <span>Shop on</span>
                  <AmazonMark className="shrink-0 translate-y-[1px]" />
                  <span aria-hidden="true">→</span>
                </>
              ) : (
                <span>{button.label} →</span>
              )}
            </TrackedAffiliateLink>
          ))}
        </div>
      </div>
    </div>
  );
}
