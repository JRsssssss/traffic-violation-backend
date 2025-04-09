import {
  Controller,
  Get,
  Route,
  Post,
  Body,
  Delete,
  Put,
  Tags,
  Security,
} from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("Report")
export class ReportController extends Controller {
  @Post("/createReport")
  @Tags("Officer")
  @Security("jwt", ["Officer"])
  public async createReport(
    @Body()
    request: {
      content: string;
      status: string;
      violationId: number;
      officerId: number;
      includePlate: boolean;
      includeViolationType: boolean;
    }
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
    const {
      content,
      status,
      violationId,
      officerId,
      includePlate,
      includeViolationType,
    } = request;

    if (!status || !violationId || !officerId) {
      this.setStatus(400);
      return { error: "All fields are required" };
    }

    const existingReport = await prisma.report.findFirst({
      where: { violationId: violationId },
    });
    if (existingReport) {
      this.setStatus(409);
      return { error: "Report already exists" };
    }

    const violation = await prisma.violation.findUnique({
      where: { id: violationId },
    });
    if (!violation) {
      this.setStatus(404);
      return { error: "Violation not found" };
    }

    const officer = await prisma.user.findFirst({
      where: { id: officerId, role: "Officer" },
    });
    if (!officer) {
      this.setStatus(404);
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
      this.setStatus(500);
      return { error: "Internal server error" };
    }
  }
  @Get("/getAllReports")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
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
        }[];
      }
    | { error: string }
  > {
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
  }

  @Post("/getReportByOfficerId")
  @Tags("Officer")
  @Security("jwt", ["Officer"])
  public async getReportByOfficerId(@Body() request: { id: number }): Promise<
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
        }[];
      }
    | { error: string }
  > {
    const { id } = request;

    const reports = await prisma.report.findMany({
      where: {
        officerId: id,
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
      this.setStatus(404);
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
  }
  @Post("/getReportById")
  @Tags("Officer", "Administrator")
  @Security("jwt", ["Officer", "Administrator"])
  public async getReportById(@Body() request: { id: number }): Promise<
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
    const { id } = request;

    const report = await prisma.report.findUnique({
      where: {
        id: id,
      },
      include: {
        officer: true,
      },
    });

    if (!report) {
      this.setStatus(404);
      return { error: "No reports found for this officer" };
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
  }

  @Put("/updateReportById")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async updateReportById(
    @Body() request: { id: number; status?: string }
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
    const { id, status } = request;

    try {
      const existingReport = await prisma.report.findUnique({ where: { id } });

      if (!existingReport) {
        this.setStatus(404);
        return { error: "Reprot not found" };
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
      this.setStatus(500);
      return { error: "An error occurred while updating the user" };
    }
  }
}
