'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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
  /** Which retailer button leads. Defaults to Babylist > MacroBaby > Shop > Amazon. */
  primaryRetailer?: 'babylist' | 'macrobaby' | 'shop' | 'amazon' | null;
  comingSoon?: boolean;
  /** Travel-system checker results href for this stroller (compatible car seats). */
  compatHref?: string | null;
  /** 'inline' floats a compact card beside the prose; 'grid' is the recap card. */
  layout?: 'inline' | 'grid';
  position: number;
};

function formatPrice(price: number) {
  return Number.isInteger(price) ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
}

// Fade-and-rise the card in once it scrolls into view (respects reduced motion).
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
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
  primaryRetailer,
  comingSoon = false,
  compatHref,
  layout = 'grid',
  position,
}: BlogCatalogProductCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const isInline = layout === 'inline';
  // Show every retailer we have a link for, ordered so the chosen primary leads;
  // otherwise Babylist > MacroBaby > Shop > Amazon. The first button is styled
  // primary, the rest secondary.
  const available: Array<Omit<CatalogProductButton, 'variant'>> = [];
  if (babylistUrl) available.push({ key: 'babylist', url: babylistUrl, label: 'Add to Babylist' });
  if (macrobabyUrl) available.push({ key: 'macrobaby', url: macrobabyUrl, label: 'Shop MacroBaby' });
  if (shopUrl) available.push({ key: 'shop', url: shopUrl, label: shopRetailer ? `Shop ${shopRetailer}` : 'Shop now' });
  if (amazonUrl) available.push({ key: 'amazon', url: amazonUrl, label: 'Shop on Amazon' });

  const defaultOrder: Record<CatalogProductButton['key'], number> = { babylist: 0, macrobaby: 1, shop: 2, amazon: 3 };
  available.sort((a, b) => {
    if (primaryRetailer) {
      if (a.key === primaryRetailer && b.key !== primaryRetailer) return -1;
      if (b.key === primaryRetailer && a.key !== primaryRetailer) return 1;
    }
    return defaultOrder[a.key] - defaultOrder[b.key];
  });
  const buttons: CatalogProductButton[] = available.map((b, i) => ({ ...b, variant: i === 0 ? 'primary' : 'secondary' }));

  // A card with no retailer yet still renders when it's flagged coming soon —
  // it shows the product with a badge instead of buy buttons.
  if (buttons.length === 0 && !comingSoon) return null;

  const displayBrand = brand.trim();
  const fullName = `${displayBrand} ${productName}`.trim();

  return (
    <div
      ref={ref}
      className={[
        'tool-card tool-card--interactive tool-product-card not-prose blog-product-card',
        isInline ? 'tool-product-card--inline' : 'my-8',
        visible ? 'is-revealed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`tool-card__media tool-product-card__media${isInline ? ' tool-product-card__media--compact' : ''}`}>
        {comingSoon ? <span className="tool-product-card__badge">Coming Soon</span> : null}
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
          {comingSoon && buttons.length === 0 ? (
            <span className="tool-btn tool-btn--secondary tool-btn--block is-disabled" aria-disabled="true">
              Retailer coming soon
            </span>
          ) : null}
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

          {compatHref ? (
            <Link href={compatHref} className="blog-product-card__compat">
              Check compatible car seats
              <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
