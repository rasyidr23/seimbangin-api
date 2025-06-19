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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialProfileController = void 0;
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
exports.financialProfileController = {
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        // check if the user already has a financial profile
        const user = yield db_1.default
            .select()
            .from(schema_1.usersTable)
            .leftJoin(schema_1.userFinancial, (0, drizzle_orm_1.eq)(schema_1.usersTable.id, schema_1.userFinancial.user_id))
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, req.user.id));
        console.log(user[0].user_financial_profile, "User financial profile");
        // if user don't have a financial profile, create one
        if (!user || !user.length || !user[0].user_financial_profile) {
            console.log("Creating a new financial profile");
            yield db_1.default.insert(schema_1.userFinancial).values({
                user_id: req.user.id,
            });
            console.log("New financial profile created");
        }
        const { monthly_income, current_savings, debt, financial_goals, risk_management, } = req.body;
        try {
            yield db_1.default
                .update(schema_1.userFinancial)
                .set({
                monthly_income,
                current_savings,
                debt,
                financial_goals,
                risk_management,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.userFinancial.user_id, req.user.id));
            response_1.createResponse.success({
                res,
                message: "Financial profile created successfully",
                data: {
                    monthly_income,
                    current_savings,
                    debt,
                    financial_goals,
                    risk_management,
                },
            });
        }
        catch (error) {
            console.log(error, "Error occurred while creating the financial profile");
            response_1.createResponse.error({
                res,
                status: 500,
                message: "An error occurred while creating the financial profile",
            });
        }
    }),
};
