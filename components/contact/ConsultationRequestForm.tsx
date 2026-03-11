'use client';

import { useRef } from 'react';
import type { FocusEvent, FormEvent } from 'react';
import { trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';

type ConsultationRequestFormProps = {
  errorCode?: string | null;
  returnPath?: string;
  successPath?: string;
  submitLabel?: string;
};

const inputClassName =
  'w-full rounded-md border border-neutral-300 px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]';
const labelClassName = 'block text-sm font-medium text-neutral-900';

const ERROR_MESSAGES: Record<string, string> = {
  'invalid-form': 'Please try submitting the form again.',
  'invalid-email': 'Please enter a valid email address.',
  'invalid-date': 'Please enter a valid due date.',
  'rate-limit': 'Too many requests were submitted. Please try again shortly.',
  required: 'Name and email are required.',
};

export function getConsultationRequestErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return null;
  }

  return ERROR_MESSAGES[errorCode] ?? 'Please try submitting the form again.';
}

export default function ConsultationRequestForm({
  errorCode,
  returnPath = '/consultation',
  successPath = '/consultation/confirmation',
  submitLabel = 'Book a Consultation',
}: ConsultationRequestFormProps) {
  const error = getConsultationRequestErrorMessage(errorCode);
  const formStartedRef = useRef(false);

  const handleFocusCapture = (_event: FocusEvent<HTMLFormElement>) => {
    if (formStartedRef.current) {
      return;
    }

    formStartedRef.current = true;
    trackEvent(AnalyticsEvents.CONSULTATION_STARTED, {
      page: window.location.pathname,
      form: 'consultation_request',
    });
  };

  const handleSubmit = (_event: FormEvent<HTMLFormElement>) => {
    trackEvent(AnalyticsEvents.CONSULTATION_SUBMITTED, {
      page: window.location.pathname,
      form: 'consultation_request',
    });
  };

  return (
    <form
      action="/api/consultation-request"
      method="post"
      className="space-y-6"
      data-booking-context="consultation_request"
      onFocusCapture={handleFocusCapture}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="company" value="" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="returnPath" value={returnPath} />
      <input type="hidden" name="successPath" value={successPath} />

      <div className="space-y-2">
        <label htmlFor="consultation-name" className={labelClassName}>
          Name *
        </label>
        <input id="consultation-name" name="name" type="text" className={inputClassName} required />
      </div>

      <div className="space-y-2">
        <label htmlFor="consultation-email" className={labelClassName}>
          Email *
        </label>
        <input
          id="consultation-email"
          name="email"
          type="email"
          className={inputClassName}
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="consultation-due-date" className={labelClassName}>
            Due Date
          </label>
          <input
            id="consultation-due-date"
            name="dueDate"
            type="date"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="consultation-city" className={labelClassName}>
            City
          </label>
          <input
            id="consultation-city"
            name="city"
            type="text"
            className={inputClassName}
            placeholder="New York, NY"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="consultation-baby-number" className={labelClassName}>
          First baby / second baby / third+
        </label>
        <select id="consultation-baby-number" name="babyNumber" className={inputClassName} defaultValue="">
          <option value="">Select one</option>
          <option value="first baby">First baby</option>
          <option value="second baby">Second baby</option>
          <option value="third+">Third+</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="consultation-message" className={labelClassName}>
          Short message
        </label>
        <textarea
          id="consultation-message"
          name="message"
          rows={4}
          className={inputClassName}
          placeholder="Share what you want help with most."
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button className="btn btn--primary w-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
