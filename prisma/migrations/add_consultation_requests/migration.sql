CREATE TABLE "ConsultationRequest" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "dueDate" TIMESTAMP,
  "city" TEXT,
  "babyNumber" TEXT,
  "message" TEXT,
  "status" TEXT DEFAULT 'new',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ConsultationResponse" (
  "id" SERIAL PRIMARY KEY,
  "consultationId" INTEGER UNIQUE NOT NULL,
  "adminMessage" TEXT NOT NULL,
  "meetingLink" TEXT,
  "scheduledTime" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ConsultationResponse_consultationId_fkey"
  FOREIGN KEY ("consultationId")
  REFERENCES "ConsultationRequest"("id")
  ON DELETE CASCADE
);
