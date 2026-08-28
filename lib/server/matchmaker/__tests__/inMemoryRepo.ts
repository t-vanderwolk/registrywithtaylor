/**
 * In-memory persistence double for the Matchmaker service tests.
 *
 * It enforces the same unique indexes the deployed migration creates
 * (`registryCanonicalKey`, `publicSlug`, `registryId`) and raises errors shaped
 * exactly like Prisma's `PrismaClientKnownRequestError`, so the service layer's
 * P2002 translation is genuinely exercised — no database required.
 */

import { translatePrismaError } from '../errors';
import type {
  CreateGiftInput,
  CreateGiverBenefitInput,
  CreateInviteInput,
  CreateModerationActionInput,
  CreateProfileInput,
  CreateRegistryInput,
  MatchmakerRepo,
  MatchmakerUnitOfWork,
  ServiceContext,
  StoredGift,
  StoredGiverBenefit,
  StoredInvite,
  StoredProfile,
  StoredPublicProfile,
  StoredRegistry,
  UpdateGiftInput,
  UpdateGiverBenefitInput,
  UpdateInviteInput,
  UpdateProfileInput,
} from '../ports';

export function prismaUniqueViolation(target: string): Error {
  const error = new Error(`Unique constraint failed on the fields: (\`${target}\`)`);
  error.name = 'PrismaClientKnownRequestError';
  Object.assign(error, { code: 'P2002', meta: { target: [target] } });
  return error;
}

type MutableProfile = {
  -readonly [K in keyof StoredProfile]: StoredProfile[K];
} & { consentSnapshot: unknown; photoMediaUrl: string | null };

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export type InMemoryState = {
  registries: StoredRegistry[];
  profiles: MutableProfile[];
  media: string[];
  // ---- Step 3 ----
  gifts: Mutable<StoredGift>[];
  invites: Mutable<StoredInvite>[];
  benefits: Mutable<StoredGiverBenefit>[];
  moderationActions: CreateModerationActionInput[];
  /** Models `MatchmakerProfile.admissionInviteId @unique`. */
  admissions: { inviteId: string; profileId: string }[];
};

let counter = 0;
const nextId = (prefix: string) => `${prefix}_${(counter += 1)}`;

export function resetIds(): void {
  counter = 0;
}

