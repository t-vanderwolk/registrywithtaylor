-- ============================================================================
-- Baby Checklist admin hotfix
--
-- Run this in a Postgres client connected to the PRODUCTION database (the RDS
-- instance your Heroku app uses — same DATABASE_URL). It is safe, idempotent,
-- and clears the "ChecklistProduct table isn't live yet" banner WITHOUT a
-- deploy. Nothing here deletes or overwrites existing data.
--
-- Why this works: the admin query was failing because the app expects three
-- columns that aren't on the table yet. Adding them stops the error.
-- ============================================================================

-- 1) Add the columns the app now expects. This alone clears the banner.
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryUrl"      TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryRetailer" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "checklistItemId"   TEXT;

-- 2) If an earlier deploy left the seed migration half-applied (marked failed),
--    clear that record so future `git push heroku main` deploys aren't blocked.
--    Harmless no-op if there is no such row.
UPDATE "_prisma_migrations"
   SET rolled_back_at = now()
 WHERE migration_name = 'checklist_products_seed'
   AND finished_at IS NULL
   AND rolled_back_at IS NULL;
