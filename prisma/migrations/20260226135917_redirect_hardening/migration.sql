-- DropForeignKey
ALTER TABLE "AffiliateClick" DROP CONSTRAINT "AffiliateClick_affiliateLinkId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateLink" DROP CONSTRAINT "AffiliateLink_affiliateId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateLink" DROP CONSTRAINT "AffiliateLink_blogPostId_fkey";

-- Rename columns to preserve existing link/click history
ALTER TABLE "AffiliateClick" RENAME COLUMN "affiliateLinkId" TO "linkId";
ALTER TABLE "AffiliateClick" RENAME COLUMN "ipAddress" TO "ipHash";

ALTER TABLE "AffiliateLink" RENAME COLUMN "affiliateId" TO "partnerId";
ALTER TABLE "AffiliateLink" RENAME COLUMN "shortCode" TO "code";
ALTER TABLE "AffiliateLink" RENAME COLUMN "context" TO "label";

-- AffiliateLink shape hardening
ALTER TABLE "AffiliateLink"
  ALTER COLUMN "partnerId" DROP NOT NULL,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AffiliateClick shape hardening
ALTER TABLE "AffiliateClick"
  ADD COLUMN "path" TEXT;

-- AffiliatePartner domain allow-list
ALTER TABLE "AffiliatePartner"
  ADD COLUMN "allowedDomains" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Unique / query indexes
DROP INDEX IF EXISTS "AffiliateLink_shortCode_key";
CREATE UNIQUE INDEX "AffiliateLink_code_key" ON "AffiliateLink"("code");

CREATE INDEX "AffiliateLink_partnerId_idx" ON "AffiliateLink"("partnerId");
CREATE INDEX "AffiliateLink_createdAt_idx" ON "AffiliateLink"("createdAt");
CREATE INDEX "AffiliateLink_blogPostId_idx" ON "AffiliateLink"("blogPostId");
CREATE INDEX "AffiliateClick_linkId_createdAt_idx" ON "AffiliateClick"("linkId", "createdAt");
CREATE INDEX "AffiliateClick_createdAt_idx" ON "AffiliateClick"("createdAt");

-- Recreate FKs with updated semantics
ALTER TABLE "AffiliateLink"
  ADD CONSTRAINT "AffiliateLink_partnerId_fkey"
  FOREIGN KEY ("partnerId") REFERENCES "AffiliatePartner"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AffiliateLink"
  ADD CONSTRAINT "AffiliateLink_blogPostId_fkey"
  FOREIGN KEY ("blogPostId") REFERENCES "Post"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AffiliateClick"
  ADD CONSTRAINT "AffiliateClick_linkId_fkey"
  FOREIGN KEY ("linkId") REFERENCES "AffiliateLink"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
