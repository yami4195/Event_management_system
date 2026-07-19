import pool from "../config/db.js";

/**
 * GET /api/dashboard/stats
 * Role-aware dashboard metrics for the authenticated user.
 */
export async function getDashboardStats(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "ORGANIZER" || role === "ADMIN") {
      const statsResult = await pool.query(
        `SELECT
           COUNT(*)::int AS total_events,
           COUNT(*) FILTER (WHERE status IN ('upcoming', 'ongoing'))::int AS published_events,
           COUNT(*) FILTER (WHERE status = 'upcoming')::int AS upcoming_events,
           COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled_events,
           COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_events,
           COALESCE((
             SELECT COUNT(*)::int
             FROM registrations r
             JOIN events e ON e.event_id = r.event_id
             WHERE e.organizer_id = $1 AND r.status != 'cancelled'
           ), 0) AS total_registrations
         FROM events
         WHERE organizer_id = $1`,
        [userId]
      );

      const row = statsResult.rows[0];

      return res.json({
        success: true,
        data: {
          role,
          totalEvents: row.total_events,
          publishedEvents: row.published_events,
          draftEvents: 0,
          cancelledEvents: row.cancelled_events,
          completedEvents: row.completed_events,
          upcomingEvents: row.upcoming_events,
          totalRegistrations: row.total_registrations,
          registeredEvents: 0,
          unreadNotifications: 0,
        },
      });
    }

    // Customer / default
    const [regStats, notifStats] = await Promise.all([
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE r.status != 'cancelled')::int AS registered_events,
           COUNT(*) FILTER (
             WHERE r.status != 'cancelled' AND e.status = 'upcoming' AND e.date >= CURRENT_DATE
           )::int AS upcoming_events,
           COUNT(*) FILTER (
             WHERE r.status != 'cancelled' AND (e.status = 'completed' OR e.date < CURRENT_DATE)
           )::int AS completed_events
         FROM registrations r
         JOIN events e ON e.event_id = r.event_id
         WHERE r.user_id = $1`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*)::int AS unread
         FROM notifications
         WHERE user_id = $1 AND (is_read = false OR is_read IS NULL)`,
        [userId]
      ).catch(() => ({ rows: [{ unread: 0 }] })),
    ]);

    const regs = regStats.rows[0];
    const unread = notifStats.rows[0]?.unread ?? 0;

    return res.json({
      success: true,
      data: {
        role,
        totalEvents: 0,
        publishedEvents: 0,
        draftEvents: 0,
        cancelledEvents: 0,
        completedEvents: regs.completed_events,
        upcomingEvents: regs.upcoming_events,
        totalRegistrations: 0,
        registeredEvents: regs.registered_events,
        unreadNotifications: unread,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics.",
    });
  }
}

/**
 * GET /api/dashboard/activity
 * Recent activity feed tailored to the authenticated user's role.
 */
export async function getDashboardActivity(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    if (role === "ORGANIZER" || role === "ADMIN") {
      const result = await pool.query(
        `SELECT * FROM (
           SELECT
             r.user_id::text || '_' || r.event_id::text AS id,
             'REGISTRATION' AS type,
             CONCAT(u.firstname, ' ', u.lastname, ' registered for "', e.title, '"') AS message,
             r.registration_date AS date
           FROM registrations r
           JOIN events e ON e.event_id = r.event_id
           JOIN users u ON u.user_id = r.user_id
           WHERE e.organizer_id = $1 AND r.status != 'cancelled'

           UNION ALL

           SELECT
             e.event_id::text AS id,
             'EVENT_UPDATE' AS type,
             CONCAT('Event "', e.title, '" is ', e.status) AS message,
             e.created_at AS date
           FROM events e
           WHERE e.organizer_id = $1
         ) activity
         ORDER BY date DESC
         LIMIT $2`,
        [userId, limit]
      );

      return res.json({
        success: true,
        data: result.rows.map((row) => ({
          id: row.id,
          type: row.type,
          message: row.message,
          date: row.date,
        })),
      });
    }

    const result = await pool.query(
      `SELECT * FROM (
         SELECT
           r.user_id::text || '_' || r.event_id::text AS id,
           'REGISTRATION' AS type,
           CONCAT('You registered for "', e.title, '"') AS message,
           r.registration_date AS date
         FROM registrations r
         JOIN events e ON e.event_id = r.event_id
         WHERE r.user_id = $1

         UNION ALL

         SELECT
           n.notification_id::text AS id,
           COALESCE(UPPER(n.type), 'NOTIFICATION') AS type,
           n.message,
           n.sent_at AS date
         FROM notifications n
         WHERE n.user_id = $1
       ) activity
       ORDER BY date DESC
       LIMIT $2`,
      [userId, limit]
    ).catch(async () => {
      // Fallback if notifications schema differs
      const fallback = await pool.query(
        `SELECT
           r.user_id::text || '_' || r.event_id::text AS id,
           'REGISTRATION' AS type,
           CONCAT('You registered for "', e.title, '"') AS message,
           r.registration_date AS date
         FROM registrations r
         JOIN events e ON e.event_id = r.event_id
         WHERE r.user_id = $1
         ORDER BY r.registration_date DESC
         LIMIT $2`,
        [userId, limit]
      );
      return fallback;
    });

    return res.json({
      success: true,
      data: (result.rows || []).map((row) => ({
        id: row.id,
        type: row.type,
        message: row.message,
        date: row.date,
      })),
    });
  } catch (error) {
    console.error("Dashboard activity error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard activity.",
    });
  }
}
