import pool from "../config/db.js";

// Helper to validate positive integer IDs (PostgreSQL bigint)
const isValidId = (id) => /^\d+$/.test(id);

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
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
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
    const { firstname, lastname, phone, city, subcity, house_number, housenumber, profile_picture } = req.body;

    // Validate name inputs
    if (!firstname?.trim()) {
      return res.status(400).json({ success: false, message: "First name is required." });
    }
    if (!lastname?.trim()) {
      return res.status(400).json({ success: false, message: "Last name is required." });
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

    // Insert new profile
    const result = await pool.query(
      `INSERT INTO profiles (user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture, created_at`,
      [
        userId,
        firstname.trim(),
        lastname.trim(),
        phone ? phone.trim() : null,
        city ? city.trim() : null,
        subcity ? subcity.trim() : null,
        (house_number ?? housenumber ?? "") ? String(house_number ?? housenumber ?? "").trim() : null,
        profile_picture ? profile_picture.trim() : null,
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
    const { firstname, lastname, phone, city, subcity, house_number, housenumber, profile_picture } = req.body;

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
    const existing = await pool.query(
      `SELECT profile_id, user_id, firstname, lastname, phone, city, subcity, house_number, profile_picture 
       FROM profiles 
       WHERE user_id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    const currentProfile = existing.rows[0];

    // Validate inputs if provided
    if (firstname !== undefined && !firstname.trim()) {
      return res.status(400).json({ success: false, message: "First name cannot be empty." });
    }
    if (lastname !== undefined && !lastname.trim()) {
      return res.status(400).json({ success: false, message: "Last name cannot be empty." });
    }

    // Merge updates
    const finalFirstname = firstname !== undefined ? firstname.trim() : currentProfile.firstname;
    const finalLastname = lastname !== undefined ? lastname.trim() : currentProfile.lastname;
    const finalPhone = phone !== undefined ? (phone ? phone.trim() : null) : currentProfile.phone;
    const finalCity = city !== undefined ? (city ? city.trim() : null) : currentProfile.city;
    const finalSubcity = subcity !== undefined ? (subcity ? subcity.trim() : null) : currentProfile.subcity;
    const finalHouseNumber = house_number !== undefined || housenumber !== undefined
      ? ((house_number ?? housenumber ?? "") ? String(house_number ?? housenumber ?? "").trim() : null)
      : currentProfile.house_number;
    const finalProfilePicture = profile_picture !== undefined ? (profile_picture ? profile_picture.trim() : null) : currentProfile.profile_picture;

    // Execute update
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

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: { profile: result.rows[0] },
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
