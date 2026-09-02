# TMBC BTV — Lineage Correction Pass (QA)

**READ-ONLY.** No production DB/code/schema/catalogue/picker/feeds/migrations/scripts changed. No `--apply`/commit/deploy/push. `audit_action` byte-for-byte unchanged (KEEP 87 · REMOVE 245 · VERIFY 6 · EXCLUDE 54).

A first-party external verification found three evidence errors in the prior pass; all corrected here against current U.S. manufacturer pages.

## Corrections
1. **Nuna PIPA urbn (11) UNKNOWN → SHOULD_WORK** (`MANUFACTURER_PLATFORM_GROUP`). Nuna's PIPA urbn page: *"pairs effortlessly with all Nuna strollers designed for PIPA series car seats."* Its PIPA-series adapter accepts *"any Nuna PIPA series"* seat. The prior "baseless" objection wrongly used **vehicle-install** architecture (pipaFIX) against **stroller** attachment — different interfaces. Anchor: KEEP Nuna PIPA RX/Aire rx on the same stroller/adapter.
2. **Maxi-Cosi Mico XP (3) UNKNOWN → SHOULD_WORK** (`DOCUMENTED_SHARED_ATTACHMENT_PLATFORM`). Maxi-Cosi Zelia stroller adapter (TR42718): the same adapter is *"compatible with Mico XP (IC386), Mico XP Max (IC387/IC337) & Mico Luxe (IC365)"* — first-party shared **stroller-side** attachment with the KEEP anchor Mico Luxe.
3. **Maxi-Cosi Mico Pro (3): NOT_A_LINEAGE_CASE removed → VALID_CANDIDATE_SOURCE_NOT_FOUND.** Mico Pro is a **real current** Maxi-Cosi seat (IC418, $219.99, in stock) — the earlier "not a real model" finding was false. It stays UNKNOWN only because no first-party **stroller** adapter names Mico Pro sharing attachment with Mico Luxe (the Zelia adapter lists XP/XP Max/Luxe, not Pro); shared **vehicle** base (IC385) is rejected as stroller proof.
4. **Cybex Aton G — catalogue gap, not nonexistent.** Aton G is a real CYBEX Gold seat (product code 522005649), now *"No longer available"* in CYBEX's Product Archive, replaced by Aton G2. It is on Thule 20110761/20110763 approved lists, so if added to the CarSeat catalogue, Thule UG3/UG4/UG3-Double × Aton G = `MANUFACTURER_EXACT` and becomes the proper anchor for the 6 Aton G2 `VERIFY` rows. The **six Aton G2 rows remain VERIFY** (Thule does not name G2). See `TMBC_BTV_Catalogue_Gaps.csv`.

## Candidate funnel (numbers not preserved)
provisional 113 → valid anchors 33 → **promoted 30** (PIPA Aire 8 · PIPA Aire RX 2 · PIPA urbn 11 · Aria V2 6 · Mico XP 3) · **source-pending 3** (Mico Pro) · invalid-anchor 80.

## Consumer distribution
COMPATIBLE_WITH_ADAPTER 87 · SHOULD_WORK_UNVERIFIED 30 · NOT_COMPATIBLE 0 · UNKNOWN 202 · IDENTITY_DEDUP 19 · EXCLUDED_PRODUCT 54. **Consumer-visible = 117** (87 verified + 30 Should Work).

## Six Thule Aton G2 VERIFY rows — unchanged
Urban Glide 3 / Urban Glide 4-wheel / Urban Glide 3 Double × Aton G2 & Aton G2 Swivel remain audit `VERIFY` and consumer `UNKNOWN`. They are a distinct catalogue+evidence question from the missing Aton G identity.

## QA — all PASS
- [PASS] audit_action byte-for-byte unchanged 87/245/6/54
- [PASS] every SHOULD_WORK has strong basis + anchor id + source
- [PASS] every SHOULD_WORK anchor is KEEP/MANUFACTURER_EXACT same-stroller
- [PASS] NO NOT_A_LINEAGE_CASE remains
- [PASS] no first-party-real model marked nonexistent (Mico Pro real, not NOT_A_LINEAGE_CASE)
- [PASS] invalid-anchor reasons say 'absent from catalogue', never 'not a real product' as the finding
- [PASS] no SHOULD_WORK uses a vehicle-base page as source
- [PASS] PIPA urbn promoted under MANUFACTURER_PLATFORM_GROUP (baseless not used against stroller attachment)
- [PASS] PIPA urbn same rule as PIPA Aire
- [PASS] Mico XP promoted (first-party Zelia stroller-adapter proof)
- [PASS] consumer-visible = 117
- [PASS] 6 Thule Aton G2 rows remain VERIFY/UNKNOWN

*(9 further Mico Pro rows on strollers with no Mico KEEP anchor are correctly INVALID_ANCHOR — 'absent from our catalogue on that chassis', not 'nonexistent'.)*


## Final completeness patch (Thule Charm + orientation + evidence-set)
- **Thule Charm closed.** First-party chart 11500701 (US May 2026, adapter SOLD_SEPARATELY) extracted exactly (29 entries) into `TMBC_BTV_Thule_Charm_Crosswalk.csv` and crosswalked to the US CarSeat catalogue: **3 EXACT_CANONICAL_US_MATCH** (Maxi-Cosi Peri 180, Nuna PIPA Aire RX, Nuna PIPA RX) → 3 Charm ADD candidates; 7 US_CATALOGUE_GAP; 4 IDENTITY_REVIEW_REQUIRED (Willow, Cloud T i-size, Cloud G i-size, Coral — NOT aliased); 15 NON_US_OR_I_SIZE. Canonical chassis = Thule Charm (display 'Charm 2 in 1'); bundle SKUs 11500502/504/506 are one chassis, not three.
- **Aton G reinforced.** 11500701 also lists 'Cybex Aton-G' — a second first-party Thule chart confirming Aton G is a real archived seat missing from the catalogue. Proves nothing about G2; the 6 Aton G2 VERIFY rows are untouched.
- **BOB Champ ADD orientation** verified correct in the CSV (Champ in car-seat columns; the reversal existed only in prose).
- **PIPA urbn evidence-set**: both first-party URLs (urbn membership page + PIPA-series adapter rule) retained in `TMBC_BTV_Lineage_Sources.csv` so the conjunctive proof survives a future audit.
- **Frozen existing-production snapshot unchanged**: 392 rows · 87 KEEP · 245 REMOVE · 6 VERIFY · 54 EXCLUDE · 87 verified + 30 Should Work · 117 consumer-visible.

### Completeness QA — all PASS
- [PASS] ADD: BOB Champ in car-seat columns (not stroller)
- [PASS] ADD: Charm stroller in stroller columns, seat in seat columns
- [PASS] Charm exact ADD = 3 (Peri 180, PIPA Aire RX, PIPA RX)
- [PASS] no aliased/i-Size/GAP seat became a Charm ADD row
- [PASS] PIPA urbn evidence-set retains BOTH proof URLs
- [PASS] Charm crosswalk = 29 entries, 3 exact / 7 gap / 4 review / 15 non-US
- [PASS] frozen 392 audit rows unchanged 87/245/6/54
- [PASS] 6 Aton G2 rows still VERIFY (untouched)
