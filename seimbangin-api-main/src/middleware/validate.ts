import { check } from "express-validator";

const validate = {
  register: [
    check("full_name").isString(),
    check("username").isString(),
    check("email").isEmail(),
    check("age").isNumeric().optional(),
    check("password").isLength({ min: 3 }),
  ],
  login: [check("email").isEmail(), check("password").isLength({ min: 3 })],
  transaction: [
    check("type").isNumeric(),
    check("category").isString(),
    check("amount").isNumeric(),
    check("description").isString(),
  ],
  createFinancialProfile: [
    check("monthly_income").isNumeric().optional(),
    check("current_savings").isNumeric().optional(),
    check("debt").isNumeric().optional(),
    check("financial_goals").isString().optional(),
    check("risk_management").isString().optional(),
  ],
};

export default validate;
