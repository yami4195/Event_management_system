import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from multer memoryStorage
 * @param {string} [folder] - Optional Cloudinary folder path
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export function uploadToCloudinary(fileBuffer, folder = "event_management") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId - The Cloudinary public_id
 * @returns {Promise<object>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    // Don't throw — image cleanup failure shouldn't break the main operation
    return null;
  }
}
