-- Compare-tool stroller dimensions: modular, airplane-carry-on (overhead bin),
-- and exact storage-basket volume in litres. Nullable; populated by the seed
-- script and editable in the admin Strollers manager.
ALTER TABLE "StrollerSpec" ADD COLUMN IF NOT EXISTS "modular" BOOLEAN;
ALTER TABLE "StrollerSpec" ADD COLUMN IF NOT EXISTS "fitsOverheadBin" BOOLEAN;
ALTER TABLE "StrollerSpec" ADD COLUMN IF NOT EXISTS "basketCapacityLiters" DOUBLE PRECISION;
