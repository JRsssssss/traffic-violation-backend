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
} from "tsoa";
import { PrismaClient } from "@prisma/client";
import { TicketData, TicketGenerator } from "../service/TicketGen";
import path from "path";

const prisma = new PrismaClient();

@Route("Violation")
@Tags("Officer", "Admin")
export class ViolationController extends Controller {
  @Get("/allviolations")
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
    const response = await prisma.violation.findMany();

    return {
      violations: response.map((v) => ({
        id: v.id,
        date: v.date,
        plate: v.plate,
        type: v.type,
        location: v.location,
        details: v.details,
        imageUrl: v.imageUrl,
      })),
    };
  }

  @Post("/violationById")
  @Tags("Officer", "Admin")
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

    const violation = await prisma.violation.findUnique({
      where: { id },
    });

    if (!violation) {
      return { error: "Violation not found" };
    }

    return {
      violation: {
        id: violation.id,
        date: violation.date,
        plate: violation.plate,
        type: violation.type,
        location: violation.location,
        details: violation.details,
        imageUrl: violation.imageUrl,
      },
    };
  }
  @Put("/updateViolationById")
  @Tags("Admin")
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

    try {
      const existingViolation = await prisma.violation.findUnique({
        where: { id },
      });

      if (!existingViolation) {
        this.setStatus(404);
        return { error: "Violation not found" };
      }

      const updatedViolation = await prisma.violation.update({
        where: { id },
        data: {
          date: date ?? existingViolation.date,
          plate: plate ?? existingViolation.plate,
          type: type ?? existingViolation.type,
          location: location ?? existingViolation.location,
        },
      });

      return { violation: updatedViolation };
    } catch (error) {
      this.setStatus(500);
      return { error: "An error occurred while updating the violation" };
    }
  }

  @Delete("/deleteViolation")
  @Tags("Admin")
  public async deleteViolation(@Body() request: { id: number }) {
    const { id } = request;
    try {
      const existingViolation = await prisma.violation.findUnique({
        where: { id: id },
      });

      if (!existingViolation) {
        this.setStatus(404);
        return { error: "Violaiton not found" };
      }

      await prisma.violation.delete({ where: { id: id } });

      return { message: "Violation deleted successfully" };
    } catch (error) {
      console.log(error);
      this.setStatus(500);
      return { error: "An error occurred while deleting the violaiton" };
    }
  }

  @Post("/addNewViolation")
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
      const newViolation = await prisma.violation.create({
        data: {
          date: request.date,
          plate: request.plate,
          type: request.type,
          location: request.location,
          imageUrl: request.imageUrl,
        },
      });
      console.log("New Violation Created");
      console.log(newViolation);

      return {
        message: "Violation added successfully",
        data: newViolation,
      };
    } catch (error) {
      console.log(error);
      this.setStatus(500);
      return { error: "Error while adding violation" };
    }
  }

  @Get("/getTicketFromViolation")
  @Tags("Officer", "Admin")
  public async getTicketFromViolation(@Query() violationId: number) {
    const ticket = await prisma.violation.findUnique({
      where: { id: violationId },
    });

    if (!ticket) {
      this.setStatus(404);
      return { error: "Ticket not found" };
    }

    const currentDate = new Date();

    const ticketData: TicketData = {
      plate_number: ticket.plate,
      plate_province: ticket.province,
      kor_har: ticket.type,
      place: ticket.location,
      violation_datetime: ticket.date,
      violation_detail: "DETAIL HERE",
      ticket_number: ticket.id.toString(),
      fine: "500",
      issuer: "สถานีตำรวจที่ตรวจพบ",
      issue_datetime: currentDate,
    };

    const ticketGenerator = new TicketGenerator();
    const ticketBuffer = await ticketGenerator.generateTicketAsBuffer(
      ticketData,
      path.join(__dirname, "../assets/ticket_template.pdf")
    );

    // Set headers to make browser download the PDF file
    this.setHeader("Content-Type", "application/pdf");
    this.setHeader("Content-Disposition", 'attachment; filename="ticket.pdf"');
    this.setHeader("Content-Length", ticketBuffer.length.toString());

    // Return the raw buffer directly
    return ticketBuffer;
  }
}
