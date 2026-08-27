/**
 * Matchmaker application service — create, update, consent, submit.
 *
 * Frozen contract:
 *  - decision 9:  NEVER auto-publish. This service can produce exactly one
 *                 status transition — into SUBMITTED — and it obtains even that
 *                 from the Step 1 rules rather than assigning it directly.
 *                 There is no code path here that writes APPROVED or LIVE.
 *  - decision 20: `shortStory` is mandatory for submission; every other public
 *                 field is opt-in and defaults to false.
 *  - decision 23: re-application revives the existing row; never a second one.
 *  - Part G:      intake collects no financial, medical, hospital, employer,
 *                 address, phone, child-name, or hardship material. The input
 *                 type below is the whole of what this service will store.
 */

import {
  canTransitionProfile,
  PROFILE_TRANSITIONS,
  PUBLISHED_PROFILE_STATUS,
  type ProfileReviewGates,
} from '@/lib/matchmaker/profileStatus';
import type { MatchmakerEntryMethod, MatchmakerProfileStatus } from '@/lib/matchmaker/types';
import { slugify } from '@/lib/slugify';

import { matchmakerError } from './errors';
import type {
  CreateProfileInput,
  MatchmakerRepo,
  ServiceContext,
  StoredProfile,
  UpdateProfileInput,
} from './ports';
import { resolveRegistryIdentity } from './registryIntake';

/**
 * There is deliberately NO terms-version constant here.
 *
 * No Matchmaker terms have been published, so this layer has no truthful legal
 * version to name. The trusted server caller supplies the current version when
 * recording consent, and supplies it again at submission so the stored
 * acceptance can be checked against it. Inventing a version here would let the
 * system claim a family accepted a document that does not exist.
 */

/** The status a fresh application starts in. */
export const INITIAL_PROFILE_STATUS: MatchmakerProfileStatus = 'DRAFT';

/** The only status this service will ever transition a profile INTO. */
export const SUBMISSION_TARGET_STATUS: MatchmakerProfileStatus = 'SUBMITTED';

/**
 * The deployed `MatchmakerEntryMethod` members.
 *
 * `entryMethod` is PROVENANCE — it records how a family actually joined. It is
 * never defaulted: guessing `GIFTED_FIRST` for a TMBC-nominated family would
 * record a false claim that they gifted first. The caller must state it.
 */
export const ENTRY_METHODS: readonly MatchmakerEntryMethod[] = [
  'TMBC_NOMINATED',
  'GIFTED_FIRST',
  'RECEIVED_THROUGH_MATCHMAKER',
  'ADMIN_OVERRIDE',
];

export function requireEntryMethod(value: unknown): MatchmakerEntryMethod {
  if (value === undefined || value === null || value === '') {
    throw matchmakerError('ENTRY_METHOD_REQUIRED');
  }
  if (!ENTRY_METHODS.includes(value as MatchmakerEntryMethod)) {
    throw matchmakerError('ENTRY_METHOD_INVALID', String(value));
  }
  return value as MatchmakerEntryMethod;
}

/**
 * The complete intake surface. Nothing outside this type is read from caller
 * input, so an API route cannot smuggle an extra column through.
 */
export type ApplicationDraftInput = {
  readonly displayFirstName: string;
  readonly displayLastInitial?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly dueMonth?: number | null;
  readonly dueYear?: number | null;
  readonly familyStage?: string | null;
  readonly shortStory?: string | null;
  readonly priorityNeeds?: readonly string[] | null;

  readonly showLastInitial?: boolean;
  readonly showLocation?: boolean;
  readonly showDueMonth?: boolean;
  readonly showFamilyStage?: boolean;
  readonly showPhoto?: boolean;
  readonly photoMediaId?: string | null;
};

export type MatchmakerConsentInput = {
  readonly acceptTerms: boolean;
  readonly termsVersion: string;
  readonly consentToPublicProfile: boolean;
};

/* ------------------------------------------------------------------ *
 * Normalisation
 * ------------------------------------------------------------------ */

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

/** Privacy flags are OFF unless the caller passed literal `true`. */
function flag(value: unknown): boolean {
  return value === true;
}

function monthOrNull(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  return value >= 1 && value <= 12 ? value : null;
}

function yearOrNull(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  return value >= 2000 && value <= 2100 ? value : null;
}

function needs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of value) {
    const cleaned = text(entry);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
    if (out.length >= 12) break;
  }
  return out;
}

export type NormalisedDraft = {
  displayFirstName: string;
  displayLastInitial: string | null;
  city: string | null;
  state: string | null;
  dueMonth: number | null;
  dueYear: number | null;
  familyStage: string | null;
  shortStory: string;
  priorityNeeds: string[];
  showLastInitial: boolean;
  showLocation: boolean;
  showDueMonth: boolean;
  showFamilyStage: boolean;
  showPhoto: boolean;
  photoMediaId: string | null;
};

