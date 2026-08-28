import { describe, expect, it } from 'vitest';

import { GIFT_STATUSES } from '@/lib/matchmaker/giftStatus';

import { saveApplicationDraft } from '../applicationService';
import { isMatchmakerServiceError, type MatchmakerServiceError } from '../errors';
import { confirmGift, createGiftEvent, reportGiftSent } from '../giftService';
import { createTestContext, emptyState, type InMemoryState } from './inMemoryRepo';

/* Synthetic fixtures only — no real people, emails or registries. */
const GIVER_EMAIL = 'giver@example.test';
const RECIPIENT_USER = 'user_recipient';

async function seedProfile(state: InMemoryState) {
  const ctx = createTestContext(state);
  const profile = await saveApplicationDraft(ctx, {
    userId: RECIPIENT_USER,
    entryMethod: 'TMBC_NOMINATED',
    submittedRegistryUrl: 'https://my.babylist.com/samplefamily',
    draft: { displayFirstName: 'Ada', shortStory: 'Our story.' },
  });
  return { ctx, profileId: profile.id };
}

async function code(fn: () => Promise<unknown>): Promise<string> {
  try { await fn(); return 'NO_ERROR'; }
  catch (e) { return isMatchmakerServiceError(e) ? e.code : `UNEXPECTED:${String(e)}`; }
}

describe('gift creation — a click is never a gift', () => {
  it('always lands in STARTED, never confirmed', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE',
      giverEmail: GIVER_EMAIL, amountCents: 9_999_99,
    });
    expect(gift.status).toBe('STARTED');
    expect(gift.confirmedAt).toBeNull();
    expect(gift.confirmationSource).toBeNull();
    expect(gift.reportedAt).toBeNull();
  });

  it('a large amount confers nothing', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const rich = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', amountCents: 500_000_00,
    });
    const tiny = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', amountCents: 1,
    });
    expect(rich.status).toBe(tiny.status);
    expect(rich.confirmedAt).toBeNull();
  });

  it('an unknown recipient profile creates nothing', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => createGiftEvent(ctx, {
      recipientProfileId: 'nope', type: 'BABYLIST_PURCHASE',
    }))).toBe('PROFILE_NOT_FOUND');
    expect(state.gifts).toHaveLength(0);
  });

  it('keeps giver identity private on the record, not public', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE',
      giverEmail: GIVER_EMAIL, giverName: 'A Giver', anonymousToPublic: true,
    });
    expect(gift.giverEmail).toBe(GIVER_EMAIL);
    expect(gift.anonymousToPublic).toBe(true);
  });
});

describe('gift reporting — a claim is not evidence', () => {
  it('the giver may report sent, and it does NOT confirm', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
    });
    const reported = await reportGiftSent(ctx, {
      giftId: gift.id, actor: 'GIVER', externalOrderRef: 'ORDER-123',
    });
    expect(reported.status).toBe('REPORTED_SENT');
    expect(reported.reportedAt).not.toBeNull();
    expect(reported.confirmedAt).toBeNull();
    expect(reported.confirmationSource).toBeNull();
    expect(reported.proofStatus).toBe('SUBMITTED');
  });

  it('a report with no structured proof stays NOT_PROVIDED', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, { recipientProfileId: profileId, type: 'BABYLIST_PURCHASE' });
    const reported = await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
    expect(reported.proofStatus).toBe('NOT_PROVIDED');
  });

  it('an illegal report transition is refused', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, { recipientProfileId: profileId, type: 'BABYLIST_PURCHASE' });
    await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
    // REPORTED_SENT -> REPORTED_SENT is not a defined transition.
    expect(await code(() => reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' })))
      .toBe('GIFT_TRANSITION_NOT_ALLOWED');
  });

  it('an unknown gift is a stable error', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => reportGiftSent(ctx, { giftId: 'nope', actor: 'GIVER' })))
      .toBe('GIFT_NOT_FOUND');
  });
});

