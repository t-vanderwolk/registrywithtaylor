UPDATE "CarSeat"
SET
  "model" = 'PIPA Aire',
  "displayName" = 'Nuna PIPA Aire'
WHERE LOWER("brand") = 'nuna'
  AND LOWER("model") = 'pipa lite rx';

UPDATE "Compatibility" AS compat
SET "notes" = REPLACE(compat."notes", 'PIPA Lite RX', 'PIPA Aire')
WHERE compat."notes" LIKE '%PIPA Lite RX%';
