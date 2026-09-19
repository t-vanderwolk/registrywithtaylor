-- Additional retailer links for checklist product cards.
-- Ordered JSON array of { "retailer": string, "url": string }.
-- Additive and nullable: existing rows keep rendering from
-- affiliateUrl / amazonUrl / secondaryUrl with no backfill required.
ALTER TABLE "ChecklistProduct" ADD COLUMN "retailerLinks" JSONB;