describe('gift confirmation — the trust boundary', () => {
  async function babylistAwaiting(state: InMemoryState) {
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
    });
    await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
    return { ctx, giftId: gift.id };
  }

  it('a recipient may confirm a reported Babylist purchase', async () => {
    const state = emptyState();
    const { ctx, giftId } = await babylistAwaiting(state);
    const ready = await ctx.uow.run(async (repo) =>
      repo.updateGift(giftId, { status: 'AWAITING_RECIPIENT_CONFIRMATION' }));
    expect(ready.status).toBe('AWAITING_RECIPIENT_CONFIRMATION');

    const result = await confirmGift(ctx, {
      giftId, actor: 'RECIPIENT', confirmationSource: 'RECIPIENT',
    });
    expect(result.gift.status).toBe('CONFIRMED');
    expect(result.transitioned).toBe(true);
    expect(result.gift.recipientConfirmedAt).not.toBeNull();
    expect(result.gift.confirmationSource).toBe('RECIPIENT');
  });

  it('the GIVER can never confirm — from any status', async () => {
    for (const from of GIFT_STATUSES) {
      const state = emptyState();
      const { ctx, giftId } = await babylistAwaiting(state);
      await ctx.uow.run(async (repo) => repo.updateGift(giftId, { status: from }));
      const result = await code(() => confirmGift(ctx, {
        giftId, actor: 'GIVER', confirmationSource: 'RECIPIENT',
      }));
      expect(result).not.toBe('NO_ERROR');
      if (from !== 'CONFIRMED') expect(state.gifts[0]?.status).toBe(from);
    }
  });

  it('a Babylist purchase can never claim a first-party webhook', async () => {
    const state = emptyState();
    const { ctx, giftId } = await babylistAwaiting(state);
    expect(await code(() => confirmGift(ctx, {
      giftId, actor: 'FIRST_PARTY_WEBHOOK', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    }))).toBe('GIFT_CONFIRMATION_NOT_PERMITTED');
    expect(state.gifts[0]?.status).toBe('REPORTED_SENT');
  });

  it('an actor cannot assert someone else’s confirmation source', async () => {
    const state = emptyState();
    const { ctx, giftId } = await babylistAwaiting(state);
    await ctx.uow.run(async (repo) => repo.updateGift(giftId, { status: 'AWAITING_RECIPIENT_CONFIRMATION' }));
    expect(await code(() => confirmGift(ctx, {
      giftId, actor: 'RECIPIENT', confirmationSource: 'ADMIN',
    }))).toBe('GIFT_CONFIRMATION_NOT_PERMITTED');
  });

  it('repeated identical confirmation is an idempotent no-op', async () => {
    const state = emptyState();
    const { ctx, giftId } = await babylistAwaiting(state);
    await ctx.uow.run(async (repo) => repo.updateGift(giftId, { status: 'AWAITING_RECIPIENT_CONFIRMATION' }));

    const first = await confirmGift(ctx, { giftId, actor: 'RECIPIENT', confirmationSource: 'RECIPIENT' });
    const second = await confirmGift(ctx, { giftId, actor: 'RECIPIENT', confirmationSource: 'RECIPIENT' });
    const third = await confirmGift(ctx, { giftId, actor: 'RECIPIENT', confirmationSource: 'RECIPIENT' });

    expect(first.transitioned).toBe(true);
    expect(second.transitioned).toBe(false);
    expect(third.transitioned).toBe(false);
    expect(state.gifts).toHaveLength(1);
    expect(state.benefits).toHaveLength(0);
    expect(state.invites).toHaveLength(0);
    expect(state.moderationActions).toHaveLength(0);
  });

  it('a conflicting second confirmation source is refused, not overwritten', async () => {
    const state = emptyState();
    const { ctx, giftId } = await babylistAwaiting(state);
    await ctx.uow.run(async (repo) => repo.updateGift(giftId, { status: 'AWAITING_RECIPIENT_CONFIRMATION' }));
    await confirmGift(ctx, { giftId, actor: 'RECIPIENT', confirmationSource: 'RECIPIENT' });

    expect(await code(() => confirmGift(ctx, {
      giftId, actor: 'ADMIN', confirmationSource: 'ADMIN',
    }))).toBe('GIFT_CONFIRMATION_CONFLICT');
    expect(state.gifts[0]?.confirmationSource).toBe('RECIPIENT');
  });

  it('amount never affects whether confirmation is permitted', async () => {
    for (const amountCents of [null, 1, 7_500, 10_000_000]) {
      const state = emptyState();
      const { ctx, profileId } = await seedProfile(state);
      const gift = await createGiftEvent(ctx, {
        recipientProfileId: profileId, type: 'TMBC_CONSULT',
        giverEmail: GIVER_EMAIL, amountCents,
      });
      const result = await confirmGift(ctx, {
        giftId: gift.id, actor: 'FIRST_PARTY_WEBHOOK', confirmationSource: 'FIRST_PARTY_WEBHOOK',
      });
      expect(result.gift.status).toBe('CONFIRMED');
    }
  });
});

