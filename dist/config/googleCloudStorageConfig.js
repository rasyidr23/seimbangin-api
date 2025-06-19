"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const storage_1 = require("@google-cloud/storage");
const googleCredential = process.env.GOOGLE_CLOUD_CREDENTIALS || "";
const storage = new storage_1.Storage({
    credentials: JSON.parse(googleCredential),
});
const bucketName = process.env.BUCKET_NAME || "";
const bucket = storage.bucket(bucketName);
exports.bucket = bucket;
