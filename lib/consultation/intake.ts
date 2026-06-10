export type ConsultationChoiceOption = {
  value: string;
  label: string;
  description?: string;
};

export const FIRST_TIME_PARENT_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'supporting-someone-else', label: 'Supporting someone else' },
];

export const HOME_TYPE_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhome', label: 'Townhome' },
  { value: 'other', label: 'Other' },
];

export const YES_NO_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const DAY_TO_DAY_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'driving', label: 'Driving' },
  { value: 'walking', label: 'Walking' },
  { value: 'mix', label: 'A mix of both' },
];

export const STORAGE_SPACE_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'plenty', label: 'Plenty' },
];

export const REGISTRY_STATUS_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'started-not-confident', label: 'Started, but not confident in it' },
];

export const REGISTRY_PLATFORM_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'target', label: 'Target' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'babylist', label: 'Babylist' },
  { value: 'myregistry', label: 'MyRegistry' },
  { value: 'other', label: 'Other' },
];

export const HELP_TOPIC_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'registry-strategy', label: 'Registry strategy' },
  { value: 'strollers', label: 'Strollers' },
  { value: 'car-seats', label: 'Car seats' },
  { value: 'nursery-planning', label: 'Nursery planning' },
  { value: 'travel-gear', label: 'Travel gear' },
  { value: 'feeding-gear', label: 'Feeding gear' },
  { value: 'daily-use-gear', label: 'Daily-use gear' },
  { value: 'everything', label: 'Everything' },
];

export const PRIORITY_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'simplicity', label: 'Simplicity' },
  { value: 'budget-conscious', label: 'Budget-conscious' },
  { value: 'premium-high-end', label: 'Premium / high-end' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'design-aesthetic', label: 'Design / aesthetic' },
  { value: 'long-term-use', label: 'Long-term use' },
  { value: 'ease-of-cleaning', label: 'Ease of cleaning' },
  { value: 'travel-friendliness', label: 'Travel-friendliness' },
];

export const BUDGET_RANGE_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'under-1000', label: 'Under $1,000' },
  { value: '1000-3000', label: '$1,000–$3,000' },
  { value: '3000-6000', label: '$3,000–$6,000' },
  { value: 'flexible', label: 'Flexible' },
];

export const FEEDING_PLAN_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'breastfeeding', label: 'Breastfeeding' },
  { value: 'pumping', label: 'Pumping' },
  { value: 'formula', label: 'Formula' },
  { value: 'combination-feeding', label: 'Combination feeding' },
  { value: 'not-sure-yet', label: 'Not sure yet' },
];

export const MEETING_PREFERENCE_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'virtual', label: 'Virtual' },
  { value: 'in-home', label: 'In-home (if available)' },
  { value: 'not-sure', label: 'Not sure' },
];

