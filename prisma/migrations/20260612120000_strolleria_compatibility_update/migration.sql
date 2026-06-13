-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260612120000_strolleria_compatibility_update
-- Source:    Strolleria compatibility guide
--            strolleria.com/pages/stroller-compatibility-guide
--            (Nuna PIPA, UPPAbaby Mesa V3, UPPAbaby Aria V2 sub-pages)
-- Adds:      16 new strollers from the 2026 lineup
--            1 new car seat (UPPAbaby Aria V2)
--            Cross-brand compatibility pairs for all new + some existing strollers
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── 1. New strollers ────────────────────────────────────────────────────────

INSERT INTO "Stroller" ("id", "brand", "model", "displayName", "summary", "createdAt", "updatedAt")
VALUES
  -- Bugaboo 2026
  ('bugaboo-butterfly-2',        'Bugaboo',      'Butterfly 2',         'Bugaboo Butterfly 2',         'Second-generation ultra-compact travel stroller with one-second fold',                       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-kangaroo',           'Bugaboo',      'Kangaroo',            'Bugaboo Kangaroo',            'Compact city stroller with adapter-based infant seat compatibility',                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- CYBEX 2026
  ('cybex-coya',                 'CYBEX',        'Coya',                'CYBEX Coya',                  'Compact city stroller with adapter-based infant seat compatibility',                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-eos',                  'CYBEX',        'Eos',                 'CYBEX Eos',                   'Compact stroller with adapter-based infant seat compatibility',                             CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Nuna 2026 (closed-system — PIPA compatibility auto-handled by same-brand logic)
  ('nuna-swiv',                  'Nuna',         'SWIV',                'Nuna SWIV',                   'Full-size modular stroller compatible with Nuna PIPA infant car seats',                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-trvl-dubl',             'Nuna',         'TRVL Dubl',           'Nuna TRVL Dubl',              'Double travel stroller compatible with Nuna PIPA infant car seats',                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- UPPAbaby 2026 V3 lineup (Mesa/Aria compatibility auto-handled by same-brand logic)
  ('uppababy-vista-v3',          'UPPAbaby',     'Vista V3',            'UPPAbaby Vista V3',           'Flagship convertible single-to-double stroller',                                           CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v3',           'UPPAbaby',     'Cruz V3',             'UPPAbaby Cruz V3',            'Full-size everyday stroller',                                                              CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v3',           'UPPAbaby',     'Minu V3',             'UPPAbaby Minu V3',            'Compact travel stroller with post-adapter infant seat compatibility',                       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- BOB 2026
  ('bob-alterrain-pro',          'BOB',          'Alterrain Pro',       'BOB Alterrain Pro',           'Premium all-terrain jogging stroller with adapter-based infant seat compatibility',         CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Thule
  ('thule-urban-glide-2',        'Thule',        'Urban Glide 2',       'Thule Urban Glide 2',         'Performance jogging stroller with adapter-based infant seat compatibility',                 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('thule-urban-glide-2-double', 'Thule',        'Urban Glide 2 Double','Thule Urban Glide 2 Double',  'Double jogging stroller with adapter-based infant seat compatibility',                      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('thule-sleek',                'Thule',        'Sleek',               'Thule Sleek',                 'Premium modular stroller with adapter-based infant seat compatibility',                     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Silver Cross
  ('silver-cross-clic',          'Silver Cross', 'Clic',                'Silver Cross Clic',           'Ultra-compact travel stroller with adapter-based infant seat compatibility',                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-jet-double',    'Silver Cross', 'Jet Double',          'Silver Cross Jet Double',     'Double travel stroller with adapter-based infant seat compatibility',                       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Joolz
  ('joolz-hub-2',                'Joolz',        'Hub 2',               'Joolz Hub 2',                 'Premium city stroller with lower-adapter infant seat compatibility',                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary"     = EXCLUDED."summary",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 2. New car seat: UPPAbaby Aria V2 ───────────────────────────────────────

INSERT INTO "CarSeat" ("id", "brand", "model", "displayName", "seatType", "summary", "createdAt", "updatedAt")
VALUES
  ('uppababy-aria-v2', 'UPPAbaby', 'Aria V2', 'UPPAbaby Aria V2', 'INFANT', 'Next-generation Aria infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary"     = EXCLUDED."summary",
  "seatType"    = EXCLUDED."seatType",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 3. UPPAbaby Vista V3 + Cruz V3 × Nuna PIPA (ring adapter) ───────────────
-- Same cross-brand adapter path as V2. Same-brand UPPAbaby pairs (Mesa V3, Aria V2)
-- are auto-resolved by DIRECT_DEFAULT_BRANDS server logic — no explicit rows needed.

WITH ub_ring_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Vista V3'),
    ('UPPAbaby', 'Cruz V3')
  )
),
nuna_pipa_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna', 'PIPA RX'),
    ('Nuna', 'PIPA Aire'),
    ('Nuna', 'PIPA urbn')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'UPPAbaby ring adapter for Nuna PIPA seats',
  'Use the Vista/Cruz ring adapter for ' || seat."displayName" || '. Same adapter path as the V2 generation.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM ub_ring_strollers stroller
CROSS JOIN nuna_pipa_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 4. UPPAbaby Minu V3 × Nuna PIPA (post adapters) ────────────────────────

WITH minu_v3 AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('UPPAbaby', 'Minu V3')
),
nuna_pipa_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna', 'PIPA RX'),
    ('Nuna', 'PIPA Aire'),
    ('Nuna', 'PIPA urbn')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'UPPAbaby post adapters for Minu V3',
  'Minu V3 uses post adapters (different from the Vista/Cruz ring adapter) for ' || seat."displayName" || '.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM minu_v3 stroller
CROSS JOIN nuna_pipa_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 5. Bugaboo Butterfly 2 × Bugaboo seats + Nuna PIPA ──────────────────────

WITH butterfly2 AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('Bugaboo', 'Butterfly 2')
),
butterfly2_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Bugaboo', 'Turtle Air'),
    ('Bugaboo', 'Turtle One'),
    ('Nuna',    'PIPA RX'),
    ('Nuna',    'PIPA urbn')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  CASE
    WHEN seat."brand" = 'Bugaboo' THEN 'Bugaboo Butterfly 2 car seat adapter'
    ELSE 'Bugaboo Butterfly 2 adapter for Nuna PIPA seats'
  END,
  CASE
    WHEN seat."brand" = 'Bugaboo'
      THEN 'Use the Bugaboo Butterfly 2 car seat adapter. ' || seat."displayName" || ' is the primary in-brand travel-system pairing.'
    ELSE
      seat."displayName" || ' is compatible with Bugaboo Butterfly 2 via the Bugaboo adapter for Nuna seats. Confirm adapter SKU before purchase.'
  END,
  CASE
    WHEN seat."brand" = 'Bugaboo' THEN 'HIGH'::"CompatibilityConfidence"
    ELSE 'MEDIUM'::"CompatibilityConfidence"
  END,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM butterfly2 stroller
CROSS JOIN butterfly2_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 6. Bugaboo Kangaroo × Bugaboo seats + Nuna PIPA ────────────────────────

WITH kangaroo AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('Bugaboo', 'Kangaroo')
),
kangaroo_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Bugaboo', 'Turtle Air'),
    ('Bugaboo', 'Turtle One'),
    ('Nuna',    'PIPA RX'),
    ('Nuna',    'PIPA urbn')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  CASE
    WHEN seat."brand" = 'Bugaboo' THEN 'Bugaboo Kangaroo car seat adapter'
    ELSE 'Bugaboo Kangaroo adapter for Nuna PIPA seats'
  END,
  CASE
    WHEN seat."brand" = 'Bugaboo'
      THEN 'Use the Bugaboo Kangaroo car seat adapter. ' || seat."displayName" || ' is the primary in-brand travel-system pairing.'
    ELSE
      seat."displayName" || ' is compatible with Bugaboo Kangaroo via adapter. Confirm adapter SKU before purchase.'
  END,
  CASE
    WHEN seat."brand" = 'Bugaboo' THEN 'HIGH'::"CompatibilityConfidence"
    ELSE 'MEDIUM'::"CompatibilityConfidence"
  END,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM kangaroo stroller
CROSS JOIN kangaroo_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 7. CYBEX Coya × CYBEX seats (included adapter) + Nuna + Maxi-Cosi ───────

WITH coya AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('CYBEX', 'Coya')
),
coya_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('CYBEX',     'Aton G'),
    ('CYBEX',     'Cloud T'),
    ('Nuna',      'PIPA RX'),
    ('Nuna',      'PIPA urbn'),
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  CASE WHEN seat."brand" = 'CYBEX' THEN false ELSE true END,
  CASE
    WHEN seat."brand" = 'CYBEX'     THEN 'Included with stroller'
    WHEN seat."brand" = 'Nuna'      THEN 'CYBEX adapter for Nuna PIPA seats'
    ELSE                                  'CYBEX adapter for Maxi-Cosi infant seats'
  END,
  CASE
    WHEN seat."brand" = 'CYBEX'
      THEN 'CYBEX Coya includes adapters for all CYBEX infant seats. ' || seat."displayName" || ' snaps in without a separate adapter purchase.'
    WHEN seat."brand" = 'Nuna'
      THEN seat."displayName" || ' is compatible with CYBEX Coya via the CYBEX adapter for Nuna seats.'
    ELSE
      seat."displayName" || ' is compatible with CYBEX Coya via the CYBEX adapter for Maxi-Cosi family seats.'
  END,
  CASE
    WHEN seat."brand" = 'CYBEX' THEN 'HIGH'::"CompatibilityConfidence"
    ELSE 'MEDIUM'::"CompatibilityConfidence"
  END,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM coya stroller
CROSS JOIN coya_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 8. CYBEX Eos × CYBEX seats (included adapter) + Nuna + Maxi-Cosi ────────

WITH eos AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('CYBEX', 'Eos')
),
eos_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('CYBEX',     'Aton G'),
    ('CYBEX',     'Cloud T'),
    ('Nuna',      'PIPA RX'),
    ('Nuna',      'PIPA urbn'),
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  CASE WHEN seat."brand" = 'CYBEX' THEN false ELSE true END,
  CASE
    WHEN seat."brand" = 'CYBEX'     THEN 'Included with stroller'
    WHEN seat."brand" = 'Nuna'      THEN 'CYBEX adapter for Nuna PIPA seats'
    ELSE                                  'CYBEX adapter for Maxi-Cosi infant seats'
  END,
  CASE
    WHEN seat."brand" = 'CYBEX'
      THEN 'CYBEX Eos includes adapters for all CYBEX infant seats. ' || seat."displayName" || ' snaps in without a separate adapter purchase.'
    WHEN seat."brand" = 'Nuna'
      THEN seat."displayName" || ' is compatible with CYBEX Eos via the CYBEX adapter for Nuna seats.'
    ELSE
      seat."displayName" || ' is compatible with CYBEX Eos via the CYBEX adapter for Maxi-Cosi family seats.'
  END,
  CASE
    WHEN seat."brand" = 'CYBEX' THEN 'HIGH'::"CompatibilityConfidence"
    ELSE 'MEDIUM'::"CompatibilityConfidence"
  END,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM eos stroller
CROSS JOIN eos_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 9. BOB Alterrain Pro × UPPAbaby seats ────────────────────────────────────
-- Confirmed on Strolleria Mesa V3 + Aria V2 compatibility pages.

WITH alterrain_pro AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('BOB', 'Alterrain Pro')
),
bob_uppababy_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Mesa V3'),
    ('UPPAbaby', 'Mesa Max'),
    ('UPPAbaby', 'Aria'),
    ('UPPAbaby', 'Aria V2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'BOB infant car seat adapter',
  seat."displayName" || ' is compatible with BOB Alterrain Pro via the BOB infant car seat adapter. Confirm the specific adapter SKU for your seat model.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM alterrain_pro stroller
CROSS JOIN bob_uppababy_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 10. BOB Alterrain Pro × Britax + Chicco seats ───────────────────────────
-- Mirror the existing BOB Revolution Flex 3.0 pattern.

WITH alterrain_pro AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") = ('BOB', 'Alterrain Pro')
),
britax_chicco_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Britax', 'Willow S'),
    ('Britax', 'Cypress S'),
    ('Chicco', 'KeyFit 35'),
    ('Chicco', 'Fit2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  stroller."brand" || ' adapter for ' || seat."brand" || ' infant seats',
  seat."displayName" || ' leans ' || seat."brand" || '-first, but this pairing still needs an adapter plan rather than blind plug-and-play expectations.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM alterrain_pro stroller
CROSS JOIN britax_chicco_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 11. Thule Urban Glide 2 + Sleek × Nuna PIPA ─────────────────────────────
-- Confirmed on Strolleria PIPA page. Urban Glide 2 Double NOT listed on PIPA page.

WITH thule_pipa_strollers AS (
  SELECT "id", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Thule', 'Urban Glide 2'),
    ('Thule', 'Sleek')
  )
),
nuna_pipa_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna', 'PIPA RX'),
    ('Nuna', 'PIPA urbn')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Thule adapter for Nuna PIPA seats',
  seat."displayName" || ' is compatible with Thule ' || stroller."model" || ' via adapter. Confirm the specific Thule adapter kit before purchase.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM thule_pipa_strollers stroller
CROSS JOIN nuna_pipa_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 12. Thule strollers × UPPAbaby Mesa V3 + Aria V2 ────────────────────────
-- Urban Glide 2 Single + Double + Sleek all confirmed on Strolleria Mesa V3 page.
-- Aria V2 follows the same Mesa V3 compatibility pattern.

WITH thule_strollers AS (
  SELECT "id", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Thule', 'Urban Glide 2'),
    ('Thule', 'Urban Glide 2 Double'),
    ('Thule', 'Sleek')
  )
),
thule_uppababy_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Mesa V3'),
    ('UPPAbaby', 'Mesa Max'),
    ('UPPAbaby', 'Aria'),
    ('UPPAbaby', 'Aria V2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Thule adapter for UPPAbaby infant seats',
  seat."displayName" || ' is compatible with Thule ' || stroller."model" || ' via the Thule infant car seat adapter.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM thule_strollers stroller
CROSS JOIN thule_uppababy_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 13. Thule strollers × Maxi-Cosi seats ───────────────────────────────────

WITH thule_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Thule', 'Urban Glide 2'),
    ('Thule', 'Urban Glide 2 Double'),
    ('Thule', 'Sleek')
  )
),
maxi_cosi_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Thule adapter for Maxi-Cosi infant seats',
  seat."displayName" || ' lives in one of the most universal travel-system lanes, but it is still an adapter story on this stroller.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM thule_strollers stroller
CROSS JOIN maxi_cosi_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 14. Silver Cross Clic + Jet Double × Nuna PIPA ──────────────────────────
-- Both models confirmed on Strolleria PIPA compatibility page.

WITH sc_strollers AS (
  SELECT "id", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Silver Cross', 'Clic'),
    ('Silver Cross', 'Jet Double')
  )
),
nuna_pipa_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna', 'PIPA RX'),
    ('Nuna', 'PIPA urbn')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Silver Cross adapter for Nuna PIPA seats',
  seat."displayName" || ' is compatible with Silver Cross ' || stroller."model" || ' via adapter. Confirm the specific upper-adapter kit before purchase.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM sc_strollers stroller
