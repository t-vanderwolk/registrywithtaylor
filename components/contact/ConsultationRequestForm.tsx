'use client';

import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent, FormEvent, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getClientPageAnalyticsContext, trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';
import {
  BUDGET_RANGE_OPTIONS,
  CONSULTATION_INTAKE_INITIAL_STATE,
  CONSULT_TYPE_OPTIONS,
  DAY_TO_DAY_OPTIONS,
  FEEDING_PLAN_OPTIONS,
  FIRST_TIME_PARENT_OPTIONS,
  HELP_TOPIC_OPTIONS,
  HOME_TYPE_OPTIONS,
  MEETING_PREFERENCE_OPTIONS,
  PRIORITY_OPTIONS,
  REGISTRY_PLATFORM_OPTIONS,
  REGISTRY_STATUS_OPTIONS,
  STORAGE_SPACE_OPTIONS,
  YES_NO_OPTIONS,
  buildConsultationIntakeSummary,
  getChoiceLabelForValue,
  getChoiceLabelsForValues,
  normalizeConsultationIntakeDraft,
  type ConsultationChoiceOption,
  type ConsultationIntakeState,
} from '@/lib/consultation/intake';

type ConsultationRequestFormProps = {
  returnPath?: string;
  successPath?: string;
  submitLabel?: string;
};

type SubmitState =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'error'; message: string }
  | { type: 'success' };

type StepId =
  | 'basics'
  | 'lifestyle'
  | 'registry'
  | 'priorities'
  | 'goals'
  | 'booking'
  | 'review';

type StepDefinition = {
  id: StepId;
  eyebrow: string;
  title: string;
  description: string;
};

const FORM_DRAFT_KEY = 'tmbc-consultation-intake-v2';

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: 'basics',
    eyebrow: 'Step 1',
    title: "Let's start with you",
    description: 'This helps me tailor the conversation to where you actually are.',
  },
  {
    id: 'lifestyle',
    eyebrow: 'Step 2',
    title: 'Your home and day-to-day',
    description: 'The practical details matter. A lot of gear decisions live or die here.',
  },
  {
    id: 'registry',
    eyebrow: 'Step 3',
    title: 'Registry and gear status',
    description: 'This keeps the session from repeating what you already solved.',
  },
  {
    id: 'priorities',
    eyebrow: 'Step 4',
    title: 'Priorities and preferences',
    description: 'The goal is clarity, not perfection. Give me the values that should guide the recommendations.',
  },
  {
    id: 'goals',
    eyebrow: 'Step 5',
    title: 'What you want from the session',
    description: 'You do not need to know the right words here. A messy answer is completely fine.',
  },
  {
    id: 'booking',
    eyebrow: 'Step 6',
    title: 'Booking details',
    description: 'This helps me follow up with the right session type and a time that actually works.',
  },
  {
    id: 'review',
    eyebrow: 'Step 7',
    title: 'Review before you send',
    description: 'Take one last look so I receive the version that will make your session genuinely useful.',
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  'invalid-form': 'Please try submitting the intake again.',
  'invalid-email': 'Please enter a valid email address.',
  'invalid-date': 'Please enter a valid due date or birthday.',
  'rate-limit': 'Too many requests were submitted. Please try again shortly.',
  required: 'A few important details are still missing.',
};

const FIELD_STEP_MAP: Record<string, StepId> = {
  name: 'basics',
  email: 'basics',
  phone: 'basics',
  dueDate: 'basics',
  parentStage: 'basics',
  homeType: 'lifestyle',
  hasStairs: 'lifestyle',
  dayToDayMode: 'lifestyle',
  storageSpace: 'lifestyle',
  lifestyleNotes: 'lifestyle',
  registryStatus: 'registry',
  registryPlatforms: 'registry',
  hasGear: 'registry',
  ownedGearNotes: 'registry',
  helpTopics: 'registry',
  priorities: 'priorities',
  budgetRange: 'priorities',
  feedingPlans: 'priorities',
  hasPets: 'priorities',
  hasAdditionalCaregivers: 'priorities',
  caregiverNotes: 'priorities',
  sessionGoals: 'goals',
  overwhelmNotes: 'goals',
  meetingPreference: 'booking',
  consultType: 'booking',
  preferredTiming: 'booking',
};

function getConsultationRequestErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return null;
  }

  return ERROR_MESSAGES[errorCode] ?? 'Please try submitting the form again.';
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function getStepIndex(stepId: StepId) {
  return STEP_DEFINITIONS.findIndex((step) => step.id === stepId);
}

function getStepFieldErrors(stepId: StepId, fieldErrors: Record<string, string>) {
  return Object.entries(fieldErrors)
    .filter(([field]) => FIELD_STEP_MAP[field] === stepId)
    .reduce<Record<string, string>>((acc, [field, message]) => {
      acc[field] = message;
      return acc;
    }, {});
}

