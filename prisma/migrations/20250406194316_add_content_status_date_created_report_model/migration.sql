/*
  Warnings:

  - Added the required column `content` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL;
