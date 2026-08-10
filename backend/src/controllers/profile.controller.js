import pool from "../config/db.js";
import { validate as isUuid } from "uuid";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// Helper to validate UUID user IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);

/**
 * GET /api/profiles
 * View all user profiles (Admin only)
 */
export async function listProfiles(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const result = await pool.query(
      `SELECT profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture, created_at 
       FROM profiles 
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      message: "Profiles retrieved successfully.",
      data: { profiles: result.rows },
    });
  } catch (error) {
    console.error("List profiles error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profiles.",
    });
  }
}

/**
 * GET /api/profiles/:id
 * View a specific user's profile (Owner or Admin)
 */
export async function getProfileByUserId(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Access control check: Profile owner or Admin only
    if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own profile.",
      });
    }

    const result = await pool.query(
      `SELECT profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture, created_at 
       FROM profiles 
       WHERE user_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      const userRes = await pool.query(
        `SELECT user_id, firstname, lastname, phone, created_at FROM users WHERE user_id = $1`,
        [id]
      );

      if (userRes.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const u = userRes.rows[0];
      return res.json({
        success: true,
        message: "Profile retrieved successfully.",
        data: {
          profile: {
            profile_id: null,
            user_id: u.user_id,
            firstname: u.firstname,
            lastname: u.lastname,
            phone: u.phone,
            city: null,
            subcity: null,
            house_number: null,
            profile_picture: null,
            created_at: u.created_at,
          },
        },
      });
    }

    return res.json({
      success: true,
      message: "Profile retrieved successfully.",
      data: { profile: result.rows[0] },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile.",
    });
  }
}

/**
 * POST /api/profiles
 * Create a profile for the authenticated user
 */
export async function createProfile(req, res) {
  try {
    const userId = req.user.id;
    const { firstname, lastname, phone, city, subcity, house_number, housenumber, profile_picture, name } = req.body;

    let fname = firstname;
    let lname = lastname;
    if ((!fname || !lname) && name) {
      const parts = name.trim().split(" ");
      fname = fname || parts[0];
      lname = lname || parts.slice(1).join(" ") || "";
    }

    if (!fname?.trim()) {
      fname = "Organizer";
    }

    // Check if the user already has a profile
    const existing = await pool.query(
      "SELECT profile_id FROM profiles WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists for this user.",
      });
    }

    // Process Cloudinary Image Upload
    let finalProfilePicture = profile_picture ? profile_picture.trim() : null;
    let imageInput = null;

    if (req.file && req.file.buffer) {
      imageInput = req.file.buffer;
    } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim()) {
      imageInput = req.body.image.trim();
    }

    if (imageInput) {
      try {
        const cloudinaryResult = await uploadToCloudinary(imageInput, `event_management/profiles/${userId}`);
        finalProfilePicture = cloudinaryResult.url;
      } catch (uploadErr) {
        console.error("Profile picture Cloudinary upload failed:", uploadErr.message || uploadErr);
        if (typeof imageInput === "string" && (imageInput.startsWith("http://") || imageInput.startsWith("https://"))) {
          finalProfilePicture = imageInput;
        }
      }
    }

    // Insert new profile
    const result = await pool.query(
      `INSERT INTO profiles (user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture, created_at`,
      [
        userId,
        fname.trim(),
        (lname || "").trim(),
        phone ? phone.trim() : null,
        city ? city.trim() : null,
        subcity ? subcity.trim() : null,
        (house_number ?? housenumber ?? "") ? String(house_number ?? housenumber ?? "").trim() : null,
        finalProfilePicture,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      data: { profile: result.rows[0] },
    });
  } catch (error) {
    console.error("Create profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create profile.",
    });
  }
}

/**
 * PUT /api/profiles/:id
 * Update profile information (Owner or Admin)
 */
