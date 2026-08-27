import { describe, expect, it } from 'vitest';

import { findForbiddenPublicFields, PUBLIC_PROFILE_ALLOWLIST } from '@/lib/matchmaker/privacy';
import { canPublish, PROFILE_STATUSES } from '@/lib/matchmaker/profileStatus';

import { getPublicMatchmakerProfile, isPubliclyVisible } from '../publicRead';
import { recordConsent, saveApplicationDraft } from '../applicationService';
import {
  createInMemoryRepo,
  createTestContext,
  emptyState,
  forceStatus,
  setPhotoMedia,
  type InMemoryState,
} from './inMemoryRepo';

const USER = 'user_a';
const URL_MY = 'https://my.babylist.com/rivera';

/** Synthetic only. */
const TERMS_V1 = 'test-terms-v1';

const DRAFT = {
  displayFirstName: 'Ana',
  displayLastInitial: 'Rivera',
  city: 'Scottsdale',
  state: 'AZ',
  dueMonth: 11,
  dueYear: 2026,
  familyStage: 'First baby',
  shortStory: 'We are getting ready for our first baby.',
  priorityNeeds: ['Car seat'],
};

async function seedLive(state: InMemoryState, draftOverrides: Record<string, unknown> = {}) {
  const ctx = createTestContext(state);
  const profile = await saveApplicationDraft(ctx, {
    userId: USER, entryMethod: 'GIFTED_FIRST', submittedRegistryUrl: URL_MY, draft: { ...DRAFT, ...draftOverrides },
  });
  await recordConsent(ctx, {
    userId: USER, profileId: profile.id,
    consent: { acceptTerms: true, termsVersion: TERMS_V1, consentToPublicProfile: true },
  });
  // Publication is an admin act outside this service; the test sets it directly.
  forceStatus(state, profile.id, 'LIVE');
  const row = state.profiles[0];
  if (row) {
    row.registryReviewed = true;
    row.ownershipReviewed = true;
    row.moderationNotes = 'internal only — do not publish';
    row.reviewedById = 'admin_1';
  }
  return { repo: createInMemoryRepo(state), slug: profile.publicSlug };
}

describe('public read — never returns a raw Prisma record', () => {
  it('emits only allowlisted keys', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state);
    const result = await getPublicMatchmakerProfile(repo, slug);
    expect(result).not.toBeNull();
    for (const key of Object.keys(result as object)) {
      expect(PUBLIC_PROFILE_ALLOWLIST).toContain(key);
    }
  });

  it('private fields never appear in a public-read result', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state);
    const result = (await getPublicMatchmakerProfile(repo, slug)) as Record<string, unknown>;

    for (const forbidden of [
      'id', 'userId', 'registryId', 'registryCanonicalKey', 'email', 'recipientEmail',
      'moderationNotes', 'consentSnapshot', 'termsAcceptedAt', 'termsVersion',
      'publicProfileConsentAt', 'reviewedById', 'reviewedAt', 'needsAdminReview',
      'photoMediaId', 'photoApprovedAt', 'entryMethod', 'status', 'registryUserId',
    ]) {
      expect(forbidden in result).toBe(false);
    }
    expect(findForbiddenPublicFields(result)).toEqual([]);
  });

  it('survives a JSON round trip with no private residue', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state);
    const result = await getPublicMatchmakerProfile(repo, slug);
    const wire = JSON.stringify(result);
    for (const leak of ['moderationNotes', 'internal only', 'admin_1', 'user_a', 'consentSnapshot', 'termsVersion']) {
      expect(wire).not.toContain(leak);
    }
  });

  it('publishes the story and the reviewed registry URL', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state);
    const result = await getPublicMatchmakerProfile(repo, slug);
    expect(result?.shortStory).toBe(DRAFT.shortStory);
    expect(result?.registryUrl).toBe('https://www.babylist.com/list/rivera');
    expect(result?.registryReviewed).toBe(true);
  });
});

