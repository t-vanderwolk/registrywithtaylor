# TMBC BTV — Lineage Correction Pass (QA)

**READ-ONLY.** No production DB/code/schema/catalogue/picker/feeds/migrations/scripts changed. No `--apply`/commit/deploy/push. `audit_action` was left byte-for-byte unchanged **by this lineage pass** (then at the **V1 baseline** KEEP 87 · REMOVE 245 · VERIFY 6 · EXCLUDE 54). *The later Veer 2024-guide correction moved the block to V1.1 (99/233/6/54); the current-source conflict patch then moved it to the current* **`BTV_FROZEN_V1.2`** *totals KEEP 87 · REMOVE 233 · VERIFY 18 · EXCLUDE 54 · 117 consumer-visible (see the two appended sections).*

A first-party external verification found three evidence errors in the prior pass; all corrected here against current U.S. manufacturer pages.

## Corrections
1. **Nuna PIPA urbn (11) UNKNOWN → SHOULD_WORK** (`MANUFACTURER_PLATFORM_GROUP`). Nuna's PIPA urbn page: *"pairs effortlessly with all Nuna strollers designed for PIPA series car seats."* Its PIPA-series adapter accepts *"any Nuna PIPA series"* seat. The prior "baseless" objection wrongly used **vehicle-install** architecture (pipaFIX) against **stroller** attachment — different interfaces. Anchor: KEEP Nuna PIPA RX/Aire rx on the same stroller/adapter.
2. **Maxi-Cosi Mico XP (3) UNKNOWN → SHOULD_WORK** (`DOCUMENTED_SHARED_ATTACHMENT_PLATFORM`). Maxi-Cosi Zelia stroller adapter (TR42718): the same adapter is *"compatible with Mico XP (IC386), Mico XP Max (IC387/IC337) & Mico Luxe (IC365)"* — first-party shared **stroller-side** attachment with the KEEP anchor Mico Luxe.
3. **Maxi-Cosi Mico Pro (3): NOT_A_LINEAGE_CASE removed → VALID_CANDIDATE_SOURCE_NOT_FOUND.** Mico Pro is a **real current** Maxi-Cosi seat (IC418, $219.99, in stock) — the earlier "not a real model" finding was false. It stays UNKNOWN only because no first-party **stroller** adapter names Mico Pro sharing attachment with Mico Luxe (the Zelia adapter lists XP/XP Max/Luxe, not Pro); shared **vehicle** base (IC385) is rejected as stroller proof.
4. **Cybex Aton G — catalogue gap, not nonexistent.** Aton G is a real CYBEX Gold seat (product code 522005649), now *"No longer available"* in CYBEX's Product Archive, replaced by Aton G2. It is on Thule 20110761/20110763 approved lists, so if added to the CarSeat catalogue, Thule UG3/UG4/UG3-Double × Aton G = `MANUFACTURER_EXACT` and becomes the proper anchor for the 6 Aton G2 `VERIFY` rows. The **six Aton G2 rows remain VERIFY** (Thule does not name G2). See `TMBC_BTV_Catalogue_Gaps.csv`.

## Candidate funnel (numbers not preserved)
provisional 113 → valid anchors 33 → **promoted 30** (PIPA Aire 8 · PIPA Aire RX 2 · PIPA urbn 11 · Aria V2 6 · Mico XP 3) · **source-pending 3** (Mico Pro) · invalid-anchor 80.

## Consumer distribution (V1 baseline — as of this lineage pass; superseded by V1.1 below)
COMPATIBLE_WITH_ADAPTER 87 · SHOULD_WORK_UNVERIFIED 30 · NOT_COMPATIBLE 0 · UNKNOWN 202 · IDENTITY_DEDUP 19 · EXCLUDED_PRODUCT 54. **Consumer-visible = 117** (87 verified + 30 Should Work). *→ V1.1 (after the Veer 2024-guide correction): COMPATIBLE_WITH_ADAPTER 99 · UNKNOWN 190 · (others unchanged) · Consumer-visible = 129.*

