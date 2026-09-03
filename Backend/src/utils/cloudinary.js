import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

/**
 * Upload a local file to Cloudinary.
 * @param {string} localFilePath - Path of the locally stored temporary file.
 * @param {string} folder - Target folder in Cloudinary (defaults to "geargrid/products").
 * @returns {Promise<object|null>} Cloudinary upload response object or null.
 */
export const uploadOnCloudinary = async (localFilePath, folder = "geargrid/products") => {
  try {
    if (!localFilePath) return null;
    configureCloudinary();

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: folder,
      use_filename: true,
      unique_filename: true,
    });

    // Remove the locally saved temporary file on successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Remove the locally saved temporary file on failure
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

/**
 * Delete an asset from Cloudinary by public ID.
 * @param {string} publicId - Cloudinary asset public ID.
 * @returns {Promise<object|null>} Cloudinary destroy response object or null.
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    configureCloudinary();
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.error("Cloudinary asset deletion error:", error?.message || error);
    return null;
  }
};
