type KeyTakeawaysProps = {
  items: string[];
  title?: string;
};

export default function KeyTakeaways({
  items,
  title = 'What to carry with you from this lesson',
}: KeyTakeawaysProps) {
  return (
    <div className="overflow-hidden rounded-[1.45rem] border border-[rgba(196,156,94,0.22)] shadow-[0_12px_32px_rgba(72,49,56,0.07)]">
      {/* Header band */}
      <div className="bg-[linear-gradient(135deg,rgba(252,248,242,1)_0%,rgba(255,254,250,1)_100%)] px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(196,156,94,0.18)]"
          >
            <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden>
              <path
                d="M2 6.5l2.5 2.5 5.5-5.5"
                stroke="var(--color-gold-soft)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
            Key Takeaways
          </p>
        </div>
        <h3 className="mt-3 font-serif text-[1.25rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.45rem]">
          {title}
        </h3>
      </div>

      {/* Items */}
      <div className="bg-white px-6 py-6 sm:px-8 sm:py-7">
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-[0.28rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(196,156,94,0.14)]"
              >
                <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5" aria-hidden>
                  <path
                    d="M1.5 5.5l2.5 2.5 4.5-4.5"
                    stroke="var(--color-gold-soft)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[0.97rem] leading-[1.8] text-neutral-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
