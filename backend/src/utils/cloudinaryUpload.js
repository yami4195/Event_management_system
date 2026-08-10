import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Upload a file buffer, base64 Data URI, or URL to Cloudinary.
 * @param {Buffer|string} input - File buffer or base64 Data URI string / URL
 * @param {string} [folder] - Optional Cloudinary folder path
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export function uploadToCloudinary(input, folder = "event_management") {
  return new Promise((resolve, reject) => {
    if (typeof input === "string") {
      // Direct Cloudinary upload for base64 Data URIs or HTTPS image URLs
      cloudinary.uploader.upload(
        input,
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary string upload error:", error.message || error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
    } else if (Buffer.isBuffer(input)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary stream upload error:", error.message || error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      streamifier.createReadStream(input).pipe(uploadStream);
    } else {
      reject(new Error("Invalid image input type for Cloudinary upload."));
    }
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
    return null;
  }
}
