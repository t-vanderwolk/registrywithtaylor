-- Admin-entered manual product image URL. Overrides the Babylist feed image on
-- the travel-system checker, compare tool, and quiz cards, and is never touched
-- by the feed sync.
ALTER TABLE "Stroller" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "CarSeat" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
