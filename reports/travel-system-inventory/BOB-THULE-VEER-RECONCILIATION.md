# TMBC Travel System — BOB · Thule · Veer Row-Level Reconciliation (Evidence-Completion Pass)

> **`BTV_FROZEN_V1.2` — FROZEN (current-source conflict correction of V1.1).** 392 rows · **87 KEEP · 233 REMOVE · 18 VERIFY · 54 EXCLUDE** · **117 consumer-visible (87 verified + 30 Should Work)**. V1.1's +12 Cruiser Britax KEEP flips (attributed to Cruiser adapter `479257`) were **downgraded to VERIFY** — Veer's *current* adapter pages show no Cruiser adapter lists the newer Britax family (`SOURCE_REVISION_CONFLICT`; the newer Britax is documented on the Switchback/&Roll/&Jog adapter, not on any current Cruiser adapter). **No BOB or Thule row changed.** V1 (87/245/6/54) and V1.1 (99/233/6/54) snapshots preserved in `BTV_FROZEN_V1.md` / `BTV_FROZEN_V1.1.md`; this correction in `BTV_FROZEN_V1.2.md`. The **18 VERIFY** = 6 Thule Aton G2 + 12 Veer Cruiser × Britax (conflict).

> **✅ RESOLVED in V1.2 — `SOURCE_REVISION_CONFLICT` applied.** A first-party re-read of Veer's **current** adapter pages (updated ~22–23 days ago) contradicted the V1.1 attribution: current Veer documentation **explicitly supports the newer Britax family on the Switchback (&Roll/&Jog) adapter, while no current Cruiser adapter page identifies support for that family**. The claim that Cruiser adapter `479257` proves Willow/Willow S/Willow SC/Cypress is **retracted**. The 12 rows were **downgraded KEEP → VERIFY** (consumer → UNKNOWN, basis `SOURCE_REVISION_CONFLICT`) and the block re-stamped **`BTV_FROZEN_V1.2`** (87/233/18/54 · 117 visible). The identity-dedup finding (All-Terrain Cruiser ≡ Cruiser) remains **documented, not applied**.

**AUDIT FREEZE.** The BTV row-audit decision layer is frozen in report artifacts only; no BOB/Thule row changed. A separate Veer runtime/catalog fix was deployed later in commit `d134b10` via migration `20260907010000_correct_veer_adapter_images_and_wagon_variants` to make the four Veer wagon products visible and correct stored adapter images. That deployment did not change these frozen BTV audit-row decisions.

The initial evidence-completion pass retrieved the **actual first-party U.S. manufacturer fit charts** for every unresolved BOB and Thule row and reduced the VERIFY/PENDING backlog from **119 → 6**; **V1.2 subsequently reopened 12 Veer rows under `SOURCE_REVISION_CONFLICT`, bringing the current VERIFY total to 18** (6 Thule Aton G2 + 12 Veer Cruiser Britax). A follow-up cleanup then completed **Veer** provenance from Veer's first-party manuals and resolved the `Switch&Jog Jogging` duplicate identity, so **all 87 KEEP_UPDATE rows (V1.2) carry a manufacturer source URL** (BOB + Thule with adapter SKUs; Veer with adapter manuals — Veer publishes no numeric SKU, flagged `SKU_NOT_PUBLISHED`). Row file: `TMBC_Compatibility_Row_Audit_BOB_Thule_Veer.csv` (31 columns incl. `manufacturer_source_url`…`adapter_revision`, and the derived `consumer_compatibility_status`, `consumer_status_basis`, `lineage_hypothesis_type`, `lineage_anchor_model`, `lineage_anchor_compatibility_id`, `lineage_source_url` — see the two-layer section below). Lineage validation detail lives in `TMBC_BTV_Lineage_Candidates_Validated.csv`, `_Lineage_Sources.csv`, `_Lineage_Rejected_Evidence.csv`, `_Lineage_QA.md`.

## Final totals (392 rows) — `BTV_FROZEN_V1.2`

| Brand | rows | KEEP_UPDATE | REMOVE | VERIFY | EXCLUDE_PRODUCT | PENDING_IDENTITY |
|---|--:|--:|--:|--:|--:|--:|
| BOB | 87 | **26** | 61 | **0** | – | 0 |
| Thule | 134 | **37** | 91 | **6** | – | **0** |
| Veer | 171 | **24** | 81 | **12** | 54 | 0 |
| **Total** | **392** | **87** | **233** | **18** | **54** | **0** |

**18 VERIFY** = 6 Thule Cybex Aton G2 (evidence gap, below) + **12 Veer Cruiser × Britax** (`SOURCE_REVISION_CONFLICT`, below). **V1→V1.1→V1.2 (Veer K/R/V):** 24/93/0 → 36/81/0 → **24/81/12**. The +12 Cruiser Britax rows went REMOVE(V1) → KEEP(V1.1) → **VERIFY(V1.2)** as the evidence base moved from the Nov 2024 guide to Veer's current adapter pages. BOB and Thule unchanged throughout.

## Veer 2024-guide correction (`BTV_FROZEN_V1.1`)

The user supplied the first-party **Veer *Infant Car Seat Compatibility Guide*, updated November 2024** (a single-page manufacturer chart, extracted verbatim into `TMBC_BTV_Veer_2024_Guide_Crosswalk.csv`, 44 chart entries). It covers four platform columns — **Cruiser & Cruiser City**, **Cruiser XL & Cruiser City XL**, **&Roll**, **&Jog** — and lists seats by brand group (Graco, Britax Legacy pre-2024, UPPAbaby, Nuna, Maxi-Cosi, Cybex, Clek, current Britax, Chicco, Peg Perego).

**What the Nov 2024 guide says.** Under **both** Cruiser columns the guide lists **Britax Willow †, Britax Willow S †, and Britax Willow SC †** (each carrying †= "requires Cruiser seat back to be folded down") **and Britax Cypress with *no* dagger** (no seat-back-folded condition — the † applies to the Willow trio only).

**⚠️ RETRACTION (SOURCE_REVISION_CONFLICT).** The V1.1 correction went further and attributed this to **the Cruiser Graco/Britax/UPPAbaby adapter `479257`**. That attribution is **withdrawn**: Veer's *current* first-party adapter pages (verified below) support the newer Britax family only on the **Switchback (&Roll/&Jog)** adapter, while **no current Cruiser adapter page documents it** (`479257` is legacy pre-2024 Britax only). The 12 Cruiser × {Willow S, Willow SC, Cypress} rows were therefore **downgraded to `VERIFY` / `SOURCE_REVISION_CONFLICT` in V1.2** (guide says the seats fit the Cruiser; current exact adapter documentation identifies no approved Cruiser adapter for them). Detail + count delta in the SOURCE_REVISION_CONFLICT section below.

**Historical V1.1 action (later reversed in V1.2):** V1.1 flipped these **12 rows REMOVE → KEEP_UPDATE** (consumer UNKNOWN → COMPATIBLE_WITH_ADAPTER, `MANUFACTURER_EXACT_MODEL`), across the four production Cruiser records × three Britax seats. **V1.2 reversed them to VERIFY / UNKNOWN** (see below); the table shows the platform/seat mapping of those 12 rows:

