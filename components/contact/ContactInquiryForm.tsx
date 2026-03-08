'use client';

import { FormEvent, useMemo, useState } from 'react';

type ContactInquiryFormProps = {
  selectedService?: string;
  selectedServiceLabel?: string | null;
  selectedFields: readonly string[];
  dueDateRequired: boolean;
};

type SubmitState =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const inputClassName =
  'w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]';

const labelClassName = 'block text-sm font-medium text-neutral-900';

export default function ContactInquiryForm({
  selectedService,
  selectedServiceLabel,
  selectedFields,
  dueDateRequired,
}: ContactInquiryFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ type: 'idle' });

  const hasField = useMemo(
    () => (field: string) => selectedFields.includes(field),
    [selectedFields],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('referrer', document.referrer);
    formData.set('sourceUrl', window.location.href);

    setSubmitState({ type: 'submitting' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; inquiryId?: number }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'Something went wrong. Please try again.');
      }

      form.reset();

      setSubmitState({
        type: 'success',
        message: 'Thank you. Your inquiry has been received.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitState({ type: 'error', message });
    }
  };

  return (
    <>
      {selectedServiceLabel && (
        <div className="inline-block px-4 py-1 text-xs uppercase tracking-wide bg-[var(--color-blush)]/10 text-[var(--color-blush)] rounded-full">
          Selected Service: {selectedServiceLabel}
        </div>
      )}

      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        {selectedService && <input type="hidden" name="service" value={selectedService} />}
        <input type="hidden" name="company" value="" tabIndex={-1} autoComplete="off" />

        <div className="space-y-2">
          <label htmlFor="fullName" className={labelClassName}>
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className={labelClassName}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className={labelClassName}>
            Due Date {dueDateRequired ? '*' : '(Optional)'}
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className={inputClassName}
            required={dueDateRequired}
          />
        </div>

        {hasField('registryLink') && (
          <div className="space-y-2">
            <label htmlFor="registryLink" className={labelClassName}>
              Registry URL
            </label>
            <input
              id="registryLink"
              name="registryLink"
              type="url"
              placeholder="https://"
              className={inputClassName}
            />
          </div>
        )}

        {hasField('homeType') && (
          <div className="space-y-2">
            <label htmlFor="homeType" className={labelClassName}>
              Home Type
            </label>
            <select
              id="homeType"
              name="homeType"
              className={inputClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="apartment">Apartment</option>
              <option value="city-living">City Living</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {hasField('budgetRange') && (
          <div className="space-y-2">
            <label htmlFor="budgetRange" className={labelClassName}>
              Budget Range
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              className={inputClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="private-discussion">Prefer to discuss privately</option>
              <option value="conscious-flexible">Conscious but flexible</option>
              <option value="investment-focused">Investment-focused</option>
            </select>
          </div>
        )}

        {hasField('biggestStress') && (
          <div className="space-y-2">
            <label htmlFor="biggestStress" className={labelClassName}>
              What feels most overwhelming right now?
            </label>
            <textarea
              id="biggestStress"
              name="biggestStress"
              rows={4}
              className={inputClassName}
            />
          </div>
        )}

        {hasField('location') && (
          <div className="space-y-2">
            <label htmlFor="location" className={labelClassName}>
              City + State
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className={inputClassName}
              placeholder="Scottsdale, AZ"
            />
          </div>
        )}

        {hasField('levelOfSupport') && (
          <div className="space-y-2">
            <label htmlFor="levelOfSupport" className={labelClassName}>
              Preferred Level of Support
            </label>
            <select
              id="levelOfSupport"
              name="levelOfSupport"
              className={inputClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="strategic-guidance">Strategic guidance</option>
              <option value="nursery-planning">Nursery planning</option>
              <option value="full-purchasing-oversight">Full purchasing oversight</option>
              <option value="ongoing-concierge">Ongoing planning support</option>
            </select>
          </div>
        )}

        {hasField('timeline') && (
          <div className="space-y-2">
            <label htmlFor="timeline" className={labelClassName}>
              When are you hoping to begin?
            </label>
            <textarea
              id="timeline"
              name="timeline"
              rows={4}
              className={inputClassName}
            />
          </div>
        )}

        {hasField('topConcerns') && (
          <div className="space-y-2">
            <label htmlFor="topConcerns" className={labelClassName}>
              What are your top concerns?
            </label>
            <textarea
              id="topConcerns"
              name="topConcerns"
              rows={4}
              className={inputClassName}
            />
          </div>
        )}

        {!selectedServiceLabel && (
          <div className="space-y-2">
            <label htmlFor="notes" className={labelClassName}>
              How can I support you?
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className={inputClassName}
            />
          </div>
        )}

        <button
          className="btn btn--primary w-full disabled:opacity-70"
          type="submit"
          disabled={submitState.type === 'submitting'}
        >
          {submitState.type === 'submitting' ? 'Sending Inquiry...' : 'Submit Inquiry'}
        </button>

        <p className="text-sm text-neutral-600 text-center">
          I personally review every inquiry and respond within 24 hours.
        </p>

        {(submitState.type === 'success' || submitState.type === 'error') && (
          <p
            className={`text-sm text-center ${
              submitState.type === 'error' ? 'text-red-600' : 'text-neutral-700'
            }`}
            aria-live="polite"
          >
            {submitState.message}
          </p>
        )}
      </form>
    </>
  );
}
