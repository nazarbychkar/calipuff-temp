/*
  Warnings:

  - You are about to drop the column `color` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `potency` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "color",
DROP COLUMN "imageUrl",
DROP COLUMN "potency",
ADD COLUMN     "composition" TEXT,
ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "effect" TEXT,
ADD COLUMN     "hasStrongEffect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inhalationCount" TEXT,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "volume" TEXT;
