'use client';

import Link from 'next/link';
import { useState } from 'react';

const paths = [
  { label: 'Registry', modules: 8, description: 'Build the right list, in the right order' },
  { label: 'Nursery', modules: 6, description: 'Design a room that works at 2am' },
  { label: 'Gear', modules: 9, description: "Choose what fits your life, not anyone else's" },
  { label: 'Postpartum', modules: 6, description: 'Prepare the adult side of early parenthood' },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/learn/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(232,154,174,0.14) 0%, transparent 52%), radial-gradient(circle at bottom left, rgba(243,216,196,0.22) 0%, transparent 48%), linear-gradient(180deg, #fffdfb 0%, #fdf5f0 50%, #fef2f5 100%)',
      }}
    >
      {/* Minimal nav */}
      <header className="px-5 py-5 sm:px-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)] transition-opacity hover:opacity-70"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Taylor-Made Baby Academy
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">

          {/* ─── Left: copy ──────────────────────────────────────────────── */}
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
              Coming Soon
            </p>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[3.4rem]">
              The full Academy is{' '}
              <span className="italic text-[var(--color-accent-dark)]">almost ready.</span>
            </h1>

            <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-[1.85] text-neutral-600">
              29 modules across four paths — registry, nursery, gear, and postpartum — built to
              make every decision quieter. Join the waitlist and you&apos;ll be the first to know
              when enrollment opens.
            </p>

            {/* Path preview */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {paths.map((path) => (
                <div
                  key={path.label}
                  className="rounded-[1.15rem] border border-[rgba(215,161,175,0.2)] bg-white/80 px-5 py-4 shadow-[0_6px_18px_rgba(72,49,56,0.04)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
                      {path.label}
                    </p>
                    <span className="text-[0.68rem] text-neutral-400">{path.modules} modules</span>
                  </div>
                  <p className="mt-1.5 text-[0.88rem] leading-relaxed text-neutral-600">
                    {path.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Free lessons note */}
            <p className="mt-8 text-[0.88rem] leading-relaxed text-neutral-500">
              Three complete lessons are free right now — no signup needed.{' '}
              <Link
                href="/learn#preview-lessons"
                className="font-medium text-[var(--color-accent-dark)] underline underline-offset-2"
              >
                Start with a free lesson →
              </Link>
            </p>
          </div>

          {/* ─── Right: form ─────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.28)] bg-white shadow-[0_24px_64px_rgba(72,49,56,0.09)]">

              {status === 'success' ? (
                <div className="px-8 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,154,174,0.14)]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[var(--color-accent-dark)]" aria-hidden="true">
                      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="mt-5 font-serif text-[1.6rem] leading-tight tracking-[-0.03em] text-neutral-900">
                    You&apos;re on the list.
                  </h2>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-neutral-600">
                    We&apos;ll email you as soon as enrollment opens. In the meantime, the free
                    preview lessons are ready whenever you are.
                  </p>
                  <div className="mt-7 flex flex-col gap-3">
                    <Link
                      href="/learn/art-of-the-registry"
                      className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[var(--color-accent-dark)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(212,123,145,0.28)] transition-all hover:bg-[#c76b82]"
                    >
                      Start Free Lesson 1
                    </Link>
                    <Link
                      href="/learn"
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[rgba(215,161,175,0.3)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-all hover:border-[rgba(215,161,175,0.5)]"
                    >
                      Back to Academy
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b border-[rgba(0,0,0,0.06)] bg-[rgba(232,154,174,0.05)] px-7 py-6 sm:px-8">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]">
                      Join the Waitlist
                    </p>
                    <p className="mt-2 font-serif text-[1.35rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.5rem]">
                      Be the first to enroll when the Academy opens.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5 px-7 py-7 sm:px-8 sm:py-8">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="waitlist-name"
                        className="block text-[0.82rem] font-medium text-neutral-700"
                      >
                        First name
                        <span className="ml-1.5 text-[0.75rem] font-normal text-neutral-400">Optional</span>
                      </label>
                      <input
                        id="waitlist-name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Taylor"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-[0.9rem] border border-[rgba(47,36,48,0.1)] bg-white px-4 py-3 text-[0.96rem] text-neutral-800 placeholder-neutral-300 transition-all focus:border-[rgba(216,137,160,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.18)]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="waitlist-email"
                        className="block text-[0.82rem] font-medium text-neutral-700"
                      >
                        Email address
                        <span className="ml-1.5 text-[0.75rem] font-normal text-[var(--color-accent-dark)]">Required</span>
                      </label>
                      <input
                        id="waitlist-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-[0.9rem] border border-[rgba(47,36,48,0.1)] bg-white px-4 py-3 text-[0.96rem] text-neutral-800 placeholder-neutral-300 transition-all focus:border-[rgba(216,137,160,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.18)]"
                      />
                    </div>

                    {/* Error */}
                    {status === 'error' && (
                      <p className="rounded-[0.75rem] bg-red-50 px-4 py-3 text-[0.85rem] text-red-600">
                        {errorMessage}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--color-accent-dark)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(212,123,145,0.28)] transition-all hover:bg-[#c76b82] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === 'submitting' ? 'Joining…' : 'Join the Waitlist'}
                    </button>

                    <p className="text-center text-[0.75rem] leading-relaxed text-neutral-400">
                      No spam. Just one email when enrollment opens.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Pricing link */}
            <p className="mt-5 text-center text-[0.82rem] text-neutral-500">
              Curious about pricing?{' '}
              <Link
                href="/learn/pricing"
                className="font-medium text-[var(--color-accent-dark)] underline underline-offset-2"
              >
                See what&apos;s included →
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
