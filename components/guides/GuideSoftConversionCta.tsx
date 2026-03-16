import Link from 'next/link';

export default function GuideSoftConversionCta({
  id,
  title,
  description,
  href,
  ctaLabel,
}: {
  id?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
}) {
  return (
    <section
      id={id}
      className="rounded-[1.75rem] border border-[#F1D9DF] bg-[linear-gradient(180deg,#fff8f7_0%,#f6eee8_100%)] px-5 py-7 text-center shadow-[0_20px_48px_rgba(0,0,0,0.04)] sm:px-6 sm:py-8 md:rounded-[2rem] md:px-10 md:py-10"
    >
      <div className="mx-auto max-w-[70ch] space-y-4">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Next step</p>
        <h2 className="font-serif text-[1.85rem] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">{title}</h2>
        <p className="text-[0.98rem] leading-relaxed text-neutral-700">{description}</p>
      </div>

      <div className="mt-7 sm:mt-8">
        <Link
          href={href}
          className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(215,161,175,0.42)] bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:border-[#D7A1AF] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(215,161,175,0.5)] focus-visible:ring-offset-4 sm:w-auto"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true" className="ml-2">
            -&gt;
          </span>
        </Link>
      </div>
    </section>
  );
}
