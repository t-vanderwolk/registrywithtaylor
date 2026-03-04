-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "featuredImage" TEXT;

-- CreateTable
CREATE TABLE "PostImage" (
  "id" SERIAL NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT,
  "postId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostImage_postId_createdAt_idx" ON "PostImage"("postId", "createdAt");

-- AddForeignKey
ALTER TABLE "PostImage"
ADD CONSTRAINT "PostImage_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
