DELETE FROM "Compatibility"
WHERE "carSeatId" IN (
  SELECT "id"
  FROM "CarSeat"
  WHERE ("brand" = 'Silver Cross' AND "model" IN ('Dream i-Size', 'Glide Plus 360'))
     OR ("brand" = 'Stokke' AND "model" = 'PIPA')
);

DELETE FROM "CarSeat"
WHERE ("brand" = 'Silver Cross' AND "model" IN ('Dream i-Size', 'Glide Plus 360'))
   OR ("brand" = 'Stokke' AND "model" = 'PIPA');
