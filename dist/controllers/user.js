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
exports.UserController = void 0;
const googleCloudStorageHelper_1 = require("../utils/googleCloudStorageHelper");
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.UserController = {
    detail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        try {
            const user = yield db_1.default
                .select({
                id: schema_1.usersTable.id,
                full_name: schema_1.usersTable.full_name,
                age: schema_1.usersTable.age,
                balance: schema_1.usersTable.balance,
                username: schema_1.usersTable.username,
                email: schema_1.usersTable.email,
                profilePicture: schema_1.usersTable.profilePicture,
                createdAt: schema_1.usersTable.createdAt,
                updatedAt: schema_1.usersTable.updatedAt,
                finance_profile: {
                    monthly_income: schema_1.userFinancial.monthly_income,
                    current_savings: schema_1.userFinancial.current_savings,
                    debt: schema_1.userFinancial.debt,
                    financial_goals: schema_1.userFinancial.financial_goals,
                    risk_management: schema_1.userFinancial.risk_management,
                },
            })
                .from(schema_1.usersTable)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, userId))
                .leftJoin(schema_1.userFinancial, (0, drizzle_orm_1.eq)(schema_1.usersTable.id, schema_1.userFinancial.user_id))
                .then((rows) => rows[0]);
            res.send({
                status: "success",
                data: user,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                message: "An error occurred while fetching the user",
            });
        }
    }),
    uploadPfp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        if (!userId) {
            res.status(400).send({
                status: "error",
                message: "Please provide a user ID",
            });
            return;
        }
        const photo = req.file;
        if (!photo) {
            res.status(400).send({
                status: "error",
                message: "Please upload a file",
                file: photo,
            });
            return;
        }
        try {
            const fileUrl = yield googleCloudStorageHelper_1.gcsHelper.uploadFile({
                file: photo,
                folder: "profile-pictures",
            });
            yield db_1.default
                .update(schema_1.usersTable)
                .set({ profilePicture: fileUrl, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, parseInt(userId)));
            res.send({
                status: "success",
                data: {
                    url: fileUrl,
                },
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                message: "An error occurred while uploading the file",
            });
            return;
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const { full_name, age, balance, username, email } = req.body;
        const payload = {
            full_name,
            age,
            balance,
            username,
            email,
        };
        try {
            yield db_1.default
                .update(schema_1.usersTable)
                .set(payload)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, parseInt(userId)));
            res.send({
                status: "success",
                message: "User updated successfully",
                data: payload,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                message: "An error occurred while updating the user",
            });
        }
    }),
};
