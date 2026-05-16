-- Alter media assets into a richer shared library
ALTER TABLE "MediaAsset"
  ADD COLUMN "uploadedById" TEXT,
  ADD COLUMN "thumbnailUrl" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "MediaAsset"
  ALTER COLUMN "articleId" DROP NOT NULL;

ALTER TABLE "MediaAsset" DROP CONSTRAINT "MediaAsset_articleId_fkey";

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "MediaAsset_uploadedById_idx" ON "MediaAsset"("uploadedById");
CREATE INDEX "MediaAsset_type_createdAt_idx" ON "MediaAsset"("type", "createdAt");
