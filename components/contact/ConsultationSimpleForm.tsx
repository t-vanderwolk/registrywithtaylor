'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import MotionCtaContent from '@/components/ui/MotionCtaContent';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function ConsultationSimpleForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState('submitting');
    setFieldErrors({});

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/consultation-request', {
        method: 'POST',
        headers: { 'x-tmbc-form-mode': 'async' },
        body: data,
      });

      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (res.ok && json.success) {
        setSubmitState('success');
      } else {
        setFieldErrors(json.fieldErrors ?? {});
        setErrorMessage(json.error ?? 'Something went wrong. Please try again.');
        setSubmitState('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setSubmitState('error');
    }
  }

  if (submitState === 'success') {
    return (
      <div className="space-y-4 py-4 text-center">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
          Request received
        </p>
        <h3 className="font-serif text-[1.8rem] leading-[1.05] tracking-[-0.03em] text-neutral-900">
          Check your inbox.
        </h3>
        <p className="mx-auto max-w-md text-[0.97rem] leading-7 text-neutral-600">
          I've sent you an email with your intake form. Fill it out when you're ready — it helps me come to our call fully prepared.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-neutral-900 placeholder:text-neutral-400 transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)]/20';
  const inputOk = `${inputClass} border-[rgba(0,0,0,0.1)] focus:border-[var(--color-accent-dark)]`;
  const inputErr = `${inputClass} border-red-300 focus:border-red-400`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input type="text" name="company" className="hidden" aria-hidden tabIndex={-1} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="si-name" className="block text-[0.72rem] uppercase tracking-[0.18em] text-neutral-500">
            Full name
          </label>
          <input
            id="si-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldErrors.name ? inputErr : inputOk}
          />
          {fieldErrors.name && (
            <p className="text-[0.78rem] text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="si-email" className="block text-[0.72rem] uppercase tracking-[0.18em] text-neutral-500">
            Email
          </label>
          <input
            id="si-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={fieldErrors.email ? inputErr : inputOk}
          />
          {fieldErrors.email && (
            <p className="text-[0.78rem] text-red-500">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="si-phone" className="block text-[0.72rem] uppercase tracking-[0.18em] text-neutral-500">
          Phone{' '}
          <span className="normal-case tracking-normal text-neutral-400">(optional)</span>
        </label>
        <input
          id="si-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 000-0000"
          className={inputOk}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="si-goals" className="block text-[0.72rem] uppercase tracking-[0.18em] text-neutral-500">
          What's on your mind?{' '}
          <span className="normal-case tracking-normal text-neutral-400">(optional)</span>
        </label>
        <textarea
          id="si-goals"
          name="sessionGoals"
          rows={3}
          placeholder="Registry strategy, stroller choices, nursery setup — whatever feels most urgent right now."
          className={`${inputOk} resize-none`}
        />
      </div>

      {submitState === 'error' && !Object.keys(fieldErrors).length && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className="btn btn--primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        <MotionCtaContent>
          {submitState === 'submitting' ? 'Sending…' : 'Request a Free Consultation'}
        </MotionCtaContent>
      </button>

      <p className="text-center text-[0.8rem] text-neutral-400">
        No commitment. I'll follow up personally within 24 hours.
      </p>
    </form>
  );
}
