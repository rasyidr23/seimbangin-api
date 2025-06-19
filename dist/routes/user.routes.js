"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleCloudStorageHelper_1 = require("../utils/googleCloudStorageHelper");
const user_1 = require("../controllers/user");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const userRouter = (0, express_1.Router)();
userRouter.get("/profile", jwt_1.default, user_1.UserController.detail);
userRouter.post("/upload-pfp", jwt_1.default, googleCloudStorageHelper_1.multerUpload.single("photo"), user_1.UserController.uploadPfp);
userRouter.put("/", jwt_1.default, user_1.UserController.update);
exports.default = userRouter;
