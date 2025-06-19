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
const bcryptjs_1 = require("bcryptjs");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const authController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // check validaion from express-validator
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            response_1.createResponse.error({
                res,
                status: 400,
                message: "Validation Error",
                data: errors.array(),
            });
            return;
        }
        // check if email already exists
        const emailExists = yield db_1.default
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.sql) `${schema_1.usersTable.email} = ${req.body.email}`);
        if (emailExists.length > 0) {
            response_1.createResponse.error({
                res,
                status: 400,
                message: "Email already exists",
            });
            return;
        }
        // destructure the required fields
        const { full_name, username, email, password, age } = req.body;
        try {
            // hash the password
            const salt = yield (0, bcryptjs_1.genSalt)(10);
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, salt);
            try {
                // insert the user into the database
                yield db_1.default.insert(schema_1.usersTable).values({
                    full_name,
                    username,
                    email,
                    age,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            catch (error) {
                response_1.createResponse.error({
                    res,
                    status: 500,
                    message: "Error occurred while inserting the user",
                });
                return;
            }
            response_1.createResponse.success({
                res,
                message: "User registered successfully",
            });
        }
        catch (error) {
            response_1.createResponse.error({
                res,
                status: 500,
                message: "Error occurred while hashing the password",
            });
            return;
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            response_1.createResponse.error({
                res,
                status: 400,
                message: "Validation Error",
                data: errors.array(),
            });
        }
        const { password, email } = req.body;
        const queryUser = yield db_1.default
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.sql) `${schema_1.usersTable.email} = ${email}`);
        if (queryUser.length == 0) {
            response_1.createResponse.error({
                res,
                status: 404,
                message: "User not found",
            });
        }
        const existingUser = queryUser[0];
        const passwordMatch = yield (0, bcryptjs_1.compare)(password, existingUser.password);
        if (!passwordMatch) {
            response_1.createResponse.error({
                res,
                status: 401,
                message: "Invalid credentials",
            });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).send({
                error: "Internal Server Error, JWT LOM DISET COKK",
            });
            return;
        }
        try {
            const expiresIn = 3600;
            const token = jsonwebtoken_1.default.sign(existingUser, jwtSecret, {
                expiresIn: expiresIn,
            });
            response_1.createResponse.success({
                res,
                message: "Login Success",
                data: {
                    token,
                    expiresIn,
                },
            });
        }
        catch (error) {
            response_1.createResponse.error({
                res,
                status: 500,
                message: "Error occurred while creating the token",
            });
            return;
        }
    }),
};
exports.default = authController;
