import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: "dauqo5bwv",
  api_key: "116293482467613",
  api_secret: "_zoRrTBdkapcpeleEy9BTdxjqGc", 
});

const UploadOnCloudinary = async (localFilePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    await fs.unlink(localFilePath); 
    return uploadResult.url; 
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    await fs.unlink(localFilePath); 
    throw error; 
  }
};

export default UploadOnCloudinary;
