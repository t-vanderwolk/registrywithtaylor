-- ============================================================================
-- PREVIEW ONLY — matchmaker_core migration (hand-written to Prisma 5 codegen
-- conventions; the authoritative file is generated on Taylor's machine by
-- `npx prisma migrate dev --name matchmaker_core` and must match this shape).
-- Fully additive: no DROP / TRUNCATE / DELETE / column narrowing anywhere.
-- Revision 3 (contract v1.5): THREE giving lanes. TMBC Service Credit removed,
-- GiftKind dropped entirely, Giver Consultation Benefit added.
-- NOTE: no ALTER TABLE against any existing table — this migration only adds
-- new types, new tables, their indexes, and their foreign keys.
-- ============================================================================

-- CreateEnum
CREATE TYPE "MatchmakerProfileStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'APPROVED', 'LIVE', 'PAUSED', 'REJECTED', 'REMOVED', 'ARCHIVED');
CREATE TYPE "MatchmakerEntryMethod" AS ENUM ('TMBC_NOMINATED', 'GIFTED_FIRST', 'RECEIVED_THROUGH_MATCHMAKER', 'ADMIN_OVERRIDE');
CREATE TYPE "MatchmakerGiftType" AS ENUM ('BABYLIST_PURCHASE', 'TMBC_CONSULT', 'EXTERNAL_SERVICE_GIFT', 'OTHER_APPROVED');
CREATE TYPE "MatchmakerGiftStatus" AS ENUM ('STARTED', 'REPORTED_SENT', 'AWAITING_RECIPIENT_CONFIRMATION', 'CONFIRMED', 'DISPUTED', 'CANCELED', 'REVERSED');
CREATE TYPE "MatchmakerConfirmationSource" AS ENUM ('RECIPIENT', 'ADMIN', 'FIRST_PARTY_WEBHOOK');
CREATE TYPE "MatchmakerGiverBenefitType" AS ENUM ('COMPLIMENTARY_TMBC_CONSULT');
CREATE TYPE "MatchmakerGiverBenefitStatus" AS ENUM ('AVAILABLE', 'REDEEMED', 'REVOKED');
CREATE TYPE "MatchmakerGiverConsultUse" AS ENUM ('OWN_REGISTRY', 'GIFTER_CONCIERGE');
CREATE TYPE "MatchmakerProofStatus" AS ENUM ('NOT_PROVIDED', 'SUBMITTED', 'ADMIN_REVIEWED');
CREATE TYPE "MatchmakerInviteReason" AS ENUM ('GIFTED_FIRST', 'RECEIVED_GIFT', 'TMBC_NOMINATION', 'ADMIN_INVITE');
CREATE TYPE "MatchmakerReportReason" AS ENUM ('REGISTRY_INCORRECT', 'MISLEADING', 'PRIVACY_CONCERN', 'INAPPROPRIATE', 'OTHER');
CREATE TYPE "MatchmakerReportStatus" AS ENUM ('OPEN', 'REVIEWED', 'DISMISSED', 'ACTIONED');

