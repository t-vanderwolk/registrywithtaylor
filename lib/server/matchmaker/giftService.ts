/**
 * Gift event orchestration — create, report, confirm.
 *
 * CONFIRMATION IS THE TRUST BOUNDARY. Everything in this module exists to keep
 * that boundary honest:
 *
 *  - decision 5:  a click is never a gift; a submitted claim is never a gift.
 *                 `createGiftEvent` lands in STARTED and `reportGiftSent` in
 *                 REPORTED_SENT. Neither writes `confirmedAt`, and neither can:
 *                 the only function that sets it is `confirmGift`.
 *  - decision 6:  confirmation is source-agnostic but must be EXPLICIT and
 *                 legal for the actor AND the gift type. That policy is Step 1's
 *                 `canTransitionGift` — this module does not restate it, so
 *                 there is exactly one confirmation policy table in the codebase.
 *  - decision 6d: `amountCents` is informational. It is stored, and it is read
 *                 by nothing here.
 *
 * DEFERRED: the Stripe checkout + webhook route is Step 11; it will call
 * `confirmGift` with actor FIRST_PARTY_WEBHOOK. Tot Squad provider mechanics
 * are Step 13. Notification delivery is Step 14. No route, API or UI here.
 */

import { canTransitionGift } from '@/lib/matchmaker/giftStatus';
import type {
  MatchmakerConfirmationSource,
  MatchmakerGiftActor,
  MatchmakerGiftType,
} from '@/lib/matchmaker/types';

import { matchmakerError } from './errors';
import { issueGiverBenefitIfQualified, type BenefitIssuanceOutcome } from './giverBenefitService';
import type { MatchmakerRepo, ServiceContext, StoredGift, UpdateGiftInput } from './ports';

/* ------------------------------------------------------------------ *
 * Creation — never confirmation
 * ------------------------------------------------------------------ */

export type CreateGiftEventInput = {
  readonly recipientProfileId: string;
  readonly type: MatchmakerGiftType;
  /** PRIVATE. Retained by TMBC, never published (decision 16). */
  readonly giverEmail?: string | null;
  readonly giverUserId?: string | null;
  readonly giverName?: string | null;
  readonly anonymousToPublic?: boolean;
  readonly anonymousToRecipient?: boolean;
  readonly externalItemLabel?: string | null;
  /** Informational only. Never affects eligibility or benefit issuance. */
  readonly amountCents?: number | null;
  readonly noteToFamily?: string | null;
  /** Provider-agnostic stable keys for EXTERNAL_SERVICE_GIFT. */
  readonly externalProvider?: string | null;
  readonly externalGiftKind?: string | null;
};

const text = (v: unknown): string | null =>
  typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;

/**
 * Opens a gift event against a recipient profile. Always lands in STARTED.
 * A click, an affiliate redirect, or a typed dollar amount produces one of
 * these — and nothing more.
 */
export async function createGiftEvent(
  ctx: ServiceContext,
  input: CreateGiftEventInput,
): Promise<StoredGift> {
  return ctx.uow.run(async (repo) => {
    const profile = await repo.findProfileById(input.recipientProfileId);
    if (!profile) throw matchmakerError('PROFILE_NOT_FOUND');

    return repo.createGift({
      recipientProfileId: profile.id,
      giverUserId: input.giverUserId ?? null,
      giverEmail: text(input.giverEmail),
      giverName: text(input.giverName),
      anonymousToPublic: input.anonymousToPublic === true,
      anonymousToRecipient: input.anonymousToRecipient === true,
      type: input.type,
      status: 'STARTED',
      externalItemLabel: text(input.externalItemLabel),
      amountCents: typeof input.amountCents === 'number' ? input.amountCents : null,
      noteToFamily: text(input.noteToFamily),
      externalProvider: text(input.externalProvider),
      externalGiftKind: text(input.externalGiftKind),
    });
  });
}

/* ------------------------------------------------------------------ *
 * Reporting — still not confirmation
 * ------------------------------------------------------------------ */

export type ReportGiftSentInput = {
  readonly giftId: string;
  readonly actor: MatchmakerGiftActor;
  readonly externalOrderRef?: string | null;
  readonly proofPurchaseDate?: Date | null;
  readonly proofNote?: string | null;
};

/**
 * Records that a giver says an off-site gift was sent. The transition is
 * authorised by Step 1, and the resulting status is REPORTED_SENT — a claim,
 * not evidence. `confirmedAt` and `confirmationSource` stay null.
 */
