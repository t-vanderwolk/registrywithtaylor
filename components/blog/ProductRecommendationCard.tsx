type ProductRecommendationLink = {
  label: string;
  url: string;
};

export type ProductRecommendationCardProps = {
  brand: string;
  productName: string;
  shortReview: string;
  pros: string[];
  bestFor: string;
  standout?: string | null;
  affiliateLinks: ProductRecommendationLink[];
};

export default function ProductRecommendationCard({
  brand,
  productName,
  shortReview,
  pros,
  bestFor,
  standout,
  affiliateLinks,
}: ProductRecommendationCardProps) {
  return (
    <article className="tmbc-blog-soft-card p-6">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">{brand}</p>
          <h3 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
            {productName}
          </h3>
        </div>

        <p className="text-[1.02rem] leading-relaxed text-[var(--tmbc-blog-soft-text)]">{shortReview}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-[rgba(215,161,175,0.22)] bg-[var(--tmbc-blog-blush-soft)] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">Best for</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tmbc-blog-soft-text)]">{bestFor}</p>
          </div>

          <div className="rounded-[22px] border border-[rgba(215,161,175,0.22)] bg-[var(--tmbc-blog-blush-soft)] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">Standout</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--tmbc-blog-soft-text)]">{standout || pros[0] || 'Thoughtfully selected for this guide.'}</p>
          </div>
        </div>

        {pros.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {pros.map((pro) => (
              <li
                key={pro}
                className="rounded-full border border-[rgba(215,161,175,0.22)] bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--tmbc-blog-rose)]"
              >
                {pro}
              </li>
            ))}
          </ul>
        ) : null}

        {affiliateLinks.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-2">
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
    </article>
  );
}
