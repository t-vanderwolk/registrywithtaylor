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

// Step 1 is frozen; it re-exports every enum this layer needs except
// MatchmakerGiverBenefitType, which is imported type-only straight from the
// generated client (erased at runtime, like the rest of this file's types).
import type {
  MatchmakerGiverBenefitType,
  MatchmakerGiverConsultUse,
  MatchmakerInviteReason,
  MatchmakerProofStatus,
} from '@prisma/client';

import type {
  MatchmakerConfirmationSource,
  MatchmakerEntryMethod,
  MatchmakerGiftStatus,
  MatchmakerGiftType,
  MatchmakerGiverBenefitStatus,
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

/* ------------------------------------------------------------------ *
 * Step 3 — gifts, invitations, giver benefits, moderation
 *
 * SERVER-ONLY row shapes. `giverEmail`, `giverName`, `tokenHash` and the
 * invitee email are private trust material: they exist here because the
 * service layer must act on them, and they are never routed to the public
 * serializer (Step 2's `publicRead.ts` projects a different type entirely).
 * ------------------------------------------------------------------ */

export type StoredGift = {
  readonly id: string;
  readonly recipientProfileId: string;
  readonly giverUserId: string | null;
  /** PRIVATE. TMBC retains it; it is never published (decision 16). */
  readonly giverEmail: string | null;
  readonly giverName: string | null;
  readonly anonymousToPublic: boolean;
  readonly anonymousToRecipient: boolean;
  readonly type: MatchmakerGiftType;
  readonly status: MatchmakerGiftStatus;
  readonly externalItemLabel: string | null;
  /** Informational only. Never participates in eligibility (decision 6d). */
  readonly amountCents: number | null;
  readonly noteToFamily: string | null;
  readonly externalProvider: string | null;
  readonly externalGiftKind: string | null;
  readonly externalOrderRef: string | null;
  readonly proofPurchaseDate: Date | null;
  readonly proofNote: string | null;
  readonly proofStatus: MatchmakerProofStatus;
  readonly reportedAt: Date | null;
  readonly recipientConfirmedAt: Date | null;
  readonly adminConfirmedAt: Date | null;
  readonly confirmedAt: Date | null;
  readonly confirmationSource: MatchmakerConfirmationSource | null;
  readonly reversedAt: Date | null;
  readonly reversalReason: string | null;
};

export type CreateGiftInput = {
  readonly recipientProfileId: string;
  readonly giverUserId: string | null;
  readonly giverEmail: string | null;
  readonly giverName: string | null;
  readonly anonymousToPublic: boolean;
  readonly anonymousToRecipient: boolean;
  readonly type: MatchmakerGiftType;
  readonly status: MatchmakerGiftStatus;
  readonly externalItemLabel: string | null;
  readonly amountCents: number | null;
  readonly noteToFamily: string | null;
  readonly externalProvider: string | null;
  readonly externalGiftKind: string | null;
};

export type UpdateGiftInput = Partial<{
  status: MatchmakerGiftStatus;
  reportedAt: Date | null;
  recipientConfirmedAt: Date | null;
  adminConfirmedAt: Date | null;
  confirmedAt: Date | null;
  confirmationSource: MatchmakerConfirmationSource | null;
  reversedAt: Date | null;
  reversalReason: string | null;
  externalOrderRef: string | null;
  proofPurchaseDate: Date | null;
  proofNote: string | null;
  proofStatus: MatchmakerProofStatus;
}>;

export type StoredInvite = {
  readonly id: string;
  /** PRIVATE. Only the hash is ever persisted; the raw token is never stored. */
  readonly tokenHash: string;
  readonly email: string;
  readonly reason: MatchmakerInviteReason;
  readonly originGiftEventId: string | null;
  readonly nominatedById: string | null;
  readonly intendedAction: string;
  readonly expiresAt: Date;
  readonly usedAt: Date | null;
  readonly usedByUserId: string | null;
  readonly revokedAt: Date | null;
};

export type CreateInviteInput = {
  readonly tokenHash: string;
  readonly email: string;
  readonly reason: MatchmakerInviteReason;
  readonly originGiftEventId: string | null;
  readonly nominatedById: string | null;
  readonly expiresAt: Date;
};

export type UpdateInviteInput = Partial<{
  usedAt: Date | null;
  usedByUserId: string | null;
  revokedAt: Date | null;
}>;

export type StoredGiverBenefit = {
  readonly id: string;
  readonly giftEventId: string;
  readonly giverUserId: string | null;
  readonly giverEmail: string;
  readonly type: MatchmakerGiverBenefitType;
  readonly status: MatchmakerGiverBenefitStatus;
  readonly selectedUse: MatchmakerGiverConsultUse | null;
  readonly issuedAt: Date;
  readonly redeemedAt: Date | null;
  readonly bookingRef: string | null;
  readonly revokedAt: Date | null;
};

export type CreateGiverBenefitInput = {
  readonly giftEventId: string;
  readonly giverUserId: string | null;
  readonly giverEmail: string;
};

export type UpdateGiverBenefitInput = Partial<{
  status: MatchmakerGiverBenefitStatus;
  revokedAt: Date | null;
}>;

export type CreateModerationActionInput = {
  /**
   * Deterministic primary key for system-generated actions. Because the row's
   * `id` is the table's only unique constraint, supplying a value derived from
   * (profileId, giftEventId, action) makes the PRIMARY KEY itself the
   * concurrency boundary — two simultaneous cascades collide on it and exactly
   * one insert wins. See `moderation.ts`.
   */
  readonly id: string;
  readonly profileId: string;
  readonly giftEventId: string | null;
  readonly actorUserId: string;
  readonly action: string;
  readonly note: string | null;
};

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

  // ---- Step 3: gifts ----
  findGiftById(id: string): Promise<StoredGift | null>;
  createGift(input: CreateGiftInput): Promise<StoredGift>;
  updateGift(id: string, patch: UpdateGiftInput): Promise<StoredGift>;

  // ---- Step 3: invitations ----
  findInviteById(id: string): Promise<StoredInvite | null>;
  findInviteByTokenHash(tokenHash: string): Promise<StoredInvite | null>;
  /** `originGiftEventId` is @unique — the hard idempotency boundary for issuance. */
  findInviteByOriginGiftId(giftEventId: string): Promise<StoredInvite | null>;
  createInvite(input: CreateInviteInput): Promise<StoredInvite>;
  updateInvite(id: string, patch: UpdateInviteInput): Promise<StoredInvite>;
  /** The profile an invite admitted, via `MatchmakerProfile.admissionInviteId @unique`. */
  findProfileByAdmissionInviteId(inviteId: string): Promise<StoredProfile | null>;

  // ---- Step 3: giver benefits ----
  /** `giftEventId` is @unique — the hard idempotency boundary for issuance. */
  findGiverBenefitByGiftId(giftEventId: string): Promise<StoredGiverBenefit | null>;
  createGiverBenefit(input: CreateGiverBenefitInput): Promise<StoredGiverBenefit>;
  updateGiverBenefit(id: string, patch: UpdateGiverBenefitInput): Promise<StoredGiverBenefit>;

  // ---- Step 3: moderation audit trail ----
  hasModerationAction(query: {
    readonly profileId: string;
    readonly giftEventId: string | null;
    readonly action: string;
  }): Promise<boolean>;
  /**
   * Inserts the action, or reports that its deterministic id already exists.
   * Returns true when THIS call created the row. A primary-key collision is a
   * benign, expected outcome under concurrency and never surfaces as an error.
   */
  createModerationAction(input: CreateModerationActionInput): Promise<boolean>;
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
  /**
   * Raw invite-token source. Entropy is a service concern — Step 1's pure layer
   * deliberately supplies only the hashing side. Injected so tests are
   * deterministic; production uses crypto randomness.
   */
  readonly inviteToken: () => string;
};
