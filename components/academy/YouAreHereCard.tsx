import Link from 'next/link';

type JourneyItem = {
  title: string;
  href?: string;
};

type YouAreHereCardProps = {
  trail: JourneyItem[];
  progressLabel: string;
  currentTitle: string;
  currentStepLabel: string;
  completedSteps?: JourneyItem[];
  nextStep?: JourneyItem | null;
  className?: string;
};

function CheckMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M3.5 8.2l2.6 2.6 6.2-6.1" />
    </svg>
  );
}

function renderTrailItem(item: JourneyItem, index: number, total: number) {
  const content = item.href ? (
    <Link href={item.href} className="transition duration-200 hover:text-[#8F4C62]">
      {item.title}
    </Link>
  ) : (
    <span className="text-[#8F4C62]">{item.title}</span>
  );

  return (
    <li key={`${item.title}-${index}`} className="inline-flex items-center gap-2">
      {content}
      {index < total - 1 ? <span aria-hidden="true" className="text-[rgba(161,91,114,0.35)]">/</span> : null}
    </li>
  );
}

export default function YouAreHereCard({
  trail,
  progressLabel,
  currentTitle,
  currentStepLabel,
  completedSteps = [],
  nextStep = null,
  className = '',
}: YouAreHereCardProps) {
  const visibleCompletedSteps = completedSteps.slice(-3);

  return (
    <section
      className={[
        'rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-5 py-5 shadow-[0_18px_42px_rgba(58,36,43,0.07)] sm:px-6 sm:py-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">You are here</p>
            <ol className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#A15B72] sm:text-[0.72rem] sm:tracking-[0.22em]">
              {trail.map((item, index) => renderTrailItem(item, index, trail.length))}
            </ol>
          </div>
          <p className="text-sm leading-6 text-[#7B5A68]">{progressLabel}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[1.35rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.84)] px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Completed</p>
            {visibleCompletedSteps.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {visibleCompletedSteps.map((step) => (
                  <li key={step.title} className="flex items-start gap-3 text-[0.98rem] leading-7 text-[#5B4B55]">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(216,137,160,0.14)] text-[#8F4C62]">
                      <CheckMark />
                    </span>
                    <span>{step.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55]">
                This is the first layer. You do not need the whole path solved before you begin.
              </p>
            )}
          </div>

          <div className="rounded-[1.35rem] border border-[rgba(161,91,114,0.18)] bg-white px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Current step</p>
            <h2 className="mt-3 font-serif text-[1.4rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
              {currentTitle}
            </h2>
            <p className="mt-3 text-[0.95rem] leading-7 text-[#5B4B55]">{currentStepLabel}</p>
          </div>

          <div className="rounded-[1.35rem] border border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,rgba(255,252,252,0.98)_0%,rgba(249,239,243,0.94)_100%)] px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Next step</p>
            {nextStep ? (
              <>
                <p className="mt-3 font-serif text-[1.25rem] leading-[1.08] tracking-[-0.03em] text-[#2F2430]">
                  {nextStep.title}
                </p>
                {nextStep.href ? (
                  <Link
                    href={nextStep.href}
                    className="mt-4 inline-flex min-h-[42px] items-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-[#4B3641] transition duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    Keep going
                  </Link>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55]">
                You have completed this layer. Let the next decision stay small on purpose.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
