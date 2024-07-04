-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "random" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientEvent" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL DEFAULT '',
    "lastname" TEXT NOT NULL DEFAULT '',
    "nin" TEXT NOT NULL DEFAULT '',
    "status" INTEGER NOT NULL DEFAULT 0,
    "eventId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "ClientEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- AddForeignKey
ALTER TABLE "ClientEvent" ADD CONSTRAINT "ClientEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientEvent" ADD CONSTRAINT "ClientEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
