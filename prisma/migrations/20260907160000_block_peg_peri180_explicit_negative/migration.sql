-- PEG's June 2026 USA/Canada adapter charts explicitly list Nuna compatibility
-- for IKCS0018 (Ypsi / Vivace / Switch) and IKCS0030 (City Loop / City Loop Pro).
-- Those rows are the trigger for the app's shared Maxi-Cosi / Nuna / CYBEX / Clek
-- adapter-family display rule. The same charts explicitly mark Maxi-Cosi Peri
-- 180 Rotating as not compatible, so Peri 180 gets INCOMPATIBLE guard rows that
-- block shared-adapter inference from surfacing it as a logical Maxi-Cosi match.
WITH
  peg_stroller_targets(model, source_chart) AS (
    VALUES
      ('YPSI', 'IKCS0018'),
      ('Vivace', 'IKCS0018'),
      ('Switch', 'IKCS0018'),
      ('City Loop', 'IKCS0030'),
      ('City Loop Pro', 'IKCS0030')
  ),
  nuna_trigger_pairs AS (
    SELECT
      'peg-nuna-trigger-' ||
        TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(stroller."model"), '[^a-z0-9]+', '-', 'g')) ||
        '-' ||
        TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(seat."model"), '[^a-z0-9]+', '-', 'g')) AS compatibility_id,
      stroller."id" AS stroller_id,
      seat."id" AS car_seat_id,
      targets.source_chart,
      CASE
        WHEN targets.source_chart = 'IKCS0018' THEN 'Peg Perego Adapter for Car Seat (IKCS0018)'
        WHEN targets.source_chart = 'IKCS0030' THEN 'Peg Perego Foldable Adapter for Car Seat (IKCS0030)'
      END AS adapter_type,
      CASE
        WHEN targets.source_chart = 'IKCS0018' THEN 'https://babylist.pxf.io/c/6560395/1160375/13580?prodsku=2428247&u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fpeg-perego-car-seat-adapter-for-ypsi-veloce-vivace-strollers%2F73090%2F2428247&intsrc=CATF_8981'
        ELSE NULL
      END AS adapter_url,
      CASE
        WHEN targets.source_chart = 'IKCS0018' THEN 49.99::double precision
        ELSE NULL::double precision
      END AS adapter_price,
      CASE
        WHEN targets.source_chart = 'IKCS0018' THEN 'https://images.ctfassets.net/50gzycvace50/fdc39cf3e66a085a514839a853e3a41d1a125ac594a09cdc54d4fd1aa76105d6/d3af9ae612386a5287dcb8a9ee97ca90/fdc39cf3e66a085a514839a853e3a41d1a125ac594a09cdc54d4fd1aa76105d6.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=620&h=620'
        ELSE NULL
      END AS adapter_image,
      CASE
        WHEN targets.source_chart = 'IKCS0018' THEN '2428247'
        ELSE NULL
      END AS adapter_sku
    FROM peg_stroller_targets targets
    JOIN "Stroller" stroller
      ON LOWER(stroller."brand") = 'peg perego'
      AND LOWER(stroller."model") = LOWER(targets.model)
    JOIN "CarSeat" seat
      ON LOWER(seat."brand") = 'nuna'
      AND LOWER(seat."model") IN ('pipa aire', 'pipa aire rx', 'pipa rx', 'pipa urbn')
      AND seat."seatType" = 'INFANT'
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
  compatibility_id,
  stroller_id,
  car_seat_id,
  'ADAPTER'::"CompatibilityType",
  TRUE,
  adapter_type,
  '[PEG_AUDIT_2026_09] PEG ' || source_chart || ' USA/Canada compatibility chart lists this Nuna infant seat as compatible through the PEG car seat adapter. Shared-adapter display also applies to Maxi-Cosi / CYBEX / Clek unless PEG marks a model incompatible.',
  'HIGH'::"CompatibilityConfidence",
  adapter_url,
  adapter_price,
  adapter_image,
  adapter_sku,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM nuna_trigger_pairs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "adapterBabylistUrl" = COALESCE(EXCLUDED."adapterBabylistUrl", "Compatibility"."adapterBabylistUrl"),
  "adapterPrice" = COALESCE(EXCLUDED."adapterPrice", "Compatibility"."adapterPrice"),
  "adapterImage" = COALESCE(EXCLUDED."adapterImage", "Compatibility"."adapterImage"),
  "adapterBabylistSku" = COALESCE(EXCLUDED."adapterBabylistSku", "Compatibility"."adapterBabylistSku"),
  "updatedAt" = CURRENT_TIMESTAMP;

WITH
  peg_stroller_targets(model, source_chart) AS (
    VALUES
      ('YPSI', 'IKCS0018'),
      ('Vivace', 'IKCS0018'),
      ('Switch', 'IKCS0018'),
      ('City Loop', 'IKCS0030'),
      ('City Loop Pro', 'IKCS0030')
  ),
  target_pairs AS (
    SELECT
      'peg-peri180-negative-' ||
        TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(stroller."model"), '[^a-z0-9]+', '-', 'g')) AS compatibility_id,
      stroller."id" AS stroller_id,
      seat."id" AS car_seat_id,
      targets.source_chart
    FROM peg_stroller_targets targets
    JOIN "Stroller" stroller
      ON LOWER(stroller."brand") = 'peg perego'
      AND LOWER(stroller."model") = LOWER(targets.model)
    JOIN "CarSeat" seat
      ON LOWER(seat."brand") = 'maxi-cosi'
      AND LOWER(seat."model") = 'peri 180'
      AND seat."seatType" = 'INFANT'
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
  compatibility_id,
  stroller_id,
  car_seat_id,
  'INCOMPATIBLE'::"CompatibilityType",
  FALSE,
  NULL,
  '[PEG_AUDIT_2026_09] PEG ' || source_chart || ' USA/Canada compatibility chart marks Maxi-Cosi Peri 180 Rotating as not compatible on this chassis.',
  'HIGH'::"CompatibilityConfidence",
  NULL,
  NULL,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM target_pairs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "adapterBabylistUrl" = EXCLUDED."adapterBabylistUrl",
  "adapterPrice" = EXCLUDED."adapterPrice",
  "adapterImage" = EXCLUDED."adapterImage",
  "adapterBabylistSku" = EXCLUDED."adapterBabylistSku",
  "updatedAt" = CURRENT_TIMESTAMP;
