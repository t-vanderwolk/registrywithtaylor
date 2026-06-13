-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 20260613120000_babylist_compatibility_update
-- Source:    Babylist car-seat stroller compatibility guide
--            www.babylist.com/hello-baby/car-seat-stroller-compatibility
--            (Mockingbird sub-page fully scraped June 2026)
-- Adds:      4 new strollers: Mockingbird Single 3.0, Single-to-Double 3.0,
--              UPPAbaby Ridge, Stokke Yoyo 3
--            4 new car seats: Nuna PIPA Aire rx, Baby Jogger City GO 2,
--              Joie Rue, Maxi-Cosi Mico Pro
--            Full Mockingbird compatibility matrix (confirmed from Babylist):
--              · Nuna/Maxi-Cosi/CYBEX/Britax Willow adapter group (HIGH)
--              · Clek adapter group (HIGH)
--              · Joie ICS Adaptor (HIGH)
--              · UPPAbaby adapter group (HIGH, w/ Mesa Max double-mode caveat)
--              · Same-connector MEDIUM confidence seats
--            UPPAbaby Ridge × Mesa V3/Max (explicit ADAPTER overrides auto-DIRECT)
--            Stokke Yoyo 3 × Nuna PIPA / CYBEX / Maxi-Cosi
--            Nuna PIPA Aire rx mirrored from existing PIPA rx compatibility rows
--            Maxi-Cosi Mico Pro mirrored from existing Mico Luxe rows
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── 1. New car seats ────────────────────────────────────────────────────────

