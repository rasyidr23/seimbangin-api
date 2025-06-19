"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        response_1.createResponse.error({
            res,
            status: 401,
            message: "Unauthorized",
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
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, user) => {
        if (err) {
            response_1.createResponse.error({
                res,
                status: 403,
                message: "Forbidden",
            });
            return;
        }
        req.user = user;
        next();
    });
};
exports.default = authenticateJWT;
