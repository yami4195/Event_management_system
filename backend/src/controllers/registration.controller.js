import pool from "../config/db.js";
import { validate as isUuid } from "uuid";

// Helper to validate UUID-based IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);

const VALID_REGISTRATION_STATUSES = ["confirmed", "cancelled", "pending"];

/**
 * Parse composite registration ID in formats: "userId_eventId" or "userId:eventId"
 * or default to logged-in user + eventId if single UUID.
 */
function parseCompositeId(id, loggedInUserId) {
  if (id.includes("_")) {
    const parts = id.split("_");
    if (parts.length === 2 && isValidId(parts[0]) && isValidId(parts[1])) {
      return { userId: parts[0], eventId: parts[1] };
    }
  } else if (id.includes(":")) {
    const parts = id.split(":");
    if (parts.length === 2 && isValidId(parts[0]) && isValidId(parts[1])) {
      return { userId: parts[0], eventId: parts[1] };
    }
  } else if (isValidId(id)) {
    return { userId: loggedInUserId, eventId: id };
  }
  return null;
}

/**
 * POST /api/registrations
 * Authenticated – register the logged-in user for an event.
 */
export async function createRegistration(req, res) {
  try {
    const { event_id } = req.body;
    const userId = req.user.id;

    if (!event_id || !isValidId(String(event_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid event ID is required.",
      });
    }

    // Verify event exists
    const eventCheck = await pool.query(
      "SELECT event_id, title, date, capacity, status FROM events WHERE event_id = $1",
      [event_id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = eventCheck.rows[0];

    // Verify event date has not passed
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot register for an event in the past.",
      });
    }

    // Check if event is cancelled
    if (event.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot register for a cancelled event.",
      });
    }

    // Check if user is already registered for this event
    const existingCheck = await pool.query(
      "SELECT status FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, event_id]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `You are already registered for this event (status: ${existingCheck.rows[0].status}).`,
      });
    }

    // Check capacity
    const activeCountCheck = await pool.query(
      "SELECT COUNT(*) FROM registrations WHERE event_id = $1 AND status != 'cancelled'",
      [event_id]
    );
    const activeCount = parseInt(activeCountCheck.rows[0].count, 10);

    if (event.capacity !== null && event.capacity !== undefined && activeCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event capacity has been exceeded.",
      });
    }

    // Insert registration (status defaults to 'confirmed')
    const result = await pool.query(
      `INSERT INTO registrations (user_id, event_id, status)
       VALUES ($1, $2, 'confirmed')
       RETURNING user_id, event_id, status, registration_date`,
      [userId, event_id]
    );

    return res.status(201).json({
      success: true,
      message: "Registration created successfully.",
      data: { registration: result.rows[0] },
    });
  } catch (error) {
    console.error("Create registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create registration.",
    });
  }
}

/**
 * GET /api/registrations
 * Admin only – return all registrations.
 */
export async function listAllRegistrations(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { event, user, status } = req.query;

    const conditions = [];
    const values = [];

    if (event) {
      if (!isValidId(String(event))) {
        return res.status(400).json({ success: false, message: "Invalid event ID format." });
      }
      values.push(event);
      conditions.push(`r.event_id = $${values.length}`);
    }

    if (user) {
      if (!isValidId(String(user))) {
        return res.status(400).json({ success: false, message: "Invalid user ID format." });
      }
      values.push(user);
      conditions.push(`r.user_id = $${values.length}`);
    }

    if (status) {
      const normalizedStatus = status.trim().toLowerCase();
      if (!VALID_REGISTRATION_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Must be one of: ${VALID_REGISTRATION_STATUSES.join(", ")}.`,
        });
      }
      values.push(normalizedStatus);
      conditions.push(`r.status = $${values.length}`);
    }

    let queryText = `
      SELECT r.user_id, r.event_id, r.registration_date, r.status, r.cancelled_at,
             CONCAT(u.firstname, ' ', u.lastname) AS user_name, u.email AS user_email, e.title AS event_title
      FROM registrations r
      JOIN users u ON r.user_id = u.user_id
      JOIN events e ON r.event_id = e.event_id
    `;

    if (conditions.length > 0) {
      queryText += " WHERE " + conditions.join(" AND ");
    }

    queryText += " ORDER BY r.registration_date DESC";

    const result = await pool.query(queryText, values);

    return res.json({
      success: true,
      message: "Registrations retrieved successfully.",
      data: { registrations: result.rows },
    });
  } catch (error) {
    console.error("List registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve registrations.",
    });
  }
}

/**
 * GET /api/registrations/my
 * Authenticated – return registrations of the logged-in user.
 */
export async function getMyRegistrations(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT r.user_id, r.event_id, r.registration_date, r.status, r.cancelled_at,
              e.title AS event_title, e.date AS event_date, e.time AS event_time, e.location AS event_location
       FROM registrations r
       JOIN events e ON r.event_id = e.event_id
       WHERE r.user_id = $1
       ORDER BY r.registration_date DESC`,
      [userId]
    );

    return res.json({
      success: true,
      message: "Your registrations retrieved successfully.",
      data: { registrations: result.rows },
    });
  } catch (error) {
    console.error("Get my registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve registration history.",
    });
  }
}

