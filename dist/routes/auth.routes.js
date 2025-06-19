"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../controllers/auth"));
const authRouter = (0, express_1.Router)();
const validate_1 = __importDefault(require("../middleware/validate"));
authRouter.post("/login", validate_1.default.login, auth_1.default.login);
authRouter.post("/register", validate_1.default.register, auth_1.default.register);
exports.default = authRouter;
