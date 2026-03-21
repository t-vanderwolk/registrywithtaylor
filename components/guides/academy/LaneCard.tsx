import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { StrollerAcademyLane } from '@/lib/guides/strollerAcademy';

export default function LaneCard({
  lane,
}: {
  lane: StrollerAcademyLane;
}) {
  return (
    <Link
      href={lane.href}
      className="group block rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-white/88 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#9F556D]">
          <GuideGlyph icon={lane.icon} className="h-5 w-5" />
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">Explore lane</span>
      </div>
      <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">{lane.title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{lane.definition}</p>

      <div className="mt-5 space-y-4">
        <div className="rounded-[1.3rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Best For</p>
          <p className="mt-2 text-sm leading-7 text-[#4B3641]">{lane.bestFor}</p>
        </div>
        <div className="rounded-[1.3rem] bg-[rgba(248,241,243,0.76)] px-4 py-4">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Tradeoff</p>
          <p className="mt-2 text-sm leading-7 text-[#4B3641]">{lane.tradeoff}</p>
        </div>
      </div>
    </Link>
  );
}
