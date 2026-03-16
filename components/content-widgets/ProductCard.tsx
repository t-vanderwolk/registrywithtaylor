import type { ReactNode } from 'react';
import { resolveProductCardImage } from '@/lib/blog/productCardImages';

type ProductLink = {
  label: string;
  url: string;
};

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
}) {
  const resolvedImage = resolveProductCardImage({
    brand,
    productName,
    imageUrl,
    imageAlt,
  });

  return (
    <article className="content-widget my-6 overflow-hidden rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#ffffff_0%,#fdf2f6_100%)] shadow-[0_18px_48px_rgba(0,0,0,0.06)] sm:my-10">
      {/* Image at the top */}
      <div className="h-[200px] border-b border-[rgba(232,154,174,0.2)] bg-[linear-gradient(180deg,#fbf3f6_0%,#f4e2e8_100%)] sm:h-[240px]">
        {resolvedImage ? (
          <div className="relative h-full">
            <img
              src={resolvedImage.src}
              alt={resolvedImage.alt}
              className={`h-full w-full bg-[rgba(255,255,255,0.72)] ${resolvedImage.objectClassName} ${
                resolvedImage.isFallback ? '' : 'p-3 sm:p-5'
              }`}
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
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose)]">{brand}</p>
            <p className="tmbc-widget-heading mt-3 font-serif text-[1.9rem] leading-[1.02] tracking-[-0.04em]">
              {productName}
            </p>
            {category && (
              <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]/80">{category}</p>
            )}
          </div>
        )}
      </div>

      {/* Product info below image */}
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose)]">{brand}</p>
          <h3 className="tmbc-widget-heading mt-2 sm:mt-3 font-serif text-[1.45rem] leading-tight tracking-[-0.03em] sm:text-[1.65rem]">{productName}</h3>
          {category && (
            <p className="mt-1 sm:mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]/80 sm:text-[0.72rem]">{category}</p>
          )}
        </div>

        {/* Comparison content */}
        <div className="space-y-4 sm:space-y-5">
          <div className="tmbc-widget-copy text-[0.95rem] leading-relaxed sm:text-[1.02rem]">{review}</div>

          <div className="space-y-3 sm:space-y-4">
            <div className="rounded-[18px] border border-[rgba(232,154,174,0.24)] bg-[rgba(243,227,232,0.62)] p-3 sm:p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)] sm:text-[0.72rem]">Best for</p>
              <div className="tmbc-widget-copy mt-1 sm:mt-2 text-sm leading-relaxed">{bestFor}</div>
            </div>

            <div className="rounded-[18px] border border-[rgba(232,154,174,0.24)] bg-[rgba(243,227,232,0.62)] p-3 sm:p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)] sm:text-[0.72rem]">Standout</p>
              <div className="tmbc-widget-copy mt-1 sm:mt-2 text-sm leading-relaxed">
                {standout || pros[0] || 'Thoughtfully selected for this guide.'}
              </div>
            </div>
          </div>

          {pros.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {pros.map((pro, index) => (
                <li
                  key={`product-pro-${index}`}
                  className="rounded-full border border-[rgba(232,154,174,0.24)] bg-[rgba(255,255,255,0.9)] px-2 py-1 text-xs uppercase tracking-[0.14em] text-[var(--tmbc-blog-rose)] sm:px-3 sm:py-2"
                >
                  {pro}
                </li>
              ))}
            </ul>
          ) : null}

          {affiliateLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3 pt-1">
              {affiliateLinks.map((link) => (
                <a
                  key={`${productName}-${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="btn btn--secondary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
