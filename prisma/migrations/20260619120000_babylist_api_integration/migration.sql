-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260619120000_babylist_api_integration
-- Adds:      Babylist (Impact.com) sync fields to Stroller / CarSeat,
--            adapter sync fields to Compatibility, and the StrollerSpec table
--            (Stroller Matchmaker data layer).
-- Written idempotently (IF NOT EXISTS / duplicate_object guards) to match this
-- project's migration conventions and stay safe to `migrate deploy` on a DB
-- that may already have some of these objects.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Stroller — Babylist sync fields ──────────────────────────────────────
ALTER TABLE "Stroller"
  ADD COLUMN IF NOT EXISTS "babylistSku"       TEXT,
  ADD COLUMN IF NOT EXISTS "babylistUrl"       TEXT,
  ADD COLUMN IF NOT EXISTS "babylistPrice"     DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "babylistImage"     TEXT,
  ADD COLUMN IF NOT EXISTS "babylistUpdatedAt" TIMESTAMP(3);

-- ─── 2. CarSeat — Babylist sync fields ───────────────────────────────────────
ALTER TABLE "CarSeat"
  ADD COLUMN IF NOT EXISTS "babylistSku"       TEXT,
  ADD COLUMN IF NOT EXISTS "babylistUrl"       TEXT,
  ADD COLUMN IF NOT EXISTS "babylistPrice"     DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "babylistImage"     TEXT,
  ADD COLUMN IF NOT EXISTS "babylistUpdatedAt" TIMESTAMP(3);

-- ─── 3. Compatibility — adapter sync fields ──────────────────────────────────
ALTER TABLE "Compatibility"
  ADD COLUMN IF NOT EXISTS "adapterBabylistUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "adapterPrice"       DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "adapterImage"       TEXT,
  ADD COLUMN IF NOT EXISTS "adapterBabylistSku" TEXT,
  ADD COLUMN IF NOT EXISTS "adapterUpdatedAt"   TIMESTAMP(3);

-- ─── 4. StrollerSpec table (matchmaker data layer) ───────────────────────────
CREATE TABLE IF NOT EXISTS "StrollerSpec" (
  "id"                 TEXT             NOT NULL,
  "strollerId"         TEXT             NOT NULL,
  "babylistSku"        TEXT,
  "babylistUrl"        TEXT,
  "babylistPrice"      DOUBLE PRECISION,
  "babylistImage"      TEXT,
  "babylistUpdatedAt"  TIMESTAMP(3),
  "priceRange"         TEXT,
  "lifestyle"          TEXT[]           NOT NULL DEFAULT ARRAY[]::TEXT[],
  "foldType"           TEXT,
  "isExpandable"       BOOLEAN          NOT NULL DEFAULT false,
  "maxWeightLbs"       INTEGER,
  "ownWeightLbs"       DOUBLE PRECISION,
  "suitableFromBirth"  BOOLEAN          NOT NULL DEFAULT true,
  "suitableForJogging" BOOLEAN          NOT NULL DEFAULT false,
  "budgetMin"          INTEGER,
  "budgetMax"          INTEGER,
  "createdAt"          TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3)     NOT NULL,

  CONSTRAINT "StrollerSpec_pkey" PRIMARY KEY ("id")
);

-- ─── 5. One spec per stroller ────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS "StrollerSpec_strollerId_key" ON "StrollerSpec"("strollerId");

-- ─── 6. Foreign key StrollerSpec.strollerId → Stroller.id (idempotent) ───────
DO $$ BEGIN
  ALTER TABLE "StrollerSpec"
    ADD CONSTRAINT "StrollerSpec_strollerId_fkey"
    FOREIGN KEY ("strollerId") REFERENCES "Stroller"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
