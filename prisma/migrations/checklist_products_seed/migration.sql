-- Seed the Baby Checklist "Taylor's Picks" from lib/checklist/products.ts.
-- One-time, idempotent: ON CONFLICT DO NOTHING preserves admin edits and is
-- safe to re-run. Runs automatically on Heroku release (prisma migrate deploy).

-- Ensure the "other retailer" columns exist before seeding. The earlier
-- checklist_products migration was already applied on prod, so its edited copy
-- won't re-run — these guards make this seed self-contained.
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryUrl" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "secondaryRetailer" TEXT;
-- Which checklist line a pick displays under (a ChecklistItem id). Admin-set;
-- overrides the static recommendationId wiring in lib/checklist/data.ts.
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "checklistItemId" TEXT;
-- Defensive: guarantee every optional column the INSERT below references exists,
-- so a missing base column can never abort this migration (which, because each
-- migration runs in a transaction, would roll back the ADD COLUMNs above too).
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "amazonUrl" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "priceSource" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "retailer" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "ChecklistProduct" ADD COLUMN IF NOT EXISTS "badge" TEXT;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('britax-galaxy360', 'Britax', 'Galaxy360', 'A convertible seat that spins to load, so you are not folding yourself into the back seat every day. It carries a child from birth through the years you actually keep a convertible.', 'Parents who want one seat that lasts and a genuinely easier daily buckle.', '360° rotation and a wide, forgiving install.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('infant-car-seat-pick', 'Nuna', 'PIPA RX', 'A light infant seat that clicks in and out of the base and most stroller frames with an adapter. The weight matters more than any spec once you are the one carrying it.', 'Parents who want a true click-and-go travel system in the first months.', 'Low carry weight and a simple, confident install.', 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fnuna-pipa-rx%2F16140%2F310275&partnerpropertyid=7490466', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 1, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('primary-stroller-pick', 'UPPAbaby', 'Vista V2', 'The stroller most families keep for years. It takes a bassinet, a toddler seat, and — with the right piece — a second child, so it grows instead of getting replaced.', 'One-car, city, or suburban families who want a single frame to grow into.', 'Expandable to two seats without buying a new stroller.', 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fstore%2Fstrollers%3Fbrand%3Duppababy&partnerpropertyid=7490466', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 2, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('travel-stroller-pick', 'Babyzen', 'YOYO2', 'Folds small enough for an overhead bin and opens one-handed. A second, lighter stroller earns its keep the first time you travel or tackle a tight trunk.', 'Travel, transit, and quick errands once baby has head control.', 'Carry-on fold in a genuinely usable everyday stroller.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Travel Favorite', true, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('double-stroller-pick', 'UPPAbaby', 'Vista V2 (with RumbleSeat)', 'For twins, one frame that takes two bassinets or two seats keeps your footprint sane. Choose the double configuration around how you actually move through doorways and sidewalks.', 'Twin families who want one frame instead of two separate strollers.', 'True two-seat flexibility from a single chassis.', 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fstore%2Fstrollers%3Fbrand%3Duppababy&partnerpropertyid=7490466', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 4, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('baby-carrier-pick', 'Ergobaby', 'Omni 360', 'An adjustable carrier that works from newborn without an insert and adapts across caregivers of different sizes. Comfort for the wearer is what keeps a carrier in use.', 'Hands-free days, contact naps, and sharing between two adults.', 'Newborn-ready with a supportive, shareable fit.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 5, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('monitor-pick', 'Nanit', 'Pro Camera', 'A clear overhead view and reliable app. For one baby it is plenty; for twins, choose a system that supports two cameras on one account rather than two separate apps.', 'Parents who want a dependable video view without a wall of gadgets.', 'Two-camera capability on a single system.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 6, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('audio-monitor-pick', 'VTech', 'Audio Monitor', 'Sometimes you just want sound, long battery, and nothing to charge or log into. A simple audio monitor is an honest, low-stress backup or primary.', 'Small homes, light sleepers, and anyone who wants less screen.', 'Reliable, distraction-free, inexpensive.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, NULL, false, 7, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('bathtub-pick', 'Puj / Angelcare', 'Infant Tub', 'A tub that supports a newborn and drains easily beats anything elaborate. For twins, one tub is fine — you are bathing one baby at a time regardless.', 'First baths through the sitting-up stage.', 'Simple support, easy to clean and store.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 8, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('high-chair-pick', 'Stokke', 'Tripp Trapp', 'A chair that adjusts to the table and grows with the child, so it does not get outgrown in a year. You will not need it until around six months — register early, buy later.', 'Families who want one chair for the long haul.', 'Adjusts from baby to big-kid seating.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 9, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('bottle-trial-pick', 'Mixed', 'Bottle Trial Pack', 'Babies are opinionated about bottles. Start with a small variety pack and let your baby tell you the winner before you commit to eight of anything.', 'Every feeding plan — breast, bottle, or both.', 'Cheap insurance against a full set your baby rejects.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Try First', false, 10, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('breast-pump-pick', 'Spectra', 'S1 Plus', 'A workhorse pump that many parents can get through insurance — check that first. Comfort and reliable suction beat novelty every time.', 'Anyone planning to pump regularly.', 'Hospital-strength performance; often insurance-covered.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, NULL, false, 11, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('diaper-pail-pick', 'Ubbi', 'Steel Diaper Pail', 'Steel seals odor better than plastic and takes regular trash bags, so you are not locked into a refill subscription. One good pail serves twins fine.', 'Nurseries where smell control actually matters.', 'No proprietary refills; genuinely contains odor.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 12, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('playard-pick', 'Guava / BabyBjörn', 'Travel Crib', 'A light travel crib doubles as a safe sleep space at grandma’s and a contained spot at home. Look for a one-piece setup you will actually use.', 'Travel, visits, and a second safe sleep space.', 'Fast setup, packs down small.', 'AFFILIATE_LINK_NEEDED', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Space Saver', false, 13, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('davinci-dylan-mini-crib', 'DaVinci', 'Dylan Folding Portable 3-in-1 Mini Crib', 'A folding mini crib that tucks away when you need the floor space back and converts to a twin bed down the road. A smart pick for small rooms, guest rooms, or grandparents.', 'Small spaces and anyone who wants a crib that folds flat and grows up.', 'Folds flat, rolls away, and converts to a toddler/twin bed.', 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fdavinci-dylan-folding-portable-3-in-1-mini-crib%2F32116%2F1322545&partnerpropertyid=7490466', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 14, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('stokke-sleepi-crib', 'Stokke', 'Sleepi 3-in-1 Convertible Crib (with mattresses + extension kit)', 'An oval convertible crib that starts small and expands as your baby grows — the mattresses and extension kit are included here, so it lasts from newborn through the toddler years.', 'Families who want one beautiful crib that grows from newborn to toddler.', 'Oval-to-bed system with the extension kit included.', 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fstokke-sleepi3-in-1-convertible-crib-with-mattresses-and-extension-kit%2F77231%2F2666164&partnerpropertyid=7490466', NULL, NULL, NULL, NULL, NULL, 'Babylist', NULL, 'Taylor''s Pick', true, 15, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ChecklistProduct" ("id", "brand", "product", "review", "bestFor", "standout", "affiliateUrl", "amazonUrl", "secondaryUrl", "secondaryRetailer", "price", "priceSource", "retailer", "imageUrl", "badge", "disclosure", "sortOrder", "updatedAt")
VALUES ('nuna-demi-icon', 'Nuna', 'DEMI Icon', 'A premium full-size stroller that takes a bassinet, toddler seat, and infant seat — a true grow-with-you frame with a smooth ride and a compact one-piece fold.', 'Parents who want one high-end frame that adapts from newborn onward.', 'Modular from day one, with a refined, sturdy ride.', 'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fnuna-demi-icon%2F81555%2F3142525&partnerpropertyid=7490466', NULL, NULL, NULL, NULL, NULL, 'Babylist', 'https://www.macrobaby.com/cdn/shop/files/nuna-demi-icon-stroller-caviar_image_1_1000x.jpg?v=1774841535', 'Taylor''s Pick', true, 16, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
