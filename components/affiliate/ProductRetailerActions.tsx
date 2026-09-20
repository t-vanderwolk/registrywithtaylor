'use client';

import { useId, useState, type ReactNode } from 'react';
import ProductShopLink from './ProductShopLink';
import type { RetailerLink } from '@/lib/retailerLinks';
import { currentRetailerPrice, formatRetailerPrice, MAX_CARD_RETAILERS, orderedProductRetailers } from '@/lib/productRetailers';
import styles from './ProductRetailerActions.module.css';

type LinkPresentation = { className: string; ariaLabel: string; children: ReactNode };

export default function ProductRetailerActions({
  links, productName, onRetailerClick, renderLink,
}: {
  links: RetailerLink[];
  productName: string;
  onRetailerClick?: (link: RetailerLink) => void;
  renderLink?: (link: RetailerLink, presentation: LinkPresentation) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const retailers = orderedProductRetailers(links).slice(0, MAX_CARD_RETAILERS);
  const extra = retailers.slice(2);
  if (!retailers.length) return null;

  function shopLink(link: RetailerLink, primary: boolean) {
    const price = primary ? null : currentRetailerPrice(link);
    const presentation: LinkPresentation = {
      className: primary ? styles.primary : styles.row,
      ariaLabel: `Shop at ${link.retailer} for ${productName}`,
      children: <>
        <span className={styles.label}>{primary ? `Shop at ${link.retailer}` : link.retailer}</span>
        {price ? <span className={styles.price}>
          <span>{formatRetailerPrice(price.value)}{price.sale ? <span className={styles.sale}>Sale</span> : null}</span>
          <span className={styles.checked}>Checked <time dateTime={link.priceCheckedAt}>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(price.checked)}</time></span>
        </span> : null}
        <span className={styles.arrow} aria-hidden="true">&rarr;</span>
      </>,
    };
    return renderLink ? renderLink(link, presentation) : (
      <ProductShopLink href={link.url} className={presentation.className} aria-label={presentation.ariaLabel}
        onClick={() => onRetailerClick?.(link)}>
        {presentation.children}
      </ProductShopLink>
    );
  }

  return (
    <div className={styles.actions} data-retailer-actions>
      <div className={styles.primaryGroup}>
        {retailers.slice(0, 2).map((link) => <div key={link.url}>{shopLink(link, true)}</div>)}
      </div>
      {extra.length ? <>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}>
          <span>Compare {extra.length} other {extra.length === 1 ? 'retailer' : 'retailers'}</span>
          <span className={styles.arrow} aria-hidden="true">{open ? '-' : '+'}</span>
        </button>
        <div id={panelId} hidden={!open} className={styles.panel}>
          <p className={styles.heading}>Where to buy</p>
          <ul className={styles.list}>
            {extra.map((link) => <li key={link.url}>{shopLink(link, false)}</li>)}
          </ul>
        </div>
      </> : null}
    </div>
  );
}
