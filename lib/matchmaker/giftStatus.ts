/**
 * Matchmaker gift-event status transitions — pure.
 *
 * Frozen contract:
 *  - decision 5:  a click is never a gift; a submitted claim is never a gift.
 *  - decision 6:  confirmation is source-agnostic but must be EXPLICIT. Every
 *                 transition into CONFIRMED must carry a MatchmakerConfirmationSource,
 *                 and that source must be legal for both the actor and the gift type.
 *                 A GIVER can never confirm their own gift, so REPORTED_SENT can
 *                 never become CONFIRMED "by implication".
 *  - decision 6c: REVERSED is first class and non-destructive.
 *  - decision 29: the giver benefit is minted only by TMBC_CONSULT + CONFIRMED +
 *                 FIRST_PARTY_WEBHOOK.
 *  - decision 30: reversal revokes an AVAILABLE benefit but never claws back a
 *                 REDEEMED one.
 */

import type {
  MatchmakerConfirmationSource,
  MatchmakerGiftActor,
  MatchmakerGiftStatus,
  MatchmakerGiftType,
  MatchmakerGiverBenefitStatus,
} from './types';
import { domainErr, domainOk, type DomainResult } from './types';

export const GIFT_STATUSES: readonly MatchmakerGiftStatus[] = [
  'STARTED',
  'REPORTED_SENT',
  'AWAITING_RECIPIENT_CONFIRMATION',
  'CONFIRMED',
  'DISPUTED',
  'CANCELED',
  'REVERSED',
];

export const TERMINAL_GIFT_STATUSES: readonly MatchmakerGiftStatus[] = ['CANCELED', 'REVERSED'];

type GiftTransition = {
  readonly from: MatchmakerGiftStatus;
  readonly to: MatchmakerGiftStatus;
  readonly actors: readonly MatchmakerGiftActor[];
};

