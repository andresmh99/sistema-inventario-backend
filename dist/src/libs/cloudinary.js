"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadsImage = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: (_a = process.env.CLOUD_NAME) === null || _a === void 0 ? void 0 : _a.toString(),
    api_key: (_b = process.env.API_KEY) === null || _b === void 0 ? void 0 : _b.toString(),
    api_secret: (_c = process.env.API_SECRET) === null || _c === void 0 ? void 0 : _c.toString(),
    secure: true,
});
const uploadsImage = async (filePath) => {
    return await cloudinary_1.v2.uploader.upload(filePath, {
        folder: "sistema-Inventario",
    });
};
exports.uploadsImage = uploadsImage;
const deleteImage = async (publicId) => {
    return await cloudinary_1.v2.uploader.destroy(publicId);
};
exports.deleteImage = deleteImage;