describe('public read — visibility gating', () => {
  it('returns null for every status that is not LIVE', async () => {
    for (const status of PROFILE_STATUSES) {
      const state = emptyState();
      const { repo, slug } = await seedLive(state);
      forceStatus(state, state.profiles[0]?.id ?? '', status);
      const result = await getPublicMatchmakerProfile(repo, slug);
      if (status === 'LIVE') expect(result).not.toBeNull();
      else expect(result).toBeNull();
    }
  });

  it('opt-out fields are absent, not undefined', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state);
    const result = (await getPublicMatchmakerProfile(repo, slug)) as Record<string, unknown>;
    for (const key of ['city', 'state', 'dueMonth', 'dueYear', 'familyStage', 'displayLastInitial', 'photoUrl']) {
      expect(key in result).toBe(false);
    }
  });

  it('opt-in fields appear only when their flag is true', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state, {
      showLocation: true, showLastInitial: true, showFamilyStage: true,
    });
    const result = await getPublicMatchmakerProfile(repo, slug);
    expect(result?.city).toBe('Scottsdale');
    expect(result?.displayLastInitial).toBe('R');
    expect(result?.familyStage).toBe('First baby');
    expect('dueMonth' in (result as object)).toBe(false);
  });

  it('a photo needs the flag, the resolved Media, and the approval', async () => {
    const state = emptyState();
    const { repo, slug } = await seedLive(state, { showPhoto: true });

    setPhotoMedia(state, state.profiles[0]?.id ?? '', 'https://cdn.example/p.jpg', null);
    expect('photoUrl' in ((await getPublicMatchmakerProfile(repo, slug)) as object)).toBe(false);

    setPhotoMedia(state, state.profiles[0]?.id ?? '', null, new Date('2026-08-01'));
    expect('photoUrl' in ((await getPublicMatchmakerProfile(repo, slug)) as object)).toBe(false);

    setPhotoMedia(state, state.profiles[0]?.id ?? '', 'https://cdn.example/p.jpg', new Date('2026-08-01'));
    expect((await getPublicMatchmakerProfile(repo, slug))?.photoUrl).toBe('https://cdn.example/p.jpg');
  });

  it('an unknown or blank slug returns null without throwing', async () => {
    const state = emptyState();
    const { repo } = await seedLive(state);
    for (const slug of ['', '   ', 'nope', 'ANA-T1-NOPE']) {
      expect(await getPublicMatchmakerProfile(repo, slug)).toBeNull();
    }
  });
});

/* ================================================================== *
 * Hardening requirement 1 — the FULL publication gate
 * ================================================================== */

describe('public read — LIVE alone is not permission to publish', () => {
  async function liveWith(overrides: Partial<Record<string, unknown>>) {
    const state = emptyState();
    const { repo, slug } = await seedLive(state);
    Object.assign(state.profiles[0] as object, overrides);
    return { state, repo, slug };
  }

  it('a LIVE profile with registryReviewed = false returns no public payload', async () => {
    const { repo, slug, state } = await liveWith({ registryReviewed: false });
    expect(state.profiles[0]?.status).toBe('LIVE');
    expect(await getPublicMatchmakerProfile(repo, slug)).toBeNull();
  });

  it('a LIVE profile with ownershipReviewed = false returns no public payload', async () => {
    const { repo, slug, state } = await liveWith({ ownershipReviewed: false });
    expect(state.profiles[0]?.status).toBe('LIVE');
    expect(await getPublicMatchmakerProfile(repo, slug)).toBeNull();
  });

  it('a LIVE profile with needsAdminReview = true returns no public payload', async () => {
    const { repo, slug, state } = await liveWith({ needsAdminReview: true });
    expect(state.profiles[0]?.status).toBe('LIVE');
    expect(await getPublicMatchmakerProfile(repo, slug)).toBeNull();
  });

  it('all four conditions together are required', async () => {
    for (const overrides of [
      { registryReviewed: false, ownershipReviewed: false },
      { registryReviewed: false, needsAdminReview: true },
      { ownershipReviewed: false, needsAdminReview: true },
      { registryReviewed: false, ownershipReviewed: false, needsAdminReview: true },
    ]) {
      const { repo, slug } = await liveWith(overrides);
      expect(await getPublicMatchmakerProfile(repo, slug)).toBeNull();
    }
    const { repo, slug } = await liveWith({
      registryReviewed: true, ownershipReviewed: true, needsAdminReview: false,
    });
    expect(await getPublicMatchmakerProfile(repo, slug)).not.toBeNull();
  });

  it('isPubliclyVisible reuses the Step 1 gates rather than restating them', () => {
    const base = {
      status: 'LIVE' as const,
      registryReviewed: true, ownershipReviewed: true, needsAdminReview: false,
    };
    expect(isPubliclyVisible(base)).toBe(true);
    expect(isPubliclyVisible({ ...base, registryReviewed: false })).toBe(false);
    expect(isPubliclyVisible({ ...base, ownershipReviewed: false })).toBe(false);
    expect(isPubliclyVisible({ ...base, needsAdminReview: true })).toBe(false);
    for (const status of PROFILE_STATUSES) {
      expect(isPubliclyVisible({ ...base, status })).toBe(status === 'LIVE');
    }
    // The gate agrees with Step 1's own publication rule.
    expect(canPublish({ registryReviewed: true, ownershipReviewed: true, needsAdminReview: false }))
      .toBe(true);
  });

  it('an ineligible row is never even serialized', async () => {
    const { repo, slug } = await liveWith({ needsAdminReview: true, moderationNotes: 'secret' });
    const result = await getPublicMatchmakerProfile(repo, slug);
    expect(result).toBeNull();
    expect(JSON.stringify(result)).not.toContain('secret');
  });
});
