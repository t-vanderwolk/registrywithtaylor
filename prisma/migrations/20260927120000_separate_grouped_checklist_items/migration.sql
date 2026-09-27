-- Separate bundled checklist rows without reseeding or overwriting custom copy.
-- Stable parent IDs retain saved checkbox progress. Newly added IDs start unchecked.
-- Product bundles remain one card; only known individual picks are reassigned.
BEGIN;

CREATE TEMP TABLE checklist_split_updates ON COMMIT DROP AS
SELECT * FROM jsonb_to_recordset($updates$
[
  {"id": "nursery-landing-zone", "title": "Nursery chair", "note": "A comfortable place for feeding and settling, if your space allows.", "old_title": "Nursery chair, side table, and small caddy", "old_note": "A comfortable feeding/change landing zone if your space allows.", "parent": "nursery-landing-zone", "reused": false, "parent_hidden": false},
  {"id": "bassinet-if-using", "title": "Bassinet, if using", "note": "Helpful near your bed if your primary sleep setup does not already meet that need. Track fitted sheets on the sheets row.", "old_title": "Bassinet + fitted sheets, if using", "old_note": "Helpful near your bed, but not required if your crib or playard setup works.", "parent": "bassinet-if-using", "reused": false, "parent_hidden": true},
  {"id": "bottle-brush", "title": "Bottle brush", "note": "Choose a brush that reaches inside your bottles and small parts. Track drying space separately.", "old_title": "Bottle cleaning basics", "old_note": "Think bottle brush, drying space, and a small-parts plan based on how you will clean bottles and pump parts.", "parent": "bottle-brush", "reused": false, "parent_hidden": false},
  {"id": "pump-bag-cleaning", "title": "Portable pump bag", "note": "For carrying your pump away from home.", "old_title": "Portable pump bag and cleaning supplies", "old_note": "For work, travel, or pumping away from home.", "parent": "pump-bag-cleaning", "reused": false, "parent_hidden": false},
  {"id": "nursing-pads-balm", "title": "Nursing pads", "note": "For leaks if breastfeeding or pumping.", "old_title": "Nursing pads and nipple balm", "old_note": "Comfort supplies if breastfeeding or pumping.", "parent": "nursing-pads-balm", "reused": false, "parent_hidden": false},
  {"id": "bowls-plates", "title": "Baby bowls", "note": "A small set for the solids stage. Spoons and cups have their own rows.", "old_title": "First spoons, bowls, plates, and cups", "old_note": "Register now, open when solids are on the horizon; a small set of spoons plus an open cup or straw cup is plenty.", "parent": "bowls-plates", "reused": false, "parent_hidden": false},
  {"id": "open-straw-cups", "title": "Open cup", "note": "A small cup for practicing at meals.", "old_title": "Open cup and straw cup", "old_note": "Useful skill-building cups for the solids stage.", "parent": "open-straw-cups", "reused": false, "parent_hidden": false},
  {"id": "newborn-diapers", "title": "Newborn diapers", "note": "Start with a small supply; baby may move through this size quickly.", "old_title": "Diapers in newborn and size 1", "old_note": "Start modest and spread sizes; fit, skin, leaks, and growth can change quickly.", "parent": "newborn-diapers", "reused": false, "parent_hidden": false},
  {"id": "size-one-diapers", "title": "Size 1 diapers", "note": "A practical next size to have ready.", "old_title": "Size 1 diapers", "old_note": "A practical next size to have ready.", "parent": "newborn-diapers", "reused": true, "parent_hidden": false},
  {"id": "diaper-pail", "title": "Diaper pail", "note": "Worth it where diapers happen most often.", "old_title": "Diaper pail and liners, if required", "old_note": "Worth it where diapers happen most often.", "parent": "diaper-pail", "reused": false, "parent_hidden": false},
  {"id": "hooded-towels", "title": "Hooded towels", "note": "A few soft towels for after baths.", "old_title": "Hooded towels + washcloths", "old_note": "A few soft towels and washcloths cover baths and quick cleanups.", "parent": "hooded-towels", "reused": false, "parent_hidden": false},
  {"id": "washcloths", "title": "6-8 washcloths", "note": "Useful for baths and quick cleanups.", "old_title": "6-8 washcloths", "old_note": "Useful for baths and quick cleanups.", "parent": "hooded-towels", "reused": true, "parent_hidden": false},
  {"id": "baby-wash", "title": "Gentle baby wash", "note": "A combined wash and shampoo can cover both rows; two bottles are not necessary.", "old_title": "Gentle baby wash + shampoo", "old_note": "One fragrance-free, tear-free bottle is enough.", "parent": "baby-wash", "reused": false, "parent_hidden": false},
  {"id": "kneeler", "title": "Bath kneeler", "note": "More useful once baths move to the big tub. A set may include an elbow rest.", "old_title": "Kneeler + elbow rest", "old_note": "More useful once baths move to the big tub.", "parent": "kneeler", "reused": false, "parent_hidden": false},
  {"id": "spout-cover", "title": "Bath spout cover", "note": "For the big-tub stage, if needed for your setup.", "old_title": "Spout cover and non-slip bath mat", "old_note": "Later-stage big-tub safety, not a newborn need.", "parent": "spout-cover", "reused": false, "parent_hidden": false},
  {"id": "bath-toys-storage", "title": "Bath toys", "note": "Choose easy-to-clean toys once baby can play in the bath.", "old_title": "Bath toys and draining storage", "old_note": "Choose easy-to-clean toys once baby can actually play in the bath.", "parent": "bath-toys-storage", "reused": false, "parent_hidden": true},
  {"id": "nasal-saline", "title": "Nasal aspirator", "note": "For your congestion-care supplies.", "old_title": "Nasal aspirator + saline", "old_note": "Basic congestion help for the first cold or stuffy night.", "parent": "nasal-saline", "reused": false, "parent_hidden": false},
  {"id": "toothbrush-teethers", "title": "Baby toothbrush", "note": "An oral-care item for the next stage. Teethers have their own row under Play + Development.", "old_title": "Baby toothbrush and teethers", "old_note": "Later oral-care and teething items.", "parent": "toothbrush-teethers", "reused": false, "parent_hidden": false},
  {"id": "travel-wipes-disposal", "title": "Travel wipe case", "note": "A small refillable case for outings.", "old_title": "Travel wipe case and disposal bags", "old_note": "Small refills for changes away from home.", "parent": "travel-wipes-disposal", "reused": false, "parent_hidden": true},
  {"id": "feeding-pacifier-kit", "title": "Outing feeding supplies", "note": "Pack for the way your baby eats.", "old_title": "Feeding supplies and pacifier case as needed", "old_note": "Pack based on how baby actually eats and soothes; add sanitizer or a tiny first-aid pouch only if it earns space.", "parent": "feeding-pacifier-kit", "reused": false, "parent_hidden": false},
  {"id": "adult-sanitizer-firstaid", "title": "Hand sanitizer for adults", "note": "An optional addition to the diaper bag.", "old_title": "Hand sanitizer and small first-aid pouch", "old_note": "Adult sanitizer and basic outing supplies, kept simple.", "parent": "adult-sanitizer-firstaid", "reused": false, "parent_hidden": true},
  {"id": "laundry-care", "title": "Fragrance-free detergent", "note": "Choose a detergent that fits your household laundry routine.", "old_title": "Fragrance-free detergent and gentle stain remover", "old_note": "Simple laundry basics for sensitive newborn skin and inevitable stains.", "parent": "laundry-care", "reused": false, "parent_hidden": false},
  {"id": "travel-sleep-kit", "title": "Travel sound machine", "note": "Pack your existing portable sound machine if you have one.", "old_title": "Travel sound, blackout, and monitor kit", "old_note": "Build this only if travel or overnight visits are likely.", "parent": "travel-sleep-kit", "reused": false, "parent_hidden": false},
  {"id": "smoke-co-detectors", "title": "Working smoke detectors", "note": "Check the alarms in your home. A combination alarm may cover smoke and carbon monoxide.", "old_title": "Working smoke and carbon-monoxide detectors", "old_note": "Confirm alarms are present, working, and placed appropriately.", "parent": "smoke-co-detectors", "reused": false, "parent_hidden": false},
  {"id": "furniture-tv-anchoring", "title": "Furniture anchors", "note": "Plan before baby starts pulling up.", "old_title": "Furniture and TV anchoring", "old_note": "Plan before baby pulls to stand.", "parent": "furniture-tv-anchoring", "reused": false, "parent_hidden": false},
  {"id": "cabinet-latches", "title": "Cabinet latches", "note": "Fit latches to the cabinets baby can reach.", "old_title": "Cabinet, drawer, outlet, and room-specific babyproofing", "old_note": "Install where baby can reach hazards; doors, toilets, stove knobs, and appliance locks depend on your actual home.", "parent": "cabinet-latches", "reused": false, "parent_hidden": false},
  {"id": "outlet-covers", "title": "Outlet covers", "note": "Choose protection suited to the outlets in your home.", "old_title": "Outlet covers", "old_note": "Babyproofing for the mobile stage.", "parent": "cabinet-latches", "reused": true, "parent_hidden": false},
  {"id": "door-toilet-stove-safety", "title": "Door safety solutions", "note": "Address the doors that create a risk in your home.", "old_title": "Door, toilet, stove, and appliance safety solutions", "old_note": "Buy for the hazards your home actually has.", "parent": "cabinet-latches", "reused": true, "parent_hidden": false},
  {"id": "postpartum-underwear-pads", "title": "Postpartum underwear", "note": "Choose comfortable recovery underwear; a recovery kit may include it.", "old_title": "Postpartum recovery basics", "old_note": "Parent recovery belongs on the registry too: comfortable underwear, pads, peri bottle, and cold packs if they fit your care plan.", "parent": "postpartum-underwear-pads", "reused": false, "parent_hidden": false},
  {"id": "peri-bottle-cold-packs", "title": "Peri bottle", "note": "Follow your care team’s recovery guidance.", "old_title": "Peri bottle and cold packs", "old_note": "General comfort supplies; follow your clinician for specific recovery needs.", "parent": "postpartum-underwear-pads", "reused": true, "parent_hidden": false},
  {"id": "feeding-comfort", "title": "Breast pads, if needed", "note": "Comfort supplies if breastfeeding or pumping.", "old_title": "Breast pads and nipple care, if needed", "old_note": "Comfort basics for breastfeeding or pumping.", "parent": "feeding-comfort", "reused": false, "parent_hidden": true},
  {"id": "parent-station", "title": "Large water bottle", "note": "Keep it within reach during feeds or rest.", "old_title": "Large water bottle, snacks, and long charging cable", "old_note": "A practical bedside or feeding-station setup for the parent.", "parent": "parent-station", "reused": false, "parent_hidden": false}
]
$updates$::jsonb) AS x(id text, title text, note text, old_title text, old_note text, parent text, reused boolean, parent_hidden boolean);

