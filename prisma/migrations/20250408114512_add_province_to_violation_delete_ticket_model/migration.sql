/*
  Warnings:

  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_officerId_fkey";

-- AlterTable
ALTER TABLE "Violation" ADD COLUMN     "province" TEXT NOT NULL DEFAULT 'Unknown';

-- DropTable
DROP TABLE "Ticket";
