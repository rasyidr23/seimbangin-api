import {
  bigint,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const transactionCategoryEnums = mysqlEnum("category", [
  "food",
  "transportation",
  "utilities",
  "entertainment",
  "shopping",
  "healthcare",
  "education",
  "others",
]);

const riskManagementEnums = mysqlEnum("risk_management", [
  "low",
  "medium",
  "high",
]);

// user table schema
export const usersTable = mysqlTable("users", {
  id: bigint({ mode: "number" }).primaryKey().autoincrement(),
  role: int().notNull().default(0).notNull(), // 0 for user, 1 for admin
  full_name: varchar({ length: 255 }).notNull(),
  age: int().notNull().default(17),
  balance: decimal({ precision: 16, scale: 2 }).notNull().default("0.0"),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  profilePicture: varchar("profile_picture", { length: 256 }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userFinancial = mysqlTable("user_financial_profile", {
  id: bigint({ mode: "number" }).primaryKey().autoincrement(),
  user_id: bigint({ mode: "number" })
    .references(() => usersTable.id)
    .notNull(),
  monthly_income: decimal({ precision: 16, scale: 2 }),
  current_savings: decimal({ precision: 16, scale: 2 }),
  debt: decimal({ precision: 16, scale: 2 }),
  financial_goals: text(),
  risk_management: riskManagementEnums,
});

export const transactionsTable = mysqlTable("transactions", {
  id: bigint({ mode: "number" }).primaryKey().autoincrement(),
  user_id: bigint({ mode: "number" })
    .references(() => usersTable.id)
    .notNull(),
  type: int().notNull().default(0), // 0 for income , 1 for expense
  category: transactionCategoryEnums.notNull(),
  amount: decimal().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