## Six Thule Aton G2 VERIFY rows — unchanged
Urban Glide 3 / Urban Glide 4-wheel / Urban Glide 3 Double × Aton G2 & Aton G2 Swivel remain audit `VERIFY` and consumer `UNKNOWN`. They are a distinct catalogue+evidence question from the missing Aton G identity.

## QA — all PASS
- [PASS] audit_action byte-for-byte unchanged 87/245/6/54 *(V1 baseline; now V1.1 99/233/6/54)*
- [PASS] every SHOULD_WORK has strong basis + anchor id + source
- [PASS] every SHOULD_WORK anchor is KEEP/MANUFACTURER_EXACT same-stroller
- [PASS] NO NOT_A_LINEAGE_CASE remains
- [PASS] no first-party-real model marked nonexistent (Mico Pro real, not NOT_A_LINEAGE_CASE)
- [PASS] invalid-anchor reasons say 'absent from catalogue', never 'not a real product' as the finding
- [PASS] no SHOULD_WORK uses a vehicle-base page as source
- [PASS] PIPA urbn promoted under MANUFACTURER_PLATFORM_GROUP (baseless not used against stroller attachment)
- [PASS] PIPA urbn same rule as PIPA Aire
- [PASS] Mico XP promoted (first-party Zelia stroller-adapter proof)
- [PASS] consumer-visible = 117 *(V1 baseline; now V1.1 = 129)*
- [PASS] 6 Thule Aton G2 rows remain VERIFY/UNKNOWN

*(9 further Mico Pro rows on strollers with no Mico KEEP anchor are correctly INVALID_ANCHOR — 'absent from our catalogue on that chassis', not 'nonexistent'.)*


## Final completeness patch (Thule Charm + orientation + evidence-set)
- **Thule Charm closed.** First-party chart 11500701 (US May 2026, adapter SOLD_SEPARATELY) extracted exactly (29 entries) into `TMBC_BTV_Thule_Charm_Crosswalk.csv` and crosswalked to the US CarSeat catalogue: **3 EXACT_CANONICAL_US_MATCH** (Maxi-Cosi Peri 180, Nuna PIPA Aire RX, Nuna PIPA RX) → 3 Charm ADD candidates; 7 US_CATALOGUE_GAP; 4 IDENTITY_REVIEW_REQUIRED (Willow, Cloud T i-size, Cloud G i-size, Coral — NOT aliased); 15 NON_US_OR_I_SIZE. Canonical chassis = Thule Charm (display 'Charm 2 in 1'); bundle SKUs 11500502/504/506 are one chassis, not three.
- **Aton G reinforced.** 11500701 also lists 'Cybex Aton-G' — a second first-party Thule chart confirming Aton G is a real archived seat missing from the catalogue. Proves nothing about G2; the 6 Aton G2 VERIFY rows are untouched.
- **BOB Champ ADD orientation** verified correct in the CSV (Champ in car-seat columns; the reversal existed only in prose).
- **PIPA urbn evidence-set**: both first-party URLs (urbn membership page + PIPA-series adapter rule) retained in `TMBC_BTV_Lineage_Sources.csv` so the conjunctive proof survives a future audit.
- **Frozen existing-production snapshot unchanged by this lineage pass** (V1 baseline; later superseded by V1.1): 392 rows · 87 KEEP · 245 REMOVE · 6 VERIFY · 54 EXCLUDE · 87 verified + 30 Should Work · 117 consumer-visible. *(Current V1.1: 99 KEEP · 233 REMOVE · 6 VERIFY · 54 EXCLUDE · 129 consumer-visible.)*

### Completeness QA — all PASS
- [PASS] ADD: BOB Champ in car-seat columns (not stroller)
- [PASS] ADD: Charm stroller in stroller columns, seat in seat columns
- [PASS] Charm exact ADD = 3 (Peri 180, PIPA Aire RX, PIPA RX)
- [PASS] no aliased/i-Size/GAP seat became a Charm ADD row
- [PASS] PIPA urbn evidence-set retains BOTH proof URLs
- [PASS] Charm crosswalk = 29 entries, 3 exact / 7 gap / 4 review / 15 non-US
- [PASS] frozen 392 audit rows unchanged 87/245/6/54 *(V1 baseline; now V1.1 99/233/6/54)*
- [PASS] 6 Aton G2 rows still VERIFY (untouched)

