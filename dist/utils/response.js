"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = void 0;
exports.createResponse = {
    success: ({ res, message, data, meta }) => {
        res.json({
            status: "success",
            code: 200,
            message,
            data,
            meta,
        });
    },
    error: ({ res, status = 500, message = "An error occurred", data = null, }) => {
        res.status(status).json({
            status: "error",
            code: status,
            message,
            data,
        });
    },
};
