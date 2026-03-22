INSERT INTO "CarSeat" ("id", "brand", "model", "displayName", "seatType", "summary", "createdAt", "updatedAt")
VALUES
  ('britax-cypress-s', 'Britax', 'Cypress S', 'Britax Cypress S', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('chicco-fit2', 'Chicco', 'Fit2', 'Chicco Fit2', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('clek-liing', 'Clek', 'Liing', 'Clek Liing', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('clek-liingo', 'Clek', 'Liingo', 'Clek Liingo', 'INFANT', 'Baseless infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-cloud-t', 'CYBEX', 'Cloud T', 'CYBEX Cloud T', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('maxi-cosi-coral-xp', 'Maxi-Cosi', 'Coral XP', 'Maxi-Cosi Coral XP', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('maxi-cosi-peri', 'Maxi-Cosi', 'Peri 180', 'Maxi-Cosi Peri 180', 'INFANT', 'Rotating infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('stokke-pipa', 'Stokke', 'PIPA', 'Stokke PIPA', 'INFANT', 'Nuna-built infant car seat for the Stokke lane', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-mesa-v3', 'UPPAbaby', 'Mesa V3', 'UPPAbaby Mesa V3', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary" = EXCLUDED."summary",
  "seatType" = EXCLUDED."seatType",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH chicco_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Select 2'),
    ('Baby Jogger', 'City Tour 2'),
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Mini GT2'),
    ('Baby Jogger', 'City Mini Double'),
    ('Baby Jogger', 'City Sights'),
    ('Bugaboo', 'Fox 5'),
    ('Bugaboo', 'Butterfly'),
    ('Bugaboo', 'Donkey 6'),
    ('Bugaboo', 'Lynx'),
    ('Bugaboo', 'Bee 6'),
    ('Bugaboo', 'Dragonfly'),
    ('UPPAbaby', 'Cruz V2'),
    ('UPPAbaby', 'Vista V2'),
    ('UPPAbaby', 'Minu V2'),
    ('Silver Cross', 'Reef 2'),
    ('Silver Cross', 'Wave 3'),
    ('Silver Cross', 'Jet 5'),
    ('Silver Cross', 'Dune 2'),
    ('Silver Cross', 'Comet')
  )
),
chicco_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Chicco', 'KeyFit 35'),
    ('Chicco', 'Fit2')
  )
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  stroller."brand" || ' adapter for Chicco infant seats',
  seat."displayName" || ' is one of the more adapter-friendly infant seat lines, but you still need to confirm the exact stroller adapter before you buy.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM chicco_strollers stroller
CROSS JOIN chicco_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH universal_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Select 2'),
    ('Baby Jogger', 'City Tour 2'),
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Mini GT2'),
    ('Baby Jogger', 'City Mini Double'),
    ('Baby Jogger', 'City Sights'),
    ('Bugaboo', 'Fox 5'),
    ('Bugaboo', 'Butterfly'),
    ('Bugaboo', 'Donkey 6'),
    ('Bugaboo', 'Lynx'),
    ('Bugaboo', 'Bee 6'),
    ('Bugaboo', 'Dragonfly'),
    ('UPPAbaby', 'Cruz V2'),
    ('UPPAbaby', 'Vista V2'),
    ('UPPAbaby', 'Minu V2'),
    ('CYBEX', 'Priam'),
    ('CYBEX', 'Mios'),
    ('CYBEX', 'Balios S Lux'),
    ('CYBEX', 'Gazelle S'),
    ('CYBEX', 'Libelle'),
    ('CYBEX', 'Eezy S Twist'),
    ('CYBEX', 'Melio'),
    ('CYBEX', 'Beezy'),
    ('Silver Cross', 'Reef 2'),
    ('Silver Cross', 'Wave 3'),
    ('Silver Cross', 'Jet 5'),
    ('Silver Cross', 'Dune 2'),
    ('Silver Cross', 'Comet')
  )
),
universal_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  stroller."brand" || ' adapter for Maxi-Cosi infant seats',
  seat."displayName" || ' lives in one of the most universal travel-system lanes, but it is still an adapter story on this stroller.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM universal_strollers stroller
CROSS JOIN universal_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH limited_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Cruz V2'),
    ('UPPAbaby', 'Vista V2'),
    ('UPPAbaby', 'Minu V2'),
    ('Bugaboo', 'Fox 5'),
    ('Bugaboo', 'Butterfly'),
    ('Bugaboo', 'Dragonfly')
  )
),
limited_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Clek', 'Liing'),
    ('Clek', 'Liingo')
  )
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'LIMITED'::"CompatibilityType",
  true,
  stroller."brand" || ' adapter for Clek infant seats',
  seat."displayName" || ' is a more niche travel-system lane. Compatibility exists in select cases, but this is the kind of pairing that always deserves one more confirmation step.',
  'LOW'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM limited_strollers stroller
