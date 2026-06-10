-- CreateEnum
CREATE TYPE "BlogStage" AS ENUM ('IDEA', 'OUTLINE', 'DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "stage" "BlogStage" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "focusKeyword" TEXT,
ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT,
ADD COLUMN "canonicalUrl" TEXT;

-- Backfill omitted: stage column has DEFAULT 'DRAFT', which covers all existing rows.
-- (archivedAt, publishedAt, and PostStatus are added in the following migration.)
