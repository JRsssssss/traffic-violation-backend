"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const tsoa_1 = require("tsoa");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ReportController = class ReportController extends tsoa_1.Controller {
    createReport(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, status, violationId, officerId, includePlate, includeViolationType } = request;
            if (!status || !violationId || !officerId) {
                this.setStatus(400);
                return { error: "All fields are required" };
            }
            const existingReport = yield prisma.report.findUnique({ where: { violationId: violationId } });
            if (existingReport) {
                this.setStatus(409);
                return { error: "Report already exists" };
            }
            const violation = yield prisma.violation.findUnique({
                where: { id: violationId },
            });
            if (!violation) {
                this.setStatus(404);
                return { error: "Violation not found" };
            }
            const officer = yield prisma.user.findUnique({
                where: { id: officerId, role: "Officer" },
            });
            if (!officer) {
                this.setStatus(404);
                return { error: "Officer not found" };
            }
            try {
                const newReport = yield prisma.report.create({
                    data: {
                        content,
                        status,
                        violationId,
                        officerId,
                        includePlate,
                        includeViolationType,
                    },
                });
                return { report: {
                        id: newReport.id,
                        content: newReport.content,
                        status: newReport.status,
                        dateCreated: newReport.dateCreated,
                        officerId: newReport.officerId,
                        violationId: newReport.violationId,
                        includePlate: newReport.includePlate,
                        includeViolationType: newReport.includeViolationType,
                    } };
            }
            catch (error) {
                console.error("Error creating report:", error);
                this.setStatus(500);
                return { error: "Internal server error" };
            }
        });
    }
    getAllReports() {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield prisma.report.findMany({
                include: {
                    officer: {
                        select: {
                            username: true,
                        }
                    }
                }
            });
            const formattedReports = reports.map((r) => {
                var _a;
                return ({
                    id: r.id,
                    content: r.content,
                    status: r.status,
                    dateCreated: r.dateCreated,
                    officerId: r.officerId,
                    violationId: r.violationId,
                    includePlate: r.includePlate,
                    includeViolationType: r.includeViolationType,
                    officerName: ((_a = r.officer) === null || _a === void 0 ? void 0 : _a.username) || "Unknown",
                });
            });
            return { reports: formattedReports };
        });
    }
    getReportByOfficerId(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request;
            const reports = yield prisma.report.findMany({
                where: {
                    officerId: id,
                },
                include: {
                    officer: {
                        select: {
                            username: true,
                        }
                    }
                }
            });
            if (!reports || reports.length === 0) {
                this.setStatus(404);
                return { error: "No reports found for this officer" };
            }
            const formattedReports = reports.map((r) => {
                var _a;
                return ({
                    id: r.id,
                    content: r.content,
                    status: r.status,
                    dateCreated: r.dateCreated,
                    officerId: r.officerId,
                    violationId: r.violationId,
                    includePlate: r.includePlate,
                    includeViolationType: r.includeViolationType,
                    officerName: ((_a = r.officer) === null || _a === void 0 ? void 0 : _a.username) || "Unknown",
                });
            });
            return { reports: formattedReports };
        });
    }
    getReportById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request;
            const report = yield prisma.report.findUnique({
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
        });
    }
    updateReportById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, status } = request;
            try {
                const existingReport = yield prisma.report.findUnique({ where: { id } });
                if (!existingReport) {
                    this.setStatus(404);
                    return { error: "Reprot not found" };
                }
                const updatedReport = yield prisma.report.update({
                    where: { id },
                    data: {
                        status: status !== null && status !== void 0 ? status : existingReport.status,
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
            }
            catch (error) {
                this.setStatus(500);
                return { error: "An error occurred while updating the user" };
            }
        });
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, tsoa_1.Post)("/createReport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "createReport", null);
__decorate([
    (0, tsoa_1.Get)("/getAllReports"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getAllReports", null);
__decorate([
    (0, tsoa_1.Post)("/getReportByOfficerId"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getReportByOfficerId", null);
__decorate([
    (0, tsoa_1.Post)("/getReportById"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getReportById", null);
__decorate([
    (0, tsoa_1.Put)("/updateReportById"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "updateReportById", null);
exports.ReportController = ReportController = __decorate([
    (0, tsoa_1.Route)("Report")
], ReportController);