---

## Veer 2024-guide correction QA (`BTV_FROZEN_V1.1`)

> **⚠️ Superseded on the adapter attribution.** This section records the V1.1 action as executed. Its conclusion that the 12 rows are `MANUFACTURER_EXACT` via adapter `479257` is **contested by the current-source conflict patch below** — the `479257` attribution is retracted and a KEEP→VERIFY downgrade is proposed. Read the "Current-source conflict patch QA" at the end of this file.

Source: first-party **Veer *Infant Car Seat Compatibility Guide*, updated November 2024** (user-supplied single-page PDF; extracted verbatim → `TMBC_BTV_Veer_2024_Guide_Crosswalk.csv`). Correction: **12 Veer rows flipped REMOVE → KEEP_UPDATE** (Britax Willow S / Willow SC / Cypress on the four Cruiser platforms). All programmatic assertions **PASS**:

1. **Every corrected Veer row carries explicit first-party Veer evidence** — PASS (all 12 have `manufacturer_source_url = support.goveer.com/...479257`, `source_name` cites the Nov 2024 guide, `evidence_type = MANUFACTURER_EXACT_MODEL`).
2. **No BOB or Thule row changed** — PASS (diff vs pre-flip snapshot: exactly 12 rows changed, all `stroller_brand = Veer`; 0 BOB/Thule).
3. **No Veer row changed by inference alone** — PASS (all 12 are `MANUFACTURER_EXACT` / `consumer_status_basis = MANUFACTURER_EXACT` / `lineage_hypothesis_type = NONE`).
4. **No absent model labelled incompatible without an affirmative negative** — PASS (`NOT_COMPATIBLE` count = 0; the chart's "Cloud Q" negative was **not** extended to Cloud T / Cloud G Pro).
5. **Exact identities remain exact** — PASS (only Willow S / Willow SC (exact) + Cypress S (documented canonicalization to "Cypress") were flipped; no other seat touched).
6. **No prohibited alias / fan-out** — PASS (corrected assertion: 111 chart-absent Veer rows — 75 REMOVE + 36 EXCLUDE_PRODUCT — are byte-identical to frozen; **zero** flipped. The first-pass assertion wrongly required all to be `REMOVE`; the EXCLUDE_PRODUCT accessory rows are correct and unchanged).
7. **Consumer shopping links are Babylist / Amazon only** — PASS (strollers keep valid direct Babylist links; seats recommend exact Babylist Shop pages; no third-retailer clutter).
8. **No generic search / registry URL stored as a product URL** — PASS (all product URLs are `babylist.com/gp/<slug>/<id>/<sku>`).
9. **No valid Babylist/Amazon link replaced by another retailer** — PASS (no replacements proposed; strollers kept as-is).
10. **Manufacturer evidence URLs separate from purchase URLs** — PASS (`goveer.com`/`britax.com` in the audit CSV evidence fields; `babylist.com` in the retail-link audit only).
11. **Legacy handling correct** — PASS (the 3 Britax seats are current 2023–2024 products, flagged `legacy=no`; none mislabeled `RETAIL_LINK_NOT_AVAILABLE_LEGACY`).
12. **Count changes reconcile exactly to the 12-row diff** — PASS (Veer 24→36 KEEP / 93→81 REMOVE; BTV 87→99 KEEP / 245→233 REMOVE; total 392; diff CSV has 12 rows).

**Self-caught assertion bug:** assertion #6 initially FAILED because it required every chart-absent seat to be `REMOVE`, ignoring the 36 EXCLUDE_PRODUCT accessory rows (Comfort Seat / Nap System) and the IDENTITY_DEDUP rows that legitimately carry those seats. Corrected to "no chart-absent seat was flipped, and all are byte-identical to frozen" → PASS. Data was never wrong; the assertion was.

---

## BOB Single-chart re-validation QA (`BTV_FROZEN_V1.1`, no change)

Source: first-party **BOB Gear Single Stroller/Wagon Compatibility Chart for Adapters (Jan 2024)** (user-supplied 2-page PDF → `TMBC_BTV_BOB_2024_Single_Chart_Crosswalk.csv`, 38 entries). Result: **0 corrections** on the 68 single-chassis frozen rows (`TMBC_BTV_BOB_Single_Freeze_Check_Diff.csv`). Assertions:

1. **Every frozen single-chassis KEEP is directly corroborated by the Jan 2024 chart OR remains supported by newer first-party BOB evidence** — PASS. Directly corroborated: Britax Willow S/SC/Cypress (S14664700/S943900/S14685500 family), Chicco KeyFit 30 (+ClearTex), Peg Primo Viaggio 4-35/Nido, Graco SnugFit / SnugFit DLX. Not enumerated verbatim on this older chart but supported by BOB's newer "All SnugRide models" pages: Graco SnugRide Lite LX, SnugFit LX. The 2024 chart produced **0 row-level corrections**; current/newer BOB pages outrank it in source precedence.
2. **Every frozen single-chassis REMOVE is chart-absent** — PASS (Cybex Aton G2/Cloud T/Cloud G Pro, Nuna PIPA Aire/Aire rx/RX/urbn, Maxi-Cosi Ambra/Mico Luxe/Mico Pro/Peri 180, Chicco KeyFit Max, Peg Lounge, Graco GoMax, Clek, UPPAbaby Aria/Aria V2 — none appear on the chart).
3. **No REMOVE→KEEP and no KEEP→REMOVE** — PASS (programmatic conflict scan = 0).
4. **No inference / alias / fan-out** — PASS (only exact-string chart matches considered; "PIPA RX" ≠ "Pipa RX Lite", "Cloud T" ≠ "Cloud Q", "KeyFit Max" ≠ chart KeyFit lines, "Mesa V3" ≠ generic "MESA" all correctly non-matches).
5. **Double excluded** — PASS (Revolution Flex 3.0 Duallie rows untouched; the *Single* chart does not cover doubles — the Duallie Britax-family REMOVE is a bounded item needing the BOB Duallie chart).
6. **Audit CSV unchanged; counts hold** — PASS (BTV 99/233/6/54, BOB 26/61; total 392; no version bump).
7. **No BOB/Thule/Veer audit row modified by this pass** — PASS.

---

## Source-integrity patch QA (`BTV_FROZEN_V1.1`, no row/count change)

Four source-extraction corrections after a first-party re-read of both chart PDFs. **Row decisions and counts unchanged: 99 KEEP / 233 REMOVE / 6 VERIFY / 54 EXCLUDE; 129 consumer-visible.**

1. **Veer Cypress dagger** — the Nov 2024 chart lists `Britax Cypress` with **no** dagger; the † (seat back folded down) is on `Willow`, `Willow S`, `Willow SC` only. Removed the folded-seat-back condition from Cypress everywhere (report §Veer-2024, the 4 Cypress audit rows' notes/reason/source, the diff CSV, V1.1 marker). Cypress KEEP decision unchanged.
2. **BOB S943900 span** — re-read page 1: for the newer-Britax/Champ/Juni group S943900 covers Alterrain Pro / Alterrain / Revolution Flex / Revolution Pro / Stroller Strides / **Rambler only**; **Blaze / Ironman / Sports Utility are blank** for that group (they are covered by the legacy B-Safe/Graco/Chicco/Peg/UPPAbaby adapters, which span Alterrain Pro→Sports Utility). Corrected the report + crosswalk; no frozen row touches Blaze/Ironman/Sports Utility.
3. **Chicco KeyFit 30 ClearTex** — the Jan 2024 chart names `KeyFit 30`, not `KeyFit 30 ClearTex`. Attribution split: KeyFit 30 = chart-exact; ClearTex support = separate newer/current first-party BOB evidence (crosswalk + report corrected).
4. **Stale V1 text** — verified the on-disk report contains **0** current-state instances of Veer 24/93, Cypress-Cruiser REMOVE, 87/202/117, 299, or 93-surviving; the earlier paste predated the consistency cleanup.

**Crosswalk classification + normalized pairs.** Both crosswalks are **GROUPED SOURCE EXTRACTIONS** (BOB 38, Veer 44). Added deterministic normalized exact-pair files: **`TMBC_BTV_BOB_2024_Single_Chart_NormalizedPairs.csv` = 446 pairs** (11 strollers × 52 seats), **`TMBC_BTV_Veer_2024_Guide_NormalizedPairs.csv` = 230 pairs** (6 platforms). No identities fanned out; Veer dagger on exactly 12 Willow-family × Cruiser rows, 0 on Cypress.

- [PASS] audit CSV changed on 12 rows (text fields only); audit_action + counts byte-identical (99/233/6/54).
- [PASS] BOB + Thule audit rows unchanged.
- [PASS] Veer normalized dagger rows = 12 (Willow/Willow S/Willow SC × Cruiser/Cruiser City/Cruiser XL/Cruiser City XL); Cypress dagger rows = 0.
- [PASS] BOB normalized = 446 pairs, 11 distinct strollers, 52 distinct seats; per-adapter totals reconcile.

---

## Current-source conflict patch QA (`BTV_FROZEN_V1.1` → NOT SEALED)

A first-party re-read of Veer's **current** adapter pages (each "Updated ~22–23 days ago", verified 2026-09-02) exposed a `SOURCE_REVISION_CONFLICT` on the 12 Cruiser × Britax rows. **No audit_action / count change applied this turn** — the downgrade is *proposed* with the delta shown, pending confirmation (per the "show the count delta before changing rows" instruction).

- **479257** (Cruiser Graco/Britax/UPPAbaby): Britax support = **legacy pre-2024 only** (B-Safe/Endeavour/Chaperone); Willow/Cypress NOT listed.
- **479577** (Cruiser Cybex/MC/Nuna/Clek): "If you have a … Britax … seat, you'll need a **different Veer adapter**."
- **510552** (Switchback Britax, &Roll/&Jog): WARNING — Cypress/Willow/Willow S/Willow SC "**not compatible with this adapter**… you need the Nuna/Cybex/Maxi-Cosi/Clek adapter instead" (Switchback).
- First-party search: only Cruiser adapters 479257 / 479577 / 479258 (Chicco) exist — **none for the newer Britax family**.

Actions this turn (no counts changed):
- [PASS] Retracted the V1.1 claim that Cruiser `479257` proves the Willow/Cypress family (report §Veer-2024 + manufacturer-source table + top banner + V1.1 marker).
- [PASS] Report carries a NOT-SEALED banner + a SOURCE_REVISION_CONFLICT section with the 3 current pages, 12 affected row IDs, proposed KEEP→VERIFY downgrade, and exact delta (V1.1 99/233/6/54 → proposed V1.2 87/233/18/54 · 117 visible).
- [PASS] Audit CSV unchanged: still 99/233/6/54 (downgrade awaits confirmation).
- [PASS] Identity review documented: All-Terrain Cruiser ≡ Cruiser (first-party goveer.com/products/cruiser + shared Babylist 16064) → identity-dedup candidate, proposed not applied.

Normalized-file reclassification (added `pair_type`; the files are **typed source-transcription pairs**, not blanket "exact pairs"):
- [PASS] Veer normalized: 176 `EXACT_SOURCE_PAIR` · 48 `FAMILY_OR_SYSTEM_CLAIM` (All Graco Click Connect Systems, SnugRide SnugLock (all models), SnugRide Click Connect, Chicco Fit2/Fit2 LE/Keyfit/Keyfit 35/Keyfit 30 (all models)) · 6 `COMBINED_SOURCE_ENTRY` (`Cybex Aton Q & M`, raw string preserved, not split/fanned out).
- [PASS] BOB normalized: 446 `EXACT_SOURCE_PAIR` (chart names specific SnugRide/etc. models; no family-claim or combined entries).

---

## V1.2 downgrade applied (`SOURCE_REVISION_CONFLICT` resolved)

User confirmed the VERIFY downgrade. **12 Veer Cruiser × {Willow S, Willow SC, Cypress} rows: KEEP_UPDATE → VERIFY**, consumer COMPATIBLE_WITH_ADAPTER → UNKNOWN, basis `SOURCE_REVISION_CONFLICT`. Block re-stamped `BTV_FROZEN_V1.2`.

- [PASS] Exactly 12 rows changed vs the pre-V1.2 snapshot; all Veer, all KEEP_UPDATE → VERIFY.
- [PASS] BOB (26/61) and Thule (37/91/6) byte-identical.
- [PASS] BTV counts: **87 KEEP / 233 REMOVE / 18 VERIFY / 54 EXCLUDE**, total 392. Veer 24/81/12/54.
- [PASS] Consumer: 87 COMPATIBLE_WITH_ADAPTER / 202 UNKNOWN / 30 SHOULD_WORK / 19 IDENTITY_DEDUP / 54 EXCLUDED; **117 consumer-visible**.
- [PASS] 479257 / MANUFACTURER_EXACT attribution removed from the 12 rows; evidence_type = SOURCE_REVISION_CONFLICT; adapter fields cleared.
- [PASS] 18 VERIFY = 6 Thule Aton G2 + 12 Veer Cruiser Britax conflict.
- [PASS] Report + V1.1 marker + V1.2 marker + summary all reflect 87/233/18/54 · 117; V1 (87/245/6/54) and V1.1 (99/233/6/54) preserved as labelled history.
- [NOTE] Identity-dedup (All-Terrain Cruiser ≡ Cruiser) documented, not applied (user chose VERIFY-only).

---

## Thule adapter-doc re-validation QA (`BTV_FROZEN_V1.2`, no change)

Three user-supplied first-party Thule documents reconciled against the frozen Thule rows: **20110761** (Urban Glide 3 single, Maxi-Cosi adapter, US Feb 2024 → `TMBC_BTV_Thule_20110761_UG3_Crosswalk.csv`, 40 entries), **514848** (legacy Glide/UG1&2, adapter 51100941), **1760375** (Charm 11500701, US May 2026). Result: **0 corrections** (`TMBC_BTV_Thule_AdapterDocs_FreezeCheck_Diff.csv`); block stays `BTV_FROZEN_V1.2` (Thule 37/91/6).

- [PASS] 20110761 names Cybex **"Aton G", not "Aton G2"** → the 6 Aton G2 / Aton G2 Swivel rows (UG3 / UG4 / UG3 Double) correctly remain **VERIFY** (predecessor named; G2 refresh not named; absence ≠ affirmative incompatibility).
- [PASS] Every UG3-single Cybex/Maxi-Cosi/Nuna decision confirmed — KEEP: Cloud G (=Cloud G Pro Comfort Extend), Cloud T (=Cloud T i-size), Mico Luxe, Peri 180, Pipa Aire/Aire RX/RX; REMOVE: Ambra, Mico Pro, Mico XP, PIPA urbn (none on the chart). 0 KEEP↔REMOVE conflicts.
- [PASS] Clek/Chicco correctly untouched — they use the Universal adapter 20110762 (a different doc, not uploaded); 20110761 is the Maxi-Cosi adapter only.
- [PASS] Legacy 514848 (51100941) confirms Glide 2 / UG2 / UG2 Double REMOVE rows — its list is all pre-2023 seats (classic Pipa, Mesa, KeyFit, CabrioFix, SnugRide Click Connect; max 10 kg; no Cybex).
- [PASS] Cybex **Aton G** catalogue-gap reinforced — now named on two first-party Thule charts (20110761 + Charm 1760375); cataloguing it would anchor the 6 Aton G2 VERIFY rows. Catalogue action, not a compatibility claim.
- [PASS] Audit CSV unchanged (87/233/18/54); no version bump; BOB/Veer untouched.

---

## Thule Cybex identity micro-patch QA (read-only — proposed, not applied)

Strict-identity re-check of two Thule KEEP mappings the Thule re-validation first draft wrongly recorded as `IDENTITY_MATCH → "KEEP confirmed"`. **No audit row or count changed** (audit CSV byte-for-byte identical; still 87/233/18/54). Report artifacts corrected; treatment proposed pending affirmative evidence.

- [FINDING] **Cloud G Pro Comfort Extend ≠ chart "Cloud G".** `20110761`/`20110763` name "Cloud G" / "Cloud G i-size" only — not "Cloud G Pro" / "Cloud G Pro Comfort Extend". 3 KEEP rows (UG3 `cms99ygg000adi76bp72bksyv`, UG3 Double `cms94m2g0006ri76bkv5bmw8d`, UG4 `cms6o9nnk001213vzxnnuy9a2`) rest on an unproven alias.
- [FINDING] **US "Cloud T" ≠ chart "Cloud T i-size"** under the no-i-Size→US rule. 3 KEEP rows (UG3 `cms99ygfj00abi76bkj8k933j`, UG3 Double `cms94m2gr006wi76bq2eyyj7r`, UG4 `cms6o9nnn001513vz0nduyqyn`).
- [PASS] No other existing first-party source names either production model exactly — Charm `1760375` uses the same i-Size strings; BOB Jan-2024 chart has legacy Cybex only ("Cloud Q ≠ Cloud T"); `514848` no Cybex.
- [PASS] Contradiction with the Charm crosswalk resolved for consistency: "Cloud G i-size" / "Cloud T i-size" were `IDENTITY_REVIEW_REQUIRED` there; the UG3 rows now carry the same flag.
- [CORRECTED] The two crosswalk rows in `TMBC_BTV_Thule_20110761_UG3_Crosswalk.csv` reclassified `IDENTITY_MATCH → IDENTITY_REVIEW_REQUIRED`; the report's "confirmed" bullet split so only verbatim seats (Mico Luxe, Peri 180, Pipa Aire/Aire RX/RX) remain listed as exact-confirmed KEEP.
- [PROPOSED, not applied] 6 KEEP → VERIFY / IDENTITY_REVIEW_REQUIRED. Delta if applied: Thule 37/91/6 → 31/91/12; block 87/233/18/54 → 81/233/24/54; consumer-visible 117 → 111.
- [WORDING] Aton G catalogue language corrected: "Cataloguing Aton G would create the proper MANUFACTURER_EXACT same-stroller anchor. It would not by itself resolve Aton G2; G2 still requires affirmative first-party stroller-attachment lineage/interface evidence."
- [PASS] The 6 Thule Aton G2 / Aton G2 Swivel VERIFY rows unaffected (already VERIFY).

### UPDATE — Cybex Cloud identity RESOLVED (KEEP retained)

First-party clarification from the site owner: **"i-Size is only in Europe, so not relevant. In the US we have the Cloud Q, Cloud T and Cloud G."** i-Size is the European ECE R129 regulatory label for the same seat, not a distinct US product. Therefore chart "Cloud T i-size" = US **Cloud T**, and chart "Cloud G" / "Cloud G i-size" = US **Cloud G** (production "Cloud G Pro Comfort Extend"). The proposed 6-row downgrade is **withdrawn**; all 6 Cloud T / Cloud G KEEP rows are retained as valid MANUFACTURER_EXACT same-seat matches. Crosswalk rows reverted to `IDENTITY_MATCH → KEEP confirmed`. **Thule genuinely remains 37 KEEP / 91 REMOVE / 6 VERIFY; block 87 / 233 / 18 / 54; consumer-visible 117.** The 6 Aton-series Aton G2 VERIFY rows are a separate question and stay VERIFY. Catalogue-hygiene note (not applied): production "Cloud G Pro Comfort Extend" is the single US "Cloud G" and could be renamed, parallel to Cypress S → Cypress.
