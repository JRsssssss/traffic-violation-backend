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
import { ReportService } from "../service/reportService";

const reportService = new ReportService();

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

    const result = await reportService.createReport(
      content,
      status,
      violationId,
      officerId,
      includePlate,
      includeViolationType
    );

    if ("error" in result) {
      this.setStatus(
        result.error === "All fields are required"
          ? 400
          : result.error === "Report already exists"
          ? 409
          : result.error === "Violation not found"
          ? 404
          : result.error === "Officer not found"
          ? 404
          : 500
      );
    }

    return result;
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
          officerName: string;
        }[];
      }
    | { error: string }
  > {
    const result = await reportService.getAllReports();
    return result;
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
          officerName: string;
        }[];
      }
    | { error: string }
  > {
    const { id } = request;
    const result = await reportService.getReportByOfficerId(id);

    if ("error" in result) {
      this.setStatus(404);
    }

    return result;
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
    const result = await reportService.getReportById(id);

    if ("error" in result) {
      this.setStatus(404);
    }

    return result;
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
    const result = await reportService.updateReportById(id, status);

    if ("error" in result) {
      this.setStatus(result.error === "Report not found" ? 404 : 500);
    }

    return result;
  }
}
