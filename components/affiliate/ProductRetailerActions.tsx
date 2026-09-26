'use client';

import { useId, useState, type ReactNode } from 'react';
import ProductShopLink from './ProductShopLink';
import { shopMyProductUrl } from '@/lib/affiliateShopMy';
import type { RetailerLink } from '@/lib/retailerLinks';
import { MAX_CARD_RETAILERS, orderedProductRetailers } from '@/lib/productRetailers';
import { retailerLogo } from '@/lib/retailerLogos';
import '@/styles/widgets.css';
import styles from './ProductRetailerActions.module.css';

type LinkPresentation = { className: string; ariaLabel: string; children: ReactNode };

export default function ProductRetailerActions({
  links, productName, onRetailerClick, renderLink, logos,
}: {
  links: RetailerLink[];
  productName: string;
  onRetailerClick?: (link: RetailerLink) => void;
  renderLink?: (link: RetailerLink, presentation: LinkPresentation) => ReactNode;
  /** Admin partner logos, merged over the static retailer assets. */
  logos?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const retailers = orderedProductRetailers(links).slice(0, MAX_CARD_RETAILERS);
  const extra = retailers.slice(2);
  if (!retailers.length) return null;

  function shopLink(link: RetailerLink) {
    // One price lives on the card itself; the retailers carry only their mark,
    // so the list reads as "where to buy" rather than a price table.
    //
    // These use the global `.tool-btn--mark` classes rather than module styles
    // on purpose: it's the same pill the finder, checker, compare and quiz use,
    // so the checklist and blog cards can't drift out of step with them.
    const logo = retailerLogo(link.retailer, logos);
    const presentation: LinkPresentation = {
      className: 'tool-btn tool-btn--secondary tool-btn--retailer tool-btn--mark',
      ariaLabel: `Shop at ${link.retailer} for ${productName}`,
      children: <>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" aria-hidden="true" loading="lazy" decoding="async" className="tool-btn__logo" />
        ) : null}
        {/* aria-label above carries the accessible name; with no logo asset the
            retailer's name becomes the mark so the pill is never empty. */}
        <span className={logo ? 'tool-btn__label tool-btn__label--sr' : 'tool-btn__label tool-btn__wordmark'}>
          {link.retailer}
        </span>
        <span className="tool-btn__arrow" aria-hidden="true">&rarr;</span>
      </>,
    };
    return renderLink ? renderLink(link, presentation) : (
      <ProductShopLink href={link.url} className={presentation.className} aria-label={presentation.ariaLabel}
        onClick={() => onRetailerClick?.({ ...link, url: shopMyProductUrl(link.url) })}>
        {presentation.children}
      </ProductShopLink>
    );
  }

  return (
    <div className={styles.actions} data-retailer-actions>
      <div className={styles.primaryGroup}>
        {retailers.slice(0, 2).map((link) => <div key={link.url}>{shopLink(link)}</div>)}
      </div>
      {extra.length ? <>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}>
          <span>View All Retailers</span>
          <span className={styles.arrow} aria-hidden="true">{open ? '-' : '+'}</span>
        </button>
        <div id={panelId} hidden={!open} className={styles.panel}>
          <p className={styles.heading}>Where to buy</p>
          <ul className={styles.list}>
            {extra.map((link) => <li key={link.url}>{shopLink(link)}</li>)}
          </ul>
        </div>
      </> : null}
    </div>
  );
}
