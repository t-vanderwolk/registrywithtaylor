-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260619140000_add_babylist_catalog_cache
-- Adds: BabylistCatalogItem — a local mirror of the Babylist (Impact) catalog,
--       refreshed by scripts/cacheBabylistCatalog.ts, used for fast admin SKU
--       search. Idempotent to match this project's conventions.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "BabylistCatalogItem" (
  "sku"          TEXT             NOT NULL,
  "name"         TEXT             NOT NULL,
  "manufacturer" TEXT,
  "url"          TEXT             NOT NULL,
  "imageUrl"     TEXT,
  "price"        DOUBLE PRECISION,
  "updatedAt"    TIMESTAMP(3)     NOT NULL,

  CONSTRAINT "BabylistCatalogItem_pkey" PRIMARY KEY ("sku")
);

CREATE INDEX IF NOT EXISTS "BabylistCatalogItem_manufacturer_idx" ON "BabylistCatalogItem"("manufacturer");
