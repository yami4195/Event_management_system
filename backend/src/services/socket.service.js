import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io = null;

/**
 * Initializes the Socket.IO server.
 * Sets up CORS, handshake JWT authentication, and connection/room management.
 * 
 * @param {import("http").Server} server - The HTTP server instance.
 * @returns {import("socket.io").Server} The initialized Socket.IO server instance.
 */
export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production as needed
      methods: ["GET", "POST"],
    },
  });

  // Authentication Middleware for Handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_change_in_production";
      const decoded = jwt.verify(token, JWT_SECRET);
      // Attach user info to socket
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`Socket connected: User ID ${userId} (Socket ID: ${socket.id})`);

    // Assign socket to a user-specific room
    socket.join(`user_${userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: User ID ${userId} (Socket ID: ${socket.id})`);
    });
  });

  return io;
}

/**
 * Sends a real-time notification to a specific user.
 * 
 * @param {string|number} userId - The ID of the recipient user.
 * @param {object} notification - The notification payload.
 * @returns {boolean} True if sent successfully, false otherwise.
 */
export function sendNotificationToUser(userId, notification) {
  console.log(`[SOCKET EMIT] io initialized: ${!!io}`);
  console.log(`[SOCKET EMIT] Targeting room: user_${userId}`);
  if (io) {
    const room = io.sockets.adapter.rooms.get(`user_${userId}`);
    console.log(`[SOCKET EMIT] Sockets in room user_${userId}:`, room ? room.size : 0);
    io.to(`user_${userId}`).emit("notification", notification);
    console.log(`[SOCKET EMIT] Emitted to user_${userId}`);
    return true;
  }
  console.warn(`[SOCKET EMIT] io is null - socket server not initialized!`);
  return false;
}
