import pool from "../config/db.js";
import { validate as isUuid } from "uuid";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

// Helper to validate UUID-based IDs
const isValidId = (id) => typeof id === "string" && isUuid(id);
const EVENT_STATUSES = ["upcoming", "ongoing", "completed", "cancelled"];
const normalizeEventStatus = (status) => String(status).trim().toLowerCase();

/**
 * GET /api/events
 * Public endpoint to list events (supports filtering & searching)
 */
export async function listEvents(req, res) {
  try {
    const { category_id, status, date, search, page = 1, limit = 10 } = req.query;

    const pageNum = Number.isNaN(parseInt(page)) ? 1 : Math.max(parseInt(page), 1);
    const limitNum = Number.isNaN(parseInt(limit)) ? 10 : Math.min(Math.max(parseInt(limit), 1), 100);
    const offset = (pageNum - 1) * limitNum;



    const conditions = [];
    const values = [];

    if (category_id) {
      if (!isValidId(category_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category_id format.",
        });
      }
      values.push(category_id);
      conditions.push(`category_id = $${values.length}`);
    }

    if (status) {
      const normalizedStatus = normalizeEventStatus(status);
      if (!EVENT_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter value.",
        });
      }
      values.push(normalizedStatus);
      conditions.push(`status = $${values.length}`);
    }

    if (date) {
      // Validate date format (YYYY-MM-DD basic check)
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({
          success: false,
          message: "Invalid date filter format.",
        });
      }
      values.push(date);
      conditions.push(`date = $${values.length}`);
    }

    if (search?.trim()) {
      values.push(`%${search.trim()}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";
    // --- Count query (uses filters only, no limit/offset) ---
    const countQuery = `SELECT COUNT(*) FROM events${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = parseInt(countResult.rows[0].count);



    let queryText = `
      SELECT event_id, title, description, date, time, location, capacity, status, organizer_id, category_id, created_at,
             (
               SELECT ei.image_url
               FROM event_images ei
               WHERE ei.event_id = events.event_id
               ORDER BY ei.uploaded_at ASC, ei.image_id ASC
               LIMIT 1
             ) AS "imageUrl"
      FROM events ${whereClause}
      ORDER BY date ASC, time ASC
    `;

    values.push(limitNum, offset);
    queryText += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(queryText, values);

    return res.json({
      success: true,
      message: "Events retrieved successfully.",
      data: { events: result.rows },
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
      },
    });
  } catch (error) {
    console.error("List events error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve events.",
    });
  }
}

