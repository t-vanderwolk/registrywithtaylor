import Link from 'next/link';

export type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

/**
 * A text-only tool card (title + description + pill CTA). Shared by the
 * Resources hub's Free Tools section.
 */
export default function ToolCard({ title, description, href, cta }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex cursor-pointer flex-col rounded-[1.5rem] border border-[var(--color-card-border)] bg-white p-6 shadow-[0_8px_28px_rgba(55,40,46,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-cta-pink)] hover:shadow-[0_26px_58px_rgba(184,116,138,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-pink)] active:translate-y-0 sm:p-7"
    >
      <h3 className="font-serif text-[1.45rem] leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:text-[1.6rem]">{title}</h3>
      <p className="mt-3 flex-1 text-[1.02rem] leading-[1.6] text-neutral-600">{description}</p>
      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white transition group-hover:bg-[var(--color-cta-pink-hover)]">
        {cta}
        <span aria-hidden className="transition duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
