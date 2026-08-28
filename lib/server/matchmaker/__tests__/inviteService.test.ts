import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { hashInviteToken } from '@/lib/matchmaker/invite';

import { saveApplicationDraft } from '../applicationService';
import { isMatchmakerServiceError } from '../errors';
import { confirmGift, createGiftEvent, reportGiftSent } from '../giftService';
import {
  consumeInvite,
  issueInviteForConfirmedGift,
  revokeInvite,
  validateInviteToken,
} from '../inviteService';
import { createTestContext, emptyState, type InMemoryState } from './inMemoryRepo';

const GIVER_EMAIL = 'giver@example.test';
/** Synthetic. There is no service default — the caller must state it. */
const TEST_TTL_DAYS = 7;

async function seedProfile(state: InMemoryState) {
  const ctx = createTestContext(state);
  const profile = await saveApplicationDraft(ctx, {
    userId: 'user_recipient', entryMethod: 'TMBC_NOMINATED',
    submittedRegistryUrl: 'https://my.babylist.com/samplefamily',
    draft: { displayFirstName: 'Ada', shortStory: 'Our story.' },
  });
  return { ctx, profileId: profile.id };
}

/** A confirmed, qualifying Babylist gift. */
async function confirmedGift(state: InMemoryState, giverEmail: string | null = GIVER_EMAIL) {
  const { ctx, profileId } = await seedProfile(state);
  const gift = await createGiftEvent(ctx, {
    recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail,
  });
  await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
  await confirmGift(ctx, { giftId: gift.id, actor: 'ADMIN', confirmationSource: 'ADMIN' });
  return { ctx, giftId: gift.id, profileId };
}

async function code(fn: () => Promise<unknown>): Promise<string> {
  try { await fn(); return 'NO_ERROR'; }
  catch (e) { return isMatchmakerServiceError(e) ? e.code : `UNEXPECTED:${String(e)}`; }
}

describe('invite issuance — only from a qualifying confirmed gift', () => {
  it('a confirmed qualifying gift issues one invite and returns the raw token once', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state);
    const result = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });

    expect(result.alreadyIssued).toBe(false);
    expect(result.rawToken).toBeTruthy();
    expect(state.invites).toHaveLength(1);
    expect(result.invite.email).toBe(GIVER_EMAIL);
    expect(result.invite.reason).toBe('GIFTED_FIRST');
    expect(result.invite.originGiftEventId).toBe(giftId);
  });

  it('stores the HASH and never the raw token', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state);
    const { rawToken } = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });

    const stored = state.invites[0];
    expect(stored?.tokenHash).toBe(hashInviteToken(rawToken as string));
    expect(stored?.tokenHash).not.toBe(rawToken);
    expect(stored?.tokenHash).toMatch(/^[0-9a-f]{64}$/);

    // The raw token appears nowhere in persisted state.
    expect(JSON.stringify(state)).not.toContain(rawToken as string);
  });

  it('an unconfirmed gift issues nothing', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seedProfile(state);
    const gift = await createGiftEvent(ctx, {
      recipientProfileId: profileId, type: 'BABYLIST_PURCHASE', giverEmail: GIVER_EMAIL,
    });
    expect(await code(() => issueInviteForConfirmedGift(ctx, { giftId: gift.id, ttlDays: TEST_TTL_DAYS })))
      .toBe('GIFT_NOT_ELIGIBLE_FOR_INVITE');

    await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
    expect(await code(() => issueInviteForConfirmedGift(ctx, { giftId: gift.id, ttlDays: TEST_TTL_DAYS })))
      .toBe('GIFT_NOT_ELIGIBLE_FOR_INVITE');
    expect(state.invites).toHaveLength(0);
  });

  it('a reversed gift no longer qualifies', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state);
    await ctx.uow.run(async (repo) => repo.updateGift(giftId, { status: 'REVERSED' }));
    expect(await code(() => issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS })))
      .toBe('GIFT_NOT_ELIGIBLE_FOR_INVITE');
    expect(state.invites).toHaveLength(0);
  });

  it('duplicate processing never issues a second invite', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state);
    const first = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });

    for (let i = 0; i < 3; i += 1) {
      const again = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
      expect(again.alreadyIssued).toBe(true);
      expect(again.invite.id).toBe(first.invite.id);
      // Honest contract: the raw token cannot be recovered from a hash.
      expect(again.rawToken).toBeNull();
    }
    expect(state.invites).toHaveLength(1);
  });

  it('a gift with no giver email fails cleanly', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state, null);
    expect(await code(() => issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS })))
      .toBe('GIVER_EMAIL_REQUIRED');
    expect(state.invites).toHaveLength(0);
  });

  it('an unknown gift is a stable error', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => issueInviteForConfirmedGift(ctx, { giftId: 'nope', ttlDays: TEST_TTL_DAYS })))
      .toBe('GIFT_NOT_FOUND');
  });

  it('amount plays no part in qualification', async () => {
    for (const amountCents of [null, 1, 250_000_00]) {
      const state = emptyState();
      const { ctx, profileId } = await seedProfile(state);
      const gift = await createGiftEvent(ctx, {
        recipientProfileId: profileId, type: 'BABYLIST_PURCHASE',
        giverEmail: GIVER_EMAIL, amountCents,
      });
      await reportGiftSent(ctx, { giftId: gift.id, actor: 'GIVER' });
      await confirmGift(ctx, { giftId: gift.id, actor: 'ADMIN', confirmationSource: 'ADMIN' });
      const result = await issueInviteForConfirmedGift(ctx, { giftId: gift.id, ttlDays: TEST_TTL_DAYS });
      expect(result.alreadyIssued).toBe(false);
    }
  });
});

