# TMBC Baby Checklist Audit - 2026-09-09

No content changes have been applied. This audit is the required review checkpoint before destructive checklist simplification.

## Proposed Counts

| Category | Current | Proposed |
|---|---:|---:|
| Sleep + Nursery | 17 | 13 |
| Feeding + Pumping | 28 | 21 |
| Starting Solids | 9 | 6 |
| Diapering | 12 | 9 |
| Bath | 10 | 6 |
| Health + Grooming | 10 | 8 |
| Getting Around | 17 | 14 |
| Diaper Bag | 8 | 4 |
| Clothing | 8 | 6 |
| Play + Development | 10 | 6 |
| Awake-Time Gear | 4 | 3 |
| Travel | 8 | 5 |
| Home + Safety | 9 | 6 |
| Postpartum | 7 | 5 |
| Support + Services | 6 | 5 |
| Registry Strategy | 12 | 8 |
| **Total** | **175** | **125** |

## Structural Findings

- Production has 1 ChecklistCategory row, 0 ChecklistItem rows, and 121 ChecklistProduct rows.
- Public structure is still static baseline plus additive DB rows. Seeded/default categories and items are not fully admin-editable today.
- Existing seed script preserves ChecklistProduct edits, but there is no structure seed that makes the 175 baseline checklist items DB-owned.
- Static item `extra-infant-base` is a standalone "Extra infant-seat base" checkbox and violates the supplied hard rule.

## Product / Affiliate Impact For Combined Or Removed Items

No affiliate links should be removed, stripped, or replaced during checklist simplification. When an item is combined or moved to a note, its product recommendations and existing affiliate URLs must move to the destination item or be flagged for manual review if there is no valid destination.

| Current Item ID | Live DB Picks | Action | Destination |
|---|---:|---|---|
| audio-monitor | 1 | COMBINE | Baby monitor |
| bottle-drying-rack | 1 | COMBINE | Bottle cleaning basics |
| dishwasher-basket | 2 | COMBINE | Bottle cleaning basics |
| bath-stand | 1 | MOVE TO NOTE | Baby bathtub |
| kneeler | 2 | COMBINE | Spout cover and non-slip bath mat |
| push-walker | 1 | COMBINE | Stationary activity center |

## Files

- Full per-item audit: `reports/checklist/TMBC_Checklist_Content_Audit_2026-09-09.csv`
