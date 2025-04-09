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
  Res,
} from "tsoa";
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
  @Security("jwt", ["Officer", "Administrator"])
  public async addNewViolation(
    @Body()
    request: {
      date: Date;
      plate: string;
      type: string;
      location: string;
      imageUrl: Array<string>;
      province: string;
    }
  ) {
    try {
      const { date, plate, type, location, imageUrl, province } = request;
      return await violationService.addNewViolation(
        date,
        plate,
        type,
        location,
        imageUrl,
        province
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
    @Query() violationId: number
  ): Promise<string | { error: string }> {
    const ticketResult = await violationService.getTicketFromViolation(
      violationId
    );

    if ("error" in ticketResult) {
      this.setStatus(404);
      return ticketResult;
    }

    // Set headers to make browser download the PDF file
    this.setHeader("Content-Type", "application/pdf");
    this.setHeader("Content-Disposition", 'attachment; filename="ticket.pdf"');

    // Convert Buffer to base64 string - the client will need to decode this
    return (ticketResult as Buffer).toString("base64");
  }
}
