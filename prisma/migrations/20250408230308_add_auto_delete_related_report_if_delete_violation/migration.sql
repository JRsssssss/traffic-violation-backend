-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_violationId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_violationId_fkey" FOREIGN KEY ("violationId") REFERENCES "Violation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
