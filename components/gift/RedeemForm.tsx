'use client';

import { useState, type FormEvent } from 'react';

const inputClass =
  'w-full rounded-[0.9rem] border border-[rgba(215,161,175,0.34)] bg-white px-4 py-3 text-center font-mono text-[1.1rem] tracking-[0.12em] text-neutral-800 outline-none transition focus:border-[var(--color-cta-pink)] focus:ring-2 focus:ring-[rgba(216,137,160,0.25)]';

export default function RedeemForm({ initialCode = '' }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ recipientName?: string; bookingUrl: string } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mode: 'redeem' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.bookingUrl) {
        setError(data?.error || "We couldn't redeem that code. Please try again.");
        setSubmitting(false);
        return;
      }
      setResult({ recipientName: data.recipientName, bookingUrl: data.bookingUrl });
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(216,137,160,0.14)] text-xl">✓</div>
        <h2 className="font-serif text-[1.5rem] leading-tight text-neutral-900">
          {result.recipientName ? `You're all set, ${result.recipientName}!` : "You're all set!"}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-7 text-neutral-600">
          Your session is prepaid. Pick a time below — no payment needed at booking.
        </p>
        <a
          href={result.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-7 py-3.5 text-[1rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)]"
        >
          Book your session →
        </a>
        <p className="mt-4 text-[0.78rem] leading-6 text-neutral-400">
          Save this link — if you need to step away, you can finish booking later.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="code" className="mb-1.5 block text-center text-[0.8rem] font-semibold text-neutral-700">
          Enter your gift code
        </label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="TMBC-XXXXXX"
          autoCapitalize="characters"
          className={inputClass}
        />
      </div>
      {error ? (
        <p className="rounded-[0.8rem] bg-[rgba(216,137,160,0.1)] px-4 py-3 text-center text-[0.85rem] text-[var(--color-accent-dark)]">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting || !code.trim()}
        className="w-full rounded-full bg-[var(--color-cta-pink)] px-6 py-3.5 text-[1rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Checking…' : 'Redeem & book my session'}
      </button>
    </form>
  );
}
