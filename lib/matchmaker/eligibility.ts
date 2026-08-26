/**
 * Matchmaker eligibility — pure.
 *
 * Frozen contract:
 *  - decision 5:  only CONFIRMED gift events count. A click is never a gift;
 *                 a submitted claim is never a gift.
 *  - decision 6:  the rule reads EXACTLY `gift.status === 'CONFIRMED'`, and is
 *                 source-agnostic (recipient / admin / first-party webhook).
 *  - decision 6c: REVERSED is a first-class outcome, so a reversed gift stops
 *                 qualifying automatically — no extra branch needed.
 *  - decision 6d: "Gift value does not determine a family's worth or a giver's
 *                 standing." There is NO minimum-spend threshold anywhere.
 *
 * This module therefore reads exactly one field. It does not accept, import, or
 * reference any monetary value; `eligibility.test.ts` asserts that the compiled
 * source contains no amount token at all.
 */

import type { MatchmakerEntryMethod, MatchmakerGiftStatus } from './types';

/** The one and only qualifying status. */
export const QUALIFYING_GIFT_STATUS: MatchmakerGiftStatus = 'CONFIRMED';

/** The only field eligibility is permitted to read off a gift event. */
export type EligibilityGift = { readonly status: MatchmakerGiftStatus };

export function isQualifyingGift(gift: EligibilityGift): boolean {
  return gift.status === QUALIFYING_GIFT_STATUS;
}

export function countQualifyingGifts(gifts: readonly EligibilityGift[]): number {
  let n = 0;
  for (const gift of gifts) {
    if (isQualifyingGift(gift)) n += 1;
  }
  return n;
}

export function hasQualifyingGift(gifts: readonly EligibilityGift[]): boolean {
  return gifts.some(isQualifyingGift);
}

export type GiftEligibilityReason = 'HAS_CONFIRMED_GIFT' | 'NO_CONFIRMED_GIFT';

export type GiftEligibilityDecision = {
  readonly eligible: boolean;
  readonly qualifyingGiftCount: number;
  readonly reason: GiftEligibilityReason;
};

export function evaluateGiftEligibility(
  gifts: readonly EligibilityGift[],
): GiftEligibilityDecision {
  const qualifyingGiftCount = countQualifyingGifts(gifts);
  const eligible = qualifyingGiftCount > 0;
  return {
    eligible,
    qualifyingGiftCount,
    reason: eligible ? 'HAS_CONFIRMED_GIFT' : 'NO_CONFIRMED_GIFT',
  };
}

/* ------------------------------------------------------------------ *
 * Admission (may this person apply to be listed?)
 * ------------------------------------------------------------------ */

/**
 * Decision 15: "Recipient is never obligated to give; gift-first applies only
 * to voluntary self-listing." Decision 7: TMBC_NOMINATED bypasses gift-first.
 *
 * So only GIFTED_FIRST — the lane whose whole premise is "I gave first" —
 * requires a confirmed gift on file.
 */
export const ENTRY_METHODS_REQUIRING_CONFIRMED_GIFT: readonly MatchmakerEntryMethod[] = [
  'GIFTED_FIRST',
];

export function entryMethodRequiresConfirmedGift(
  entryMethod: MatchmakerEntryMethod,
): boolean {
  return ENTRY_METHODS_REQUIRING_CONFIRMED_GIFT.includes(entryMethod);
}

export type AdmissionEligibilityReason =
  | 'HAS_CONFIRMED_GIFT'
  | 'NO_CONFIRMED_GIFT'
  | 'GIFT_NOT_REQUIRED_FOR_ENTRY_METHOD';

export type AdmissionEligibilityDecision = {
  readonly eligible: boolean;
  readonly qualifyingGiftCount: number;
  readonly reason: AdmissionEligibilityReason;
};

export function evaluateAdmissionEligibility(input: {
  readonly entryMethod: MatchmakerEntryMethod;
  readonly gifts: readonly EligibilityGift[];
}): AdmissionEligibilityDecision {
  const qualifyingGiftCount = countQualifyingGifts(input.gifts);

  if (!entryMethodRequiresConfirmedGift(input.entryMethod)) {
    return {
      eligible: true,
      qualifyingGiftCount,
      reason: 'GIFT_NOT_REQUIRED_FOR_ENTRY_METHOD',
    };
  }

  const eligible = qualifyingGiftCount > 0;
  return {
    eligible,
    qualifyingGiftCount,
    reason: eligible ? 'HAS_CONFIRMED_GIFT' : 'NO_CONFIRMED_GIFT',
  };
}
