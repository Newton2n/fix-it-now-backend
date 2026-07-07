-- CreateEnum
CREATE TYPE "UserActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "UserActiveStatus" NOT NULL DEFAULT 'ACTIVE';
