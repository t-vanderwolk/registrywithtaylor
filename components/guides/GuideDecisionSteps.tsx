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
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-[3.15rem]">{title}</h2>
          {description ? <p className="max-w-[74ch] text-[1rem] leading-7 text-neutral-700 sm:text-[1.08rem] sm:leading-8">{description}</p> : null}
        </div>
      </RevealOnScroll>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <RevealOnScroll key={step.id} delayMs={index * 70}>
            <section
              id={step.id}
              className="scroll-mt-28 rounded-[1.75rem] border border-stone-200/70 bg-white/94 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:p-6"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">{step.stepLabel}</p>
                  <h3 className="font-serif text-[1.7rem] leading-[1.04] tracking-[-0.03em] text-neutral-900 sm:text-[2.15rem]">
                    {step.title}
                  </h3>
                  {step.summary ? (
                    <p className="max-w-[62ch] text-[1rem] leading-7 text-neutral-700 sm:text-[1.08rem] sm:leading-8">
                      {step.summary}
                    </p>
                  ) : null}
                </div>

                {step.highlights && step.highlights.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.highlights.slice(0, mode === 'summary' ? 3 : step.highlights.length).map((highlight) => (
                      <span
                        key={`${step.id}-${highlight}`}
                        className="rounded-full border border-[rgba(196,156,94,0.16)] bg-[rgba(255,248,241,0.84)] px-3 py-1.5 text-[0.74rem] uppercase tracking-[0.12em] text-neutral-800"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}

                {mode === 'full' && step.introContent ? (
                  <div className="rounded-[1.25rem] border border-stone-200/70 bg-[#fcfaf7] p-4">
                    <PostContent
                      postId={`decision-step-${step.id}-intro`}
                      content={step.introContent}
                      className="guide-post-content guide-hub-card-content guide-hub-card-content--compact"
                      variant="plain"
                      highlightBrandWordmark={true}
                    />
                  </div>
                ) : null}

                {mode === 'full' && step.subsections && step.subsections.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {step.subsections.map((subsection) => (
                      <div
                        key={`${step.id}-${subsection.id}`}
                        className="rounded-[1.25rem] border border-stone-200/70 bg-[#fcfaf7] p-4"
                      >
                        <h4 className="font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{subsection.title}</h4>
                        <div className="mt-3">
                          <PostContent
                            postId={`decision-step-${step.id}-${subsection.id}`}
                            content={subsection.content}
                            className="guide-post-content guide-hub-card-content guide-hub-card-content--compact"
                            variant="plain"
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