CROSS JOIN nuna_pipa_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 15. Silver Cross Clic + Jet Double × Maxi-Cosi seats ────────────────────
-- Mirror the existing Silver Cross stroller pattern.

WITH sc_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Silver Cross', 'Clic'),
    ('Silver Cross', 'Jet Double')
  )
),
maxi_cosi_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Silver Cross adapter for Maxi-Cosi infant seats',
  seat."displayName" || ' lives in one of the most universal travel-system lanes, but it is still an adapter story on this stroller.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM sc_strollers stroller
CROSS JOIN maxi_cosi_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 16. Joolz Hub 2 × Nuna PIPA + Maxi-Cosi (lower adapter) ────────────────
-- Confirmed on Strolleria PIPA page. Lower adapter, same as Joolz Hub.

WITH hub2 AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('Joolz', 'Hub 2')
),
joolz_seats AS (
  SELECT "id", "brand", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna',      'PIPA RX'),
    ('Nuna',      'PIPA urbn'),
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  CASE
    WHEN seat."brand" = 'Nuna'      THEN 'Joolz lower adapter for Nuna PIPA seats'
    ELSE                                  'Joolz lower adapter for Maxi-Cosi infant seats'
  END,
  seat."displayName" || ' is compatible with Joolz Hub 2 using the Joolz lower adapter. Confirm the specific adapter SKU for your seat model.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM hub2 stroller
CROSS JOIN joolz_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 17. New UPPAbaby V3 + Bugaboo 2026 strollers × Maxi-Cosi ───────────────
-- Mirror the universal_strollers pattern from 20260322201500.

WITH new_maxi_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Vista V3'),
    ('UPPAbaby', 'Cruz V3'),
    ('UPPAbaby', 'Minu V3'),
    ('Bugaboo',  'Butterfly 2'),
    ('Bugaboo',  'Kangaroo')
  )
),
maxi_cosi_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
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
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM new_maxi_strollers stroller
CROSS JOIN maxi_cosi_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 18. New UPPAbaby V3 + Bugaboo 2026 strollers × Chicco seats ─────────────
-- Mirror the chicco_strollers pattern from 20260322201500.

