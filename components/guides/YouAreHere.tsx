import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import {
  GUIDE_SECTION_FRAME_WARM_CLASSNAME,
  GUIDE_SUPPORT_CARD_CLASSNAME,
  GuideSectionHeading,
} from '@/components/guides/GuidePrimitives';
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
      <section className={GUIDE_SECTION_FRAME_WARM_CLASSNAME}>
        <GuideSectionHeading
          eyebrow="You Are Here"
          title="A quick orientation before you keep scrolling."
          description="The point is to keep the decision path obvious, not to make you decode where this page fits in the system."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className={`${GUIDE_SUPPORT_CARD_CLASSNAME} bg-white/84 px-5 py-5`}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Step</p>
            <p className="mt-2 text-xl font-medium text-[#2F2430]">{step}</p>
          </div>

          <div className={`${GUIDE_SUPPORT_CARD_CLASSNAME} bg-white/84 px-5 py-5`}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Category</p>
            <p className="mt-2 text-xl font-medium text-[#2F2430]">{category}</p>
          </div>

          <div className={`${GUIDE_SUPPORT_CARD_CLASSNAME} bg-white/84 px-5 py-5 md:col-span-1`}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Goal</p>
            <p className="mt-2 text-base leading-7 text-[#4B3641]">{goal}</p>
          </div>
        </div>

        <GuideHandwrittenNote
          className="mt-6"
          tone="white"
          title="You do not need to memorize the whole system."
          description={
            <p>
              You just need to know what this page is helping you decide. Once that part is clear, the next click
              usually gets much less dramatic.
            </p>
          }
        />
      </section>
    </RevealOnScroll>
  );
}
