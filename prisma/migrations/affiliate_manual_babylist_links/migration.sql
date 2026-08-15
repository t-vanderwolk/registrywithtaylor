-- Admin-entered manual Babylist affiliate links.
-- Stroller & CarSeat get a direct Babylist link that the feed sync must never
-- touch. (The synced `babylistUrl` column can be nulled/overwritten by
-- scripts/syncBabylistCatalog.ts; this manual field is human-owned.)
ALTER TABLE "Stroller" ADD COLUMN IF NOT EXISTS "manualBabylistUrl" TEXT;
ALTER TABLE "CarSeat" ADD COLUMN IF NOT EXISTS "manualBabylistUrl" TEXT;
