#!/usr/bin/env bash
# ============================================================================
#  TMBC Travel System Compatibility Tool — LIVE PRODUCTION EXPORT (READ-ONLY)
# ============================================================================
#  Every database statement below is a SELECT wrapped in COPY ... TO STDOUT.
#  There is no INSERT, UPDATE, DELETE, ALTER, DROP, TRUNCATE or COPY ... FROM
#  anywhere in this file. It cannot modify production data.
#
#  USAGE — pick ONE of these, then run the script from the repo root:
#
#    # A) Heroku CLI (easiest if you're logged in):
#    HEROKU_APP=your-heroku-app-name ./tmbc-live-audit-export.sh
#
#    # B) Direct connection string (Heroku: `heroku config:get DATABASE_URL -a <app>`):
#    PROD_DATABASE_URL="postgres://..." ./tmbc-live-audit-export.sh
#
#  Output: reports/live-audit/*.csv + *.json
# ============================================================================
set -uo pipefail

OUT="reports/live-audit"
SITE="${SITE:-https://www.taylormadebabyco.com}"
mkdir -p "$OUT"

echo "==> Output directory: $OUT"

# ---------------------------------------------------------------- SQL runner
run_sql() {
  local sql="$1" dest="$2" label="$3"
  if [ -n "${PROD_DATABASE_URL:-}" ]; then
    psql "$PROD_DATABASE_URL" -v ON_ERROR_STOP=1 --no-psqlrc -c "$sql" > "$dest" 2>"$OUT/.err"
  elif [ -n "${HEROKU_APP:-}" ]; then
    heroku pg:psql -a "$HEROKU_APP" -c "$sql" > "$dest" 2>"$OUT/.err"
  else
    echo "!! Set PROD_DATABASE_URL or HEROKU_APP first. See header of this script." >&2
    exit 1
  fi
  if [ $? -ne 0 ]; then
    echo "  xx $label FAILED — see $OUT/.err"; head -3 "$OUT/.err" >&2
  else
    echo "  ok $label -> $dest ($(wc -l < "$dest") lines)"
  fi
}

echo "==> 1/7  Stroller table (compatibility side)"
run_sql "COPY (
  SELECT id, brand, model, \"displayName\", summary,
         \"amazonUrl\", \"manualBabylistUrl\", \"imageUrl\",
         \"babylistSku\", \"babylistUrl\", \"babylistPrice\", \"babylistImage\",
         \"createdAt\", \"updatedAt\"
  FROM \"Stroller\"
  ORDER BY lower(brand), lower(model)
) TO STDOUT WITH CSV HEADER" "$OUT/db-stroller.csv" "Stroller"

echo "==> 2/7  CarSeat table (ALL seat types — seatType column included)"
run_sql "COPY (
  SELECT id, brand, model, \"displayName\", \"seatType\"::text AS seat_type, summary,
         \"amazonUrl\", \"manualBabylistUrl\", \"imageUrl\",
         \"babylistSku\", \"babylistUrl\", \"babylistPrice\", \"babylistImage\",
         \"createdAt\", \"updatedAt\"
  FROM \"CarSeat\"
  ORDER BY lower(brand), lower(model)
) TO STDOUT WITH CSV HEADER" "$OUT/db-carseat.csv" "CarSeat"

echo "==> 3/7  Compatibility table (joined to readable brand/model)"
run_sql "COPY (
  SELECT c.id,
         s.brand  AS stroller_brand,  s.model  AS stroller_model,  s.id AS stroller_id,
         cs.brand AS car_seat_brand,  cs.model AS car_seat_model,  cs.id AS car_seat_id,
         cs.\"seatType\"::text AS car_seat_type,
         c.\"compatibilityType\"::text AS compatibility_type,
         c.\"adapterRequired\" AS adapter_required,
         c.\"adapterType\"     AS adapter_type,
         c.confidence::text    AS confidence,
         c.notes,
         c.\"adapterBabylistUrl\" AS adapter_url,
         c.\"adapterPrice\"       AS adapter_price,
         c.\"adapterBabylistSku\" AS adapter_sku,
         c.\"createdAt\", c.\"updatedAt\"
  FROM \"Compatibility\" c
  JOIN \"Stroller\" s  ON s.id  = c.\"strollerId\"
  JOIN \"CarSeat\"  cs ON cs.id = c.\"carSeatId\"
  ORDER BY lower(s.brand), lower(s.model), lower(cs.brand), lower(cs.model)
) TO STDOUT WITH CSV HEADER" "$OUT/db-compatibility.csv" "Compatibility"

