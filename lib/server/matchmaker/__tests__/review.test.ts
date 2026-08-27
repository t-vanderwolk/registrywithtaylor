import { describe, expect, it } from 'vitest';

import {
  setModerationNotes,
  setNeedsAdminReview,
  setOwnershipReviewed,
  setRegistryReviewed,
  summariseReviewReadiness,
} from '../review';
import { isMatchmakerServiceError } from '../errors';
import { recordConsent, saveApplicationDraft } from '../applicationService';
import { createTestContext, emptyState, type InMemoryState } from './inMemoryRepo';

const USER = 'user_a';
const ADMIN = { userId: 'admin_1', role: 'ADMIN' as const };
const NOT_ADMIN = { userId: 'user_a', role: 'USER' as const };
const REVIEWER = { userId: 'rev_1', role: 'REVIEWER' as const };

/** Synthetic only. */
const TERMS_V1 = 'test-terms-v1';

async function seed(state: InMemoryState) {
  const ctx = createTestContext(state);
  const profile = await saveApplicationDraft(ctx, {
    userId: USER,
    entryMethod: 'GIFTED_FIRST',
    submittedRegistryUrl: 'https://my.babylist.com/rivera',
    draft: { displayFirstName: 'Ana', shortStory: 'Our story.' },
  });
  await recordConsent(ctx, {
    userId: USER, profileId: profile.id,
    consent: { acceptTerms: true, termsVersion: TERMS_V1, consentToPublicProfile: true },
  });
  return { ctx, profileId: profile.id };
}

async function code(fn: () => Promise<unknown>): Promise<string> {
  try { await fn(); return 'NO_ERROR'; }
  catch (e) { return isMatchmakerServiceError(e) ? e.code : `UNEXPECTED:${String(e)}`; }
}

describe('review helpers — registry and ownership stay separate (decision 4)', () => {
  it('registry review does not set ownership review', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    const updated = await setRegistryReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    expect(updated.registryReviewed).toBe(true);
    expect(updated.ownershipReviewed).toBe(false);
  });

  it('ownership review does not set registry review', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    const updated = await setOwnershipReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    expect(updated.ownershipReviewed).toBe(true);
    expect(updated.registryReviewed).toBe(false);
  });

  it('there is no combined verified flag on the stored profile', async () => {
    const state = emptyState();
    const { profileId } = await seed(state);
    const row = state.profiles.find((p) => p.id === profileId) as Record<string, unknown>;
    for (const banned of ['isVerified', 'verified', 'verificationStatus']) {
      expect(banned in row).toBe(false);
    }
  });

  it('records the reviewer and timestamp', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    const updated = await setRegistryReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    expect(updated.reviewedById).toBe('admin_1');
    expect(updated.reviewedAt).toEqual(new Date('2026-08-26T12:00:00.000Z'));
  });
});

describe('review helpers — admin only, and never publishing', () => {
  it('a non-admin cannot record review', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    for (const actor of [NOT_ADMIN, REVIEWER, { userId: 'x', role: null }]) {
      expect(await code(() => setRegistryReviewed(ctx, { actor, profileId, reviewed: true })))
        .toBe('ADMIN_REQUIRED');
      expect(await code(() => setOwnershipReviewed(ctx, { actor, profileId, reviewed: true })))
        .toBe('ADMIN_REQUIRED');
      expect(await code(() => setNeedsAdminReview(ctx, { actor, profileId, flagged: true })))
        .toBe('ADMIN_REQUIRED');
      expect(await code(() => setModerationNotes(ctx, { actor, profileId, notes: 'x' })))
        .toBe('ADMIN_REQUIRED');
    }
    expect(state.profiles[0]?.registryReviewed).toBe(false);
  });

  it('completing both reviews does not change status', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    await setRegistryReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    const updated = await setOwnershipReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    expect(updated.status).toBe('DRAFT');
    expect(updated.publishedAt).toBeNull();
  });

  it('readiness reports blockers without publishing anything', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);

    let profile = state.profiles[0]!;
    expect(summariseReviewReadiness(profile).readyToPublish).toBe(false);
    expect(summariseReviewReadiness(profile).blockers).toEqual([
      'REGISTRY_NOT_REVIEWED', 'OWNERSHIP_NOT_REVIEWED',
    ]);

    await setRegistryReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    profile = await setOwnershipReviewed(ctx, { actor: ADMIN, profileId, reviewed: true }) as never;
    expect(summariseReviewReadiness(profile).readyToPublish).toBe(true);
    expect(state.profiles[0]?.status).toBe('DRAFT');
  });

  it('a flagged profile is not ready to publish', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    await setRegistryReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    await setOwnershipReviewed(ctx, { actor: ADMIN, profileId, reviewed: true });
    const flagged = await setNeedsAdminReview(ctx, { actor: ADMIN, profileId, flagged: true });
    const readiness = summariseReviewReadiness(flagged);
    expect(readiness.readyToPublish).toBe(false);
    expect(readiness.blockers).toContain('PROFILE_FLAGGED_FOR_ADMIN_REVIEW');
  });

  it('moderation notes are stored and trimmed to null when blank', async () => {
    const state = emptyState();
    const { ctx, profileId } = await seed(state);
    expect((await setModerationNotes(ctx, { actor: ADMIN, profileId, notes: '  needs a call  ' })).moderationNotes)
      .toBe('needs a call');
    expect((await setModerationNotes(ctx, { actor: ADMIN, profileId, notes: '   ' })).moderationNotes)
      .toBeNull();
  });
});