export function normaliseApplicationDraft(input: ApplicationDraftInput): NormalisedDraft {
  const displayFirstName = text(input.displayFirstName);
  if (!displayFirstName) throw matchmakerError('DISPLAY_FIRST_NAME_REQUIRED');

  const initial = text(input.displayLastInitial);

  return {
    displayFirstName,
    displayLastInitial: initial ? initial.slice(0, 1).toUpperCase() : null,
    city: text(input.city),
    state: text(input.state),
    dueMonth: monthOrNull(input.dueMonth),
    dueYear: yearOrNull(input.dueYear),
    familyStage: text(input.familyStage),
    shortStory: text(input.shortStory) ?? '',
    priorityNeeds: needs(input.priorityNeeds),
    showLastInitial: flag(input.showLastInitial),
    showLocation: flag(input.showLocation),
    showDueMonth: flag(input.showDueMonth),
    showFamilyStage: flag(input.showFamilyStage),
    showPhoto: flag(input.showPhoto),
    photoMediaId: text(input.photoMediaId),
  };
}

/* ------------------------------------------------------------------ *
 * Material public content / visibility
 * ------------------------------------------------------------------ */

/**
 * Every field whose value shapes what the public sees. A change to any of them
 * means the family has not yet consented to THIS public profile.
 */
export const MATERIAL_PUBLIC_FIELDS = [
  'displayFirstName',
  'displayLastInitial',
  'city',
  'state',
  'dueMonth',
  'dueYear',
  'familyStage',
  'shortStory',
  'priorityNeeds',
  'showLastInitial',
  'showLocation',
  'showDueMonth',
  'showFamilyStage',
  'showPhoto',
  'photoMediaId',
] as const;

export type MaterialPublicField = (typeof MATERIAL_PUBLIC_FIELDS)[number];

function sameValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    const left = Array.isArray(a) ? a : [];
    const right = Array.isArray(b) ? b : [];
    return left.length === right.length && left.every((v, i) => v === right[i]);
  }
  return a === b;
}

/** The exact public-profile state a family approved, keyed by the same list. */
export type MaterialPublicSnapshot = {
  readonly [K in MaterialPublicField]: StoredProfile[K];
};

/**
 * Captures the approved public-profile state at consent time.
 *
 * This walks `MATERIAL_PUBLIC_FIELDS` — the SAME list `materialPublicChange`
 * walks — so the set of fields that invalidates consent and the set of fields
 * recorded at consent cannot drift apart. Adding a field to the list updates
 * both behaviours at once.
 */
export function snapshotMaterialPublicFields(
  profile: Pick<StoredProfile, MaterialPublicField>,
): MaterialPublicSnapshot {
  const snapshot: Record<string, unknown> = {};
  for (const field of MATERIAL_PUBLIC_FIELDS) {
    const value = profile[field];
    // Arrays are copied by value so a later mutation cannot rewrite history.
    snapshot[field] = Array.isArray(value) ? [...value] : value;
  }
  return snapshot as MaterialPublicSnapshot;
}

/**
 * True when the incoming draft changes anything the public would see.
 * Writing values identical to the stored ones is NOT a material change, so an
 * idempotent save never costs a family their consent.
 */
export function materialPublicChange(
  stored: Pick<StoredProfile, MaterialPublicField>,
  draft: NormalisedDraft,
): boolean {
  return MATERIAL_PUBLIC_FIELDS.some(
    (field) => !sameValue(stored[field], draft[field]),
  );
}

/* ------------------------------------------------------------------ *
 * Editorial re-review after a material edit
 * ------------------------------------------------------------------ */

/**
 * Statuses from which a profile can become public again WITHOUT passing back
 * through editorial review.
 *
 * Derived from the Step 1 transition table rather than hand-listed: any status
 * with a direct edge to LIVE can be republished by a single admin action, plus
 * LIVE itself, which is public already. Currently {APPROVED, PAUSED, LIVE}. If
 * Step 1 ever gains or loses an edge into LIVE, this set follows automatically.
 *
 * Every other status (DRAFT, NEEDS_INFO, REJECTED, ARCHIVED, SUBMITTED,
 * UNDER_REVIEW, REMOVED) must travel SUBMITTED -> UNDER_REVIEW -> APPROVED
 * before it can be published, so Taylor necessarily sees the changed content
 * and no hold is needed. Raising one there would put an admin task on every
 * ordinary keystroke of a first-time draft.
 */
export const STATUSES_REPUBLISHABLE_WITHOUT_REVIEW: readonly MatchmakerProfileStatus[] = [
  ...new Set<MatchmakerProfileStatus>([
    ...PROFILE_TRANSITIONS.filter((t) => t.to === PUBLISHED_PROFILE_STATUS).map((t) => t.from),
    PUBLISHED_PROFILE_STATUS,
  ]),
];

