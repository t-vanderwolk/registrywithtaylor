-- Admin-created checklist categories + line items (additive to the static
-- lib/checklist/data.ts baseline). Absence of rows = static-only behavior.
CREATE TABLE IF NOT EXISTS "ChecklistCategory" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChecklistCategory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ChecklistCategory_sortOrder_idx" ON "ChecklistCategory"("sortOrder");

CREATE TABLE IF NOT EXISTS "ChecklistItem" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "note" TEXT,
  "badge" TEXT,
  "taylorsTake" TEXT,
  "includeVersions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "sortOrder" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ChecklistItem_categoryId_idx" ON "ChecklistItem"("categoryId");
CREATE INDEX IF NOT EXISTS "ChecklistItem_sortOrder_idx" ON "ChecklistItem"("sortOrder");