| Production platform | → chart platform | seats (12 rows, now VERIFY) |
|---|---|---|
| All-Terrain Cruiser | Cruiser & Cruiser City | Willow S, Willow SC, Cypress S |
| Cruiser | Cruiser & Cruiser City | Willow S, Willow SC, Cypress S |
| Cruiser City | Cruiser & Cruiser City | Willow S, Willow SC, Cypress S |
| Cruiser City XL Essentials | Cruiser XL & Cruiser City XL | Willow S, Willow SC, Cypress S |

Row-level history: `TMBC_BTV_Veer_Freeze_Correction_Diff.csv` (V1.1 REMOVE→KEEP) and `TMBC_BTV_Veer_SourceRevisionConflict_Diff.csv` (V1.2 KEEP→VERIFY).

**Identity resolutions (platform + seat).**
- **All-Terrain Cruiser ≡ Cruiser**, and **Switch&Jog Jogging ≡ Switch&Jog** — confirmed via shared Babylist product IDs (`veer-all-terrain-cruiser/16064`; `veer-switch-jog…/75210`). (Switch&Jog Jogging stays REMOVE/IDENTITY_DEDUP; the AT-Cruiser/Cruiser duplication is flagged for catalogue review, not deduped in this compat pass.)
- **Cypress S → Britax "Cypress" (canonicalized, not aliased).** The chart names "Britax Cypress" (Cruiser cols) / "Britax Cyprus" (&Roll/&Jog, a printed typo) — never "Cypress S." Britax's own site confirms the lineup is **Willow / Willow S / Willow SC / Cypress**, with **no "Cypress S."** So production's `Cypress S` is a demonstrably bad identity for the real `Cypress`; per the identity rule it is documented and recommended for catalogue rename rather than silently aliased. The flip is consistent with V1 already keeping `Cypress S` on the Switchback platforms.

