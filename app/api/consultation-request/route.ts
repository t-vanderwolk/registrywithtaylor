import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import {
  BUDGET_RANGE_OPTIONS,
  CONSULT_TYPE_OPTIONS,
  DAY_TO_DAY_OPTIONS,
  FIRST_TIME_PARENT_OPTIONS,
  HOME_TYPE_OPTIONS,
  MEETING_PREFERENCE_OPTIONS,
  PRIORITY_OPTIONS,
  REGISTRY_PLATFORM_OPTIONS,
  REGISTRY_STATUS_OPTIONS,
  STORAGE_SPACE_OPTIONS,
  YES_NO_OPTIONS,
  HELP_TOPIC_OPTIONS,
  FEEDING_PLAN_OPTIONS,
  buildConsultationIntakeSummary,
  buildConsultationLegacyMessage,
  getChoiceLabelForValue,
  normalizeConsultationIntakeDraft,
} from '@/lib/consultation/intake';

export const runtime = 'nodejs';

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asInternalPath = (value: FormDataEntryValue | null, fallback: string) => {
  const text = asText(value);
  if (!text || !text.startsWith('/') || text.startsWith('//')) {
    return fallback;
  }

  return text;
};

const asOptionalDate = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  if (!text) {
    return { value: null, error: false } as const;
  }

  const parsed = new Date(`${text}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { value: null, error: true } as const;
  }

  return { value: parsed, error: false } as const;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value: string) => value.replace(/\D/g, '').length >= 7;

const getRequestIp = (req: NextRequest) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    if (first?.trim()) {
      return first.trim();
    }
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp?.trim()) {
    return realIp.trim();
  }

  return null;
};

const wantsJsonResponse = (req: NextRequest) =>
  req.headers.get('x-tmbc-form-mode') === 'async' || req.headers.get('accept')?.includes('application/json');

const redirectToPath = (req: NextRequest, path: string, error?: string) => {
  const url = new URL(path, req.url);
  if (error) {
    url.searchParams.set('error', error);
  }

  return NextResponse.redirect(url, { status: 303 });
};

const jsonError = (message: string, status: number, fieldErrors?: Record<string, string>) =>
  NextResponse.json(
    {
      error: message,
      fieldErrors: fieldErrors ?? {},
    },
    { status },
  );

function buildFieldErrors(state: ReturnType<typeof normalizeConsultationIntakeDraft>) {
  const fieldErrors: Record<string, string> = {};

  if (!state.name) fieldErrors.name = 'Full name helps me know who I am planning for.';
  if (!state.email) fieldErrors.email = 'Email gives me a way to follow up directly.';
  if (!state.phone) fieldErrors.phone = 'A phone number helps keep scheduling simple.';
  if (!state.dueDate) fieldErrors.dueDate = 'This helps me tailor the timing of your session.';
  if (!state.parentStage) fieldErrors.parentStage = 'Tell me where you are in the parenting timeline.';
  if (!state.homeType) fieldErrors.homeType = 'This helps narrow what will actually fit your space.';
  if (!state.hasStairs) fieldErrors.hasStairs = 'This helps me understand the daily lift factor.';
  if (!state.dayToDayMode) fieldErrors.dayToDayMode = 'Your routine matters more than brand hype.';
  if (!state.storageSpace) fieldErrors.storageSpace = 'Storage limits change a lot of recommendations.';
  if (!state.registryStatus) fieldErrors.registryStatus = 'A quick registry status check keeps the session practical.';
  if (!state.hasGear) fieldErrors.hasGear = 'This keeps me from recommending what you already solved.';
  if (state.helpTopics.length === 0) fieldErrors.helpTopics = 'Pick at least one area you want real clarity on.';
  if (state.registryStatus !== 'no' && state.registryPlatforms.length === 0) {
    fieldErrors.registryPlatforms = 'If you have a registry started, tell me where it lives.';
  }
  if (state.priorities.length === 0) fieldErrors.priorities = 'Choose at least one priority so I know what to optimize for.';
  if (!state.budgetRange) fieldErrors.budgetRange = 'Budget context keeps the recommendations grounded.';
  if (!state.hasPets) fieldErrors.hasPets = 'This helps with fabrics, floors, and general chaos planning.';
  if (!state.hasAdditionalCaregivers) {
    fieldErrors.hasAdditionalCaregivers = 'Let me know whether more than one adult will be using the gear.';
  }
  if (!state.meetingPreference) fieldErrors.meetingPreference = 'Tell me how you would prefer to meet.';
  if (!state.consultType) fieldErrors.consultType = 'Pick the support format that feels closest to what you need.';

  return fieldErrors;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return wantsJsonResponse(req)
      ? jsonError('Please try submitting the form again.', 400)
      : redirectToPath(req, '/consultation', 'invalid-form');
  }

  const returnPath = asInternalPath(formData.get('returnPath'), '/consultation');
  const successPath = asInternalPath(formData.get('successPath'), '/consultation/confirmation');
  const wantsJson = wantsJsonResponse(req);

  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/consultation-request',
    ip: ip ?? 'unknown',
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    return wantsJson
      ? jsonError('Too many requests were submitted. Please try again shortly.', 429)
      : redirectToPath(req, returnPath, 'rate-limit');
  }

  if (asText(formData.get('company')).length > 0) {
    return wantsJson
      ? NextResponse.json({ success: true, redirectTo: successPath })
      : redirectToPath(req, successPath);
  }

  const state = normalizeConsultationIntakeDraft({
    name: asText(formData.get('name')),
    email: asText(formData.get('email')),
    phone: asText(formData.get('phone')),
    dueDate: asText(formData.get('dueDate')),
    parentStage: asText(formData.get('parentStage')),
    homeType: asText(formData.get('homeType')),
    hasStairs: asText(formData.get('hasStairs')),
    dayToDayMode: asText(formData.get('dayToDayMode')),
    storageSpace: asText(formData.get('storageSpace')),
    lifestyleNotes: asText(formData.get('lifestyleNotes')),
    registryStatus: asText(formData.get('registryStatus')),
    registryPlatforms: formData.getAll('registryPlatforms').filter((value): value is string => typeof value === 'string'),
    hasGear: asText(formData.get('hasGear')),
    ownedGearNotes: asText(formData.get('ownedGearNotes')),
    helpTopics: formData.getAll('helpTopics').filter((value): value is string => typeof value === 'string'),
    priorities: formData.getAll('priorities').filter((value): value is string => typeof value === 'string'),
    budgetRange: asText(formData.get('budgetRange')),
    feedingPlans: formData.getAll('feedingPlans').filter((value): value is string => typeof value === 'string'),
    hasPets: asText(formData.get('hasPets')),
    hasAdditionalCaregivers: asText(formData.get('hasAdditionalCaregivers')),
    caregiverNotes: asText(formData.get('caregiverNotes')),
    meetingPreference: asText(formData.get('meetingPreference')),
    consultType: asText(formData.get('consultType')),
    preferredTiming: asText(formData.get('preferredTiming')),
    sessionGoals: asText(formData.get('sessionGoals')),
    overwhelmNotes: asText(formData.get('overwhelmNotes')),
  });

  if (!state.name || !state.email) {
    return wantsJson
      ? jsonError('Name and email are required.', 400, buildFieldErrors(state))
      : redirectToPath(req, returnPath, 'required');
  }

  if (!isValidEmail(state.email)) {
    return wantsJson
      ? jsonError('Please enter a valid email address.', 400, { email: 'Please enter a valid email address.' })
      : redirectToPath(req, returnPath, 'invalid-email');
  }

  if (!isValidPhone(state.phone)) {
    return wantsJson
      ? jsonError('Please enter a valid phone number.', 400, { phone: 'Please enter a valid phone number.' })
      : redirectToPath(req, returnPath, 'invalid-form');
  }

  const dueDate = asOptionalDate(formData.get('dueDate'));
  if (dueDate.error) {
    return wantsJson
      ? jsonError('Please enter a valid due date or birthday.', 400, { dueDate: 'Please enter a valid date.' })
      : redirectToPath(req, returnPath, 'invalid-date');
  }

  const fieldErrors = buildFieldErrors(state);
  if (Object.keys(fieldErrors).length > 0) {
    return wantsJson
      ? jsonError('A few details are still missing. Please review the highlighted step and try again.', 400, fieldErrors)
      : redirectToPath(req, returnPath, 'required');
  }

  const intakeSummary = buildConsultationIntakeSummary(state);
  const legacyMessage =
    buildConsultationLegacyMessage(intakeSummary) ||
    asText(formData.get('message')) ||
    state.sessionGoals ||
    state.overwhelmNotes ||
    null;

  await prisma.consultationRequest.create({
    data: {
      name: state.name,
      email: state.email,
      dueDate: dueDate.value,
      city: null,
      babyNumber: getChoiceLabelForValue(FIRST_TIME_PARENT_OPTIONS, state.parentStage),
      message: legacyMessage,
      intakeSummary,
    },
  });

  return wantsJson
    ? NextResponse.json({ success: true, redirectTo: successPath })
    : redirectToPath(req, successPath);
}
