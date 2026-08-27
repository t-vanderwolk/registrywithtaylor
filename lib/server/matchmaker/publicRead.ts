/**
 * Public read boundary.
 *
 * Frozen contract decision 10 / §23 / §37: allowlist serialization is the ONLY
 * path to public data, and a Prisma Matchmaker row is never returned. Every
 * value leaving this module has passed through the Step 1 serializer AND the
 * Step 1 forbidden-field scanner, so a future schema addition cannot quietly
 * become public.
 */

import {
  toPublicMatchmakerProfile,
  type PublicMatchmakerProfile,
} from '@/lib/matchmaker/publicProfile';
import { assertPublicPayloadSafe } from '@/lib/matchmaker/privacy';
import { canPublish, isPublishedStatus } from '@/lib/matchmaker/profileStatus';

import type { MatchmakerRepo, StoredProfile, StoredPublicProfile } from './ports';

/**
 * The FULL publication gate, not merely `status === LIVE`.
 *
 * A row can be LIVE and still be ineligible — a review flag cleared by a later
 * moderation action, a reversal that set `needsAdminReview`, or a partially
 * written record. Status alone is not permission to publish, so this reuses the
 * Step 1 gates (`canPublish`) rather than restating them, and the two can never
 * diverge.
 */
export function isPubliclyVisible(
  profile: Pick<
    StoredProfile,
    'status' | 'registryReviewed' | 'ownershipReviewed' | 'needsAdminReview'
  >,
): boolean {
  return (
    isPublishedStatus(profile.status) &&
    canPublish({
      registryReviewed: profile.registryReviewed,
      ownershipReviewed: profile.ownershipReviewed,
      needsAdminReview: profile.needsAdminReview,
    })
  );
}

/** Projects a stored row onto exactly the serializer's input surface. */
export function toPublicProfilePayload(
  stored: StoredPublicProfile,
): PublicMatchmakerProfile | null {
  // Gate first: an ineligible row is never even serialized.
  if (!isPubliclyVisible(stored)) return null;

  const serialized = toPublicMatchmakerProfile({
    status: stored.status,
    publicSlug: stored.publicSlug,
    displayFirstName: stored.displayFirstName,
    displayLastInitial: stored.displayLastInitial,
    city: stored.city,
    state: stored.state,
    dueMonth: stored.dueMonth,
    dueYear: stored.dueYear,
    familyStage: stored.familyStage,
    shortStory: stored.shortStory,
    priorityNeeds: stored.priorityNeeds,
    showLastInitial: stored.showLastInitial,
    showLocation: stored.showLocation,
    showDueMonth: stored.showDueMonth,
    showFamilyStage: stored.showFamilyStage,
    showPhoto: stored.showPhoto,
    photoMedia: stored.photoMedia,
    photoApprovedAt: stored.photoApprovedAt,
    registryReviewed: stored.registryReviewed,
    ownershipReviewed: stored.ownershipReviewed,
    registryUrl: stored.registryUrl,
  });

  if (!serialized) return null;

  // Belt and braces: refuse to emit anything the §23 list forbids.
  return assertPublicPayloadSafe(serialized);
}

/** Public profile lookup by slug. Returns null for anything not LIVE. */
export async function getPublicMatchmakerProfile(
  repo: MatchmakerRepo,
  publicSlug: string,
): Promise<PublicMatchmakerProfile | null> {
  const slug = typeof publicSlug === 'string' ? publicSlug.trim().toLowerCase() : '';
  if (!slug) return null;

  const stored = await repo.findLiveProfileBySlug(slug);
  if (!stored) return null;

  return toPublicProfilePayload(stored);
}
