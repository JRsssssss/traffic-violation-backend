"use strict";
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
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const violationcontroller_1 = require("./../controllers/violationcontroller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const usercontroller_1 = require("./../controllers/usercontroller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const test_1 = require("./../controllers/test");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const reportcontroller_1 = require("./../controllers/reportcontroller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "ignore", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const argsViolationController_getAllViolations = {};
    app.get('/Violation/allviolations', ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController)), ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController.prototype.getAllViolations)), function ViolationController_getAllViolations(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsViolationController_getAllViolations, request, response });
                const controller = new violationcontroller_1.ViolationController();
                yield templateService.apiHandler({
                    methodName: 'getAllViolations',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsViolationController_getViolationsById = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } },
    };
    app.post('/Violation/violationById', ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController)), ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController.prototype.getViolationsById)), function ViolationController_getViolationsById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsViolationController_getViolationsById, request, response });
                const controller = new violationcontroller_1.ViolationController();
                yield templateService.apiHandler({
                    methodName: 'getViolationsById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsViolationController_updateUserById = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "location": { "dataType": "string" }, "type": { "dataType": "string" }, "plate": { "dataType": "string" }, "date": { "dataType": "datetime" }, "id": { "dataType": "double", "required": true } } },
    };
    app.put('/Violation/updateViolationById', ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController)), ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController.prototype.updateUserById)), function ViolationController_updateUserById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsViolationController_updateUserById, request, response });
                const controller = new violationcontroller_1.ViolationController();
                yield templateService.apiHandler({
                    methodName: 'updateUserById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsViolationController_deleteViolation = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } },
    };
    app.delete('/Violation/deleteViolation', ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController)), ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController.prototype.deleteViolation)), function ViolationController_deleteViolation(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsViolationController_deleteViolation, request, response });
                const controller = new violationcontroller_1.ViolationController();
                yield templateService.apiHandler({
                    methodName: 'deleteViolation',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsViolationController_addNewViolation = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "province": { "dataType": "string", "required": true }, "imageUrl": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "location": { "dataType": "string", "required": true }, "type": { "dataType": "string", "required": true }, "plate": { "dataType": "string", "required": true }, "date": { "dataType": "datetime", "required": true } } },
    };
    app.post('/Violation/addNewViolation', ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController)), ...((0, runtime_1.fetchMiddlewares)(violationcontroller_1.ViolationController.prototype.addNewViolation)), function ViolationController_addNewViolation(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsViolationController_addNewViolation, request, response });
                const controller = new violationcontroller_1.ViolationController();
                yield templateService.apiHandler({
                    methodName: 'addNewViolation',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getAllUsers = {};
    app.get('/User/allusers', ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController.prototype.getAllUsers)), function UserController_getAllUsers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAllUsers, request, response });
                const controller = new usercontroller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getAllUsers',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUserById = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } },
    };
    app.post('/User/userById', ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController.prototype.getUserById)), function UserController_getUserById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserById, request, response });
                const controller = new usercontroller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUserById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_login = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "password": { "dataType": "string", "required": true }, "username": { "dataType": "string", "required": true } } },
    };
    app.post('/User/login', ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController.prototype.login)), function UserController_login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_login, request, response });
                const controller = new usercontroller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'login',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_createUser = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "role": { "dataType": "string", "required": true }, "password": { "dataType": "string", "required": true }, "username": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } } },
    };
    app.post('/User/createUser', ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController.prototype.createUser)), function UserController_createUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_createUser, request, response });
                const controller = new usercontroller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'createUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_updateUserById = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "role": { "dataType": "string" }, "password": { "dataType": "string" }, "username": { "dataType": "string" }, "name": { "dataType": "string" }, "id": { "dataType": "double", "required": true } } },
    };
    app.put('/User/updateUserById', ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController.prototype.updateUserById)), function UserController_updateUserById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUserById, request, response });
                const controller = new usercontroller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'updateUserById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_deleteUser = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "userId": { "dataType": "double", "required": true } } },
    };
    app.delete('/User/deleteUser', ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(usercontroller_1.UserController.prototype.deleteUser)), function UserController_deleteUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUser, request, response });
                const controller = new usercontroller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'deleteUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTestController_sayHello = {};
    app.get('/hello', ...((0, runtime_1.fetchMiddlewares)(test_1.TestController)), ...((0, runtime_1.fetchMiddlewares)(test_1.TestController.prototype.sayHello)), function TestController_sayHello(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTestController_sayHello, request, response });
                const controller = new test_1.TestController();
                yield templateService.apiHandler({
                    methodName: 'sayHello',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsReportController_createReport = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "includeViolationType": { "dataType": "boolean", "required": true }, "includePlate": { "dataType": "boolean", "required": true }, "officerId": { "dataType": "double", "required": true }, "violationId": { "dataType": "double", "required": true }, "status": { "dataType": "string", "required": true }, "content": { "dataType": "string", "required": true } } },
    };
    app.post('/Report/createReport', ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController)), ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController.prototype.createReport)), function ReportController_createReport(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_createReport, request, response });
                const controller = new reportcontroller_1.ReportController();
                yield templateService.apiHandler({
                    methodName: 'createReport',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsReportController_getAllReports = {};
    app.get('/Report/getAllReports', ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController)), ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController.prototype.getAllReports)), function ReportController_getAllReports(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_getAllReports, request, response });
                const controller = new reportcontroller_1.ReportController();
                yield templateService.apiHandler({
                    methodName: 'getAllReports',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsReportController_getReportByOfficerId = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } },
    };
    app.post('/Report/getReportByOfficerId', ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController)), ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController.prototype.getReportByOfficerId)), function ReportController_getReportByOfficerId(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_getReportByOfficerId, request, response });
                const controller = new reportcontroller_1.ReportController();
                yield templateService.apiHandler({
                    methodName: 'getReportByOfficerId',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsReportController_getReportById = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } },
    };
    app.post('/Report/getReportById', ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController)), ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController.prototype.getReportById)), function ReportController_getReportById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_getReportById, request, response });
                const controller = new reportcontroller_1.ReportController();
                yield templateService.apiHandler({
                    methodName: 'getReportById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsReportController_updateReportById = {
        request: { "in": "body", "name": "request", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "status": { "dataType": "string" }, "id": { "dataType": "double", "required": true } } },
    };
    app.put('/Report/updateReportById', ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController)), ...((0, runtime_1.fetchMiddlewares)(reportcontroller_1.ReportController.prototype.updateReportById)), function ReportController_updateReportById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_updateReportById, request, response });
                const controller = new reportcontroller_1.ReportController();
                yield templateService.apiHandler({
                    methodName: 'updateReportById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
