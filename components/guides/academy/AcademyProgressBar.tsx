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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">{label}</p>
        <p className="text-sm font-medium text-[#4B3641]">
          {current}/{total}
        </p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(215,161,175,0.14)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#D7A1AF,#A15B72)] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
