'use client';

export default function AcademyProgressBar({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.min(100, Math.max(0, Math.round((current / safeTotal) * 100)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
          <p className="min-w-0 text-[0.64rem] uppercase leading-5 tracking-[0.22em] text-[#A15B72] sm:text-[0.68rem] sm:tracking-[0.24em]">
            {label}
          </p>
        </div>
        <p className="inline-flex w-fit rounded-full border border-[rgba(217,134,162,0.16)] bg-white/72 px-3 py-1.5 text-sm font-medium text-[#4B3641] shadow-[0_10px_24px_rgba(58,36,43,0.05)]">
          {current}/{total}
        </p>
      </div>
      <div className="academy-sheen h-3 overflow-hidden rounded-full border border-[rgba(217,134,162,0.12)] bg-[rgba(244,220,226,0.78)] shadow-[inset_0_1px_3px_rgba(58,36,43,0.08)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#E6A2B5_0%,#D986A2_48%,#A15B72_100%)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-1">
        {Array.from({ length: Math.min(safeTotal, 6) }).map((_, index) => (
          <span
            key={`${label}-${index}`}
            className={`h-2 w-2 rounded-full transition duration-300 ${
              index < current ? 'bg-[#D986A2] shadow-[0_0_0_4px_rgba(217,134,162,0.12)]' : 'bg-[rgba(217,134,162,0.18)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
