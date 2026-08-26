import { describe, expect, it } from 'vitest';

import {
  canPublish,
  canTransitionProfile,
  isProfileTransitionAllowed,
  isPublishedStatus,
  PROFILE_STATUSES,
  PROFILE_TRANSITIONS,
  publishBlockers,
  PUBLISHED_PROFILE_STATUS,
  type ProfileReviewGates,
} from '../profileStatus';
import type { MatchmakerProfileActor, MatchmakerProfileStatus } from '../types';

const REVIEWED: ProfileReviewGates = {
  registryReviewed: true,
  ownershipReviewed: true,
  needsAdminReview: false,
};

const ACTORS: MatchmakerProfileActor[] = ['APPLICANT', 'ADMIN', 'SYSTEM'];

describe('profile transitions — valid paths', () => {
  it('walks the full happy path DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED -> LIVE', () => {
    expect(
      isProfileTransitionAllowed({
        from: 'DRAFT', to: 'SUBMITTED', actor: 'APPLICANT', gates: REVIEWED,
      }),
    ).toBe(true);
    expect(
      isProfileTransitionAllowed({
        from: 'SUBMITTED', to: 'UNDER_REVIEW', actor: 'ADMIN', gates: REVIEWED,
      }),
    ).toBe(true);
    expect(
      isProfileTransitionAllowed({
        from: 'UNDER_REVIEW', to: 'APPROVED', actor: 'ADMIN', gates: REVIEWED,
      }),
    ).toBe(true);
    expect(
      isProfileTransitionAllowed({
        from: 'APPROVED', to: 'LIVE', actor: 'ADMIN', gates: REVIEWED,
      }),
    ).toBe(true);
  });

  it('supports NEEDS_INFO round trips and self-pause (decision 17)', () => {
    expect(isProfileTransitionAllowed({ from: 'UNDER_REVIEW', to: 'NEEDS_INFO', actor: 'ADMIN', gates: REVIEWED })).toBe(true);
    expect(isProfileTransitionAllowed({ from: 'NEEDS_INFO', to: 'SUBMITTED', actor: 'APPLICANT', gates: REVIEWED })).toBe(true);
    expect(isProfileTransitionAllowed({ from: 'LIVE', to: 'PAUSED', actor: 'APPLICANT', gates: REVIEWED })).toBe(true);
    expect(isProfileTransitionAllowed({ from: 'PAUSED', to: 'ARCHIVED', actor: 'SYSTEM', gates: REVIEWED })).toBe(true);
  });

  it('revives an ARCHIVED profile rather than requiring a new one (decision 23)', () => {
    expect(isProfileTransitionAllowed({ from: 'ARCHIVED', to: 'SUBMITTED', actor: 'APPLICANT', gates: REVIEWED })).toBe(true);
  });

  it('returns the target status on success', () => {
    const result = canTransitionProfile({ from: 'APPROVED', to: 'LIVE', actor: 'ADMIN', gates: REVIEWED });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('LIVE');
  });
});

describe('profile transitions — invalid shortcuts are refused', () => {
  it('DRAFT -> LIVE fails', () => {
    for (const actor of ACTORS) {
      const result = canTransitionProfile({ from: 'DRAFT', to: 'LIVE', actor, gates: REVIEWED });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.code).toBe('UNKNOWN_TRANSITION');
    }
  });

  it('SUBMITTED -> LIVE and UNDER_REVIEW -> LIVE both fail', () => {
    for (const from of ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'REJECTED'] as MatchmakerProfileStatus[]) {
      for (const actor of ACTORS) {
        expect(isProfileTransitionAllowed({ from, to: 'LIVE', actor, gates: REVIEWED })).toBe(false);
      }
    }
  });

  it('an applicant cannot approve or review their own profile', () => {
    expect(canTransitionProfile({ from: 'UNDER_REVIEW', to: 'APPROVED', actor: 'APPLICANT', gates: REVIEWED }))
      .toMatchObject({ ok: false, code: 'ACTOR_NOT_PERMITTED' });
  });

  it('undefined transitions are refused, not silently allowed', () => {
    expect(isProfileTransitionAllowed({ from: 'REMOVED', to: 'LIVE', actor: 'ADMIN', gates: REVIEWED })).toBe(false);
    expect(isProfileTransitionAllowed({ from: 'LIVE', to: 'DRAFT', actor: 'ADMIN', gates: REVIEWED })).toBe(false);
  });
});

describe('profile transitions — no pure helper can auto-publish (decision 9)', () => {
  it('LIVE is reachable from exactly one status, by exactly one actor', () => {
    const intoLive = PROFILE_TRANSITIONS.filter((t) => t.to === PUBLISHED_PROFILE_STATUS);
    expect(intoLive.map((t) => t.from).sort()).toEqual(['APPROVED', 'PAUSED']);
    for (const row of intoLive) {
      expect(row.actors).toEqual(['ADMIN']);
    }
  });

  it('SYSTEM can never reach LIVE from any status', () => {
    for (const from of PROFILE_STATUSES) {
      expect(isProfileTransitionAllowed({ from, to: 'LIVE', actor: 'SYSTEM', gates: REVIEWED })).toBe(false);
    }
  });

  it('APPLICANT can never reach LIVE from any status', () => {
    for (const from of PROFILE_STATUSES) {
      expect(isProfileTransitionAllowed({ from, to: 'LIVE', actor: 'APPLICANT', gates: REVIEWED })).toBe(false);
    }
  });

  it('publication is blocked until BOTH review gates pass', () => {
    expect(canPublish({ registryReviewed: false, ownershipReviewed: true, needsAdminReview: false })).toBe(false);
    expect(canPublish({ registryReviewed: true, ownershipReviewed: false, needsAdminReview: false })).toBe(false);
    expect(canPublish(REVIEWED)).toBe(true);

    expect(canTransitionProfile({
      from: 'APPROVED', to: 'LIVE', actor: 'ADMIN',
      gates: { registryReviewed: false, ownershipReviewed: true, needsAdminReview: false },
    })).toMatchObject({ ok: false, code: 'REGISTRY_NOT_REVIEWED' });

    expect(canTransitionProfile({
      from: 'APPROVED', to: 'LIVE', actor: 'ADMIN',
      gates: { registryReviewed: true, ownershipReviewed: false, needsAdminReview: false },
    })).toMatchObject({ ok: false, code: 'OWNERSHIP_NOT_REVIEWED' });
  });

  it('a profile flagged for admin review cannot be published', () => {
    expect(canTransitionProfile({
      from: 'APPROVED', to: 'LIVE', actor: 'ADMIN',
      gates: { registryReviewed: true, ownershipReviewed: true, needsAdminReview: true },
    })).toMatchObject({ ok: false, code: 'PROFILE_FLAGGED_FOR_ADMIN_REVIEW' });
    expect(publishBlockers({ registryReviewed: false, ownershipReviewed: false, needsAdminReview: true }))
      .toHaveLength(3);
  });

  it('LIVE is the only published status', () => {
    for (const status of PROFILE_STATUSES) {
      expect(isPublishedStatus(status)).toBe(status === 'LIVE');
    }
  });
});