export function createInMemoryRepo(state: InMemoryState): MatchmakerRepo {
  const publicOf = (p: MutableProfile): StoredPublicProfile => ({
    ...(p as StoredProfile),
    photoMedia: p.photoMediaUrl ? { url: p.photoMediaUrl } : null,
    registryUrl: state.registries.find((r) => r.id === p.registryId)?.url ?? null,
  });

  return {
    async findProfileByCanonicalKey(key) {
      return state.profiles.find((p) => p.registryCanonicalKey === key) ?? null;
    },
    async findProfileById(id) {
      return state.profiles.find((p) => p.id === id) ?? null;
    },
    async listRegistriesForUser(userId) {
      return state.registries.filter((r) => r.userId === userId);
    },
    async findRegistryById(id) {
      return state.registries.find((r) => r.id === id) ?? null;
    },
    async createRegistry(input: CreateRegistryInput) {
      const row: StoredRegistry = {
        id: nextId('reg'),
        userId: input.userId,
        platform: 'BABYLIST',
        url: input.url,
        name: input.name,
      };
      state.registries.push(row);
      return row;
    },
    async updateRegistryUrl(id, url) {
      const index = state.registries.findIndex((r) => r.id === id);
      if (index < 0) throw new Error('registry not found');
      const updated = { ...(state.registries[index] as StoredRegistry), url };
      state.registries[index] = updated;
      return updated;
    },
    async createProfile(input: CreateProfileInput) {
      try {
        if (state.profiles.some((p) => p.registryCanonicalKey === input.registryCanonicalKey)) {
          throw prismaUniqueViolation('MatchmakerProfile_registryCanonicalKey_key');
        }
        if (state.profiles.some((p) => p.publicSlug === input.publicSlug)) {
          throw prismaUniqueViolation('MatchmakerProfile_publicSlug_key');
        }
        if (state.profiles.some((p) => p.registryId === input.registryId)) {
          throw prismaUniqueViolation('MatchmakerProfile_registryId_key');
        }
      } catch (error) {
        return translatePrismaError(error);
      }

      const registry = state.registries.find((r) => r.id === input.registryId);
      const row: MutableProfile = {
        id: nextId('mmp'),
        userId: input.userId,
        registryId: input.registryId,
        registryUserId: registry?.userId ?? 'unknown',
        registryCanonicalKey: input.registryCanonicalKey,
        publicSlug: input.publicSlug,
        status: input.status,
        entryMethod: input.entryMethod,
        displayFirstName: input.displayFirstName,
        displayLastInitial: input.displayLastInitial,
        city: input.city,
        state: input.state,
        dueMonth: input.dueMonth,
        dueYear: input.dueYear,
        familyStage: input.familyStage,
        shortStory: input.shortStory,
        priorityNeeds: [...input.priorityNeeds],
        showLastInitial: input.showLastInitial,
        showLocation: input.showLocation,
        showDueMonth: input.showDueMonth,
        showFamilyStage: input.showFamilyStage,
        showPhoto: input.showPhoto,
        photoMediaId: input.photoMediaId,
        photoApprovedAt: null,
        termsAcceptedAt: null,
        termsVersion: null,
        publicProfileConsentAt: null,
        registryReviewed: false,
        ownershipReviewed: false,
        reviewedAt: null,
        reviewedById: null,
        moderationNotes: null,
        needsAdminReview: false,
        publishedAt: null,
        consentSnapshot: null,
        photoMediaUrl: null,
      };
      state.profiles.push(row);
      return row;
    },
    async updateProfile(id, patch: UpdateProfileInput) {
      const row = state.profiles.find((p) => p.id === id);
      if (!row) throw new Error('profile not found');
      for (const [key, value] of Object.entries(patch)) {
        if (value !== undefined) (row as Record<string, unknown>)[key] = value;
      }
      return row;
    },
    async isPublicSlugTaken(slug) {
      return state.profiles.some((p) => p.publicSlug === slug);
    },
    async mediaExists(mediaId) {
      return state.media.includes(mediaId);
    },
    async findLiveProfileBySlug(slug) {
      const row = state.profiles.find((p) => p.publicSlug === slug);
      if (!row || row.status !== 'LIVE') return null;
      return publicOf(row);
    },

    /* ---------------- Step 3: gifts ---------------- */

    async findGiftById(id) {
      return state.gifts.find((g) => g.id === id) ?? null;
    },
    async createGift(input: CreateGiftInput) {
      const row: Mutable<StoredGift> = {
        id: nextId('gift'),
        ...input,
        externalOrderRef: null,
        proofPurchaseDate: null,
        proofNote: null,
        proofStatus: 'NOT_PROVIDED',
        reportedAt: null,
        recipientConfirmedAt: null,
        adminConfirmedAt: null,
        confirmedAt: null,
        confirmationSource: null,
        reversedAt: null,
        reversalReason: null,
      };
      state.gifts.push(row);
      return row;
    },
    async updateGift(id, patch: UpdateGiftInput) {
      const row = state.gifts.find((g) => g.id === id);
      if (!row) throw new Error('gift not found');
      for (const [k, v] of Object.entries(patch)) {
        if (v !== undefined) (row as Record<string, unknown>)[k] = v;
      }
      return row;
    },

    /* ---------------- Step 3: invitations ---------------- */

    async findInviteById(id) {
      return state.invites.find((i) => i.id === id) ?? null;
    },
    async findInviteByTokenHash(tokenHash) {
      return state.invites.find((i) => i.tokenHash === tokenHash) ?? null;
    },
    async findInviteByOriginGiftId(giftEventId) {
      return state.invites.find((i) => i.originGiftEventId === giftEventId) ?? null;
    },
    async createInvite(input: CreateInviteInput) {
      try {
        if (state.invites.some((i) => i.tokenHash === input.tokenHash)) {
          throw prismaUniqueViolation('MatchmakerInvite_tokenHash_key');
        }
        if (
          input.originGiftEventId &&
          state.invites.some((i) => i.originGiftEventId === input.originGiftEventId)
        ) {
          throw prismaUniqueViolation('MatchmakerInvite_originGiftEventId_key');
        }
      } catch (error) {
        return translatePrismaError(error);
      }
      const row: Mutable<StoredInvite> = {
        id: nextId('inv'),
        tokenHash: input.tokenHash,
        email: input.email,
        reason: input.reason,
        originGiftEventId: input.originGiftEventId,
        nominatedById: input.nominatedById,
        intendedAction: 'apply',
        expiresAt: input.expiresAt,
        usedAt: null,
        usedByUserId: null,
        revokedAt: null,
      };
      state.invites.push(row);
      return row;
    },
    async updateInvite(id, patch: UpdateInviteInput) {
      const row = state.invites.find((i) => i.id === id);
      if (!row) throw new Error('invite not found');
      for (const [k, v] of Object.entries(patch)) {
        if (v !== undefined) (row as Record<string, unknown>)[k] = v;
      }
      return row;
    },
    async findProfileByAdmissionInviteId(inviteId) {
      const link = state.admissions.find((a) => a.inviteId === inviteId);
      if (!link) return null;
      return state.profiles.find((p) => p.id === link.profileId) ?? null;
    },

    /* ---------------- Step 3: giver benefits ---------------- */

    async findGiverBenefitByGiftId(giftEventId) {
      return state.benefits.find((b) => b.giftEventId === giftEventId) ?? null;
    },
    async createGiverBenefit(input: CreateGiverBenefitInput) {
      try {
        if (state.benefits.some((b) => b.giftEventId === input.giftEventId)) {
          throw prismaUniqueViolation('MatchmakerGiverBenefit_giftEventId_key');
        }
      } catch (error) {
        return translatePrismaError(error);
      }
      const row: Mutable<StoredGiverBenefit> = {
        id: nextId('ben'),
        giftEventId: input.giftEventId,
        giverUserId: input.giverUserId,
        giverEmail: input.giverEmail,
        type: 'COMPLIMENTARY_TMBC_CONSULT',
        status: 'AVAILABLE',
        selectedUse: null,
        issuedAt: new Date('2026-08-26T12:00:00.000Z'),
        redeemedAt: null,
        bookingRef: null,
        revokedAt: null,
      };
      state.benefits.push(row);
      return row;
    },
    async updateGiverBenefit(id, patch: UpdateGiverBenefitInput) {
      const row = state.benefits.find((b) => b.id === id);
      if (!row) throw new Error('benefit not found');
      for (const [k, v] of Object.entries(patch)) {
        if (v !== undefined) (row as Record<string, unknown>)[k] = v;
      }
      return row;
    },

    /* ---------------- Step 3: moderation ---------------- */

    async hasModerationAction(query) {
      return state.moderationActions.some(
        (a) =>
          a.profileId === query.profileId &&
          a.giftEventId === query.giftEventId &&
          a.action === query.action,
      );
    },
    async createModerationAction(input: CreateModerationActionInput) {
      // Models the table's PRIMARY KEY: a duplicate deterministic id is a
      // benign collision, reported as "not created" rather than raised.
      if (state.moderationActions.some((a) => a.id === input.id)) return false;
      state.moderationActions.push({ ...input });
      return true;
    },
  };
}

