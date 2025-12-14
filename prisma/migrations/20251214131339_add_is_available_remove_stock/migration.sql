-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock";
