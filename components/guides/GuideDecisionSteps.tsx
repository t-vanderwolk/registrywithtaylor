import PostContent from '@/components/blog/PostContent';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export type GuideDecisionStepSubsection = {
  id: string;
  title: string;
  content: string;
};

export type GuideDecisionStep = {
  id: string;
  stepLabel: string;
  title: string;
  summary?: string;
  highlights?: string[];
  introContent?: string;
  subsections?: GuideDecisionStepSubsection[];
};

export default function GuideDecisionSteps({
  eyebrow = 'Step by step',
  title,
  description,
  steps,
  mode = 'full',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: GuideDecisionStep[];
  mode?: 'full' | 'summary';
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <RevealOnScroll>
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{eyebrow}</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">{title}</h2>
          {description ? <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p> : null}
        </div>
      </RevealOnScroll>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <RevealOnScroll key={step.id} delayMs={index * 70}>
            <section
              id={step.id}
              className="scroll-mt-28 rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-7"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{step.stepLabel}</p>
                  <h3 className="text-[1.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-[#2F2430] md:text-[2rem]">
                    {step.title}
                  </h3>
                  {step.summary ? (
                    <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">
                      {step.summary}
                    </p>
                  ) : null}
                </div>

                {step.highlights && step.highlights.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.highlights.slice(0, mode === 'summary' ? 3 : step.highlights.length).map((highlight) => (
                      <span
                        key={`${step.id}-${highlight}`}
                        className="rounded-full border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.92)] px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-[#6E5561]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}

                {mode === 'full' && step.introContent ? (
                  <div className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] p-5">
                    <PostContent
                      postId={`decision-step-${step.id}-intro`}
                      content={step.introContent}
                      className="guide-post-content guide-hub-card-content guide-hub-card-content--compact"
                      variant="guide"
                      highlightBrandWordmark={true}
                    />
                  </div>
                ) : null}

                {mode === 'full' && step.subsections && step.subsections.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {step.subsections.map((subsection) => (
                      <div
                        key={`${step.id}-${subsection.id}`}
                        className="rounded-[1.2rem] bg-[rgba(250,244,246,0.92)] p-5"
                      >
                        <h4 className="text-[1.25rem] font-medium leading-[1.08] tracking-[-0.02em] text-[#2F2430]">{subsection.title}</h4>
                        <div className="mt-3">
                          <PostContent
                            postId={`decision-step-${step.id}-${subsection.id}`}
                            content={subsection.content}
                            className="guide-post-content guide-hub-card-content guide-hub-card-content--compact"
                            variant="guide"
                            highlightBrandWordmark={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
