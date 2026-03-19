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
    <MarketingSurface className="mx-auto max-w-6xl rounded-[1.55rem] border border-stone-200/70 bg-white/94 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-6 md:rounded-[2rem] md:p-8 lg:p-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Start here</p>
        <h2 className="font-serif text-[1.68rem] leading-[1.04] tracking-tight text-neutral-900 sm:text-3xl">
          What this guide is helping you decide
        </h2>
        <p className="text-[0.95rem] leading-7 text-neutral-700 sm:text-[0.98rem] sm:leading-relaxed">{startDescription}</p>
      </div>

      <div className="mt-6 grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative overflow-hidden rounded-[1.45rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f8_0%,#f9f2ea_100%)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:rounded-[1.7rem] sm:p-6 md:p-7">
          <div className="absolute right-[-1.5rem] top-[-1.75rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.22)_0%,rgba(215,161,175,0)_72%)]" />
          <div className="relative space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">The real question</p>
              <h3
                className={`${questionTitleClassName} w-full font-serif text-[1.8rem] leading-[1] tracking-[-0.04em] text-neutral-900 sm:text-[2.2rem] md:text-[2.45rem]`}
              >
                {questionTitle}
              </h3>
            </div>

            {leadParagraph ? (
              <p className={`${leadParagraphClassName} text-[0.96rem] leading-7 text-neutral-700 sm:text-[1.04rem] sm:leading-8`}>
                {leadParagraph}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          {supportingParagraphs.map((paragraph, index) => (
            <div key={`${index}-${paragraph}`} className="rounded-[1.35rem] border border-stone-200/70 bg-[#fcfaf7] p-4 sm:rounded-[1.55rem] sm:p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                {supportingParagraphLabels?.[index] ?? DEFAULT_SUPPORTING_LABELS[index] ?? 'What else matters'}
              </p>
              <p className="mt-4 text-[0.96rem] leading-7 text-neutral-700 sm:text-[1rem] sm:leading-8">{paragraph}</p>
            </div>
          ))}

          {callout ? (
            <div className="rounded-[1.35rem] border border-[rgba(232,154,174,0.26)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:rounded-[1.55rem] sm:p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                {callout.title?.trim() || 'Start with the routine'}
              </p>
              <p className="mt-4 text-[0.96rem] leading-7 text-[var(--color-accent-dark)]/92 sm:text-[1rem] sm:leading-8">{callout.body}</p>
            </div>
          ) : null}
        </div>
      </div>

      {summaryCards.length > 0 ? (
        <div className="mt-6 grid gap-2.5 md:grid-cols-3 md:gap-3">
          {summaryCards.map((card) => (
            <div
              key={card.eyebrow}
              className="rounded-[1.2rem] border border-[rgba(196,156,94,0.14)] bg-[rgba(255,255,255,0.74)] p-4"
            >
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">{card.eyebrow}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{card.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </MarketingSurface>
  );
}
