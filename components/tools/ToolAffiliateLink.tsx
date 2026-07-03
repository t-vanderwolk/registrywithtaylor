'use client';

import type { ReactNode } from 'react';
import { trackToolAffiliateClick, type ToolName } from '@/lib/analytics/tools';

/**
 * An affiliate buy-link rendered inside a tool. Fires a `tool_affiliate_click`
 * GA event (with product, retailer, brand, and which tool) on click, then lets
 * the browser follow the link normally.
 */
export default function ToolAffiliateLink({
  tool,
  href,
  product,
  retailer,
  brand,
  className,
  ariaLabel,
  children,
}: {
  tool: ToolName;
  href: string;
  product?: string | null;
  retailer?: string | null;
  brand?: string | null;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      data-analytics-managed="true"
      onClick={() => trackToolAffiliateClick(tool, { product, retailer, brand, url: href })}
    >
      {children}
    </a>
  );
}
