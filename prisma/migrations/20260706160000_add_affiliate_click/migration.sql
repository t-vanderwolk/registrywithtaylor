-- Unified outbound affiliate-click log across tools, blog, and tracked anchors.
-- Powers the admin dashboard's by-retailer breakdown so click totals can be
-- reconciled against each affiliate network's own dashboard.
CREATE TABLE IF NOT EXISTS "AffiliateClick" (
  "id" TEXT NOT NULL,
  "retailer" TEXT NOT NULL,
  "network" TEXT,
  "brand" TEXT,
  "product" TEXT,
  "url" TEXT NOT NULL,
  "source" TEXT,
  "pageType" TEXT,
  "path" TEXT,
  "visitorHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "idx_affclick_retailer_createdat"
  ON "AffiliateClick" ("retailer", "createdAt");

CREATE INDEX IF NOT EXISTS "idx_affclick_createdat"
  ON "AffiliateClick" ("createdAt");
