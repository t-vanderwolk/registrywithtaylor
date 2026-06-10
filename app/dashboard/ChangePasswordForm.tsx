'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [status,   setStatus]   = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (next !== confirm) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    if (next.length < 8) {
      setErrorMsg('New password must be at least 8 characters.');
      return;
    }

    setStatus('saving');
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setStatus('ok');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  return (
    <section className="mt-10 rounded-[1.5rem] border border-[rgba(215,161,175,0.2)] bg-white/70 px-5 py-6 sm:px-6">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/65">
        Account
      </p>
      <h2 className="mt-1 font-serif text-[1.2rem] leading-snug tracking-[-0.02em] text-neutral-800">
        Change password
      </h2>
      <p className="mt-1.5 text-[0.88rem] leading-[1.75] text-neutral-500">
        Choose a strong password you&apos;ll remember.
      </p>

      {status === 'ok' ? (
        <p className="mt-4 text-[0.88rem] font-medium text-green-700">
          ✓ Password updated successfully.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:max-w-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="cp-current" className="text-[0.8rem] font-medium text-neutral-600">
              Current password
            </label>
            <input
              id="cp-current"
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="rounded-[0.75rem] border border-[rgba(215,161,175,0.35)] bg-white px-3.5 py-2.5 text-[0.88rem] text-neutral-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cp-new" className="text-[0.8rem] font-medium text-neutral-600">
              New password
            </label>
            <input
              id="cp-new"
              type="password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="rounded-[0.75rem] border border-[rgba(215,161,175,0.35)] bg-white px-3.5 py-2.5 text-[0.88rem] text-neutral-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cp-confirm" className="text-[0.8rem] font-medium text-neutral-600">
              Confirm new password
            </label>
            <input
              id="cp-confirm"
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-[0.75rem] border border-[rgba(215,161,175,0.35)] bg-white px-3.5 py-2.5 text-[0.88rem] text-neutral-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          {errorMsg && (
            <p className="text-[0.82rem] text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'saving'}
            className="mt-1 self-start rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving…' : 'Update password'}
          </button>
        </form>
      )}
    </section>
  );
}
