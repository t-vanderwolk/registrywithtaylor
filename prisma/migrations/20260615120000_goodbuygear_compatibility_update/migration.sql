-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260615120000_goodbuygear_compatibility_update
-- Source:    GoodBuy Gear — Ultimate Car Seat & Stroller Compatibility Guide
--            goodbuygear.com/blogs/gear-guidance/car-seat-compatibility
--            (Scraped June 2026; all pairs confirmed from GBG compatibility tables)
-- Adds:      19 new strollers:
--              Britax B-Lively, B-Clever
--              Baby Jogger Summit X3
--              Joovy Caboose Ultralight Graphite, Caboose S, Qool, Twin Roo+
--              Mima Xari Sport
--              Thule Glide 2
--              Maxi-Cosi Lila, Tayla (strollers)
--              Babyzen YOYO+
--              Bugaboo Ant, Bee 5, Donkey 3, Fox 2
--              Silver Cross Reef, Wave, Dune (prior-gen models)
--            4 new car seats:
--              Britax B-Safe 35, B-Safe 35 Elite, B-Safe Gen2 FlexFit
--              Chicco KeyFit 30
--            ~130 new compatibility pairs across 7 car seat families
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── 1. New strollers ─────────────────────────────────────────────────────────

INSERT INTO "Stroller" ("id", "brand", "model", "displayName", "summary", "createdAt", "updatedAt")
VALUES
  -- Britax travel-system strollers (click directly with B-Safe, no adapter)
  ('britax-b-lively',
   'Britax', 'B-Lively', 'Britax B-Lively',
   'Britax travel system stroller; clicks directly with Britax B-Safe infant car seats — no adapter needed',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('britax-b-clever',
   'Britax', 'B-Clever', 'Britax B-Clever',
   'Britax travel system stroller; clicks directly with Britax B-Safe infant car seats — no adapter needed',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Baby Jogger all-terrain
  ('baby-jogger-summit-x3',
   'Baby Jogger', 'Summit X3', 'Baby Jogger Summit X3',
   'All-terrain jogging stroller compatible with Britax B-Safe infant seats via Baby Jogger adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Joovy
  ('joovy-caboose-ultralight-graphite',
   'Joovy', 'Caboose Ultralight Graphite', 'Joovy Caboose Ultralight Graphite',
   'Sit-and-stand stroller that came with car seat adapters included; compatible with most major infant seat brands',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('joovy-caboose-s',
   'Joovy', 'Caboose S', 'Joovy Caboose S',
   'Sit-and-stand stroller compatible with Britax, Chicco, Nuna, and Maxi-Cosi infant seats via adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('joovy-qool',
   'Joovy', 'Qool', 'Joovy Qool',
   'Modular stroller compatible with Britax, Chicco, Nuna, and Maxi-Cosi infant seats via adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('joovy-twin-roo-plus',
   'Joovy', 'Twin Roo+', 'Joovy Twin Roo+',
   'Side-by-side double stroller compatible with Britax, Chicco, UPPAbaby, Maxi-Cosi, and Peg Perego infant seats via adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Mima
  ('mima-xari-sport',
   'Mima', 'Xari Sport', 'Mima Xari Sport',
   'Style-first stroller compatible with UPPAbaby Mesa via adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Thule
  ('thule-glide-2',
   'Thule', 'Glide 2', 'Thule Glide 2',
   'Performance jogging stroller compatible with Britax, Chicco, UPPAbaby, Peg Perego, Nuna, and Maxi-Cosi infant seats via adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Maxi-Cosi strollers
  ('maxi-cosi-lila',
   'Maxi-Cosi', 'Lila', 'Maxi-Cosi Lila',
   'Maxi-Cosi travel system stroller; accepts Maxi-Cosi infant seats with included adapter, other brands with separate adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('maxi-cosi-tayla',
   'Maxi-Cosi', 'Tayla', 'Maxi-Cosi Tayla',
   'Maxi-Cosi travel system stroller; accepts Maxi-Cosi infant seats with included adapter, other brands with separate adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Babyzen
  ('babyzen-yoyo-plus',
   'Babyzen', 'YOYO+', 'Babyzen YOYO+',
   'Ultra-compact fold travel stroller compatible with Nuna PIPA and Maxi-Cosi infant seats via brand-specific adapters',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Bugaboo (prior-generation models — sold widely on resale market)
  ('bugaboo-ant',
   'Bugaboo', 'Ant', 'Bugaboo Ant',
   'Ultra-compact city stroller compatible with Clek, Nuna, and Maxi-Cosi infant seats via Bugaboo adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('bugaboo-bee-5',
   'Bugaboo', 'Bee 5', 'Bugaboo Bee 5',
   'Compact city stroller compatible with Chicco, Clek, Nuna, and Maxi-Cosi infant seats via Bugaboo adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('bugaboo-donkey-3',
   'Bugaboo', 'Donkey 3', 'Bugaboo Donkey 3',
   'Convertible single-to-double stroller compatible with Britax, Chicco, Clek, Nuna, and Maxi-Cosi infant seats via Bugaboo adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('bugaboo-fox-2',
   'Bugaboo', 'Fox 2', 'Bugaboo Fox 2',
   'Full-size everyday stroller compatible with Britax, Chicco, Peg Perego, and Maxi-Cosi infant seats via Bugaboo adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Silver Cross (prior-generation models — sold widely on resale market)
  ('silver-cross-reef',
   'Silver Cross', 'Reef', 'Silver Cross Reef',
   'Full-size modular stroller compatible with Clek and Maxi-Cosi infant seats via Silver Cross adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('silver-cross-wave',
   'Silver Cross', 'Wave', 'Silver Cross Wave',
   'Convertible single-to-double stroller compatible with Clek and Maxi-Cosi infant seats via Silver Cross adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('silver-cross-dune',
   'Silver Cross', 'Dune', 'Silver Cross Dune',
   'Luxury modular stroller compatible with Clek and Maxi-Cosi infant seats via Silver Cross adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary"     = EXCLUDED."summary",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 2. New car seats ─────────────────────────────────────────────────────────

INSERT INTO "CarSeat" ("id", "brand", "model", "displayName", "seatType", "summary", "createdAt", "updatedAt")
VALUES
  ('britax-b-safe-35',
   'Britax', 'B-Safe 35', 'Britax B-Safe 35', 'INFANT',
   'Britax infant car seat; clicks directly into B-Lively and B-Clever strollers without adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('britax-b-safe-35-elite',
   'Britax', 'B-Safe 35 Elite', 'Britax B-Safe 35 Elite', 'INFANT',
   'Premium Britax infant seat with enhanced side-impact protection; clicks directly into B-Lively and B-Clever without adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('britax-b-safe-gen2-flexfit',
   'Britax', 'B-Safe Gen2 FlexFit', 'Britax B-Safe Gen2 FlexFit', 'INFANT',
   'Next-generation Britax infant seat with anti-rebound leg; clicks directly into B-Lively, adapter required for other brands',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('chicco-keyfit-30',
   'Chicco', 'KeyFit 30', 'Chicco KeyFit 30', 'INFANT',
   'Lightweight, easy-to-install Chicco infant seat compatible with a wide range of strollers via Chicco adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary"     = EXCLUDED."summary",
  "seatType"    = EXCLUDED."seatType",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 3. Britax B-Lively + B-Clever × Britax B-Safe (DIRECT, no adapter) ─────
-- Confirmed by GBG: "B-Lively and B-Clever are compatible with Britax B-Safe
-- infant car seats as a travel system, no adapters needed."

WITH britax_strollers AS (
  SELECT "id", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Britax', 'B-Lively'),
    ('Britax', 'B-Clever')
  )
),
britax_b_safe_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Britax', 'B-Safe 35'),
    ('Britax', 'B-Safe 35 Elite'),
    ('Britax', 'B-Safe Gen2 FlexFit')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'DIRECT'::"CompatibilityType",
  false,
  NULL,
  cs."displayName" || ' clicks directly into the Britax ' || s."model" || ' — no adapter needed. A built-in Britax ClickSafe connector secures the seat to the stroller frame.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM britax_strollers s
CROSS JOIN britax_b_safe_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 4. Britax B-Safe × all other confirmed strollers (ADAPTER) ──────────────
-- GBG Britax table confirms: BJ City Mini 2/Select/Mini GT2/Summit X3,
--   BOB Alterrain Pro, Bugaboo Donkey 3/Fox 2, Joovy (all four),
--   Maxi-Cosi Lila/Tayla, Thule Glide 2/Urban Glide 2

WITH britax_b_safe_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Britax', 'B-Safe 35'),
    ('Britax', 'B-Safe 35 Elite'),
    ('Britax', 'B-Safe Gen2 FlexFit')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Select 2'),
    ('Baby Jogger', 'City Mini GT2'),
    ('Baby Jogger', 'Summit X3'),
    ('BOB',         'Alterrain Pro'),
    ('Bugaboo',     'Donkey 3'),
    ('Bugaboo',     'Fox 2'),
    ('Joovy',       'Caboose Ultralight Graphite'),
    ('Joovy',       'Caboose S'),
    ('Joovy',       'Qool'),
    ('Joovy',       'Twin Roo+'),
    ('Maxi-Cosi',   'Lila'),
    ('Maxi-Cosi',   'Tayla'),
    ('Thule',       'Glide 2'),
    ('Thule',       'Urban Glide 2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  s."brand" || ' car seat adapter for Britax',
  cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a brand-specific Britax infant seat adapter. Confirm the correct adapter SKU for your stroller model before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN britax_b_safe_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 5. UPPAbaby Mesa × Joovy + Mima + Thule Glide 2 (ADAPTER) ──────────────
-- GBG UPPAbaby table: Joovy Caboose Ultralight (included), Twin Roo+,
--   Mima Xari, Mima Xari Sport, Thule Glide 2, Thule Urban Glide 2.
-- UPPAbaby Vista/Cruz are same-brand DIRECT — auto-handled server-side.

WITH uppababy_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Mesa V3'),
    ('UPPAbaby', 'Mesa Max'),
    ('UPPAbaby', 'Aria V2')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Joovy',    'Caboose Ultralight Graphite'),
    ('Joovy',    'Twin Roo+'),
    ('Mima',     'Xari'),
    ('Mima',     'Xari Sport'),
    ('Thule',    'Glide 2'),
    ('Thule',    'Urban Glide 2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  s."brand" || ' car seat adapter for UPPAbaby',
  cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a ' || s."brand" || ' UPPAbaby adapter. Confirm the correct adapter SKU for your stroller model before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN uppababy_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 6. Chicco KeyFit 30 + KeyFit 35 × confirmed strollers (ADAPTER) ─────────
-- GBG Chicco table: BJ City Mini 2/Select, BOB Alterrain Pro, Bugaboo Bee 5/
--   Donkey 3/Fox 2, Joovy (all four), Maxi-Cosi Lila/Tayla, Mockingbird,
--   Thule Glide 2/Urban Glide 2/Sleek. Adding both KeyFit 30 and 35 here
--   (same adapter group; existing Babylist migration covered Mockingbird + KeyFit 35).

WITH chicco_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Chicco', 'KeyFit 30'),
    ('Chicco', 'KeyFit 35')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Select 2'),
    ('BOB',         'Alterrain Pro'),
    ('Bugaboo',     'Bee 5'),
    ('Bugaboo',     'Donkey 3'),
    ('Bugaboo',     'Fox 2'),
    ('Joovy',       'Caboose Ultralight Graphite'),
    ('Joovy',       'Caboose S'),
    ('Joovy',       'Qool'),
    ('Joovy',       'Twin Roo+'),
    ('Maxi-Cosi',   'Lila'),
    ('Maxi-Cosi',   'Tayla'),
    ('Thule',       'Glide 2'),
    ('Thule',       'Urban Glide 2'),
    ('Thule',       'Sleek')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  s."brand" || ' car seat adapter for Chicco',
  cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a ' || s."brand" || ' Chicco adapter. Confirm the correct adapter SKU for your stroller model before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN chicco_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 7. Peg Perego × confirmed strollers (ADAPTER) ───────────────────────────
-- GBG Peg Perego table: BJ City Mini 2/Select, BOB Alterrain Pro,
--   Bugaboo Fox 2, Joovy Caboose Ultralight/Twin Roo+,
--   Thule Glide 2/Urban Glide 2.

WITH peg_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Peg Perego', 'Primo Viaggio 4-35')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Select 2'),
    ('BOB',         'Alterrain Pro'),
    ('Bugaboo',     'Fox 2'),
    ('Joovy',       'Caboose Ultralight Graphite'),
    ('Joovy',       'Twin Roo+'),
    ('Thule',       'Glide 2'),
    ('Thule',       'Urban Glide 2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  s."brand" || ' car seat adapter for Peg Perego',
  cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a ' || s."brand" || ' Peg Perego adapter. Confirm the correct adapter SKU for your stroller model before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN peg_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 8. Clek Liing/Liingo × confirmed strollers (ADAPTER) ────────────────────
-- GBG Clek table: BJ City Mini 2, Bugaboo Ant/Bee 5/Donkey 3/Lynx,
--   Silver Cross Reef/Wave/Dune.

WITH clek_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Clek', 'Liing'),
    ('Clek', 'Liingo')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger',  'City Mini 2'),
    ('Bugaboo',      'Ant'),
    ('Bugaboo',      'Bee 5'),
    ('Bugaboo',      'Donkey 3'),
    ('Bugaboo',      'Lynx'),
    ('Silver Cross', 'Reef'),
    ('Silver Cross', 'Wave'),
    ('Silver Cross', 'Dune')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  s."brand" || ' car seat adapter for Clek',
  cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a ' || s."brand" || ' Clek infant seat adapter. Confirm the correct adapter SKU for your stroller model before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN clek_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 9. Nuna PIPA × confirmed strollers (ADAPTER) ────────────────────────────
-- GBG Nuna table: BJ City Mini 2/Select, Babyzen YOYO+, Bugaboo Ant/Bee 5/
--   Donkey 3/Lynx, Joovy Caboose Ultralight/Caboose S/Qool,
--   Thule Glide 2/Urban Glide 2/Sleek. (Mockingbird already in Babylist migration.)

WITH nuna_pipa_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna', 'PIPA RX'),
    ('Nuna', 'PIPA Aire'),
    ('Nuna', 'PIPA urbn'),
    ('Nuna', 'PIPA Aire rx')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger', 'City Mini 2'),
    ('Baby Jogger', 'City Select 2'),
    ('Babyzen',     'YOYO+'),
    ('Bugaboo',     'Ant'),
    ('Bugaboo',     'Bee 5'),
    ('Bugaboo',     'Donkey 3'),
    ('Bugaboo',     'Lynx'),
    ('Joovy',       'Caboose Ultralight Graphite'),
    ('Joovy',       'Caboose S'),
    ('Joovy',       'Qool'),
    ('Thule',       'Glide 2'),
    ('Thule',       'Urban Glide 2'),
    ('Thule',       'Sleek')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  s."brand" || ' car seat adapter for Nuna',
  cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a ' || s."brand" || ' Nuna adapter. Confirm the correct adapter SKU for your stroller model before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN nuna_pipa_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 10. Maxi-Cosi × confirmed strollers (ADAPTER) ───────────────────────────
-- GBG Maxi-Cosi table: BJ City Mini 2/Select, Babyzen YOYO+, Bugaboo Ant/Bee 5/
--   Donkey 3/Fox 2/Lynx, Joovy (all four), Maxi-Cosi Lila/Tayla (included),
--   Silver Cross Reef/Wave/Dune, Thule Glide 2/Urban Glide 2/Sleek.
-- (Mockingbird already in Babylist migration with its own Nuna/Maxi-Cosi adapter SKU.)

WITH maxi_cosi_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Mico Pro'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
),
compatible_strollers AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Baby Jogger',  'City Mini 2'),
    ('Baby Jogger',  'City Select 2'),
    ('Babyzen',      'YOYO+'),
    ('Bugaboo',      'Ant'),
    ('Bugaboo',      'Bee 5'),
    ('Bugaboo',      'Donkey 3'),
    ('Bugaboo',      'Fox 2'),
    ('Bugaboo',      'Lynx'),
    ('Joovy',        'Caboose Ultralight Graphite'),
    ('Joovy',        'Caboose S'),
    ('Joovy',        'Qool'),
    ('Joovy',        'Twin Roo+'),
    ('Maxi-Cosi',    'Lila'),
    ('Maxi-Cosi',    'Tayla'),
    ('Silver Cross', 'Reef'),
    ('Silver Cross', 'Wave'),
    ('Silver Cross', 'Dune'),
    ('Thule',        'Glide 2'),
    ('Thule',        'Urban Glide 2'),
    ('Thule',        'Sleek')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  CASE
    WHEN s."brand" = 'Maxi-Cosi'
    THEN 'Maxi-Cosi car seat adapter (included with stroller)'
    ELSE s."brand" || ' car seat adapter for Maxi-Cosi'
  END,
  CASE
    WHEN s."brand" = 'Maxi-Cosi'
    THEN cs."displayName" || ' is compatible with the Maxi-Cosi ' || s."model" || '. The adapter is included with stroller purchase.'
    ELSE cs."displayName" || ' fits the ' || s."brand" || ' ' || s."model" || ' via a ' || s."brand" || ' Maxi-Cosi adapter. Confirm the correct adapter SKU for your stroller model before purchase.'
  END,
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM compatible_strollers s
CROSS JOIN maxi_cosi_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 11. Thule Urban Glide 2 × Britax + UPPAbaby + Chicco (gap fill) ─────────
-- GBG confirms Urban Glide 2 is compatible with all major brands.
-- Strolleria migration added Nuna/Maxi-Cosi; this section fills the remaining gaps.
-- Britax B-Safe, Chicco, UPPAbaby Mesa, Peg Perego pairs added here.

WITH thule_urban AS (
  SELECT "id", "brand", "model"
  FROM "Stroller"
  WHERE ("brand", "model") = ('Thule', 'Urban Glide 2')
),
extra_seats AS (
  SELECT "id", "displayName", "brand"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Britax',    'B-Safe 35'),
    ('Britax',    'B-Safe 35 Elite'),
    ('Britax',    'B-Safe Gen2 FlexFit'),
    ('UPPAbaby',  'Mesa V3'),
    ('UPPAbaby',  'Mesa Max'),
    ('UPPAbaby',  'Aria V2'),
    ('Chicco',    'KeyFit 30'),
    ('Chicco',    'KeyFit 35'),
    ('Peg Perego','Primo Viaggio 4-35')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Thule car seat adapter for ' || cs."brand",
  cs."displayName" || ' fits the Thule Urban Glide 2 via a Thule ' || cs."brand" || ' adapter. Confirm the correct adapter SKU before purchase.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM thule_urban s
CROSS JOIN extra_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "adapterType" = EXCLUDED."adapterType",
  "notes"       = EXCLUDED."notes",
  "updatedAt"   = CURRENT_TIMESTAMP;
