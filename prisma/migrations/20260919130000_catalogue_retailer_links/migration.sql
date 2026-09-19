-- Extra admin-entered retailer links for curated stroller and car seat rows.
-- Ordered JSON array of { "retailer": string, "url": string }.
-- Additive and nullable; no backfill, and the Babylist feed sync never writes here.
ALTER TABLE "Stroller" ADD COLUMN "retailerLinks" JSONB;
ALTER TABLE "CarSeat" ADD COLUMN "retailerLinks" JSONB;
