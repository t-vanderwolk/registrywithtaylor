/**
 * Gift reversal — non-destructive by construction.
 *
 * Frozen contract decision 6c: a previously confirmed gift that is later
 * refunded, charged back, invalidated or administratively reversed becomes
 * REVERSED. Eligibility is exactly `status === CONFIRMED`, so a reversed gift
 * stops qualifying automatically — no separate revocation of eligibility is
 * needed or performed.
 *
 * Reversal handling is NEVER destructive:
 *   - an UNUSED invite is revoked, not deleted;
 *   - a USED invite is left intact and the profile it admitted is flagged for
 *     admin review — a refund must never cascade into deleting a family's
 *     participation, profile or history;
 *   - an AVAILABLE benefit is revoked; a REDEEMED one is preserved (decision 30).
 *
 * Every branch is idempotent, so a retried reversal converges rather than
 * piling up duplicate audit rows.
 *
 * DEFERRED: money movement, refund initiation, Calendly cancellation and any
 * collection logic are explicitly NOT modelled here and are not planned for
 * this layer.
 */

import { canTransitionGift, resolveInviteOnReversal } from '@/lib/matchmaker/giftStatus';
import type { MatchmakerGiftActor } from '@/lib/matchmaker/types';

import { matchmakerError } from './errors';
import { applyReversalToGiverBenefit, type BenefitReversalOutcome } from './giverBenefitService';
import { MATCHMAKER_MODERATION_ACTIONS, recordModerationActionOnce } from './moderation';
import type { MatchmakerRepo, ServiceContext, StoredGift } from './ports';

export type InviteReversalOutcome =
  | 'NO_INVITE'
  | 'INVITE_REVOKED'
  | 'INVITE_ALREADY_REVOKED'
  | 'ADMITTED_PROFILE_FLAGGED';

export type ReverseGiftResult = {
  readonly gift: StoredGift;
  /** True when this call performed the transition rather than replaying it. */
  readonly transitioned: boolean;
  readonly invite: InviteReversalOutcome;
  readonly benefit: BenefitReversalOutcome;
  readonly moderationActionCreated: boolean;
};

export type ReverseGiftInput = {
  readonly giftId: string;
  readonly actor: MatchmakerGiftActor;
  readonly actorUserId: string;
  readonly reason?: string | null;
};

async function cascadeInvite(
  repo: MatchmakerRepo,
  gift: StoredGift,
  actorUserId: string,
  now: Date,
): Promise<{ outcome: InviteReversalOutcome; moderationActionCreated: boolean }> {
  const invite = await repo.findInviteByOriginGiftId(gift.id);

  switch (resolveInviteOnReversal(invite && { usedAt: invite.usedAt, revokedAt: invite.revokedAt })) {
    case 'REVOKE_INVITE': {
      if (!invite) return { outcome: 'NO_INVITE', moderationActionCreated: false };
      await repo.updateInvite(invite.id, { revokedAt: now });
      return { outcome: 'INVITE_REVOKED', moderationActionCreated: false };
    }

    case 'FLAG_PROFILE_FOR_ADMIN_REVIEW': {
      if (!invite) return { outcome: 'NO_INVITE', moderationActionCreated: false };

      // The invite already admitted someone. Their profile stays; it is flagged
      // so a person decides, and the flag removes it from public view via the
      // Step 2 publication gate.
      const admitted = await repo.findProfileByAdmissionInviteId(invite.id);
      if (!admitted) {
        // Used but not linked to a profile yet — nothing to flag, nothing to undo.
        return { outcome: 'INVITE_ALREADY_REVOKED', moderationActionCreated: false };
      }

      if (!admitted.needsAdminReview) {
        await repo.updateProfile(admitted.id, { needsAdminReview: true });
      }

      const created = await recordModerationActionOnce(repo, {
        profileId: admitted.id,
        giftEventId: gift.id,
        actorUserId,
        action: MATCHMAKER_MODERATION_ACTIONS.REVERSAL_REVIEW,
        note: 'The gift that unlocked this admission was reversed. Profile retained and flagged for review.',
      });

      return { outcome: 'ADMITTED_PROFILE_FLAGGED', moderationActionCreated: created };
    }

    default:
      return {
        outcome: invite ? 'INVITE_ALREADY_REVOKED' : 'NO_INVITE',
        moderationActionCreated: false,
      };
  }
}

/**
 * Reverses a confirmed gift and applies every downstream consequence.
 *
 * Replaying the call on an already-REVERSED gift skips the transition but
 * re-runs the cascade, so a reversal interrupted part-way converges on retry
 * without duplicating anything.
 */
export async function reverseGift(
  ctx: ServiceContext,
  input: ReverseGiftInput,
): Promise<ReverseGiftResult> {
  return ctx.uow.run(async (repo) => {
    const gift = await repo.findGiftById(input.giftId);
    if (!gift) throw matchmakerError('GIFT_NOT_FOUND');

    const now = ctx.now();
    let current = gift;
    let transitioned = false;

    if (gift.status !== 'REVERSED') {
      const transition = canTransitionGift({
        from: gift.status,
        to: 'REVERSED',
        actor: input.actor,
        giftType: gift.type,
      });
      if (!transition.ok) {
        throw matchmakerError('GIFT_REVERSAL_NOT_PERMITTED', transition.code);
      }

      current = await repo.updateGift(gift.id, {
        status: transition.value,
        reversedAt: now,
        reversalReason:
          typeof input.reason === 'string' && input.reason.trim() ? input.reason.trim() : null,
      });
      transitioned = true;
    }

    const invite = await cascadeInvite(repo, current, input.actorUserId, now);
    const benefit = await applyReversalToGiverBenefit(repo, {
      gift: current,
      actorUserId: input.actorUserId,
      now,
    });

    return {
      gift: current,
      transitioned,
      invite: invite.outcome,
      benefit,
      moderationActionCreated: invite.moderationActionCreated,
    };
  });
}
