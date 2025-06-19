"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate = {
    register: [
        (0, express_validator_1.check)("full_name").isString(),
        (0, express_validator_1.check)("username").isString(),
        (0, express_validator_1.check)("email").isEmail(),
        (0, express_validator_1.check)("age").isNumeric().optional(),
        (0, express_validator_1.check)("password").isLength({ min: 3 }),
    ],
    login: [(0, express_validator_1.check)("email").isEmail(), (0, express_validator_1.check)("password").isLength({ min: 3 })],
    transaction: [
        (0, express_validator_1.check)("type").isNumeric(),
        (0, express_validator_1.check)("category").isString(),
        (0, express_validator_1.check)("amount").isNumeric(),
        (0, express_validator_1.check)("description").isString(),
    ],
    createFinancialProfile: [
        (0, express_validator_1.check)("monthly_income").isNumeric().optional(),
        (0, express_validator_1.check)("current_savings").isNumeric().optional(),
        (0, express_validator_1.check)("debt").isNumeric().optional(),
        (0, express_validator_1.check)("financial_goals").isString().optional(),
        (0, express_validator_1.check)("risk_management").isString().optional(),
    ],
};
exports.default = validate;
