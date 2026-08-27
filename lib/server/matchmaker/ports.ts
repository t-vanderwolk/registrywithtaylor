/**
 * Persistence port for the Matchmaker service layer.
 *
 * Services depend on this interface, never on Prisma directly, so the required
 * tests run against an in-memory double with no database. `prismaRepo.ts` is
 * the production implementation.
 *
 * The row shapes below are explicit rather than `Prisma.*GetPayload` types:
 * a service can only forward a field that exists here, so private columns the
 * port does not expose cannot leak into a service result by accident.
 */

import type {
  MatchmakerEntryMethod,
  MatchmakerProfileStatus,
} from '@/lib/matchmaker/types';

export type StoredRegistry = {
  readonly id: string;
  readonly userId: string;
  readonly platform: string;
  readonly url: string;
  readonly name: string | null;
};

export type StoredProfile = {
  readonly id: string;
  readonly userId: string | null;
  readonly registryId: string;
  /** Denormalised for ownership checks; sourced from the Registry relation. */
  readonly registryUserId: string;
  readonly registryCanonicalKey: string;
  readonly publicSlug: string;
  readonly status: MatchmakerProfileStatus;
  readonly entryMethod: MatchmakerEntryMethod;

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
  readonly photoMediaId: string | null;
  readonly photoApprovedAt: Date | null;

  readonly termsAcceptedAt: Date | null;
  readonly termsVersion: string | null;
  readonly publicProfileConsentAt: Date | null;

  readonly registryReviewed: boolean;
  readonly ownershipReviewed: boolean;
  readonly reviewedAt: Date | null;
  readonly reviewedById: string | null;
  readonly moderationNotes: string | null;
  readonly needsAdminReview: boolean;

  readonly publishedAt: Date | null;
};

/** A LIVE profile joined to its photo Media, for the public read boundary. */
export type StoredPublicProfile = StoredProfile & {
  readonly photoMedia: { readonly url: string } | null;
  readonly registryUrl: string | null;
};

export type CreateRegistryInput = {
  readonly userId: string;
  readonly url: string;
  readonly name: string | null;
};

export type CreateProfileInput = {
  readonly userId: string | null;
  readonly registryId: string;
  readonly registryCanonicalKey: string;
  readonly publicSlug: string;
  readonly status: MatchmakerProfileStatus;
  readonly entryMethod: MatchmakerEntryMethod;
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
  readonly photoMediaId: string | null;
};

/**
 * Fields the service layer is permitted to update.
 * `status` is present but every write goes through the Step 1 transition rules
 * first — see `applicationService.ts`.
 */
export type UpdateProfileInput = Partial<{
  status: MatchmakerProfileStatus;
  displayFirstName: string;
  displayLastInitial: string | null;
  city: string | null;
  state: string | null;
  dueMonth: number | null;
  dueYear: number | null;
  familyStage: string | null;
  shortStory: string;
  priorityNeeds: readonly string[];
  showLastInitial: boolean;
  showLocation: boolean;
  showDueMonth: boolean;
  showFamilyStage: boolean;
  showPhoto: boolean;
  photoMediaId: string | null;
  termsAcceptedAt: Date | null;
  termsVersion: string | null;
  publicProfileConsentAt: Date | null;
  consentSnapshot: unknown;
  registryReviewed: boolean;
  ownershipReviewed: boolean;
  reviewedAt: Date | null;
  reviewedById: string | null;
  moderationNotes: string | null;
  needsAdminReview: boolean;
}>;

export interface MatchmakerRepo {
  findProfileByCanonicalKey(canonicalKey: string): Promise<StoredProfile | null>;
  findProfileById(id: string): Promise<StoredProfile | null>;
  listRegistriesForUser(userId: string): Promise<StoredRegistry[]>;
  findRegistryById(id: string): Promise<StoredRegistry | null>;
  createRegistry(input: CreateRegistryInput): Promise<StoredRegistry>;
  updateRegistryUrl(id: string, url: string): Promise<StoredRegistry>;
  createProfile(input: CreateProfileInput): Promise<StoredProfile>;
  updateProfile(id: string, patch: UpdateProfileInput): Promise<StoredProfile>;
  isPublicSlugTaken(slug: string): Promise<boolean>;
  mediaExists(mediaId: string): Promise<boolean>;
  findLiveProfileBySlug(slug: string): Promise<StoredPublicProfile | null>;
}

/** Runs a unit of work; the production adapter wraps it in `prisma.$transaction`. */
export interface MatchmakerUnitOfWork {
  run<T>(work: (repo: MatchmakerRepo) => Promise<T>): Promise<T>;
}

/** Injected so services stay deterministic under test. */
export type ServiceClock = () => Date;

export type ServiceContext = {
  readonly uow: MatchmakerUnitOfWork;
  readonly now: ServiceClock;
  /** Random suffix source for public slugs; injected for reproducible tests. */
  readonly slugSuffix: () => string;
};
