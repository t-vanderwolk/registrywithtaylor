/**
 * Production Prisma implementation of the Matchmaker persistence port.
 *
 * Follows the repo's established conventions:
 *  - the shared client from `@/lib/server/prisma` (default export);
 *  - `prisma.$transaction(async (tx) => ...)` interactive transactions, the
 *    dominant pattern in this codebase (see app/api/blog/route.ts,
 *    app/api/auth/register/route.ts, app/api/admin/members/[id]/approve);
 *  - Prisma failures translated via `translatePrismaError`, never surfaced raw.
 *
 * Note: `lib/server/prismaRegistry.ts` exists as an `any`-typed shim from before
 * the client was regenerated. Its premise is now stale — `prisma.registry` is
 * fully typed and available — so this module uses the real delegate. The shim is
 * left untouched; retiring it is out of Step 2's scope.
 */

import type { Prisma, PrismaClient } from '@prisma/client';

import prisma from '@/lib/server/prisma';

import { translatePrismaError } from './errors';
import type {
  CreateProfileInput,
  CreateRegistryInput,
  MatchmakerRepo,
  MatchmakerUnitOfWork,
  ServiceContext,
  StoredProfile,
  StoredPublicProfile,
  StoredRegistry,
  UpdateProfileInput,
} from './ports';

type Tx = Prisma.TransactionClient | PrismaClient;

const PROFILE_WITH_REGISTRY = {
  registry: { select: { userId: true, url: true } },
} as const;

type ProfileRow = Prisma.MatchmakerProfileGetPayload<{
  include: typeof PROFILE_WITH_REGISTRY;
}>;

type ProfileRowWithMedia = Prisma.MatchmakerProfileGetPayload<{
  include: {
    registry: { select: { userId: true; url: true } };
    photoMedia: { select: { url: true } };
  };
}>;

function toStoredProfile(row: ProfileRow): StoredProfile {
  return {
    id: row.id,
    userId: row.userId,
    registryId: row.registryId,
    registryUserId: row.registry.userId,
    registryCanonicalKey: row.registryCanonicalKey,
    publicSlug: row.publicSlug,
    status: row.status,
    entryMethod: row.entryMethod,
    displayFirstName: row.displayFirstName,
    displayLastInitial: row.displayLastInitial,
    city: row.city,
    state: row.state,
    dueMonth: row.dueMonth,
    dueYear: row.dueYear,
    familyStage: row.familyStage,
    shortStory: row.shortStory,
    priorityNeeds: row.priorityNeeds,
    showLastInitial: row.showLastInitial,
    showLocation: row.showLocation,
    showDueMonth: row.showDueMonth,
    showFamilyStage: row.showFamilyStage,
    showPhoto: row.showPhoto,
    photoMediaId: row.photoMediaId,
    photoApprovedAt: row.photoApprovedAt,
    termsAcceptedAt: row.termsAcceptedAt,
    termsVersion: row.termsVersion,
    publicProfileConsentAt: row.publicProfileConsentAt,
    registryReviewed: row.registryReviewed,
    ownershipReviewed: row.ownershipReviewed,
    reviewedAt: row.reviewedAt,
    reviewedById: row.reviewedById,
    moderationNotes: row.moderationNotes,
    needsAdminReview: row.needsAdminReview,
    publishedAt: row.publishedAt,
  };
}

function toStoredRegistry(row: {
  id: string;
  userId: string;
  platform: string;
  url: string;
  name: string | null;
}): StoredRegistry {
  return {
    id: row.id,
    userId: row.userId,
    platform: row.platform,
    url: row.url,
    name: row.name,
  };
}

