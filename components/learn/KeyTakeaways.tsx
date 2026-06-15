'use client';

import { useState } from 'react';

type KeyTakeawaysProps = {
  items: string[];
  title?: string;
};

export default function KeyTakeaways({
  items,
  title = 'What to carry with you from this lesson',
}: KeyTakeawaysProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const allChecked = checked.size === items.length;

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
          {/* Live checked count */}
          <span className="ml-auto text-[0.7rem] tabular-nums text-[var(--color-gold-soft)]/60">
            {checked.size}/{items.length} noted
          </span>
        </div>
        <h3 className="mt-3 font-serif text-[1.25rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.45rem]">
          {title}
        </h3>
        <p className="mt-1.5 text-[0.78rem] text-neutral-400">Tap each point to mark it.</p>
      </div>

      {/* Checkable items */}
      <div className="bg-white px-4 py-5 sm:px-6 sm:py-6">
        <ul className="space-y-1.5">
          {items.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={isChecked}
                  className={[
                    'group flex w-full items-start gap-4 rounded-[0.9rem] px-4 py-3.5 text-left transition-all duration-200',
                    isChecked
                      ? 'bg-[rgba(196,156,94,0.08)]'
                      : 'hover:bg-[rgba(196,156,94,0.04)]',
                  ].join(' ')}
                >
                  {/* Custom checkbox */}
                  <span
                    aria-hidden="true"
                    className={[
                      'mt-[0.28rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                      isChecked
                        ? 'border-[var(--color-gold-soft)] bg-[var(--color-gold-soft)]'
                        : 'border-[rgba(196,156,94,0.35)] group-hover:border-[rgba(196,156,94,0.6)]',
                    ].join(' ')}
                  >
                    {isChecked && (
                      <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5" aria-hidden>
                        <path
                          d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={[
                      'text-[0.97rem] leading-[1.8] transition-colors duration-200',
                      isChecked ? 'text-neutral-400' : 'text-neutral-700',
                    ].join(' ')}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* All-checked celebration message */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: allChecked ? '1fr' : '0fr',
            transition: 'grid-template-rows 360ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <p className="mt-4 rounded-[0.9rem] bg-[rgba(196,156,94,0.1)] px-4 py-3.5 text-[0.88rem] font-medium text-[#8a6830]">
              You&apos;ve got all {items.length} — you&apos;re ready to move on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
