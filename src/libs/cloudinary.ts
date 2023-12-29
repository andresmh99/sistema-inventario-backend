import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME?.toString(),
  api_key: process.env.API_KEY?.toString(),
  api_secret: process.env.API_SECRET?.toString(),
  secure: true,
});

export const uploadsImage = async (filePath: string) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "sistema-Inventario",
  });
};

export const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};