export const CONSULT_TYPE_OPTIONS: ConsultationChoiceOption[] = [
  { value: 'focused-edit', label: 'Focused Session' },
  { value: 'signature-plan', label: 'Signature Package' },
  { value: 'private-concierge', label: 'Private Concierge' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export type ConsultationIntakeState = {
  name: string;
  email: string;
  phone: string;
  dueDate: string;
  parentStage: string;
  homeType: string;
  hasStairs: string;
  dayToDayMode: string;
  storageSpace: string;
  lifestyleNotes: string;
  registryStatus: string;
  registryPlatforms: string[];
  hasGear: string;
  ownedGearNotes: string;
  helpTopics: string[];
  priorities: string[];
  budgetRange: string;
  feedingPlans: string[];
  hasPets: string;
  hasAdditionalCaregivers: string;
  caregiverNotes: string;
  meetingPreference: string;
  consultType: string;
  preferredTiming: string;
  sessionGoals: string;
  overwhelmNotes: string;
};

export type ConsultationIntakeSummary = {
  quickView: {
    clientStage: string | null;
    parentStage: string | null;
    consultType: string | null;
    meetingPreference: string | null;
    budgetRange: string | null;
    topConcerns: string[];
    registryPlatforms: string[];
    likelyDiscussionTopics: string[];
  };
  personalBasics: {
    name: string;
    email: string;
    phone: string | null;
    dueDateOrBirthday: string | null;
    firstTimeParent: string | null;
  };
  lifestyleConstraints: {
    homeType: string | null;
    hasStairs: string | null;
    dayToDay: string | null;
    storageSpace: string | null;
    notes: string | null;
  };
  registryStatus: {
    registryBuilt: string | null;
    registryPlatforms: string[];
    gearAlreadyPurchased: string | null;
    existingGear: string | null;
    helpTopics: string[];
  };
  prioritiesAndPreferences: {
    priorities: string[];
    budgetRange: string | null;
    feedingPlans: string[];
    petsAtHome: string | null;
    additionalCaregivers: string | null;
    caregiverNotes: string | null;
  };
  bookingAndGoals: {
    meetingPreference: string | null;
    consultType: string | null;
    preferredTiming: string | null;
    sessionGoals: string | null;
    overwhelmNotes: string | null;
  };
};

export const CONSULTATION_INTAKE_INITIAL_STATE: ConsultationIntakeState = {
  name: '',
  email: '',
  phone: '',
  dueDate: '',
  parentStage: '',
  homeType: '',
  hasStairs: '',
  dayToDayMode: '',
  storageSpace: '',
  lifestyleNotes: '',
  registryStatus: '',
  registryPlatforms: [],
  hasGear: '',
  ownedGearNotes: '',
  helpTopics: [],
  priorities: [],
  budgetRange: '',
  feedingPlans: [],
  hasPets: '',
  hasAdditionalCaregivers: '',
  caregiverNotes: '',
  meetingPreference: '',
  consultType: '',
  preferredTiming: '',
  sessionGoals: '',
  overwhelmNotes: '',
};

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function normalizeChoiceValue(value: string | null | undefined, options: ConsultationChoiceOption[]) {
  const normalized = normalizeText(value);
  return options.some((option) => option.value === normalized) ? normalized : '';
}

function normalizeChoiceArray(values: readonly string[], options: ConsultationChoiceOption[]) {
  const allowed = new Set(options.map((option) => option.value));
  const unique: string[] = [];

  values.forEach((value) => {
    const normalized = normalizeText(value);
    if (!allowed.has(normalized) || unique.includes(normalized)) {
      return;
    }

    unique.push(normalized);
  });

  return unique;
}

function getChoiceLabel(options: ConsultationChoiceOption[], value: string | null | undefined) {
  const normalized = normalizeText(value);
  return options.find((option) => option.value === normalized)?.label ?? null;
}

function getChoiceLabels(options: ConsultationChoiceOption[], values: readonly string[]) {
  return normalizeChoiceArray(values, options)
    .map((value) => getChoiceLabel(options, value))
    .filter((value): value is string => Boolean(value));
}

function formatDateLabel(value: string | null | undefined) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function dedupe(values: readonly string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function normalizeConsultationIntakeDraft(value: unknown): ConsultationIntakeState {
  if (!value || typeof value !== 'object') {
    return { ...CONSULTATION_INTAKE_INITIAL_STATE };
  }

  const draft = value as Partial<Record<keyof ConsultationIntakeState, unknown>>;

  return {
    name: normalizeText(typeof draft.name === 'string' ? draft.name : ''),
    email: normalizeText(typeof draft.email === 'string' ? draft.email : ''),
    phone: normalizeText(typeof draft.phone === 'string' ? draft.phone : ''),
    dueDate: normalizeText(typeof draft.dueDate === 'string' ? draft.dueDate : ''),
    parentStage: normalizeChoiceValue(typeof draft.parentStage === 'string' ? draft.parentStage : '', FIRST_TIME_PARENT_OPTIONS),
    homeType: normalizeChoiceValue(typeof draft.homeType === 'string' ? draft.homeType : '', HOME_TYPE_OPTIONS),
    hasStairs: normalizeChoiceValue(typeof draft.hasStairs === 'string' ? draft.hasStairs : '', YES_NO_OPTIONS),
    dayToDayMode: normalizeChoiceValue(typeof draft.dayToDayMode === 'string' ? draft.dayToDayMode : '', DAY_TO_DAY_OPTIONS),
    storageSpace: normalizeChoiceValue(typeof draft.storageSpace === 'string' ? draft.storageSpace : '', STORAGE_SPACE_OPTIONS),
    lifestyleNotes: normalizeText(typeof draft.lifestyleNotes === 'string' ? draft.lifestyleNotes : ''),
    registryStatus: normalizeChoiceValue(typeof draft.registryStatus === 'string' ? draft.registryStatus : '', REGISTRY_STATUS_OPTIONS),
    registryPlatforms: normalizeChoiceArray(
      Array.isArray(draft.registryPlatforms) ? draft.registryPlatforms.filter((entry): entry is string => typeof entry === 'string') : [],
      REGISTRY_PLATFORM_OPTIONS,
    ),
    hasGear: normalizeChoiceValue(typeof draft.hasGear === 'string' ? draft.hasGear : '', YES_NO_OPTIONS),
    ownedGearNotes: normalizeText(typeof draft.ownedGearNotes === 'string' ? draft.ownedGearNotes : ''),
    helpTopics: normalizeChoiceArray(
      Array.isArray(draft.helpTopics) ? draft.helpTopics.filter((entry): entry is string => typeof entry === 'string') : [],
      HELP_TOPIC_OPTIONS,
    ),
    priorities: normalizeChoiceArray(
      Array.isArray(draft.priorities) ? draft.priorities.filter((entry): entry is string => typeof entry === 'string') : [],
      PRIORITY_OPTIONS,
    ),
    budgetRange: normalizeChoiceValue(typeof draft.budgetRange === 'string' ? draft.budgetRange : '', BUDGET_RANGE_OPTIONS),
    feedingPlans: normalizeChoiceArray(
      Array.isArray(draft.feedingPlans) ? draft.feedingPlans.filter((entry): entry is string => typeof entry === 'string') : [],
      FEEDING_PLAN_OPTIONS,
    ),
    hasPets: normalizeChoiceValue(typeof draft.hasPets === 'string' ? draft.hasPets : '', YES_NO_OPTIONS),
    hasAdditionalCaregivers: normalizeChoiceValue(
      typeof draft.hasAdditionalCaregivers === 'string' ? draft.hasAdditionalCaregivers : '',
      YES_NO_OPTIONS,
    ),
    caregiverNotes: normalizeText(typeof draft.caregiverNotes === 'string' ? draft.caregiverNotes : ''),
    meetingPreference: normalizeChoiceValue(
      typeof draft.meetingPreference === 'string' ? draft.meetingPreference : '',
      MEETING_PREFERENCE_OPTIONS,
    ),
    consultType: normalizeChoiceValue(typeof draft.consultType === 'string' ? draft.consultType : '', CONSULT_TYPE_OPTIONS),
    preferredTiming: normalizeText(typeof draft.preferredTiming === 'string' ? draft.preferredTiming : ''),
    sessionGoals: normalizeText(typeof draft.sessionGoals === 'string' ? draft.sessionGoals : ''),
    overwhelmNotes: normalizeText(typeof draft.overwhelmNotes === 'string' ? draft.overwhelmNotes : ''),
  };
}

export function buildConsultationIntakeSummary(state: ConsultationIntakeState): ConsultationIntakeSummary {
  const normalized = normalizeConsultationIntakeDraft(state);
  const dueDateLabel = formatDateLabel(normalized.dueDate);
  const helpTopics = getChoiceLabels(HELP_TOPIC_OPTIONS, normalized.helpTopics);
  const priorities = getChoiceLabels(PRIORITY_OPTIONS, normalized.priorities);
  const registryPlatforms = getChoiceLabels(REGISTRY_PLATFORM_OPTIONS, normalized.registryPlatforms);

  return {
    quickView: {
      clientStage: dueDateLabel,
      parentStage: getChoiceLabel(FIRST_TIME_PARENT_OPTIONS, normalized.parentStage),
      consultType: getChoiceLabel(CONSULT_TYPE_OPTIONS, normalized.consultType),
      meetingPreference: getChoiceLabel(MEETING_PREFERENCE_OPTIONS, normalized.meetingPreference),
      budgetRange: getChoiceLabel(BUDGET_RANGE_OPTIONS, normalized.budgetRange),
      topConcerns: helpTopics,
      registryPlatforms,
      likelyDiscussionTopics: dedupe(
        helpTopics.includes('Everything')
          ? ['Registry strategy', 'Strollers', 'Car seats', 'Nursery planning', 'Travel gear', 'Feeding gear', 'Daily-use gear']
          : [...helpTopics, ...priorities],
      ),
    },
    personalBasics: {
      name: normalized.name,
      email: normalized.email,
      phone: normalized.phone || null,
      dueDateOrBirthday: dueDateLabel,
      firstTimeParent: getChoiceLabel(FIRST_TIME_PARENT_OPTIONS, normalized.parentStage),
    },
    lifestyleConstraints: {
      homeType: getChoiceLabel(HOME_TYPE_OPTIONS, normalized.homeType),
      hasStairs: getChoiceLabel(YES_NO_OPTIONS, normalized.hasStairs),
      dayToDay: getChoiceLabel(DAY_TO_DAY_OPTIONS, normalized.dayToDayMode),
      storageSpace: getChoiceLabel(STORAGE_SPACE_OPTIONS, normalized.storageSpace),
      notes: normalized.lifestyleNotes || null,
    },
    registryStatus: {
      registryBuilt: getChoiceLabel(REGISTRY_STATUS_OPTIONS, normalized.registryStatus),
      registryPlatforms,
      gearAlreadyPurchased: getChoiceLabel(YES_NO_OPTIONS, normalized.hasGear),
      existingGear: normalized.ownedGearNotes || null,
      helpTopics,
    },
    prioritiesAndPreferences: {
      priorities,
      budgetRange: getChoiceLabel(BUDGET_RANGE_OPTIONS, normalized.budgetRange),
      feedingPlans: getChoiceLabels(FEEDING_PLAN_OPTIONS, normalized.feedingPlans),
      petsAtHome: getChoiceLabel(YES_NO_OPTIONS, normalized.hasPets),
      additionalCaregivers: getChoiceLabel(YES_NO_OPTIONS, normalized.hasAdditionalCaregivers),
      caregiverNotes: normalized.caregiverNotes || null,
    },
    bookingAndGoals: {
      meetingPreference: getChoiceLabel(MEETING_PREFERENCE_OPTIONS, normalized.meetingPreference),
      consultType: getChoiceLabel(CONSULT_TYPE_OPTIONS, normalized.consultType),
      preferredTiming: normalized.preferredTiming || null,
      sessionGoals: normalized.sessionGoals || null,
      overwhelmNotes: normalized.overwhelmNotes || null,
    },
  };
}

export function buildConsultationLegacyMessage(summary: ConsultationIntakeSummary) {
  const lines: string[] = [];

  if (summary.quickView.topConcerns.length > 0) {
    lines.push(`Main help: ${summary.quickView.topConcerns.join(', ')}`);
  }

  if (summary.prioritiesAndPreferences.priorities.length > 0) {
    lines.push(`Priorities: ${summary.prioritiesAndPreferences.priorities.join(', ')}`);
  }

  if (summary.bookingAndGoals.sessionGoals) {
    lines.push(`Hoping to walk away with: ${summary.bookingAndGoals.sessionGoals}`);
  }

  if (summary.bookingAndGoals.overwhelmNotes) {
    lines.push(`Most overwhelming right now: ${summary.bookingAndGoals.overwhelmNotes}`);
  }

  if (summary.bookingAndGoals.preferredTiming) {
    lines.push(`Preferred timing: ${summary.bookingAndGoals.preferredTiming}`);
  }

  return lines.join('\n');
}

export function getChoiceLabelForValue(
  options: ConsultationChoiceOption[],
  value: string | null | undefined,
) {
  return getChoiceLabel(options, value);
}

export function getChoiceLabelsForValues(
  options: ConsultationChoiceOption[],
  values: readonly string[],
) {
  return getChoiceLabels(options, values);
}

export function normalizeChoiceForValue(
  value: string | null | undefined,
  options: ConsultationChoiceOption[],
) {
  return normalizeChoiceValue(value, options);
}

export function normalizeChoiceArrayForValues(
  values: readonly string[],
  options: ConsultationChoiceOption[],
) {
  return normalizeChoiceArray(values, options);
}

export function readConsultationIntakeSummary(value: unknown): ConsultationIntakeSummary | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  return value as ConsultationIntakeSummary;
}
