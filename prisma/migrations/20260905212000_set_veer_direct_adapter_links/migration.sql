-- Attach direct Veer product links and images for missing Peg Perego and Graco
-- Cruiser-family adapter rows. This follows the already-applied Amazon adapter
-- link migration without changing its checksum.

WITH direct_veer_adapter_targets AS (
  SELECT
    compat."id" AS compatibility_id,
    CASE
      WHEN stroller."model" IN ('All-Terrain Cruiser', 'Cruiser', 'Cruiser City') THEN 'cruiser'
      WHEN stroller."model" = 'Cruiser City XL Essentials' THEN 'cruiser_xl'
      ELSE NULL
    END AS platform_kind,
    CASE
      WHEN car_seat."brand" = 'Peg Perego' THEN 'peg_perego'
      WHEN car_seat."brand" = 'Graco' THEN 'graco'
      ELSE NULL
    END AS adapter_family
  FROM "Compatibility" compat
  JOIN "Stroller" stroller
    ON stroller."id" = compat."strollerId"
  JOIN "CarSeat" car_seat
    ON car_seat."id" = compat."carSeatId"
  WHERE LOWER(stroller."brand") = 'veer'
    AND compat."adapterRequired" = TRUE
),
resolved_direct_adapter_targets AS (
  SELECT
    compatibility_id,
    CASE
      WHEN platform_kind = 'cruiser' AND adapter_family = 'peg_perego' THEN 'Veer Cruiser Infant Car Seat Adapter - Peg Perego'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'peg_perego' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Peg Perego'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'graco' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Graco'
      ELSE NULL
    END AS adapter_type,
    CASE
      WHEN platform_kind = 'cruiser' AND adapter_family = 'peg_perego' THEN 'https://goveer.com/products/infant-car-seat-adapter?variant=44742405030202'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'peg_perego' THEN 'https://goveer.com/products/infant-car-seat-adapter?variant=47252351025466'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'graco' THEN 'https://goveer.com/products/infant-car-seat-adapter?variant=44742405194042'
      ELSE NULL
    END AS adapter_url,
    CASE
      WHEN platform_kind = 'cruiser' AND adapter_family = 'peg_perego' THEN 'https://cdn.shopify.com/s/files/1/0697/9574/2010/files/ICS-Adapter_Peg_Perego.png?v=1747411589&width=80'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'peg_perego' THEN 'https://cdn.shopify.com/s/files/1/0697/9574/2010/files/Peg_Perego_XL_ICS_Adapter_Perspective-ICS_Adapter_V2-3400x3400.jpg?v=1747409765&width=80'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'graco' THEN 'https://cdn.shopify.com/s/files/1/0697/9574/2010/files/Graco_XL_ICS_Adapter_Perspective-ICS_Adapter_V2-3400x3400.jpg?v=1747409707&width=80'
      ELSE NULL
    END AS adapter_image
  FROM direct_veer_adapter_targets
  WHERE platform_kind IN ('cruiser', 'cruiser_xl')
    AND adapter_family IN ('peg_perego', 'graco')
)
UPDATE "Compatibility" compat
SET
  "adapterType" = targets.adapter_type,
  "adapterBabylistUrl" = targets.adapter_url,
  "adapterImage" = targets.adapter_image,
  "adapterUpdatedAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP
FROM resolved_direct_adapter_targets targets
WHERE compat."id" = targets.compatibility_id
  AND targets.adapter_url IS NOT NULL
  AND targets.adapter_image IS NOT NULL;
