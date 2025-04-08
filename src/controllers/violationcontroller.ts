import { Controller, Get, Route, Post, Body, Put, Delete } from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("Violation")
export class ViolationController extends Controller {
  @Get("/allviolations")
  public async getAllViolations(): Promise<{
    violations: {
      id: number;
      date: Date;
      plate: string;
      type: string;
      location: string;
      flagged: string;
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
        flagged: v.flagged,
      })),
    };
  }

  @Post("/violationById")
  public async getViolationsById(@Body() request: { id: number }): Promise<
    | {
        violation: {
          id: number;
          date: Date;
          plate: string;
          type: string;
          location: string;
          flagged: string;
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
        flagged: violation.flagged,
      },
    };
  }
  @Put("/updateViolationById")
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
          flagged: "Awaiting Review",
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
}
