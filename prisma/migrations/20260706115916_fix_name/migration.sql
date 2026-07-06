/*
  Warnings:

  - You are about to drop the `technicianCategorys` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "technicianCategorys" DROP CONSTRAINT "technicianCategorys_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "technicianCategorys" DROP CONSTRAINT "technicianCategorys_technicianId_fkey";

-- DropTable
DROP TABLE "technicianCategorys";

-- CreateTable
CREATE TABLE "technicianCategories" (
    "id" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technicianCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "technicianCategories_technicianId_idx" ON "technicianCategories"("technicianId");

-- CreateIndex
CREATE INDEX "technicianCategories_categoryId_idx" ON "technicianCategories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "technicianCategories" ADD CONSTRAINT "technicianCategories_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicianProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicianCategories" ADD CONSTRAINT "technicianCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
