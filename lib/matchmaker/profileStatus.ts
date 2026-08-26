/**
 * Matchmaker profile status transitions — pure.
 *
 * Frozen contract:
 *  - decision 9:  "Never auto-publish." Submission lands in review; an admin
 *                 must complete the checklist. Enforced here two ways:
 *                   (a) LIVE is reachable only from APPROVED, and
 *                   (b) only an ADMIN actor may request it, and
 *                   (c) both review gates must already be true.
 *                 There is no code path by which SYSTEM reaches LIVE.
 *  - decision 4:  no `isVerified` boolean — review is decomposed into
 *                 `registryReviewed` + `ownershipReviewed`.
 *  - decision 17: LIVE -> PAUSED -> ARCHIVED on non-response; self-pause anytime.
 *  - decision 23: re-application revives an ARCHIVED profile rather than
 *                 inserting a second row.
 */

import type { MatchmakerProfileActor, MatchmakerProfileStatus } from './types';
import { domainErr, domainOk, type DomainResult } from './types';

export const PROFILE_STATUSES: readonly MatchmakerProfileStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_INFO',
  'APPROVED',
  'LIVE',
  'PAUSED',
  'REJECTED',
  'REMOVED',
  'ARCHIVED',
];

/** The only status whose profile is publicly visible. */
export const PUBLISHED_PROFILE_STATUS: MatchmakerProfileStatus = 'LIVE';

export function isPublishedStatus(status: MatchmakerProfileStatus): boolean {
  return status === PUBLISHED_PROFILE_STATUS;
}

type ProfileTransition = {
  readonly from: MatchmakerProfileStatus;
  readonly to: MatchmakerProfileStatus;
  readonly actors: readonly MatchmakerProfileActor[];
};

/**
 * The complete allowlist. Anything not listed here is refused.
 * Note that no row grants SYSTEM a transition whose `to` is LIVE.
 */
export const PROFILE_TRANSITIONS: readonly ProfileTransition[] = [
  { from: 'DRAFT', to: 'SUBMITTED', actors: ['APPLICANT', 'ADMIN'] },

  { from: 'SUBMITTED', to: 'UNDER_REVIEW', actors: ['ADMIN', 'SYSTEM'] },
  { from: 'SUBMITTED', to: 'NEEDS_INFO', actors: ['ADMIN'] },
  { from: 'SUBMITTED', to: 'DRAFT', actors: ['APPLICANT'] },

  { from: 'UNDER_REVIEW', to: 'NEEDS_INFO', actors: ['ADMIN'] },
  { from: 'UNDER_REVIEW', to: 'APPROVED', actors: ['ADMIN'] },
  { from: 'UNDER_REVIEW', to: 'REJECTED', actors: ['ADMIN'] },

  { from: 'NEEDS_INFO', to: 'SUBMITTED', actors: ['APPLICANT', 'ADMIN'] },

  // The single publication edge.
  { from: 'APPROVED', to: 'LIVE', actors: ['ADMIN'] },
  { from: 'APPROVED', to: 'NEEDS_INFO', actors: ['ADMIN'] },
  { from: 'APPROVED', to: 'REJECTED', actors: ['ADMIN'] },

  { from: 'LIVE', to: 'PAUSED', actors: ['APPLICANT', 'ADMIN', 'SYSTEM'] },
  { from: 'LIVE', to: 'UNDER_REVIEW', actors: ['ADMIN'] },
  { from: 'LIVE', to: 'ARCHIVED', actors: ['ADMIN', 'SYSTEM'] },

  // Re-publication after a pause is still an admin decision (see NOTE below).
  { from: 'PAUSED', to: 'LIVE', actors: ['ADMIN'] },
  { from: 'PAUSED', to: 'UNDER_REVIEW', actors: ['ADMIN'] },
  { from: 'PAUSED', to: 'ARCHIVED', actors: ['ADMIN', 'SYSTEM'] },

  { from: 'REJECTED', to: 'SUBMITTED', actors: ['APPLICANT', 'ADMIN'] },
  { from: 'REJECTED', to: 'ARCHIVED', actors: ['ADMIN'] },

  // decision 23 — revive, never duplicate.
  { from: 'ARCHIVED', to: 'SUBMITTED', actors: ['APPLICANT', 'ADMIN'] },
  { from: 'ARCHIVED', to: 'UNDER_REVIEW', actors: ['ADMIN'] },

  { from: 'REMOVED', to: 'ARCHIVED', actors: ['ADMIN'] },

  // Admin removal is always available.
  { from: 'DRAFT', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'SUBMITTED', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'UNDER_REVIEW', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'NEEDS_INFO', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'APPROVED', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'LIVE', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'PAUSED', to: 'REMOVED', actors: ['ADMIN'] },
  { from: 'REJECTED', to: 'REMOVED', actors: ['ADMIN'] },
];

