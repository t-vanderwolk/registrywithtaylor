# BTV_FROZEN_V1 — BOB · Thule · Veer travel-system compatibility (frozen block)

**Status: FROZEN.** Read-only audit block. Frozen from the 2026-08-24 production export after the evidence-completion, consumer-layer, and lineage passes. `audit_action` decisions in this block are final.

## Frozen snapshot (392 production rows)

| Layer | Value |
|---|---|
| audit_action | **87 KEEP_UPDATE · 245 REMOVE · 6 VERIFY · 54 EXCLUDE_PRODUCT** |
| consumer (surfaced) | **87 COMPATIBLE_WITH_ADAPTER + 30 SHOULD_WORK_UNVERIFIED = 117 consumer-visible** |
| consumer (internal) | 0 NOT_COMPATIBLE · 202 UNKNOWN · 19 IDENTITY_DEDUP · 54 EXCLUDED_PRODUCT |
| by brand (audit) | BOB 26/61/0 · Thule 37/91/6 · Veer 24/93/54 (KEEP/REMOVE/VERIFY) |

## Freeze rule (binding on future work)

Future work on this block **may only**:
1. **Add** newly documented compatibility — but only via (a) exact manufacturer confirmation (`MANUFACTURER_EXACT`) or (b) an anchor-validated candidate with an affirmative first-party **stroller-side attachment-lineage** source (`DOCUMENTED_SUCCESSOR_SAME_INTERFACE` / `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` / `MANUFACTURER_PLATFORM_GROUP`, each with a real same-stroller/same-adapter KEEP anchor + `lineage_source_url`); or
2. **Resolve** the 6 Thule Aton G2 `VERIFY` rows with affirmative first-party evidence.

Future work **must not**:
- regenerate or infer compatibility across this block from brand-wide, same-brand, or shared-Euro/"universal-adapter" rules;
- alias or fan out similar model names (predecessor→successor, i-Size→US, carrier-family word-share) without an affirmative attachment-lineage source;
- change any frozen `audit_action` decision or the 87/245/6/54 counts unless a genuine row-level error is proven;
- treat `REMOVE` as a blanket "delete everywhere" — the importer must branch on `audit_action × consumer_compatibility_status` (see the materialization guardrail in the reconciliation report).

## Bounded open items (documented, not evidence holes)

- **Thule Aton G2 / Aton G2 Swivel × {Urban Glide 3, Urban Glide 4-wheel, Urban Glide 3 Double} = 6 rows** — audit `VERIFY`, consumer `UNKNOWN`. Thule lists "Aton G" but not "Aton G2"; awaiting first-party confirmation the G2 carrier keeps the Aton G stroller attachment.
- **Maxi-Cosi Mico Pro = 3 valid-anchor rows** — `VALID_CANDIDATE_SOURCE_NOT_FOUND` (real seat IC418; no first-party stroller-adapter proof vs the Mico Luxe anchor; shared vehicle base rejected).
- **Catalogue gaps** (`TMBC_BTV_Catalogue_Gaps.csv`) — Cybex Aton G (real legacy seat, on two first-party Thule charts, missing from CarSeat table), Thule Charm chassis, and the Charm chart's US-gap/identity-review seats. These are **catalogue work, not compatibility claims**.

## Artifacts in this block

`TMBC_Compatibility_Row_Audit_BOB_Thule_Veer.csv` (392 rows, 31 cols) · `_Summary.csv` · `_Add_Candidates.csv` (7 exact pairs) · `BOB-THULE-VEER-RECONCILIATION.md` · `TMBC_BTV_Lineage_Candidates_Validated.csv` · `_Lineage_Sources.csv` · `_Lineage_Rejected_Evidence.csv` · `_Lineage_QA.md` · `TMBC_BTV_Thule_Charm_Crosswalk.csv` · `TMBC_BTV_Catalogue_Gaps.csv`.
