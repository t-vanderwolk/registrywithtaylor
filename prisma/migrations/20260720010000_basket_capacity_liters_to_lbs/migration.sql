-- Store the storage-basket WEIGHT limit (lbs) instead of estimated volume (litres),
-- which is what stroller brands actually publish. Rename if the litres column
-- already exists, otherwise ensure the lbs column is present. Idempotent.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'StrollerSpec' AND column_name = 'basketCapacityLiters'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'StrollerSpec' AND column_name = 'basketCapacityLbs'
  ) THEN
    ALTER TABLE "StrollerSpec" RENAME COLUMN "basketCapacityLiters" TO "basketCapacityLbs";
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'StrollerSpec' AND column_name = 'basketCapacityLbs'
  ) THEN
    ALTER TABLE "StrollerSpec" ADD COLUMN "basketCapacityLbs" DOUBLE PRECISION;
  END IF;
END $$;
