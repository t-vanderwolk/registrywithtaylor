/**
 * Invitation issuance, validation and consumption — server primitives only.
 *
 * Frozen contract decision 7: invites are hashed, single-use and expiring.
 * Decision 16: no fully untraceable submissions — the intended email is always
 * recorded privately.
 *
 * SECURITY: the raw token exists only in memory, and only inside the single
 * call that mints it. Nothing else can recover it — `tokenHash` is a one-way
 * SHA-256 (Step 1's `hashInviteToken`).
 *
 * That has a consequence this contract states plainly rather than papers over:
 *
 *   THE RAW TOKEN IS AVAILABLE ONLY ON FIRST ISSUANCE.
 *   A later call can identify the existing invite but cannot recover its token.
 *   RE-ISSUE IS NOT IMPLEMENTED IN STEP 3.
 *
 * `originGiftEventId` is @unique, so revoking an invite does NOT free that slot
 * — a revoked row still occupies it, and a subsequent issuance call returns
 * that revoked invite with `rawToken: null`. Recovering from a failed delivery
 * therefore needs token rotation on the existing row, which is deliberately
 * deferred to a later trusted admin/notification design. Nothing here should be
 * read as promising it works today.
 *
 * EXPIRATION IS NOT DECIDED HERE. Step 1's helper has its own default, but this
 * service refuses to let a silent 14 days become private-beta policy: the
 * trusted caller must state the TTL explicitly.
 *
 * DEFERRED: onboarding UI and profile creation on admission are Step 7; email
 * delivery of the token is Step 14. No route, no email, no profile creation here.
 */

import {
  checkInviteUsable,
  computeInviteExpiry,
  hashInviteToken,
  inviteEmailMatches,
} from '@/lib/matchmaker/invite';
import { isQualifyingGift } from '@/lib/matchmaker/eligibility';

import { matchmakerError, type MatchmakerServiceErrorCode } from './errors';
import type { MatchmakerRepo, ServiceContext, StoredInvite } from './ports';

/** Step 1 rejection codes → stable service codes. */
const REJECTION_TO_SERVICE: Readonly<Record<string, MatchmakerServiceErrorCode>> = {
  INVITE_REVOKED: 'INVITE_REVOKED',
  INVITE_ALREADY_USED: 'INVITE_ALREADY_USED',
  INVITE_EXPIRED: 'INVITE_EXPIRED',
};

export type IssueInviteResult = {
  readonly invite: StoredInvite;
  /** Present ONLY on first issuance. Deliver it now or lose it. */
  readonly rawToken: string | null;
  readonly alreadyIssued: boolean;
};

export type IssueInviteInput = {
  readonly giftId: string;
  /**
   * REQUIRED. How many days the invitation stays usable. There is no service
   * default: the expiry policy for the private beta is a product decision, and
   * a trusted caller states it. Must be a positive, finite whole number.
   */
  readonly ttlDays: number;
};

/** Guards the caller-supplied expiration policy before anything is written. */
export function resolveInviteTtlHours(ttlDays: unknown): number {
  if (typeof ttlDays !== 'number' || !Number.isFinite(ttlDays)) {
    throw matchmakerError('INVITE_TTL_REQUIRED');
  }
  if (!Number.isInteger(ttlDays) || ttlDays <= 0 || ttlDays > 365) {
    throw matchmakerError('INVITE_TTL_INVALID', String(ttlDays));
  }
  return ttlDays * 24;
}

/**
 * Issues the invitation a qualifying confirmed gift unlocks.
 *
 * Qualification is Step 1's `isQualifyingGift` — exactly `status === CONFIRMED`.
 * No amount threshold exists to consult. A reversed gift fails that test by
 * construction, because REVERSED is not CONFIRMED.
 *
 * `originGiftEventId @unique` is the hard idempotency boundary: a second call
 * returns the existing invite rather than minting a rival one.
 */
