-- CreateEnum
CREATE TYPE "BlogStage" AS ENUM ('IDEA', 'OUTLINE', 'DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "stage" "BlogStage" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "focusKeyword" TEXT,
ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT,
ADD COLUMN "canonicalUrl" TEXT;

-- Backfill existing rows into the editorial stage pipeline.
UPDATE "Post"
SET "stage" = CASE
  WHEN "archivedAt" IS NOT NULL OR "status" = 'ARCHIVED'::"PostStatus" THEN 'ARCHIVED'::"BlogStage"
  WHEN "publishedAt" IS NOT NULL OR "status" = 'PUBLISHED'::"PostStatus" THEN 'PUBLISHED'::"BlogStage"
  ELSE 'DRAFT'::"BlogStage"
END;