/**
 * GET /api/events/:id
 * Public endpoint to view a single event
 */
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    const result = await pool.query(
      `SELECT event_id, title, description, date, time, location, capacity, status, organizer_id, category_id, created_at,
              (
                SELECT ei.image_url
                FROM event_images ei
                WHERE ei.event_id = events.event_id
                ORDER BY ei.uploaded_at ASC, ei.image_id ASC
                LIMIT 1
              ) AS "imageUrl"
       FROM events 
       WHERE event_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.json({
      success: true,
      message: "Event retrieved successfully.",
      data: { event: result.rows[0] },
    });
  } catch (error) {
    console.error("Get event by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event.",
    });
  }
}

/**
 * POST /api/events
 * Create a new event (ORGANIZER or ADMIN)
 * Accepts multipart/form-data with an optional 'image' file field
 */
export async function createEvent(req, res) {
  try {
    // Role check: Admin or Organizer
    if (req.user.role !== "ADMIN" && req.user.role !== "ORGANIZER") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only organizers and administrators can create events.",
      });
    }

    const { title, description, date, time, location, capacity, status = "upcoming", category_id, organizer_id, price } = req.body;

    // Validation checks
    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }
    if (!category_id) {
      return res.status(400).json({ success: false, message: "Category ID is required." });
    }
    if (!isValidId(String(category_id))) {
      return res.status(400).json({ success: false, message: "Invalid category ID format." });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required." });
    }
    if (!time) {
      return res.status(400).json({ success: false, message: "Time is required." });
    }
    if (!location?.trim()) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }
    if (capacity === undefined) {
      return res.status(400).json({ success: false, message: "Capacity is required." });
    }

    // Capacity validation
    if (Number(capacity) < 0 || !Number.isInteger(Number(capacity))) {
      return res.status(400).json({ success: false, message: "Capacity cannot be negative." });
    }

    // Price validation if provided
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Price cannot be negative." });
    }

    // Date in past validation
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format." });
    }
    if (inputDate < today) {
      return res.status(400).json({ success: false, message: "Event date cannot be in the past." });
    }

    // Status validation
    const normalizedStatus = normalizeEventStatus(status);
    if (!EVENT_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Status must be one of: ${EVENT_STATUSES.join(", ")}.`,
      });
    }

    // Verify category exists
    const categoryCheck = await pool.query(
      "SELECT category_id FROM categories WHERE category_id = $1",
      [category_id]
    );
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Category does not exist." });
    }

    // Determine organizer
    const finalOrganizerId = (req.user.role === "ADMIN" && organizer_id) ? organizer_id : req.user.id;

    // Verify organizer exists if admin override
    if (req.user.role === "ADMIN" && organizer_id) {
      const organizerCheck = await pool.query(
        "SELECT user_id FROM users WHERE user_id = $1",
        [organizer_id]
      );
      if (organizerCheck.rows.length === 0) {
        return res.status(400).json({ success: false, message: "Organizer does not exist." });
      }
    }

    // Execute INSERT
    const result = await pool.query(
      `INSERT INTO events (title, description, date, time, location, capacity, status, organizer_id, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING event_id, title, description, date, time, location, capacity, status, organizer_id, category_id, created_at`,
      [
        title.trim(),
        description ? description.trim() : null,
        date,
        time,
        location.trim(),
        Number(capacity),
        normalizedStatus,
        finalOrganizerId,
        category_id,
      ]
    );

    const newEvent = result.rows[0];

    // If an image file was uploaded, upload to Cloudinary and save to event_images
    if (req.file) {
      try {
        const folder = `event_management/events/${newEvent.event_id}`;
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, folder);

        await pool.query(
          `INSERT INTO event_images (event_id, image_url, cloudinary_public_id, caption)
           VALUES ($1, $2, $3, $4)`,
          [newEvent.event_id, cloudinaryResult.url, cloudinaryResult.public_id, null]
        );
        newEvent.imageUrl = cloudinaryResult.url;
      } catch (uploadError) {
        console.error("Cloudinary upload error during event creation:", uploadError.message);
        // Event was created successfully, but image upload failed
        // Don't fail the whole request
      }
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: { event: newEvent },
    });
  } catch (error) {
    console.error("Create event error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create event.",
    });
  }
}