export function createPrismaMatchmakerRepo(tx: Tx): MatchmakerRepo {
  return {
    async findProfileByCanonicalKey(canonicalKey) {
      const row = await tx.matchmakerProfile.findUnique({
        where: { registryCanonicalKey: canonicalKey },
        include: PROFILE_WITH_REGISTRY,
      });
      return row ? toStoredProfile(row) : null;
    },

    async findProfileById(id) {
      const row = await tx.matchmakerProfile.findUnique({
        where: { id },
        include: PROFILE_WITH_REGISTRY,
      });
      return row ? toStoredProfile(row) : null;
    },

    async listRegistriesForUser(userId) {
      const rows = await tx.registry.findMany({
        where: { userId, platform: 'BABYLIST' },
        select: { id: true, userId: true, platform: true, url: true, name: true },
        orderBy: { createdAt: 'asc' },
      });
      return rows.map(toStoredRegistry);
    },

    async findRegistryById(id) {
      const row = await tx.registry.findUnique({
        where: { id },
        select: { id: true, userId: true, platform: true, url: true, name: true },
      });
      return row ? toStoredRegistry(row) : null;
    },

    async createRegistry(input: CreateRegistryInput) {
      try {
        const row = await tx.registry.create({
          data: {
            userId: input.userId,
            platform: 'BABYLIST',
            url: input.url,
            name: input.name,
          },
          select: { id: true, userId: true, platform: true, url: true, name: true },
        });
        return toStoredRegistry(row);
      } catch (error) {
        return translatePrismaError(error);
      }
    },

    async updateRegistryUrl(id, url) {
      try {
        const row = await tx.registry.update({
          where: { id },
          data: { url },
          select: { id: true, userId: true, platform: true, url: true, name: true },
        });
        return toStoredRegistry(row);
      } catch (error) {
        return translatePrismaError(error);
      }
    },

    async createProfile(input: CreateProfileInput) {
      try {
        const row = await tx.matchmakerProfile.create({
          data: {
            userId: input.userId,
            registryId: input.registryId,
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
          },
          include: PROFILE_WITH_REGISTRY,
        });
        return toStoredProfile(row);
      } catch (error) {
        return translatePrismaError(error);
      }
    },

    async updateProfile(id, patch: UpdateProfileInput) {
      const data: Prisma.MatchmakerProfileUpdateInput = {};
      const assign = <K extends keyof UpdateProfileInput>(key: K) => {
        if (patch[key] !== undefined) {
          (data as Record<string, unknown>)[key as string] = patch[key];
        }
      };

      (
        [
          'status', 'displayFirstName', 'displayLastInitial', 'city', 'state',
          'dueMonth', 'dueYear', 'familyStage', 'shortStory',
          'showLastInitial', 'showLocation', 'showDueMonth', 'showFamilyStage',
          'showPhoto', 'photoMediaId', 'termsAcceptedAt', 'termsVersion',
          'publicProfileConsentAt', 'consentSnapshot', 'registryReviewed',
          'ownershipReviewed', 'reviewedAt', 'reviewedById', 'moderationNotes',
          'needsAdminReview',
        ] as (keyof UpdateProfileInput)[]
      ).forEach(assign);

      if (patch.priorityNeeds !== undefined) {
        (data as Record<string, unknown>).priorityNeeds = [...patch.priorityNeeds];
      }

      try {
        const row = await tx.matchmakerProfile.update({
          where: { id },
          data,
          include: PROFILE_WITH_REGISTRY,
        });
        return toStoredProfile(row);
      } catch (error) {
        return translatePrismaError(error);
      }
    },

    async isPublicSlugTaken(slug) {
      const found = await tx.matchmakerProfile.findUnique({
        where: { publicSlug: slug },
        select: { id: true },
      });
      return found !== null;
    },

    async mediaExists(mediaId) {
      const found = await tx.media.findUnique({ where: { id: mediaId }, select: { id: true } });
      return found !== null;
    },

    async findLiveProfileBySlug(slug): Promise<StoredPublicProfile | null> {
      const row: ProfileRowWithMedia | null = await tx.matchmakerProfile.findUnique({
        where: { publicSlug: slug },
        include: {
          registry: { select: { userId: true, url: true } },
          photoMedia: { select: { url: true } },
        },
      });

      if (!row || row.status !== 'LIVE') return null;

      return {
        ...toStoredProfile(row),
        photoMedia: row.photoMedia ? { url: row.photoMedia.url } : null,
        registryUrl: row.registry.url,
      };
    },
  };
}

/** Wraps each unit of work in the repo's standard interactive transaction. */
export const prismaUnitOfWork: MatchmakerUnitOfWork = {
  async run(work) {
    return prisma.$transaction(async (tx) => work(createPrismaMatchmakerRepo(tx)));
  },
};

function defaultSlugSuffix(): string {
  // 6 lowercase base36 characters; collisions are retried by generatePublicSlug.
  return Math.floor(Math.random() * 36 ** 6)
    .toString(36)
    .padStart(6, '0');
}

/** The production service context. Tests build their own. */
export const matchmakerServiceContext: ServiceContext = {
  uow: prismaUnitOfWork,
  now: () => new Date(),
  slugSuffix: defaultSlugSuffix,
};
