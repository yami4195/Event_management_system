import pool from "../config/db.js";
import { validate as isUuid } from "uuid";

const isValidId = (id) => typeof id === "string" && isUuid(id);

async function getEventOr404(eventId) {
  const result = await pool.query(
    "SELECT event_id, organizer_id FROM events WHERE event_id = $1",
    [eventId]
  );
  return result.rows[0] || null;
}

function canManageEventImages(user, event) {
  return user.role === "ADMIN" || String(event.organizer_id) === String(user.id);
}

/**
 * GET /api/events/:id/images
 * Public endpoint – list all images for an event.
 */
export async function getEventImages(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    const event = await getEventOr404(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const result = await pool.query(
      `SELECT image_id, event_id, image_url, caption, uploaded_at
       FROM event_images
       WHERE event_id = $1
       ORDER BY uploaded_at DESC`,
      [id]
    );

    return res.json({
      success: true,
      message: "Event images retrieved successfully.",
      data: {
        images: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error("Get event images error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event images.",
    });
  }
}

/**
 * GET /api/events/:id/images/:imageId
 * Public endpoint – get a single event image.
 */
export async function getEventImageById(req, res) {
  try {
    const { id, imageId } = req.params;

    if (!isValidId(id) || !isValidId(imageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event or image ID format.",
      });
    }

    const event = await getEventOr404(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const result = await pool.query(
      `SELECT image_id, event_id, image_url, caption, uploaded_at
       FROM event_images
       WHERE image_id = $1 AND event_id = $2`,
      [imageId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event image not found.",
      });
    }

    return res.json({
      success: true,
      message: "Event image retrieved successfully.",
      data: { image: result.rows[0] },
    });
  } catch (error) {
    console.error("Get event image error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event image.",
    });
  }
}

/**
 * POST /api/events/:id/images
 * Authenticated – add an image to an event (event owner or admin).
 */
export async function addEventImage(req, res) {
  try {
    const { id } = req.params;
    const { image_url, caption } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    if (!image_url?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required.",
      });
    }

    const event = await getEventOr404(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!canManageEventImages(req.user, event)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only add images to your own events.",
      });
    }

    const result = await pool.query(
      `INSERT INTO event_images (event_id, image_url, caption)
       VALUES ($1, $2, $3)
       RETURNING image_id, event_id, image_url, caption, uploaded_at`,
      [id, image_url.trim(), caption ? caption.trim() : null]
    );

    return res.status(201).json({
      success: true,
      message: "Event image added successfully.",
      data: { image: result.rows[0] },
    });
  } catch (error) {
    console.error("Add event image error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add event image.",
    });
  }
}

/**
 * PUT /api/events/:id/images/:imageId
 * Authenticated – update an event image (event owner or admin).
 */
export async function updateEventImage(req, res) {
  try {
    const { id, imageId } = req.params;
    const { image_url, caption } = req.body;

    if (!isValidId(id) || !isValidId(imageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event or image ID format.",
      });
    }

    const event = await getEventOr404(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!canManageEventImages(req.user, event)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update images for your own events.",
      });
    }

    const existing = await pool.query(
      "SELECT image_id, image_url, caption FROM event_images WHERE image_id = $1 AND event_id = $2",
      [imageId, id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event image not found.",
      });
    }

    const image = existing.rows[0];

    if (image_url !== undefined && !image_url?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image URL cannot be empty.",
      });
    }

    const finalImageUrl = image_url !== undefined ? image_url.trim() : image.image_url;
    const finalCaption =
      caption !== undefined ? (caption ? caption.trim() : null) : image.caption;

    const result = await pool.query(
      `UPDATE event_images
       SET image_url = $1, caption = $2
       WHERE image_id = $3 AND event_id = $4
       RETURNING image_id, event_id, image_url, caption, uploaded_at`,
      [finalImageUrl, finalCaption, imageId, id]
    );

    return res.json({
      success: true,
      message: "Event image updated successfully.",
      data: { image: result.rows[0] },
    });
  } catch (error) {
    console.error("Update event image error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update event image.",
    });
  }
}

/**
 * DELETE /api/events/:id/images/:imageId
 * Authenticated – delete an event image (event owner or admin).
 */
export async function deleteEventImage(req, res) {
  try {
    const { id, imageId } = req.params;

    if (!isValidId(id) || !isValidId(imageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event or image ID format.",
      });
    }

    const event = await getEventOr404(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!canManageEventImages(req.user, event)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete images from your own events.",
      });
    }

    const existing = await pool.query(
      "SELECT image_id FROM event_images WHERE image_id = $1 AND event_id = $2",
      [imageId, id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event image not found.",
      });
    }

    await pool.query("DELETE FROM event_images WHERE image_id = $1 AND event_id = $2", [
      imageId,
      id,
    ]);

    return res.json({
      success: true,
      message: "Event image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event image error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event image.",
    });
  }
}
