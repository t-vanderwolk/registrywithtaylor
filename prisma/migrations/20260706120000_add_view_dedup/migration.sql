-- Durable, cookie-independent per-visitor view de-duplication.
-- One row per (scope, content, visitor, day-bucket); a unique violation on
-- insert means "already counted this visitor today", so the view counter is
-- only incremented on a successful insert.
CREATE TABLE IF NOT EXISTS "ViewDedup" (
  "id" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "contentId" TEXT NOT NULL,
  "visitorHash" TEXT NOT NULL,
  "bucket" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ViewDedup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "uniq_viewdedup_scope_content_visitor_bucket"
  ON "ViewDedup" ("scope", "contentId", "visitorHash", "bucket");

CREATE INDEX IF NOT EXISTS "idx_viewdedup_createdat"
  ON "ViewDedup" ("createdAt");
