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
      className="group flex h-full cursor-pointer flex-col rounded-[1.5rem] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-cta-pink)] hover:shadow-[0_26px_58px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)] active:translate-y-0 sm:p-7"
    >
      <h3 className="font-serif text-[1.5rem] leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:text-[1.65rem]">
        {name}
      </h3>
      <p className="mt-2.5 flex-1 text-[1.02rem] leading-[1.55] text-neutral-600">{blurb}</p>
      <span className="mt-6 inline-flex w-fit items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-cta-pink)] transition group-hover:text-[var(--color-cta-pink-hover)]">
        {ctaLabel}
        <span aria-hidden className="transition duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
