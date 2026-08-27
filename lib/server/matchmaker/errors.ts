/**
 * Matchmaker service errors.
 *
 * Frozen contract decision 24: a duplicate-registry conflict returns a clean,
 * user/admin-facing domain error. **A raw Prisma unique-constraint violation
 * must never reach a user, an admin, or an API response.**
 *
 * Every failure leaving this service layer is a `MatchmakerServiceError` with a
 * stable `code`. Callers branch on the code; the message is safe to display.
 */

export type MatchmakerServiceErrorCode =
  // registry intake
  | 'REGISTRY_URL_REQUIRED'
  | 'REGISTRY_URL_INVALID'
  | 'REGISTRY_ALREADY_ENROLLED'
  // application content
  | 'DISPLAY_FIRST_NAME_REQUIRED'
  | 'SHORT_STORY_REQUIRED'
  | 'PHOTO_MEDIA_NOT_FOUND'
  // consent
  | 'TERMS_NOT_ACCEPTED'
  | 'TERMS_VERSION_REQUIRED'
  | 'TERMS_VERSION_OUTDATED'
  | 'PUBLIC_PROFILE_CONSENT_REQUIRED'
  // provenance
  | 'ENTRY_METHOD_REQUIRED'
  | 'ENTRY_METHOD_INVALID'
  // lifecycle
  | 'PROFILE_NOT_FOUND'
  | 'PROFILE_NOT_REVIVABLE'
  | 'TRANSITION_NOT_ALLOWED'
  | 'NOT_PROFILE_OWNER'
  | 'ADMIN_REQUIRED'
  // infrastructure, already translated
  | 'PUBLIC_SLUG_UNAVAILABLE'
  | 'PERSISTENCE_CONFLICT'
  | 'CONCURRENT_MODIFICATION';

export class MatchmakerServiceError extends Error {
  readonly code: MatchmakerServiceErrorCode;
  /** Optional machine detail from a lower layer (e.g. a Step 1 domain code). */
  readonly detail?: string;

  constructor(code: MatchmakerServiceErrorCode, message: string, detail?: string) {
    super(message);
    this.name = 'MatchmakerServiceError';
    this.code = code;
    if (detail !== undefined) this.detail = detail;
  }
}

export function isMatchmakerServiceError(error: unknown): error is MatchmakerServiceError {
  return error instanceof MatchmakerServiceError;
}

/**
 * Unique-constraint classification.
 *
 * A `publicSlug` collision is NOT an already-enrolled registry — it is a
 * generated-value collision, retried before insert and reported separately if
 * it still occurs. Only genuine registry-identity conflicts may become
 * REGISTRY_ALREADY_ENROLLED; anything else falls through to a generic
 * persistence conflict rather than being mislabelled.
 *
 * Matched substrings cover both Prisma shapes: the index name
 * (`MatchmakerProfile_registryCanonicalKey_key`) and the bare field name
 * (`registryCanonicalKey`). Order matters — publicSlug is classified first.
 */
const UNIQUE_TARGET_RULES: readonly {
  readonly match: string;
  readonly code: MatchmakerServiceErrorCode;
}[] = [
  { match: 'publicSlug', code: 'PUBLIC_SLUG_UNAVAILABLE' },
  { match: 'registryCanonicalKey', code: 'REGISTRY_ALREADY_ENROLLED' },
  { match: 'registryId', code: 'REGISTRY_ALREADY_ENROLLED' },
];

export function classifyUniqueTarget(
  targets: readonly string[],
): MatchmakerServiceErrorCode | null {
  for (const rule of UNIQUE_TARGET_RULES) {
    if (targets.some((t) => t.includes(rule.match))) return rule.code;
  }
  return null;
}

