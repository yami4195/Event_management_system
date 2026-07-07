import { Router } from "express";
import { authenticate } from "../app.js";
import {
  submitFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const router = Router();

// All feedback CRUD routes require authentication
router.use(authenticate);

router.post("/", submitFeedback);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;
