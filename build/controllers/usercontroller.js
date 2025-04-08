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
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let UserController = class UserController extends tsoa_1.Controller {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findMany();
        });
    }
    getUserById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request;
            const user = yield prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                this.setStatus(404); // Not Found
                return { error: "User not found" };
            }
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    role: user.role,
                },
            };
        });
    }
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = request;
            const user = yield prisma.user.findUnique({
                where: { username },
            });
            if (!user) {
                this.setStatus(401);
                return { error: "Invalid username or password" };
            }
            if (user.password !== password) {
                this.setStatus(401);
                return { error: "Invalid username or password" };
            }
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    role: user.role,
                },
            };
        });
    }
    createUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, username, password, role } = request;
            if (!name || !username || !password || !role) {
                this.setStatus(400);
                return { error: "All fields are required" };
            }
            const existingUser = yield prisma.user.findUnique({ where: { username } });
            if (existingUser) {
                this.setStatus(409);
                return { error: "Username already exists" };
            }
            try {
                const newUser = yield prisma.user.create({
                    data: {
                        name,
                        username,
                        password,
                        role,
                    },
                });
                return {
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        username: newUser.username,
                        role: newUser.role,
                    },
                };
            }
            catch (error) {
                console.error("Error creating user:", error);
                this.setStatus(500);
                return { error: "Internal server error" };
            }
        });
    }
    updateUserById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, username, password, role } = request;
            try {
                const existingUser = yield prisma.user.findUnique({ where: { id } });
                if (!existingUser) {
                    this.setStatus(404);
                    return { error: "User not found" };
                }
                const updatedUser = yield prisma.user.update({
                    where: { id },
                    data: {
                        name: name !== null && name !== void 0 ? name : existingUser.name,
                        username: username !== null && username !== void 0 ? username : existingUser.username,
                        password: password !== null && password !== void 0 ? password : existingUser.password,
                        role: role !== null && role !== void 0 ? role : existingUser.role,
                    },
                });
                return {
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        username: updatedUser.username,
                        password: updatedUser.password,
                        role: updatedUser.role,
                    },
                };
            }
            catch (error) {
                this.setStatus(500);
                return { error: "An error occurred while updating the user" };
            }
        });
    }
    deleteUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = request;
            try {
                const existingUser = yield prisma.user.findUnique({ where: { id: userId } });
                if (!existingUser) {
                    this.setStatus(404);
                    return { error: "User not found" };
                }
                yield prisma.user.delete({ where: { id: userId } });
                return { message: "User deleted successfully" };
            }
            catch (error) {
                this.setStatus(500);
                return { error: "An error occurred while deleting the user" };
            }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Get)("/allusers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, tsoa_1.Post)("/userById"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, tsoa_1.Post)("/login"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)("/createUser"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, tsoa_1.Put)("/updateUserById"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserById", null);
__decorate([
    (0, tsoa_1.Delete)("/deleteUser"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)("User")
], UserController);
