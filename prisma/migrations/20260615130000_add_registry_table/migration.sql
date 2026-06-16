-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260615130000_add_registry_table
-- Adds:      Platform enum + Registry table
--            Registry stores baby registry URLs that members add from their
--            member dashboard (/dashboard). Each registry belongs to a User
--            and references one of the supported Platform enum values.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Platform enum (idempotent — may already exist) ───────────────────────

DO $$ BEGIN
  CREATE TYPE "Platform" AS ENUM (
    'BABYLIST', 'AMAZON', 'TARGET', 'BUYBUYBABY', 'WALMART', 'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ─── 2. Registry table (idempotent) ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Registry" (
  "id"             TEXT        NOT NULL,
  "userId"         TEXT        NOT NULL,
  "platform"       "Platform"  NOT NULL,
  "name"           TEXT,
  "url"            TEXT        NOT NULL,
  "itemCount"      INTEGER,
  "completedCount" INTEGER,
  "notes"          TEXT,
  "isPublic"       BOOLEAN     NOT NULL DEFAULT false,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Registry_pkey" PRIMARY KEY ("id")
);

-- ─── 3. Foreign key (idempotent) ─────────────────────────────────────────────

DO $$ BEGIN
  ALTER TABLE "Registry"
    ADD CONSTRAINT "Registry_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ─── 4. Indexes (idempotent) ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "Registry_userId_idx"   ON "Registry"("userId");
CREATE INDEX IF NOT EXISTS "Registry_platform_idx" ON "Registry"("platform");
