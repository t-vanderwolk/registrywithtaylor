-- Make the original checklist structure editable through the same admin model
-- used for manually created categories/items. These fields are additive and do
-- not touch ChecklistProduct rows or affiliate URLs.
ALTER TABLE "ChecklistCategory" ADD COLUMN IF NOT EXISTS "hidden" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "timing" TEXT;
ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "take" TEXT;
ALTER TABLE "ChecklistItem" ADD COLUMN IF NOT EXISTS "hidden" BOOLEAN NOT NULL DEFAULT false;