-- CreateTable
CREATE TABLE "MatchmakerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "registryId" TEXT NOT NULL,
    "registryCanonicalKey" TEXT NOT NULL,
    "publicSlug" TEXT NOT NULL,
    "status" "MatchmakerProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "entryMethod" "MatchmakerEntryMethod" NOT NULL,
    "admissionInviteId" TEXT,
    "displayFirstName" TEXT NOT NULL,
    "displayLastInitial" TEXT,
    "city" TEXT,
    "state" TEXT,
    "dueMonth" INTEGER,
    "dueYear" INTEGER,
    "familyStage" TEXT,
    "shortStory" TEXT NOT NULL,
    "priorityNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "showLastInitial" BOOLEAN NOT NULL DEFAULT false,
    "showLocation" BOOLEAN NOT NULL DEFAULT false,
    "showDueMonth" BOOLEAN NOT NULL DEFAULT false,
    "showFamilyStage" BOOLEAN NOT NULL DEFAULT false,
    "showPhoto" BOOLEAN NOT NULL DEFAULT false,
    "photoMediaId" TEXT,
    "photoApprovedAt" TIMESTAMP(3),
    "photoApprovedById" TEXT,
    "termsAcceptedAt" TIMESTAMP(3),
    "termsVersion" TEXT,
    "publicProfileConsentAt" TIMESTAMP(3),
    "consentSnapshot" JSONB,
    "registryReviewed" BOOLEAN NOT NULL DEFAULT false,
    "ownershipReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "moderationNotes" TEXT,
    "needsAdminReview" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "lastConfirmedActiveAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchmakerProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchmakerGiftEvent" (
    "id" TEXT NOT NULL,
    "recipientProfileId" TEXT NOT NULL,
    "giverUserId" TEXT,
    "giverEmail" TEXT,
    "giverName" TEXT,
    "anonymousToPublic" BOOLEAN NOT NULL DEFAULT false,
    "anonymousToRecipient" BOOLEAN NOT NULL DEFAULT false,
    "type" "MatchmakerGiftType" NOT NULL,
    "status" "MatchmakerGiftStatus" NOT NULL DEFAULT 'STARTED',
    "externalItemLabel" TEXT,
    "amountCents" INTEGER,
    "noteToFamily" TEXT,
    "giftCertificateId" TEXT,
    "externalProvider" TEXT,
    "externalGiftKind" TEXT,
    "externalOrderRef" TEXT,
    "proofPurchaseDate" TIMESTAMP(3),
    "proofNote" TEXT,
    "proofStatus" "MatchmakerProofStatus" NOT NULL DEFAULT 'NOT_PROVIDED',
    "reportedAt" TIMESTAMP(3),
    "recipientConfirmedAt" TIMESTAMP(3),
    "adminConfirmedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "confirmationSource" "MatchmakerConfirmationSource",
    "reversedAt" TIMESTAMP(3),
    "reversalReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchmakerGiftEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchmakerInvite" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" "MatchmakerInviteReason" NOT NULL,
    "originGiftEventId" TEXT,
    "nominatedById" TEXT,
    "intendedAction" TEXT NOT NULL DEFAULT 'apply',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "usedByUserId" TEXT,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchmakerInvite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchmakerReport" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reason" "MatchmakerReportReason" NOT NULL,
    "details" TEXT,
    "reporterEmail" TEXT,
    "status" "MatchmakerReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionNote" TEXT,
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchmakerReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchmakerGiverBenefit" (
    "id" TEXT NOT NULL,
    "giftEventId" TEXT NOT NULL,
    "giverUserId" TEXT,
    "giverEmail" TEXT NOT NULL,
    "type" "MatchmakerGiverBenefitType" NOT NULL DEFAULT 'COMPLIMENTARY_TMBC_CONSULT',
    "status" "MatchmakerGiverBenefitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "selectedUse" "MatchmakerGiverConsultUse",
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),
    "bookingRef" TEXT,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchmakerGiverBenefit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchmakerModerationAction" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "giftEventId" TEXT,
    "actorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "checklist" JSONB,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchmakerModerationAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchmakerProfile_registryId_key" ON "MatchmakerProfile"("registryId");
