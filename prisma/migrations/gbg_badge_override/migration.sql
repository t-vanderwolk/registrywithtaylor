-- Per-product GoodBuy Gear badge override (force show/hide the open-box badge
-- on funnel-tool + blog product cards). Absence of a row = automatic behavior.
CREATE TABLE IF NOT EXISTS "GbgBadgeOverride" (
  "key" TEXT NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'off',
  "brand" TEXT,
  "name" TEXT,
  "surface" TEXT,
  "note" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" TEXT,
  CONSTRAINT "GbgBadgeOverride_pkey" PRIMARY KEY ("key")
);
