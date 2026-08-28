/**
 * The Giver Consultation Benefit — issuance and reversal only.
 *
 * Frozen contract:
 *  - decision 28: gifting a family a TMBC consultation earns the giver one
 *                 complimentary consultation of their own.
 *  - decision 29: issuance requires `type = TMBC_CONSULT` AND
 *                 `status = CONFIRMED` AND `confirmationSource =
 *                 FIRST_PARTY_WEBHOOK`. No other path mints one. The
 *                 `giftEventId @unique` index is the hard idempotency boundary,
 *                 so a redelivered webhook can never mint a second.
 *  - decision 30: reversal revokes an AVAILABLE benefit and NEVER claws back a
 *                 REDEEMED one.
 *
 * The three-condition test is NOT restated here — it is Step 1's
 * `qualifiesForGiverBenefit`. This module only orchestrates persistence.
 *
 * DEFERRED: claiming, `selectedUse`, `redeemedAt`, `bookingRef` and Calendly
 * issuance all belong to Step 12. Nothing here populates those fields.
 */

import { qualifiesForGiverBenefit, resolveBenefitOnReversal } from '@/lib/matchmaker/giftStatus';

import { matchmakerError } from './errors';
import { MATCHMAKER_MODERATION_ACTIONS, recordModerationActionOnce } from './moderation';
import type { MatchmakerRepo, StoredGift, StoredGiverBenefit } from './ports';

export type BenefitIssuanceOutcome =
  | { readonly outcome: 'ISSUED'; readonly benefit: StoredGiverBenefit }
  | { readonly outcome: 'ALREADY_ISSUED'; readonly benefit: StoredGiverBenefit }
  | { readonly outcome: 'NOT_QUALIFIED'; readonly benefit: null };

/**
 * Issues the benefit when — and only when — Step 1 says the gift qualifies.
 * Safe to call repeatedly: an existing benefit is returned untouched.
 */
export async function issueGiverBenefitIfQualified(
  repo: MatchmakerRepo,
  gift: StoredGift,
): Promise<BenefitIssuanceOutcome> {
  if (
    !qualifiesForGiverBenefit({
      type: gift.type,
      status: gift.status,
      confirmationSource: gift.confirmationSource,
    })
  ) {
    return { outcome: 'NOT_QUALIFIED', benefit: null };
  }

  const existing = await repo.findGiverBenefitByGiftId(gift.id);
  if (existing) return { outcome: 'ALREADY_ISSUED', benefit: existing };

  // The benefit belongs to a person, so it needs somewhere to belong to.
  // `MatchmakerGiftEvent.giverEmail` is nullable; the benefit's is not.
  if (!gift.giverEmail || !gift.giverEmail.trim()) {
    throw matchmakerError('GIVER_EMAIL_REQUIRED', 'benefit-issuance');
  }

  const benefit = await repo.createGiverBenefit({
    giftEventId: gift.id,
    giverUserId: gift.giverUserId,
    giverEmail: gift.giverEmail.trim(),
  });

  return { outcome: 'ISSUED', benefit };
}

export type BenefitReversalOutcome = 'REVOKED' | 'ALREADY_REVOKED' | 'FLAGGED_REDEEMED' | 'NONE';

/**
 * Applies a gift reversal to any benefit it produced.
 * A refund never claws back a consultation someone already had — a REDEEMED
 * benefit is preserved and escalated for a human instead.
 */
export async function applyReversalToGiverBenefit(
  repo: MatchmakerRepo,
  input: {
    readonly gift: StoredGift;
    readonly actorUserId: string;
    readonly now: Date;
  },
): Promise<BenefitReversalOutcome> {
  const benefit = await repo.findGiverBenefitByGiftId(input.gift.id);
  if (!benefit) return 'NONE';

  switch (resolveBenefitOnReversal(benefit.status)) {
    case 'REVOKE':
      await repo.updateGiverBenefit(benefit.id, { status: 'REVOKED', revokedAt: input.now });
      return 'REVOKED';

    case 'FLAG_FOR_ADMIN_REVIEW':
      await recordModerationActionOnce(repo, {
        profileId: input.gift.recipientProfileId,
        giftEventId: input.gift.id,
        actorUserId: input.actorUserId,
        action: MATCHMAKER_MODERATION_ACTIONS.BENEFIT_REVERSAL_REVIEW,
        note: 'Originating gift was reversed after the giver benefit was redeemed. Benefit preserved.',
      });
      return 'FLAGGED_REDEEMED';

    default:
      return 'ALREADY_REVOKED';
  }
}
