/*
  Warnings:

  - You are about to drop the `ClientEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientEvent" DROP CONSTRAINT "ClientEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ClientEvent" DROP CONSTRAINT "ClientEvent_userId_fkey";

-- DropTable
DROP TABLE "ClientEvent";

-- CreateTable
CREATE TABLE "ClientTicket" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL DEFAULT '',
    "lastname" TEXT NOT NULL DEFAULT '',
    "nin" TEXT NOT NULL DEFAULT '',
    "status" INTEGER NOT NULL DEFAULT 0,
    "eventId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "ClientTicket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientTicket" ADD CONSTRAINT "ClientTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTicket" ADD CONSTRAINT "ClientTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
