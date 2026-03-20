import GuideGlyph from '@/components/guides/GuideGlyph';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideHubIconKey } from '@/lib/guides/hubs';

type GuidesLearningPathStep = {
  title: string;
  description: string;
  icon: GuideHubIconKey;
};

export default function GuidesLearningPath({
  id,
  eyebrow,
  title,
  description,
  steps,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  steps: GuidesLearningPathStep[];
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section id={id} className="space-y-5 scroll-mt-28">
      <RevealOnScroll>
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-[2.15rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-[3.25rem]">{title}</h2>
          {description ? (
            <p className="max-w-[64ch] text-[1rem] leading-8 text-neutral-700 sm:text-[1.08rem] sm:leading-8">{description}</p>
          ) : null}
        </div>
      </RevealOnScroll>

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <RevealOnScroll key={step.title} delayMs={index * 70}>
            <div className="h-full rounded-[1.7rem] border border-stone-200/70 bg-white/94 p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[0.82rem] font-semibold text-[var(--color-accent-dark)]">
                  0{index + 1}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(196,156,94,0.16)] bg-[rgba(255,248,241,0.86)] text-[var(--color-accent-dark)]">
                  <GuideGlyph icon={step.icon} />
                </div>
              </div>

              <h3 className="mt-5 font-serif text-[1.5rem] leading-[1.06] tracking-[-0.03em] text-neutral-900 sm:text-[1.62rem]">
                {step.title}
              </h3>
              <p className="mt-3 text-[1rem] leading-8 text-neutral-700">{step.description}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
