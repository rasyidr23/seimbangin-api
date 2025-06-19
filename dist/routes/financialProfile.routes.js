"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const validate_1 = __importDefault(require("../middleware/validate"));
const financialProfile_1 = require("../controllers/financialProfile");
const financialProfileRouter = (0, express_1.Router)();
financialProfileRouter.put("/", jwt_1.default, validate_1.default.createFinancialProfile, financialProfile_1.financialProfileController.update);
exports.default = financialProfileRouter;
