/*
  Warnings:

  - You are about to drop the column `technicianId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `technicianCategories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "technicianCategories" DROP CONSTRAINT "technicianCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "technicianCategories" DROP CONSTRAINT "technicianCategories_technicianId_fkey";

-- DropIndex
DROP INDEX "bookings_technicianId_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "technicianId";

-- DropTable
DROP TABLE "technicianCategories";

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