export async function issueInviteForConfirmedGift(
  ctx: ServiceContext,
  input: IssueInviteInput,
): Promise<IssueInviteResult> {
  // Validate the expiration policy up front — before any read or write.
  const ttlHours = resolveInviteTtlHours(input.ttlDays);

  return ctx.uow.run(async (repo) => {
    const gift = await repo.findGiftById(input.giftId);
    if (!gift) throw matchmakerError('GIFT_NOT_FOUND');

    const existing = await repo.findInviteByOriginGiftId(gift.id);
    if (existing) return { invite: existing, rawToken: null, alreadyIssued: true };

    if (!isQualifyingGift({ status: gift.status })) {
      throw matchmakerError('GIFT_NOT_ELIGIBLE_FOR_INVITE', gift.status);
    }

    const email = gift.giverEmail?.trim();
    if (!email) throw matchmakerError('GIVER_EMAIL_REQUIRED', 'invite-issuance');

    const rawToken = ctx.inviteToken();
    const invite = await repo.createInvite({
      tokenHash: hashInviteToken(rawToken),
      email,
      // The giver gave first; this invites them to apply in their own right.
      reason: 'GIFTED_FIRST',
      originGiftEventId: gift.id,
      nominatedById: null,
      expiresAt: computeInviteExpiry(ctx.now(), ttlHours),
    });

    return { invite, rawToken, alreadyIssued: false };
  });
}

/* ------------------------------------------------------------------ *
 * Validation and consumption
 * ------------------------------------------------------------------ */

function assertUsable(invite: StoredInvite, now: Date): void {
  const check = checkInviteUsable(
    { expiresAt: invite.expiresAt, usedAt: invite.usedAt, revokedAt: invite.revokedAt },
    now,
  );
  if (!check.ok) {
    throw matchmakerError(REJECTION_TO_SERVICE[check.code] ?? 'INVITE_INVALID', check.code);
  }
}

async function resolveInvite(repo: MatchmakerRepo, rawToken: unknown): Promise<StoredInvite> {
  if (typeof rawToken !== 'string' || rawToken.trim().length === 0) {
    throw matchmakerError('INVITE_INVALID', 'empty-token');
  }
  const invite = await repo.findInviteByTokenHash(hashInviteToken(rawToken));
  // An unknown token and a malformed one are reported identically, so the
  // error cannot be used to probe which tokens exist.
  if (!invite) throw matchmakerError('INVITE_INVALID', 'unknown-token');
  return invite;
}

export type ValidateInviteInput = {
  readonly rawToken: string;
  /** When supplied, must match the invited address (decision 16). */
  readonly presentedEmail?: string | null;
};

/** Read-only check. Throws a stable error for every unusable state. */
export async function validateInviteToken(
  ctx: ServiceContext,
  input: ValidateInviteInput,
): Promise<StoredInvite> {
  return ctx.uow.run(async (repo) => {
    const invite = await resolveInvite(repo, input.rawToken);
    assertUsable(invite, ctx.now());

    if (input.presentedEmail != null && !inviteEmailMatches(invite.email, input.presentedEmail)) {
      throw matchmakerError('INVITE_EMAIL_MISMATCH');
    }
    return invite;
  });
}

export type ConsumeInviteInput = ValidateInviteInput & {
  readonly usedByUserId: string;
};

/**
 * Marks an invite used, once. The usability check and the write happen in the
 * same transaction, so a double-click or a replayed request finds the invite
 * already used and is rejected rather than admitting twice.
 *
 * DEFERRED: creating the admitted profile and linking `admissionInviteId`
 * belongs to the onboarding/application layer (Step 7). This only consumes.
 */
export async function consumeInvite(
  ctx: ServiceContext,
  input: ConsumeInviteInput,
): Promise<StoredInvite> {
  return ctx.uow.run(async (repo) => {
    const invite = await resolveInvite(repo, input.rawToken);
    assertUsable(invite, ctx.now());

    if (input.presentedEmail != null && !inviteEmailMatches(invite.email, input.presentedEmail)) {
      throw matchmakerError('INVITE_EMAIL_MISMATCH');
    }

    return repo.updateInvite(invite.id, {
      usedAt: ctx.now(),
      usedByUserId: input.usedByUserId,
    });
  });
}

/** Revocation is idempotent; an already-revoked invite is returned unchanged. */
export async function revokeInvite(
  ctx: ServiceContext,
  input: { readonly inviteId: string },
): Promise<StoredInvite> {
  return ctx.uow.run(async (repo) => {
    const invite = await repo.findInviteById(input.inviteId);
    if (!invite) throw matchmakerError('INVITE_NOT_FOUND');
    if (invite.revokedAt) return invite;
    return repo.updateInvite(invite.id, { revokedAt: ctx.now() });
  });
}
