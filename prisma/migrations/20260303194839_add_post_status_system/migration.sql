-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "deck" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';

-- Backfill legacy boolean state into the new status model.
UPDATE "Post"
SET
  "status" = CASE
    WHEN "published" = true THEN 'PUBLISHED'::"PostStatus"
    ELSE 'DRAFT'::"PostStatus"
  END,
  "publishedAt" = CASE
    WHEN "published" = true THEN COALESCE("publishedAt", "updatedAt")
    ELSE NULL
  END,
  "scheduledFor" = NULL,
  "archivedAt" = NULL;
