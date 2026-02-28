-- CreateTable
CREATE TABLE "BookingEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "sourcePage" TEXT,
    "service" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "BookingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingEvent_createdAt_idx" ON "BookingEvent"("createdAt");

-- CreateIndex
CREATE INDEX "BookingEvent_type_createdAt_idx" ON "BookingEvent"("type", "createdAt");