function buildFieldErrors(state: ConsultationIntakeState) {
  const errors: Record<string, string> = {};

  if (!state.name.trim()) errors.name = 'Full name helps me know who I am planning for.';
  if (!state.email.trim()) errors.email = 'Email gives me a way to follow up directly.';
  if (!state.phone.trim()) errors.phone = 'A phone number keeps scheduling easier.';
  if (!state.dueDate.trim()) errors.dueDate = 'This helps me tailor the session to your timing.';
  if (!state.parentStage) errors.parentStage = 'Tell me where you are in the parenting timeline.';
  if (!state.homeType) errors.homeType = 'This helps narrow what will actually fit your home.';
  if (!state.hasStairs) errors.hasStairs = 'This changes what feels manageable every day.';
  if (!state.dayToDayMode) errors.dayToDayMode = 'Routine matters more than trends here.';
  if (!state.storageSpace) errors.storageSpace = 'Storage limits change a surprising amount.';
  if (!state.registryStatus) errors.registryStatus = 'A quick registry status check keeps the session practical.';
  if (state.registryStatus !== 'no' && state.registryPlatforms.length === 0) {
    errors.registryPlatforms = 'If you have a registry started, tell me where it lives.';
  }
  if (!state.hasGear) errors.hasGear = 'This keeps me from recommending what is already handled.';
  if (state.helpTopics.length === 0) errors.helpTopics = 'Pick at least one area you want help with.';
  if (state.priorities.length === 0) errors.priorities = 'Choose at least one priority so I know what to optimize for.';
  if (!state.budgetRange) errors.budgetRange = 'Budget context keeps the recommendations grounded.';
  if (!state.hasPets) errors.hasPets = 'This helps with fabrics, floors, and daily reality.';
  if (!state.hasAdditionalCaregivers) {
    errors.hasAdditionalCaregivers = 'Let me know whether more than one adult will be using the gear.';
  }
  if (!state.consultType) errors.consultType = 'Pick the support format that feels closest to what you need.';
  if (!state.meetingPreference) errors.meetingPreference = 'Tell me how you would prefer to meet.';

  return errors;
}

function FieldShell({
  label,
  htmlFor,
  error,
  optional,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-900">
          {label}
        </label>
        {optional ? <span className="text-[0.72rem] uppercase tracking-[0.14em] text-neutral-400">Optional</span> : null}
      </div>
      {children}
      {hint ? <p className="text-sm leading-6 text-neutral-500">{hint}</p> : null}
      {error ? <p className="text-sm leading-6 text-rose-700">{error}</p> : null}
    </div>
  );
}

function TextInputField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  autoComplete,
  optional,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
  optional?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <FieldShell label={label} htmlFor={id} error={error} optional={optional}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={cx(
          'w-full rounded-[1.15rem] border bg-white px-4 py-3.5 text-base text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.28)] sm:text-[0.98rem]',
          error ? 'border-rose-300 bg-rose-50/40' : 'border-[rgba(47,36,48,0.12)]',
        )}
      />
    </FieldShell>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  error,
  optional,
  rows = 4,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <FieldShell label={label} htmlFor={id} error={error} optional={optional} hint={hint}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          'w-full rounded-[1.15rem] border bg-white px-4 py-3.5 text-base leading-7 text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.28)] sm:text-[0.98rem]',
          error ? 'border-rose-300 bg-rose-50/40' : 'border-[rgba(47,36,48,0.12)]',
        )}
      />
    </FieldShell>
  );
}

