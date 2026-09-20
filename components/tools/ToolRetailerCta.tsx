'use client';

import type { ReactNode } from 'react';
import ToolAffiliateLink from './ToolAffiliateLink';
import { retailerLogo } from '@/lib/retailerLogos';
import type { ToolName } from '@/lib/analytics/tools';

/**
 * The single affiliate CTA used across the tools, so a buy button looks and
 * behaves the same on the finder, compare, checker and quiz as it does on a
 * product card: retailer mark, label, trailing arrow.
 *
 * Routing goes through ToolAffiliateLink → ProductShopLink, which applies the
 * ShopMy wrapper (skipping preserved domains and anything already carrying an
 * affiliate parameter) and marks the anchor `shopmyskip` so the installed
 * auto-linking script leaves it alone.
 */
export default function ToolRetailerCta({
  tool,
  href,
  retailer,
  product,
  brand,
  variant = 'secondary',
  block = false,
  className,
  children,
}: {
  tool: ToolName;
  href: string;
  /** Display name, also used to look up the logo (e.g. "Target"). */
  retailer: string;
  product?: string | null;
  brand?: string | null;
  variant?: 'primary' | 'secondary' | 'chip';
  block?: boolean;
  className?: string;
  /** Label content; defaults to "Shop at <retailer>". */
  children?: ReactNode;
}) {
  const logo = retailerLogo(retailer);
  const classes = [
    'tool-btn',
    variant === 'chip' ? 'tool-btn--chip' : `tool-btn--${variant}`,
    block ? 'tool-btn--block' : null,
    'tool-btn--retailer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ToolAffiliateLink
      tool={tool}
      href={href}
      retailer={retailer.toLowerCase()}
      product={product}
      brand={brand}
      className={classes}
      ariaLabel={product ? `Shop at ${retailer} for ${product}` : `Shop at ${retailer}`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" aria-hidden="true" loading="lazy" decoding="async" className="tool-btn__logo" />
      ) : null}
      <span className="tool-btn__label">{children ?? `Shop at ${retailer}`}</span>
      <span className="tool-btn__arrow" aria-hidden="true">&rarr;</span>
    </ToolAffiliateLink>
  );
}
