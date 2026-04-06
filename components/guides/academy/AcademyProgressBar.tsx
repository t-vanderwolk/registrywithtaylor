'use client';

export default function AcademyProgressBar({
  current,
  total,
  label,
  stepLabel,
}: {
  current: number;
  total: number;
  label: string;
  stepLabel?: string;
}) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.min(100, Math.max(0, Math.round((current / safeTotal) * 100)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--tmbc-blog-rose)]" />
          <p className="min-w-0 text-[0.64rem] uppercase leading-5 tracking-[0.22em] text-[var(--tmbc-blog-rose)] sm:text-[0.68rem] sm:tracking-[0.24em]">
            {label}
          </p>
        </div>
        <p className="inline-flex w-fit rounded-full border border-[rgba(215,161,175,0.24)] bg-white/82 px-3 py-1.5 text-sm font-medium text-[var(--tmbc-blog-charcoal)] shadow-[0_14px_28px_rgba(82,62,68,0.04)]">
          {stepLabel ?? `Module ${current} of ${total}`}
        </p>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-[rgba(215,161,175,0.2)] bg-[rgba(255,247,249,0.94)] shadow-[inset_0_1px_3px_rgba(82,62,68,0.06)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#e89aae_0%,#d7a1af_52%,#b8748a_100%)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-1">
        {Array.from({ length: Math.min(safeTotal, 6) }).map((_, index) => (
          <span
            key={`${label}-${index}`}
            className={`h-2 w-2 rounded-full transition duration-300 ${
              index < current ? 'bg-[var(--tmbc-blog-rose)] shadow-[0_0_0_4px_rgba(232,154,174,0.14)]' : 'bg-[rgba(215,161,175,0.22)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