echo "==> 4/7  Affiliate catalog strollers that feed the tool's picker"
run_sql "COPY (
  SELECT p.id, p.provider, p.brand, p.title, e.\"canonicalBrand\", e.\"canonicalName\",
         e.\"tmbcCategory\", e.\"productType\", e.\"reviewStatus\"::text AS review_status,
         e.\"needsReview\" AS needs_review, p.\"isActiveInFeed\" AS active_in_feed,
         p.retailer, p.\"itemGroupId\", p.price, p.\"productUrl\"
  FROM \"AffiliateCatalogProduct\" p
  JOIN \"ProductEnrichment\" e ON e.\"rawProductId\" = p.id
  WHERE p.\"isActiveInFeed\" = true
    AND e.\"tmbcCategory\" = 'Strollers'
    AND e.\"needsReview\" = false
    AND e.\"reviewStatus\"::text NOT IN ('HIDDEN','NEEDS_REVIEW')
  ORDER BY lower(coalesce(e.\"canonicalBrand\", p.brand)), lower(p.title)
) TO STDOUT WITH CSV HEADER" "$OUT/db-catalog-strollers.csv" "catalog strollers"

echo "==> 5/7  Adapter products referenced by the tool"
run_sql "COPY (
  SELECT p.id, p.provider, p.brand, p.title, e.\"tmbcCategory\", e.\"productType\",
         p.price, p.\"affiliateUrl\", p.\"imageUrl\", p.\"isActiveInFeed\" AS active_in_feed
  FROM \"AffiliateCatalogProduct\" p
  LEFT JOIN \"ProductEnrichment\" e ON e.\"rawProductId\" = p.id
  WHERE p.title ILIKE '%adapter%' OR e.\"productType\" ILIKE '%adapter%'
  ORDER BY lower(coalesce(p.brand,'')), lower(p.title)
) TO STDOUT WITH CSV HEADER" "$OUT/db-adapters.csv" "adapters"

echo "==> 6/7  Reconciliation counts"
run_sql "COPY (
  SELECT 'Stroller' AS tbl, count(*)::text AS n FROM \"Stroller\"
  UNION ALL SELECT 'CarSeat (all)',        count(*)::text FROM \"CarSeat\"
  UNION ALL SELECT 'CarSeat (INFANT)',     count(*)::text FROM \"CarSeat\" WHERE \"seatType\" = 'INFANT'
  UNION ALL SELECT 'Compatibility (all)',  count(*)::text FROM \"Compatibility\"
  UNION ALL SELECT 'Compatibility DIRECT',      count(*)::text FROM \"Compatibility\" WHERE \"compatibilityType\" = 'DIRECT'
  UNION ALL SELECT 'Compatibility ADAPTER',     count(*)::text FROM \"Compatibility\" WHERE \"compatibilityType\" = 'ADAPTER'
  UNION ALL SELECT 'Compatibility LIMITED',     count(*)::text FROM \"Compatibility\" WHERE \"compatibilityType\" = 'LIMITED'
  UNION ALL SELECT 'Compatibility LOCKED',      count(*)::text FROM \"Compatibility\" WHERE \"compatibilityType\" = 'LOCKED'
  UNION ALL SELECT 'Compatibility INCOMPATIBLE',count(*)::text FROM \"Compatibility\" WHERE \"compatibilityType\" = 'INCOMPATIBLE'
) TO STDOUT WITH CSV HEADER" "$OUT/db-counts.csv" "counts"

echo "==> 7/7  Live public API snapshots (what the tool actually serves)"
curl -sS --compressed "$SITE/api/catalog/strollers" -o "$OUT/api-catalog-strollers.json" \
  && echo "  ok /api/catalog/strollers -> $OUT/api-catalog-strollers.json ($(wc -c < "$OUT/api-catalog-strollers.json") bytes)" \
  || echo "  xx /api/catalog/strollers failed"
curl -sS --compressed "$SITE/api/catalog/carseats" -o "$OUT/api-catalog-carseats.json" \
  && echo "  ok /api/catalog/carseats  -> $OUT/api-catalog-carseats.json ($(wc -c < "$OUT/api-catalog-carseats.json") bytes)" \
  || echo "  xx /api/catalog/carseats failed"

rm -f "$OUT/.err"
echo
echo "==> DONE. Files in $OUT:"
ls -la "$OUT"
echo
echo "Nothing was written to the database. Send me the $OUT folder contents."
