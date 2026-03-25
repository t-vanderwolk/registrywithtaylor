'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { getAffiliateTrackingDataAttributes } from '@/lib/analytics/trackAffiliateClick';

type AffiliateLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  product?: string;
  brand?: string;
  category?: string;
  guide?: string;
  position?: string | number;
};

const isInternalHref = (href: string) => href.startsWith('/');

export default function AffiliateLink({
  href,
  children,
  product,
  brand,
  category,
  guide,
  position,
  rel,
  target,
  ...rest
}: AffiliateLinkProps) {
  const dataAttributes = getAffiliateTrackingDataAttributes({
    product,
    brand,
    category,
    guide,
    position,
  });

  if (isInternalHref(href)) {
    return (
      <Link
        href={href}
        {...dataAttributes}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={target ?? '_blank'}
      rel={rel ?? 'sponsored nofollow noopener noreferrer'}
      {...dataAttributes}
      {...rest}
    >
      {children}
    </a>
  );
}
