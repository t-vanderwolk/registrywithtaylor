'use client';

import '@/styles/widgets.css';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import ProductRetailerActions from '@/components/affiliate/ProductRetailerActions';
import { orderedProductRetailers, productPricePresentation } from '@/lib/productRetailers';
import { type RetailerLink } from '@/lib/retailerLinks';
import { isAmazonAllowedForBrand, isBlockedMacroBabyShopUrl, isMacroBabyAllowedForBrand } from '@/lib/affiliateShopFallbacks';
import { travelSystemSlug } from '@/lib/travelSystemRouting';

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
  shop2Url?: string | null;
  shop2Retailer?: string | null;
  amazonUrl?: string | null;
  retailerLinks?: RetailerLink[];
  /** Which retailer button leads. Defaults to Babylist > MacroBaby > Shop > Amazon. */
  primaryRetailer?: 'babylist' | 'macrobaby' | 'shop' | 'amazon' | null;
  /** GoodBuy Gear open-box offer, if this product has a matching one. */
  openBoxUrl?: string | null;
  openBoxPrice?: number | null;
  comingSoon?: boolean;
  /** Travel-system checker results href for this stroller (compatible car seats). */
  compatHref?: string | null;
  /** Travel-system checker results href for this car seat (compatible strollers). */
  compatStrollersHref?: string | null;
  /** 'inline' floats a compact card beside the prose; 'grid' is the recap card. */
  layout?: 'inline' | 'grid';
  position: number;
};

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
  babylistUrl,
  macrobabyUrl,
  shopUrl,
  shopRetailer,
  shop2Url,
  shop2Retailer,
  amazonUrl,
  retailerLinks = [],
  primaryRetailer,
  openBoxUrl,
  comingSoon = false,
  compatHref,
  compatStrollersHref,
  layout = 'grid',
  position,
}: BlogCatalogProductCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const isInline = layout === 'inline';
  // Adapt legacy fields without changing URLs; explicit product preferences lead.
  const available: RetailerLink[] = [];
  if (babylistUrl) available.push({ url: babylistUrl, retailer: 'Babylist', preferred: primaryRetailer === 'babylist' });
  // Some brands (e.g. Silver Cross) aren't sold via MacroBaby — never show a MacroBaby CTA.
  if (macrobabyUrl && isMacroBabyAllowedForBrand(brand)) available.push({ url: macrobabyUrl, retailer: 'MacroBaby', preferred: primaryRetailer === 'macrobaby' });
  if (shopUrl) available.push({ url: shopUrl, retailer: shopRetailer || brand, preferred: primaryRetailer === 'shop' });
  if (shop2Url) available.push({ url: shop2Url, retailer: shop2Retailer || brand });
  // Some brands (e.g. Nuna) don't authorize Amazon third-party sales — never show an Amazon CTA.
  const amazonAllowed = isAmazonAllowedForBrand(brand);
  if (amazonUrl && amazonAllowed) available.push({ url: amazonUrl, retailer: 'Amazon', preferred: primaryRetailer === 'amazon' });
  available.push(...retailerLinks);
  if (openBoxUrl) available.push({ url: openBoxUrl, retailer: 'GoodBuy Gear (open box)' });

  // Only retailer links actually attached to this card render — no auto-generated
  // Babylist brand-store, Amazon search, or brand-direct fallbacks. A card with no
  // links entered shows no buy buttons.

  // MacroBaby shop links are switched off, whichever slot a post put one in.
  // Its registry and welcome-box pages are not product pages and still render.
  const buttons = orderedProductRetailers(available.filter((link) => !isBlockedMacroBabyShopUrl(link.url)));
  const displayPrice = productPricePresentation(price);

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
      {compatHref ? (
        <Link
          href={`/tools/compare?ids=${encodeURIComponent(travelSystemSlug({ brand: displayBrand, model: productName }))}`}
          className="tool-product-card__compare-pill"
          aria-label={`Compare the ${fullName} against other strollers`}
        >
          Compare →
        </Link>
      ) : null}
      <div className={`tool-card__media tool-product-card__media${isInline ? ' tool-product-card__media--compact' : ''}`}>
        {comingSoon ? <span className="tool-product-card__badge">Coming Soon</span> : null}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img loading="lazy" decoding="async" src={imageUrl} alt={fullName} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{displayBrand}</span>
        )}
      </div>
      <div className="tool-product-card__body">
        {displayBrand ? <p className="tool-product-card__brand">{displayBrand}</p> : null}
        <p className="tool-product-card__title">{productName}</p>
        {note ? <p className="text-sm leading-relaxed text-neutral-600">{note}</p> : null}
        {displayPrice ? (
          <p className="tool-product-card__price">
            {displayPrice.label}
            {displayPrice.reference ? <span>Reference price</span> : null}
          </p>
        ) : null}

        <div className="tool-product-card__actions">
          {comingSoon && buttons.length === 0 ? (
            <span className="tool-btn tool-btn--secondary tool-btn--block is-disabled" aria-disabled="true">
              Retailer coming soon
            </span>
          ) : null}
          <ProductRetailerActions links={buttons} productName={fullName} renderLink={(retailer, presentation) => (
            <TrackedAffiliateLink
              productShopLink
              href={retailer.url}
              ctaText={`Shop at ${retailer.retailer}`}
              ariaLabel={presentation.ariaLabel}
              className={presentation.className}
              meta={{
                product: fullName,
                brand: displayBrand,
                retailer: retailer.retailer,
                position,
                context: 'blog-catalog-card',
              }}
            >
              {presentation.children}
            </TrackedAffiliateLink>
          )} />

          {compatHref ? (
            <Link href={compatHref} className="blog-product-card__compat">
              Check compatible car seats
              <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          ) : null}

          {compatStrollersHref ? (
            <Link href={compatStrollersHref} className="blog-product-card__compat">
              Check compatible strollers
              <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
