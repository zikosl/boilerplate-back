-- AlterTable
ALTER TABLE "ClientTicket" ALTER COLUMN "status" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
