CREATE TYPE "CarSeatType" AS ENUM ('INFANT', 'CONVERTIBLE', 'ALL_IN_ONE');
CREATE TYPE "CompatibilityType" AS ENUM ('DIRECT', 'ADAPTER', 'LIMITED', 'LOCKED', 'INCOMPATIBLE');
CREATE TYPE "CompatibilityConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

CREATE TABLE "Stroller" (
  "id" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "displayName" TEXT,
  "summary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Stroller_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Stroller_brand_model_key" ON "Stroller"("brand", "model");
CREATE INDEX "Stroller_brand_idx" ON "Stroller"("brand");

CREATE TABLE "CarSeat" (
  "id" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "displayName" TEXT,
  "seatType" "CarSeatType" NOT NULL DEFAULT 'INFANT',
  "summary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CarSeat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CarSeat_brand_model_key" ON "CarSeat"("brand", "model");
CREATE INDEX "CarSeat_brand_idx" ON "CarSeat"("brand");
CREATE INDEX "CarSeat_seatType_idx" ON "CarSeat"("seatType");

CREATE TABLE "Compatibility" (
  "id" TEXT NOT NULL,
  "strollerId" TEXT NOT NULL,
  "carSeatId" TEXT NOT NULL,
  "compatibilityType" "CompatibilityType" NOT NULL,
  "adapterRequired" BOOLEAN NOT NULL DEFAULT false,
  "adapterType" TEXT,
  "notes" TEXT,
  "confidence" "CompatibilityConfidence" NOT NULL DEFAULT 'HIGH',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Compatibility_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Compatibility_strollerId_carSeatId_key" ON "Compatibility"("strollerId", "carSeatId");
CREATE INDEX "Compatibility_strollerId_idx" ON "Compatibility"("strollerId");
CREATE INDEX "Compatibility_carSeatId_idx" ON "Compatibility"("carSeatId");
CREATE INDEX "Compatibility_compatibilityType_idx" ON "Compatibility"("compatibilityType");

ALTER TABLE "Compatibility"
ADD CONSTRAINT "Compatibility_strollerId_fkey"
FOREIGN KEY ("strollerId") REFERENCES "Stroller"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Compatibility"
ADD CONSTRAINT "Compatibility_carSeatId_fkey"
FOREIGN KEY ("carSeatId") REFERENCES "CarSeat"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

INSERT INTO "Stroller" ("id", "brand", "model", "displayName", "summary", "createdAt", "updatedAt")
VALUES
  ('bugaboo-fox-5', 'Bugaboo', 'Fox 5', 'Bugaboo Fox 5', 'Full-size everyday stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-butterfly', 'Bugaboo', 'Butterfly', 'Bugaboo Butterfly', 'Travel stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-donkey-6', 'Bugaboo', 'Donkey 6', 'Bugaboo Donkey 6', 'Convertible single-to-double stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-mixx-next', 'Nuna', 'MIXX next', 'Nuna MIXX next', 'Full-size modular stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-trvl-lx', 'Nuna', 'TRVL lx', 'Nuna TRVL lx', 'Compact travel stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v2', 'UPPAbaby', 'Cruz V2', 'UPPAbaby Cruz V2', 'Full-size everyday stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-vista-v2', 'UPPAbaby', 'Vista V2', 'UPPAbaby Vista V2', 'Convertible single-to-double stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v2', 'UPPAbaby', 'Minu V2', 'UPPAbaby Minu V2', 'Compact travel stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-balios-s-lux', 'CYBEX', 'Balios S Lux', 'CYBEX Balios S Lux', 'All-terrain modular stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-gazelle-s', 'CYBEX', 'Gazelle S', 'CYBEX Gazelle S', 'Convertible single-to-double stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-libelle', 'CYBEX', 'Libelle', 'CYBEX Libelle', 'Ultra-compact travel stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-reef-2', 'Silver Cross', 'Reef 2', 'Silver Cross Reef 2', 'Full-size modular stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-wave-3', 'Silver Cross', 'Wave 3', 'Silver Cross Wave 3', 'Convertible single-to-double stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-jet-5', 'Silver Cross', 'Jet 5', 'Silver Cross Jet 5', 'Travel stroller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "CarSeat" ("id", "brand", "model", "displayName", "seatType", "summary", "createdAt", "updatedAt")
VALUES
  ('bugaboo-turtle-air', 'Bugaboo', 'Turtle Air', 'Bugaboo Turtle Air by Nuna', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-turtle-one', 'Bugaboo', 'Turtle One', 'Bugaboo Turtle One by Nuna', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-pipa-rx', 'Nuna', 'PIPA RX', 'Nuna PIPA RX', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-pipa-lite-rx', 'Nuna', 'PIPA Lite RX', 'Nuna PIPA Lite RX', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-pipa-urbn', 'Nuna', 'PIPA urbn', 'Nuna PIPA urbn', 'INFANT', 'Baseless infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-aria', 'UPPAbaby', 'Aria', 'UPPAbaby Aria', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-mesa-max', 'UPPAbaby', 'Mesa Max', 'UPPAbaby Mesa Max', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-aton-g', 'CYBEX', 'Aton G', 'CYBEX Aton G', 'INFANT', 'Infant car seat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-glide-plus-360', 'Silver Cross', 'Glide Plus 360', 'Silver Cross Glide Plus 360', 'INFANT', 'Lie-flat infant carrier', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-dream-i-size', 'Silver Cross', 'Dream i-Size', 'Silver Cross Dream i-Size', 'INFANT', 'Infant carrier', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Compatibility" (
  "id",
  "strollerId",
  "carSeatId",
  "compatibilityType",
  "adapterRequired",
  "adapterType",
  "notes",
  "confidence",
  "createdAt",
  "updatedAt"
)
VALUES
  ('bugaboo-fox-5__bugaboo-turtle-air', 'bugaboo-fox-5', 'bugaboo-turtle-air', 'ADAPTER', true, NULL, 'Bugaboo says Fox 5 works with Turtle Air using the Bugaboo car seat adapter.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-fox-5__bugaboo-turtle-one', 'bugaboo-fox-5', 'bugaboo-turtle-one', 'ADAPTER', true, NULL, 'Bugaboo lists Fox 5 among Turtle One compatible strollers when you use the Bugaboo adapter.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-butterfly__bugaboo-turtle-air', 'bugaboo-butterfly', 'bugaboo-turtle-air', 'ADAPTER', true, NULL, 'Use the Butterfly car seat adapter for Turtle Air by Nuna.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-butterfly__bugaboo-turtle-one', 'bugaboo-butterfly', 'bugaboo-turtle-one', 'ADAPTER', true, NULL, 'Use the Butterfly car seat adapter for Turtle One by Nuna.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-butterfly__nuna-pipa-rx', 'bugaboo-butterfly', 'nuna-pipa-rx', 'ADAPTER', true, NULL, 'Bugaboo lists PIPA RX on the Butterfly adapter compatibility list.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-donkey-6__bugaboo-turtle-air', 'bugaboo-donkey-6', 'bugaboo-turtle-air', 'ADAPTER', true, NULL, 'The Donkey car seat adapter supports Turtle Air on Donkey 6.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bugaboo-donkey-6__bugaboo-turtle-one', 'bugaboo-donkey-6', 'bugaboo-turtle-one', 'ADAPTER', true, NULL, 'Bugaboo lists Turtle One across current Bugaboo stroller travel systems, including Donkey.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-mixx-next__nuna-pipa-rx', 'nuna-mixx-next', 'nuna-pipa-rx', 'ADAPTER', true, 'Included with stroller', 'MIXX next includes the ring adapter and Nuna says all PIPA infant car seats are compatible.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-mixx-next__nuna-pipa-lite-rx', 'nuna-mixx-next', 'nuna-pipa-lite-rx', 'ADAPTER', true, 'Included with stroller', 'MIXX next includes the ring adapter and Nuna says all PIPA infant car seats are compatible.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-mixx-next__nuna-pipa-urbn', 'nuna-mixx-next', 'nuna-pipa-urbn', 'ADAPTER', true, 'Included with stroller', 'MIXX next includes the ring adapter and Nuna says all PIPA infant car seats are compatible.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-trvl-lx__nuna-pipa-rx', 'nuna-trvl-lx', 'nuna-pipa-rx', 'DIRECT', false, NULL, 'TRVL lx connects directly with Nuna PIPA series seats and does not need adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-trvl-lx__nuna-pipa-lite-rx', 'nuna-trvl-lx', 'nuna-pipa-lite-rx', 'DIRECT', false, NULL, 'TRVL lx connects directly with Nuna PIPA series seats and does not need adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('nuna-trvl-lx__nuna-pipa-urbn', 'nuna-trvl-lx', 'nuna-pipa-urbn', 'DIRECT', false, NULL, 'TRVL lx connects directly with Nuna PIPA series seats and does not need adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v2__uppababy-aria', 'uppababy-cruz-v2', 'uppababy-aria', 'DIRECT', false, NULL, 'Aria attaches directly to the Cruz with no adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v2__uppababy-mesa-max', 'uppababy-cruz-v2', 'uppababy-mesa-max', 'DIRECT', false, NULL, 'Mesa Max attaches directly to the Cruz with no adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v2__nuna-pipa-rx', 'uppababy-cruz-v2', 'nuna-pipa-rx', 'ADAPTER', true, NULL, 'Use the Vista/Cruz Nuna adapter for PIPA RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v2__nuna-pipa-lite-rx', 'uppababy-cruz-v2', 'nuna-pipa-lite-rx', 'ADAPTER', true, NULL, 'Use the Vista/Cruz Nuna adapter for PIPA Lite RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-cruz-v2__nuna-pipa-urbn', 'uppababy-cruz-v2', 'nuna-pipa-urbn', 'ADAPTER', true, NULL, 'Use the Vista/Cruz Nuna adapter for PIPA urbn.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-vista-v2__uppababy-aria', 'uppababy-vista-v2', 'uppababy-aria', 'DIRECT', false, NULL, 'Aria attaches directly to the Vista with no adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-vista-v2__uppababy-mesa-max', 'uppababy-vista-v2', 'uppababy-mesa-max', 'DIRECT', false, NULL, 'Mesa Max attaches directly to the Vista with no adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-vista-v2__nuna-pipa-rx', 'uppababy-vista-v2', 'nuna-pipa-rx', 'ADAPTER', true, NULL, 'Use the Vista/Cruz Nuna adapter for PIPA RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-vista-v2__nuna-pipa-lite-rx', 'uppababy-vista-v2', 'nuna-pipa-lite-rx', 'ADAPTER', true, NULL, 'Use the Vista/Cruz Nuna adapter for PIPA Lite RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-vista-v2__nuna-pipa-urbn', 'uppababy-vista-v2', 'nuna-pipa-urbn', 'ADAPTER', true, NULL, 'Use the Vista/Cruz Nuna adapter for PIPA urbn.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v2__uppababy-aria', 'uppababy-minu-v2', 'uppababy-aria', 'ADAPTER', true, NULL, 'Minu V2 uses the UPPAbaby infant car seat adapter for Aria.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v2__uppababy-mesa-max', 'uppababy-minu-v2', 'uppababy-mesa-max', 'ADAPTER', true, NULL, 'Minu V2 uses adapters for Mesa Max.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v2__nuna-pipa-rx', 'uppababy-minu-v2', 'nuna-pipa-rx', 'ADAPTER', true, NULL, 'Use the Minu adapter for select Nuna seats, including PIPA RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v2__nuna-pipa-lite-rx', 'uppababy-minu-v2', 'nuna-pipa-lite-rx', 'ADAPTER', true, NULL, 'Use the Minu adapter for select Nuna seats, including PIPA Lite RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uppababy-minu-v2__nuna-pipa-urbn', 'uppababy-minu-v2', 'nuna-pipa-urbn', 'ADAPTER', true, NULL, 'Use the Minu adapter for select Nuna seats, including PIPA urbn.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-balios-s-lux__cybex-aton-g', 'cybex-balios-s-lux', 'cybex-aton-g', 'ADAPTER', true, 'Included with stroller', 'CYBEX says Balios S Lux works with all CYBEX infant seats using the included adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-balios-s-lux__nuna-pipa-rx', 'cybex-balios-s-lux', 'nuna-pipa-rx', 'ADAPTER', true, NULL, 'Use the Balios S Lux car seat adapter for PIPA RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-balios-s-lux__nuna-pipa-lite-rx', 'cybex-balios-s-lux', 'nuna-pipa-lite-rx', 'ADAPTER', true, NULL, 'Use the Balios S Lux car seat adapter for PIPA Lite RX.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-gazelle-s__cybex-aton-g', 'cybex-gazelle-s', 'cybex-aton-g', 'ADAPTER', true, 'Included with stroller', 'CYBEX says Gazelle S works with any CYBEX infant seat using the included adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cybex-libelle__cybex-aton-g', 'cybex-libelle', 'cybex-aton-g', 'ADAPTER', true, 'Included with stroller', 'CYBEX says Libelle works with all CYBEX infant seats using the included adapters.', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-reef-2__silver-cross-glide-plus-360', 'silver-cross-reef-2', 'silver-cross-glide-plus-360', 'ADAPTER', true, NULL, 'Silver Cross pairs Reef 2 with Glide Plus 360 for its current travel-system bundle.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-wave-3__silver-cross-glide-plus-360', 'silver-cross-wave-3', 'silver-cross-glide-plus-360', 'ADAPTER', true, NULL, 'Silver Cross pairs Wave 3 with Glide Plus 360 in its growing-family travel system bundle.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('silver-cross-jet-5__silver-cross-dream-i-size', 'silver-cross-jet-5', 'silver-cross-dream-i-size', 'ADAPTER', true, NULL, 'Jet 5 can be used with Dream i-Size using car seat adapters sold separately.', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
