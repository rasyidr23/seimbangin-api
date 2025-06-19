"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_1 = require("../controllers/transaction");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const validate_1 = __importDefault(require("../middleware/validate"));
const transactionRouter = (0, express_1.Router)();
transactionRouter.post("/", jwt_1.default, validate_1.default.transaction, transaction_1.transactionController.create);
transactionRouter.get("/", jwt_1.default, transaction_1.transactionController.getAll);
transactionRouter.delete("/:id", jwt_1.default, transaction_1.transactionController.delete);
exports.default = transactionRouter;
