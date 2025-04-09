import { PrismaClient } from "@prisma/client";
import { TicketData, TicketGenerator } from "./TicketGen";
import path from "path";

const prisma = new PrismaClient();

export class ViolationService {
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
    try {
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
    } catch (error) {
      console.error("Error getting all violations:", error);
      throw error;
    }
  }

  public async getViolationById(id: number): Promise<
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
    try {
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
    } catch (error) {
      console.error("Error getting violation by ID:", error);
      return { error: "Internal server error" };
    }
  }

  public async updateViolationById(
    id: number,
    date?: Date,
    plate?: string,
    type?: string,
    location?: string
  ): Promise<{ violation: any } | { error: string }> {
    try {
      const existingViolation = await prisma.violation.findUnique({
        where: { id },
      });

      if (!existingViolation) {
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
      console.error("Error updating violation:", error);
      return { error: "An error occurred while updating the violation" };
    }
  }

  public async deleteViolation(
    id: number
  ): Promise<{ message: string } | { error: string }> {
    try {
      const existingViolation = await prisma.violation.findUnique({
        where: { id },
      });

      if (!existingViolation) {
        return { error: "Violation not found" };
      }

      await prisma.violation.delete({ where: { id } });

      return { message: "Violation deleted successfully" };
    } catch (error) {
      console.error("Error deleting violation:", error);
      return { error: "An error occurred while deleting the violation" };
    }
  }

  public async addNewViolation(
    date: Date,
    plate: string,
    type: string,
    location: string,
    imageUrl: Array<string>,
    province: string,
    details: string
  ) {
    try {
      const newViolation = await prisma.violation.create({
        data: {
          date,
          plate,
          type,
          location,
          imageUrl,
          province,
          details,
        },
      });

      return {
        message: "Violation added successfully",
        data: newViolation,
      };
    } catch (error) {
      console.error("Error adding violation:", error);
      return { error: "Error while adding violation" };
    }
  }

  public async getTicketFromViolation(
    violationId: number
  ): Promise<Buffer | { error: string }> {
    try {
      const violation = await prisma.violation.findUnique({
        where: { id: violationId },
      });

      if (!violation) {
        return { error: "Ticket not found" };
      }

      const currentDate = new Date();

      const ticketData: TicketData = {
        plate_number: violation.plate,
        plate_province: violation.province,
        kor_har: violation.type,
        place: violation.location,
        violation_datetime: violation.date,
        violation_detail: "DETAIL HERE",
        ticket_number: violation.id.toString(),
        fine: "500",
        issuer: "สถานีตำรวจที่ตรวจพบ",
        issue_datetime: currentDate,
        evidence_1_path: violation.imageUrl[0] ?? undefined,
        evidence_2_path: violation.imageUrl[1] ?? undefined,
      };

      const ticketGenerator = new TicketGenerator();
      const pdfBytes = await ticketGenerator.generateTicketAsBytes(
        ticketData,
        path.join(__dirname, "../assets/ticket_template.pdf")
      );

      // Create a proper Buffer from the Uint8Array
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error("Error generating ticket:", error);
      return { error: "Error generating ticket" };
    }
  }
}
