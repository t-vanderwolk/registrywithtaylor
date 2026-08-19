-- Add ChecklistProduct.checklistItemId (and re-assert the other admin columns).
--
-- This lives in its OWN migration on purpose: checklist_products_seed was already
-- applied on production before checklistItemId existed, and Prisma skips
-- already-applied migrations by name — so editing that file never re-runs it. A
-- brand-new migration is the only way to apply new schema to an already-migrated
-- database. All three are ADD COLUMN IF NOT EXISTS, so this is idempotent and a
-- no-op on any environment where the columns already exist.
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryUrl"      TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryRetailer" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "checklistItemId"   TEXT;
