import pool from "../config/db.js";
import { validate as isUuid } from "uuid";
import { sendNotificationToUser } from "../services/socket.service.js";

// Helper to validate UUID-based IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user.
 */
export async function listNotifications(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT notification_id, user_id, event_id, message, "type", is_read, sent_at
       FROM notifications 
       WHERE user_id = $1
       ORDER BY sent_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      message: "Notifications retrieved successfully.",
      data: { notifications: result.rows },
    });
  } catch (error) {
    console.error("List notifications error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications.",
    });
  }
}

/**
 * GET /api/notifications/:id
 * Get a specific notification (owner or ADMIN only).
 */
export async function getNotificationById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format.",
      });
    }

    const result = await pool.query(
      `SELECT notification_id, user_id, event_id, message, "type", is_read, sent_at
       FROM notifications
       WHERE notification_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    const notification = result.rows[0];

    // Access check: Owner of the notification or ADMIN
    if (req.user.role !== "ADMIN" && String(notification.user_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own notifications.",
      });
    }

    return res.json({
      success: true,
      message: "Notification retrieved successfully.",
      data: { notification },
    });
  } catch (error) {
    console.error("Get notification by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notification.",
    });
  }
}

/**
 * POST /api/notifications
 * Create a new notification (used internally by application / authenticated routes).
 */
export async function createNotification(req, res) {
  try {
    const { user_id, message, type, event_id } = req.body;

    // Validation checks
    if (!user_id || !isValidId(String(user_id))) {
      return res.status(400).json({ success: false, message: "Valid user ID is required." });
    }
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }
    const allowedTypes = ["reminder", "update", "cancellation"];
    const normalizedType = type?.trim().toLowerCase();
    if (!normalizedType || !allowedTypes.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification type. Must be one of: ${allowedTypes.join(", ")}`,
      });
    }

    // Verify recipient user exists in database
    const userCheck = await pool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [user_id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Recipient user does not exist." });
    }

    // event_id is required
if (event_id === undefined || event_id === null) {
  return res.status(400).json({
    success: false,
    message: "Event ID is required.",
  });
}

// Validate event_id format
if (!isValidId(String(event_id))) {
  return res.status(400).json({
    success: false,
    message: "Invalid event ID format.",
  });
}

// Verify event exists
const eventExists = await pool.query(
  "SELECT 1 FROM events WHERE event_id = $1",
  [event_id]
);

if (eventExists.rowCount === 0) {
  return res.status(404).json({
    success: false,
    message: "Event not found.",
  });
}

    // Insert notification
    const result = await pool.query(
      `INSERT INTO notifications (user_id, message, "type", event_id)
       VALUES ($1, $2, $3, $4)
       RETURNING notification_id, user_id, event_id, message, "type", is_read, sent_at`,
      [user_id, message.trim(), normalizedType, event_id ?? null]
    );

    const notification = result.rows[0];

    // Emit real-time notification via Socket.IO
    sendNotificationToUser(user_id, notification);

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: { notification },
    });
  } catch (error) {
    console.error("Create notification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create notification.",
    });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a specific notification as read (notification owner only).
 */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format.",
      });
    }

    // Fetch existing notification to verify existence and check ownership
    const notificationResult = await pool.query(
      "SELECT user_id FROM notifications WHERE notification_id = $1",
      [id]
    );

    if (notificationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    const notification = notificationResult.rows[0];

    // Owner authorization only
    if (String(notification.user_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only mark your own notifications as read.",
      });
    }

    const updateResult = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE notification_id = $1
       RETURNING notification_id, user_id, event_id, message, "type", is_read, sent_at`,
      [id]
    );

    return res.json({
      success: true,
      message: "Notification marked as read successfully.",
      data: { notification: updateResult.rows[0] },
    });
  } catch (error) {
    console.error("Mark notification as read error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
}

/**
 * DELETE /api/notifications/:id
 * Delete a specific notification (owner or ADMIN only).
 */
export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format.",
      });
    }

    // Retrieve notification to check existence and owner/admin authorization
    const result = await pool.query(
      "SELECT user_id FROM notifications WHERE notification_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    const notification = result.rows[0];

    // Authorization: owner or ADMIN
    if (req.user.role !== "ADMIN" && String(notification.user_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own notifications.",
      });
    }

    // Execute delete
    await pool.query("DELETE FROM notifications WHERE notification_id = $1", [id]);

    return res.json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
}
