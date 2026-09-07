-- Correct the fallback image for each Amazon-linked Veer infant car seat
-- adapter. These are the first (primary) product images on the exact Amazon
-- listings behind the site-owner supplied affiliate links.
WITH amazon_adapter_primary_images(adapter_url, adapter_image) AS (
  VALUES
    ('https://amzn.to/4hdEYM0', 'https://m.media-amazon.com/images/I/71hG7XJbf5L._SL1500_.jpg'),
    ('https://amzn.to/4r6mLDB', 'https://m.media-amazon.com/images/I/71dhExcON4L._SL1500_.jpg'),
    ('https://amzn.to/4gMMI6j', 'https://m.media-amazon.com/images/I/41tvmChFP7L._SL1200_.jpg'),
    ('https://amzn.to/4qW9QUF', 'https://m.media-amazon.com/images/I/71LrOkwR9mL._SL1500_.jpg'),
    ('https://amzn.to/4hcqjRl', 'https://m.media-amazon.com/images/I/51DsZ2UvupL._SL1200_.jpg'),
    ('https://amzn.to/3Szm4WK', 'https://m.media-amazon.com/images/I/71a3olieohL._SL1500_.jpg'),
    ('https://amzn.to/4hcqoo7', 'https://m.media-amazon.com/images/I/51+0M5Vg4hL._SL1200_.jpg'),
    ('https://amzn.to/4xf0JAb', 'https://m.media-amazon.com/images/I/71TO8DDhA9L._SL1500_.jpg'),
    ('https://amzn.to/4gBaeoa', 'https://m.media-amazon.com/images/I/71TO8DDhA9L._SL1500_.jpg')
)
UPDATE "Compatibility" AS compatibility
SET
  "adapterImage" = images.adapter_image,
  "adapterUpdatedAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP
FROM amazon_adapter_primary_images AS images, "Stroller" AS stroller
WHERE compatibility."adapterBabylistUrl" = images.adapter_url
  AND stroller.id = compatibility."strollerId"
  AND LOWER(stroller."brand") = 'veer';

-- The live catalog already contains both capacities for each Veer wagon line.
-- Give the four frames stable identities so compatibility and public product
-- cards no longer collapse the 2-seat and 4-seat variants together.
UPDATE "Stroller"
SET
  "model" = 'Cruiser XL',
  "displayName" = 'Veer Cruiser XL (4 Seater)',
  "summary" = 'The four-seat Veer adventure wagon: 55 lb per seat across four seats, all-terrain wheels, and a push-or-pull handle. Infant car seats require the matching Cruiser XL adapter.',
  "babylistSku" = '1428463',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE LOWER("brand") = 'veer'
  AND "model" = 'All-Terrain Cruiser';

UPDATE "Stroller"
SET
  "model" = 'Cruiser City XL',
  "displayName" = 'Veer Cruiser City XL (4 Seater)',
  "summary" = 'The four-seat version of Veer''s city-focused wagon, with room for a bigger crew and the Cruiser XL infant-car-seat adapter system.',
  "babylistSku" = '1883285',
  "babylistUrl" = 'https://babylist.pxf.io/c/6560395/1160375/13580?prodsku=1883285&u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fveer-cruiser-city%2F47021%2F1883285&intsrc=CATF_8981',
  "babylistPrice" = 799.00,
  "babylistImage" = 'https://images.ctfassets.net/50gzycvace50/b438e979d41e4756c54eaad37e265bca57028d401c482d7723cd5ca684f2675f/e861a90daf2cf5f1a4c11354267171b6/b438e979d41e4756c54eaad37e265bca57028d401c482d7723cd5ca684f2675f.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=620&h=620',
  "babylistUpdatedAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE LOWER("brand") = 'veer'
  AND "model" = 'Cruiser City XL Essentials';

UPDATE "Stroller"
SET
  "displayName" = CASE "model"
    WHEN 'Cruiser' THEN 'Veer Cruiser (2 Seater)'
    WHEN 'Cruiser City' THEN 'Veer Cruiser City (2 Seater)'
    ELSE "displayName"
  END,
  "summary" = CASE "model"
    WHEN 'Cruiser' THEN 'The two-seat Veer adventure wagon: 55 lb per seat, all-terrain wheels, and a push-or-pull handle. Infant car seats require the matching Cruiser adapter.'
    WHEN 'Cruiser City' THEN 'The two-seat, city-focused Veer wagon with a compact turning footprint and the Cruiser infant-car-seat adapter system.'
    ELSE "summary"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE LOWER("brand") = 'veer'
  AND "model" IN ('Cruiser', 'Cruiser City');

