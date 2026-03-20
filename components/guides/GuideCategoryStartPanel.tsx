import MarketingSurface from '@/components/ui/MarketingSurface';

type GuideCategoryStartCallout = {
  title?: string | null;
  body: string;
};

type GuideCategoryStartSummaryCard = {
  eyebrow: string;
  text: string;
};

const DEFAULT_SUPPORTING_LABELS = ['What this category solves', 'What this guide will sort out'] as const;

export default function GuideCategoryStartPanel({
  startDescription,
  questionTitle,
  leadParagraph,
  supportingParagraphs,
  supportingParagraphLabels,
  callout,
  summaryCards,
  questionTitleClassName = 'max-w-none sm:max-w-[10ch]',
  leadParagraphClassName = 'max-w-[34rem]',
}: {
  startDescription: string;
  questionTitle: string;
  leadParagraph?: string;
  supportingParagraphs: string[];
  supportingParagraphLabels?: string[];
  callout?: GuideCategoryStartCallout | null;
  summaryCards: GuideCategoryStartSummaryCard[];
  questionTitleClassName?: string;
  leadParagraphClassName?: string;
}) {
  return (
    <MarketingSurface className="mx-auto max-w-6xl rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm md:p-8 lg:p-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Start here</p>
        <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">
          What this guide is helping you decide
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{startDescription}</p>
      </div>

      <div className="mt-8 grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f8_0%,#f9f2ea_100%)] p-5 shadow-sm md:p-7">
          <div className="absolute right-[-1.5rem] top-[-1.75rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.22)_0%,rgba(215,161,175,0)_72%)]" />
          <div className="relative space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">The real question</p>
              <h3
                className={`${questionTitleClassName} w-full font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.45rem]`}
              >
                {questionTitle}
              </h3>
            </div>

            {leadParagraph ? (
              <p className={`${leadParagraphClassName} text-base leading-relaxed text-neutral-700 md:text-lg`}>
                {leadParagraph}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          {supportingParagraphs.map((paragraph, index) => (
            <div key={`${index}-${paragraph}`} className="rounded-xl border border-stone-200/70 bg-[#FCFAFB] p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">
                {supportingParagraphLabels?.[index] ?? DEFAULT_SUPPORTING_LABELS[index] ?? 'What else matters'}
              </p>
              <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">{paragraph}</p>
            </div>
          ))}

          {callout ? (
            <div className="rounded-xl border border-[rgba(232,154,174,0.26)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] p-5 shadow-sm md:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">
                {callout.title?.trim() || 'Start with the routine'}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-accent-dark)]/92 md:text-lg">{callout.body}</p>
            </div>
          ) : null}
        </div>
      </div>

      {summaryCards.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.eyebrow}
              className="rounded-xl border border-[rgba(196,156,94,0.14)] bg-[rgba(255,255,255,0.82)] p-4 md:p-5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">{card.eyebrow}</p>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">{card.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </MarketingSurface>
  );
}
