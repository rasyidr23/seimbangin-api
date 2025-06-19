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
exports.transactionController = void 0;
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const express_validator_1 = require("express-validator");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../utils/response");
const createNewBalance = ({ type, amount, balance, }) => {
    const newBalance = type == 0
        ? Number(balance) + Number(amount)
        : Number(balance) - Number(amount);
    return newBalance.toString();
};
const updateBalance = (_a) => __awaiter(void 0, [_a], void 0, function* ({ newBalance, userId }) {
    try {
        yield db_1.default
            .update(schema_1.usersTable)
            .set({
            balance: newBalance,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, userId));
        return { success: true, message: "Balance updated successfully" };
    }
    catch (error) {
        return { success: false, message: "Error updating balance" };
    }
});
exports.transactionController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { type, category, amount, description } = req.body;
        const user = yield db_1.default.query.usersTable.findFirst({
            where: (user, { eq }) => eq(user.id, req.user.id),
        });
        if (!user) {
            res.status(404).send({
                status: "error",
                message: "User not found",
            });
            return;
        }
        const balance = parseFloat(user.balance);
        const transactionAmount = parseFloat(amount);
        if (type == 1 && balance < transactionAmount) {
            res.status(400).send({
                status: "error",
                message: "Insufficient balance",
                data: {
                    balance: user.balance,
                    amount,
                },
            });
            return;
        }
        try {
            yield db_1.default.insert(schema_1.transactionsTable).values({
                user_id: req.user.id,
                type,
                category,
                amount,
                description,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const newBalance = createNewBalance({
                type,
                amount,
                balance: user.balance,
            });
            const balanceUpdate = yield updateBalance({
                newBalance,
                userId: req.user.id,
            });
            if (!balanceUpdate.success) {
                res.status(500).send({
                    status: "error",
                    message: "Error creating transaction",
                });
                return;
            }
            res.send({
                status: "success",
                message: "Transaction created successfully",
                data: {
                    user_id: req.user.id,
                    balance: newBalance,
                    type,
                    category,
                    amount,
                    description,
                },
            });
        }
        catch (error) {
            res.status(500).send({
                status: "error",
                message: "Error creating transaction",
                error: error,
            });
            return;
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // get query params
        const { limit, page } = req.query;
        const offset = limit && page ? Number(limit) * (Number(page) - 1) : undefined;
        const userId = req.user.id;
        const transactions = yield db_1.default.query.transactionsTable.findMany({
            where: (transaction, { eq }) => eq(transaction.user_id, userId),
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        });
        const totalData = yield db_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.transactionsTable)
            .then((data) => {
            return Number(data[0].count);
        });
        response_1.createResponse.success({
            res,
            message: "Transactions retrieved successfully",
            data: transactions,
            meta: {
                currentPage: page || 1,
                limit: Number(limit) || transactions.length,
                totalItems: totalData,
                totalPages: Math.ceil(totalData / (Number(limit) || transactions.length)),
                hasNextPage: totalData >
                    (Number(limit) || transactions.length) * (Number(page) || 1),
                hasPreviousPage: Number(page) > 1,
            },
        });
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const transactionId = Number(req.params.id);
        const transaction = yield db_1.default.query.transactionsTable.findFirst({
            where: (transaction, { eq }) => eq(transaction.id, transactionId),
        });
        if (!transaction) {
            response_1.createResponse.error({
                res,
                status: 404,
                message: "Transaction not found",
            });
            return;
        }
        try {
            const transactionType = transaction.type == 0 ? 1 : 0;
            const userBalance = yield db_1.default.query.usersTable.findFirst({
                where: (user, { eq }) => eq(user.id, req.user.id),
            });
            const newBalance = createNewBalance({
                type: transactionType,
                amount: transaction.amount,
                balance: (userBalance === null || userBalance === void 0 ? void 0 : userBalance.balance) || "0",
            });
            yield db_1.default
                .delete(schema_1.transactionsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.transactionsTable.id, transactionId));
            // if transaction type is income, subtract amount from balance
            const balanceUpdate = yield updateBalance({
                newBalance,
                userId: req.user.id,
            });
            if (!balanceUpdate.success) {
                response_1.createResponse.error({
                    res,
                    status: 500,
                    message: "Error deleting transaction",
                });
                return;
            }
            response_1.createResponse.success({
                res,
                message: "Transaction deleted successfully",
                data: {
                    amount: transaction.amount,
                    balance: newBalance,
                },
            });
        }
        catch (error) {
            response_1.createResponse.error({
                res,
                status: 500,
                message: "Error deleting transaction",
            });
            return;
        }
    }),
};
