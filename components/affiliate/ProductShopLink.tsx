import type { AnchorHTMLAttributes } from 'react';
import { shopMyProductUrl } from '@/lib/affiliateShopMy';

/** Render tracking at source so navigation and interactive cards need no DOM scan. */
export default function ProductShopLink({ href, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const destination = href ? shopMyProductUrl(href) : href;
  const wrapped = destination?.startsWith('https://go.shopmy.us/') ?? false;
  return (
    <a
      {...props}
      href={destination}
      className={['shopmyskip', className].filter(Boolean).join(' ')}
      target="_blank"
      rel={`sponsored nofollow noopener${wrapped ? '' : ' noreferrer'}`}
      referrerPolicy={wrapped ? 'no-referrer-when-downgrade' : undefined}
    />
  );
}