**What did *not* change (chart-absent → stayed UNKNOWN, no fan-out).** Every other production Veer seat is absent from the Nov 2024 chart and was left untouched: Cybex **Aton G2 / Aton G2 Swivel** (chart lists Aton Q & M), Cybex **Cloud T / Cloud G Pro** (the chart negative is *Cloud Q*, a different seat — **not** extended), Maxi-Cosi **Ambra / Mico Luxe / Mico Pro / Peri 180**, Nuna **PIPA Aire (plain) / PIPA urbn**, UPPAbaby **Aria V2 / Mesa V3**, and the Graco **GoMax / SnugFit / Lite LX** group (chart's "All Graco Click Connect Systems / SnugLock" is system-level, not an exact SKU match). **No row was set to NOT_COMPATIBLE from mere absence.**

**Documented catalogue gaps / ADD candidates (not injected — read-only).** The chart proves exact pairs we stock the seat for but hold no Veer row: **Clek Liing** (all 4 platforms), **Chicco KeyFit 30 / KeyFit 30 ClearTex** (all 4), and **Peg Perego Primo Viaggio 4-35** (Cruiser platforms only; Peg Perego is blank on &Roll/&Jog). These are logged in the crosswalk as `CATALOGUE_GAP → ADD_CANDIDATE`.

**Retail-link audit of touched products** (`TMBC_BTV_Veer_Retail_Link_Audit.csv`, 7 products). The 4 Cruiser strollers carry valid direct Babylist product links (Amazon absent → Babylist-only is policy-compliant). The 3 Britax seats (Willow S, Willow SC, Cypress) have **no** retail link and are **current, not legacy** — recommended exact Babylist Shop pages: Willow S `/42121/1627970`, Willow SC `/46082/1831677`, Cypress `/58008/2173490` (add Amazon after ASIN confirmation). Manufacturer evidence URLs (goveer.com / britax.com) are kept separate from these purchase URLs.

## SOURCE_REVISION_CONFLICT — 12 Cruiser × Britax rows (resolved into V1.2; downgrade applied)

**The conflict.** The Nov 2024 Veer **Compatibility Guide** lists Britax Willow / Willow S / Willow SC / Cypress under the Cruiser columns. But Veer's **current** first-party adapter pages (each "Updated ~22–23 days ago", verified 2026-09-02) contradict any Cruiser attribution for the newer Britax family:

| Current Veer page | What it says (verbatim) |
|---|---|
| [Cruiser — Graco/Britax/UPPAbaby `479257`](https://support.goveer.com/en-US/infant-car-seat-adapter-for-graco-britax-and-uppababy-479257) | "The following **legacy Britax models (pre-2024)** are compatible… B-Safe 35 / 35 Elite / Ultra / Gen2 / Gen2 FlexFit / FlexFit+ / Endeavour / Chaperone." **Willow/Cypress not listed.** |
| [Cruiser — Cybex/Maxi-Cosi/Nuna/Clek `479577`](https://support.goveer.com/en-US/infant-car-seat-adapter-for-cybex-maxi-cosi-nuna-and-clek-479577) | "If you have a Graco®, **Britax®**, UPPAbaby®, or Chicco® seat, you'll need a **different Veer adapter**." (Cruiser; no Britax.) |
| [Switchback Britax `510552`](https://support.goveer.com/en-US/britax-infant-car-seat-adapter-for-veer-switchback-system-510552) | For **legacy Britax on &Roll/&Jog**. WARNING: "**Britax Cypress, Britax Willow, Britax Willow S, Britax Willow SC** … are **not compatible with this adapter**… you need the **Nuna / Cybex / Maxi-Cosi / Clek adapter** instead." (Switchback = &Roll/&Jog.) |

So **current Veer documentation explicitly supports the newer Britax family on Switchback (&Roll/&Jog), while no current Cruiser adapter page identifies support for that family.** A first-party search (goveer.com) surfaced only the Cruiser adapters `479257` / `479577` / `479258` (Chicco) — none for the newer Britax family. Under the evidence-precedence rule (current/newer first-party pages outrank older sources), the V1.1 `479257`/`MANUFACTURER_EXACT` attribution cannot stand. (This is *absence of current Cruiser documentation*, not an affirmative manufacturer statement that the family is Switchback-only — hence VERIFY, not REMOVE.)

**Affected rows (12).** Four Cruiser production records × {Willow S, Willow SC, Cypress S}:

| stroller_model | Willow S | Willow SC | Cypress S |
|---|---|---|---|
| All-Terrain Cruiser | `cmqu9huci0021bq8e91p6m3o5` | `cmqu9huez0023bq8e0fyrx7zw` | `cmqu9huhk0025bq8eyz29t0wu` |
| Cruiser | `cmqx8pitp001tgq0cz0m2wl11` | `cmqx8piw4001vgq0c3yo9iqzi` | `cmqx8piyi001xgq0cyfhzib32` |
| Cruiser City | `cmqzsb5em005312dx8k5pstx0` | `cmqzsb5gy005512dxfsuqy20g` | `cmqzsb5j7005712dxia550crg` |
| Cruiser City XL Essentials | `cmqzsb879007b12dxndnstl40` | `cmqzsb89q007d12dxr1ggo2mq` | `cmqzsb8bz007f12dxgc5qwvfb` |

**Downgrade APPLIED in `BTV_FROZEN_V1.2`:** `audit_action` **KEEP_UPDATE → VERIFY**, consumer **COMPATIBLE_WITH_ADAPTER → UNKNOWN**, basis **`SOURCE_REVISION_CONFLICT`** (guide lists on Cruiser; no current Cruiser adapter identified). VERIFY rather than REMOVE because a genuine first-party guide *does* list the pairing — the open question is only the exact current Cruiser adapter. Row-level before/after: `TMBC_BTV_Veer_SourceRevisionConflict_Diff.csv`.

**Count delta applied (`BTV_FROZEN_V1.2`):**

| | V1.1 | **V1.2 (applied)** |
|---|--:|--:|
| KEEP_UPDATE | 99 | **87** |
| REMOVE | 233 | 233 |
| VERIFY | 6 | **18** |
| EXCLUDE_PRODUCT | 54 | 54 |
| consumer-visible | 129 | **117** (87 adapter + 30 Should Work) |
| Veer brand (K/R/V/E) | 36 / 81 / 0 / 54 | **24 / 81 / 12 / 54** |

BOB and Thule unaffected. KEEP returns to 87 and consumer-visible to 117 — the *same numbers* as V1, but the 12 rows are now honestly flagged **VERIFY / SOURCE_REVISION_CONFLICT** (guide-listed, adapter-unconfirmed) rather than V1's plain REMOVE.

**Resolution path.** Confirm from a current first-party Veer source the exact Cruiser adapter (if any) for Willow/Cypress → promote back to KEEP with that adapter; or, if Veer affirmatively states the newer Britax family is not Cruiser-compatible, the Cruiser × Willow/Cypress pairing becomes REMOVE. **Binding note:** the current evidence establishes that the newer Britax family is *documented on Switchback* and *not documented on any current Cruiser adapter* — the **absence of current Cruiser documentation is not an affirmative manufacturer incompatibility**, which is exactly why these rows are `VERIFY`, not REMOVE.

## Identity review — All-Terrain Cruiser ≡ Cruiser

Two of those four Cruiser records are the **same Veer model**: Veer currently markets the product as "**All-Terrain Cruiser**" while referring to the model as "**Cruiser**" ([goveer.com/products/cruiser](https://goveer.com/products/cruiser)); production also shares one Babylist product (`veer-all-terrain-cruiser/16064`) between them. This is an **identity-dedup** case (parallel to `Switch&Jog Jogging` ≡ `Switch&Jog`): one canonical chassis should carry the compatibility, and the duplicate's rows should be `REMOVE / IDENTITY_DEDUP` so unique consumer-visible relationships aren't double-counted. **Proposed, not applied** — flagged for the same confirmation pass as the SOURCE_REVISION_CONFLICT downgrade (they overlap on these records).

## Thule adapter-doc re-validation (no change to counts)

Three first-party Thule adapter documents were supplied and reconciled against the frozen Thule rows: **`20110761`** (Urban Glide 3 single, Maxi-Cosi adapter, US Feb 2024 — extracted to `TMBC_BTV_Thule_20110761_UG3_Crosswalk.csv`, 40 entries), **`514848`** (legacy Glide / Urban Glide 1&2, adapter `51100941`), and **`1760375`** (Thule Charm `11500701`, US May 2026). Result: **0 corrections** (`TMBC_BTV_Thule_AdapterDocs_FreezeCheck_Diff.csv`); the block stays `BTV_FROZEN_V1.2` (37 KEEP / 91 REMOVE / 6 VERIFY).

- **The 6 Aton G2 VERIFY rows are re-validated.** `20110761`'s Cybex list is Aton 2 / Aton Q / **Aton G** / Aton S2 / Cloud Q / Cloud G / Cloud G i-size / Cloud T i-size / Cloud Z / Cloud Z2 — it names **"Aton G", never "Aton G2".** So the production **Aton G2 / Aton G2 Swivel** rows on UG3 / UG4 / UG3 Double correctly stay `VERIFY` (guide names the predecessor Aton G, not the G2 refresh; absence of the G2 name is not an affirmative incompatibility). The Charm chart (`1760375`) likewise lists "Cybex Aton-G", not Aton G2.
- **Every UG3-single KEEP decision confirmed.** Named on `20110761` and validated: Maxi-Cosi **Mico Luxe**, **Peri 180**; Nuna **Pipa Aire / Pipa Aire RX / Pipa RX**; Cybex **Cloud T** (chart "Cloud T i-size") and **Cloud G** (chart "Cloud G" / "Cloud G i-size"; production "Cloud G Pro Comfort Extend"). REMOVE validated: Maxi-Cosi **Ambra / Mico Pro / Mico XP**, Nuna **PIPA urbn** — none appear on the chart. (Clek Liing/Liingo and Chicco use the *Universal* adapter `20110762`, a different document not in this upload — unaffected.)
- **Cybex Cloud i-Size naming — resolved (first-party clarification).** `20110761` lists the Cybex Cloud seats with the European **i-Size** suffix ("Cloud T i-size", "Cloud G i-size"). Per the site owner, **i-Size is a Europe-only ECE R129 label — not a separate seat** — and the US Cybex Cloud lineup is **Cloud Q / Cloud T / Cloud G**. So chart "Cloud T i-size" = US **Cloud T**, and chart "Cloud G" / "Cloud G i-size" = US **Cloud G** (production's verbose "Cloud G Pro Comfort Extend"). The 6 Cloud T / Cloud G KEEP rows are valid `MANUFACTURER_EXACT` same-seat matches. See the Thule identity micro-patch section below.
- **Legacy `514848` (`51100941`)** lists only pre-2023 seats (classic Pipa, Mesa, KeyFit, CabrioFix, SnugRide Click Connect, etc.; max 10 kg, no Cybex at all) — confirming every **Glide 2 / Urban Glide 2 / UG2 Double** REMOVE row (all the newer production seats are absent from it).
- **Catalogue-gap anchor reinforced.** **Cybex Aton G** is now named on **two** first-party Thule charts (`20110761` + Charm `1760375`) yet is missing from the CarSeat catalogue. **Cataloguing Aton G would create the proper `MANUFACTURER_EXACT` same-stroller anchor. It would not by itself resolve Aton G2; G2 still requires affirmative first-party stroller-attachment lineage/interface evidence.** Still a **catalogue action, not a compatibility claim**.

## Thule Cybex identity micro-patch — RESOLVED (KEEP retained)

A strict-identity re-check of two existing Thule KEEP mappings that an earlier draft first recorded as `IDENTITY_MATCH → "KEEP confirmed"`, then briefly flagged for downgrade because `20110761` names the seats with the European **i-Size** suffix ("Cloud T i-size", "Cloud G i-size") and a non-"Pro" "Cloud G", while production carries "Cloud T" and "Cloud G Pro Comfort Extend".

**First-party clarification (site owner) resolves it:** *"i-Size is only in Europe, so not relevant. In the US we have the Cloud Q, Cloud T and Cloud G."* i-Size is the European ECE R129 regulatory label for the **same** seat — not a distinct US product. The US Cybex Cloud lineup is **Cloud Q / Cloud T / Cloud G**, so:

- chart **"Cloud T i-size"** = US **Cloud T** (production `Cloud T`) — same seat, Euro regulatory label.
- chart **"Cloud G" / "Cloud G i-size"** = US **Cloud G** (production `Cloud G Pro Comfort Extend`, the verbose retail name for the single US Cloud G).

**Resolution: all 6 KEEP rows are retained as valid `MANUFACTURER_EXACT` same-seat matches; the proposed downgrade is withdrawn.** No audit row or count changed at any point. (The i-size suffix appears even on the **US** adapter doc `20110761` — Thule simply lists each seat's full regulatory name.) The tables below record the affected rows and their evidence.

**1 — Cybex `Cloud G Pro Comfort Extend` (production) vs chart `Cloud G`**

| compatibility_id | stroller | existing action / consumer | evidence URL | exact string in source | other source names it exactly? |
|---|---|---|---|---|---|
| `cms99ygg000adi76bp72bksyv` | Urban Glide 3 | KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER (basis MANUFACTURER_EXACT) | thule.com/…/1476111.pdf (`20110761`) | **"Cloud G"** / "Cloud G i-size" | No |
| `cms94m2g0006ri76bkv5bmw8d` | Urban Glide 3 Double | KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER (basis MANUFACTURER_EXACT) | thule.com/…/1476114.pdf (`20110763`) | **"Cloud G"** (mirror double list) | No |
| `cms6o9nnk001213vzxnnuy9a2` | Urban Glide 4-wheel | KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER (basis MANUFACTURER_EXACT) | thule.com/…/1476111.pdf (`20110761`) | **"Cloud G"** / "Cloud G i-size" | No |

The source names "Cloud G" / "Cloud G i-size"; production is "Cloud G Pro Comfort Extend". **Resolution:** the US Cybex lineup has a single Cloud G, so production "Cloud G Pro Comfort Extend" **is** that seat = chart "Cloud G". The 3 rows **remain KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER / MANUFACTURER_EXACT**. Catalogue-hygiene note (documented, not applied): the production string could be shortened to "Cloud G", parallel to the Cypress S → Cypress rename.

**2 — Cybex `Cloud T` (production, US) vs chart `Cloud T i-size`**

| compatibility_id | stroller | existing action / consumer | evidence URL | exact string in source | other source names it exactly? |
|---|---|---|---|---|---|
| `cms99ygfj00abi76bkj8k933j` | Urban Glide 3 | KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER (basis MANUFACTURER_EXACT) | thule.com/…/1476111.pdf (`20110761`) | **"Cloud T i-size"** | No |
| `cms94m2gr006wi76bq2eyyj7r` | Urban Glide 3 Double | KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER (basis MANUFACTURER_EXACT) | thule.com/…/1476114.pdf (`20110763`) | **"Cloud T i-size"** (mirror double list) | No |
| `cms6o9nnn001513vz0nduyqyn` | Urban Glide 4-wheel | KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER (basis MANUFACTURER_EXACT) | thule.com/…/1476111.pdf (`20110761`) | **"Cloud T i-size"** | No |

The source names the i-Size "Cloud T i-size"; production is US "Cloud T". **Resolution:** i-Size is the Europe-only ECE R129 label for the same seat, so US "Cloud T" **is** chart "Cloud T i-size". The 3 rows **remain KEEP_UPDATE / COMPATIBLE_WITH_ADAPTER / MANUFACTURER_EXACT**.

**Net effect: no change.** Thule stays **37 KEEP / 91 REMOVE / 6 VERIFY**; block **87 / 233 / 18 / 54**; consumer-visible **117**. The 6 Aton G2 / Aton G2 Swivel VERIFY rows are the separate **Aton**-series question (`20110761` names "Aton G", not "Aton G2") and are unaffected — they remain VERIFY.

## BOB Single-chart re-validation (no change to counts)

The user also supplied the first-party **BOB Gear *Single Stroller/Wagon Compatibility Chart for Adapters*, Jan 2024** (2-page grid, extracted to `TMBC_BTV_BOB_2024_Single_Chart_Crosswalk.csv`, 38 entries). Unlike Veer, this chart **confirmed the frozen BOB block with zero corrections** — because the BOB rows were already sourced from these exact BOB adapters. Result in `TMBC_BTV_BOB_Single_Freeze_Check_Diff.csv` (0 rows). BOB stays **26 KEEP / 61 REMOVE**, unchanged in V1.2 (no BOB row changed across V1 → V1.1 → V1.2; the overall block is now `BTV_FROZEN_V1.2`).

Adapter map read off the chart: Britax **Willow / Willow S / Willow SC / Cypress** and BOB **Champ** / Romer **Juni** → `S14664700` (Wayfinder) · `S943900` (Alterrain Pro / Alterrain / Revolution Flex 2016+/2.0/3.0 / Revolution Pro / Stroller Strides / Rambler — **Blaze, Ironman, and Sports Utility are blank for this newer-Britax/Champ/Juni group**) · `S14685500` (Renegade Wagon). The legacy seat groups below (B-Safe / Graco / Chicco / Peg / UPPAbaby MESA) are what cover Blaze / Ironman / Sports Utility, via their own mid adapters spanning Alterrain Pro → Sports Utility. Britax **B-Safe** legacy → `S12045300`; **Graco** SnugRide → `S12045400`; **UPPAbaby MESA** → `S12046600`; **Peg** → `S12045500`; **Chicco** → `S12045900`; **Cybex/Nuna/Maxi-Cosi** → `S12046000` (+ Wayfinder `S14664700`).

- **Every frozen BOB KEEP is either directly corroborated by the Jan 2024 chart or remains supported by newer first-party BOB evidence; the 2024 chart produced zero row-level corrections.** Directly corroborated (named verbatim on the Jan 2024 chart): Britax Willow S / Willow SC / Cypress (on Rev Flex 3.0, Alterrain Pro, Rambler, Renegade Wagon, Wayfinder), Chicco **KeyFit 30**, Peg Primo Viaggio 4-35 / Nido, Graco SnugRide SnugFit / SnugFit DLX. Not enumerated verbatim on this older chart but supported by BOB's newer/current pages: **Chicco KeyFit 30 ClearTex** (the chart names "KeyFit 30", not the ClearTex fabric variant), and some Graco (SnugRide **Lite LX**, SnugFit **LX**), where the current adapter states the broad "**All SnugRide models**" rule rather than the specific SnugRide models this Jan 2024 chart lists.
- **Every frozen REMOVE validated as chart-absent** — the chart's Cybex are Aton 2 / Cloud Q / Aton Q / Aton M (not our Aton G2 / Cloud T / Cloud G Pro); Nuna are Pipa / Pipa Lite / Pipa RX Lite (not our PIPA Aire / Aire rx / RX / urbn — "PIPA RX" ≠ "Pipa RX Lite"); Maxi-Cosi are Mico 30 / Max 30 / Max Plus / Coral XP (not our Ambra / Mico Luxe / Mico Pro / Peri 180); Chicco has no "KeyFit Max"; Peg has no "Lounge"; Graco is SnugRide-only (GoMax excluded).
- **Source precedence.** The Jan 2024 chart is excellent corroboration and adapter-SKU / generation evidence, but it is an *older* snapshot that enumerates specific SnugRide models; **current/newer BOB pages outrank it** — particularly for Graco and any later seat-list expansion. Where the two differ, the newer first-party page governs.
- **ADD candidates surfaced** (stocked seat, chart-listed, no BOB row — documented, not injected): Britax **Willow SC** on Alterrain Pro / Rambler / Renegade Wagon; Chicco **KeyFit 30** and Peg **Primo Viaggio 4-35 / Nido** on Alterrain Pro / Rambler (the chart's Chicco/Peg adapters span the mid singles, not Wayfinder/Renegade). (Chicco **KeyFit 30 ClearTex** is *not* named on this Jan 2024 chart — any ClearTex add would rest on newer first-party BOB evidence.)
- **Identity holds:** UPPAbaby chart lists generic "**MESA**"; production "**Mesa V3**" is not an explicit version match → REMOVE conservatively held (flagged `IDENTITY_REVIEW`).
- **Bounded item:** the **Revolution Flex 3.0 Duallie** (a *double*) keeps Britax Willow-family as REMOVE — the *Single* chart cannot speak to it; resolving it needs the BOB **Duallie/Double** chart.

### Crosswalk format — grouped source vs normalized source-transcription rows

Both chart crosswalks are **GROUPED SOURCE EXTRACTIONS** (one row per chart brand-group × seat, with the adapter cell and classification) — that is why the BOB crosswalk has 38 rows and the Veer crosswalk 44, far fewer than the underlying normalized rows. Each expands **deterministically** into one row per chart-supported `stroller/platform × seat × adapter` relationship. Both normalized files carry a `pair_type` column (`EXACT_SOURCE_PAIR` / `FAMILY_OR_SYSTEM_CLAIM` / `COMBINED_SOURCE_ENTRY`), so they are **typed source transcriptions**, not blanket "exact pairs":

- **`TMBC_BTV_BOB_2024_Single_Chart_NormalizedPairs.csv` — 446 chart-supported pair rows** across **11 stroller columns and 52 source seat entries** (446 is the *supported subset*, not the 11 × 52 = 572 Cartesian product — many stroller×seat cells are blank on the chart). Deterministic rule: the *newer-Britax/Champ/Juni* group → Wayfinder `S14664700`, Alterrain Pro/Alterrain/Revolution Flex/Revolution Pro/Stroller Strides/Rambler `S943900`, Renegade `S14685500` (Blaze/Ironman/Sports Utility blank); the *legacy seat groups* (B-Safe `S12045300`, Graco `S12045400`, UPPAbaby MESA `S12046600`, Peg `S12045500`, Chicco `S12045900`) → Alterrain Pro→Sports Utility (mid, incl. the legacy joggers), Wayfinder/Renegade blank; *Cybex/Nuna/Maxi-Cosi* → Wayfinder `S14664700` + Alterrain Pro→Rambler `S12046000` (+ Renegade `S14685500` for Cybex Aton 2/Cloud Q/Aton Q and Nuna). No identities were fanned out (seat names kept verbatim — e.g. `KeyFit 30`, not ClearTex; `Aton Q & M` kept as one entry).
- **`TMBC_BTV_Veer_2024_Guide_NormalizedPairs.csv` — 230 normalized source-transcription rows** (176 `EXACT_SOURCE_PAIR` + 48 `FAMILY_OR_SYSTEM_CLAIM` + 6 `COMBINED_SOURCE_ENTRY`). The four chart columns expand to six platforms (`Cruiser & Cruiser City` → Cruiser + Cruiser City; `Cruiser XL & Cruiser City XL` → Cruiser XL + Cruiser City XL; `&Roll`; `&Jog`), each carrying its column's seat list (39 seats on the four Cruiser platforms, 37 on &Roll/&Jog — Peg Perego is Cruiser-only). The `condition` column carries the † seat-back-folded note on exactly the 12 Willow/Willow S/Willow SC × Cruiser rows; **Cypress carries no dagger**.

## What changed vs. the prior pass

**BOB — was 0 KEEP / 64 REMOVE / 23 VERIFY → now 26 KEEP / 61 REMOVE / 0 VERIFY.**
The prior pass had no exact BOB lists and removed every newer Britax seat. The current BOB Gear adapter pages prove otherwise:
- **12 Britax rows flipped REMOVE → KEEP.** The current Single Britax ClickTight adapter (S943900) lists **Willow / Willow S / Willow SC / Cypress** and fits Revolution Flex 3.0, Alterrain Pro, Rambler; the Wayfinder (S14664700) and Renegade Wagon (S14685500) adapters list the same Willow family. So Willow S/SC/Cypress on those five chassis are genuinely compatible.
- **6 Graco rows flipped REMOVE → KEEP.** The BOB Graco adapter states **"All SnugRide models,"** so SnugRide SnugFit / SnugFit DLX / SnugFit LX are covered (GoMax is not a SnugRide → stays REMOVE).
- **8 VERIFY resolved to KEEP** (Chicco KeyFit 30 + KeyFit 30 ClearTex, Graco SnugRide Lite LX, Peg Perego Primo Viaggio 4‑35 + Nido — single and Duallie where an adapter exists).
- **15 VERIFY resolved to REMOVE**, the important ones being **every Nuna PIPA RX row** (no BOB adapter lists PIPA RX — all list only *Pipa / Pipa Lite*), **Chicco KeyFit Max** variants (BOB Chicco adapter lists KeyFit 30/30 Zip/Zip Air/Magic/Fit2/KeyFit 35, not "Max"), **Clek** (BOB makes no Clek adapter), **UPPAbaby Aria** (adapter lists MESA only), and **Peg Perego Primo Viaggio Lounge** (not listed).

**Thule — was 9 KEEP / 29 REMOVE / 92 VERIFY / 4 PENDING → now 37 KEEP / 91 REMOVE / 6 VERIFY / 0 PENDING.**
- **3 prior KEEP rows corrected to REMOVE:** Chicco **KeyFit Max** on Urban Glide 4‑wheel. Thule's Universal/Chicco adapter (20110762) enumerates Chicco through **KeyFit 35 — never "KeyFit Max."**
- **31 VERIFY resolved to KEEP** using the current per‑stroller approved lists. The newest adapters (20110761/762/763/764, US 2024) DO list the newer seats: **Cybex Cloud T, Maxi‑Cosi Mico Luxe & Peri 180, Nuna PIPA RX / PIPA Aire RX / PIPA Aire, Clek Liing/Liingo, Cybex Cloud G** all fit Urban Glide 3 / 4‑wheel / 3 Double.
- **55 VERIFY resolved to REMOVE.** The **older strollers** carry **older approved lists**: Sleek (11000300), Shine (11400502/503), and Spring 2 (11300410/411) do **not** list Cloud T, Mico Luxe, Peri 180, PIPA Aire/urbn, Ambra, Mico Pro/XP, or KeyFit Max. Both Shine and Spring 2 *do* list **PIPA RX** (KEEP). **Clek Liing/Liingo is on the Shine list (KEEP) but NOT on Spring 2 (REMOVE)** — so Spring 2's only KEEPs among these production rows are Chicco KeyFit 30, KeyFit 30 ClearTex, and Nuna PIPA RX, while Shine also keeps Clek Liing/Liingo.
- **29 REMOVE confirmed** against the legacy chart: Glide 2 / Urban Glide 2 / UG2 Double use adapter **51100941**, whose approved list predates all the 2023‑2025 seats production fanned onto them.
- **4 PENDING resolved:** see identity, below.

**Veer — full progression: V1 24 / 93 / 0 / 54 → V1.1 36 / 81 / 0 / 54 → V1.2 24 / 81 / 12 / 54 (KEEP / REMOVE / VERIFY / EXCLUDE).** The V1 evidence-completion pass completed Veer provenance and set the **6 `Switch&Jog Jogging` KEEP rows to REMOVE** as duplicate-record rows (alias of `Switch&Jog` — the same six compatible pairs remain on the canonical record). **V1.1** then flipped +12 REMOVE → KEEP (Britax Willow S / Willow SC / Cypress on the four Veer Cruiser records) from the Nov 2024 Veer guide. **V1.2** reversed those same 12 to **VERIFY / `SOURCE_REVISION_CONFLICT`** once the current Veer adapter pages showed no Cruiser adapter documents the newer Britax family (see the SOURCE_REVISION_CONFLICT section). Cypress identity resolved (below).

## The 18 VERIFY rows (6 Thule Aton G2 + 12 Veer Cruiser Britax)

**18 audit `VERIFY` rows in V1.2, from two distinct causes:** (a) **12 Veer Cruiser × {Willow S, Willow SC, Cypress}** — the `SOURCE_REVISION_CONFLICT` (guide lists them on the Cruiser; no current Cruiser adapter documents them — see that section above); and (b) **6 Thule Cybex Aton G2 / Aton G2 Swivel**, detailed here.

The **6 Thule VERIFY** are **Cybex Aton G2 / Aton G2 Swivel** on **Urban Glide 3 single, Urban Glide 4‑wheel, Urban Glide 3 Double**. Thule's current charts list Cybex **"Aton G"** (plus Aton 2/Q/S2, Cloud G/T/Z/Z2) but not the **"Aton G2"** 2024 refresh by name. The seat is almost certainly the same-footprint successor, but Thule has not published it on the approved list, so this cannot be asserted as KEEP without Thule confirming the Aton G entry covers Aton G2. Row metadata references the correct per‑chassis adapter: the four single‑stroller rows cite **20110761 / 1476111.pdf**; the two **Urban Glide 3 Double** rows cite **20110763 / 1476114.pdf**. **Missing evidence: Thule's confirmation (or an updated chart) that "Aton G" includes Aton G2 / Aton G2 Swivel.**

## Identity / canonicalization resolved

- **Britax "Cypress S" = Britax "Cypress."** Britax sells no seat named "Cypress S" (its ClickTight infant seat is **Cypress**; only Willow has S / SC variants — confirmed on us.britax.com and Veer's own manual, which lists "Cyprus"). Production's "Cypress S" is a mislabel → canonicalize to **Cypress** on every affected row. The identity fix is action-aware: **Cypress S is KEEP where the chassis is confirmed** — BOB ClickTight/Wayfinder/Renegade and Veer **Switchback (&Roll/&Jog)**. On the **four Veer Cruiser records** it is **currently `VERIFY` / `SOURCE_REVISION_CONFLICT`, not KEEP** (V1.1 briefly flipped Willow S / Willow SC / Cypress there to KEEP; V1.2 reversed them to VERIFY — no current Cruiser adapter documents the newer Britax family). Cypress S rows on the Veer **accessory** records (Comfort Seat / Nap System) remain **EXCLUDE_PRODUCT**. No REMOVE/EXCLUDE row asserts "KEEP stands."
- **Thule Urban Glide 4‑wheel = Urban Glide 4‑Wheel Single Child.** One chassis, two records. The 4 duplicate‑record rows are set REMOVE (canonicalize; compatibility lives on the canonical Urban Glide 4‑wheel record), clearing the 4 PENDING.
- **Veer Switch&Jog = Switch&Jog Jogging** — one chassis, two records (alias). Handled identically to the Thule duplicate: the **6 duplicate rows on `Switch&Jog Jogging` are set REMOVE** (canonicalize; the six compatible pairs remain on canonical `Switch&Jog`). This is an identity dedup, **not** a manufacturer incompatibility.

## Exact manufacturer sources applied

**BOB Gear (bobgear.com), current adapter pages + Jan 2025 chart:**

| Adapter | SKU | Key seats |
|---|---|---|
| Single Britax ClickTight | S943900 | Champ, Willow, Willow S, Willow SC, Cypress (Alterrain/Alterrain Pro/Revolution Flex 3.0/Rambler) |
| Wayfinder | S14664700 | Willow family + Cypress, Cybex Aton 2/Cloud Q/Aton M, Maxi‑Cosi Mico 30/Mico Max 30/Coral XP/Mico Max Plus, Nuna Pipa/Pipa Lite (Wayfinder only) |
| Renegade Wagon | S14685500 | Willow family + Cypress, Cybex Aton 2/Aton Q/Cloud Q, Nuna Pipa/Pipa Lite |
| Single Chicco | S12045900 | KeyFit 30/30 Zip/Zip Air/Magic, Fit2, KeyFit 35 |
| Single Graco | S12045400 | **All SnugRide models** |
| Single Cybex/Maxi‑Cosi/Nuna | S12046000 | Cybex Aton 2/Cloud Q; Maxi‑Cosi Mico 30/Mico Max 30/Coral XP/Mico Max Plus; Nuna Pipa/Pipa Lite |
| Single Peg Perego | S12045500 | Primo Viaggio 4‑35, 4‑35 Nido |
| Single UPPAbaby | S12046600 | MESA (only) |
| Duallie Chicco / Graco / Britax | S02984700 / S02984500 / S02984600 | KeyFit family / All SnugRide / **legacy B‑Safe only (no Willow/Cypress)** |

**Thule (thule.com "approved" fit charts):**

| Adapter | SKU | Source PDF | Notes |
|---|---|---|---|
| UG3 / UG4 – Maxi‑Cosi | 20110761 | 1476111.pdf (US Feb 2024) | adds Cloud T, Mico Luxe, Peri 180, PIPA RX/Aire RX/Aire |
| UG3 / UG4 – Universal/Chicco | 20110762 | 1476112.pdf | Chicco → KeyFit 35 (no Max); UPPAbaby Mesa V2/Mesa Max/Aria; Clek Liing/Liingo; Graco SnugRide 35 Lite LX |
| UG3 Double – MC / Universal | 20110763 / 20110764 | 1476114.pdf / 1476115.pdf | mirror the singles |
| Sleek – Maxi‑Cosi | 11000300 | 643095.pdf | older list; excludes Cloud T/Mico Luxe/Peri 180/PIPA Aire/RX |
| Shine – Maxi‑Cosi / Chicco | 11400502 / 11400503 | 1205150.pdf | has Clek + PIPA RX; excludes Cloud T/Mico Luxe/Peri 180/PIPA Aire |
| Spring – Maxi‑Cosi / Chicco | 11300410 / 11300411 | 783859.pdf | has PIPA RX; excludes newer Cybex/Maxi‑Cosi & Clek |
| Glide / Urban Glide 1&2 (legacy) | 51100941 | 514848.pdf | pre‑2023 list; excludes every newer seat |

**Veer (support.goveer.com first-party adapter manuals, Nov 2024 fit lists):**

| Adapter | Source | Key seats |
|---|---|---|
| Cruiser — Cybex/Maxi‑Cosi/Nuna/Clek | 479577 | Nuna PIPA aire RX / RX / lite lx / lite / PIPA; Cybex Aton Q & M; Maxi‑Cosi Mico Max 30/Mico 30/Nxt/Mico AP; Clek Liing (Cloud Q NOT compatible) |
| Cruiser — Graco/Britax/UPPAbaby | 479257 | Graco Click Connect/SnugLock family; **Britax LEGACY pre-2024 only** (B-Safe 35/Elite/Ultra/Gen2/Gen2 FlexFit/FlexFit+/Endeavour/Chaperone); UPPAbaby Mesa/Mesa V2/Mesa Max/Aria. **Current page (updated ~22 days ago) does NOT list Willow/Willow S/Willow SC/Cypress** — the earlier V1.1 attribution of the newer Britax family to 479257 is retracted (SOURCE_REVISION_CONFLICT). |
| Switchback (&Roll/&Jog) — Maxi‑Cosi/Nuna/Clek/Cybex | 532224 | same Nuna/Maxi‑Cosi/Cybex/Clek list **plus newer Britax Cypress/Willow/Willow S/Willow SC** |
| Switchback — UPPAbaby | 537495 | UPPAbaby Mesa/Mesa V2/Mesa Max/Aria |
| Switchback — Britax (legacy) | 510552 | B‑Safe family only — explicitly NOT Cypress/Willow (those use 532224) |

Every KEEP_UPDATE row (all three brands) carries its exact `manufacturer_source_url`. BOB + Thule KEEP rows also carry the exact `adapter_sku`; Veer publishes no numeric SKU on its manuals, so those rows use `SKU_NOT_PUBLISHED` with the first-party manual URL as evidence. The Veer manuals also confirm the **Britax "Cypress"** listing (spelled "Cyprus" on Veer's page), corroborating the production "Cypress S" → "Cypress" canonicalization.

## Add candidates (`TMBC_Compatibility_Add_Candidates_BOB_Thule_Veer.csv`)

The ADD file contains **exact stroller × seat pairs only** (no placeholders, no "(various)") — **7 rows** (4 BOB Champ + 3 Thule Charm). Each row is oriented `stroller_model` = chassis, `car_seat_model` = infant seat.
- **BOB Champ** (4): × Revolution Flex 3.0 / Alterrain Pro / Rambler (ADAPTER S943900), and × Wayfinder (INCLUDED, Wayfinder Pack). Champ is on the ClickTight adapter's seat list but absent from the CarSeat catalogue — the native BOB travel‑system path. (BOB Champ is the *car seat*; the reversal seen in earlier prose was prose-only — the CSV is correctly oriented.)
- **Thule Charm** (3): × Maxi‑Cosi Peri 180 / Nuna PIPA Aire RX / Nuna PIPA RX (ADAPTER 11500701, SOLD_SEPARATELY) — the only entries on the first-party Charm 11500701 fit chart that exactly match the US CarSeat catalogue. The Charm chassis itself must be added first (see catalogue gaps).

## Catalogue / research follow-up (NOT compatibility rows)

- **Thule Charm — closed.** The first-party 11500701 fit chart (US May 2026) was retrieved and extracted exactly into `TMBC_BTV_Thule_Charm_Crosswalk.csv` (29 entries): 3 EXACT_CANONICAL_US_MATCH → 3 Charm ADD rows; 7 US_CATALOGUE_GAP; 4 IDENTITY_REVIEW_REQUIRED (Willow, Cloud T i-size, Cloud G i-size, Coral — **not** aliased to Willow S/SC, Cloud T, Cloud G Pro, Coral XP); 15 NON_US/i-Size (excluded). Canonical chassis = **Thule Charm** ("Charm 2 in 1"); bundle/color SKUs 11500502/504/506 are **one** chassis, not three. The chart **also lists Cybex Aton‑G**, a second first-party Thule source confirming Aton G belongs in the catalogue as a real archived seat (still nothing about G2). Catalogue gaps in `TMBC_BTV_Catalogue_Gaps.csv`.

## Consumer compatibility layer (`consumer_compatibility_status` — derived, additive)

The audit `audit_action` (evidence/database decision) is kept separate from the consumer-facing category. A `REMOVE` almost always means *"this exact seat is not named on the manufacturer's published list,"* which is **not** the same as the manufacturer saying the pairing is incompatible. So a second, derived field maps each row into the four-category consumer system **without changing any audit decision underneath**:

| `audit_action` | derived `consumer_compatibility_status` | rule |
|---|---|---|
| KEEP_UPDATE + attachment component | **COMPATIBLE_WITH_ADAPTER** | adapter/bumper/ring required; exact seat named on the adapter |
| KEEP_UPDATE + no attachment | **DIRECTLY_COMPATIBLE** | direct click-in |
| VERIFY or REMOVE **with a proven `lineage_source_url`** (and basis ≠ `SOURCE_REVISION_CONFLICT`) | **SHOULD_WORK_UNVERIFIED** | see the evidence model + mechanical rule below |
| any row with basis **`SOURCE_REVISION_CONFLICT`** | **UNKNOWN (locked)** | conflict veto — see below; may **not** be promoted to SHOULD_WORK |
| REMOVE, manufacturer **affirmatively excludes** it | **NOT_COMPATIBLE** | e.g. "Cybex Cloud Q NOT compatible" (none in this slice) |
| REMOVE, no proven lineage & no affirmative negative | **UNKNOWN** | absence of evidence, not evidence of absence |
| REMOVE, duplicate/bad identity | **IDENTITY_DEDUP** | canonical record carries the pair; no consumer result |
| EXCLUDE_PRODUCT | **EXCLUDED_PRODUCT** | accessory, not a stroller; no consumer result |

> **Conflict veto (binding on the importer).** `SOURCE_REVISION_CONFLICT` **overrides lineage inference.** A row with unresolved contradictory *current* manufacturer evidence remains **`VERIFY` + `UNKNOWN`** and may **not** become `SHOULD_WORK_UNVERIFIED` — even if a `lineage_source_url` exists — until the conflict is **affirmatively resolved** by a current first-party source. (Applies to the 12 Veer Cruiser × Britax rows.)

**Evidence model (`consumer_status_basis`) — SHOULD_WORK requires *proven* attachment lineage, not "several related seats on one adapter."** The fact that an adapter lists PIPA + PIPA Lite does not, by itself, document that a later PIPA-branded carrier uses the same stroller-side attachment — that is still family inference, just narrower. A row therefore qualifies as SHOULD_WORK only with an affirmative source:

| `consumer_status_basis` | requirement |
|---|---|
| `MANUFACTURER_EXACT` | exact stroller × exact seat confirmation (these are the KEEP rows) |
| `DOCUMENTED_SUCCESSOR_SAME_INTERFACE` | manufacturer documents the successor **and** an unchanged attachment interface |
| `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` | manufacturer explicitly documents both seats sharing attachment geometry/platform |
| `MANUFACTURER_PLATFORM_GROUP` | manufacturer explicitly defines a compatibility family that contains the exact seat |
| `NONE` | everything else → UNKNOWN |

Proof is kept separate from guess. `consumer_status_basis` is **proof-only** (values above); a separate audit column **`lineage_hypothesis_type`** (`SUSPECTED_*`/`NONE`) holds the pre-proof guess so nothing labelled "DOCUMENTED" ever overstates the evidence. Three columns carry the proof: **`lineage_anchor_model`** + **`lineage_anchor_compatibility_id`** (the anchor must be a real KEEP/`MANUFACTURER_EXACT` row on the **same** canonical stroller/adapter — not a name on a PDF) and **`lineage_source_url`**. **Mechanical rule:** `SHOULD_WORK_UNVERIFIED` requires a strong basis **+** a valid anchor id **+** a source that affirmatively proves the stroller-side attachment. Any blank → `UNKNOWN`.

**Applied to BTV (anchor validation + sourcing + a first-party correction pass — see `TMBC_BTV_Lineage_QA.md`).** The 16 word-share rows (KeyFit Max, Peg Lounge) were downgraded. Of the remaining 113 provisional candidates, **anchor validation dropped 80** that had no in-dataset KEEP anchor on the same stroller (every Cybex Aton G2/G2 Swivel; every UPPAbaby Mesa V3; all BOB Nuna/Mico/Cloud). Of the **33 valid-anchored** survivors, first-party sourcing **promoted 30** to SHOULD_WORK:
- **Nuna PIPA Aire / PIPA Aire RX / PIPA urbn** (21) → `MANUFACTURER_PLATFORM_GROUP` — Nuna documents the adapter fits "any PIPA series" seat, and the PIPA urbn page states it "pairs with all Nuna strollers designed for PIPA series car seats" (its baseless design is a *vehicle*-install trait, not a stroller-attachment one).
- **UPPAbaby Aria V2** (6) → `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` — UPPAbaby adapter "compatible with all Aria models."
- **Maxi-Cosi Mico XP** (3) → `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` — the Maxi-Cosi Zelia stroller adapter lists Mico XP + Mico XP Max + Mico Luxe (the KEEP anchor) on the same adapter.

Held back: **Maxi-Cosi Mico Pro** (3) → source-pending — a **real** current seat (IC418; the earlier "not a real model" finding was wrong), but no first-party *stroller* adapter names it sharing attachment with Mico Luxe (shared *vehicle* base rejected). **Catalogue gap:** Cybex **Aton G** is a real legacy CYBEX seat (now discontinued, replaced by G2), absent from the CarSeat table; it is on the Thule 20110761/763 lists, so cataloguing it would make Thule × Aton G a `MANUFACTURER_EXACT` anchor. The **6 Aton G2 rows stay VERIFY** (Thule does not name G2). See `TMBC_BTV_Catalogue_Gaps.csv`.

**Distribution across the 392 rows** (`BTV_FROZEN_V1.2` audit_action totals: KEEP 87 · REMOVE 233 · VERIFY 18 · EXCLUDE 54):

| consumer_compatibility_status | rows | surfaced to parents? |
|---|--:|---|
| DIRECTLY_COMPATIBLE | 0 | yes |
| COMPATIBLE_WITH_ADAPTER | 87 | yes (manufacturer-verified) |
| SHOULD_WORK_UNVERIFIED | **30** | yes (Nuna PIPA Aire/Aire RX/urbn 21 + UPPAbaby Aria V2 6 + Maxi-Cosi Mico XP 3, first-party lineage sourced) |
| NOT_COMPATIBLE | 0 | yes (no affirmative exclusion in this slice) |
| UNKNOWN | 202 | no public assertion — incl. the 12 Cruiser × Britax SOURCE_REVISION_CONFLICT rows + 3 valid candidates source-pending (Maxi-Cosi Mico Pro) + 80 invalid-anchor |
| IDENTITY_DEDUP | 19 | no (Switch&Jog Jogging 15 + UG4 Single Child 4) |
| EXCLUDED_PRODUCT | 54 | no |

**Frozen BTV numbers (`BTV_FROZEN_V1.2`):** **87 manufacturer-verified compatible · 30 lineage-sourced Should Work · 0 manufacturer-confirmed incompatible · 54 excluded products · 19 identity dedups · 18 unresolved rows** (audit `VERIFY` = 6 Thule Aton G2 + 12 Veer Cruiser Britax SOURCE_REVISION_CONFLICT). **117 rows are consumer-visible** (87 + 30). 3 valid candidates (Maxi-Cosi Mico Pro) remain source-pending; the "113 candidate" count fell to 33 valid anchors → 30 promoted (candidate totals are allowed to fall as anchor validation proves some were never valid).

## Materialization guardrail (for the importer — `audit_action` ≠ delete)

**`audit_action = REMOVE` must not mean "delete this pairing everywhere."** In this slice 30 REMOVE rows are confirmed SHOULD_WORK (lineage-sourced) and must be preserved as unverified consumer pairings. The importer/materialization layer must branch on **both** fields:

| audit_action | consumer_compatibility_status | production treatment |
|---|---|---|
| KEEP_UPDATE | DIRECTLY_COMPATIBLE / COMPATIBLE_WITH_ADAPTER | retain/update **verified** pairing |
| REMOVE | SHOULD_WORK_UNVERIFIED | drop as *verified*, **preserve/materialize as unverified consumer pairing** |
| REMOVE | UNKNOWN | remove from consumer results (no assertion) |
| REMOVE | NOT_COMPATIBLE | materialize as an **explicit negative** |
| REMOVE | IDENTITY_DEDUP | remove duplicate identity only (pair lives on canonical record) |
| VERIFY | SHOULD_WORK_UNVERIFIED | preserve as unverified pending resolution |
| VERIFY | UNKNOWN | **retain internally as an unresolved evidence state; do NOT surface to parents as compatible, Should Work, or incompatible** (the 6 Thule Aton G2 + 12 Veer Cruiser SOURCE_REVISION_CONFLICT rows) |
| EXCLUDE_PRODUCT | EXCLUDED_PRODUCT | exclude entirely |

Removing the **287 REMOVE+EXCLUDE rows** (233 + 54) leaves **105** in the audit layer (**87 KEEP + 18 VERIFY**) — that is **not** the consumer dataset. The consumer dataset **today is 117 surfaced relationships** (87 manufacturer-verified + 30 lineage-sourced Should Work); more can be added only as further candidates pass the lineage-source test.

## Net effect

Removing/excluding the **287 REMOVE+EXCLUDE rows** (233 + 54) would take the live BOB/Thule/Veer footprint from 392 to **105 rows**, of which **87 are on documented exact manufacturer lists** and **18 await confirmation** (6 Thule Aton G2 + 12 Veer Cruiser × Britax SOURCE_REVISION_CONFLICT). Merge by `compatibility_id` to preserve every other brand's decisions and the 2,312 total.
