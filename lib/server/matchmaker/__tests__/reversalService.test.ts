import { describe, expect, it } from 'vitest';

import { saveApplicationDraft } from '../applicationService';
import { isMatchmakerServiceError } from '../errors';
import { confirmGift, createGiftEvent, reportGiftSent } from '../giftService';
import { issueInviteForConfirmedGift, consumeInvite } from '../inviteService';
import { MATCHMAKER_MODERATION_ACTIONS } from '../moderation';
import { reverseGift } from '../reversalService';
import {
  createTestContext,
  emptyState,
  linkAdmission,
  type InMemoryState,
} from './inMemoryRepo';

const GIVER_EMAIL = 'giver@example.test';
/** Synthetic. There is no service default — the caller must state it. */
const TEST_TTL_DAYS = 7;
const ADMIN = 'admin_1';

async function seedProfile(state: InMemoryState, userId: string, slug: string) {
  const ctx = createTestContext(state);
  const profile = await saveApplicationDraft(ctx, {
    userId, entryMethod: 'TMBC_NOMINATED',
    submittedRegistryUrl: `https://my.babylist.com/${slug}`,
    draft: { displayFirstName: 'Ada', shortStory: 'Our story.' },
  });
  return { ctx, profileId: profile.id };
}

async function confirmedBabylist(state: InMemoryState) {
  const { ctx, profileId } = await seedProfile(state, 'user_recipient', 'samplefamily');
  const gift = await createGiftEvent(ctx, {
    recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
  });
  await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
  await confirmGift(ctx, { giftId: gift.id, actor: 'ADMIN', confirmationSource: 'ADMIN' });
  return { ctx, giftId: gift.id, profileId };
}

async function confirmedTmbc(state: InMemoryState) {
  const { ctx, profileId } = await seedProfile(state, 'user_recipient', 'samplefamily');
  const gift = await createGiftEvent(ctx, {
    recipientProfileId: profileId, type: 'TMBC_CONSULT', giverEmail: GIVER_EMAIL,
  });
  await confirmGift(ctx, {
    giftId: gift.id, actor: 'FIRST_PARTY_WEBHOOK', confirmationSource: 'FIRST_PARTY_WEBHOOK',
  });
  return { ctx, giftId: gift.id, profileId };
}

async function code(fn: () => Promise<unknown>): Promise<string> {
  try { await fn(); return 'NO_ERROR'; }
  catch (e) { return isMatchmakerServiceError(e) ? e.code : `UNEXPECTED:${String(e)}`; }
}

describe('reversal — gift transition', () => {
  it('a confirmed gift reverses legally and records the reason', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedBabylist(state);
    const result = await reverseGift(ctx, {
      giftId, actor: 'ADMIN', actorUserId: ADMIN, reason: 'Refunded by the retailer',
    });
    expect(result.transitioned).toBe(true);
    expect(result.gift.status).toBe('REVERSED');
    expect(result.gift.reversedAt).not.toBeNull();
    expect(result.gift.reversalReason).toBe('Refunded by the retailer');
  });

  it('an unconfirmed gift cannot be reversed', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state, 'user_recipient', 'samplefamily');
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
    });
    expect(await code(() => reverseGift(ctx, { giftId: gift.id, actor: 'ADMIN', actorUserId: ADMIN })))
      .toBe('GIFT_REVERSAL_NOT_PERMITTED');
    expect(state.gifts[0]?.status).toBe('STARTED');
  });

  it('repeated reversal is idempotent', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedBabylist(state);
    const first = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    const second = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    const third = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });

    expect(first.transitioned).toBe(true);
    expect(second.transitioned).toBe(false);
    expect(third.transitioned).toBe(false);
    expect(state.gifts[0]?.reversedAt).toEqual(first.gift.reversedAt);
  });

  it('an unknown gift is a stable error', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => reverseGift(ctx, { giftId: 'nope', actor: 'ADMIN', actorUserId: ADMIN })))
      .toBe('GIFT_NOT_FOUND');
  });
});

describe('reversal — unused invite is revoked, not deleted', () => {
  it('revokes the invite and keeps the row', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedBabylist(state);
    await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    expect(state.invites).toHaveLength(1);

    const result = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    expect(result.invite).toBe('INVITE_REVOKED');
    expect(state.invites).toHaveLength(1);
    expect(state.invites[0]?.revokedAt).not.toBeNull();
    expect(state.moderationActions).toHaveLength(0);
  });

  it('a gift with no invite reverses cleanly', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedBabylist(state);
    const result = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    expect(result.invite).toBe('NO_INVITE');
  });
});

