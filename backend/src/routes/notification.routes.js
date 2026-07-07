import { Router } from "express";
import { authenticate } from "../app.js";
import {
  listNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

// All notification routes require authentication
router.use(authenticate);

router.get("/", listNotifications);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