CREATE UNIQUE INDEX "MatchmakerProfile_registryCanonicalKey_key" ON "MatchmakerProfile"("registryCanonicalKey");
CREATE UNIQUE INDEX "MatchmakerProfile_publicSlug_key" ON "MatchmakerProfile"("publicSlug");
CREATE UNIQUE INDEX "MatchmakerProfile_admissionInviteId_key" ON "MatchmakerProfile"("admissionInviteId");
CREATE INDEX "MatchmakerProfile_status_idx" ON "MatchmakerProfile"("status");
CREATE INDEX "MatchmakerProfile_userId_idx" ON "MatchmakerProfile"("userId");
CREATE INDEX "MatchmakerProfile_nextReviewAt_idx" ON "MatchmakerProfile"("nextReviewAt");
CREATE INDEX "MatchmakerProfile_needsAdminReview_idx" ON "MatchmakerProfile"("needsAdminReview");
CREATE UNIQUE INDEX "MatchmakerGiftEvent_giftCertificateId_key" ON "MatchmakerGiftEvent"("giftCertificateId");
CREATE INDEX "MatchmakerGiftEvent_recipientProfileId_status_idx" ON "MatchmakerGiftEvent"("recipientProfileId", "status");
CREATE INDEX "MatchmakerGiftEvent_giverUserId_status_idx" ON "MatchmakerGiftEvent"("giverUserId", "status");
CREATE INDEX "MatchmakerGiftEvent_giverEmail_idx" ON "MatchmakerGiftEvent"("giverEmail");
CREATE INDEX "MatchmakerGiftEvent_status_idx" ON "MatchmakerGiftEvent"("status");
CREATE INDEX "MatchmakerGiftEvent_externalProvider_idx" ON "MatchmakerGiftEvent"("externalProvider");
CREATE INDEX "MatchmakerGiftEvent_confirmationSource_idx" ON "MatchmakerGiftEvent"("confirmationSource");
CREATE UNIQUE INDEX "MatchmakerInvite_tokenHash_key" ON "MatchmakerInvite"("tokenHash");
CREATE UNIQUE INDEX "MatchmakerInvite_originGiftEventId_key" ON "MatchmakerInvite"("originGiftEventId");
CREATE INDEX "MatchmakerInvite_email_idx" ON "MatchmakerInvite"("email");
CREATE INDEX "MatchmakerInvite_expiresAt_idx" ON "MatchmakerInvite"("expiresAt");
CREATE INDEX "MatchmakerReport_profileId_status_idx" ON "MatchmakerReport"("profileId", "status");
CREATE INDEX "MatchmakerReport_status_idx" ON "MatchmakerReport"("status");
CREATE UNIQUE INDEX "MatchmakerGiverBenefit_giftEventId_key" ON "MatchmakerGiverBenefit"("giftEventId");
CREATE INDEX "MatchmakerGiverBenefit_giverEmail_status_idx" ON "MatchmakerGiverBenefit"("giverEmail", "status");
CREATE INDEX "MatchmakerGiverBenefit_giverUserId_status_idx" ON "MatchmakerGiverBenefit"("giverUserId", "status");
CREATE INDEX "MatchmakerGiverBenefit_status_idx" ON "MatchmakerGiverBenefit"("status");
CREATE INDEX "MatchmakerModerationAction_profileId_createdAt_idx" ON "MatchmakerModerationAction"("profileId", "createdAt");
CREATE INDEX "MatchmakerModerationAction_giftEventId_idx" ON "MatchmakerModerationAction"("giftEventId");
CREATE INDEX "MatchmakerModerationAction_actorUserId_idx" ON "MatchmakerModerationAction"("actorUserId");

-- AddForeignKey
ALTER TABLE "MatchmakerProfile" ADD CONSTRAINT "MatchmakerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MatchmakerProfile" ADD CONSTRAINT "MatchmakerProfile_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MatchmakerProfile" ADD CONSTRAINT "MatchmakerProfile_admissionInviteId_fkey" FOREIGN KEY ("admissionInviteId") REFERENCES "MatchmakerInvite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MatchmakerProfile" ADD CONSTRAINT "MatchmakerProfile_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MatchmakerGiftEvent" ADD CONSTRAINT "MatchmakerGiftEvent_recipientProfileId_fkey" FOREIGN KEY ("recipientProfileId") REFERENCES "MatchmakerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MatchmakerGiftEvent" ADD CONSTRAINT "MatchmakerGiftEvent_giftCertificateId_fkey" FOREIGN KEY ("giftCertificateId") REFERENCES "GiftCertificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MatchmakerInvite" ADD CONSTRAINT "MatchmakerInvite_originGiftEventId_fkey" FOREIGN KEY ("originGiftEventId") REFERENCES "MatchmakerGiftEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MatchmakerReport" ADD CONSTRAINT "MatchmakerReport_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MatchmakerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MatchmakerGiverBenefit" ADD CONSTRAINT "MatchmakerGiverBenefit_giftEventId_fkey" FOREIGN KEY ("giftEventId") REFERENCES "MatchmakerGiftEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MatchmakerModerationAction" ADD CONSTRAINT "MatchmakerModerationAction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MatchmakerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
