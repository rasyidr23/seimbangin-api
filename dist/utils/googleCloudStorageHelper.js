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
exports.gcsHelper = exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const googleCloudStorageConfig_1 = require("../config/googleCloudStorageConfig");
const multerUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.multerUpload = multerUpload;
const bucketName = process.env.BUCKET_NAME || "";
const gcsHelper = {
    uploadFile: (_a) => __awaiter(void 0, [_a], void 0, function* ({ file, folder }) {
        return new Promise((resolve, reject) => {
            const blob = googleCloudStorageConfig_1.bucket.file(`${folder}/${file.originalname}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream
                .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
                const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
                yield blob.makePublic();
                resolve(publicUrl);
            }))
                .on("error", reject)
                .end(file.buffer);
        });
    }),
};
exports.gcsHelper = gcsHelper;
