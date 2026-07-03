-- Admin-entered manual Amazon affiliate links.
-- Stroller & CarSeat get a direct Amazon link; the affiliate catalog product
-- gets a manual Amazon override that the feed sync must never touch.
ALTER TABLE "Stroller" ADD COLUMN IF NOT EXISTS "amazonUrl" TEXT;
ALTER TABLE "CarSeat" ADD COLUMN IF NOT EXISTS "amazonUrl" TEXT;
ALTER TABLE "AffiliateCatalogProduct" ADD COLUMN IF NOT EXISTS "manualAmazonUrl" TEXT;