export function createTestContext(state: InMemoryState, now = new Date('2026-08-26T12:00:00.000Z')) {
  let n = 0;
  const uow: MatchmakerUnitOfWork = {
    async run(work) {
      return work(createInMemoryRepo(state));
    },
  };
  let t = 0;
  const ctx: ServiceContext = {
    uow,
    now: () => now,
    slugSuffix: () => `t${(n += 1)}`,
    inviteToken: () => `test-token-${(t += 1)}`,
  };
  return ctx;
}

export function emptyState(): InMemoryState {
  resetIds();
  return {
    registries: [], profiles: [], media: [],
    gifts: [], invites: [], benefits: [], moderationActions: [], admissions: [],
  };
}

/** Test helper: model `MatchmakerProfile.admissionInviteId` being set (Step 7's job). */
export function linkAdmission(state: InMemoryState, inviteId: string, profileId: string): void {
  state.admissions.push({ inviteId, profileId });
}

/** Test helper: force a profile into a status without going through a service. */
export function forceStatus(state: InMemoryState, profileId: string, status: StoredProfile['status']): void {
  const row = state.profiles.find((p) => p.id === profileId);
  if (row) row.status = status;
}

export function setPhotoMedia(state: InMemoryState, profileId: string, url: string | null, approvedAt: Date | null): void {
  const row = state.profiles.find((p) => p.id === profileId);
  if (row) {
    row.photoMediaUrl = url;
    row.photoApprovedAt = approvedAt;
  }
}
