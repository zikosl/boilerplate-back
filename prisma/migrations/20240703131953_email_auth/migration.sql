-- DropIndex
DROP INDEX "Event_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastRequest" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
