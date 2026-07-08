/*
  Warnings:

  - The `currency` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CurrencyAllowed" AS ENUM ('USD');

-- AlterTable
ALTER TABLE "services" DROP COLUMN "currency",
ADD COLUMN     "currency" "CurrencyAllowed" NOT NULL DEFAULT 'USD';
