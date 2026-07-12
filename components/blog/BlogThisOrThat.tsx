'use client';

import { useState } from 'react';

/**
 * Interactive two-way toggle. Reader taps one of two options and the matching
 * one-line verdict reveals; the other dims. Purely client-side (no API) — it's a
 * self-contained "which one is you?" moment, not a shared tally.
 */
export default function BlogThisOrThat({
  question,
  optionA,
  verdictA,
  optionB,
  verdictB,
}: {
  question: string | null;
  optionA: string;
  verdictA: string;
  optionB: string;
  verdictB: string;
}) {
  const [picked, setPicked] = useState<'a' | 'b' | null>(null);

  const options: Array<{ key: 'a' | 'b'; label: string; verdict: string }> = [
    { key: 'a', label: optionA, verdict: verdictA },
    { key: 'b', label: optionB, verdict: verdictB },
  ];

  return (
    <figure className="tmbc-tot not-prose">
      <figcaption className="tmbc-tot__eyebrow">this or that</figcaption>
      {question ? <p className="tmbc-tot__question">{question}</p> : null}

      <div className="tmbc-tot__options">
        {options.map((opt) => {
          const isPicked = picked === opt.key;
          const isDimmed = picked != null && !isPicked;
          return (
            <button
              key={opt.key}
              type="button"
              className={`tmbc-tot__option${isPicked ? ' is-picked' : ''}${isDimmed ? ' is-dimmed' : ''}`}
              aria-pressed={isPicked}
              onClick={() => setPicked(opt.key)}
            >
              <span className="tmbc-tot__option-label">{opt.label}</span>
              {isPicked ? <span className="tmbc-tot__verdict">{opt.verdict}</span> : null}
            </button>
          );
        })}
      </div>

      <p className="tmbc-tot__footer">
        {picked ? 'tap the other to compare' : 'tap the one that sounds like you'}
      </p>
    </figure>
  );
}