describe('invite validation and consumption', () => {
  async function issued(state: InMemoryState) {
    const { ctx, giftId } = await confirmedGift(state);
    const { invite, rawToken } = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    return { ctx, invite, rawToken: rawToken as string };
  }

  it('a fresh token validates', async () => {
    const state = emptyState();
    const { ctx, rawToken, invite } = await issued(state);
    expect((await validateInviteToken(ctx, { rawToken })).id).toBe(invite.id);
  });

  it('an unknown or malformed token is INVITE_INVALID, indistinguishably', async () => {
    const state = emptyState();
    const { ctx } = await issued(state);
    for (const rawToken of ['', '   ', 'not-a-real-token', 'x'.repeat(64)]) {
      expect(await code(() => validateInviteToken(ctx, { rawToken }))).toBe('INVITE_INVALID');
    }
  });

  it('an expired invite is rejected', async () => {
    const state = emptyState();
    const { ctx, rawToken, invite } = await issued(state);
    await ctx.uow.run(async (repo) =>
      repo.updateInvite(invite.id, { usedAt: null }));
    state.invites[0]!.expiresAt = new Date('2026-08-25T00:00:00.000Z');
    expect(await code(() => validateInviteToken(ctx, { rawToken }))).toBe('INVITE_EXPIRED');
  });

  it('a revoked invite is rejected, and revocation is idempotent', async () => {
    const state = emptyState();
    const { ctx, rawToken, invite } = await issued(state);
    const revoked = await revokeInvite(ctx, { inviteId: invite.id });
    const again = await revokeInvite(ctx, { inviteId: invite.id });
    expect(again.revokedAt).toEqual(revoked.revokedAt);
    expect(await code(() => validateInviteToken(ctx, { rawToken }))).toBe('INVITE_REVOKED');
  });

  it('email mismatch is refused when an email is presented', async () => {
    const state = emptyState();
    const { ctx, rawToken } = await issued(state);
    expect(await code(() => validateInviteToken(ctx, {
      rawToken, presentedEmail: 'someone.else@example.test',
    }))).toBe('INVITE_EMAIL_MISMATCH');
    // Case and whitespace are normalised by the Step 1 helper.
    expect((await validateInviteToken(ctx, {
      rawToken, presentedEmail: '  GIVER@Example.TEST ',
    })).email).toBe(GIVER_EMAIL);
  });

  it('consume is one-time — a replayed consume is refused', async () => {
    const state = emptyState();
    const { ctx, rawToken } = await issued(state);

    const used = await consumeInvite(ctx, { rawToken, usedByUserId: 'user_giver' });
    expect(used.usedAt).not.toBeNull();
    expect(used.usedByUserId).toBe('user_giver');

    for (let i = 0; i < 3; i += 1) {
      expect(await code(() => consumeInvite(ctx, { rawToken, usedByUserId: 'user_giver' })))
        .toBe('INVITE_ALREADY_USED');
    }
    expect(state.invites.filter((i) => i.usedAt !== null)).toHaveLength(1);
  });

  it('a used invite no longer validates', async () => {
    const state = emptyState();
    const { ctx, rawToken } = await issued(state);
    await consumeInvite(ctx, { rawToken, usedByUserId: 'user_giver' });
    expect(await code(() => validateInviteToken(ctx, { rawToken }))).toBe('INVITE_ALREADY_USED');
  });

  it('a revoked invite cannot be consumed', async () => {
    const state = emptyState();
    const { ctx, rawToken, invite } = await issued(state);
    await revokeInvite(ctx, { inviteId: invite.id });
    expect(await code(() => consumeInvite(ctx, { rawToken, usedByUserId: 'u' })))
      .toBe('INVITE_REVOKED');
    expect(state.invites[0]?.usedAt).toBeNull();
  });

  it('consuming does not create a profile — that is Step 7', async () => {
    const state = emptyState();
    const before = state.profiles.length;
    const { ctx, rawToken } = await issued(state);
    await consumeInvite(ctx, { rawToken, usedByUserId: 'user_giver' });
    expect(state.profiles).toHaveLength(before + 1); // only the recipient seeded earlier
    expect(state.admissions).toHaveLength(0);
  });

  it('revoking an unknown invite is a stable error', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    expect(await code(() => revokeInvite(ctx, { inviteId: 'nope' }))).toBe('INVITE_NOT_FOUND');
  });
});

