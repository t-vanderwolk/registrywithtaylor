-- Free-tool usage log (Stroller Finder, Travel System Checker, Stroller Quiz).
-- One row per bot-filtered event: opened / selection / result_viewed. Powers the
-- admin dashboard's per-tool funnel. (Tool affiliate clicks live in OutboundClick.)
CREATE TABLE IF NOT EXISTS "ToolEvent" (
  "id" TEXT NOT NULL,
  "tool" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "kind" TEXT,
  "value" TEXT,
  "path" TEXT,
  "visitorHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ToolEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "idx_toolevent_tool_event_createdat"
  ON "ToolEvent" ("tool", "event", "createdAt");

CREATE INDEX IF NOT EXISTS "idx_toolevent_createdat"
  ON "ToolEvent" ("createdAt");