/**
 * NOTE for review: PAUSED -> LIVE is admin-only here, deliberately conservative.
 * Decision 17 grants families "self-pause anytime" but is silent on self-resume.
 * If Taylor wants self-resume, add 'APPLICANT' to that row — the publish gates
 * below still apply, and no other module needs to change.
 */

export type ProfileReviewGates = {
  readonly registryReviewed: boolean;
  readonly ownershipReviewed: boolean;
  readonly needsAdminReview: boolean;
};

export type ProfileTransitionErrorCode =
  | 'UNKNOWN_TRANSITION'
  | 'ACTOR_NOT_PERMITTED'
  | 'REGISTRY_NOT_REVIEWED'
  | 'OWNERSHIP_NOT_REVIEWED'
  | 'PROFILE_FLAGGED_FOR_ADMIN_REVIEW';

/** Every gate that must hold before a profile may become LIVE. */
export function publishBlockers(gates: ProfileReviewGates): readonly ProfileTransitionErrorCode[] {
  const blockers: ProfileTransitionErrorCode[] = [];
  if (!gates.registryReviewed) blockers.push('REGISTRY_NOT_REVIEWED');
  if (!gates.ownershipReviewed) blockers.push('OWNERSHIP_NOT_REVIEWED');
  if (gates.needsAdminReview) blockers.push('PROFILE_FLAGGED_FOR_ADMIN_REVIEW');
  return blockers;
}

export function canPublish(gates: ProfileReviewGates): boolean {
  return publishBlockers(gates).length === 0;
}

export function canTransitionProfile(input: {
  readonly from: MatchmakerProfileStatus;
  readonly to: MatchmakerProfileStatus;
  readonly actor: MatchmakerProfileActor;
  readonly gates: ProfileReviewGates;
}): DomainResult<MatchmakerProfileStatus, ProfileTransitionErrorCode> {
  const row = PROFILE_TRANSITIONS.find((t) => t.from === input.from && t.to === input.to);

  if (!row) {
    return domainErr(
      'UNKNOWN_TRANSITION',
      `No Matchmaker profile transition is defined from ${input.from} to ${input.to}.`,
    );
  }

  if (!row.actors.includes(input.actor)) {
    return domainErr(
      'ACTOR_NOT_PERMITTED',
      `A ${input.actor} may not move a Matchmaker profile from ${input.from} to ${input.to}.`,
    );
  }

  if (input.to === PUBLISHED_PROFILE_STATUS) {
    const [blocker] = publishBlockers(input.gates);
    if (blocker) {
      return domainErr(
        blocker,
        `A Matchmaker profile cannot be published while it is blocked by ${blocker}.`,
      );
    }
  }

  return domainOk(input.to);
}

/** Convenience predicate used by tests and by the future service layer. */
export function isProfileTransitionAllowed(input: {
  readonly from: MatchmakerProfileStatus;
  readonly to: MatchmakerProfileStatus;
  readonly actor: MatchmakerProfileActor;
  readonly gates: ProfileReviewGates;
}): boolean {
  return canTransitionProfile(input).ok;
}
