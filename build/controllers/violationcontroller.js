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
exports.ViolationController = void 0;
const tsoa_1 = require("tsoa");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ViolationController = class ViolationController extends tsoa_1.Controller {
    getAllViolations() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.violation.findMany();
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
        });
    }
    getViolationsById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request;
            const violation = yield prisma.violation.findUnique({
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
        });
    }
    updateUserById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, date, plate, type, location } = request;
            try {
                const existingViolation = yield prisma.violation.findUnique({
                    where: { id },
                });
                if (!existingViolation) {
                    this.setStatus(404);
                    return { error: "Violation not found" };
                }
                const updatedViolation = yield prisma.violation.update({
                    where: { id },
                    data: {
                        date: date !== null && date !== void 0 ? date : existingViolation.date,
                        plate: plate !== null && plate !== void 0 ? plate : existingViolation.plate,
                        type: type !== null && type !== void 0 ? type : existingViolation.type,
                        location: location !== null && location !== void 0 ? location : existingViolation.location,
                    },
                });
                return { violation: updatedViolation };
            }
            catch (error) {
                this.setStatus(500);
                return { error: "An error occurred while updating the violation" };
            }
        });
    }
    deleteViolation(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request;
            try {
                const existingViolation = yield prisma.violation.findUnique({
                    where: { id: id },
                });
                if (!existingViolation) {
                    this.setStatus(404);
                    return { error: "Violaiton not found" };
                }
                yield prisma.violation.delete({ where: { id: id } });
                return { message: "Violation deleted successfully" };
            }
            catch (error) {
                this.setStatus(500);
                return { error: "An error occurred while deleting the violaiton" };
            }
        });
    }
    addNewViolation(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newViolation = yield prisma.violation.create({
                    data: {
                        date: request.date,
                        plate: request.plate,
                        type: request.type,
                        location: request.location,
                        flagged: "Awaiting Review",
                    },
                });
                return {
                    message: "Violation added successfully",
                    data: newViolation,
                };
            }
            catch (error) {
                console.log(error);
                this.setStatus(500);
                return { error: "Error while adding violation" };
            }
        });
    }
};
exports.ViolationController = ViolationController;
__decorate([
    (0, tsoa_1.Get)("/allviolations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ViolationController.prototype, "getAllViolations", null);
__decorate([
    (0, tsoa_1.Post)("/violationById"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViolationController.prototype, "getViolationsById", null);
__decorate([
    (0, tsoa_1.Put)("/updateViolationById"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViolationController.prototype, "updateUserById", null);
__decorate([
    (0, tsoa_1.Delete)("/deleteViolation"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViolationController.prototype, "deleteViolation", null);
__decorate([
    (0, tsoa_1.Post)("/addNewViolation"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViolationController.prototype, "addNewViolation", null);
exports.ViolationController = ViolationController = __decorate([
    (0, tsoa_1.Route)("Violation")
], ViolationController);
