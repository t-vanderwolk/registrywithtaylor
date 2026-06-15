'use client';

import { useEffect, useState } from 'react';

type Props = {
  pathSlug: string;
  moduleSlug: string;
};

export default function MarkCompleteButton({ pathSlug, moduleSlug }: Props) {
  const storageKey = `tmbc_complete_${pathSlug}_${moduleSlug}`;
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Restore persisted completion state
  useEffect(() => {
    try {
      setComplete(localStorage.getItem(storageKey) === '1');
    } catch {
      // localStorage unavailable in SSR / private browsing — ignore
    }
  }, [storageKey]);

  const handleClick = async () => {
    if (complete || loading) return;
    setLoading(true);
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathSlug, moduleSlug }),
      });
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        // ignore
      }
      setComplete(true);
    } catch {
      // Non-critical — swallow silently
    } finally {
      setLoading(false);
    }
  };

  if (complete) {
    return (
      <div className="flex flex-col items-center gap-2.5 py-2">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(232,154,174,0.12)] px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
          {/* Filled checkmark circle */}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)]">
            <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5" aria-hidden>
              <path
                d="M1.5 5l2.5 2.5 4.5-4.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Module complete
        </div>
        <p className="text-[0.78rem] text-neutral-400">
          Progress saved — keep going when you&apos;re ready.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex min-h-[48px] items-center gap-3 rounded-full border border-[rgba(215,161,175,0.35)] bg-white px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)] shadow-[0_6px_18px_rgba(72,49,56,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(215,161,175,0.52)] hover:shadow-[0_10px_28px_rgba(72,49,56,0.1)] disabled:cursor-wait disabled:opacity-60"
      >
        {/* Empty circle indicator */}
        <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[rgba(215,161,175,0.5)]" />
        {loading ? 'Saving…' : 'Mark this module complete'}
      </button>
    </div>
  );
}
