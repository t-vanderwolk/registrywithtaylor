import type { ReactNode } from 'react';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import { resolveProductCardImage } from '@/lib/blog/productCardImages';

type ProductLink = {
  label: string;
  url: string;
};

type ProductCardVariant = 'default' | 'homepage';

export default function ProductCard({
  brand,
  productName,
  category,
  review,
  bestFor,
  standout,
  pros,
  affiliateLinks,
  imageUrl,
  imageAlt,
  variant = 'default',
}: {
  brand: string;
  productName: string;
  category?: string;
  review: ReactNode;
  bestFor: ReactNode;
  standout?: ReactNode;
  pros: ReactNode[];
  affiliateLinks: ProductLink[];
  imageUrl?: string | null;
  imageAlt?: string | null;
  variant?: ProductCardVariant;
}) {
  const resolvedImage = resolveProductCardImage({
    brand,
    productName,
    imageUrl,
    imageAlt,
  });
  const primaryAffiliateLink = affiliateLinks.find((link) => link.url?.trim())?.url?.trim() ?? null;
  const isHomepageVariant = variant === 'homepage';

  const shellClassName = isHomepageVariant
    ? 'content-widget my-6 overflow-hidden rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.05)] sm:my-0 sm:rounded-[1.8rem]'
    : 'content-widget my-6 overflow-hidden rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#ffffff_0%,#fdf2f6_100%)] shadow-[0_18px_48px_rgba(0,0,0,0.06)] sm:my-10';
  const imageWrapClassName = isHomepageVariant
    ? 'relative aspect-[4/3] border-b border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#f7f2eb_0%,#efe6db_100%)]'
    : 'h-[200px] border-b border-[rgba(232,154,174,0.2)] bg-[linear-gradient(180deg,#fbf3f6_0%,#f4e2e8_100%)] sm:h-[240px]';
  const imageClassName = isHomepageVariant
    ? `h-full w-full bg-transparent ${resolvedImage?.objectClassName ?? 'object-contain'} ${
        resolvedImage?.isFallback ? '' : 'p-4 sm:p-6'
      }`
    : `h-full w-full bg-[rgba(255,255,255,0.72)] ${resolvedImage?.objectClassName ?? 'object-contain'} ${
        resolvedImage?.isFallback ? '' : 'p-3 sm:p-5'
      }`;
  const brandClassName = isHomepageVariant
    ? 'text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-black/48'
    : 'text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose)]';
  const categoryClassName = isHomepageVariant
    ? 'mt-1 sm:mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-black/45 sm:text-[0.72rem]'
    : 'mt-1 sm:mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]/80 sm:text-[0.72rem]';
  const titleClassName = isHomepageVariant
    ? 'mt-2 sm:mt-3 font-serif text-[1.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[1.55rem]'
    : 'tmbc-widget-heading mt-2 sm:mt-3 font-serif text-[1.45rem] leading-tight tracking-[-0.03em] sm:text-[1.65rem]';
  const reviewClassName = isHomepageVariant
    ? 'text-sm leading-7 text-neutral-700'
    : 'tmbc-widget-copy text-[0.95rem] leading-relaxed sm:text-[1.02rem]';
  const bestForClassName = isHomepageVariant
    ? 'rounded-[1.25rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] p-4 sm:rounded-[1.35rem]'
    : 'rounded-[18px] border border-[rgba(232,154,174,0.24)] bg-[rgba(243,227,232,0.62)] p-3 sm:p-4';
  const standoutClassName = isHomepageVariant
    ? 'rounded-[1.25rem] border border-[rgba(0,0,0,0.06)] bg-white/88 p-4 sm:rounded-[1.35rem]'
    : 'rounded-[18px] border border-[rgba(232,154,174,0.24)] bg-[rgba(243,227,232,0.62)] p-3 sm:p-4';
  const fieldEyebrowClassName = isHomepageVariant
    ? 'text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/45 sm:text-[0.72rem]'
    : 'text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)] sm:text-[0.72rem]';
  const fieldCopyClassName = isHomepageVariant
    ? 'mt-2 text-sm leading-7 text-neutral-700'
    : 'tmbc-widget-copy mt-1 sm:mt-2 text-sm leading-relaxed';
  const proClassName = isHomepageVariant
    ? 'rounded-full border border-[rgba(196,156,94,0.18)] bg-[rgba(255,248,241,0.82)] px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-neutral-800'
    : 'rounded-full border border-[rgba(232,154,174,0.24)] bg-[rgba(255,255,255,0.9)] px-2 py-1 text-xs uppercase tracking-[0.14em] text-[var(--tmbc-blog-rose)] sm:px-3 sm:py-2';
  const imagePanel = (
    <div className={imageWrapClassName}>
      {resolvedImage ? (
        <div className="relative h-full">
          <img
            src={resolvedImage.src}
            alt={resolvedImage.alt}
            className={imageClassName}
            loading="lazy"
          />
          {resolvedImage.isFallback ? (
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(18,18,18,0)_0%,rgba(18,18,18,0.72)_100%)] p-5 text-white">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/82">{brand}</p>
              <p className="mt-2 font-serif text-[1.55rem] leading-[1.05] tracking-[-0.03em]">{productName}</p>
              {category && (
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/72">{category}</p>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex h-full flex-col justify-end p-6">
          <p className={brandClassName}>{brand}</p>
          <p
            className={
              isHomepageVariant
                ? 'mt-3 font-serif text-[1.7rem] leading-[1.04] tracking-[-0.04em] text-neutral-900'
                : 'tmbc-widget-heading mt-3 font-serif text-[1.9rem] leading-[1.02] tracking-[-0.04em]'
            }
          >
            {productName}
          </p>
          {category && (
            <p className={categoryClassName}>{category}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <article className={shellClassName}>
      {primaryAffiliateLink ? (
        <TrackedAffiliateLink
          href={primaryAffiliateLink}
          ctaText={`Shop ${productName}`}
          aria-label={`Shop ${productName}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(196,156,94,0.42)] focus-visible:ring-offset-4"
          meta={{
            context: 'product_card_image',
            productName,
            brandName: brand,
          }}
        >
          {imagePanel}
        </TrackedAffiliateLink>
      ) : (
        imagePanel
      )}

      {/* Product info below image */}
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-5">
          <p className={brandClassName}>{brand}</p>
          <h3 className={titleClassName}>{productName}</h3>
          {category && (
            <p className={categoryClassName}>{category}</p>
          )}
        </div>

        {/* Comparison content */}
        <div className="space-y-4 sm:space-y-5">
          <div className={reviewClassName}>{review}</div>

          <div className="space-y-3 sm:space-y-4">
            <div className={bestForClassName}>
              <p className={fieldEyebrowClassName}>Best for</p>
              <div className={fieldCopyClassName}>{bestFor}</div>
            </div>

            <div className={standoutClassName}>
              <p className={fieldEyebrowClassName}>Standout</p>
              <div className={fieldCopyClassName}>
                {standout || pros[0] || 'Thoughtfully selected for this guide.'}
              </div>
            </div>
          </div>

          {pros.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {pros.map((pro, index) => (
                <li key={`product-pro-${index}`} className={proClassName}>
                  {pro}
                </li>
              ))}
            </ul>
          ) : null}

          {affiliateLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3 pt-1">
              {affiliateLinks.map((link) => (
                <TrackedAffiliateLink
                  key={`${productName}-${link.label}-${link.url}`}
                  href={link.url}
                  ctaText={link.label}
                  className="btn btn--secondary"
                  meta={{
                    context: 'product_card_cta',
                    productName,
                    brandName: brand,
                  }}
                >
                  {link.label}
                </TrackedAffiliateLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
