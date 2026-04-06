ALTER TABLE "AffiliatePartner"
ADD COLUMN IF NOT EXISTS "affiliateTier" TEXT NOT NULL DEFAULT 'T3',
ADD COLUMN IF NOT EXISTS "paymentRisk" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "retailerFallback" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "AffiliatePartner"
SET
  "affiliateTier" = CASE
    WHEN "name" IN (
      'Silver Cross',
      'Bebcare',
      'Nanit',
      'Newton Baby',
      'Owlet',
      'WAYB',
      'Inglesina',
      'Veer',
      'Baby Trend',
      'dadada Baby',
      'Newborn Nursery Furniture',
      'Albee Baby',
      'MacroBaby',
      'ANB Baby',
      'Modern Nursery',
      'BabyQuip',
      'Happiest Baby',
      'MyRegistry'
    ) THEN 'T1'
    WHEN "name" = 'Prosto Concept' THEN 'TX'
    WHEN "name" IN (
      'Jool Baby',
      'Kyte Baby',
      'Earth Mama Organics',
      'Baby Brezza',
      'Ergobaby',
      'Papablic',
      'Bella Luna Toys',
      'Belly Bandit',
      'Inklings Baby',
      'The Baby''s Brew'
    ) THEN 'T2'
    ELSE 'T3'
  END,
  "paymentRisk" = CASE
    WHEN "name" IN (
      'WAYB',
      'dadada Baby',
      'The Baby''s Brew',
      'Papablic',
      'Snuggle Me Organic',
      'Bungle Nursery Cribs',
      'Petit from Poa',
      'Mima',
      'Grownsy'
    ) THEN true
    ELSE false
  END,
  "retailerFallback" = CASE
    WHEN COALESCE("partnerType", '') = 'brand' THEN ARRAY['MacroBaby', 'ANB Baby', 'Albee Baby']::TEXT[]
    ELSE ARRAY[]::TEXT[]
  END;
