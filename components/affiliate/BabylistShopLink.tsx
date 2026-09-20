import type { AnchorHTMLAttributes } from 'react';
import { babylistShopMyUrl } from '@/lib/affiliateShopMy';

/** Editorial links retain their existing behavior unless they are Babylist shopping links. */
export default function BabylistShopLink({ href, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const destination = href ? babylistShopMyUrl(href) : href;
  if (destination === href) return <a {...props} href={href} className={className} />;
  return (
    <a
      {...props}
      href={destination}
      className={['shopmyskip', className].filter(Boolean).join(' ')}
      rel="sponsored nofollow noopener"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