INSERT INTO "CarSeat" ("id", "brand", "model", "displayName", "seatType", "summary", "createdAt", "updatedAt")
VALUES
  ('nuna-pipa-aire-rx',
   'Nuna', 'PIPA Aire rx', 'Nuna PIPA Aire rx', 'INFANT',
   'Lightweight PIPA Aire infant car seat with RELX base; uses the same Maxi-Cosi-style click connector as the PIPA rx',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('baby-jogger-city-go-2',
   'Baby Jogger', 'City GO 2', 'Baby Jogger City GO 2', 'INFANT',
   'Lightweight infant car seat with Maxi-Cosi-style click connector; compatible with Mockingbird via Nuna/Maxi-Cosi/CYBEX adapter',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('joie-rue',
   'Joie', 'Rue', 'Joie Rue', 'INFANT',
   'Lightweight baseless infant car seat; compatible with Joie strollers and select strollers via Joie ICS Adaptor',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('maxi-cosi-mico-pro',
   'Maxi-Cosi', 'Mico Pro', 'Maxi-Cosi Mico Pro', 'INFANT',
   'Everyday infant car seat with Maxi-Cosi click connector; compatible with any stroller accepting Maxi-Cosi seats',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary"     = EXCLUDED."summary",
  "seatType"    = EXCLUDED."seatType",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 2. New strollers ────────────────────────────────────────────────────────

INSERT INTO "Stroller" ("id", "brand", "model", "displayName", "summary", "createdAt", "updatedAt")
VALUES
  ('mockingbird-single-3',
   'Mockingbird', 'Single 3.0', 'Mockingbird Single 3.0',
   'Open adapter system single stroller; accepts Nuna, Maxi-Cosi, CYBEX, Britax Willow, Clek, Joie, and UPPAbaby seats via brand-specific adapters',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('mockingbird-single-to-double-3',
   'Mockingbird', 'Single-to-Double 3.0', 'Mockingbird Single-to-Double 3.0',
   'Convertible single-to-double stroller with open adapter system; same car seat compatibility as the Single 3.0 in single-seat configuration',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('uppababy-ridge',
   'UPPAbaby', 'Ridge', 'UPPAbaby Ridge',
   'All-terrain jogging stroller; requires the Ridge Car Seat Adapter (sold separately) to accept UPPAbaby Mesa infant car seats',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('stokke-yoyo3',
   'Stokke', 'Yoyo 3', 'Stokke Yoyo 3',
   'Ultra-compact luxury stroller; accepts Nuna PIPA, CYBEX, and Maxi-Cosi infant seats via brand-specific Stokke Yoyo adaptors',
   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT ("brand", "model") DO UPDATE
SET
  "displayName" = EXCLUDED."displayName",
  "summary"     = EXCLUDED."summary",
  "updatedAt"   = CURRENT_TIMESTAMP;


-- ─── 3. Mockingbird × Nuna/Maxi-Cosi/CYBEX/Britax Willow adapter (HIGH) ─────
-- Confirmed by Babylist: nuna-pipa-rx, britax-willow-s, nuna-pipa-aire-rx,
--   baby-jogger-city-go-2 (Maxi-Cosi-style connector), maxi-cosi-mico-pro
-- One adapter SKU covers all brands in this group.

WITH mockingbird_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Mockingbird', 'Single 3.0'),
    ('Mockingbird', 'Single-to-Double 3.0')
  )
),
nmc_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna',        'PIPA RX'),
    ('Nuna',        'PIPA Aire rx'),
    ('Baby Jogger', 'City GO 2'),
    ('Britax',      'Willow S'),
    ('Maxi-Cosi',   'Mico Pro')
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
  'Mockingbird car seat adapter — Nuna/Maxi-Cosi/CYBEX/Britax Willow ($50)',
  'Use the Mockingbird Nuna/Maxi-Cosi/CYBEX/Britax Willow adapter for ' || cs."displayName" || '.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM mockingbird_strollers s
CROSS JOIN nmc_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 4. Mockingbird × Clek adapter group (HIGH) ──────────────────────────────
-- Confirmed by Babylist: clek-liing, clek-liingo

WITH mockingbird_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Mockingbird', 'Single 3.0'),
    ('Mockingbird', 'Single-to-Double 3.0')
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
  s."id" || '__' || cs."id",
  s."id",
  cs."id",
  'ADAPTER'::"CompatibilityType",
  true,
  'Mockingbird Clek car seat adapter ($50)',
  'Use the Mockingbird Clek adapter for ' || cs."displayName" || '.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM mockingbird_strollers s
CROSS JOIN clek_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 5. Mockingbird × Joie ICS Adaptor (HIGH) ───────────────────────────────
-- Confirmed by Babylist: joie-rue (uses separate Joie ICS Adaptor, ~$27)

WITH mockingbird_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Mockingbird', 'Single 3.0'),
    ('Mockingbird', 'Single-to-Double 3.0')
  )
),
joie_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Joie', 'Rue')
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
  'Joie ICS Adaptor for Mockingbird (~$27)',
  'Use the Joie ICS Adaptor to mount the ' || cs."displayName" || ' on the Mockingbird stroller. Adapter sold separately.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM mockingbird_strollers s
CROSS JOIN joie_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 6. Mockingbird × UPPAbaby adapter group (HIGH) ─────────────────────────
-- Confirmed by Babylist: uppababy-aria, uppababy-aria-v2, uppababy-mesa-v3,
--   uppababy-mesa-max (single-seat config only — not compatible in double mode)
-- A separate UPPAbaby adapter SKU is required ($50).

WITH mockingbird_strollers AS (
  SELECT "id", "model"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Mockingbird', 'Single 3.0'),
    ('Mockingbird', 'Single-to-Double 3.0')
  )
),
uppababy_seats AS (
  SELECT "id", "model", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Aria'),
    ('UPPAbaby', 'Aria V2'),
    ('UPPAbaby', 'Mesa V3'),
    ('UPPAbaby', 'Mesa Max')
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
  'Mockingbird UPPAbaby car seat adapter ($50)',
  CASE
    WHEN cs."model" = 'Mesa Max' AND s."model" = 'Single-to-Double 3.0'
    THEN 'Compatible in single + car seat mode only. UPPAbaby Mesa Max is NOT compatible in any Mockingbird double-stroller configuration.'
    ELSE 'Use the Mockingbird UPPAbaby adapter for ' || cs."displayName" || '.'
  END,
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM mockingbird_strollers s
CROSS JOIN uppababy_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 7. Mockingbird × MEDIUM confidence seats ───────────────────────────────
-- These seats share the same Maxi-Cosi-style click connector as the confirmed
-- seats above but were not explicitly listed on the Babylist Mockingbird page.
-- All use the same Nuna/Maxi-Cosi/CYBEX/Britax Willow adapter ($50).

WITH mockingbird_strollers AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") IN (
    ('Mockingbird', 'Single 3.0'),
    ('Mockingbird', 'Single-to-Double 3.0')
  )
),
medium_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna',      'PIPA Aire'),    -- same Maxi-Cosi connector as PIPA rx
    ('Nuna',      'PIPA urbn'),    -- same connector, baseless version
    ('CYBEX',     'Aton G'),       -- same CYBEX interface as Aton M (listed on page)
    ('CYBEX',     'Cloud T'),      -- same CYBEX interface as Cloud Q (listed on page)
    ('Maxi-Cosi', 'Mico Luxe'),    -- same Maxi-Cosi connector as Mico Pro
    ('Maxi-Cosi', 'Coral XP'),     -- same Maxi-Cosi connector
    ('Maxi-Cosi', 'Peri 180')      -- same Maxi-Cosi connector
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
  'Mockingbird car seat adapter — Nuna/Maxi-Cosi/CYBEX/Britax Willow ($50)',
  cs."displayName" || ' uses the same click-connector interface as confirmed compatible seats. Verify with Mockingbird before purchase.',
  'MEDIUM'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM mockingbird_strollers s
CROSS JOIN medium_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 8. UPPAbaby Ridge × Mesa family ────────────────────────────────────────
-- The Ridge is a jogging/all-terrain stroller — it requires the Ridge Car Seat
-- Adapter (sold separately, ~$65) rather than the click-in system on VISTA/CRUZ.
-- Adding explicit ADAPTER rows here prevents the server's DIRECT_DEFAULT_BRANDS
-- logic from auto-generating (incorrect) DIRECT pairs for these seats.

WITH ridge AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('UPPAbaby', 'Ridge')
),
mesa_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('UPPAbaby', 'Mesa V3'),
    ('UPPAbaby', 'Mesa Max')
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
  'UPPAbaby Ridge car seat adapter (sold separately, ~$65)',
  'The Ridge uses a dedicated car seat adapter — not the VISTA/CRUZ click-in system. Adapter required for ' || cs."displayName" || '.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM ridge s
CROSS JOIN mesa_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 9. Stokke Yoyo 3 × infant car seats ───────────────────────────────────
-- The Yoyo 3 accepts Nuna PIPA, CYBEX, and Maxi-Cosi seats via brand-specific
-- Stokke Yoyo car seat adaptors. Stokke is NOT in DIRECT_DEFAULT_BRANDS so all
-- pairs require explicit rows.

WITH yoyo3 AS (
  SELECT "id"
  FROM "Stroller"
  WHERE ("brand", "model") = ('Stokke', 'Yoyo 3')
),
yoyo3_seats AS (
  SELECT "id", "displayName"
  FROM "CarSeat"
  WHERE ("brand", "model") IN (
    ('Nuna',      'PIPA RX'),
    ('Nuna',      'PIPA Aire'),
    ('Nuna',      'PIPA urbn'),
    ('Nuna',      'PIPA Aire rx'),
    ('CYBEX',     'Aton G'),
    ('CYBEX',     'Cloud T'),
    ('Maxi-Cosi', 'Mico Luxe'),
    ('Maxi-Cosi', 'Mico Pro'),
    ('Maxi-Cosi', 'Coral XP'),
    ('Maxi-Cosi', 'Peri 180')
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
  'Stokke Yoyo car seat adaptor',
  'Compatible via the Stokke Yoyo car seat adaptor for ' || cs."displayName" || '. Purchase the adaptor variant matching your car seat brand.',
  'HIGH'::"CompatibilityConfidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM yoyo3 s
CROSS JOIN yoyo3_seats cs
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 10. Nuna PIPA Aire rx — mirror from existing PIPA rx rows ───────────────
-- The PIPA Aire rx uses the same Maxi-Cosi-style click connector as the PIPA rx.
-- Any stroller with an explicit PIPA rx compatibility row accepts the PIPA Aire rx
-- via the same adapter path. Nuna same-brand pairs are auto-generated server-side
-- and won't have explicit DB rows, so this only propagates cross-brand pairs.

INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  existing."strollerId" || '__' || aire_rx."id",
  existing."strollerId",
  aire_rx."id",
  existing."compatibilityType",
  existing."adapterRequired",
  existing."adapterType",
  'Compatible via same adapter path as Nuna PIPA rx.',
  existing."confidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Compatibility" existing
JOIN "CarSeat" pipa_rx
  ON pipa_rx."id" = existing."carSeatId"
  AND pipa_rx."brand" = 'Nuna'
  AND pipa_rx."model" = 'PIPA RX'
JOIN "CarSeat" aire_rx
  ON aire_rx."brand" = 'Nuna'
  AND aire_rx."model" = 'PIPA Aire rx'
JOIN "Stroller" stroller_filter
  ON stroller_filter."id" = existing."strollerId"
  AND stroller_filter."brand" != 'Mockingbird'  -- Mockingbird handled in section 3
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;


-- ─── 11. Maxi-Cosi Mico Pro — mirror from existing Mico Luxe rows ────────────
-- The Mico Pro uses the same Maxi-Cosi click connector as the Mico Luxe.
-- Mockingbird rows are excluded here (already added in section 3 above).

INSERT INTO "Compatibility" (
  "id", "strollerId", "carSeatId", "compatibilityType",
  "adapterRequired", "adapterType", "notes", "confidence", "createdAt", "updatedAt"
)
SELECT
  existing."strollerId" || '__' || mico_pro."id",
  existing."strollerId",
  mico_pro."id",
  existing."compatibilityType",
  existing."adapterRequired",
  existing."adapterType",
  'Compatible via same Maxi-Cosi click connector as Mico Luxe.',
  existing."confidence",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Compatibility" existing
JOIN "CarSeat" mico_luxe
  ON mico_luxe."id" = existing."carSeatId"
  AND mico_luxe."brand" = 'Maxi-Cosi'
  AND mico_luxe."model" = 'Mico Luxe'
JOIN "CarSeat" mico_pro
  ON mico_pro."brand" = 'Maxi-Cosi'
  AND mico_pro."model" = 'Mico Pro'
JOIN "Stroller" stroller
  ON stroller."id" = existing."strollerId"
  AND stroller."brand" != 'Mockingbird'
ON CONFLICT ("strollerId", "carSeatId") DO UPDATE
SET
  "compatibilityType" = EXCLUDED."compatibilityType",
  "adapterRequired"   = EXCLUDED."adapterRequired",
  "adapterType"       = EXCLUDED."adapterType",
  "notes"             = EXCLUDED."notes",
  "updatedAt"         = CURRENT_TIMESTAMP;