WITH new_chicco_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Vista V3'),
    ('UPPAbaby', 'Cruz V3'),
    ('UPPAbaby', 'Minu V3'),
    ('Bugaboo',  'Butterfly 2'),
    ('Bugaboo',  'Kangaroo')
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
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
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
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM new_chicco_strollers stroller
CROSS JOIN chicco_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 19. New UPPAbaby V3 strollers × Clek Liing/Liingo (LIMITED) ─────────────
-- Mirror the limited pattern from 20260322201500 (same restriction as V2).

WITH ub_v3_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Vista V3'),
    ('UPPAbaby', 'Cruz V3'),
    ('UPPAbaby', 'Minu V3')
  )
),
clek_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Clek', 'Liing'),
    ('Clek', 'Liingo')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'LIMITED'::"CompatibilityType",
  true,
  'UPPAbaby adapter for Clek infant seats',
  seat."displayName" || ' is a Clek-first seat with limited third-party adapter support. Verify adapter availability for this specific UPPAbaby stroller before purchasing.',
  'LOW'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM ub_v3_strollers stroller
CROSS JOIN clek_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 20. Existing BOB strollers × UPPAbaby Mesa V3 + Aria V2 ─────────────────
-- Mesa V3 and Aria V2 were added after the main BOB expansion migration.
-- Confirmed on Strolleria Mesa V3 + Aria V2 pages: BOB Revolution Flex 3.0 listed.

WITH existing_bob_strollers AS (
  SELECT "id", "brand"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('BOB', 'Revolution Flex 3.0'),
    ('BOB', 'Revolution Flex 3.0 Duallie')
  )
),
new_uppababy_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Mesa V3'),
    ('UPPAbaby', 'Aria V2')
  )
)
INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  stroller."id" || '__' || seat."id",
  stroller."id",
  seat."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'BOB infant car seat adapter',
  seat."displayName" || ' is compatible with BOB Revolution Flex 3.0 via the BOB infant car seat adapter.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM existing_bob_strollers stroller
CROSS JOIN new_uppababy_seats seat
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;
