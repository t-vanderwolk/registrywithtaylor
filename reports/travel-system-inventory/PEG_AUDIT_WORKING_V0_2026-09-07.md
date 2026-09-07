# PEG_AUDIT_WORKING_V0 - 2026-09-07

Scope: PEG/Peg Perego only, using the user's updated display rule.

## Rule Applied

- Display all manufacturer-named compatible seats.
- Display logical shared-adapter family seats when the manufacturer names any member of the Maxi-Cosi / Nuna / CYBEX / Clek adapter family.
- Do not display a logical match when the manufacturer explicitly marks that exact model incompatible.
- UPPAbaby Mesa and Aria versions are treated as one UPPAbaby infant-seat adapter family unless a manufacturer source excludes a model.

## First-Party Sources

- PEG IKCS0018, June 2026: Ypsi / Vivace / Switch adapter chart.
- PEG IKCS0030, June 2026: City Loop / City Loop Pro foldable adapter chart.
- PEG IKCS0026, rev.2 10/2023: Primo Viaggio adapter links on other-brand strollers; secondary only for this pass.

## Counts

- Source index rows: 3
- Normalized pair rows: 100
- Manufacturer-named compatible rows: 65
- Logical shared-adapter compatible rows: 10
- Explicit manufacturer-negative rows: 25
- Decision rows: 100
- Retail audit rows: 40

## Production Baseline

- PEG stroller rows in production snapshot: 9
- Relevant infant car seats in production snapshot: 23
- PEG-related compatibility rows in production snapshot: 50
- Chart chassis present in production: 3 of 5
- Chart chassis missing in production: Switch, City Loop Pro
- Chart/logical positive car-seat products missing: Cybex Aton G Pro

## Migration Impact

- Expected named Nuna trigger upserts: 12
- Expected Peri 180 incompatible guard upserts: 3
- Targeted existing chassis: City Loop, Vivace, YPSI
- Missing chassis not created by this migration: Switch, City Loop Pro

## Decision Counts

- ADD_INCOMPATIBLE_GUARD: 1
- DISPLAY_AS_COMPATIBLE: 20
- FIX_REMOVE_OR_MARK_INCOMPATIBLE: 2
- KEEP_OR_UPSERT_NAMED_NUNA_TRIGGER: 12
- MISSING_CAR_SEAT_PRODUCT: 15
- MISSING_STROLLER_PRODUCT: 40
- SURFACES_AFTER_NUNA_TRIGGER: 10

## Retail-Link Policy

- IKCS0018 adapter rows use Babylist product SKU 2428247.
- IKCS0030 has no Babylist/Amazon exact product in the production catalog snapshot; the app will use the Amazon search fallback instead of the hidden MacroBaby adapter.
- Retail audit status counts:
  - AMAZON_ALLOWED: 1
  - AUTHORIZED_RETAILER_FALLBACK_PUBLIC: 2
  - BABYLIST_ALLOWED: 8
  - FALLBACK_RETAILER_NOT_USED: 29

## QA

- PDF extraction assertions: PASS
- Normalized row count assertion: PASS
- Manufacturer-named positive row assertion: PASS
- Logical shared-adapter row assertion: PASS
- Explicit negative row assertion: PASS
- Peri guard target assertion: PASS from rollback production validation, 3 target rows.

## Discrepancies

- City Loop and YPSI currently expose Maxi-Cosi Peri 180 by shared-adapter inference even though PEG marks Peri 180 Rotating incompatible; migration blocks this.
- Vivace currently exposes only same-brand PEG seats; migration adds the named Nuna trigger rows so shared-family results can appear.
- Switch and City Loop Pro are source-named chart chassis but are missing from production product rows.
- Cybex Aton G Pro is source-named compatible but missing from production infant car-seat rows.
- Primo Viaggio Urban Mobility is a current PEG infant-seat gap from the broader PEG inventory audit; it is not added in this adapter-rule pass.
- Joie Gemm, Joie i-Level, Joie i-Gemm, and Joie Juva are explicit chart negatives and are absent from current production infant car-seat rows, so no production rows are added for them.

## Files

- TMBC_PEG_Source_Index_2026-09-07.csv
- TMBC_PEG_NormalizedPairs_2026-09-07.csv
- TMBC_PEG_Decision_Set_2026-09-07.csv
- TMBC_PEG_Retail_Link_Audit_2026-09-07.csv