function ChoiceCardGroup({
  label,
  options,
  value,
  onChange,
  error,
  columns = 'sm:grid-cols-2',
}: {
  label: string;
  options: ConsultationChoiceOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  columns?: string;
}) {
  return (
    <FieldShell label={label} error={error}>
      <div className={cx('grid gap-3', columns)}>
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cx(
                'min-h-[64px] rounded-[1.2rem] border px-4 py-4 text-left transition duration-200',
                isActive
                  ? 'border-[rgba(216,137,160,0.44)] bg-[linear-gradient(180deg,#fff7f8_0%,#fceef2_100%)] shadow-[0_16px_30px_rgba(216,137,160,0.12)]'
                  : 'border-[rgba(47,36,48,0.1)] bg-white hover:border-[rgba(216,137,160,0.3)] hover:bg-[#fffaf8]',
              )}
              aria-pressed={isActive}
            >
              <p className="text-sm font-medium text-neutral-900">{option.label}</p>
              {option.description ? <p className="mt-1 text-sm leading-6 text-neutral-500">{option.description}</p> : null}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

function MultiChoiceGroup({
  label,
  options,
  values,
  onToggle,
  error,
}: {
  label: string;
  options: ConsultationChoiceOption[];
  values: string[];
  onToggle: (value: string) => void;
  error?: string;
}) {
  return (
    <FieldShell label={label} error={error}>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = values.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={cx(
                'min-h-[48px] rounded-full border px-4 py-2.5 text-sm transition duration-200',
                isActive
                  ? 'border-[rgba(216,137,160,0.44)] bg-[rgba(248,226,233,0.92)] text-[var(--color-accent-dark)] shadow-[0_10px_20px_rgba(216,137,160,0.08)]'
                  : 'border-[rgba(47,36,48,0.1)] bg-white text-neutral-700 hover:border-[rgba(216,137,160,0.3)] hover:bg-[#fffaf8]',
              )}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

function ReviewBlock({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdfb_0%,#fff6f7_100%)] p-5">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/76">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[1.3rem] leading-tight text-neutral-900">{title}</h3>
      <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-700">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string | string[] | null | undefined }) {
  const resolvedValue = Array.isArray(value) ? value.filter(Boolean).join(', ') : value;

  return (
    <div className="rounded-[1rem] bg-white/78 px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-400">{label}</p>
      <p className="mt-1 text-sm leading-7 text-neutral-800">{resolvedValue || 'Not shared'}</p>
    </div>
  );
}

export default function ConsultationRequestForm({
  returnPath = '/book',
  successPath = '/consultation/confirmation',
  submitLabel = 'Book a Registry Consult',
}: ConsultationRequestFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const formStartedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const successRedirectTimeoutRef = useRef<number | null>(null);
  const [showStep0, setShowStep0] = useState(true);
  const [step0State, setStep0State] = useState({ firstName: '', email: '', dueDate: '' });
  const [step0Errors, setStep0Errors] = useState<Record<string, string>>({});
  const [step0Submitting, setStep0Submitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formState, setFormState] = useState<ConsultationIntakeState>(CONSULTATION_INTAKE_INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>(
    errorCode ? { type: 'error', message: getConsultationRequestErrorMessage(errorCode) ?? 'Please try again.' } : { type: 'idle' },
  );
  const [hydrated, setHydrated] = useState(false);

  const currentStep = STEP_DEFINITIONS[currentStepIndex] ?? STEP_DEFINITIONS[0];
  const currentStepErrors = getStepFieldErrors(currentStep.id, fieldErrors);
  const progressPercent = ((currentStepIndex + 1) / STEP_DEFINITIONS.length) * 100;
  const intakeSummary = useMemo(() => buildConsultationIntakeSummary(formState), [formState]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const saved = window.localStorage.getItem(FORM_DRAFT_KEY);
      if (saved) {
        setFormState(normalizeConsultationIntakeDraft(JSON.parse(saved)));
      }
    } catch {
      // Ignore local storage parsing failures and fall back to a fresh draft.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(formState));
  }, [formState, hydrated]);

  useEffect(() => {
    return () => {
      if (successRedirectTimeoutRef.current) {
        window.clearTimeout(successRedirectTimeoutRef.current);
      }
    };
  }, []);

  const setFieldValue = <K extends keyof ConsultationIntakeState>(field: K, value: ConsultationIntakeState[K]) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field as string]) {
        return current;
      }

      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const toggleMultiSelect = (field: 'registryPlatforms' | 'helpTopics' | 'priorities' | 'feedingPlans', value: string) => {
    setFormState((current) => {
      const nextValues = current[field].includes(value)
        ? current[field].filter((entry) => entry !== value)
        : [...current[field], value];

      return {
        ...current,
        [field]: nextValues,
      };
    });

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const scrollToTop = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStep0Continue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!step0State.firstName.trim()) errors.firstName = 'First name is required.';
    if (!step0State.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step0State.email)) {
      errors.email = 'A valid email address is required.';
    }
    if (Object.keys(errors).length > 0) {
      setStep0Errors(errors);
      return;
    }
    setStep0Errors({});
    setStep0Submitting(true);
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: step0State.email, firstName: step0State.firstName }),
      });
    } catch {
      // Silently continue — newsletter subscribe failure should not block the intake
    }
    setFormState((current) => ({
      ...current,
      name: step0State.firstName,
      email: step0State.email,
      dueDate: step0State.dueDate || current.dueDate,
    }));
    setStep0Submitting(false);
    setShowStep0(false);
    scrollToTop();
  };

  const validateStep = (stepId: StepId) => {
    const allErrors = buildFieldErrors(formState);
    const nextStepErrors = getStepFieldErrors(stepId, allErrors);
    setFieldErrors((current) => ({ ...current, ...nextStepErrors }));
    return Object.keys(nextStepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep.id)) {
      setSubmitState({
        type: 'error',
        message: 'A few details are still missing. The goal is clarity, not perfection, but I do need the basics.',
      });
      scrollToTop();
      return;
    }

    setSubmitState({ type: 'idle' });
    setCurrentStepIndex((current) => Math.min(current + 1, STEP_DEFINITIONS.length - 1));
    scrollToTop();
  };

  const handleBack = () => {
    setSubmitState({ type: 'idle' });
    setCurrentStepIndex((current) => Math.max(current - 1, 0));
    scrollToTop();
  };

  const handleFocusCapture = (_event: FocusEvent<HTMLFormElement>) => {
    if (formStartedRef.current) {
      return;
    }

    formStartedRef.current = true;
    trackEvent(AnalyticsEvents.CONSULTATION_FORM_OPEN, {
      ...(getClientPageAnalyticsContext() ?? {
        path: window.location.pathname,
        pageType: 'book' as const,
        referrer: null,
        referrerPageType: null,
      }),
      form: 'consultation_request',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const allErrors = buildFieldErrors(formState);
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);

      const firstStepWithError = STEP_DEFINITIONS.find((step) =>
        Object.keys(allErrors).some((field) => FIELD_STEP_MAP[field] === step.id),
      );

      if (firstStepWithError) {
        setCurrentStepIndex(getStepIndex(firstStepWithError.id));
      }

      setSubmitState({
        type: 'error',
        message: 'A few details still need attention before I can use this as a real consult plan.',
      });
      scrollToTop();
      return;
    }

    setSubmitState({ type: 'submitting' });

    const formData = new FormData();
    formData.set('company', '');
    formData.set('returnPath', returnPath);
    formData.set('successPath', successPath);
    formData.set('name', formState.name.trim());
    formData.set('email', formState.email.trim());
    formData.set('phone', formState.phone.trim());
    formData.set('dueDate', formState.dueDate);
    formData.set('parentStage', formState.parentStage);
    formData.set('homeType', formState.homeType);
    formData.set('hasStairs', formState.hasStairs);
    formData.set('dayToDayMode', formState.dayToDayMode);
    formData.set('storageSpace', formState.storageSpace);
    formData.set('lifestyleNotes', formState.lifestyleNotes.trim());
    formData.set('registryStatus', formState.registryStatus);
    formState.registryPlatforms.forEach((value) => formData.append('registryPlatforms', value));
    formData.set('hasGear', formState.hasGear);
    formData.set('ownedGearNotes', formState.ownedGearNotes.trim());
    formState.helpTopics.forEach((value) => formData.append('helpTopics', value));
    formState.priorities.forEach((value) => formData.append('priorities', value));
    formData.set('budgetRange', formState.budgetRange);
    formState.feedingPlans.forEach((value) => formData.append('feedingPlans', value));
    formData.set('hasPets', formState.hasPets);
    formData.set('hasAdditionalCaregivers', formState.hasAdditionalCaregivers);
    formData.set('caregiverNotes', formState.caregiverNotes.trim());
    formData.set('meetingPreference', formState.meetingPreference);
    formData.set('consultType', formState.consultType);
    formData.set('preferredTiming', formState.preferredTiming.trim());
    formData.set('sessionGoals', formState.sessionGoals.trim());
    formData.set('overwhelmNotes', formState.overwhelmNotes.trim());

    try {
      const response = await fetch('/api/consultation-request', {
        method: 'POST',
        body: formData,
        headers: {
          accept: 'application/json',
          'x-tmbc-form-mode': 'async',
        },
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            fieldErrors?: Record<string, string>;
            redirectTo?: string;
          }
        | null;

      if (!response.ok) {
        const nextErrors = payload?.fieldErrors ?? {};
        if (Object.keys(nextErrors).length > 0) {
          setFieldErrors(nextErrors);
          const firstStepWithError = STEP_DEFINITIONS.find((step) =>
            Object.keys(nextErrors).some((field) => FIELD_STEP_MAP[field] === step.id),
          );
          if (firstStepWithError) {
            setCurrentStepIndex(getStepIndex(firstStepWithError.id));
          }
        }

        throw new Error(payload?.error || 'Please try submitting the intake again.');
      }

      trackEvent(AnalyticsEvents.CONSULTATION_SUBMITTED, {
        ...(getClientPageAnalyticsContext() ?? {
          path: window.location.pathname,
          pageType: 'book' as const,
          referrer: null,
          referrerPageType: null,
        }),
        form: 'consultation_request',
      });

      setSubmitState({ type: 'success' });
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(FORM_DRAFT_KEY);
      }
      scrollToTop();

      if (typeof window !== 'undefined') {
        successRedirectTimeoutRef.current = window.setTimeout(() => {
          startTransition(() => {
            router.push(payload?.redirectTo || successPath);
          });
        }, 950);
      } else {
        startTransition(() => {
          router.push(payload?.redirectTo || successPath);
        });
      }
    } catch (error) {
      setSubmitState({
        type: 'error',
        message: error instanceof Error ? error.message : 'Please try submitting the intake again.',
      });
      scrollToTop();
    }
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div className="rounded-[1.3rem] bg-[linear-gradient(180deg,rgba(255,248,249,0.98)_0%,rgba(255,243,245,0.96)_100%)] px-5 py-4 text-sm leading-7 text-neutral-700">
              Take your time. The more you share, the more tailored your session will be.
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <TextInputField
                id="consultation-name"
                label="Full name"
                value={formState.name}
                onChange={(value) => setFieldValue('name', value)}
                error={currentStepErrors.name}
                autoComplete="name"
              />
              <TextInputField
                id="consultation-email"
                label="Email"
                value={formState.email}
                onChange={(value) => setFieldValue('email', value)}
                error={currentStepErrors.email}
                type="email"
                autoComplete="email"
              />
              <TextInputField
                id="consultation-phone"
                label="Phone number"
                value={formState.phone}
                onChange={(value) => setFieldValue('phone', value)}
                error={currentStepErrors.phone}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
              />
              <TextInputField
                id="consultation-due-date"
                label="Due date or baby's birthday"
                value={formState.dueDate}
                onChange={(value) => setFieldValue('dueDate', value)}
                error={currentStepErrors.dueDate}
                type="date"
              />
            </div>

            <ChoiceCardGroup
              label="Are you a first-time parent?"
              options={FIRST_TIME_PARENT_OPTIONS}
              value={formState.parentStage}
              onChange={(value) => setFieldValue('parentStage', value)}
              error={currentStepErrors.parentStage}
              columns="sm:grid-cols-3"
            />
          </div>
        );
      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div className="rounded-[1.3rem] bg-[rgba(255,250,247,0.92)] px-5 py-4 text-sm leading-7 text-neutral-700">
              You do not need to have this all figured out. This is just the real-life context that helps recommendations fit.
            </div>

            <ChoiceCardGroup
              label="What type of home do you live in?"
              options={HOME_TYPE_OPTIONS}
              value={formState.homeType}
              onChange={(value) => setFieldValue('homeType', value)}
              error={currentStepErrors.homeType}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <ChoiceCardGroup
                label="Do you have stairs?"
                options={YES_NO_OPTIONS}
                value={formState.hasStairs}
                onChange={(value) => setFieldValue('hasStairs', value)}
                error={currentStepErrors.hasStairs}
                columns="grid-cols-2"
              />
              <ChoiceCardGroup
                label="Your day-to-day is mostly"
                options={DAY_TO_DAY_OPTIONS}
                value={formState.dayToDayMode}
                onChange={(value) => setFieldValue('dayToDayMode', value)}
                error={currentStepErrors.dayToDayMode}
              />
            </div>

            <ChoiceCardGroup
              label="Storage space feels"
              options={STORAGE_SPACE_OPTIONS}
              value={formState.storageSpace}
              onChange={(value) => setFieldValue('storageSpace', value)}
              error={currentStepErrors.storageSpace}
            />

            <TextareaField
              id="consultation-lifestyle-notes"
              label="Anything important about your home, routine, or setup you want me to know?"
              value={formState.lifestyleNotes}
              onChange={(value) => setFieldValue('lifestyleNotes', value)}
              optional
              rows={5}
            />
          </div>
        );
      case 'registry':
        return (
          <div className="space-y-6">
            <ChoiceCardGroup
              label="Do you already have a registry?"
              options={REGISTRY_STATUS_OPTIONS}
              value={formState.registryStatus}
              onChange={(value) => setFieldValue('registryStatus', value)}
              error={currentStepErrors.registryStatus}
            />

            {formState.registryStatus && formState.registryStatus !== 'no' ? (
              <MultiChoiceGroup
                label="If yes, where is it built?"
                options={REGISTRY_PLATFORM_OPTIONS}
                values={formState.registryPlatforms}
                onToggle={(value) => toggleMultiSelect('registryPlatforms', value)}
                error={currentStepErrors.registryPlatforms}
              />
            ) : null}

            <ChoiceCardGroup
              label="Have you already purchased or received any baby gear?"
              options={YES_NO_OPTIONS}
              value={formState.hasGear}
              onChange={(value) => setFieldValue('hasGear', value)}
              error={currentStepErrors.hasGear}
              columns="grid-cols-2"
            />

            {formState.hasGear === 'yes' ? (
              <TextareaField
                id="consultation-owned-gear"
                label="What do you already have?"
                value={formState.ownedGearNotes}
                onChange={(value) => setFieldValue('ownedGearNotes', value)}
                optional
                rows={4}
              />
            ) : null}

            <MultiChoiceGroup
              label="What do you want the most help with right now?"
              options={HELP_TOPIC_OPTIONS}
              values={formState.helpTopics}
              onToggle={(value) => toggleMultiSelect('helpTopics', value)}
              error={currentStepErrors.helpTopics}
            />
          </div>
        );
      case 'priorities':
        return (
          <div className="space-y-6">
            <MultiChoiceGroup
              label="What matters most to you?"
              options={PRIORITY_OPTIONS}
              values={formState.priorities}
              onToggle={(value) => toggleMultiSelect('priorities', value)}
              error={currentStepErrors.priorities}
            />

            <ChoiceCardGroup
              label="General baby gear budget"
              options={BUDGET_RANGE_OPTIONS}
              value={formState.budgetRange}
              onChange={(value) => setFieldValue('budgetRange', value)}
              error={currentStepErrors.budgetRange}
            />

            <MultiChoiceGroup
              label="Feeding plans"
              options={FEEDING_PLAN_OPTIONS}
              values={formState.feedingPlans}
              onToggle={(value) => toggleMultiSelect('feedingPlans', value)}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <ChoiceCardGroup
                label="Pets at home?"
                options={YES_NO_OPTIONS}
                value={formState.hasPets}
                onChange={(value) => setFieldValue('hasPets', value)}
                error={currentStepErrors.hasPets}
                columns="grid-cols-2"
              />
              <ChoiceCardGroup
                label="Additional caregivers using gear?"
                options={YES_NO_OPTIONS}
                value={formState.hasAdditionalCaregivers}
                onChange={(value) => setFieldValue('hasAdditionalCaregivers', value)}
                error={currentStepErrors.hasAdditionalCaregivers}
                columns="grid-cols-2"
              />
            </div>

            {formState.hasAdditionalCaregivers === 'yes' ? (
              <TextareaField
                id="consultation-caregiver-notes"
                label="Who else will be using the gear?"
                value={formState.caregiverNotes}
                onChange={(value) => setFieldValue('caregiverNotes', value)}
                optional
                rows={4}
              />
            ) : null}
          </div>
        );
      case 'goals':
        return (
          <div className="space-y-6">
            <div className="rounded-[1.3rem] bg-[linear-gradient(180deg,rgba(255,248,249,0.98)_0%,rgba(255,243,245,0.96)_100%)] px-5 py-4 text-sm leading-7 text-neutral-700">
              This helps me make your session actually useful. You do not need to polish it. You just need to tell the truth.
            </div>

            <TextareaField
              id="consultation-session-goals"
              label="What are you hoping to walk away with?"
              value={formState.sessionGoals}
              onChange={(value) => setFieldValue('sessionGoals', value)}
              optional
              rows={5}
            />

            <TextareaField
              id="consultation-overwhelm"
              label="What feels most overwhelming right now?"
              value={formState.overwhelmNotes}
              onChange={(value) => setFieldValue('overwhelmNotes', value)}
              optional
              rows={5}
              hint="You do not need to know the right words here. A messy answer is completely fine."
            />
          </div>
        );
      case 'booking':
        return (
          <div className="space-y-6">
            <ChoiceCardGroup
              label="Preferred consult type"
              options={CONSULT_TYPE_OPTIONS}
              value={formState.consultType}
              onChange={(value) => setFieldValue('consultType', value)}
              error={currentStepErrors.consultType}
            />

            <ChoiceCardGroup
              label="How would you prefer to meet?"
              options={MEETING_PREFERENCE_OPTIONS}
              value={formState.meetingPreference}
              onChange={(value) => setFieldValue('meetingPreference', value)}
              error={currentStepErrors.meetingPreference}
            />

            <TextareaField
              id="consultation-preferred-timing"
              label="Preferred date and time"
              value={formState.preferredTiming}
              onChange={(value) => setFieldValue('preferredTiming', value)}
              optional
              rows={4}
              hint="A couple of date windows is perfect. For example: weekdays after 2 PM, or next Tuesday morning."
            />

            <div className="rounded-[1.3rem] border border-[rgba(216,137,160,0.24)] bg-[rgba(255,248,249,0.92)] px-5 py-4 text-sm leading-7 text-neutral-700">
              There is no need to lock the perfect slot here. This just helps me reply with something that already fits your real week.
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-6">
            <div className="rounded-[1.3rem] bg-[linear-gradient(180deg,rgba(255,248,249,0.98)_0%,rgba(255,243,245,0.96)_100%)] px-5 py-4 text-sm leading-7 text-neutral-700">
              This is the version of your intake I will use to prep. If something feels off, go back and adjust it. If it feels real, send it.
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <ReviewBlock eyebrow="Contact" title="Personal basics">
                <ReviewItem label="Name" value={intakeSummary.personalBasics.name} />
                <ReviewItem label="Email" value={intakeSummary.personalBasics.email} />
                <ReviewItem label="Phone" value={intakeSummary.personalBasics.phone} />
                <ReviewItem label="Due date or birthday" value={intakeSummary.personalBasics.dueDateOrBirthday} />
                <ReviewItem label="First-time parent?" value={intakeSummary.personalBasics.firstTimeParent} />
              </ReviewBlock>

              <ReviewBlock eyebrow="Lifestyle" title="Home and routine">
                <ReviewItem label="Home type" value={intakeSummary.lifestyleConstraints.homeType} />
                <ReviewItem label="Stairs" value={intakeSummary.lifestyleConstraints.hasStairs} />
                <ReviewItem label="Day-to-day" value={intakeSummary.lifestyleConstraints.dayToDay} />
                <ReviewItem label="Storage space" value={intakeSummary.lifestyleConstraints.storageSpace} />
                <ReviewItem label="Notes" value={intakeSummary.lifestyleConstraints.notes} />
              </ReviewBlock>

              <ReviewBlock eyebrow="Registry" title="Registry and gear status">
                <ReviewItem label="Registry status" value={intakeSummary.registryStatus.registryBuilt} />
                <ReviewItem label="Registry platforms" value={intakeSummary.registryStatus.registryPlatforms} />
                <ReviewItem label="Already has gear?" value={intakeSummary.registryStatus.gearAlreadyPurchased} />
                <ReviewItem label="Current gear" value={intakeSummary.registryStatus.existingGear} />
                <ReviewItem label="Main help topics" value={intakeSummary.registryStatus.helpTopics} />
              </ReviewBlock>

              <ReviewBlock eyebrow="Priorities" title="Preferences and constraints">
                <ReviewItem label="Priorities" value={intakeSummary.prioritiesAndPreferences.priorities} />
                <ReviewItem label="Budget range" value={intakeSummary.prioritiesAndPreferences.budgetRange} />
                <ReviewItem label="Feeding plans" value={intakeSummary.prioritiesAndPreferences.feedingPlans} />
                <ReviewItem label="Pets at home" value={intakeSummary.prioritiesAndPreferences.petsAtHome} />
                <ReviewItem
                  label="Additional caregivers"
                  value={intakeSummary.prioritiesAndPreferences.additionalCaregivers}
                />
                <ReviewItem label="Caregiver notes" value={intakeSummary.prioritiesAndPreferences.caregiverNotes} />
              </ReviewBlock>

              <ReviewBlock eyebrow="Session" title="Booking and goals">
                <ReviewItem label="Consult type" value={intakeSummary.bookingAndGoals.consultType} />
                <ReviewItem label="Meeting preference" value={intakeSummary.bookingAndGoals.meetingPreference} />
                <ReviewItem label="Preferred timing" value={intakeSummary.bookingAndGoals.preferredTiming} />
                <ReviewItem label="Walk away with" value={intakeSummary.bookingAndGoals.sessionGoals} />
                <ReviewItem label="Most overwhelming right now" value={intakeSummary.bookingAndGoals.overwhelmNotes} />
              </ReviewBlock>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (showStep0) {
    return (
      <div ref={containerRef} className="space-y-6">
        <form className="space-y-6" noValidate onSubmit={handleStep0Continue}>
          <div className="sticky top-2 z-20 -mx-2 rounded-[1.2rem] border border-[rgba(47,36,48,0.08)] bg-[rgba(255,252,250,0.94)] px-3 py-3 shadow-[0_18px_42px_rgba(47,36,48,0.08)] backdrop-blur sm:top-3 sm:-mx-4 sm:rounded-[1.35rem] sm:px-4 sm:py-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">
                  Getting started
                </p>
                <h2 className="mt-1.5 font-serif text-[1.4rem] leading-tight text-neutral-900 sm:mt-2 sm:text-[1.85rem]">
                  {"Let's get started"}
                </h2>
              </div>
              <p className="max-w-md text-[0.92rem] leading-6 text-neutral-500 sm:text-right sm:text-sm">
                A few quick details before your intake
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(47,36,48,0.08)]">
              <div className="h-full w-0 rounded-full bg-[linear-gradient(90deg,#d889a0_0%,#c97691_100%)]" />
            </div>
            <div className="mt-3 flex items-center gap-2 sm:mt-4">
              <div className="rounded-full bg-[rgba(216,137,160,0.16)] px-2 py-1 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--color-accent-dark)] sm:px-2 sm:text-[0.62rem] sm:tracking-[0.18em]">
                Getting started
              </div>
              {STEP_DEFINITIONS.map((_, index) => (
                <div
                  key={index}
                  className="rounded-full bg-transparent px-1.5 py-1 text-center text-[0.58rem] uppercase tracking-[0.14em] text-neutral-300 sm:px-2 sm:text-[0.62rem] sm:tracking-[0.18em]"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-[1.4rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f7_100%)] p-4 shadow-[0_24px_60px_rgba(47,36,48,0.08)] sm:space-y-6 sm:rounded-[1.6rem] sm:p-7">
            <div className="space-y-2.5 sm:space-y-3">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/78">
                Getting started
              </p>
              <h3 className="font-serif text-[1.65rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 sm:text-[1.9rem]">
                {"Let's get started"}
              </h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="First name" htmlFor="step0-first-name" error={step0Errors.firstName}>
                <input
                  id="step0-first-name"
                  type="text"
                  value={step0State.firstName}
                  onChange={(e) => setStep0State((s) => ({ ...s, firstName: e.target.value }))}
                  autoComplete="given-name"
                  className={cx(
                    'w-full rounded-[1.15rem] border bg-white px-4 py-3.5 text-base text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.28)] sm:text-[0.98rem]',
                    step0Errors.firstName ? 'border-rose-300 bg-rose-50/40' : 'border-[rgba(47,36,48,0.12)]',
                  )}
                />
              </FieldShell>
              <FieldShell label="Email" htmlFor="step0-email" error={step0Errors.email}>
                <input
                  id="step0-email"
                  type="email"
                  value={step0State.email}
                  onChange={(e) => setStep0State((s) => ({ ...s, email: e.target.value }))}
                  autoComplete="email"
                  inputMode="email"
                  className={cx(
                    'w-full rounded-[1.15rem] border bg-white px-4 py-3.5 text-base text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.28)] sm:text-[0.98rem]',
                    step0Errors.email ? 'border-rose-300 bg-rose-50/40' : 'border-[rgba(47,36,48,0.12)]',
                  )}
                />
              </FieldShell>
            </div>

            <FieldShell label="Due date or baby's birthday" htmlFor="step0-due-date" optional>
              <input
                id="step0-due-date"
                type="text"
                value={step0State.dueDate}
                onChange={(e) => setStep0State((s) => ({ ...s, dueDate: e.target.value }))}
                placeholder="MM/DD/YYYY"
                autoComplete="off"
                className="w-full rounded-[1.15rem] border border-[rgba(47,36,48,0.12)] bg-white px-4 py-3.5 text-base text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.28)] sm:text-[0.98rem]"
              />
            </FieldShell>

            <div className="flex flex-col-reverse gap-3 border-t border-[rgba(47,36,48,0.08)] pt-5 sm:flex-row sm:items-center sm:justify-end sm:pt-6">
              <button
                type="submit"
                disabled={step0Submitting}
                className="btn btn--primary min-h-[48px] w-full px-6 sm:w-auto"
              >
                {step0Submitting ? 'Just a moment...' : 'Continue to intake →'}
              </button>
            </div>
          </div>

          <div className="rounded-[1.1rem] bg-[rgba(255,248,249,0.86)] px-4 py-3.5 text-sm leading-6 text-neutral-600 sm:rounded-[1.2rem] sm:px-5 sm:py-4 sm:leading-7">
            This is meant to save time on both sides. You share the context once. I walk into the conversation already knowing what needs sorting.
          </div>
        </form>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <form
        className="space-y-6"
        noValidate
        data-booking-context="consultation_request"
        onFocusCapture={handleFocusCapture}
        onSubmit={handleSubmit}
      >
        <div className="sticky top-2 z-20 -mx-2 rounded-[1.2rem] border border-[rgba(47,36,48,0.08)] bg-[rgba(255,252,250,0.94)] px-3 py-3 shadow-[0_18px_42px_rgba(47,36,48,0.08)] backdrop-blur sm:top-3 sm:-mx-4 sm:rounded-[1.35rem] sm:px-4 sm:py-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">
                Step {currentStepIndex + 1} of {STEP_DEFINITIONS.length}
              </p>
              <h2 className="mt-1.5 font-serif text-[1.4rem] leading-tight text-neutral-900 sm:mt-2 sm:text-[1.85rem]">
                {currentStep.title}
              </h2>
            </div>
            <p className="max-w-md text-[0.92rem] leading-6 text-neutral-500 sm:text-right sm:text-sm">
              {currentStep.description}
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(47,36,48,0.08)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#d889a0_0%,#c97691_100%)] transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5 sm:mt-4 sm:gap-2">
            {STEP_DEFINITIONS.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              return (
                <div
                  key={step.id}
                  className={cx(
                    'rounded-full px-1.5 py-1 text-center text-[0.58rem] uppercase tracking-[0.14em] sm:px-2 sm:text-[0.62rem] sm:tracking-[0.18em]',
                    isActive
                      ? 'bg-[rgba(216,137,160,0.16)] text-[var(--color-accent-dark)]'
                      : isComplete
                        ? 'bg-[rgba(47,36,48,0.06)] text-neutral-500'
                        : 'bg-transparent text-neutral-300',
                  )}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5 rounded-[1.4rem] border border-[rgba(47,36,48,0.08)] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f7_100%)] p-4 shadow-[0_24px_60px_rgba(47,36,48,0.08)] sm:space-y-6 sm:rounded-[1.6rem] sm:p-7">
          <div className="space-y-2.5 sm:space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/78">
              {currentStep.eyebrow}
            </p>
            <h3 className="font-serif text-[1.65rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 sm:text-[1.9rem]">
              {currentStep.title}
            </h3>
          </div>

          {submitState.type === 'error' ? (
            <div className="rounded-[1.1rem] border border-rose-200 bg-rose-50/90 px-4 py-3.5 text-sm leading-6 text-rose-800 sm:rounded-[1.2rem] sm:px-5 sm:py-4 sm:leading-7">
              {submitState.message}
            </div>
          ) : null}

          {submitState.type === 'success' ? (
            <div
              className="consult-success-card rounded-[1.45rem] border border-[rgba(216,137,160,0.22)] bg-[linear-gradient(180deg,rgba(255,250,251,0.98)_0%,rgba(255,244,247,0.96)_100%)] px-5 py-7 text-center shadow-[0_24px_52px_rgba(47,36,48,0.08)] sm:px-8 sm:py-9"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto flex w-full max-w-[22rem] flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                  <span
                    aria-hidden="true"
                    className="consult-success-orb absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(216,137,160,0.2)_0%,rgba(216,137,160,0.04)_58%,rgba(216,137,160,0)_76%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-[16%] rounded-full border border-[rgba(216,137,160,0.32)] bg-white/84 shadow-[0_12px_30px_rgba(47,36,48,0.08)]"
                  />
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d889a0_0%,#c97691_100%)] text-white shadow-[0_12px_28px_rgba(201,118,145,0.32)] sm:h-14 sm:w-14">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 sm:h-7 sm:w-7"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                </div>

                <p className="mt-5 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
                  Intake sent
                </p>
                <h4 className="mt-3 font-serif text-[2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.2rem]">
                  You&apos;re all set.
                </h4>
                <p className="mt-4 text-[1rem] leading-8 text-neutral-700 sm:text-[1.04rem]">
                  I have your notes. Opening your confirmation screen now so you know everything went through cleanly, and a confirmation email is on its way too.
                </p>
                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  No need to resubmit. The goal is clarity, not repeat paperwork.
                </p>
              </div>
            </div>
          ) : (
            renderStepContent()
          )}

          {submitState.type !== 'success' ? (
            <div className="flex flex-col-reverse gap-3 border-t border-[rgba(47,36,48,0.08)] pt-5 sm:pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStepIndex === 0 || submitState.type === 'submitting'}
                className={cx(
                  'min-h-[48px] w-full rounded-full px-5 py-3 text-sm font-semibold transition duration-200 sm:w-auto',
                  currentStepIndex === 0
                    ? 'cursor-not-allowed border border-transparent bg-transparent text-neutral-300'
                    : 'border border-[rgba(47,36,48,0.12)] bg-white text-neutral-700 hover:shadow-sm',
                )}
              >
                Back
              </button>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <p className="text-sm leading-6 text-neutral-500 sm:max-w-[17rem]">
                  {currentStep.id === 'review'
                    ? 'This intake becomes your pre-consult plan.'
                    : 'You do not need to have everything figured out.'}
                </p>

                {currentStep.id === 'review' ? (
                  <button
                    type="submit"
                    disabled={submitState.type === 'submitting'}
                    className="btn btn--primary min-h-[48px] w-full px-6 sm:w-auto"
                  >
                    {submitState.type === 'submitting' ? 'Sending your intake...' : submitLabel}
                  </button>
                ) : (
                  <button type="button" onClick={handleNext} className="btn btn--primary min-h-[48px] w-full px-6 sm:w-auto">
                    Continue
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.1rem] bg-[rgba(255,248,249,0.86)] px-4 py-3.5 text-sm leading-6 text-neutral-600 sm:rounded-[1.2rem] sm:px-5 sm:py-4 sm:leading-7">
          This is meant to save time on both sides. You share the context once. I walk into the conversation already knowing what needs sorting.
        </div>
      </form>
    </div>
  );
}
