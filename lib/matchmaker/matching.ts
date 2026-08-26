/**
 * Matchmaker candidate selection — pure, lean, and deliberately neutral.
 *
 * Frozen contract:
 *  - decision 3:  "a pay-it-forward network, not a fundraising marketplace."
 *  - decision 13: NO hardship ranking and no donation-platform UI. The default
 *                 directory order is randomised/rotating within recently-active
 *                 families. Filters act only on voluntarily shared, non-ranking
 *                 facts.
 *  - decision 6d: gift value never determines a family's worth or standing.
 *
 * ORDERING INPUTS — the complete list, by design:
 *   1. exposure tier  (how many confirmed gifts a family has already RECEIVED,
 *                      fewest first) — a neutral fairness rotation, not a
 *                      judgement about need;
 *   2. a deterministic seeded shuffle inside each tier.
 *
 * Nothing else participates. There is no score, no weight, no priority number,
 * and no monetary, hardship, sentiment, medical, or financial input anywhere in
 * this module — `matching.test.ts` asserts that against the source text.
 */

import type { MatchmakerProfileStatus } from './types';
import { isPublishedStatus } from './profileStatus';

/**
 * Signals that must never influence ordering or selection.
 * Kept as data so the guard test can assert the source contains none of them.
 */
export const MATCHING_FORBIDDEN_SIGNALS: readonly string[] = [
  'amountCents',
  'hardship',
  'sentiment',
  'medical',
  'diagnosis',
  'income',
  'financial',
  'urgency',
  'need score',
  'priority score',
];

/**
 * The narrow projection selection is allowed to see. Private columns, the
 * family's story text, and every monetary field are absent by construction.
 */
export type MatchCandidate = {
  readonly publicSlug: string;
  readonly status: MatchmakerProfileStatus;
  readonly registryReviewed: boolean;
  readonly ownershipReviewed: boolean;
  readonly needsAdminReview: boolean;

  /** Voluntarily shared facts. Usable as filters only, never as ordering input. */
  readonly showLocation: boolean;
  readonly state: string | null;
  readonly showFamilyStage: boolean;
  readonly familyStage: string | null;
  readonly priorityNeeds: readonly string[];

  /** Exposure only: how many confirmed gifts this family has already received. */
  readonly confirmedGiftsReceived: number;
};

export type MatchFilters = {
  /** Matches only when the family chose to show their location. */
  readonly state?: string | null;
  /** Matches only when the family chose to show their family stage. */
  readonly familyStage?: string | null;
  readonly priorityNeed?: string | null;
};

/** A family is listable when it is LIVE, both-reviewed, and unflagged. */
export function isSelectableCandidate(candidate: MatchCandidate): boolean {
  return (
    isPublishedStatus(candidate.status) &&
    candidate.registryReviewed === true &&
    candidate.ownershipReviewed === true &&
    candidate.needsAdminReview === false
  );
}

function equalsIgnoringCase(a: string | null, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function matchesFilters(candidate: MatchCandidate, filters: MatchFilters): boolean {
  if (filters.state) {
    if (!candidate.showLocation) return false;
    if (!equalsIgnoringCase(candidate.state, filters.state)) return false;
  }

  if (filters.familyStage) {
    if (!candidate.showFamilyStage) return false;
    if (!equalsIgnoringCase(candidate.familyStage, filters.familyStage)) return false;
  }

  if (filters.priorityNeed) {
    const wanted = filters.priorityNeed.trim().toLowerCase();
    const has = candidate.priorityNeeds.some((n) => n.trim().toLowerCase() === wanted);
    if (!has) return false;
  }

  return true;
}

/* ------------------------------------------------------------------ *
 * Deterministic rotation
 * ------------------------------------------------------------------ */

/** FNV-1a — a small, stable string hash. */
function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — a tiny deterministic PRNG. No Math.random anywhere. */
function createRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates driven by the seeded PRNG. Pure: input array is not mutated. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const random = createRandom(hashSeed(seed));
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}

export type SelectMatchCandidatesInput = {
  readonly candidates: readonly MatchCandidate[];
  readonly filters?: MatchFilters;
  /** Rotates the order; pass a stable per-period value such as a date bucket. */
  readonly rotationSeed: string;
  readonly limit?: number;
};

/**
 * Returns listable families in neutral rotation order: least-surfaced tier
 * first, shuffled deterministically within each tier.
 */
export function selectMatchCandidates(input: SelectMatchCandidatesInput): MatchCandidate[] {
  const filters = input.filters ?? {};

  const eligible = input.candidates
    .filter(isSelectableCandidate)
    .filter((c) => matchesFilters(c, filters));

  // Group into exposure tiers. The tier key is a plain count of gifts received.
  const tiers = new Map<number, MatchCandidate[]>();
  for (const candidate of eligible) {
    const tier = Math.max(0, Math.floor(candidate.confirmedGiftsReceived));
    const bucket = tiers.get(tier);
    if (bucket) bucket.push(candidate);
    else tiers.set(tier, [candidate]);
  }

  const ordered: MatchCandidate[] = [];
  for (const tier of [...tiers.keys()].sort((a, b) => a - b)) {
    ordered.push(...seededShuffle(tiers.get(tier) ?? [], `${input.rotationSeed}:${tier}`));
  }

  if (typeof input.limit === 'number' && input.limit >= 0) {
    return ordered.slice(0, input.limit);
  }
  return ordered;
}
