-- First-party, bot-filtered site-wide page-view log. One row per counted page
-- view; pageType buckets the path (blog / tool / marketing / other) so the admin
-- dashboard can chart daily total + blog traffic without depending on GA4.
CREATE TABLE IF NOT EXISTS "PageView" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "pageType" TEXT NOT NULL,
  "visitorHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "idx_pageview_createdat"
  ON "PageView" ("createdAt");

CREATE INDEX IF NOT EXISTS "idx_pageview_pagetype_createdat"
  ON "PageView" ("pageType", "createdAt");