export async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const { firstname, lastname, phone, city, subcity, house_number, housenumber, profile_picture, name } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Access control check: Profile owner or Admin only
    if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own profile.",
      });
    }

    // Get current profile
    let currentProfile = null;
    const existing = await pool.query(
      `SELECT profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture 
       FROM profiles 
       WHERE user_id = $1`,
      [id]
    );

    if (existing.rows.length > 0) {
      currentProfile = existing.rows[0];
    } else {
      const userRes = await pool.query(
        `SELECT user_id, firstname, lastname, phone FROM users WHERE user_id = $1`,
        [id]
      );
      if (userRes.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      const u = userRes.rows[0];
      currentProfile = {
        profile_id: null,
        user_id: u.user_id,
        firstname: u.firstname,
        lastname: u.lastname,
        phone: u.phone,
        city: null,
        subcity: null,
        house_number: null,
        profile_picture: null,
      };
    }

    // Handle Image Upload to Cloudinary
    let finalProfilePicture = currentProfile.profile_picture;
    let imageInput = null;

    if (req.file && req.file.buffer) {
      imageInput = req.file.buffer;
    } else if (req.body.image && typeof req.body.image === "string" && req.body.image.trim()) {
      imageInput = req.body.image.trim();
    } else if (profile_picture && typeof profile_picture === "string" && profile_picture.trim()) {
      imageInput = profile_picture.trim();
    }

    if (imageInput) {
      try {
        const cloudinaryResult = await uploadToCloudinary(imageInput, `event_management/profiles/${id}`);
        finalProfilePicture = cloudinaryResult.url;
      } catch (uploadErr) {
        console.error("Profile picture upload to Cloudinary failed:", uploadErr.message || uploadErr);
        if (typeof imageInput === "string" && (imageInput.startsWith("http://") || imageInput.startsWith("https://"))) {
          finalProfilePicture = imageInput;
        }
      }
    }

    let fname = firstname;
    let lname = lastname;
    if ((!fname || !lname) && name) {
      const parts = name.trim().split(" ");
      fname = fname || parts[0];
      lname = lname || parts.slice(1).join(" ") || "";
    }

    const finalFirstname = fname !== undefined ? fname.trim() : currentProfile.firstname || "Organizer";
    const finalLastname = lname !== undefined ? lname.trim() : currentProfile.lastname || "";
    const finalPhone = phone !== undefined ? (phone ? phone.trim() : null) : currentProfile.phone;
    const finalCity = city !== undefined ? (city ? city.trim() : null) : currentProfile.city;
    const finalSubcity = subcity !== undefined ? (subcity ? subcity.trim() : null) : currentProfile.subcity;
    const finalHouseNumber = house_number !== undefined || housenumber !== undefined
      ? ((house_number ?? housenumber ?? "") ? String(house_number ?? housenumber ?? "").trim() : null)
      : currentProfile.house_number;

    let savedProfile = null;

    if (currentProfile.profile_id) {
      const result = await pool.query(
        `UPDATE profiles
         SET firstname = $1, lastname = $2, phone = $3, city = $4, subcity = $5, house_number = $6, profile_picture = $7
         WHERE user_id = $8
         RETURNING profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture, created_at`,
        [
          finalFirstname,
          finalLastname,
          finalPhone,
          finalCity,
          finalSubcity,
          finalHouseNumber,
          finalProfilePicture,
          id,
        ]
      );
      savedProfile = result.rows[0];
    } else {
      const result = await pool.query(
        `INSERT INTO profiles (user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture, created_at`,
        [
          id,
          finalFirstname,
          finalLastname,
          finalPhone,
          finalCity,
          finalSubcity,
          finalHouseNumber,
          finalProfilePicture,
        ]
      );
      savedProfile = result.rows[0];
    }

    // Sync firstname, lastname, phone with users table
    try {
      await pool.query(
        `UPDATE users
         SET firstname = $1, lastname = $2, phone = COALESCE($3, phone)
         WHERE user_id = $4`,
        [finalFirstname, finalLastname, finalPhone, id]
      );
    } catch (uErr) {
      console.warn("User table sync warning:", uErr.message);
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: { profile: savedProfile },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
}

/**
 * DELETE /api/profiles/:id
 * Delete a profile (Owner or Admin)
 */
export async function deleteProfile(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Access control check: Profile owner or Admin only
    if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own profile.",
      });
    }

    // Check if profile exists
    const existing = await pool.query(
      "SELECT profile_id FROM profiles WHERE user_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // Execute delete
    await pool.query("DELETE FROM profiles WHERE user_id = $1", [id]);

    return res.json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete profile.",
    });
  }
}
