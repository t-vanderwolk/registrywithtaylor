CREATE TABLE "Media" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Post"
ADD COLUMN "featuredImageId" TEXT;

CREATE INDEX "Post_featuredImageId_idx" ON "Post"("featuredImageId");

ALTER TABLE "Post"
ADD CONSTRAINT "Post_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "_PostMedia" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_PostMedia_AB_unique" ON "_PostMedia"("A", "B");
CREATE INDEX "_PostMedia_B_index" ON "_PostMedia"("B");

ALTER TABLE "_PostMedia"
ADD CONSTRAINT "_PostMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PostMedia"
ADD CONSTRAINT "_PostMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