const MESSAGES: Readonly<Record<MatchmakerServiceErrorCode, string>> = {
  REGISTRY_URL_REQUIRED: 'A Babylist registry link is required.',
  REGISTRY_URL_INVALID: 'That Babylist registry link was not recognised.',
  REGISTRY_ALREADY_ENROLLED:
    'That Babylist registry is already enrolled in the Matchmaker. If it belongs to you, sign in with the account that enrolled it.',
  DISPLAY_FIRST_NAME_REQUIRED: 'A first name is required.',
  SHORT_STORY_REQUIRED: 'A short story is required before submitting.',
  PHOTO_MEDIA_NOT_FOUND: 'That photo could not be found.',
  TERMS_NOT_ACCEPTED: 'The Matchmaker terms must be accepted before submitting.',
  TERMS_VERSION_REQUIRED: 'A terms version is required to record consent.',
  TERMS_VERSION_OUTDATED:
    'The Matchmaker terms have been updated. Please review and accept the current terms before submitting.',
  PUBLIC_PROFILE_CONSENT_REQUIRED:
    'Consent to publish a public profile is required before submitting.',
  ENTRY_METHOD_REQUIRED: 'How this family joined the Matchmaker must be recorded before a listing is created.',
  ENTRY_METHOD_INVALID: 'That is not a recognised Matchmaker entry method.',
  PROFILE_NOT_FOUND: 'That Matchmaker profile could not be found.',
  PROFILE_NOT_REVIVABLE: 'That Matchmaker listing cannot be re-submitted from its current state.',
  TRANSITION_NOT_ALLOWED: 'That change is not allowed from the listing’s current state.',
  NOT_PROFILE_OWNER: 'That Matchmaker listing belongs to a different account.',
  ADMIN_REQUIRED: 'That action requires an administrator.',
  PUBLIC_SLUG_UNAVAILABLE: 'A public link could not be generated. Please try again.',
  PERSISTENCE_CONFLICT: 'That change conflicted with existing data. Please try again.',
  CONCURRENT_MODIFICATION: 'That listing changed while you were editing. Please try again.',
};

export function matchmakerError(
  code: MatchmakerServiceErrorCode,
  detail?: string,
): MatchmakerServiceError {
  return new MatchmakerServiceError(code, MESSAGES[code], detail);
}

type KnownRequestErrorShape = {
  readonly name?: unknown;
  readonly code?: unknown;
  readonly meta?: { readonly target?: unknown };
};

/**
 * Structural detection of a Prisma known-request error, matching the pattern
 * already used in `lib/server/viewTracking.ts` and `lib/server/prismaConnection.ts`.
 * Deliberately structural rather than `instanceof`, so this module — and every
 * service that imports it — has NO runtime dependency on `@prisma/client` and
 * can be unit-tested without a generated client or a database.
 */
function asKnownRequestError(error: unknown): KnownRequestErrorShape | null {
  if (!error || typeof error !== 'object') return null;
  const candidate = error as KnownRequestErrorShape;
  if (typeof candidate.code !== 'string') return null;
  if (candidate.name !== 'PrismaClientKnownRequestError') return null;
  return candidate;
}

/**
 * Translates a Prisma failure into a stable service error.
 * Anything unrecognised is rethrown unchanged so real infrastructure faults are
 * never silently disguised as user-facing validation problems.
 */
export function translatePrismaError(error: unknown): never {
  if (error instanceof MatchmakerServiceError) throw error;

  const known = asKnownRequestError(error);
  if (known) {
    if (known.code === 'P2002') {
      const target = known.meta?.target;
      const names = Array.isArray(target)
        ? target.map(String)
        : typeof target === 'string'
          ? [target]
          : [];

      const classified = classifyUniqueTarget(names);
      if (classified) {
        throw matchmakerError(classified, `prisma:P2002:${names.join(',')}`);
      }

      // An unrecognised unique constraint is a persistence conflict. It is
      // deliberately NOT reported as an enrolled registry, which would tell a
      // family something false about who owns their registry.
      throw matchmakerError('PERSISTENCE_CONFLICT', `prisma:P2002:${names.join(',') || 'unknown'}`);
    }

    if (known.code === 'P2025') {
      throw matchmakerError('CONCURRENT_MODIFICATION', 'prisma:P2025');
    }
  }

  throw error;
}
