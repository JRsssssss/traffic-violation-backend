import {
  Controller,
  Get,
  Route,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Tags,
  Security,
  Request,
  Res,
} from "tsoa";
import express from "express";
import { ViolationService } from "../service/violationService";

const violationService = new ViolationService();

@Route("Violation")
@Tags("Officer", "Administrator")
export class ViolationController extends Controller {
  @Get("/allviolations")
  @Security("jwt", ["Officer", "Administrator"])
  public async getAllViolations(): Promise<{
    violations: {
      id: number;
      date: Date;
      plate: string;
      type: string;
      location: string;
      details: string;
      imageUrl: string[];
    }[];
  }> {
    return await violationService.getAllViolations();
  }

  @Post("/violationById")
  @Tags("Officer", "Administrator")
  @Security("jwt", ["Officer", "Administrator"])
  public async getViolationsById(@Body() request: { id: number }): Promise<
    | {
        violation: {
          id: number;
          date: Date;
          plate: string;
          type: string;
          location: string;
          details: string;
          imageUrl: string[];
        };
      }
    | { error: string }
  > {
    const { id } = request;
    const result = await violationService.getViolationById(id);

    if ("error" in result) {
      this.setStatus(404);
    }

    return result;
  }

  @Put("/updateViolationById")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async updateUserById(
    @Body()
    request: {
      id: number;
      date?: Date;
      plate?: string;
      type?: string;
      location?: string;
    }
  ): Promise<{ violation: any } | { error: string }> {
    const { id, date, plate, type, location } = request;
    const result = await violationService.updateViolationById(
      id,
      date,
      plate,
      type,
      location
    );

    if ("error" in result) {
      this.setStatus(result.error === "Violation not found" ? 404 : 500);
    }

    return result;
  }

  @Delete("/deleteViolation")
  @Tags("Administrator")
  @Security("jwt", ["Administrator"])
  public async deleteViolation(@Body() request: { id: number }) {
    const { id } = request;
    const result = await violationService.deleteViolation(id);

    if ("error" in result) {
      this.setStatus(result.error === "Violation not found" ? 404 : 500);
    }

    return result;
  }

  @Post("/addNewViolation")
  // @Security("jwt", ["Officer", "Administrator"])
  public async addNewViolation(
    @Body()
    request: {
      date: Date;
      plate: string;
      type: string;
      location: string;
      imageUrl: Array<string>;
      province: string;
      details: string;
    }
  ) {
    try {
      const { date, plate, type, location, imageUrl, province, details } =
        request;
      return await violationService.addNewViolation(
        date,
        plate,
        type,
        location,
        imageUrl,
        province,
        details
      );
    } catch (error) {
      console.log(error);
      this.setStatus(500);
      return { error: "Error while adding violation" };
    }
  }

  @Get("/getTicketFromViolation")
  @Tags("Officer", "Administrator")
  @Security("jwt", ["Officer", "Administrator"])
  public async getTicketFromViolation(
    @Query() violationId: number,
    @Request() request: express.Request
  ) {
    const userId = request.user?.id;

    if (!userId) {
      this.setStatus(401);
      return { error: "User not authenticated or missing user ID" };
    }

    const ticketResult = await violationService.getTicketFromViolation(
      violationId,
      userId
    ); //BUFFER

    if ("error" in ticketResult) {
      this.setStatus(404);
      return ticketResult;
    }
    const res = request.res;
    if (res) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="ticket.pdf"');
      res.send(ticketResult);
    } else {
      this.setStatus(500);
      return { error: "Response object is undefined" };
    }
  }
}
