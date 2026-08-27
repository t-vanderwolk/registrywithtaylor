/**
 * Review-readiness helpers — the server-side concepts admin review will need.
 * No admin UI is built here.
 *
 * Frozen contract decision 4: there is no `isVerified` boolean. Registry review
 * and ownership review are SEPARATE, independently recorded, and independently
 * auditable. Nothing in this module collapses them, and nothing here publishes:
 * moving a profile to LIVE is not a capability this file has.
 */

import type { Role } from '@prisma/client';

import { canPublish, publishBlockers } from '@/lib/matchmaker/profileStatus';

import { matchmakerError } from './errors';
import type { ServiceContext, StoredProfile } from './ports';

function requireAdmin(role: Role | null | undefined): void {
  if (role !== 'ADMIN') throw matchmakerError('ADMIN_REQUIRED');
}

export type ReviewActor = {
  readonly userId: string;
  readonly role: Role | null | undefined;
};

/** Records the registry review only. Never touches ownership review. */
export async function setRegistryReviewed(
  ctx: ServiceContext,
  input: { readonly actor: ReviewActor; readonly profileId: string; readonly reviewed: boolean },
): Promise<StoredProfile> {
  requireAdmin(input.actor.role);
  return ctx.uow.run(async (repo) => {
    const profile = await repo.findProfileById(input.profileId);
    if (!profile) throw matchmakerError('PROFILE_NOT_FOUND');
    return repo.updateProfile(profile.id, {
      registryReviewed: input.reviewed === true,
      reviewedAt: ctx.now(),
      reviewedById: input.actor.userId,
    });
  });
}

/** Records the ownership review only. Never touches registry review. */
export async function setOwnershipReviewed(
  ctx: ServiceContext,
  input: { readonly actor: ReviewActor; readonly profileId: string; readonly reviewed: boolean },
): Promise<StoredProfile> {
  requireAdmin(input.actor.role);
  return ctx.uow.run(async (repo) => {
    const profile = await repo.findProfileById(input.profileId);
    if (!profile) throw matchmakerError('PROFILE_NOT_FOUND');
    return repo.updateProfile(profile.id, {
      ownershipReviewed: input.reviewed === true,
      reviewedAt: ctx.now(),
      reviewedById: input.actor.userId,
    });
  });
}

export async function setNeedsAdminReview(
  ctx: ServiceContext,
  input: { readonly actor: ReviewActor; readonly profileId: string; readonly flagged: boolean },
): Promise<StoredProfile> {
  requireAdmin(input.actor.role);
  return ctx.uow.run(async (repo) => {
    const profile = await repo.findProfileById(input.profileId);
    if (!profile) throw matchmakerError('PROFILE_NOT_FOUND');
    return repo.updateProfile(profile.id, { needsAdminReview: input.flagged === true });
  });
}

/** Internal moderation material. Never public — see `publicRead.ts`. */
export async function setModerationNotes(
  ctx: ServiceContext,
  input: { readonly actor: ReviewActor; readonly profileId: string; readonly notes: string | null },
): Promise<StoredProfile> {
  requireAdmin(input.actor.role);
  return ctx.uow.run(async (repo) => {
    const profile = await repo.findProfileById(input.profileId);
    if (!profile) throw matchmakerError('PROFILE_NOT_FOUND');
    const notes = typeof input.notes === 'string' && input.notes.trim() ? input.notes.trim() : null;
    return repo.updateProfile(profile.id, { moderationNotes: notes });
  });
}

export type ReviewReadiness = {
  readonly registryReviewed: boolean;
  readonly ownershipReviewed: boolean;
  readonly needsAdminReview: boolean;
  readonly readyToPublish: boolean;
  readonly blockers: readonly string[];
};

/**
 * Read-only summary for an admin screen. Reports what still blocks publication
 * using the Step 1 gates; it does not publish and cannot be made to.
 */
export function summariseReviewReadiness(profile: StoredProfile): ReviewReadiness {
  const gates = {
    registryReviewed: profile.registryReviewed,
    ownershipReviewed: profile.ownershipReviewed,
    needsAdminReview: profile.needsAdminReview,
  };
  return {
    registryReviewed: profile.registryReviewed,
    ownershipReviewed: profile.ownershipReviewed,
    needsAdminReview: profile.needsAdminReview,
    readyToPublish: canPublish(gates),
    blockers: publishBlockers(gates),
  };
}