describe('reversal — a used invite escalates, never unwinds', () => {
  async function admitted(state: InMemoryState) {
    const { ctx, giftId } = await confirmedBabylist(state);
    const { invite, rawToken } = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    await consumeInvite(ctx, { rawToken: rawToken as string, usedByUserId: 'user_giver' });

    // Step 7 will do this link; the test models it.
    const giverProfile = await saveApplicationDraft(ctx, {
      userId: 'user_giver', entryMethod: 'GIFTED_FIRST',
      submittedRegistryUrl: 'https://my.babylist.com/giverfamily',
      draft: { displayFirstName: 'Bee', shortStory: 'Our story too.' },
    });
    linkAdmission(state, invite.id, giverProfile.id);
    return { ctx, giftId, inviteId: invite.id, admittedProfileId: giverProfile.id };
  }

  it('preserves the profile and the invite, and flags for admin review', async () => {
    const state = emptyState();
    const { ctx, giftId, admittedProfileId } = await admitted(state);
    const profilesBefore = state.profiles.length;

    const result = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });

    expect(result.invite).toBe('ADMITTED_PROFILE_FLAGGED');
    expect(state.profiles).toHaveLength(profilesBefore);          // nothing deleted
    expect(state.invites).toHaveLength(1);                        // invite retained
    expect(state.invites[0]?.usedAt).not.toBeNull();              // admission not undone
    const admittedProfile = state.profiles.find((p) => p.id === admittedProfileId);
    expect(admittedProfile?.needsAdminReview).toBe(true);
    expect(admittedProfile?.status).not.toBe('REMOVED');
  });

  it('creates the reversal-review moderation action exactly once', async () => {
    const state = emptyState();
    const { ctx, giftId, admittedProfileId } = await admitted(state);

    const first = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    expect(first.moderationActionCreated).toBe(true);

    for (let i = 0; i < 4; i += 1) {
      const again = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
      expect(again.moderationActionCreated).toBe(false);
    }

    const actions = state.moderationActions.filter(
      (a) => a.action === MATCHMAKER_MODERATION_ACTIONS.REVERSAL_REVIEW,
    );
    expect(actions).toHaveLength(1);
    expect(actions[0]?.profileId).toBe(admittedProfileId);
    expect(actions[0]?.giftEventId).toBe(giftId);
    expect(actions[0]?.actorUserId).toBe(ADMIN);
  });
});

describe('reversal — giver benefit (decision 30)', () => {
  it('an AVAILABLE benefit becomes REVOKED', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedTmbc(state);
    expect(state.benefits[0]?.status).toBe('AVAILABLE');

    const result = await reverseGift(ctx, {
      giftId, actor: 'FIRST_PARTY_WEBHOOK', actorUserId: ADMIN, reason: 'Payment refunded',
    });
    expect(result.benefit).toBe('REVOKED');
    expect(state.benefits).toHaveLength(1);
    expect(state.benefits[0]?.status).toBe('REVOKED');
    expect(state.benefits[0]?.revokedAt).not.toBeNull();
  });

  it('a REVOKED benefit stays REVOKED under repeated reversal', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedTmbc(state);
    await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    const revokedAt = state.benefits[0]?.revokedAt;

    for (let i = 0; i < 3; i += 1) {
      const again = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
      expect(again.benefit).toBe('ALREADY_REVOKED');
    }
    expect(state.benefits[0]?.status).toBe('REVOKED');
    expect(state.benefits[0]?.revokedAt).toEqual(revokedAt);
  });

  it('a REDEEMED benefit is never clawed back — it is preserved and escalated', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedTmbc(state);
    // Step 12 will do the redemption; the test models the end state.
    state.benefits[0]!.status = 'REDEEMED';
    state.benefits[0]!.redeemedAt = new Date('2026-08-27T10:00:00.000Z');

    const result = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });

    expect(result.benefit).toBe('FLAGGED_REDEEMED');
    expect(state.benefits[0]?.status).toBe('REDEEMED');
    expect(state.benefits[0]?.redeemedAt).not.toBeNull();
    expect(state.benefits[0]?.revokedAt).toBeNull();

    const flags = state.moderationActions.filter(
      (a) => a.action === MATCHMAKER_MODERATION_ACTIONS.BENEFIT_REVERSAL_REVIEW,
    );
    expect(flags).toHaveLength(1);
  });

  it('the redeemed escalation is also recorded only once', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedTmbc(state);
    state.benefits[0]!.status = 'REDEEMED';
    for (let i = 0; i < 4; i += 1) {
      await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    }
    expect(state.moderationActions.filter(
      (a) => a.action === MATCHMAKER_MODERATION_ACTIONS.BENEFIT_REVERSAL_REVIEW,
    )).toHaveLength(1);
  });

  it('a gift that produced no benefit reverses cleanly', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedBabylist(state);
    const result = await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });
    expect(result.benefit).toBe('NONE');
    expect(state.benefits).toHaveLength(0);
  });
});

describe('reversal — nothing is ever destroyed', () => {
  it('a full reversal deletes no row of any kind', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedTmbc(state);
    await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });

    const before = {
      gifts: state.gifts.length, invites: state.invites.length,
      benefits: state.benefits.length, profiles: state.profiles.length,
    };
    await reverseGift(ctx, { giftId, actor: 'ADMIN', actorUserId: ADMIN });

    expect(state.gifts).toHaveLength(before.gifts);
    expect(state.invites).toHaveLength(before.invites);
    expect(state.benefits).toHaveLength(before.benefits);
    expect(state.profiles).toHaveLength(before.profiles);
  });

  it('no service error leaks Prisma internals or private contact details', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state, 'user_recipient', 'samplefamily');
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
    });
    try {
      await reverseGift(ctx, { giftId: gift.id, actor: 'ADMIN', actorUserId: ADMIN });
    } catch (e) {
      const message = (e as Error).message;
      for (const leak of ['P2002', 'P2025', 'Prisma', 'Unique constraint', '_key', GIVER_EMAIL]) {
        expect(message).not.toContain(leak);
      }
    }
  });
});
