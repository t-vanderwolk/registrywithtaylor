import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideStageLabel } from '@/lib/guides/guideFlow';

export default function YouAreHere({
  step,
  category,
  goal,
}: {
  step: GuideStageLabel;
  category: string;
  goal: string;
}) {
  return (
    <RevealOnScroll>
      <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#fffdfd_0%,#fbf4f7_100%)] p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">You Are Here</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">
            A quick orientation before you keep scrolling.
          </h2>
          <p className="max-w-3xl text-base leading-8 text-[#5B4B55] md:text-lg">
            The point is to keep the decision path obvious, not to make you decode where this page fits in the system.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] bg-white/84 px-5 py-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Step</p>
            <p className="mt-2 text-xl font-medium text-[#2F2430]">{step}</p>
          </div>

          <div className="rounded-[1.4rem] bg-white/84 px-5 py-5">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Category</p>
            <p className="mt-2 text-xl font-medium text-[#2F2430]">{category}</p>
          </div>

          <div className="rounded-[1.4rem] bg-white/84 px-5 py-5 md:col-span-1">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Goal</p>
            <p className="mt-2 text-base leading-7 text-[#4B3641]">{goal}</p>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
