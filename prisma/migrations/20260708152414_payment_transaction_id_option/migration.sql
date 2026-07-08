/*
  Warnings:

  - The `currency` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `provider` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "transactionId" DROP NOT NULL,
DROP COLUMN "currency",
ADD COLUMN     "currency" "CurrencyAllowed" NOT NULL DEFAULT 'USD',
ALTER COLUMN "paymentMethod" DROP NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" "PaymentProvider" NOT NULL;
