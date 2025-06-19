"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsTable = exports.userFinancial = exports.usersTable = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const transactionCategoryEnums = (0, mysql_core_1.mysqlEnum)("category", [
    "food",
    "transportation",
    "utilities",
    "entertainment",
    "shopping",
    "healthcare",
    "education",
    "others",
]);
const riskManagementEnums = (0, mysql_core_1.mysqlEnum)("risk_management", [
    "low",
    "medium",
    "high",
]);
// user table schema
exports.usersTable = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.bigint)({ mode: "number" }).primaryKey().autoincrement(),
    role: (0, mysql_core_1.int)().notNull().default(0).notNull(), // 0 for user, 1 for admin
    full_name: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, mysql_core_1.int)().notNull().default(17),
    balance: (0, mysql_core_1.decimal)({ precision: 16, scale: 2 }).notNull().default("0.0"),
    username: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    profilePicture: (0, mysql_core_1.varchar)("profile_picture", { length: 256 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at"),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at"),
});
exports.userFinancial = (0, mysql_core_1.mysqlTable)("user_financial_profile", {
    id: (0, mysql_core_1.bigint)({ mode: "number" }).primaryKey().autoincrement(),
    user_id: (0, mysql_core_1.bigint)({ mode: "number" })
        .references(() => exports.usersTable.id)
        .notNull(),
    monthly_income: (0, mysql_core_1.decimal)({ precision: 16, scale: 2 }),
    current_savings: (0, mysql_core_1.decimal)({ precision: 16, scale: 2 }),
    debt: (0, mysql_core_1.decimal)({ precision: 16, scale: 2 }),
    financial_goals: (0, mysql_core_1.text)(),
    risk_management: riskManagementEnums,
});
exports.transactionsTable = (0, mysql_core_1.mysqlTable)("transactions", {
    id: (0, mysql_core_1.bigint)({ mode: "number" }).primaryKey().autoincrement(),
    user_id: (0, mysql_core_1.bigint)({ mode: "number" })
        .references(() => exports.usersTable.id)
        .notNull(),
    type: (0, mysql_core_1.int)().notNull().default(0), // 0 for income , 1 for expense
    category: transactionCategoryEnums.notNull(),
    amount: (0, mysql_core_1.decimal)().notNull(),
    description: (0, mysql_core_1.text)("description"),
    createdAt: (0, mysql_core_1.timestamp)("created_at"),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at"),
});
