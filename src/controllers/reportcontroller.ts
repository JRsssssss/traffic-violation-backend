import { Controller, Get, Route, Post, Body, Delete, Put } from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("Report")
export class ReportController extends Controller{
    @Post("/createReport")
    public async createReport(@Body() request: {content: string; status: string; violationId: number; 
                                                officerId: number; includePlate: boolean; includeViolationType: boolean;}): 
                              Promise<| {report: {id: number; content: string; status: string; dateCreated: Date; 
                                         officerId: number; violationId: number; includePlate: boolean; includeViolationType: boolean;}}| { error: string }>{

        const { content, status, violationId, officerId, includePlate, includeViolationType } = request;

        if (!status || !violationId || !officerId) {
            this.setStatus(400);
            return { error: "All fields are required" };
        }

        const existingReport = await prisma.report.findUnique({ where: { violationId: violationId} });
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

        const officer = await prisma.user.findUnique({
            where: { id: officerId , role: "Officer" },
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

            return {report:{
                id: newReport.id,
                content: newReport.content,
                status: newReport.status,
                dateCreated: newReport.dateCreated,
                officerId: newReport.officerId,
                violationId: newReport.violationId,
                includePlate: newReport.includePlate,
                includeViolationType: newReport.includeViolationType,
            }}
        } catch (error) {
            console.error("Error creating report:", error);
            this.setStatus(500);
            return { error: "Internal server error" };
        }
    }
    
    @Post("/getReportById")
    public async getReportById(@Body() request: { id: number }): 
                                Promise<{ reports: { id: number; content: string; status: string; dateCreated: Date, officerId: number; 
                                                    violationId: number; includePlate: boolean; includeViolationType: boolean; }[] } | { error: string }> {
        const { id } = request;

        const reports = await prisma.report.findMany({
            where: {
                officerId: id,
            },
            select: {
                id: true,
                content: true,
                status: true,
                dateCreated: true,
                includePlate: true,
                includeViolationType: true,
                violationId: true,
                officerId: true,
            },
        });

        if (!reports || reports.length === 0) {
            this.setStatus(404);
            return { error: "No reports found for this officer" };
        }
    
        return { reports };

    }
}