CROSS JOIN limited_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH cybex_direct_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('CYBEX', 'Priam'),
    ('CYBEX', 'Mios'),
    ('CYBEX', 'Balios S Lux'),
    ('CYBEX', 'Gazelle S'),
    ('CYBEX', 'Libelle'),
    ('CYBEX', 'Eezy S Twist'),
    ('CYBEX', 'Melio'),
    ('CYBEX', 'Beezy')
  )
),
cybex_cloud_t AS (
  SELECT "id"
  FROM "CarSeat"
  WHERE ("brand", "model") = ('CYBEX', 'Cloud T')
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__cybex-cloud-t',
  stroller."id",
  seat."id",
  'DIRECT'::"CompatibilityType",
  false,
  NULL,
  'Cloud T fits the clean in-brand CYBEX lane.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM cybex_direct_strollers stroller
CROSS JOIN cybex_cloud_t seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH cybex_premium_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Select 2'),
    ('Baby Jogger', 'City Tour 2'),
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Mini GT2'),
    ('Baby Jogger', 'City Mini Double'),
    ('Baby Jogger', 'City Sights'),
    ('Bugaboo', 'Fox 5'),
    ('Bugaboo', 'Butterfly'),
    ('Bugaboo', 'Donkey 6'),
    ('Bugaboo', 'Lynx'),
    ('Bugaboo', 'Bee 6'),
    ('Bugaboo', 'Dragonfly'),
    ('Silver Cross', 'Reef 2'),
    ('Silver Cross', 'Wave 3'),
    ('Silver Cross', 'Jet 5'),
    ('Silver Cross', 'Dune 2'),
    ('Silver Cross', 'Comet')
  )
),
cybex_cloud_t AS (
  SELECT "id"
  FROM "CarSeat"
  WHERE ("brand", "model") = ('CYBEX', 'Cloud T')
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__cybex-cloud-t',
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  stroller."brand" || ' adapter for CYBEX infant seats',
  'Cloud T has a wider premium adapter lane than most, but it is still an adapter decision on this stroller.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM cybex_premium_strollers stroller
CROSS JOIN cybex_cloud_t seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH britax_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('BOB', 'Revolution Flex 3.0'),
    ('BOB', 'Revolution Flex 3.0 Duallie'),
    ('BOB', 'Renegade Wagon'),
    ('BOB', 'Wayfinder'),
    ('BOB', 'Rambler'),
    ('UPPAbaby', 'Cruz V2'),
    ('UPPAbaby', 'Vista V2')
  )
),
britax_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Britax', 'Willow S'),
    ('Britax', 'Cypress S')
  )
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  stroller."brand" || ' adapter for Britax infant seats',
  seat."displayName" || ' leans Britax-first, but this pairing still needs an adapter plan rather than blind plug-and-play expectations.',
  CASE WHEN stroller."brand" = 'BOB' THEN 'MEDIUM'::"CompatibilityConfidence" ELSE 'LOW'::"CompatibilityConfidence" END,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM britax_strollers stroller
CROSS JOIN britax_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH nuna_overlap_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Nuna', 'MIXX next'),
    ('Nuna', 'TRVL lx'),
    ('Nuna', 'DEMI next'),
    ('Nuna', 'TRIV next'),
    ('Nuna', 'TAVO next')
  )
),
stokke_pipa AS (
  SELECT "id"
  FROM "CarSeat"
  WHERE ("brand", "model") = ('Stokke', 'PIPA')
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__stokke-pipa',
  stroller."id",
  seat."id",
  'LIMITED'::"CompatibilityType",
  false,
  NULL,
  'Stokke PIPA sits in the Nuna-overlap lane. Treat this as a confirm-before-you-buy compatibility path, not an automatic default.',
  'LOW'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM nuna_overlap_strollers stroller
CROSS JOIN stokke_pipa seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH bugaboo_extended_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Bugaboo', 'Lynx'),
    ('Bugaboo', 'Bee 6'),
    ('Bugaboo', 'Dragonfly')
  )
),
bugaboo_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Bugaboo', 'Turtle Air'),
    ('Bugaboo', 'Turtle One')
  )
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
  "createdAt",
  "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Bugaboo car seat adapter',
  seat."displayName" || ' stays mostly in-brand, but Bugaboo still handles the connection through an adapter on these stroller models.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM bugaboo_extended_strollers stroller
CROSS JOIN bugaboo_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired" = EXCLUDED."adapterRequired",
  "adapterType" = EXCLUDED."adapterType",
  "notes" = EXCLUDED."notes",
  "confidence" = EXCLUDED."confidence",
  "updatedAt" = CURRENT_TIMESTAMP;
