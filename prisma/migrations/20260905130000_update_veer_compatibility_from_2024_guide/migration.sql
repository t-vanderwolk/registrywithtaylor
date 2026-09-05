-- Add Veer compatibility rows from the site-owner supplied Veer Infant Car Seat
-- Compatibility Guide, updated November 2024. This migration only adds or
-- refreshes Veer pairs; it does not remove any compatibility data.

UPDATE "CarSeat"
SET
  "manualBabylistUrl" = 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fbritax-willow-s-infant-car-seat-with-alpine-base%2F42121%2F3571759&partnerpropertyid=7490466',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE LOWER("brand") = 'britax'
  AND LOWER("model") = 'willow s';

WITH
  veer_platforms(stroller_model, platform_kind) AS (
    VALUES
      ('All-Terrain Cruiser', 'cruiser'),
      ('Cruiser', 'cruiser'),
      ('Cruiser City', 'cruiser'),
      ('Cruiser City XL Essentials', 'cruiser'),
      ('Switch&Jog', 'switchback'),
      ('Switch&Roll', 'switchback')
  ),
  guide_seats(car_seat_brand, car_seat_model, platform_scope, compatibility_type, confidence) AS (
    VALUES
      ('Britax', 'Cypress S', 'cruiser', 'ADAPTER', 'MEDIUM'),
      ('Britax', 'Willow S', 'cruiser', 'ADAPTER', 'MEDIUM'),
      ('Britax', 'Willow SC', 'cruiser', 'ADAPTER', 'MEDIUM'),
      ('Clek', 'Liing', 'all', 'ADAPTER', 'HIGH'),
      ('Chicco', 'KeyFit 30', 'all', 'ADAPTER', 'HIGH'),
      ('Chicco', 'KeyFit 30 ClearTex', 'all', 'ADAPTER', 'HIGH'),
      ('Peg Perego', 'Primo Viaggio 4-35', 'cruiser', 'ADAPTER', 'HIGH'),
      ('Peg Perego', 'Primo Viaggio Nido', 'cruiser', 'ADAPTER', 'HIGH'),
      ('Graco', 'GoMax', 'all', 'LIMITED', 'LOW'),
      ('Graco', 'SnugRide Lite LX', 'all', 'LIMITED', 'LOW'),
      ('Graco', 'SnugRide SnugFit', 'all', 'LIMITED', 'LOW'),
      ('Graco', 'SnugRide SnugFit DLX', 'all', 'LIMITED', 'LOW'),
      ('Graco', 'SnugRide SnugFit LX', 'all', 'LIMITED', 'LOW')
  ),
  pairs AS (
    SELECT
      'veer-guide-' ||
        TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(p.stroller_model), '[^a-z0-9]+', '-', 'g')) ||
        '__' ||
        TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(s.car_seat_brand || '-' || s.car_seat_model), '[^a-z0-9]+', '-', 'g')) AS compatibility_id,
      p.stroller_model,
      p.platform_kind,
      s.car_seat_brand,
      s.car_seat_model,
      s.compatibility_type,
      s.confidence,
      CASE
        WHEN s.car_seat_brand = 'Britax' THEN 'Veer Cruiser Infant Car Seat Adapter - Britax'
        WHEN s.car_seat_brand = 'Clek' AND p.platform_kind = 'cruiser' THEN 'Veer Cruiser ICS Adapter - Cybex/Maxi-Cosi/Nuna/Clek'
        WHEN s.car_seat_brand = 'Clek' THEN 'Veer Switchback ICS Adapter - Maxi-Cosi/Nuna/Clek/Cybex'
        WHEN s.car_seat_brand = 'Chicco' AND p.platform_kind = 'cruiser' THEN 'Veer Cruiser Infant Car Seat Adapter - Chicco'
        WHEN s.car_seat_brand = 'Chicco' THEN 'Veer Switchback Infant Car Seat Adapter - Chicco'
        WHEN s.car_seat_brand = 'Peg Perego' THEN 'Veer Cruiser Infant Car Seat Adapter - Peg Perego'
        WHEN s.car_seat_brand = 'Graco' AND p.platform_kind = 'cruiser' THEN 'Veer Cruiser Infant Car Seat Adapter - Graco'
        WHEN s.car_seat_brand = 'Graco' THEN 'Veer Switchback Infant Car Seat Adapter - Graco'
      END AS adapter_type
    FROM veer_platforms p
    JOIN guide_seats s
      ON s.platform_scope = 'all'
      OR s.platform_scope = p.platform_kind
  ),
  annotated_pairs AS (
    SELECT
      *,
      CASE
        WHEN car_seat_brand = 'Graco' THEN
          '[BTV_FROZEN_V1] Should work with the Veer Graco adapter family, but Veer lists Graco as a Click Connect/SnugLock system claim rather than naming this exact current seat. Verify the adapter before buying.'
        WHEN car_seat_brand = 'Britax' AND car_seat_model IN ('Willow S', 'Willow SC') THEN
          '[BTV_FROZEN_V1] Veer lists this Britax Willow-family seat for this Cruiser platform. Use with the Cruiser seat back folded down. Confirm the exact adapter before purchase.'
        WHEN car_seat_brand = 'Britax' THEN
          '[BTV_FROZEN_V1] Veer lists Britax Cypress for this Cruiser platform; production stores this seat as Cypress S. Confirm the exact adapter before purchase.'
        WHEN car_seat_brand = 'Chicco' THEN
          '[BTV_FROZEN_V1] Manufacturer-listed adapter fit. Adapter: ' || adapter_type || '. Source: Veer Infant Car Seat Compatibility Guide (Updated November 2024), KeyFit 30 all models.'
        WHEN car_seat_brand = 'Peg Perego' THEN
          '[BTV_FROZEN_V1] Manufacturer-listed adapter fit. Adapter: ' || adapter_type || '. Source: Veer Infant Car Seat Compatibility Guide (Updated November 2024), Cruiser platforms only.'
        ELSE
          '[BTV_FROZEN_V1] Manufacturer-listed adapter fit. Adapter: ' || adapter_type || '. Source: Veer Infant Car Seat Compatibility Guide (Updated November 2024).'
      END AS notes
    FROM pairs
  )
INSERT INTO "Compatibility" (
  "id",
  "strollerId",
  "carSeatId",
  "compatibilityType",
  "adapterRequired",
  "adapterType",
  "notes",
  "confidence",
  "adapterBabylistUrl",
  "adapterPrice",
  "adapterImage",
  "adapterBabylistSku",
  "createdAt",
  "updatedAt"
)
SELECT
  ap.compatibility_id,
  stroller."id",
  car_seat."id",
  ap.compatibility_type::"CompatibilityType",
  TRUE,
  ap.adapter_type,
  ap.notes,
  ap.confidence::"CompatibilityConfidence",
  NULL,
  NULL,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM annotated_pairs ap
JOIN "Stroller" stroller
  ON LOWER(stroller."brand") = 'veer'
  AND LOWER(stroller."model") = LOWER(ap.stroller_model)
JOIN "CarSeat" car_seat
  ON LOWER(car_seat."brand") = LOWER(ap.car_seat_brand)
  AND LOWER(car_seat."model") = LOWER(ap.car_seat_model)
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;
