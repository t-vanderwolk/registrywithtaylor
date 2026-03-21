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
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h2>
          {description ? <p className="max-w-4xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p> : null}
        </div>
      </RevealOnScroll>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <RevealOnScroll key={step.id} delayMs={index * 70}>
            <section
              id={step.id}
              className="scroll-mt-28 rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm md:p-7"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">{step.stepLabel}</p>
                  <h3 className="font-serif text-[1.6rem] leading-[1.04] tracking-tight text-charcoal md:text-[2rem]">
                    {step.title}
                  </h3>
                  {step.summary ? (
                    <p className="max-w-4xl text-base leading-relaxed text-neutral-700 md:text-lg">
                      {step.summary}
                    </p>
                  ) : null}
                </div>

                {step.highlights && step.highlights.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.highlights.slice(0, mode === 'summary' ? 3 : step.highlights.length).map((highlight) => (
                      <span
                        key={`${step.id}-${highlight}`}
                        className="rounded-full border border-[rgba(196,156,94,0.16)] bg-[rgba(255,248,241,0.84)] px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-neutral-800"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}

                {mode === 'full' && step.introContent ? (
                  <div className="rounded-xl border border-stone-200/70 bg-[#FCFAFB] p-5">
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
                        className="rounded-xl border border-stone-200/70 bg-[#FCFAFB] p-5"
                      >
                        <h4 className="font-serif text-[1.25rem] leading-[1.08] tracking-tight text-charcoal">{subsection.title}</h4>
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
