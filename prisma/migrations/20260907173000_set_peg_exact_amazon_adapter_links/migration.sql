-- User-supplied Amazon adapter links for the PEG shared-adapter trigger rows.
-- This keeps the named Nuna evidence rows and the logical Maxi-Cosi / CYBEX /
-- Clek display rows on the same exact adapter card.
WITH adapter_metadata(source_chart, adapter_type, adapter_url, adapter_price, adapter_image, adapter_sku) AS (
  VALUES
    (
      'IKCS0018',
      'Peg Perego Adapter for Car Seat (IKCS0018)',
      'https://amzn.to/467dIbZ',
      49.99::double precision,
      'https://www.pegperego.com/media/catalog/product/I/K/IKCS0018_MAIN.jpg',
      'B07KXJSZ6L'
    ),
    (
      'IKCS0030',
      'Peg Perego Foldable Adapter for Car Seat (IKCS0030)',
      'https://amzn.to/4ynhNVt',
      49.99::double precision,
      'https://www.pegperego.com/media/catalog/product/I/K/IKCS0030_MAIN_1.jpg',
      'B0DYQK5TT6'
    )
),
target_chassis(model, source_chart) AS (
  VALUES
    ('YPSI', 'IKCS0018'),
    ('Vivace', 'IKCS0018'),
    ('Switch', 'IKCS0018'),
    ('City Loop', 'IKCS0030'),
    ('City Loop Pro', 'IKCS0030')
)
UPDATE "Compatibility" compat
SET
  "adapterType" = metadata.adapter_type,
  "adapterBabylistUrl" = metadata.adapter_url,
  "adapterPrice" = metadata.adapter_price,
  "adapterImage" = metadata.adapter_image,
  "adapterBabylistSku" = metadata.adapter_sku,
  "updatedAt" = CURRENT_TIMESTAMP
FROM "Stroller" stroller
JOIN target_chassis targets
  ON LOWER(targets.model) = LOWER(stroller."model")
JOIN adapter_metadata metadata
  ON metadata.source_chart = targets.source_chart
WHERE compat."strollerId" = stroller."id"
  AND LOWER(stroller."brand") = 'peg perego'
  AND compat."compatibilityType" = 'ADAPTER'
  AND compat."adapterRequired" = TRUE
  AND compat."notes" LIKE '[PEG_AUDIT_2026_09]%';
