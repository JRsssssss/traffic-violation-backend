import { Controller, Get, Route, Post, Body } from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("Violation")
export class ViolationController extends Controller {
  @Get("/allviolations")
  public async getAllViolations(): Promise<{violations:{id: number, date: Date, plate: string, type: string, location: string, flagged: string }[]}>{

    const response = await prisma.violation.findMany();

    return{
        violations: response.map(v =>({
            id: v.id,
            date: v.date,
            plate: v.plate,
            type: v.type,
            location: v.location,
            flagged: v.flagged,
        }))
    }
  }

  @Post("/violationById")
  public async getViolationsById(@Body() request: { id: number }): 
                                Promise<{violation: {id: number, date: Date, plate: string, type: string, location: string, flagged: string }}| { error: string }>{
    const {id} = request

    const violation = await prisma.violation.findUnique({
        where: { id }
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
        }
    };
  }
}



