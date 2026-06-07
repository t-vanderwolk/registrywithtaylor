import Link from 'next/link';

const upsellBullets = [
  'Registry strategy',
  'Nursery planning',
  'Stroller and car seat education',
  'Postpartum preparation',
  'Downloadable checklists',
  'Guided workbook prompts',
  'Product decision frameworks',
  'Smart purchasing guidance',
];

export default function AcademyUpsellCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.28)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(253,247,248,0.97)_48%,rgba(249,242,237,0.98)_100%)] px-7 py-9 shadow-[0_28px_72px_rgba(72,49,56,0.08)] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-5rem] top-[-4rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.16)_0%,rgba(232,154,174,0)_72%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-3rem] left-[-4rem] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(196,156,94,0.1)_0%,rgba(196,156,94,0)_72%)] blur-2xl"
      />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14">
        {/* Left: copy */}
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
            Full Academy
          </p>
          <h2 className="mt-4 font-serif text-[2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
            Unlock the Complete Academy
          </h2>
          <p className="mt-4 max-w-[42ch] text-[1rem] leading-[1.8] text-neutral-600">
            A step-by-step baby preparation system designed to guide you from overwhelmed to confident.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/learn/pricing" className="btn btn--primary w-full sm:w-auto">
              See Academy Pricing
            </Link>
            <Link href="/learn" className="btn btn--secondary w-full sm:w-auto">
              Start Free
            </Link>
          </div>

          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.16em] text-neutral-400">
            Three free preview lessons. No account required to start.
          </p>
        </div>

        {/* Right: bullet list */}
        <div className="rounded-[1.35rem] border border-[rgba(215,161,175,0.2)] bg-white/80 p-6 shadow-[0_12px_30px_rgba(72,49,56,0.04)] sm:p-7">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/80">
            What&apos;s included
          </p>
          <ul className="mt-5 space-y-3">
            {upsellBullets.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.95rem] text-neutral-700">
                <span
                  aria-hidden="true"
                  className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
