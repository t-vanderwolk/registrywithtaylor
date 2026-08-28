/**
 * Matchmaker moderation audit trail — Step 3.
 *
 * AUDIT FINDING: `MatchmakerModerationAction.action` is a plain `String` in the
 * deployed schema — there is no moderation-action enum to reuse. These stable
 * constants are therefore the single source of truth for the values written,
 * so no caller ever writes a free-text action string.
 *
 * CONCURRENCY: the table carries no unique constraint over
 * (profileId, giftEventId, action) — but its PRIMARY KEY is a plain `TEXT`
 * column that Prisma lets a caller supply explicitly despite `@default(cuid())`
 * (verified against the generated `UncheckedCreateInput`). System-generated
 * actions therefore use a DETERMINISTIC id derived from exactly those three
 * fields, which promotes the existing primary key into the idempotency
 * boundary. Two genuinely simultaneous cascades compute the same id, one insert
 * wins, and the loser's primary-key collision is reported as "already
 * recorded" rather than raised. No schema change, no migration, no new index.
 */

import { createHash } from 'node:crypto';

import type { CreateModerationActionInput, MatchmakerRepo } from './ports';

export const MATCHMAKER_MODERATION_ACTIONS = {
  /** Contract decision 6c — a reversal landed on an already-admitted profile. */
  REVERSAL_REVIEW: 'REVERSAL_REVIEW',
  /** A redeemed giver benefit survived a reversal and needs a human look. */
  BENEFIT_REVERSAL_REVIEW: 'BENEFIT_REVERSAL_REVIEW',
} as const;

export type MatchmakerModerationAction =
  (typeof MATCHMAKER_MODERATION_ACTIONS)[keyof typeof MATCHMAKER_MODERATION_ACTIONS];

export type ModerationActionIdentity = {
  readonly profileId: string;
  readonly giftEventId: string | null;
  readonly action: string;
};

/**
 * The deterministic primary key for a system-generated moderation action.
 *
 * Derived from EXACTLY the three fields that define the action's identity.
 * Deliberately excludes emails, names, reason/note text and every other piece
 * of personal data — and hashes the internal ids rather than concatenating
 * them, so the key does not carry readable record identifiers.
 *
 * The separator is a NUL byte, which cannot occur inside a cuid or an action
 * constant, so distinct triples cannot collide by concatenation.
 */
export function moderationActionIdFor(identity: ModerationActionIdentity): string {
  const digest = createHash('sha256')
    .update([identity.profileId, identity.giftEventId ?? '', identity.action].join('\u0000'), 'utf8')
    .digest('hex');
  return `mma_${digest.slice(0, 40)}`;
}

export type RecordModerationActionInput = Omit<CreateModerationActionInput, 'id'>;

/**
 * Records the action at most once for a given (profile, gift, action).
 *
 * Two guards, deliberately layered:
 *   1. a read first, so the ordinary sequential replay costs no failed insert;
 *   2. the deterministic primary key, which is what actually holds under two
 *      simultaneous transactions — where the read is not enough, because both
 *      can observe "absent" before either writes.
 *
 * Returns true only when THIS call created the row.
 */
export async function recordModerationActionOnce(
  repo: MatchmakerRepo,
  input: RecordModerationActionInput,
): Promise<boolean> {
  const identity: ModerationActionIdentity = {
    profileId: input.profileId,
    giftEventId: input.giftEventId,
    action: input.action,
  };

  if (await repo.hasModerationAction(identity)) return false;

  return repo.createModerationAction({ ...input, id: moderationActionIdFor(identity) });
}
