import { Router } from "express";
import { authenticate } from "../app.js";
import {
  listPayments,
  getUserPayments,
  createPayment,
  updatePaymentStatus,
} from "../controllers/payment.controller.js";

const router = Router();

// All payment routes require authentication
router.use(authenticate);

router.get("/", listPayments);
router.get("/user/:userId", getUserPayments);
router.post("/", createPayment);
router.patch("/:id/status", updatePaymentStatus);

export default router;
