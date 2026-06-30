import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { formatUser, ROLE_TO_DB, ROLE_FROM_DB } from "../app.js";

// Helper to validate positive integer IDs (PostgreSQL bigint)
const isValidId = (id) => /^\d+$/.test(id);

/**
 * GET /api/users
 * List all users (Admin only)
 */
export async function listUsers(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const result = await pool.query(
      "SELECT user_id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC"
    );

    const formattedUsers = result.rows.map(row => formatUser(row));

    return res.json({
      success: true,
      message: "Users retrieved successfully.",
      data: { users: formattedUsers },
    });
  } catch (error) {
    console.error("List users error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
    });
  }
}

/**
 * GET /api/users/:id
 * View one user's information (Admin or own profile)
 */
export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Role check: Admin can view anyone; Users can only view themselves
    if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own profile.",
      });
    }

    const result = await pool.query(
      "SELECT user_id, name, email, role, phone, created_at FROM users WHERE user_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User retrieved successfully.",
      data: { user: formatUser(result.rows[0]) },
    });
  } catch (error) {
    console.error("Get user by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user.",
    });
  }
}

/**
 * PUT /api/users/:id
 * Update user information (Admin or own profile)
 */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, phone, password, role } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Role check: Admin can update anyone; Users can only update themselves
    if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own profile.",
      });
    }

    // Retrieve existing user
    const existingResult = await pool.query(
      "SELECT user_id, name, email, role, phone, password FROM users WHERE user_id = $1",
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentUser = existingResult.rows[0];

    // Field-level validations if provided
    if (firstname !== undefined && !firstname.trim()) {
      return res.status(400).json({ success: false, message: "First name cannot be empty." });
    }
    if (lastname !== undefined && !lastname.trim()) {
      return res.status(400).json({ success: false, message: "Last name cannot be empty." });
    }
    if (email !== undefined && !email.trim()) {
      return res.status(400).json({ success: false, message: "Email cannot be empty." });
    }
    if (password !== undefined && (!password || password.length < 6)) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    // Email duplication check
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      const dupCheck = await pool.query(
        "SELECT user_id FROM users WHERE email = $1 AND user_id != $2",
        [normalizedEmail, id]
      );
      if (dupCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another user.",
        });
      }
    }

    // Name formatting logic
    const [currFirst, ...currRest] = currentUser.name?.trim().split(/\s+/) || [];
    const currLast = currRest.join(" ");
    const finalFirst = (firstname !== undefined ? firstname : currFirst).trim();
    const finalLast = (lastname !== undefined ? lastname : currLast).trim();
    const finalName = `${finalFirst} ${finalLast}`.trim();

    const finalEmail = (email !== undefined ? email.trim().toLowerCase() : currentUser.email);
    const finalPhone = (phone !== undefined ? phone : currentUser.phone);

    // Role change check
    let finalRole = currentUser.role;
    if (role !== undefined) {
      const normalizedRole = role.toUpperCase();
      if (!ROLE_TO_DB[normalizedRole]) {
        return res.status(400).json({
          success: false,
          message: "Invalid role value.",
        });
      }

      const targetDbRole = ROLE_TO_DB[normalizedRole];
      if (targetDbRole !== currentUser.role) {
        if (req.user.role !== "ADMIN") {
          return res.status(403).json({
            success: false,
            message: "Only administrators can update user roles.",
          });
        }
        finalRole = targetDbRole;
      }
    }

    // Password hashing if changed
    const finalPassword = password
      ? await bcrypt.hash(password, 10)
      : currentUser.password;

    // Execute update
    const updateResult = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, phone = $3, role = $4, password = $5
       WHERE user_id = $6
       RETURNING user_id, name, email, role, phone, created_at`,
      [finalName, finalEmail, finalPhone, finalRole, finalPassword, id]
    );

    return res.json({
      success: true,
      message: "User updated successfully.",
      data: { user: formatUser(updateResult.rows[0]) },
    });
  } catch (error) {
    console.error("Update user error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
}

/**
 * DELETE /api/users/:id
 * Delete a user (Admin only)
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Check if user exists
    const checkResult = await pool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Execute delete
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    return res.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
}
