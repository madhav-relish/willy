/*
  Warnings:

  - Changed the type of `type` on the `Integration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('GITHUB', 'DISCORD', 'SLACK');

-- AlterTable
ALTER TABLE "Integration" DROP COLUMN "type",
ADD COLUMN     "type" "IntegrationType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Integration_userId_type_key" ON "Integration"("userId", "type");