/**
 * Taylor's ruling: a family must never change public-facing content and
 * republish it merely by re-consenting. If the profile has already reached a
 * reviewed/publishable state, a material edit re-opens editorial review.
 *
 * `registryReviewed` and `ownershipReviewed` are deliberately NOT reset — they
 * attest that the registry exists and belongs to this family, which a reworded
 * story does not call into question.
 */
export function materialEditRequiresAdminReview(status: MatchmakerProfileStatus): boolean {
  return STATUSES_REPUBLISHABLE_WITHOUT_REVIEW.includes(status);
}

/* ------------------------------------------------------------------ *
 * Public slug (server-generated, never user-supplied)
 * ------------------------------------------------------------------ */

export async function generatePublicSlug(
  repo: MatchmakerRepo,
  displayFirstName: string,
  suffix: () => string,
): Promise<string> {
  const base = slugify(displayFirstName) || 'family';
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = `${base}-${suffix()}`;
    if (!(await repo.isPublicSlugTaken(candidate))) return candidate;
  }
  throw matchmakerError('PUBLIC_SLUG_UNAVAILABLE');
}

/* ------------------------------------------------------------------ *
 * Revival
 * ------------------------------------------------------------------ */

/** Gates that do not block a move into SUBMITTED; publication gating is separate. */
const SUBMISSION_GATES: ProfileReviewGates = {
  registryReviewed: true,
  ownershipReviewed: true,
  needsAdminReview: false,
};

/**
 * Whether an existing profile may be re-submitted by its owner. The answer is
 * taken from the Step 1 transition table, so the service cannot drift from it.
 */
export function canRevive(status: MatchmakerProfileStatus): boolean {
  return canTransitionProfile({
    from: status,
    to: SUBMISSION_TARGET_STATUS,
    actor: 'APPLICANT',
    gates: SUBMISSION_GATES,
  }).ok;
}

/* ------------------------------------------------------------------ *
 * Save (create or revive-in-place)
 * ------------------------------------------------------------------ */

export type SaveApplicationInput = {
  readonly userId: string;
  readonly submittedRegistryUrl: unknown;
  readonly registryName?: string | null;
  readonly draft: ApplicationDraftInput;
  /**
   * REQUIRED when this call creates a profile. Ignored on revival, where the
   * existing profile's provenance is preserved unchanged.
   */
  readonly entryMethod?: MatchmakerEntryMethod;
};

/**
 * Creates a DRAFT profile, or updates the profile already enrolled on the same
 * canonical registry. Never inserts a second profile for one canonical key.
 * This call does NOT change status.
 */
export async function saveApplicationDraft(
  ctx: ServiceContext,
  input: SaveApplicationInput,
): Promise<StoredProfile> {
  const draft = normaliseApplicationDraft(input.draft);

  return ctx.uow.run(async (repo) => {
    if (draft.photoMediaId && !(await repo.mediaExists(draft.photoMediaId))) {
      throw matchmakerError('PHOTO_MEDIA_NOT_FOUND');
    }

    const identity = await resolveRegistryIdentity(repo, {
      userId: input.userId,
      submittedUrl: input.submittedRegistryUrl,
      registryName: input.registryName ?? null,
    });

    if (identity.existingProfile) {
      // decision 23 — revive in place. id, gift history, moderation history,
      // consent records and audit trail are all preserved. `entryMethod` is
      // NEVER patched here: provenance belongs to the original admission.
      const existing = identity.existingProfile;
      const patch: UpdateProfileInput = { ...draft };

      if (materialPublicChange(existing, draft)) {
        // Consent is to a SPECIFIC public profile. If what the public would see
        // changes, that consent no longer describes reality and must be given
        // again. Terms acceptance is a separate act and is left untouched.
        if (existing.publicProfileConsentAt !== null) {
          patch.publicProfileConsentAt = null;
          patch.consentSnapshot = null;
        }

        // ...and re-consent alone must not republish unreviewed content.
        if (materialEditRequiresAdminReview(existing.status)) {
          patch.needsAdminReview = true;
        }
      }

      return repo.updateProfile(existing.id, patch);
    }

    // Provenance must be stated, not guessed — validated before any write.
    const entryMethod = requireEntryMethod(input.entryMethod);

    const publicSlug = await generatePublicSlug(repo, draft.displayFirstName, ctx.slugSuffix);

    const create: CreateProfileInput = {
      userId: input.userId,
      registryId: identity.registry.id,
      registryCanonicalKey: identity.canonical.canonicalKey,
      publicSlug,
      status: INITIAL_PROFILE_STATUS,
      entryMethod,
      ...draft,
    };

    return repo.createProfile(create);
  });
}