export const GIFT_TRANSITIONS: readonly GiftTransition[] = [
  { from: 'STARTED', to: 'REPORTED_SENT', actors: ['GIVER', 'ADMIN'] },
  { from: 'STARTED', to: 'CANCELED', actors: ['GIVER', 'ADMIN'] },
  // TMBC Stripe gifts auto-confirm straight from STARTED via the trusted webhook.
  { from: 'STARTED', to: 'CONFIRMED', actors: ['FIRST_PARTY_WEBHOOK', 'ADMIN'] },

  { from: 'REPORTED_SENT', to: 'AWAITING_RECIPIENT_CONFIRMATION', actors: ['SYSTEM', 'ADMIN'] },
  // Admin proof review (external service gifts) confirms directly.
  { from: 'REPORTED_SENT', to: 'CONFIRMED', actors: ['ADMIN'] },
  { from: 'REPORTED_SENT', to: 'DISPUTED', actors: ['RECIPIENT', 'ADMIN'] },
  { from: 'REPORTED_SENT', to: 'CANCELED', actors: ['GIVER', 'ADMIN'] },

  { from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CONFIRMED', actors: ['RECIPIENT', 'ADMIN'] },
  { from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'DISPUTED', actors: ['RECIPIENT', 'ADMIN'] },
  { from: 'AWAITING_RECIPIENT_CONFIRMATION', to: 'CANCELED', actors: ['ADMIN'] },

  { from: 'DISPUTED', to: 'CONFIRMED', actors: ['ADMIN'] },
  { from: 'DISPUTED', to: 'CANCELED', actors: ['ADMIN'] },

  { from: 'CONFIRMED', to: 'REVERSED', actors: ['ADMIN', 'FIRST_PARTY_WEBHOOK'] },
  { from: 'CONFIRMED', to: 'DISPUTED', actors: ['ADMIN'] },
];

/**
 * Which confirmation source each actor is allowed to assert.
 * GIVER and SYSTEM appear nowhere: neither can ever confirm a gift.
 */
const ACTOR_CONFIRMATION_SOURCE: Readonly<
  Partial<Record<MatchmakerGiftActor, MatchmakerConfirmationSource>>
> = {
  RECIPIENT: 'RECIPIENT',
  ADMIN: 'ADMIN',
  FIRST_PARTY_WEBHOOK: 'FIRST_PARTY_WEBHOOK',
};

/**
 * Which confirmation sources each gift type accepts.
 * A BABYLIST_PURCHASE happens on Babylist, so TMBC has no first-party webhook
 * for it and must never claim one.
 */
const GIFT_TYPE_CONFIRMATION_SOURCES: Readonly<
  Record<MatchmakerGiftType, readonly MatchmakerConfirmationSource[]>
> = {
  BABYLIST_PURCHASE: ['RECIPIENT', 'ADMIN'],
  TMBC_CONSULT: ['FIRST_PARTY_WEBHOOK', 'ADMIN'],
  EXTERNAL_SERVICE_GIFT: ['ADMIN', 'RECIPIENT'],
  OTHER_APPROVED: ['ADMIN'],
};

export function confirmationSourcesForGiftType(
  type: MatchmakerGiftType,
): readonly MatchmakerConfirmationSource[] {
  return GIFT_TYPE_CONFIRMATION_SOURCES[type];
}

export function canActorConfirm(actor: MatchmakerGiftActor): boolean {
  return ACTOR_CONFIRMATION_SOURCE[actor] !== undefined;
}

export type GiftTransitionErrorCode =
  | 'UNKNOWN_TRANSITION'
  | 'ACTOR_NOT_PERMITTED'
  | 'CONFIRMATION_SOURCE_REQUIRED'
  | 'ACTOR_CANNOT_CONFIRM'
  | 'CONFIRMATION_SOURCE_MISMATCHES_ACTOR'
  | 'CONFIRMATION_SOURCE_NOT_VALID_FOR_GIFT_TYPE';

export type GiftTransitionRequest = {
  readonly from: MatchmakerGiftStatus;
  readonly to: MatchmakerGiftStatus;
  readonly actor: MatchmakerGiftActor;
  readonly giftType: MatchmakerGiftType;
  /** Required — and only meaningful — when `to` is CONFIRMED. */
  readonly confirmationSource?: MatchmakerConfirmationSource | null;
};

export function canTransitionGift(
  request: GiftTransitionRequest,
): DomainResult<MatchmakerGiftStatus, GiftTransitionErrorCode> {
  const row = GIFT_TRANSITIONS.find((t) => t.from === request.from && t.to === request.to);

  if (!row) {
    return domainErr(
      'UNKNOWN_TRANSITION',
      `No Matchmaker gift transition is defined from ${request.from} to ${request.to}.`,
    );
  }

  if (!row.actors.includes(request.actor)) {
    return domainErr(
      'ACTOR_NOT_PERMITTED',
      `A ${request.actor} may not move a Matchmaker gift from ${request.from} to ${request.to}.`,
    );
  }

  if (request.to === 'CONFIRMED') {
    const source = request.confirmationSource ?? null;

    if (!source) {
      return domainErr(
        'CONFIRMATION_SOURCE_REQUIRED',
        'Confirming a Matchmaker gift requires an explicit confirmation source.',
      );
    }

    const allowedForActor = ACTOR_CONFIRMATION_SOURCE[request.actor];
    if (!allowedForActor) {
      return domainErr(
        'ACTOR_CANNOT_CONFIRM',
        `A ${request.actor} can never confirm a Matchmaker gift.`,
      );
    }

    if (allowedForActor !== source) {
      return domainErr(
        'CONFIRMATION_SOURCE_MISMATCHES_ACTOR',
        `A ${request.actor} may only assert confirmation source ${allowedForActor}, not ${source}.`,
      );
    }

    if (!GIFT_TYPE_CONFIRMATION_SOURCES[request.giftType].includes(source)) {
      return domainErr(
        'CONFIRMATION_SOURCE_NOT_VALID_FOR_GIFT_TYPE',
        `Confirmation source ${source} is not valid for gift type ${request.giftType}.`,
      );
    }
  }

  return domainOk(request.to);
}

export function isGiftTransitionAllowed(request: GiftTransitionRequest): boolean {
  return canTransitionGift(request).ok;
}

/* ------------------------------------------------------------------ *
 * Giver Consultation Benefit (decisions 28-30)
 * ------------------------------------------------------------------ */

export type GiverBenefitSourceGift = {
  readonly type: MatchmakerGiftType;
  readonly status: MatchmakerGiftStatus;
  readonly confirmationSource: MatchmakerConfirmationSource | null;
};

/** decision 29: all three conditions, no other path mints a benefit. */
export function qualifiesForGiverBenefit(gift: GiverBenefitSourceGift): boolean {
  return (
    gift.type === 'TMBC_CONSULT' &&
    gift.status === 'CONFIRMED' &&
    gift.confirmationSource === 'FIRST_PARTY_WEBHOOK'
  );
}

export type ReversalBenefitOutcome = 'REVOKE' | 'FLAG_FOR_ADMIN_REVIEW' | 'NO_ACTION';

/** decision 30: a refund never claws back a consultation someone already had. */
export function resolveBenefitOnReversal(
  benefitStatus: MatchmakerGiverBenefitStatus,
): ReversalBenefitOutcome {
  if (benefitStatus === 'AVAILABLE') return 'REVOKE';
  if (benefitStatus === 'REDEEMED') return 'FLAG_FOR_ADMIN_REVIEW';
  return 'NO_ACTION';
}

export type ReversalInviteOutcome = 'REVOKE_INVITE' | 'FLAG_PROFILE_FOR_ADMIN_REVIEW' | 'NO_ACTION';

/**
 * decision 6c: reversal is never destructive. An unused invite is revoked; an
 * already-redeemed invite flags the resulting profile instead of deleting it.
 */
export function resolveInviteOnReversal(invite: {
  readonly usedAt: Date | null;
  readonly revokedAt: Date | null;
} | null): ReversalInviteOutcome {
  if (!invite) return 'NO_ACTION';
  if (invite.revokedAt) return 'NO_ACTION';
  if (invite.usedAt) return 'FLAG_PROFILE_FOR_ADMIN_REVIEW';
  return 'REVOKE_INVITE';
}