/**
 * PUT /api/events/:id
 * Update event information (Organizer owner or Admin)
 * Accepts multipart/form-data with an optional 'image' file field
 */
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    // Retrieve existing event
    const eventResult = await pool.query(
      `SELECT event_id, title, description, date, time, location, capacity, status, organizer_id, category_id 
       FROM events 
       WHERE event_id = $1`,
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = eventResult.rows[0];

    // Authorization check: Admin or event owner
    if (req.user.role !== "ADMIN" && String(event.organizer_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own events.",
      });
    }

    const { title, description, date, time, location, capacity, status, category_id, price } = req.body;

    // Field-level validations if provided
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, message: "Title cannot be empty." });
    }
    if (location !== undefined && !location.trim()) {
      return res.status(400).json({ success: false, message: "Location cannot be empty." });
    }

    if (category_id !== undefined) {
      if (!isValidId(String(category_id))) {
        return res.status(400).json({ success: false, message: "Invalid category ID format." });
      }
      const categoryCheck = await pool.query(
        "SELECT category_id FROM categories WHERE category_id = $1",
        [category_id]
      );
      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({ success: false, message: "Category does not exist." });
      }
    }

    if (capacity !== undefined && (Number(capacity) < 0 || !Number.isInteger(Number(capacity)))) {
      return res.status(400).json({ success: false, message: "Capacity cannot be negative." });
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Price cannot be negative." });
    }

    if (date !== undefined) {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(inputDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date format." });
      }
      if (inputDate < today) {
        return res.status(400).json({ success: false, message: "Event date cannot be in the past." });
      }
    }

    if (status !== undefined) {
      const normalizedStatus = normalizeEventStatus(status);
      if (!EVENT_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status value. Status must be one of: ${EVENT_STATUSES.join(", ")}.`,
        });
      }
    }

    // Merge updates
    const finalTitle = title !== undefined ? title.trim() : event.title;
    const finalDesc = description !== undefined ? (description ? description.trim() : null) : event.description;
    const finalDate = date !== undefined ? date : event.date;
    const finalTime = time !== undefined ? time : event.time;
    const finalLocation = location !== undefined ? location.trim() : event.location;
    const finalCapacity = capacity !== undefined ? Number(capacity) : event.capacity;
    const finalStatus = status !== undefined ? normalizeEventStatus(status) : event.status;
    const finalCategoryId = category_id !== undefined ? category_id : event.category_id;

    // Run UPDATE
    const updateResult = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, date = $3, time = $4, location = $5, capacity = $6, status = $7, category_id = $8
       WHERE event_id = $9
       RETURNING event_id, title, description, date, time, location, capacity, status, organizer_id, category_id, created_at`,
      [
        finalTitle,
        finalDesc,
        finalDate,
        finalTime,
        finalLocation,
        finalCapacity,
        finalStatus,
        finalCategoryId,
        id,
      ]
    );

    const updatedEvent = updateResult.rows[0];

    // Handle image update: if a new file was uploaded
    if (req.file) {
      try {
        // Delete old images from Cloudinary
        const oldImages = await pool.query(
          `SELECT cloudinary_public_id FROM event_images WHERE event_id = $1`,
          [id]
        );
        for (const row of oldImages.rows) {
          if (row.cloudinary_public_id) {
            await deleteFromCloudinary(row.cloudinary_public_id);
          }
        }

        // Remove old image records
        await pool.query(`DELETE FROM event_images WHERE event_id = $1`, [id]);

        // Upload new image to Cloudinary
        const folder = `event_management/events/${id}`;
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, folder);

        await pool.query(
          `INSERT INTO event_images (event_id, image_url, cloudinary_public_id, caption) VALUES ($1, $2, $3, $4)`,
          [id, cloudinaryResult.url, cloudinaryResult.public_id, null]
        );

        updatedEvent.imageUrl = cloudinaryResult.url;
      } catch (uploadError) {
        console.error("Cloudinary upload error during event update:", uploadError.message);
      }
    }

    return res.json({
      success: true,
      message: "Event updated successfully.",
      data: { event: updatedEvent },
    });
  } catch (error) {
    console.error("Update event error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update event.",
    });
  }
}

/**
 * DELETE /api/events/:id
 * Delete an event (Organizer owner or Admin)
 */
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    // Retrieve existing event
    const eventResult = await pool.query(
      "SELECT event_id, organizer_id FROM events WHERE event_id = $1",
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = eventResult.rows[0];

    // Authorization check: Admin or event owner
    if (req.user.role !== "ADMIN" && String(event.organizer_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own events.",
      });
    }

    // Clean up Cloudinary images before deleting the event
    const eventImages = await pool.query(
      `SELECT cloudinary_public_id FROM event_images WHERE event_id = $1`,
      [id]
    );
    for (const row of eventImages.rows) {
      if (row.cloudinary_public_id) {
        await deleteFromCloudinary(row.cloudinary_public_id);
      }
    }

    // Execute delete (cascade should handle event_images rows)
    await pool.query("DELETE FROM events WHERE event_id = $1", [id]);

    return res.json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
}

/**
 * PATCH /api/events/:id/status
 * Change event status (Organizer owner or Admin)
 */
export async function updateEventStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const normalizedStatus = normalizeEventStatus(status);
    if (!EVENT_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Status must be one of: ${EVENT_STATUSES.join(", ")}.`,
      });
    }

    // Retrieve existing event
    const eventResult = await pool.query(
      "SELECT event_id, organizer_id FROM events WHERE event_id = $1",
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = eventResult.rows[0];

    // Authorization check: Admin or event owner
    if (req.user.role !== "ADMIN" && String(event.organizer_id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only change status of your own events.",
      });
    }

    // Run UPDATE
    const updateResult = await pool.query(
      `UPDATE events
       SET status = $1
       WHERE event_id = $2
       RETURNING event_id, title, description, date, time, location, capacity, status, organizer_id, category_id, created_at`,
      [normalizedStatus, id]
    );

    return res.json({
      success: true,
      message: `Event status updated to ${normalizedStatus} successfully.`,
      data: { event: updateResult.rows[0] },
    });
  } catch (error) {
    console.error("Update event status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update event status.",
    });
  }
}
