-- Reader votes on in-post polls (:::poll block). One row per vote, keyed by
-- (post slug, poll key). voterId is a random client id so a browser votes once.
CREATE TABLE IF NOT EXISTS "BlogPollVote" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "pollKey" TEXT NOT NULL,
  "optionIndex" INTEGER NOT NULL,
  "voterId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BlogPollVote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_blogpollvote_voter"
  ON "BlogPollVote" ("slug", "pollKey", "voterId");

CREATE INDEX IF NOT EXISTS "idx_blogpollvote_poll"
  ON "BlogPollVote" ("slug", "pollKey");
