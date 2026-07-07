import pool from "../config/db.js";
import { validate as isUuid } from "uuid";

// Helper to validate UUID-based IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);

const VALID_PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED"];

/**
 * GET /api/payments
 * Admin only – list all payments with optional filtering and pagination.
 */
export async function listPayments(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { status, user_id, event_id, date, page, limit } = req.query;

    const conditions = [];
    const values = [];

    if (status) {
      const normalizedStatus = status.trim().toUpperCase();
      if (!VALID_PAYMENT_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}.`,
        });
      }
      values.push(normalizedStatus);
      conditions.push(`p.payment_status = $${values.length}`);
    }

    if (user_id) {
      if (!isValidId(String(user_id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format.",
        });
      }
      values.push(user_id);
      conditions.push(`p.user_id = $${values.length}`);
    }

    if (event_id) {
      if (!isValidId(String(event_id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid event ID format.",
        });
      }
      values.push(event_id);
      conditions.push(`p.event_id = $${values.length}`);
    }

    if (date) {
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({
          success: false,
          message: "Invalid date filter format.",
        });
      }
      values.push(date);
      conditions.push(`DATE(p.paid_at) = $${values.length}`);
    }

    let queryText = `
      SELECT p.payment_id, p.user_id, p.event_id, p.amount, p.payment_method,
             p.transaction_reference, p.payment_status, p.paid_at,
             CONCAT(u.firstname, ' ', u.lastname) AS user_name, e.title AS event_title
      FROM payments p
      JOIN users u ON p.user_id = u.user_id
      JOIN events e ON p.event_id = e.event_id
    `;

    if (conditions.length > 0) {
      queryText += " WHERE " + conditions.join(" AND ");
    }

    queryText += " ORDER BY p.paid_at DESC NULLS LAST";

    // Pagination
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const offset = (pageNum - 1) * pageLimit;

    values.push(pageLimit);
    queryText += ` LIMIT $${values.length}`;

    values.push(offset);
    queryText += ` OFFSET $${values.length}`;

    const result = await pool.query(queryText, values);

    return res.json({
      success: true,
      message: "Payments retrieved successfully.",
      data: {
        payments: result.rows,
        page: pageNum,
        limit: pageLimit,
      },
    });
  } catch (error) {
    console.error("List payments error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payments.",
    });
  }
}

/**
 * GET /api/payments/user/:userId
 * Authenticated – users can view own payments; admins can view anyone's.
 */
export async function getUserPayments(req, res) {
  try {
    const { userId } = req.params;

    if (!isValidId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    // Authorization: own payments or admin
    if (req.user.role !== "ADMIN" && String(req.user.id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own payments.",
      });
    }

    const result = await pool.query(
      `SELECT p.payment_id, p.user_id, p.event_id, p.amount, p.payment_method,
              p.transaction_reference, p.payment_status, p.paid_at,
              e.title AS event_title
       FROM payments p
       JOIN events e ON p.event_id = e.event_id
       WHERE p.user_id = $1
       ORDER BY p.paid_at DESC NULLS LAST`,
      [userId]
    );

    return res.json({
      success: true,
      message: "Payment history retrieved successfully.",
      data: { payments: result.rows },
    });
  } catch (error) {
    console.error("Get user payments error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment history.",
    });
  }
}

/**
 * POST /api/payments
 * Authenticated – create a payment for an event registration.
 */
export async function createPayment(req, res) {
  try {
    const { event_id, amount, payment_method, transaction_reference } = req.body;
    const userId = req.user.id;

    // Validate event_id
    if (!event_id || !isValidId(String(event_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid event ID is required.",
      });
    }

    // Validate amount
    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
      });
    }
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a non-negative number.",
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

    // Verify registration exists for user + event
    const registrationCheck = await pool.query(
      "SELECT user_id FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, event_id]
    );
    if (registrationCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No registration found for this event. Register first before making a payment.",
      });
    }

    // Prevent duplicate successful/pending payments for same user + event
    const duplicateCheck = await pool.query(
      "SELECT payment_id FROM payments WHERE user_id = $1 AND event_id = $2 AND payment_status IN ('PENDING', 'SUCCESS')",
      [userId, event_id]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A payment already exists for this event registration.",
      });
    }

    // Insert payment (default status is PENDING from DB schema)
    const result = await pool.query(
      `INSERT INTO payments (user_id, event_id, amount, payment_method, transaction_reference)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING payment_id, user_id, event_id, amount, payment_method, transaction_reference, payment_status, paid_at`,
      [
        userId,
        event_id,
        parsedAmount,
        payment_method ? payment_method.trim() : null,
        transaction_reference ? transaction_reference.trim() : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Payment created successfully.",
      data: { payment: result.rows[0] },
    });
  } catch (error) {
    console.error("Create payment error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment.",
    });
  }
}

/**
 * PATCH /api/payments/:id/status
 * Admin only – update payment status to SUCCESS or FAILED.
 */
export async function updatePaymentStatus(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const normalizedStatus = status.trim().toUpperCase();
    const allowedTransitions = ["SUCCESS", "FAILED"];
    if (!allowedTransitions.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedTransitions.join(", ")}.`,
      });
    }

    // Verify payment exists
    const existing = await pool.query(
      "SELECT payment_id, payment_status FROM payments WHERE payment_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    // Update status and set paid_at timestamp when marking as SUCCESS
    const paidAt = normalizedStatus === "SUCCESS" ? new Date() : existing.rows[0].paid_at;

    const result = await pool.query(
      `UPDATE payments
       SET payment_status = $1, paid_at = $2
       WHERE payment_id = $3
       RETURNING payment_id, user_id, event_id, amount, payment_method, transaction_reference, payment_status, paid_at`,
      [normalizedStatus, paidAt, id]
    );

    return res.json({
      success: true,
      message: `Payment status updated to ${normalizedStatus} successfully.`,
      data: { payment: result.rows[0] },
    });
  } catch (error) {
    console.error("Update payment status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
    });
  }
}
