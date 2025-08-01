import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReportService {
  public async createReport(
    content: string,
    status: string,
    violationId: number,
    officerId: number,
    includePlate: boolean,
    includeViolationType: boolean
  ): Promise<
    | {
        report: {
          id: number;
          content: string;
          status: string;
          dateCreated: Date;
          officerId: number;
          violationId: number;
          includePlate: boolean;
          includeViolationType: boolean;
        };
      }
    | { error: string }
  > {
    if (!status || !violationId || !officerId) {
      return { error: "All fields are required" };
    }

    const existingReport = await prisma.report.findFirst({
      where: { violationId: violationId },
    });
    if (existingReport) {
      return { error: "Report already exists" };
    }

    const violation = await prisma.violation.findUnique({
      where: { id: violationId },
    });
    if (!violation) {
      return { error: "Violation not found" };
    }

    const officer = await prisma.user.findFirst({
      where: { id: officerId, role: "Officer" },
    });
    if (!officer) {
      return { error: "Officer not found" };
    }

    try {
      const newReport = await prisma.report.create({
        data: {
          content,
          status,
          violationId,
          officerId,
          includePlate,
          includeViolationType,
        },
      });

      return {
        report: {
          id: newReport.id,
          content: newReport.content,
          status: newReport.status,
          dateCreated: newReport.dateCreated,
          officerId: newReport.officerId,
          violationId: newReport.violationId,
          includePlate: newReport.includePlate,
          includeViolationType: newReport.includeViolationType,
        },
      };
    } catch (error) {
      console.error("Error creating report:", error);
      return { error: "Internal server error" };
    }
  }

  public async getAllReports(): Promise<
    | {
        reports: {
          id: number;
          content: string;
          status: string;
          dateCreated: Date;
          officerId: number;
          violationId: number;
          includePlate: boolean;
          includeViolationType: boolean;
          officerName: string;
        }[];
      }
    | { error: string }
  > {
    try {
      const reports = await prisma.report.findMany({
        include: {
          officer: {
            select: {
              username: true,
            },
          },
        },
      });

      const formattedReports = reports.map((r) => ({
        id: r.id,
        content: r.content,
        status: r.status,
        dateCreated: r.dateCreated,
        officerId: r.officerId,
        violationId: r.violationId,
        includePlate: r.includePlate,
        includeViolationType: r.includeViolationType,
        officerName: r.officer?.username || "Unknown",
      }));

      return { reports: formattedReports };
    } catch (error) {
      console.error("Error getting all reports:", error);
      return { error: "Internal server error" };
    }
  }

  public async getReportByOfficerId(officerId: number): Promise<
    | {
        reports: {
          id: number;
          content: string;
          status: string;
          dateCreated: Date;
          officerId: number;
          violationId: number;
          includePlate: boolean;
          includeViolationType: boolean;
          officerName: string;
        }[];
      }
    | { error: string }
  > {
    try {
      const reports = await prisma.report.findMany({
        where: {
          officerId: officerId,
        },
        include: {
          officer: {
            select: {
              username: true,
            },
          },
        },
      });

      if (!reports || reports.length === 0) {
        return { error: "No reports found for this officer" };
      }

      const formattedReports = reports.map((r) => ({
        id: r.id,
        content: r.content,
        status: r.status,
        dateCreated: r.dateCreated,
        officerId: r.officerId,
        violationId: r.violationId,
        includePlate: r.includePlate,
        includeViolationType: r.includeViolationType,
        officerName: r.officer?.username || "Unknown",
      }));

      return { reports: formattedReports };
    } catch (error) {
      console.error("Error getting reports by officer ID:", error);
      return { error: "Internal server error" };
    }
  }

  public async getReportById(id: number): Promise<
    | {
        report: {
          id: number;
          content: string;
          status: string;
          dateCreated: Date;
          officerId: number;
          violationId: number;
          includePlate: boolean;
          includeViolationType: boolean;
          officerName: string;
        };
      }
    | { error: string }
  > {
    try {
      const report = await prisma.report.findUnique({
        where: {
          id: id,
        },
        include: {
          officer: true,
        },
      });

      if (!report) {
        return { error: "No report found with this ID" };
      }

      return {
        report: {
          id: report.id,
          content: report.content,
          status: report.status,
          dateCreated: report.dateCreated,
          officerId: report.officerId,
          violationId: report.violationId,
          includePlate: report.includePlate,
          includeViolationType: report.includeViolationType,
          officerName: report.officer.username,
        },
      };
    } catch (error) {
      console.error("Error getting report by ID:", error);
      return { error: "Internal server error" };
    }
  }

  public async updateReportById(
    id: number,
    status?: string
  ): Promise<
    | {
        report: {
          id: number;
          content: string;
          status: string;
          dateCreated: Date;
          officerId: number;
          violationId: number;
          includePlate: boolean;
          includeViolationType: boolean;
          officerName: string;
        };
      }
    | { error: string }
  > {
    try {
      const existingReport = await prisma.report.findUnique({ where: { id } });

      if (!existingReport) {
        return { error: "Report not found" };
      }

      const updatedReport = await prisma.report.update({
        where: { id },
        data: {
          status: status ?? existingReport.status,
        },
        include: {
          officer: true,
        },
      });

      return {
        report: {
          id: updatedReport.id,
          content: updatedReport.content,
          status: updatedReport.status,
          dateCreated: updatedReport.dateCreated,
          officerId: updatedReport.officerId,
          violationId: updatedReport.violationId,
          includePlate: updatedReport.includePlate,
          includeViolationType: updatedReport.includeViolationType,
          officerName: updatedReport.officer.username,
        },
      };
    } catch (error) {
      console.error("Error updating report:", error);
      return { error: "An error occurred while updating the report" };
    }
  }
}
