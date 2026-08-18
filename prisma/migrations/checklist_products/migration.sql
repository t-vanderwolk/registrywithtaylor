-- Baby Checklist: admin-editable product picks (Taylor's Picks).
CREATE TABLE IF NOT EXISTS "ChecklistProduct" (
  "id" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "product" TEXT NOT NULL,
  "review" TEXT NOT NULL DEFAULT '',
  "bestFor" TEXT NOT NULL DEFAULT '',
  "standout" TEXT NOT NULL DEFAULT '',
  "affiliateUrl" TEXT NOT NULL DEFAULT 'AFFILIATE_LINK_NEEDED',
  "amazonUrl" TEXT,
  "secondaryUrl" TEXT,
  "secondaryRetailer" TEXT,
  "price" DOUBLE PRECISION,
  "priceSource" TEXT,
  "retailer" TEXT,
  "imageUrl" TEXT,
  "badge" TEXT,
  "disclosure" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChecklistProduct_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ChecklistProduct_sortOrder_idx" ON "ChecklistProduct"("sortOrder");

-- Additive columns (safe if the table already existed from an earlier deploy).
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryUrl" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryRetailer" TEXT;
