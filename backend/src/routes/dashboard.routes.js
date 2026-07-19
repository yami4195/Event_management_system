import { Router } from "express";
import { authenticate } from "../app.js";
import {
  getDashboardStats,
  getDashboardActivity,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(authenticate);
router.get("/stats", getDashboardStats);
router.get("/activity", getDashboardActivity);

export default router;