export async function reportGiftSent(
  ctx: ServiceContext,
  input: ReportGiftSentInput,
): Promise<StoredGift> {
  return ctx.uow.run(async (repo) => {
    const gift = await requireGift(repo, input.giftId);

    const transition = canTransitionGift({
      from: gift.status,
      to: 'REPORTED_SENT',
      actor: input.actor,
      giftType: gift.type,
    });
    if (!transition.ok) {
      throw matchmakerError('GIFT_TRANSITION_NOT_ALLOWED', transition.code);
    }

    const hasProof =
      Boolean(text(input.externalOrderRef)) ||
      Boolean(text(input.proofNote)) ||
      input.proofPurchaseDate instanceof Date;

    return repo.updateGift(gift.id, {
      status: transition.value,
      reportedAt: ctx.now(),
      externalOrderRef: text(input.externalOrderRef),
      proofNote: text(input.proofNote),
      proofPurchaseDate: input.proofPurchaseDate ?? null,
      // Structured proof only — the schema stores no receipt image, by design.
      proofStatus: hasProof ? 'SUBMITTED' : 'NOT_PROVIDED',
    });
  });
}

/* ------------------------------------------------------------------ *
 * Confirmation — the trust boundary
 * ------------------------------------------------------------------ */

export type ConfirmGiftInput = {
  readonly giftId: string;
  readonly actor: MatchmakerGiftActor;
  readonly confirmationSource: MatchmakerConfirmationSource;
};

export type ConfirmGiftResult = {
  readonly gift: StoredGift;
  /** True when this call performed the transition rather than replaying it. */
  readonly transitioned: boolean;
  readonly benefit: BenefitIssuanceOutcome;
};

async function requireGift(repo: MatchmakerRepo, giftId: string): Promise<StoredGift> {
  const gift = await repo.findGiftById(giftId);
  if (!gift) throw matchmakerError('GIFT_NOT_FOUND');
  return gift;
}

/**
 * Confirms a gift, idempotently.
 *
 *  - Already CONFIRMED via the SAME source → success, no second transition and
 *    no duplicate side effects. Safe under redelivered webhooks, double-clicks
 *    and two admins acting at once.
 *  - Already CONFIRMED via a DIFFERENT source → GIFT_CONFIRMATION_CONFLICT.
 *    Never silently overwritten; a human decides.
 *  - Otherwise Step 1 authorises the transition, or it does not happen.
 *
 * Side effect on success: the giver benefit is issued when Step 1 says the gift
 * qualifies. Invitations are deliberately NOT issued here — see
 * `inviteService.issueInviteForConfirmedGift` and the Step 3 report.
 */
export async function confirmGift(
  ctx: ServiceContext,
  input: ConfirmGiftInput,
): Promise<ConfirmGiftResult> {
  return ctx.uow.run(async (repo) => {
    const gift = await requireGift(repo, input.giftId);

    if (gift.status === 'CONFIRMED') {
      if (gift.confirmationSource !== input.confirmationSource) {
        throw matchmakerError('GIFT_CONFIRMATION_CONFLICT', gift.confirmationSource ?? 'none');
      }
      // Replay: re-run the idempotent side effect so a first attempt that
      // failed part-way still converges, then report no transition.
      const benefit = await issueGiverBenefitIfQualified(repo, gift);
      return { gift, transitioned: false, benefit };
    }

    const transition = canTransitionGift({
      from: gift.status,
      to: 'CONFIRMED',
      actor: input.actor,
      giftType: gift.type,
      confirmationSource: input.confirmationSource,
    });
    if (!transition.ok) {
      throw matchmakerError('GIFT_CONFIRMATION_NOT_PERMITTED', transition.code);
    }

    const at = ctx.now();
    const patch: UpdateGiftInput = {
      status: transition.value,
      confirmedAt: at,
      confirmationSource: input.confirmationSource,
    };
    if (input.confirmationSource === 'RECIPIENT') patch.recipientConfirmedAt = at;
    if (input.confirmationSource === 'ADMIN') patch.adminConfirmedAt = at;

    const confirmed = await repo.updateGift(gift.id, patch);
    const benefit = await issueGiverBenefitIfQualified(repo, confirmed);

    return { gift: confirmed, transitioned: true, benefit };
  });
}
