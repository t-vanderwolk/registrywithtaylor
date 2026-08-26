/**
 * Public Matchmaker profile serializer — pure.
 *
 * Frozen contract:
 *  - decision 10: allowlist serialization is the ONLY path to public data.
 *                 A Prisma row is never spread into public props or JSON.
 *  - decision 20: the approved short story is MANDATORY public content for a
 *                 LIVE profile. There is deliberately no `showStory` flag.
 *                 Every other public field is opt-in and defaults to false.
 *  - decision 25: a photo is published only when ALL THREE hold —
 *                 `showPhoto === true`, the `Media` relation actually resolves,
 *                 and `photoApprovedAt != null`. A stale approval timestamp can
 *                 never publish anything on its own.
 *  - decision 12: verification language is "reviewed", never "verified".
 *
 * Keys that are not published are OMITTED, never set to `undefined`, so that
 * `'city' in profile` is false and JSON payloads carry no empty slots.
 */

import type { MatchmakerProfileStatus } from './types';
import { isPublishedStatus } from './profileStatus';

/**
 * The narrow projection the serializer accepts. This is deliberately NOT the
 * Prisma row type: private columns are not even in scope here, so they cannot
 * be forwarded by accident.
 */
export type PublicProfileSource = {
  readonly status: MatchmakerProfileStatus;
  readonly publicSlug: string;
  readonly displayFirstName: string;
  readonly displayLastInitial: string | null;
  readonly city: string | null;
  readonly state: string | null;
  readonly dueMonth: number | null;
  readonly dueYear: number | null;
  readonly familyStage: string | null;
  readonly shortStory: string;
  readonly priorityNeeds: readonly string[];

  readonly showLastInitial: boolean;
  readonly showLocation: boolean;
  readonly showDueMonth: boolean;
  readonly showFamilyStage: boolean;
  readonly showPhoto: boolean;

  /** The resolved Media relation, or null when it no longer exists. */
  readonly photoMedia: { readonly url: string } | null;
  readonly photoApprovedAt: Date | null;

  readonly registryReviewed: boolean;
  readonly ownershipReviewed: boolean;

  /** The exact reviewed Babylist URL (decision 11). */
  readonly registryUrl: string | null;
};

export type PublicMatchmakerProfile = {
  readonly publicSlug: string;
  readonly displayFirstName: string;
  readonly shortStory: string;
  readonly priorityNeeds: readonly string[];
  readonly registryReviewed: boolean;
  readonly ownershipReviewed: boolean;
  readonly displayLastInitial?: string;
  readonly city?: string;
  readonly state?: string;
  readonly dueMonth?: number;
  readonly dueYear?: number;
  readonly familyStage?: string;
  readonly photoUrl?: string;
  readonly registryUrl?: string;
};

/** decision 25 — all three conditions, evaluated against the live relation. */
export function canPublishPhoto(source: {
  readonly showPhoto: boolean;
  readonly photoMedia: { readonly url: string } | null;
  readonly photoApprovedAt: Date | null;
}): boolean {
  return (
    source.showPhoto === true &&
    source.photoMedia !== null &&
    typeof source.photoMedia.url === 'string' &&
    source.photoMedia.url.length > 0 &&
    source.photoApprovedAt !== null
  );
}

/**
 * Serializes a profile for public consumption.
 * Returns `null` for any profile that is not LIVE — a non-published family has
 * no public representation at all.
 */
export function toPublicMatchmakerProfile(
  source: PublicProfileSource,
): PublicMatchmakerProfile | null {
  if (!isPublishedStatus(source.status)) return null;

  // Mandatory public surface (decision 20).
  const profile: Record<string, unknown> = {
    publicSlug: source.publicSlug,
    displayFirstName: source.displayFirstName,
    shortStory: source.shortStory,
    priorityNeeds: [...source.priorityNeeds],
    registryReviewed: source.registryReviewed,
    ownershipReviewed: source.ownershipReviewed,
  };

  // Opt-in surface. Each key is added only when its own flag permits it AND a
  // value actually exists.
  if (source.showLastInitial && source.displayLastInitial) {
    profile.displayLastInitial = source.displayLastInitial;
  }

  if (source.showLocation) {
    if (source.city) profile.city = source.city;
    if (source.state) profile.state = source.state;
  }

  if (source.showDueMonth) {
    if (source.dueMonth !== null) profile.dueMonth = source.dueMonth;
    if (source.dueYear !== null) profile.dueYear = source.dueYear;
  }

  if (source.showFamilyStage && source.familyStage) {
    profile.familyStage = source.familyStage;
  }

  if (canPublishPhoto(source) && source.photoMedia) {
    profile.photoUrl = source.photoMedia.url;
  }

  if (source.registryUrl) {
    profile.registryUrl = source.registryUrl;
  }

  return profile as PublicMatchmakerProfile;
}

/** Serializes a list, dropping anything not publishable. */
export function toPublicMatchmakerProfiles(
  sources: readonly PublicProfileSource[],
): PublicMatchmakerProfile[] {
  const out: PublicMatchmakerProfile[] = [];
  for (const source of sources) {
    const profile = toPublicMatchmakerProfile(source);
    if (profile) out.push(profile);
  }
  return out;
}
