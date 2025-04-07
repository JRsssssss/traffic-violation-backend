/*
  Warnings:

  - A unique constraint covering the columns `[violationId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Report_violationId_key" ON "Report"("violationId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_violationId_fkey" FOREIGN KEY ("violationId") REFERENCES "Violation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