CREATE TEMP TABLE checklist_split_children ON COMMIT DROP AS
SELECT * FROM jsonb_to_recordset($children$
[
  {"id": "nursery-side-table", "parent": "nursery-landing-zone", "category": "sleep", "title": "Nursery side table", "note": "A spot within reach for the things you use during feeds.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 180, "offset": 1},
  {"id": "portable-pump-cleaning", "parent": "pump-bag-cleaning", "category": "feeding", "title": "Portable pump cleaning supplies", "note": "For cleaning pump parts away from home, following the pump instructions.", "timing": "first-8-weeks", "take": "lifestyle-dependent", "inherit_take": true, "hidden": false, "sort_order": 190, "offset": 1},
  {"id": "nipple-balm", "parent": "nursing-pads-balm", "category": "feeding", "title": "Nipple balm", "note": "Optional comfort care if it suits your feeding routine.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 240, "offset": 1},
  {"id": "baby-plates", "parent": "bowls-plates", "category": "solids", "title": "Baby plates", "note": "Add when plates suit the way your baby eats.", "timing": "3-6-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 50, "offset": 1},
  {"id": "straw-cup", "parent": "open-straw-cups", "category": "solids", "title": "Straw cup", "note": "An option to introduce during the solids stage.", "timing": "3-6-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 70, "offset": 1},
  {"id": "diaper-pail-liners", "parent": "diaper-pail", "category": "diapering", "title": "Diaper pail liners, if required", "note": "Check which bags your chosen pail uses before stocking up.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 90, "offset": 1},
  {"id": "baby-shampoo", "parent": "baby-wash", "category": "bath", "title": "Gentle baby shampoo", "note": "Skip a separate bottle if your baby wash is also a shampoo.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 50, "offset": 1},
  {"id": "bath-elbow-rest", "parent": "kneeler", "category": "bath", "title": "Bath elbow rest", "note": "Optional comfort at the tub edge; it may come with your kneeler.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 90, "offset": 1},
  {"id": "non-slip-bath-mat", "parent": "spout-cover", "category": "bath", "title": "Non-slip bath mat", "note": "Choose one suited to your tub and follow its care instructions.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 120, "offset": 1},
  {"id": "bath-toy-storage", "parent": "bath-toys-storage", "category": "bath", "title": "Draining bath toy storage", "note": "A place for bath toys to dry between uses.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": true, "sort_order": 140, "offset": 1},
  {"id": "nasal-saline-drops", "parent": "nasal-saline", "category": "health", "title": "Infant saline drops", "note": "Choose an infant product and follow its directions.", "timing": "before-baby", "take": "essential", "inherit_take": true, "hidden": false, "sort_order": 20, "offset": 1},
  {"id": "outing-disposal-bags", "parent": "travel-wipes-disposal", "category": "diaper-bag", "title": "Outing disposal bags", "note": "Keep a small supply in your changing kit.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": true, "sort_order": 40, "offset": 1},
  {"id": "pacifier-case", "parent": "feeding-pacifier-kit", "category": "diaper-bag", "title": "Pacifier case, if using", "note": "A clean place for a spare pacifier.", "timing": "before-baby", "take": "lifestyle-dependent", "inherit_take": true, "hidden": false, "sort_order": 80, "offset": 1},
  {"id": "outing-first-aid-pouch", "parent": "adult-sanitizer-firstaid", "category": "diaper-bag", "title": "Small outing first-aid pouch", "note": "Keep the contents practical for your family.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": true, "sort_order": 100, "offset": 1},
  {"id": "gentle-stain-remover", "parent": "laundry-care", "category": "clothing", "title": "Gentle stain remover", "note": "For the inevitable laundry surprises.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 70, "offset": 1},
  {"id": "travel-blackout", "parent": "travel-sleep-kit", "category": "travel", "title": "Travel blackout solution", "note": "Pack your existing portable blackout solution if it works for the trip.", "timing": "first-8-weeks", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 50, "offset": 1},
  {"id": "travel-monitor", "parent": "travel-sleep-kit", "category": "travel", "title": "Travel baby monitor", "note": "Bring your usual monitor if it suits your destination; a second one is optional.", "timing": "first-8-weeks", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 60, "offset": 2},
  {"id": "carbon-monoxide-detectors", "parent": "smoke-co-detectors", "category": "home-safety", "title": "Working carbon-monoxide detectors", "note": "Check whether your existing combination alarms already cover this.", "timing": "before-baby", "take": "essential", "inherit_take": true, "hidden": false, "sort_order": 10, "offset": 1},
  {"id": "tv-anchoring", "parent": "furniture-tv-anchoring", "category": "home-safety", "title": "TV anchors", "note": "Include the television in your anchoring plan.", "timing": "3-6-months", "take": "register-early", "inherit_take": true, "hidden": false, "sort_order": 30, "offset": 1},
  {"id": "drawer-latches", "parent": "cabinet-latches", "category": "home-safety", "title": "Drawer latches", "note": "Fit latches to drawers that hold hazards.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 60, "offset": 1},
  {"id": "toilet-locks", "parent": "cabinet-latches", "category": "home-safety", "title": "Toilet locks", "note": "Add where needed for your home.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 70, "offset": 2},
  {"id": "stove-safety", "parent": "cabinet-latches", "category": "home-safety", "title": "Stove safety solutions", "note": "Choose safeguards suited to your stove.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 80, "offset": 3},
  {"id": "appliance-locks", "parent": "cabinet-latches", "category": "home-safety", "title": "Appliance locks", "note": "Add only where an appliance creates an accessible hazard.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 90, "offset": 4},
  {"id": "postpartum-pads", "parent": "postpartum-underwear-pads", "category": "postpartum", "title": "Postpartum pads", "note": "Choose supplies that fit your care plan; check what your recovery kit includes.", "timing": "before-baby", "take": "essential", "inherit_take": true, "hidden": false, "sort_order": 10, "offset": 1},
  {"id": "postpartum-cold-packs", "parent": "postpartum-underwear-pads", "category": "postpartum", "title": "Postpartum cold packs", "note": "Optional comfort supplies if they fit your care plan.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 20, "offset": 2},
  {"id": "postpartum-nipple-care", "parent": "feeding-comfort", "category": "postpartum", "title": "Nipple care, if needed", "note": "Check your feeding supplies before buying extras.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": true, "sort_order": 70, "offset": 1},
  {"id": "parent-snacks", "parent": "parent-station", "category": "postpartum", "title": "Easy snacks for the parent", "note": "Stock a few things you can eat one-handed.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 90, "offset": 1},
  {"id": "long-charging-cable", "parent": "parent-station", "category": "postpartum", "title": "Long charging cable", "note": "One that reaches your bedside or feeding chair.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 100, "offset": 2},
  {"id": "air-purifier", "parent": null, "category": "sleep", "title": "Air purifier", "note": "Optional for your nursery setup. Choose one sized for the room and plan for replacement filters.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 160, "offset": 1},
  {"id": "bottle-washer-detergent", "parent": "bottle-brush", "category": "feeding", "title": "Bottle washer detergent", "note": "Use detergent approved for your bottle washer.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 40, "offset": 1},
  {"id": "lactation-massager", "parent": "nursing-pads-balm", "category": "feeding", "title": "Lactation massager", "note": "Optional if it fits your feeding routine.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 230, "offset": 2},
  {"id": "bath-water-filter", "parent": "spout-cover", "category": "bath", "title": "Bath water filter", "note": "An optional addition if it suits your bath setup.", "timing": "6-12-months", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 110, "offset": 2},
  {"id": "washcloths", "parent": "hooded-towels", "category": "bath", "title": "6-8 washcloths", "note": "Useful for baths and quick cleanups.", "timing": "before-baby", "take": "essential", "inherit_take": true, "hidden": false, "sort_order": 30, "offset": 1},
  {"id": "door-toilet-stove-safety", "parent": "cabinet-latches", "category": "home-safety", "title": "Door safety solutions", "note": "Address the doors that create a risk in your home.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 130, "offset": 5},
  {"id": "size-one-diapers", "parent": "newborn-diapers", "category": "diapering", "title": "Size 1 diapers", "note": "A practical next size to have ready.", "timing": "before-baby", "take": "essential", "inherit_take": true, "hidden": false, "sort_order": 10, "offset": 1},
  {"id": "outlet-covers", "parent": "cabinet-latches", "category": "home-safety", "title": "Outlet covers", "note": "Choose protection suited to the outlets in your home.", "timing": "6-12-months", "take": "wait", "inherit_take": true, "hidden": false, "sort_order": 40, "offset": 6},
  {"id": "peri-bottle-cold-packs", "parent": "postpartum-underwear-pads", "category": "postpartum", "title": "Peri bottle", "note": "Follow your care team’s recovery guidance.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 30, "offset": 3},
  {"id": "nursery-dresser", "parent": "nursery-landing-zone", "category": "sleep", "title": "Nursery dresser", "note": "Clothing storage if your space needs it; secure furniture according to its instructions.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": true, "hidden": false, "sort_order": 190, "offset": 2},
  {"id": "brush-comb", "parent": null, "category": "health", "title": "Soft baby brush or comb", "note": "Simple grooming, especially for cradle-cap flakes or hair.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 40, "offset": 1},
  {"id": "nursery-drawer-organizers", "parent": null, "category": "sleep", "title": "Drawer organizers", "note": "Optional dividers to keep small clothes easy to find. Measure your drawers before choosing a set.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 200, "offset": 1},
  {"id": "nursery-closet-organizers", "parent": null, "category": "sleep", "title": "Closet organizers", "note": "Choose an organizer that fits your closet and the way you want to sort baby clothes.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 210, "offset": 1},
  {"id": "nursery-storage-bins", "parent": null, "category": "sleep", "title": "Storage baskets or bins", "note": "A home for spare linens or the next clothing size. Start with the storage you already have.", "timing": "before-baby", "take": "nice-to-have", "inherit_take": false, "hidden": false, "sort_order": 220, "offset": 1}
]
$children$::jsonb) AS x(id text, parent text, category text, title text, note text, timing text, take text, inherit_take boolean, hidden boolean, sort_order integer, "offset" integer);

-- Capture placement and visibility before changing the parent copy.
INSERT INTO "ChecklistItem" (id, "categoryId", title, note, timing, take, "includeVersions", "sortOrder", hidden, "updatedAt")
SELECT c.id, COALESCE(p."categoryId", c.category), c.title, c.note,
       COALESCE(p.timing, c.timing),
       CASE WHEN c.inherit_take THEN COALESCE(p.take, c.take) ELSE c.take END,
       COALESCE(p."includeVersions", ARRAY[]::text[]),
       COALESCE(p."sortOrder" + c."offset", c.sort_order),
       COALESCE(p.hidden, c.hidden), CURRENT_TIMESTAMP
FROM checklist_split_children c
LEFT JOIN "ChecklistItem" p ON p.id = c.parent
ON CONFLICT (id) DO NOTHING;

-- Reuse previously condensed rows when their copy is still the original copy.
-- A custom row retains its own visibility and version selection.
UPDATE "ChecklistItem" i
SET hidden = COALESCE(p.hidden, u.parent_hidden),
    "includeVersions" = COALESCE(p."includeVersions", ARRAY[]::text[]),
    "updatedAt" = CURRENT_TIMESTAMP
FROM checklist_split_updates u
LEFT JOIN "ChecklistItem" p ON p.id = u.parent
WHERE i.id = u.id AND u.reused
  AND i.title = u.old_title AND (i.note IS NULL OR i.note = u.old_note);

UPDATE "ChecklistItem" i
SET title = u.title,
    note = CASE WHEN i.note IS NULL OR i.note = u.old_note THEN u.note ELSE i.note END,
    "updatedAt" = CURRENT_TIMESTAMP
FROM checklist_split_updates u
WHERE i.id = u.id AND i.title = u.old_title;

UPDATE "ChecklistProduct" SET "checklistItemId" = 'nipple-balm', "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'amzcc-momcozy-nipple-cream-lanolin-free' AND "checklistItemId" = 'nursing-pads-balm';
UPDATE "ChecklistProduct" SET "checklistItemId" = 'lactation-massager', "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'amzcc-momcozy-a1pro-lactation-massager-with-heat' AND "checklistItemId" = 'nursing-pads-balm';
UPDATE "ChecklistProduct" SET "checklistItemId" = 'bottle-washer-detergent', "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'amzcc-papablic-bottle-washer-tablets-120ct' AND "checklistItemId" = 'bottle-brush';
UPDATE "ChecklistProduct" SET "checklistItemId" = 'bath-water-filter', "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'canopy-bath-tub-filter' AND "checklistItemId" = 'spout-cover';

-- The shampoo brush is a grooming pick, separate from wash or shampoo.
UPDATE "ChecklistItem" SET hidden = false, "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'brush-comb' AND title = 'Soft baby brush or comb'
  AND (note IS NULL OR note = 'Simple grooming, especially for cradle-cap flakes or hair.');

UPDATE "ChecklistProduct" SET "checklistItemId" = 'nursery-dresser', "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'amzcc-evolur-aurora-7-drawer-double-dresser' AND "checklistItemId" = 'nursery-landing-zone';
UPDATE "ChecklistProduct" SET "checklistItemId" = 'brush-comb', "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'amzcc-haakaa-silicone-shampoo-cradle-cap-brush' AND "checklistItemId" = 'baby-wash';

COMMIT;
