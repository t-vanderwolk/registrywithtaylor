import Link from 'next/link';

type LessonCTAProps = {
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string | null; // null = coming soon, disabled
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function LessonCTA({
  heading,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: LessonCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.55rem] border border-[rgba(215,161,175,0.28)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.97)_50%,rgba(249,242,237,0.98)_100%)] px-7 py-9 text-center shadow-[0_20px_55px_rgba(72,49,56,0.08)] sm:px-10 sm:py-12">
      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-2rem] h-24 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(232,154,174,0.22)_0%,rgba(232,154,174,0)_72%)] blur-2xl"
      />

      <p className="relative font-handwritten-print text-[1.4rem] leading-none text-[var(--color-accent-dark)]/75 sm:text-[1.6rem]">
        keep going
      </p>
      <h2 className="relative mx-auto mt-3 max-w-[22ch] font-serif text-[1.75rem] leading-[1.0] tracking-[-0.04em] text-neutral-900 sm:text-[2.2rem]">
        {heading}
      </h2>
      <p className="relative mx-auto mt-4 max-w-[42ch] text-[0.98rem] leading-[1.8] text-neutral-600 sm:text-[1.02rem]">
        {body}
      </p>

      <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        {primaryHref ? (
          <Link href={primaryHref} className="btn btn--primary w-full sm:w-auto">
            {primaryLabel}
          </Link>
        ) : (
          /* TODO: Replace with payment gate link once pricing is configured */
          <Link href="/services" className="btn btn--primary w-full sm:w-auto">
            {primaryLabel}
          </Link>
        )}

        {secondaryLabel && secondaryHref && (
          <Link href={secondaryHref} className="btn btn--secondary w-full sm:w-auto">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
