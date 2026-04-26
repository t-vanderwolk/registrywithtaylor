import type { CaseStudy } from '@/lib/caseStudies';

export default function CaseStudySnapshot({ study }: { study: CaseStudy }) {
  const snapshotItems = [
    ['Family', study.snapshot.family],
    ['Home', study.snapshot.home],
    ['Priority', study.snapshot.priority],
    ['Constraint', study.snapshot.constraint],
    ['Best first move', study.snapshot.bestFirstMove],
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Snapshot</p>
        <div className="mt-6 divide-y divide-[rgba(215,161,175,0.16)]">
          {snapshotItems.map(([label, value]) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#A15B72]">{label}</p>
              <p className="break-words text-[0.98rem] leading-7 text-[#4B3641]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(248,240,234,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Starting Point</p>
        <p className="mt-5 break-words font-serif text-[1.45rem] leading-[1.18] tracking-[-0.03em] text-[#2F2430] sm:text-[1.85rem]">
          {study.startingPoint}
        </p>
      </div>
    </section>
  );
}
