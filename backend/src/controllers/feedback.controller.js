import pool from "../config/db.js";
import { validate as isUuid } from "uuid";

// Helper to validate UUID-based IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);

/**
 * GET /api/events/:id/feedback
 * Public endpoint – returns all feedback for a given event, including average rating.
 */
export async function getEventFeedback(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    // Verify the event exists
    const eventCheck = await pool.query(
      "SELECT event_id FROM events WHERE event_id = $1",
      [id]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const result = await pool.query(
      `SELECT f.feedback_id, f.rating, f.comment, f.submitted_at,
              CONCAT(u.firstname, ' ', u.lastname) AS user_name
       FROM feedback f
       JOIN users u ON f.user_id = u.user_id
       WHERE f.event_id = $1
       ORDER BY f.submitted_at DESC`,
      [id]
    );

    // Compute average rating in application layer
    let averageRating = null;
    if (result.rows.length > 0) {
      const sum = result.rows.reduce((acc, row) => acc + row.rating, 0);
      averageRating = parseFloat((sum / result.rows.length).toFixed(2));
    }

    return res.json({
      success: true,
      message: "Feedback retrieved successfully.",
      data: {
        feedback: result.rows,
        averageRating,
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error("Get event feedback error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve feedback.",
    });
  }
}

/**
 * POST /api/feedback
 * Authenticated – submit feedback for an event.
 * Rules: user must have a confirmed registration; no duplicate feedback allowed.
 */
export async function submitFeedback(req, res) {
  try {
    const { event_id, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate event_id
    if (!event_id || !isValidId(String(event_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid event ID is required.",
      });
    }

    // Validate rating (required, integer, 1–5)
    if (rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        message: "Rating is required.",
      });
    }
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
    }

    // Verify event exists
    const eventCheck = await pool.query(
      "SELECT event_id FROM events WHERE event_id = $1",
      [event_id]
    );
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Verify user has a confirmed registration for this event
    const registrationCheck = await pool.query(
      "SELECT user_id FROM registrations WHERE user_id = $1 AND event_id = $2 AND status = 'confirmed'",
      [userId, event_id]
    );
    if (registrationCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You must be a confirmed participant of this event to submit feedback.",
      });
    }

    // Prevent duplicate feedback for the same event
    const duplicateCheck = await pool.query(
      "SELECT feedback_id FROM feedback WHERE user_id = $1 AND event_id = $2",
      [userId, event_id]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted feedback for this event.",
      });
    }

    // Insert feedback
    const result = await pool.query(
      `INSERT INTO feedback (user_id, event_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING feedback_id, user_id, event_id, rating, comment, submitted_at`,
      [userId, event_id, parsedRating, comment ? comment.trim() : null]
    );

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: { feedback: result.rows[0] },
    });
  } catch (error) {
    console.error("Submit feedback error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback.",
    });
  }
}

/**
 * PUT /api/feedback/:id
 * Authenticated – update own feedback (rating and/or comment).
 */
export async function updateFeedback(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID format.",
      });
    }

    // Retrieve existing feedback
    const existing = await pool.query(
      "SELECT feedback_id, user_id, rating, comment FROM feedback WHERE feedback_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    const feedback = existing.rows[0];

    // Authorization: owner only
    if (String(feedback.user_id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own feedback.",
      });
    }

    // Validate rating if provided
    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be an integer between 1 and 5.",
        });
      }
    }

    const finalRating = rating !== undefined ? Number(rating) : feedback.rating;
    const finalComment =
      comment !== undefined ? (comment ? comment.trim() : null) : feedback.comment;

    const result = await pool.query(
      `UPDATE feedback
       SET rating = $1, comment = $2
       WHERE feedback_id = $3
       RETURNING feedback_id, user_id, event_id, rating, comment, submitted_at`,
      [finalRating, finalComment, id]
    );

    return res.json({
      success: true,
      message: "Feedback updated successfully.",
      data: { feedback: result.rows[0] },
    });
  } catch (error) {
    console.error("Update feedback error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update feedback.",
    });
  }
}

/**
 * DELETE /api/feedback/:id
 * Authenticated – delete own feedback.
 */
export async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID format.",
      });
    }

    // Retrieve existing feedback to verify existence and ownership
    const existing = await pool.query(
      "SELECT feedback_id, user_id FROM feedback WHERE feedback_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    const feedback = existing.rows[0];

    // Authorization: owner only
    if (String(feedback.user_id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own feedback.",
      });
    }

    await pool.query("DELETE FROM feedback WHERE feedback_id = $1", [id]);

    return res.json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error("Delete feedback error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback.",
    });
  }
}
