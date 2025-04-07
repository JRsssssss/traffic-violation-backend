-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "includePlate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeViolationType" BOOLEAN NOT NULL DEFAULT false;