/**
 * GET /api/events/:id/registrations
 * Admin & Event Organizer only – returns all registrations for a specific event.
 */
export async function getEventRegistrations(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    // Verify event exists and check organizer ownership
    const eventCheck = await pool.query(
      "SELECT event_id, organizer_id FROM events WHERE event_id = $1",
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = eventCheck.rows[0];

    // Authorization: Admin or Event Organizer
    if (req.user.role !== "ADMIN" && String(event.organizer_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and the event organizer can view registrations.",
      });
    }

    const result = await pool.query(
      `SELECT r.user_id, r.event_id, r.registration_date, r.status, r.cancelled_at,
              CONCAT(u.firstname, ' ', u.lastname) AS user_name, u.email AS user_email
       FROM registrations r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.event_id = $1
       ORDER BY r.registration_date DESC`,
      [id]
    );

    return res.json({
      success: true,
      message: "Event registrations retrieved successfully.",
      data: { registrations: result.rows },
    });
  } catch (error) {
    console.error("Get event registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve registrations.",
    });
  }
}

/**
 * PATCH /api/registrations/:id/status
 * Admin & Event Organizer (if they own the event) only – update registration status.
 */
export async function updateRegistrationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const normalizedStatus = status.trim().toLowerCase();
    if (!VALID_REGISTRATION_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_REGISTRATION_STATUSES.join(", ")}.`,
      });
    }

    // Parse composite registration identifier
    const target = parseCompositeId(id, req.user.id);
    if (!target) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format. Use format 'userId_eventId' or 'userId:eventId'.",
      });
    }

    // Retrieve registration details
    const registrationResult = await pool.query(
      `SELECT r.user_id, r.event_id, r.status, e.organizer_id
       FROM registrations r
       JOIN events e ON r.event_id = e.event_id
       WHERE r.user_id = $1 AND r.event_id = $2`,
      [target.userId, target.eventId]
    );

    if (registrationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    const registration = registrationResult.rows[0];

    // Authorization: Admin or Event Organizer
    if (req.user.role !== "ADMIN" && String(registration.organizer_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and the event organizer can update registration status.",
      });
    }

    // Update registration status
    const cancelledAt = normalizedStatus === "cancelled" ? new Date() : null;

    const result = await pool.query(
      `UPDATE registrations
       SET status = $1, cancelled_at = $2
       WHERE user_id = $3 AND event_id = $4
       RETURNING user_id, event_id, status, registration_date, cancelled_at`,
      [normalizedStatus, cancelledAt, target.userId, target.eventId]
    );

    return res.json({
      success: true,
      message: "Registration status updated successfully.",
      data: { registration: result.rows[0] },
    });
  } catch (error) {
    console.error("Update registration status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update registration status.",
    });
  }
}

/**
 * DELETE /api/registrations/:id
 * Authenticated – user cancels own registration; admin deletes any registration.
 */
export async function deleteRegistration(req, res) {
  try {
    const { id } = req.params;

    // Parse composite registration identifier
    const target = parseCompositeId(id, req.user.id);
    if (!target) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format.",
      });
    }

    // Retrieve registration details
    const registrationResult = await pool.query(
      "SELECT user_id, event_id, status FROM registrations WHERE user_id = $1 AND event_id = $2",
      [target.userId, target.eventId]
    );

    if (registrationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // Authorization: logged-in user owns it, or admin
    if (req.user.role !== "ADMIN" && String(target.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only cancel your own registrations.",
      });
    }

    // Execute deletion
    await pool.query(
      "DELETE FROM registrations WHERE user_id = $1 AND event_id = $2",
      [target.userId, target.eventId]
    );

    return res.json({
      success: true,
      message: "Registration cancelled and removed successfully.",
    });
  } catch (error) {
    console.error("Delete registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete registration.",
    });
  }
}
