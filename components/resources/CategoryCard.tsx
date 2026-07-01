import Link from 'next/link';

export type CategoryCardProps = {
  name: string;
  blurb: string;
  /** Deep-link into the filtered Stroller Finder. */
  href: string;
  ctaLabel?: string;
};

/**
 * A stroller-category tile. Every card deep-links into the Stroller Finder
 * pre-filtered to its category.
 */
export default function CategoryCard({ name, blurb, href, ctaLabel = 'View Examples' }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[1.4rem] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-5 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(55,40,46,0.09)] sm:p-6"
    >
      <h3 className="font-serif text-[1.22rem] leading-[1.12] tracking-[-0.03em] text-neutral-900 sm:text-[1.32rem]">{name}</h3>
      <p className="mt-2 flex-1 text-[0.9rem] leading-[1.6] text-neutral-600">{blurb}</p>
      <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-cta-pink)] transition group-hover:text-[var(--color-cta-pink-hover)]">
        {ctaLabel}
        <span aria-hidden className="transition duration-200 group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
