import type { ReactNode } from 'react';

type ProductLink = {
  label: string;
  url: string;
};

export default function ProductCard({
  brand,
  productName,
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
  review: ReactNode;
  bestFor: ReactNode;
  standout?: ReactNode;
  pros: ReactNode[];
  affiliateLinks: ProductLink[];
  imageUrl?: string | null;
  imageAlt?: string | null;
}) {
  return (
    <article className="content-widget my-10 overflow-hidden rounded-[20px] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f3_100%)] shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
      <div className="grid gap-0 md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
        <div className="min-h-[240px] border-b border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#f8efe8_0%,#f4e2df_100%)] md:min-h-full md:border-b-0 md:border-r">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt?.trim() || productName} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full min-h-[240px] flex-col justify-end p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">{brand}</p>
              <p className="mt-3 font-serif text-[1.9rem] leading-[1.02] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal)]">
                {productName}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">{brand}</p>
            <h3 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
              {productName}
            </h3>
          </div>

          <div className="text-[1.02rem] leading-relaxed text-[var(--tmbc-blog-soft-text)]">{review}</div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[18px] border border-[rgba(215,161,175,0.22)] bg-[var(--tmbc-blog-blush-soft)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">Best for</p>
              <div className="mt-2 text-sm leading-relaxed text-[var(--tmbc-blog-soft-text)]">{bestFor}</div>
            </div>

            <div className="rounded-[18px] border border-[rgba(215,161,175,0.22)] bg-[var(--tmbc-blog-blush-soft)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">Standout</p>
              <div className="mt-2 text-sm leading-relaxed text-[var(--tmbc-blog-soft-text)]">
                {standout || pros[0] || 'Thoughtfully selected for this guide.'}
              </div>
            </div>
          </div>

          {pros.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {pros.map((pro, index) => (
                <li
                  key={`product-pro-${index}`}
                  className="rounded-full border border-[rgba(196,156,94,0.22)] bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--color-accent-dark)]"
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
