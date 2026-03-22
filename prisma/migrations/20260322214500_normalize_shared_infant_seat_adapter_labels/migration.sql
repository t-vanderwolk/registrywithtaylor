UPDATE "Compatibility" AS compat
SET "adapterType" = stroller."brand" || ' adapter for Maxi-Cosi / Nuna / CYBEX / Clek infant seats'
FROM "Stroller" AS stroller,
     "CarSeat" AS seat
WHERE compat."strollerId" = stroller."id"
  AND compat."carSeatId" = seat."id"
  AND compat."adapterRequired" = true
  AND LOWER(seat."brand") IN ('clek', 'cybex', 'maxi-cosi', 'nuna');
