-- Attach site-owner supplied Amazon affiliate links to Veer adapter-required
-- compatibility rows. These links intentionally override catalog adapter links
-- from MacroBaby, ANB Baby, or Albee Baby when a matching Amazon adapter was
-- provided.

WITH veer_adapter_targets AS (
  SELECT
    compat."id" AS compatibility_id,
    CASE
      WHEN stroller."model" IN ('All-Terrain Cruiser', 'Cruiser', 'Cruiser City') THEN 'cruiser'
      WHEN stroller."model" = 'Cruiser City XL Essentials' THEN 'cruiser_xl'
      ELSE NULL
    END AS platform_kind,
    CASE
      WHEN car_seat."brand" = 'Britax'
        AND car_seat."model" IN (
          'B-Safe 35',
          'B-Safe 35 Elite',
          'B-Safe Ultra',
          'B-Safe Gen2',
          'B-Safe Gen2 FlexFit',
          'B-Safe Gen2 FlexFit+',
          'Endeavour',
          'Chaperone'
        )
        THEN 'britax_legacy'
      WHEN car_seat."brand" = 'Britax'
        AND car_seat."model" IN ('Cypress S', 'Willow S', 'Willow SC')
        THEN 'nuna_maxi_cosi_cybex_clek'
      WHEN car_seat."brand" IN ('Nuna', 'Maxi-Cosi', 'Cybex', 'Clek') THEN 'nuna_maxi_cosi_cybex_clek'
      WHEN car_seat."brand" = 'UPPAbaby' THEN 'uppababy'
      WHEN car_seat."brand" = 'Chicco' THEN 'chicco'
      WHEN car_seat."brand" = 'Graco' THEN 'graco'
      WHEN car_seat."brand" = 'Peg Perego' THEN 'peg_perego'
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
resolved_adapter_targets AS (
  SELECT
    compatibility_id,
    CASE
      WHEN platform_kind = 'cruiser' AND adapter_family = 'britax_legacy' THEN 'Veer Cruiser Infant Car Seat Adapter - Britax'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'britax_legacy' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Britax'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'nuna_maxi_cosi_cybex_clek' THEN 'Veer Cruiser Infant Car Seat Adapter - Nuna / Maxi-Cosi / Cybex / Clek'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'nuna_maxi_cosi_cybex_clek' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Nuna / Maxi-Cosi / Cybex / Clek'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'uppababy' THEN 'Veer Cruiser Infant Car Seat Adapter - UPPAbaby'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'uppababy' THEN 'Veer Cruiser XL Infant Car Seat Adapter - UPPAbaby'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'chicco' THEN 'Veer Cruiser Infant Car Seat Adapter - Chicco'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'chicco' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Chicco'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'graco' THEN 'Veer Cruiser Infant Car Seat Adapter - Graco'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'graco' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Graco'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'peg_perego' THEN 'Veer Cruiser Infant Car Seat Adapter - Peg Perego'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'peg_perego' THEN 'Veer Cruiser XL Infant Car Seat Adapter - Peg Perego'
      ELSE NULL
    END AS adapter_type,
    CASE
      WHEN platform_kind = 'cruiser' AND adapter_family = 'graco' THEN 'https://amzn.to/4hdEYM0'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'britax_legacy' THEN 'https://amzn.to/4r6mLDB'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'britax_legacy' THEN 'https://amzn.to/4gMMI6j'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'nuna_maxi_cosi_cybex_clek' THEN 'https://amzn.to/4qW9QUF'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'nuna_maxi_cosi_cybex_clek' THEN 'https://amzn.to/4hcqjRl'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'uppababy' THEN 'https://amzn.to/3Szm4WK'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'uppababy' THEN 'https://amzn.to/4hcqoo7'
      WHEN platform_kind = 'cruiser' AND adapter_family = 'chicco' THEN 'https://amzn.to/4xf0JAb'
      WHEN platform_kind = 'cruiser_xl' AND adapter_family = 'chicco' THEN 'https://amzn.to/4gBaeoa'
      ELSE NULL
    END AS amazon_adapter_url
  FROM veer_adapter_targets
  WHERE platform_kind IN ('cruiser', 'cruiser_xl')
    AND adapter_family IS NOT NULL
)
UPDATE "Compatibility" compat
SET
  "adapterType" = COALESCE(targets.adapter_type, compat."adapterType"),
  "adapterBabylistUrl" = COALESCE(targets.amazon_adapter_url, compat."adapterBabylistUrl"),
  "adapterUpdatedAt" = CASE
    WHEN targets.amazon_adapter_url IS NOT NULL THEN CURRENT_TIMESTAMP
    ELSE compat."adapterUpdatedAt"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
FROM resolved_adapter_targets targets
WHERE compat."id" = targets.compatibility_id
  AND targets.adapter_type IS NOT NULL;
