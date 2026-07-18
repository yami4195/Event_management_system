import pool from "../config/db.js";
import { validate as isUuid } from "uuid";

// Helper to validate UUID-based IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);

/**
 * GET /api/categories
 * View all categories (All authenticated users)
 */
export async function listCategories(req, res) {
  try {
    const result = await pool.query(
      "SELECT category_id, name, description, created_at FROM categories ORDER BY name ASC"
    );
console.log("List categories result:", result.rows);
    return res.json({
      success: true,
      message: "Categories retrieved successfully.",
      data: { categories: result.rows },
    });
  } catch (error) {
    console.error("List categories error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories.",
    });
  }
}

/**
 * GET /api/categories/:id
 * View a specific category (All authenticated users)
 */
export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format.",
      });
    }

    const result = await pool.query(
      "SELECT category_id, name, description, created_at FROM categories WHERE category_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.json({
      success: true,
      message: "Category retrieved successfully.",
      data: { category: result.rows[0] },
    });
  } catch (error) {
    console.error("Get category by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve category.",
    });
  }
}

/**
 * POST /api/categories
 * Create a new category (Admin only)
 */
export async function createCategory(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // Check uniqueness (case-insensitive)
    const normalizedName = name.trim();
    const existing = await pool.query(
      "SELECT category_id FROM categories WHERE LOWER(name) = LOWER($1)",
      [normalizedName]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING category_id, name, description, created_at`,
      [normalizedName, description ? description.trim() : null]
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: { category: result.rows[0] },
    });
  } catch (error) {
    console.error("Create category error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
    });
  }
}

/**
 * PUT /api/categories/:id
 * Update a category (Admin only)
 */
export async function updateCategory(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format.",
      });
    }

    // Retrieve existing category
    const existing = await pool.query(
      "SELECT category_id, name, description, created_at FROM categories WHERE category_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const currentCategory = existing.rows[0];

    // Validate if name is provided and empty
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot be empty.",
      });
    }

    // Check uniqueness if name is changed
    let finalName = currentCategory.name;
    if (name !== undefined) {
      const normalizedName = name.trim();
      if (normalizedName.toLowerCase() !== currentCategory.name.toLowerCase()) {
        const dupCheck = await pool.query(
          "SELECT category_id FROM categories WHERE LOWER(name) = LOWER($1) AND category_id != $2",
          [normalizedName, id]
        );
        if (dupCheck.rows.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Category name already exists.",
          });
        }
      }
      finalName = normalizedName;
    }

    const finalDesc = description !== undefined ? (description ? description.trim() : null) : currentCategory.description;

    const result = await pool.query(
      `UPDATE categories
       SET name = $1, description = $2
       WHERE category_id = $3
       RETURNING category_id, name, description, created_at`,
      [finalName, finalDesc, id]
    );

    return res.json({
      success: true,
      message: "Category updated successfully.",
      data: { category: result.rows[0] },
    });
  } catch (error) {
    console.error("Update category error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
    });
  }
}

/**
 * DELETE /api/categories/:id
 * Delete a category (Admin only)
 */
export async function deleteCategory(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format.",
      });
    }

    // Check if category exists
    const existing = await pool.query(
      "SELECT category_id FROM categories WHERE category_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check if category is being used by events
    const eventCheck = await pool.query(
      "SELECT event_id FROM events WHERE category_id = $1 LIMIT 1",
      [id]
    );

    if (eventCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because it is currently used by one or more events.",
      });
    }

    // Execute delete
    await pool.query("DELETE FROM categories WHERE category_id = $1", [id]);

    return res.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
}