-- The old All-Terrain Cruiser record represented the four-seat frame. After it
-- becomes Cruiser XL, replace the 2-seat adapter metadata previously attached
-- to those compatibility rows with the corresponding XL products.
WITH xl_adapter_metadata(adapter_family, adapter_type, adapter_url, adapter_image, adapter_price) AS (
  VALUES
    ('britax_legacy', 'Veer Cruiser XL Infant Car Seat Adapter - Britax', 'https://amzn.to/4gMMI6j', 'https://m.media-amazon.com/images/I/41tvmChFP7L._SL1200_.jpg', 79.00),
    ('shared', 'Veer Cruiser XL Infant Car Seat Adapter - Nuna / Maxi-Cosi / Cybex / Clek', 'https://amzn.to/4hcqjRl', 'https://m.media-amazon.com/images/I/51DsZ2UvupL._SL1200_.jpg', 79.00),
    ('uppababy', 'Veer Cruiser XL Infant Car Seat Adapter - UPPAbaby', 'https://amzn.to/4hcqoo7', 'https://m.media-amazon.com/images/I/51+0M5Vg4hL._SL1200_.jpg', 79.00),
    ('chicco', 'Veer Cruiser XL Infant Car Seat Adapter - Chicco', 'https://amzn.to/4gBaeoa', 'https://m.media-amazon.com/images/I/71TO8DDhA9L._SL1500_.jpg', 79.00),
    ('graco', 'Veer Cruiser XL Infant Car Seat Adapter - Graco', 'https://goveer.com/products/infant-car-seat-adapter?variant=44742405194042', 'https://cdn.shopify.com/s/files/1/0697/9574/2010/files/Graco_XL_ICS_Adapter_Perspective-ICS_Adapter_V2-3400x3400.jpg?v=1747409707&width=80', NULL::double precision),
    ('peg_perego', 'Veer Cruiser XL Infant Car Seat Adapter - Peg Perego', 'https://goveer.com/products/infant-car-seat-adapter?variant=47252351025466', 'https://cdn.shopify.com/s/files/1/0697/9574/2010/files/Peg_Perego_XL_ICS_Adapter_Perspective-ICS_Adapter_V2-3400x3400.jpg?v=1747409765&width=80', NULL::double precision)
),
cruiser_xl_targets AS (
  SELECT
    compatibility.id,
    CASE
      WHEN seat."brand" = 'Britax' AND seat."model" IN ('B-Safe 35', 'B-Safe 35 Elite', 'B-Safe Ultra', 'B-Safe Gen2', 'B-Safe Gen2 FlexFit', 'B-Safe Gen2 FlexFit+', 'Endeavour', 'Chaperone') THEN 'britax_legacy'
      WHEN seat."brand" = 'Britax' AND seat."model" IN ('Cypress S', 'Willow S', 'Willow SC') THEN 'shared'
      WHEN seat."brand" IN ('Nuna', 'Maxi-Cosi', 'Cybex', 'Clek') THEN 'shared'
      WHEN seat."brand" = 'UPPAbaby' THEN 'uppababy'
      WHEN seat."brand" = 'Chicco' THEN 'chicco'
      WHEN seat."brand" = 'Graco' THEN 'graco'
      WHEN seat."brand" = 'Peg Perego' THEN 'peg_perego'
      ELSE NULL
    END AS adapter_family
  FROM "Compatibility" AS compatibility
  JOIN "Stroller" AS stroller ON stroller.id = compatibility."strollerId"
  JOIN "CarSeat" AS seat ON seat.id = compatibility."carSeatId"
  WHERE LOWER(stroller.brand) = 'veer'
    AND stroller.model = 'Cruiser XL'
    AND compatibility."adapterRequired" = TRUE
)
UPDATE "Compatibility" AS compatibility
SET
  "adapterType" = metadata.adapter_type,
  "adapterBabylistUrl" = metadata.adapter_url,
  "adapterImage" = metadata.adapter_image,
  "adapterPrice" = metadata.adapter_price,
  "adapterUpdatedAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP
FROM cruiser_xl_targets AS target
JOIN xl_adapter_metadata AS metadata ON metadata.adapter_family = target.adapter_family
WHERE compatibility.id = target.id;

-- Canonical product identities make both capacities visible while preserving a
-- single card for cosmetic variants inside each capacity.
WITH veer_catalog_variants(external_id, canonical_name) AS (
  VALUES
    ('53959', 'Cruiser'),
    ('1428463', 'Cruiser XL'),
    ('1883286', 'Cruiser City'),
    ('1883285', 'Cruiser City XL')
)
UPDATE "ProductEnrichment" AS enrichment
SET
  "canonicalBrand" = 'Veer',
  "canonicalName" = variants.canonical_name,
  "productType" = 'wagon',
  "reviewStatus" = 'REVIEWED',
  "isPublic" = TRUE,
  "needsReview" = FALSE,
  "updatedAt" = CURRENT_TIMESTAMP
FROM "AffiliateCatalogProduct" AS product
JOIN veer_catalog_variants AS variants ON variants.external_id = product."externalId"
WHERE enrichment."rawProductId" = product.id
  AND product.provider = 'babylist_impact'
  AND LOWER(COALESCE(product.brand, '')) = 'veer';