/* ------------------------------------------------------------------ *
 * Consent
 * ------------------------------------------------------------------ */

export function validateConsent(consent: MatchmakerConsentInput): void {
  if (consent.acceptTerms !== true) throw matchmakerError('TERMS_NOT_ACCEPTED');
  if (typeof consent.termsVersion !== 'string' || !consent.termsVersion.trim()) {
    throw matchmakerError('TERMS_VERSION_REQUIRED');
  }
  if (consent.consentToPublicProfile !== true) {
    throw matchmakerError('PUBLIC_PROFILE_CONSENT_REQUIRED');
  }
}

/**
 * Records explicit, versioned consent. Timestamps are stamped at the moment
 * consent is actually given — never backfilled, and never inferred from the
 * fact that a form was completed.
 */
export async function recordConsent(
  ctx: ServiceContext,
  input: {
    readonly userId: string;
    readonly profileId: string;
    readonly consent: MatchmakerConsentInput;
  },
): Promise<StoredProfile> {
  validateConsent(input.consent);

  return ctx.uow.run(async (repo) => {
    const profile = await requireOwnedProfile(repo, input.profileId, input.userId);
    const at = ctx.now();

    return repo.updateProfile(profile.id, {
      termsAcceptedAt: at,
      termsVersion: input.consent.termsVersion.trim(),
      publicProfileConsentAt: at,
      consentSnapshot: {
        termsVersion: input.consent.termsVersion.trim(),
        acceptedTermsAt: at.toISOString(),
        consentedToPublicProfileAt: at.toISOString(),
        registryCanonicalKey: profile.registryCanonicalKey,
        storyIsPublicWhenListed: true,
        // The exact public-profile state being approved — all 15 material
        // fields, from the same list that detects material change. No extra
        // fields are recorded: this is the authorised profile surface only.
        publicProfileAtConsent: snapshotMaterialPublicFields(profile),
      },
    });
  });
}

export function consentIsComplete(profile: StoredProfile): boolean {
  return (
    profile.termsAcceptedAt !== null &&
    typeof profile.termsVersion === 'string' &&
    profile.termsVersion.trim().length > 0 &&
    profile.publicProfileConsentAt !== null
  );
}

/* ------------------------------------------------------------------ *
 * Submission
 * ------------------------------------------------------------------ */

async function requireOwnedProfile(
  repo: MatchmakerRepo,
  profileId: string,
  userId: string,
): Promise<StoredProfile> {
  const profile = await repo.findProfileById(profileId);
  if (!profile) throw matchmakerError('PROFILE_NOT_FOUND');
  if (profile.userId !== userId && profile.registryUserId !== userId) {
    throw matchmakerError('NOT_PROFILE_OWNER');
  }
  return profile;
}

/**
 * Moves a profile into review. The target is fixed at SUBMITTED and the move is
 * authorised by the Step 1 rules; there is no parameter by which a caller can
 * request APPROVED or LIVE.
 */
export async function submitApplication(
  ctx: ServiceContext,
  input: {
    readonly userId: string;
    readonly profileId: string;
    /** The currently published terms version, supplied by the trusted caller. */
    readonly requiredTermsVersion: string;
  },
): Promise<StoredProfile> {
  const requiredTermsVersion =
    typeof input.requiredTermsVersion === 'string' ? input.requiredTermsVersion.trim() : '';
  if (!requiredTermsVersion) throw matchmakerError('TERMS_VERSION_REQUIRED');

  return ctx.uow.run(async (repo) => {
    const profile = await requireOwnedProfile(repo, input.profileId, input.userId);

    if (profile.shortStory.trim().length === 0) {
      throw matchmakerError('SHORT_STORY_REQUIRED');
    }

    if (!consentIsComplete(profile)) {
      if (profile.termsAcceptedAt === null) throw matchmakerError('TERMS_NOT_ACCEPTED');
      if (!profile.termsVersion) throw matchmakerError('TERMS_VERSION_REQUIRED');
      throw matchmakerError('PUBLIC_PROFILE_CONSENT_REQUIRED');
    }

    // Accepting an older document is not accepting the current one.
    if (profile.termsVersion?.trim() !== requiredTermsVersion) {
      throw matchmakerError('TERMS_VERSION_OUTDATED', profile.termsVersion ?? 'none');
    }

    const transition = canTransitionProfile({
      from: profile.status,
      to: SUBMISSION_TARGET_STATUS,
      actor: 'APPLICANT',
      gates: SUBMISSION_GATES,
    });

    if (!transition.ok) {
      throw matchmakerError(
        canRevive(profile.status) ? 'TRANSITION_NOT_ALLOWED' : 'PROFILE_NOT_REVIVABLE',
        transition.code,
      );
    }

    return repo.updateProfile(profile.id, { status: transition.value });
  });
}
