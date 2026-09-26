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
  mark = false,
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
  /**
   * Show the retailer's mark alone, in an evenly sized pill, with the arrow
   * revealed on hover. The accessible name still comes from `ariaLabel`, and a
   * retailer with no logo asset falls back to its name set as a wordmark so a
   * row of pills stays visually even.
   */
  mark?: boolean;
  className?: string;
  /** Label content; defaults to "Shop at <retailer>". */
  children?: ReactNode;
}) {
  const logo = retailerLogo(retailer);
  // A mark is always the neutral pill. Normalising every affiliate CTA to one
  // treatment is the whole point, and a pink fill fought the retailers' own
  // brand colours — so `variant` only still decides chip vs full size here.
  const resolved = mark ? (variant === 'chip' ? 'chip' : 'secondary') : variant;
  const classes = [
    'tool-btn',
    resolved === 'chip' ? 'tool-btn--chip' : `tool-btn--${resolved}`,
    // A mark is sized to its logo, so full width would strand it in dead space.
    block && !mark ? 'tool-btn--block' : null,
    'tool-btn--retailer',
    mark ? 'tool-btn--mark' : null,
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
      <span
        className={[
          'tool-btn__label',
          // With a mark, the visible label goes; the anchor's aria-label already
          // carries the full "Shop at X for Y". Without one, the retailer's name
          // becomes the mark so the button is never empty.
          mark ? (logo ? 'tool-btn__label--sr' : 'tool-btn__wordmark') : null,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {mark && !logo ? retailer : children ?? `Shop at ${retailer}`}
      </span>
      <span className="tool-btn__arrow" aria-hidden="true">&rarr;</span>
    </ToolAffiliateLink>
  );
}