/* ================================================================== *
 * Hardening — expiration is a stated policy, never a silent default
 * ================================================================== */

describe('invite expiry — the caller must state the policy', () => {
  async function ready(state: InMemoryState) {
    const { ctx, giftId } = await confirmedGift(state);
    return { ctx, giftId };
  }

  it('rejects a missing, blank, zero, negative or non-integer TTL', async () => {
    const state = emptyState();
    const { ctx, giftId } = await ready(state);
    const attempt = (ttlDays: unknown) =>
      code(() => issueInviteForConfirmedGift(ctx, { giftId, ttlDays: ttlDays as number }));

    expect(await attempt(undefined)).toBe('INVITE_TTL_REQUIRED');
    expect(await attempt(null)).toBe('INVITE_TTL_REQUIRED');
    expect(await attempt('7')).toBe('INVITE_TTL_REQUIRED');
    expect(await attempt(Number.NaN)).toBe('INVITE_TTL_REQUIRED');
    expect(await attempt(Number.POSITIVE_INFINITY)).toBe('INVITE_TTL_REQUIRED');

    expect(await attempt(0)).toBe('INVITE_TTL_INVALID');
    expect(await attempt(-1)).toBe('INVITE_TTL_INVALID');
    expect(await attempt(1.5)).toBe('INVITE_TTL_INVALID');
    expect(await attempt(400)).toBe('INVITE_TTL_INVALID');

    expect(state.invites).toHaveLength(0);
  });

  it('validates the policy before touching persistence', async () => {
    const state = emptyState();
    const ctx = createTestContext(state);
    // Invalid TTL wins over an unknown gift: nothing is even looked up.
    expect(await code(() => issueInviteForConfirmedGift(ctx, {
      giftId: 'does-not-exist', ttlDays: 0,
    }))).toBe('INVITE_TTL_INVALID');
  });

  it('computes expiry from the injected clock, not the wall clock', async () => {
    const state = emptyState();
    const { ctx, giftId } = await ready(state);
    const { invite } = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: 3 });
    // Test context clock is fixed at 2026-08-26T12:00:00.000Z.
    expect(invite.expiresAt.toISOString()).toBe('2026-08-29T12:00:00.000Z');
  });

  it('different stated policies produce different expiries', async () => {
    for (const [ttlDays, expected] of [[1, '2026-08-27T12:00:00.000Z'], [30, '2026-09-25T12:00:00.000Z']] as const) {
      const state = emptyState();
      const { ctx, giftId } = await ready(state);
      const { invite } = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays });
      expect(invite.expiresAt.toISOString()).toBe(expected);
    }
  });

  it('no 14-day default is reachable through this service', async () => {
    const source = readFileSync(
      fileURLToPath(new URL('../inviteService.ts', import.meta.url)), 'utf8',
    );
    expect(source).not.toContain('DEFAULT_INVITE_TTL_HOURS');
    expect(source).not.toMatch(/ttlDays\s*\?\?/);
    expect(source).not.toMatch(/ttlHours\s*\?\?/);
  });
});

/* ================================================================== *
 * Hardening — the re-issue audit, proven rather than asserted
 * ================================================================== */

describe('re-issue is NOT implemented in Step 3', () => {
  it('revoking does not free the originGiftEventId slot, so no new token is minted', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state);

    const first = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    expect(first.rawToken).toBeTruthy();

    await revokeInvite(ctx, { inviteId: first.invite.id });

    // The revoked row still occupies the unique slot.
    const after = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    expect(after.alreadyIssued).toBe(true);
    expect(after.invite.id).toBe(first.invite.id);
    expect(after.rawToken).toBeNull();
    expect(after.invite.revokedAt).not.toBeNull();
    expect(state.invites).toHaveLength(1);
  });

  it('the stored hash is never rotated by a repeat call', async () => {
    const state = emptyState();
    const { ctx, giftId } = await confirmedGift(state);
    const first = await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    const hashBefore = state.invites[0]?.tokenHash;

    await issueInviteForConfirmedGift(ctx, { giftId, ttlDays: TEST_TTL_DAYS });
    expect(state.invites[0]?.tokenHash).toBe(hashBefore);
    expect(first.rawToken).toBeTruthy();
  });
});
