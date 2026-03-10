ALTER TABLE "User"
ADD COLUMN "name" TEXT,
ADD COLUMN "slug" TEXT,
ADD COLUMN "bio" TEXT,
ADD COLUMN "expertiseAreas" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "avatarUrl" TEXT;

ALTER TABLE "Post"
ADD COLUMN "readingTime" INTEGER,
ADD COLUMN "shareTitle" TEXT,
ADD COLUMN "shareDescription" TEXT;

CREATE TABLE "PostAuthor" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PostAuthor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");
CREATE UNIQUE INDEX "PostAuthor_postId_userId_key" ON "PostAuthor"("postId", "userId");
CREATE INDEX "PostAuthor_postId_idx" ON "PostAuthor"("postId");
CREATE INDEX "PostAuthor_userId_idx" ON "PostAuthor"("userId");

ALTER TABLE "PostAuthor"
ADD CONSTRAINT "PostAuthor_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "Post"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "PostAuthor"
ADD CONSTRAINT "PostAuthor_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

WITH normalized_users AS (
  SELECT
    "id",
    NULLIF(
      BTRIM(
        INITCAP(
          REGEXP_REPLACE(
            SPLIT_PART("email", '@', 1),
            '[._-]+',
            ' ',
            'g'
          )
        )
      ),
      ''
    ) AS display_name,
    NULLIF(
      REGEXP_REPLACE(
        LOWER(SPLIT_PART("email", '@', 1)),
        '[^a-z0-9]+',
        '-',
        'g'
      ),
      ''
    ) AS base_slug,
    ROW_NUMBER() OVER (
      PARTITION BY REGEXP_REPLACE(
        LOWER(SPLIT_PART("email", '@', 1)),
        '[^a-z0-9]+',
        '-',
        'g'
      )
      ORDER BY "createdAt", "id"
    ) AS slug_rank
  FROM "User"
)
UPDATE "User"
SET
  "name" = COALESCE("User"."name", normalized_users.display_name, "User"."email"),
  "slug" = COALESCE(
    "User"."slug",
    CASE
      WHEN normalized_users.base_slug IS NULL THEN NULL
      WHEN normalized_users.slug_rank = 1 THEN normalized_users.base_slug
      ELSE normalized_users.base_slug || '-' || normalized_users.slug_rank::TEXT
    END
  )
FROM normalized_users
WHERE normalized_users."id" = "User"."id";

UPDATE "User"
SET "slug" = 'author-' || SUBSTRING("id" FROM 1 FOR 8)
WHERE "slug" IS NULL;

UPDATE "Post"
SET
  "readingTime" = GREATEST(
    1,
    CEIL(
      GREATEST(
        COALESCE(
          ARRAY_LENGTH(
            REGEXP_SPLIT_TO_ARRAY(
              BTRIM(
                REGEXP_REPLACE(COALESCE("content", ''), '\s+', ' ', 'g')
              ),
              ' '
            ),
            1
          ),
          0
        ),
        0
      )::NUMERIC / 190.0
    )::INTEGER
  ),
  "shareTitle" = COALESCE("shareTitle", "seoTitle", "title"),
  "shareDescription" = COALESCE("shareDescription", "seoDescription", "excerpt");

INSERT INTO "PostAuthor" ("id", "postId", "userId", "role", "createdAt")
SELECT
  gen_random_uuid()::TEXT,
  post."id",
  post."authorId",
  'Primary Author',
  CURRENT_TIMESTAMP
FROM "Post" AS post
ON CONFLICT ("postId", "userId") DO NOTHING;
