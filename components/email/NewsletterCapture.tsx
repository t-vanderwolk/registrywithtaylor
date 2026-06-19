'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function NewsletterCapture() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState('submitting');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (data.success) {
        setSubmitState('success');
      } else {
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setSubmitState('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setSubmitState('error');
    }
  };

  if (submitState === 'success') {
    return (
      <div className="rounded-[1.35rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(250,242,239,0.98)_100%)] px-6 py-10 text-center shadow-[0_16px_34px_rgba(57,39,45,0.06)]">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          You're in
        </p>
        <h2 className="mt-4 font-serif text-[1.8rem] leading-[1.05] tracking-[-0.03em] text-neutral-900">
          Check your inbox.
        </h2>
        <p className="mx-auto mt-4 max-w-[36rem] text-[0.98rem] leading-8 text-neutral-700">
          The Baby Prep Starter Guide is on its way. It's a calm starting point — not another overwhelming list.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.35rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(250,242,239,0.98)_100%)] px-6 py-10 shadow-[0_16px_34px_rgba(57,39,45,0.06)] sm:px-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
          Free resource
        </p>
        <h2 className="mt-4 font-serif text-[1.8rem] leading-[1.05] tracking-[-0.03em] text-neutral-900">
          Get the Free Baby Prep Starter Guide
        </h2>
        <p className="mx-auto mt-4 max-w-[36rem] text-[0.98rem] leading-8 text-neutral-700">
          A calm starting point for registry, gear, and nursery decisions — delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-0">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full rounded-full border border-[rgba(215,161,175,0.28)] bg-white px-5 py-3 text-[0.98rem] text-neutral-900 shadow-[0_4px_12px_rgba(57,39,45,0.04)] transition focus:border-[rgba(184,116,138,0.5)] focus:outline-none focus:ring-2 focus:ring-[rgba(232,154,174,0.2)] sm:rounded-r-none sm:rounded-l-full"
          />
          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className="shrink-0 rounded-full bg-[var(--color-cta-pink)] px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-l-none sm:rounded-r-full"
          >
            {submitState === 'submitting' ? 'Sending…' : 'Send It'}
          </button>
        </form>

        {submitState === 'error' ? (
          <p className="mt-4 text-sm leading-7 text-rose-700">{errorMessage}</p>
        ) : (
          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.14em] text-black/40">
            No spam. Unsubscribe anytime.
          </p>
        )}
      </div>
    </div>
  );
}