describe('giver benefit issuance — decision 29, exactly three conditions', () => {
  async function confirmTmbc(state: InMemoryState, source: 'FIRST_PARTY_WEBHOOK' | 'ADMIN') {
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'TMBC_CONSULT', giverEmail: GIVER_EMAIL,
    });
    const actor = source === 'FIRST_PARTY_WEBHOOK' ? 'FIRST_PARTY_WEBHOOK' : 'ADMIN';
    const result = await confirmGift(ctx, { giftId: gift.id, actor, confirmationSource: source });
    return { ctx, giftId: gift.id, result };
  }

  it('TMBC_CONSULT + CONFIRMED + FIRST_PARTY_WEBHOOK issues exactly one AVAILABLE benefit', async () => {
    const state = emptyState();
    const { result } = await confirmTmbc(state, 'FIRST_PARTY_WEBHOOK');
    expect(result.benefit.outcome).toBe('ISSUED');
    expect(state.benefits).toHaveLength(1);
    const benefit = state.benefits[0];
    expect(benefit?.status).toBe('AVAILABLE');
    expect(benefit?.type).toBe('COMPLIMENTARY_TMBC_CONSULT');
    expect(benefit?.giverEmail).toBe(GIVER_EMAIL);
  });

  it('issuance leaves selectedUse / redeemedAt / bookingRef untouched (Step 12)', async () => {
    const state = emptyState();
    await confirmTmbc(state, 'FIRST_PARTY_WEBHOOK');
    const benefit = state.benefits[0];
    expect(benefit?.selectedUse).toBeNull();
    expect(benefit?.redeemedAt).toBeNull();
    expect(benefit?.bookingRef).toBeNull();
    expect(benefit?.revokedAt).toBeNull();
  });

  it('a redelivered webhook still yields exactly one benefit', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmTmbc(state, 'FIRST_PARTY_WEBHOOK');
    for (let i = 0; i < 4; i += 1) {
      const replay = await confirmGift(ctx, {
        giftId, actor: 'FIRST_PARTY_WEBHOOK', confirmationSource: 'FIRST_PARTY_WEBHOOK',
      });
      expect(replay.transitioned).toBe(false);
      expect(replay.benefit.outcome).toBe('ALREADY_ISSUED');
    }
    expect(state.benefits).toHaveLength(1);
  });

  it('TMBC_CONSULT confirmed by an ADMIN issues NO benefit', async () => {
    const state = emptyState();
    const { result } = await confirmTmbc(state, 'ADMIN');
    expect(result.gift.status).toBe('CONFIRMED');
    expect(result.benefit.outcome).toBe('NOT_QUALIFIED');
    expect(state.benefits).toHaveLength(0);
  });

  it('a Babylist purchase issues NO benefit', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
    });
    await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
    const result = await confirmGift(ctx, { giftId: gift.id, actor: 'ADMIN', confirmationSource: 'ADMIN' });
    expect(result.gift.status).toBe('CONFIRMED');
    expect(state.benefits).toHaveLength(0);
  });

  it('an external service gift issues NO benefit', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'EXTERNAL_SERVICE_GIFT', giverEmail: GIVER_EMAIL,
      externalProvider: 'sample-provider', externalGiftKind: 'sample-kind',
    });
    await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
    await confirmGift(ctx, { giftId: gift.id, actor: 'ADMIN', confirmationSource: 'ADMIN' });
    expect(state.benefits).toHaveLength(0);
  });

  it('a TMBC gift with no giver email fails cleanly rather than crashing', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, { recipientProfileId: profileId, type: 'TMBC_CONSULT' });
    expect(await code(() => confirmGift(ctx, {
      giftId: gift.id, actor: 'FIRST_PARTY_WEBHOOK', confirmationSource: 'FIRST_PARTY_WEBHOOK',
    }))).toBe('GIVER_EMAIL_REQUIRED');
    expect(state.benefits).toHaveLength(0);
  });
});
